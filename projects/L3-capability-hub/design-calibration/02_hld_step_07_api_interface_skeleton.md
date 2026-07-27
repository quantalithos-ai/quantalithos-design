# L3-capability-hub 02 概要 Step 7: API / 接口骨架

> 创建日期: 2026-07-09
> 状态: completed_wait_user_review
> 当前模式: full-restart
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 正式文档目标: `projects/L3-capability-hub/02-概要设计.md`
> 本轮口径: 从 Step 5 的 8 个主要组成部分和 Step 6 的 43 个关键对象推导正式接口骨架;本步只点名 Command / Query / Inbound Event Consumer / Outbound Event / Operations Job / external port 的概要级主语、输入输出骨架和边界,不写 HTTP path、RPC method、DTO schema、event payload、repository trait、adapter 实现、错误码、事务或测试。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 7 API / 接口骨架 |
| 输出文件 | `design-calibration/02_hld_step_07_api_interface_skeleton.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/02_hld_calibration_flow.md` |
| 已读取前序 Step | yes:`02_hld_step_01_upstream_boundary.md`;`02_hld_step_02_goals_scope.md`;`02_hld_step_03_constraints.md`;`02_hld_step_04_code_subject_framework.md`;`02_hld_step_05_components_boundary.md`;`02_hld_step_06_key_objects.md` |
| 已读取 SOP / 书写规范 | yes:`概要设计讨论流程_SOP.md` Step 7;`概要设计书写规范.md` §4.7;`设计文档讨论中间产物规范.md` |
| 已读取正式输入 | yes:`00-需求文档.md`;`01-架构设计.md` |
| 已读取参考粒度 | yes:`L1-governance` / `L3-method-library` 的 `02` Step 7 中间产物 |
| 旧材料处理 | 旧 `02-概要设计.md`、旧 `03-详细设计.md` 和 README 只作后置差异审计 |
| 进入条件 | pass:Step 6 已完成且用户确认进入 Step 7 |
| next_allowed_action | Step 7 已完成,等待用户确认后进入 Step 8 `关键处理流 / 重要函数数据流`。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入接口分类与候选池。 |
| 接口分类与候选池:先思考 | done | Command / Query / Event / Job / external port 判断 | pass | 进入候选池写入。 |
| 接口分类与候选池:再写入 | done | 分类说明、对象到接口候选池、禁止升级项 | pass | 进入逐组成部分小循环。 |
| 能力身份与接入语境接口 | done | 本部分 Command / Query / Event 候选与停审 | pass | 进入注册目录与生命周期接口。 |
| 注册目录与生命周期接口 | done | 本部分 Command / Query / Job / Event 候选与停审 | pass | 进入接入描述与风险摘要接口。 |
| 接入描述与风险摘要接口 | done | 本部分 Command / Query / Event 候选与停审 | pass | 进入治理与方法关系接口。 |
| 治理与方法关系接口 | done | 本部分 Command / Query / Inbound / Event 候选与停审 | pass | 进入正式暴露与受控消费接口。 |
| 正式暴露与受控消费接口 | done | 本部分 Command / Query / Event 候选与停审 | pass | 进入追溯、变化与影响接口。 |
| 追溯、变化与影响接口 | done | 本部分 Command / Query / Inbound / Event 候选与停审 | pass | 进入派生维护与只读输出接口。 |
| 派生维护与只读输出接口 | done | 本部分 Query / Operations Job 候选与停审 | pass | 进入外部引用与安全摘要支撑接口。 |
| 外部引用与安全摘要支撑接口 | done | 本部分 Command / Query / Inbound / Port / Job 候选与停审 | pass | 进入分类总表。 |
| 分类总表与 external port 骨架 | done | Command / Query / Inbound / Outbound / Job / Port 总表 | pass | 进入 Step 8 / Step 9 反查。 |
| Step 8 / Step 9 反查 | done | 处理流和状态触发接口反查表 | pass | 进入跨接口一致性审计。 |
| 跨接口一致性审计 | done | 分类、命名、对象承接、边界和旧材料污染审计 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式 §7 回填草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | 完成门禁与 Step 8 进入条件 | pass | 等待用户确认 Step 8。 |

---

## 2. 必读文档

| 文档 | 读取结论 | 对 Step 7 的影响 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 7 | 本步必须按 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 分类,并按主要组成部分标注归属和对象承接。 | 不能只列 API 名;每个接口必须说明输入骨架、输出骨架、读写性质、边界和后续处理流承接。 |
| `standards/document/概要设计书写规范.md` §4.7 | 正式 §7 必须输出接口分类说明及各类接口表;输入骨架写对象骨架名和上下文判断,不写完整 schema。 | 本文件保留分类总表和正式 §7 回填草稿,但不写 HTTP / RPC / topic / DTO 细节。 |
| `standards/document/设计文档讨论中间产物规范.md` | Step 必须有开工确认、Step 内计划、问题回答、先思考 / 再写入、回填草稿和门禁。 | 本步按主要组成部分逐个小循环落盘,并在每部分结束处停审。 |
| `design-calibration/02_hld_step_01_upstream_boundary.md` | `02` 必须继续回答接口骨架,但旧接口名只作污染检查。 | 本步不得从旧 `QueryCapabilities`、provider / cost / KMS 接口反推新接口。 |
| `design-calibration/02_hld_step_02_goals_scope.md` | 概要层只到可实现结构骨架,完整 API / DTO / event schema 属于详细设计。 | 本步允许点名接口和输入输出对象,禁止完整契约化。 |
| `design-calibration/02_hld_step_03_constraints.md` | 已收稳 truth / snapshot / ref / derived、forbidden body、sync / async / background、依赖裁剪和失败显式表达。 | Command / Query / Event / Job 必须沿读写边界和一致性边界分开。 |
| `design-calibration/02_hld_step_04_code_subject_framework.md` | 已形成 8 个业务代码主体与 Inbound / Operations、Application、Domain、Ports、Persistence、Projection 分层。 | 接口按业务组成部分归属,不按 repository、handler、port、adapter 或目录分组。 |
| `design-calibration/02_hld_step_05_components_boundary.md` | 已收稳 8 个主要组成部分、功能 / capability、对象发现线索和后续展开位置。 | Step 7 的接口候选必须从 Step 5 的 capability 清单推导。 |
| `design-calibration/02_hld_step_06_key_objects.md` | 已正式化 43 个关键对象,并明确 `CapabilityAccessEventCollaborationPort`、`ConsumerViewRefreshJob` 后移 Step 7 / 8。 | 输入输出骨架必须优先使用 Step 6 对象、ref、summary、projection、report、policy 或 state,不得私造新领域对象。 |
| `projects/L3-capability-hub/00-需求文档.md` | §12 已给出能力级接口 / 依赖映射,§16 确认不存在孤儿接口。 | 本步把能力级接口细化为概要级 Command / Query / Event / Job 主语。 |
| `projects/L3-capability-hub/01-架构设计.md` | §9 数据分层、§10 关键交互确认同步裁定、异步传播、后台维护三分。 | 接口分类必须继承同步 / 异步 / 后台边界,不能把 query 写成 truth 修复入口。 |
| `projects/L1-governance/design-calibration/02_hld_step_07_api_interface_skeleton.md` | 参考其按 Command / Query / Event / Job 组织和输入上下文判断的粒度。 | 只参考结构,不复制 governance 领域接口。 |
| `projects/L3-method-library/design-calibration/02_hld_step_07_api_interface_skeleton.md` | 参考其按 8 个组成部分逐个思考、写入和停审的深度。 | 本步采用逐组成部分小循环和旧材料差异审计。 |

---

## 3. SOP 问题回答

### 3.1 哪些接口属于 Command,负责改写真相?

Command 只覆盖会显式改写本仓 capability access truth、relation truth、safe summary / reference support、history / change record 或 formal exposure 的用例入口。当前候选包括 identity 建立 / 更正 / 退役,registry 纳入 / 生命周期变化,descriptor 建立 / 替换 / 风险摘要维护,governance seam 与 method relation 变更,formal exposure / visibility 变更,下游影响摘要接收后形成本仓 impact fact,以及外部引用解析状态的正式维护。

### 3.2 哪些接口属于 Query,只读取投影或只读视图?

Query 覆盖 identity、registry、descriptor、seam、method relation、formal exposure、controlled consumer view、traceability、impact、directory search / browse、audit export、ecosystem discovery、reference resolution 和 reconciliation report 的读取。Query 可以返回 stale、unresolved、partial、unavailable、not visible 或 forbidden surface,但不得在读取路径创建、修复、合并、退役或重建 truth。

### 3.3 哪些外部事实需要通过 Inbound Event Consumer 进入本仓?

只有外部事实已经在来源系统成立,且本仓只接收 ref、safe summary、change hint 或 body-free impact summary 时才进入 Inbound Event Consumer。候选来源包括 governance result / policy result 变化、method asset ref 变化、外部 MCP / A2A / API 来源 ref 变化、下游消费影响回报、observability / audit material ref 变化和外部候选发现线索。Consumer 不得接收 governance truth、method body、secret 正文、runtime execution payload、tool result、SDK client state、marketplace listing 正文或 cost ledger。

### 3.4 哪些已提交事实需要通过 Outbound Event 对外传播?

需要传播的事实包括 capability identity changed、registry changed、adapter descriptor changed、governance seam changed、method relation changed、formal exposure changed、consumer view freshness changed、capability change impact identified、derived material refreshed、reference resolution changed。事件只携带本仓 fact ref、safe summary ref、change kind 和 trace context 的概要语义;topic、payload 字段全集、outbox、relay 和重试留给 `03-详细设计.md`。

### 3.5 哪些恢复、发布、重建、对账动作属于 Operations Job,而不是业务 command?

registry reconciliation、controlled consumer view refresh、directory search / browse projection rebuild、audit-friendly export preparation、read-only ecosystem discovery rebuild、reference resolution refresh、secret safe summary refresh、event collaboration delivery repair 属于 Operations Job。Job 只能基于已持久化 truth、ref 和 safe summary 维护派生材料或解析状态,不得作为业务 command 偷改 identity、registry、descriptor、seam、relation 或 formal exposure。

### 3.6 Command 输入骨架是否需要 `ActorContext`、`CommandMetadata`、`IdempotencyKey`?

需要。所有 Command 输入默认携带 `ActorContext`、`CommandMetadata`、`IdempotencyKey` 和 trace context。若由系统维护入口触发,也必须有 system actor 或 operator actor 语义,不能以匿名后台逻辑改写 truth。

### 3.7 Query 输入骨架是否需要 `ActorContext`?

需要。所有 Query 输入默认携带 `ActorContext`、`QueryMetadata`、读取 scope、consumer context 或 consistency hint。runtime、tools、SDK、console、marketplace 和 observability 等消费方读取时必须以 consumer ref 或 view scope 表达,不能让下游身份反写本仓 truth。

### 3.8 Event Consumer 输入骨架是否需要 event id、幂等键或 envelope?

需要。所有 Inbound Event Consumer 输入必须携带 event envelope、source event id、source system ref、dedup key、schema version / contract version 和 trace context。重复、乱序、来源不可解析、版本不支持或携带 forbidden body 时,必须 rejected / ignored / pending / unresolved,不能隐式写入核心 truth。

### 3.9 每个接口属于哪个主要组成部分,承接哪个对象或对象能力?

本步按 Step 5 的 8 个主要组成部分逐个归属接口,并在每个接口表中回指 Step 6 对象或对象能力。跨组成部分接口必须声明 owner:例如 `ControlledConsumerView` 的读取 owner 是“正式暴露与受控消费”,刷新 job owner 是“派生维护与只读输出”;`ObservabilityAuditRef` 的维护 owner 是“外部引用与安全摘要支撑”,追溯只使用该 ref。

### 3.10 是否存在接口无人承接、对象能力没有入口、接口类别混淆或跨组成部分越界?

当前未发现不可接受冲突。已识别的风险是旧 `QueryCapabilities` 可能试图同时充当 formal exposure truth、runtime allow / deny enforcement 和 consumer view;本步将其拆为 `FormalExposureBoundary` Command、`ControlledConsumerView` Query / refresh job 和 downstream consumer ref 边界。旧 provider / cost / KMS / policy refresh 接口全部作为 historical material 排除。

### 3.11 每个主要组成部分的接口骨架完成后是否通过停审?

本文件在 §6 为每个主要组成部分保留独立停审记录,检查接口是否承接对象能力、读写类别是否正确、是否误把内部 helper / repository / adapter / job runner 当 API、是否越过组成部分边界、是否写入 forbidden body 或完整协议细节。

---

## 4. 整体模块骨架

| 模块 | 本 Step 要做 | 本 Step 不做 |
|---|---|---|
| 接口分类 | 明确 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 和 external port 的适用口径。 | 不按 HTTP path、RPC method、topic、handler、repository 或旧 service 文件分类。 |
| 输入输出骨架 | 写对象 / ref / summary / material / report / state 级输入输出骨架。 | 不写完整 JSON / proto / CloudEvent schema、字段全集、错误码、transport envelope 或 SDK binding。 |
| 逐组成部分小循环 | 按 8 个主要组成部分逐个判断接口、写表、停审。 | 不一次性生成全仓接口后再补归属。 |
| 对象承接 | 每个接口必须回指 Step 6 对象或 Step 6 明确后移的 port / job 主语。 | 不私造 `ProviderContract`、`CapabilityDecision`、`CostRecord`、`QueryCapabilities` 或 KMS 对象。 |
| 事件协作 | 点名入站事实 consumer、出站事实 event 和 external event collaboration port。 | 不写 outbox、topic、payload、relay、retry、consumer group 或 bus adapter 实现。 |
| 后台维护 | 把刷新、重建、对账、handoff、引用解析维护归为 Operations Job。 | 不把 Job 当业务 Command,不写 scheduler、worker loop、锁、重试或补偿算法。 |
| 后置差异审计 | 接口骨架形成后审计旧接口污染。 | 不让旧接口名参与当前候选推导。 |

---

## 5. 接口分类与候选池

### 5.1 接口分类与候选池:先思考

问题回答:

- Step 7 的接口候选必须从 Step 5 的 capability 清单和 Step 6 的对象轮廓推导。若某个接口无法回指 Step 6 对象、ref、summary、projection、report、policy、state 或后移 port / job 主语,则不能进入当前接口骨架。
- Command 只用于显式改写真相、关系、formal exposure、history / change record 或 reference support。读取、判断、搜索、浏览、导出、投影重建、event relay 和 query view 不得伪装成 Command。
- Query 只读取 truth summary、projection、consumer view、safe summary、traceability、impact、reference state 或 report。Query 不得在读取路径刷新 ref、修复 projection、创建 missing truth 或更新 freshness state。
- Inbound Event Consumer 只接收外部已经成立的事实线索,并且必须 body-free。若来源无法提供 ref / safe summary / impact summary,则不能作为本仓 consumer 输入。
- Outbound Event 只表达本仓已提交事实或派生维护状态的传播必要性。它不是 outbox 表设计,也不是 topic / payload 契约。
- Operations Job 只维护派生材料、对账报告、引用解析和事件协作投递状态,不得借后台维护修核心业务 truth。
- External port 是概要层接缝骨架,用于约束相邻仓和外部系统如何被引用或通知;port 名不是 Rust trait 签名,也不是 adapter 实现。

诊断:

- 旧 `QueryCapabilities` 会把 formal exposure、consumer view、runtime allow / deny 和 policy refresh 混成同一接口主语,必须拆除。
- 旧 `ProviderContract` / `RotateProviderSecret` / `UpdateQuota` 会把 descriptor、secret 平台、provider runtime、quota 和 route 合并,必须改为 `AdapterDescriptor`、`SecretRef`、`SecretHandlingSafeSummary` 和 reference support。
- 旧 `RecordCost` / `DeniedInvocationAudit` 会把 runtime execution payload、billing 和 observability 写入本仓,必须排除为边界外。
- `CapabilityAccessEventCollaborationPort` 在 Step 6 明确后移到 Step 7,本步只写 external port skeleton 和事件类别,不写 payload / topic。

取舍:

- 保留五类正式接口和一类 external port 骨架。
- 对 Command 输入统一要求 `ActorContext`、`CommandMetadata`、`IdempotencyKey`、trace context。
- 对 Query 输入统一要求 `ActorContext`、`QueryMetadata`、scope / consumer context / consistency hint。
- 对 Inbound Event Consumer 输入统一要求 event envelope、source event id、dedup key、trace context 和 forbidden body check。
- 对 Operations Job 输入统一要求 `JobMetadata`、system / operator actor、scope ref、run idempotency key;这里的 run id 只是设计对象语义,不是伪造真实运行结果。

### 5.2 接口分类说明

| 接口类别 | 本仓是否适用 | 读写性质 | 输入骨架共性 | 输出骨架共性 | 禁止事项 |
|---|---|---|---|---|---|
| Command API | 适用 | 显式改写本仓 truth、relation、formal exposure、history / change record 或 reference support。 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;Step 6 对象 / ref / summary。 | accepted / rejected / pending / unresolved command result;被写入对象 ref;change summary。 | 不执行 runtime / tools 调用;不生成 governance approval;不保存 method body、secret 正文、cost ledger 或 observability store。 |
| Query API | 适用 | 只读 truth summary、projection、safe summary、trace、impact、reference state 或 report。 | `ActorContext`;`QueryMetadata`;scope / subject / consumer ref;consistency hint。 | view、summary、material、report、state surface、page。 | 不写 truth;不刷新 projection;不自动 resolve ref;不创建 missing object。 |
| Inbound Event Consumer | 有条件适用 | 接收外部已成立事实线索,转为本地 ref / safe summary / pending input / impact summary。 | event envelope;source event id;dedup key;source ref;schema version;trace context。 | accepted / ignored / rejected / pending consumer result;必要时形成 command intent。 | 不接收 raw body;不绕过 Command 写核心 truth;不把事件当相邻仓 truth。 |
| Outbound Event | 有条件适用 | 传播本仓已提交事实或派生维护状态。 | 本仓 fact ref / change record / trace context。 | capability access fact changed、material refreshed、impact identified 等概要事件。 | 不写 topic、payload 字段全集、outbox、relay、投递策略或下游状态 truth。 |
| Operations Job | 适用 | 基于已持久化 truth / ref / safe summary 维护派生材料、对账和 handoff。 | `JobMetadata`;system / operator actor;scope ref;run idempotency key。 | refreshed material ref、reconciliation report、handoff summary、job status surface。 | 不作为业务 command;不修核心 truth;不写调度、worker、锁、retry 或补偿实现。 |
| External Port Skeleton | 适用 | 表达相邻仓 / 外部系统的概要接缝。 | Step 6 ref / summary / event intent。 | reference result、safe summary、collaboration intent、handoff result。 | 不写 Rust trait、adapter code、transport、protocol envelope、topic 或 SDK client。 |

### 5.3 Step 6 对象到接口候选池接收

| 组成部分 | Step 6 对象 / 后移主语 | Step 7 初始接口候选方向 |
|---|---|---|
| 能力身份与接入语境 | `CapabilityIdentity`;`CapabilityAccessReviewFact`;`CapabilityIdentityPolicy`;`ExternalCapabilitySourceRef`;`CapabilityIdentityChangeRecord` | identity 建立 / 更正 / 退役 Command;接入审查事实维护 Command;identity / review 查询;identity changed event。 |
| 注册目录与生命周期 | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryVisibilityPolicy`;`RegistryChangeRecord` | registry 纳入 / 退出 / 生命周期变更 Command;registry / visibility 查询;registry reconciliation Job;registry changed event。 |
| 接入描述与风险摘要 | `AdapterDescriptor`;`DescriptorRiskConstraintSummary`;`SecretRef`;`SecretHandlingSafeSummary`;`DescriptorBoundaryPolicy`;`DescriptorChangeRecord` | descriptor 建立 / 替换 / 风险摘要维护 Command;descriptor / risk / secret safe summary 查询;外部文档或 secret safe summary event consumer。 |
| 治理与方法关系 | `GovernanceSeamRelation`;`GovernanceResultRef`;`GovernanceSeamPolicy`;`CapabilityMethodBodyFreeRelation`;`MethodAssetRef`;`MethodRelationBoundaryPolicy`;`GovernanceSeamChangeRecord`;`MethodRelationChangeRecord` | governance seam 挂接 / 失效 Command;method relation 建立 / 移除 Command;seam / relation 查询;governance / method ref event consumer。 |
| 正式暴露与受控消费 | `FormalExposureBoundary`;`FormalVisibilityApplicability`;`FormalExposurePolicy`;`ControlledConsumerView`;`ConsumerViewFreshnessPolicy`;`CapabilityExposureChangeRecord` | formal exposure 建立 / 调整 / 退役 Command;formal visibility / controlled consumer view Query;consumer view availability event。 |
| 追溯、变化与影响 | `CapabilityAccessTraceabilityRecord`;`CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary` | traceability / impact Query;downstream impact inbound consumer;impact fact Command;impact identified event。 |
| 派生维护与只读输出 | `DirectorySearchBrowseProjection`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary`;`CapabilityReconciliationReport`;`DerivedMaterialPolicy`;`ConsumerViewRefreshJob` | search / browse / export / discovery / report Query;consumer view refresh、projection rebuild、export prepare、discovery rebuild、reconciliation Job。 |
| 外部引用与安全摘要支撑 | `ReferenceResolutionState`;`ReferenceResolutionPolicy`;`ExternalDocumentRef`;`RuntimeToolsConsumerRef`;`SdkExposureConsumerRef`;`ObservabilityAuditRef`;`CapabilityAccessEventCollaborationPort` | reference state Command / Query;reference refresh Job;external source / audit ref inbound consumer;event collaboration external port;consumer ref Query。 |

### 5.4 明确排除或后移的接口候选

| 候选名称 / 旧口径 | 处理结论 | 原因 |
|---|---|---|
| `QueryCapabilities` | 排除旧接口名,拆分为 formal exposure Command、controlled consumer view Query、consumer view refresh Job 和 event propagation。 | 旧名混合 policy allow / deny、runtime 高频查询和 formal exposure truth。 |
| `RegisterProvider` / `RegisterProviderContract` | 排除旧接口名,由 `EstablishAdapterDescriptor`、`AttachDescriptorSecretReference` 等 descriptor 语义替代。 | Provider Contract 会吸收 secret、quota、route、cost、failover 和 provider runtime。 |
| `RefreshCapabilityDecision` | 排除旧接口名。 | governance approval / Policy truth 不归本仓,本仓不刷新 allow / deny 决策。 |
| `RecordCost` / `RecordDeniedInvocationAudit` | 排除。 | cost / billing、runtime invocation、deny event 和 observability store 不归本仓。 |
| KMS / Vault secret rotate API | 排除为本仓接口。 | secret 生命周期和密钥托管属于外部安全基础设施;本仓只保存 `SecretRef` 与 `SecretHandlingSafeSummary`。 |
| repository / port / adapter method | 后移到 `03-详细设计.md`。 | Step 7 只写概要接口骨架,不写代码级 trait 或实现。 |
| HTTP body / JSON DTO / CloudEvent payload / topic | 后移到 `03-详细设计.md`。 | 本步只写对象骨架与边界,不写协议 schema。 |
| job runner / scheduler / worker loop | 后移到 Step 8 / `03-详细设计.md`。 | 本步只点名 Operations Job 主语和边界。 |

---

## 6. 按主要组成部分组织的接口骨架

### 6.1 能力身份与接入语境

#### 6.1.1 本部分接口判断:先思考

问题回答:

- 本部分必须暴露 identity 建立、更正、退役和接入审查事实维护入口,因为这些动作会改写 `CapabilityIdentity`、`CapabilityAccessReviewFact` 和 `CapabilityIdentityChangeRecord`。
- `ExternalCapabilitySourceRef` 可以作为输入 ref 或查询对象,但外部 MCP / A2A / API 来源正文不能进入本仓。
- identity 查询、搜索和审查事实读取属于 Query。它们不得在读取路径合并身份、补造来源、修复 ref 或更新审查事实。
- identity 变化需要 Outbound Event 候选,供 registry、descriptor、seam、relation、exposure 和下游消费感知;事件细节后移。

取舍:

- 保留 4 个 Command、3 个 Query 和 1 个 Outbound Event 候选。
- 不单独设置 Inbound Event Consumer。外部候选发现和外部来源变化归入“外部引用与安全摘要支撑”承接,再通过正式 Command 进入 identity。
- 不把 identity policy validator、source parser、dedup helper 或 repository 方法写成接口。

#### 6.1.2 Command API 骨架

| Command | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `EstablishCapabilityAccessContext` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`ExternalCapabilitySourceRef` 或 source ref candidate;`CapabilityAccessIntakeContext`。 | `CapabilityIdentityCommandResult`;`CapabilityIdentityRef`;`CapabilityAccessReviewFactRef`。 | 校验来源 ref 与接入语境,创建 candidate / active identity 和初始审查事实。 | `CapabilityIdentity`;`CapabilityAccessReviewFact`;`CapabilityIdentityChangeRecord`。 |
| `CorrectCapabilityIdentity` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`CapabilityIdentityRef`;`IdentityCorrectionReason`;可选关联 identity ref。 | `CapabilityIdentityCommandResult`;identity change summary。 | 显式记录合并、拆分或更正意图,并阻止 consumer view 隐式更改身份。 | `CapabilityIdentity`;`CapabilityIdentityChangeRecord`;必要的 trace source。 |
| `RetireCapabilityIdentity` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`CapabilityIdentityRef`;`RetirementReason`。 | `CapabilityIdentityCommandResult`;retirement summary。 | 将 identity 退役,为 registry / exposure 后续退役处理提供来源事实。 | `CapabilityIdentity`;`CapabilityIdentityChangeRecord`。 |
| `RecordCapabilityAccessReviewFact` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`CapabilityIdentityRef`;`AccessReviewContext`;`AccessRiskSummary`。 | `CapabilityAccessReviewFactCommandResult`;review fact ref。 | 记录身份层接入审查事实和风险解释,并标记其不等同 governance approval。 | `CapabilityAccessReviewFact`;`CapabilityIdentityChangeRecord` 或 trace source。 |

#### 6.1.3 Query API 骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetCapabilityIdentity` | `ActorContext`;`QueryMetadata`;`CapabilityIdentityRef`;consistency hint。 | `CapabilityIdentityView`;identity state surface。 | `CapabilityIdentity`;`ExternalCapabilitySourceRef`;review fact summary。 | 不刷新来源 ref;不合并或更正 identity。 |
| `SearchCapabilityIdentities` | `ActorContext`;`QueryMetadata`;identity search scope;page。 | `CapabilityIdentitySearchPage`。 | identity read model 或 truth summary。 | 搜索结果不得作为 registry truth 或 consumer view。 |
| `GetCapabilityAccessReviewFact` | `ActorContext`;`QueryMetadata`;`CapabilityAccessReviewFactRef` 或 `CapabilityIdentityRef`。 | `CapabilityAccessReviewFactView`;separation marker summary。 | `CapabilityAccessReviewFact`;risk summary。 | 不读取 governance approval 正文,不形成 governance decision。 |

#### 6.1.4 Outbound Event 候选

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `CapabilityIdentityChanged` | `EstablishCapabilityAccessContext`;`CorrectCapabilityIdentity`;`RetireCapabilityIdentity`;`RecordCapabilityAccessReviewFact` | registry、descriptor、seam、relation、exposure、trace / impact、derived maintenance | 只传播 identity ref、change kind 和 trace context;不携带外部来源正文。 |

#### 6.1.5 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 对象能力是否承接 | pass | Command / Query 均回指 `CapabilityIdentity`、`CapabilityAccessReviewFact`、`ExternalCapabilitySourceRef` 和 change record。 |
| 读写类别是否正确 | pass | identity 变化为 Command,identity / review 读取为 Query。 |
| 是否误把内部 helper 当 API | pass | policy validator、source parser、repository、dedup helper 未进入接口表。 |
| 是否越界 | pass | 未执行外部 MCP / A2A / API 调用,未保存外部正文,未替代 governance approval。 |
| Step 8 承接 | pass | 外部能力接入语境建立、identity 更正 / 退役和审查事实记录需要在 Step 8 展开处理流。 |

### 6.2 注册目录与生命周期

#### 6.2.1 本部分接口判断:先思考

问题回答:

- 本部分需要 registry 纳入、生命周期更新、退出和可见性依据维护的 Command,因为 `CapabilityRegistryEntry` 和 `RegistryLifecycleState` 是本仓正式 truth。
- registry 可见性读取、registry entry 读取和目录列表属于 Query,不得在读取路径修复 lifecycle 或补写 descriptor。
- registry maintenance / reconciliation 属于 Operations Job,因为它检查派生材料或报告一致性,但不得创造 registry truth。
- registry 变化需要 Outbound Event,供 formal exposure、consumer view、search / browse 和下游变化感知使用。

取舍:

- 保留 4 个 Command、3 个 Query、1 个 Operations Job 和 1 个 Outbound Event。
- 不把 registry search projection 的刷新放到本组成部分,搜索 / 浏览投影由“派生维护与只读输出”统一维护。
- 不恢复 allowlist、runtime cache、marketplace listing 或 availability bit 接口。

#### 6.2.2 Command API 骨架

| Command | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `RegisterCapabilityInRegistry` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`CapabilityIdentityRef`;initial lifecycle intent;optional descriptor ref。 | `CapabilityRegistryCommandResult`;`CapabilityRegistryEntryRef`。 | 将稳定 identity 纳入 registry,建立目录生命周期锚点。 | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryChangeRecord`。 |
| `UpdateRegistryLifecycleState` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`CapabilityRegistryEntryRef`;target lifecycle state;reason。 | `CapabilityRegistryCommandResult`;lifecycle change summary。 | 显式推进 draft / registered / visibility_pending / formal_visible / retired 等生命周期语义。 | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryChangeRecord`。 |
| `UpdateRegistryVisibilityBasis` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`CapabilityRegistryEntryRef`;`RegistryVisibilityBasis`;reason。 | `RegistryVisibilityCommandResult`。 | 维护 registry 可见性依据,但不生成 governance approval 或 formal exposure。 | `CapabilityRegistryEntry`;`RegistryChangeRecord`。 |
| `RetireCapabilityRegistryEntry` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`CapabilityRegistryEntryRef`;retirement reason。 | `CapabilityRegistryCommandResult`;retirement summary。 | 将 registry entry 退出正式目录,为 exposure / consumer view 后续变化提供来源。 | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryChangeRecord`。 |

#### 6.2.3 Query API 骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetCapabilityRegistryEntry` | `ActorContext`;`QueryMetadata`;`CapabilityRegistryEntryRef`。 | `CapabilityRegistryEntryView`;lifecycle state surface。 | `CapabilityRegistryEntry`;`RegistryLifecycleState`;descriptor ref summary。 | 不补建 descriptor,不推进 lifecycle。 |
| `ListCapabilityRegistryEntries` | `ActorContext`;`QueryMetadata`;registry scope;filters;page;consistency hint。 | `CapabilityRegistryEntryPage`。 | registry truth summary 或 read model。 | 不等同 search / browse projection,不返回 marketplace listing。 |
| `GetRegistryVisibilitySemantics` | `ActorContext`;`QueryMetadata`;`CapabilityRegistryEntryRef` 或 identity ref。 | `RegistryVisibilityView`;visibility basis summary。 | `RegistryVisibilityPolicy`;registry state summary。 | 不形成 formal exposure,不绕过 governance seam。 |

#### 6.2.4 Operations Job 骨架

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `RunCapabilityRegistryReconciliation` | `JobMetadata`;system / operator actor;registry scope;source truth refs;run idempotency key。 | `CapabilityReconciliationReport`;reconciliation status surface。 | 只检查 registry truth 与派生材料 / report 的一致性,不得创建、退役或修正 registry entry。 |

#### 6.2.5 Outbound Event 候选

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `CapabilityRegistryChanged` | registry command 或 reconciliation report 标记 stale / rebuild required | descriptor、exposure、trace / impact、derived maintenance、downstream consumers | 只传播 registry entry ref、change kind、lifecycle surface 和 trace context;不传播 allowlist 或 runtime state。 |

#### 6.2.6 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 对象能力是否承接 | pass | 接口回指 `CapabilityRegistryEntry`、`RegistryLifecycleState`、`RegistryVisibilityPolicy`、`RegistryChangeRecord` 和 `CapabilityReconciliationReport`。 |
| 读写类别是否正确 | pass | registry truth 变化为 Command,读取为 Query,对账为 Job。 |
| 是否误把内部 helper 当 API | pass | repository、projection refresh、search index rebuild 未写成本部分 API。 |
| 是否越界 | pass | 未写 allowlist、runtime cache、marketplace listing、execution availability。 |
| Step 8 承接 | pass | registry 纳入 / 生命周期变化 / 对账需要进入 Step 8 flow。 |

### 6.3 接入描述与风险摘要

#### 6.3.1 本部分接口判断:先思考

问题回答:

- descriptor 建立、替换、退役和风险 / 约束摘要维护属于 Command,因为会改写 `AdapterDescriptor`、`DescriptorRiskConstraintSummary` 和 `DescriptorChangeRecord`。
- `SecretRef` 和 `SecretHandlingSafeSummary` 可以作为输入 / 输出骨架,但本仓绝不提供 secret value write / rotate / decrypt API。
- descriptor、风险摘要和 safe summary 读取属于 Query。读取失败必须返回 unresolved / unavailable / forbidden surface,不能在 Query 中调用 secret 平台或外部 provider runtime。
- 外部文档 ref 或 secret safe summary 变化可以作为 Inbound Event Consumer 候选,但只由“外部引用与安全摘要支撑”承接并转为 ref / summary 更新;本部分只消费其结果。

取舍:

- 保留 4 个 Command、4 个 Query 和 1 个 Outbound Event 候选。
- 不在本部分直接定义 Inbound Event Consumer;引用变化由 §6.8 统一承接。
- 不写 provider contract、quota、route、failover、retry、cost 或 KMS / Vault adapter 接口。

#### 6.3.2 Command API 骨架

| Command | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `EstablishAdapterDescriptor` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`CapabilityIdentityRef`;`CapabilityRegistryEntryRef`;`ExternalCapabilitySourceRef`;`ExternalDocumentRef` summary;descriptor intent。 | `AdapterDescriptorCommandResult`;`AdapterDescriptorRef`。 | 建立能力接入描述,表达接入方式、能力类型和边界摘要。 | `AdapterDescriptor`;`DescriptorChangeRecord`。 |
| `ReplaceAdapterDescriptor` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`AdapterDescriptorRef`;replacement descriptor summary;reason。 | `AdapterDescriptorCommandResult`;replacement summary。 | 显式替换 descriptor,保留原 descriptor 的历史解释。 | `AdapterDescriptor`;`DescriptorChangeRecord`。 |
| `RecordDescriptorRiskConstraintSummary` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`AdapterDescriptorRef`;`DescriptorRiskConstraintSummaryInput`;review fact ref。 | `DescriptorRiskSummaryCommandResult`;risk summary ref。 | 维护风险、约束和使用边界摘要,不生成 governance truth。 | `DescriptorRiskConstraintSummary`;`DescriptorChangeRecord`。 |
| `AttachDescriptorSecretReference` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`AdapterDescriptorRef`;`SecretRef`;`SecretHandlingSafeSummary`。 | `DescriptorSecretReferenceCommandResult`;safe summary ref。 | 将允许的 secret ref 和安全处理摘要挂到 descriptor 边界。 | `SecretRef` reference binding;`SecretHandlingSafeSummary`;`DescriptorChangeRecord`。 |

#### 6.3.3 Query API 骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetAdapterDescriptor` | `ActorContext`;`QueryMetadata`;`AdapterDescriptorRef` 或 capability ref。 | `AdapterDescriptorView`;descriptor state surface。 | `AdapterDescriptor`;source ref;external document ref summary。 | 不返回 provider runtime config,不读取外部 API schema 正文。 |
| `GetDescriptorRiskConstraintSummary` | `ActorContext`;`QueryMetadata`;`AdapterDescriptorRef`;summary scope。 | `DescriptorRiskConstraintSummaryView`。 | `DescriptorRiskConstraintSummary`;access review fact summary。 | 不替代 governance approval,不输出 secret 正文。 |
| `GetDescriptorSecretSafeSummary` | `ActorContext`;`QueryMetadata`;`AdapterDescriptorRef` 或 `SecretRef`;safe summary scope。 | `SecretHandlingSafeSummaryView`;resolution state surface。 | `SecretRef`;`SecretHandlingSafeSummary`;`ReferenceResolutionState`。 | 不提供 secret value、decrypt、rotate 或 KMS / Vault operation。 |
| `ListDescriptorsByCapability` | `ActorContext`;`QueryMetadata`;`CapabilityIdentityRef`;page;consistency hint。 | `AdapterDescriptorPage`。 | descriptor truth summary。 | 不形成 provider lookup view,不代表 runtime availability。 |

#### 6.3.4 Outbound Event 候选

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `AdapterDescriptorChanged` | descriptor Command | exposure、consumer view refresh、trace / impact、derived maintenance | 由 descriptor change record 产生,只传播 descriptor ref、change kind 和 trace context;不携带 provider runtime、secret 正文或外部 API schema 全文。 |

#### 6.3.5 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 对象能力是否承接 | pass | 接口回指 `AdapterDescriptor`、`DescriptorRiskConstraintSummary`、`SecretRef`、`SecretHandlingSafeSummary` 和 change record。 |
| 读写类别是否正确 | pass | descriptor / summary 变化为 Command,读取为 Query。 |
| 是否误把内部 helper 当 API | pass | descriptor policy validator、provider parser、secret adapter 未写成 API。 |
| 是否越界 | pass | 未写 ProviderContract、KMS / Vault、quota、route、cost、provider runtime 或外部调用执行。 |
| Step 8 承接 | pass | descriptor 建立 / 替换、风险摘要维护和 secret ref 挂接需要进入 Step 8 flow。 |

### 6.4 治理与方法关系

#### 6.4.1 本部分接口判断:先思考

问题回答:

- governance seam 和 method relation 都是本仓 relation truth,因此挂接、替换、失效、建立、移除属于 Command。
- governance result 和 method asset 只能作为 ref / allowed summary / body-free relation 输入,不能把 approval、Policy、shared_rules 或 method body 写入本仓。
- seam、relation、审查职责分离和引用状态读取属于 Query。
- governance result changed 和 method asset ref changed 可以通过 Inbound Event Consumer 进入,但只能形成 ref stale / pending / unresolved 或需要正式 Command 处理的意图,不能绕过 Command 改写 relation truth。

取舍:

- 保留 5 个 Command、4 个 Query、2 个 Inbound Event Consumer 和 2 个 Outbound Event 候选。
- 不写 governance approval API、Policy eval API、shared_rules refresh API 或 method asset publication API。
- 不把 access review fact 升级为 governance decision。

#### 6.4.2 Command API 骨架

| Command | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `AttachGovernanceSeamRelation` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`CapabilityIdentityRef`;`CapabilityRegistryEntryRef`;`GovernanceResultRef`;allowed safe summary ref。 | `GovernanceSeamCommandResult`;`GovernanceSeamRelationRef`。 | 建立 capability 与 governance result / policy result 的 seam relation。 | `GovernanceSeamRelation`;`GovernanceSeamChangeRecord`;`ReferenceResolutionState` usage。 |
| `ReplaceGovernanceSeamRelation` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`GovernanceSeamRelationRef`;next governance result ref;reason。 | `GovernanceSeamCommandResult`;replacement summary。 | 显式替换 seam relation,保留历史和过期原因。 | `GovernanceSeamRelation`;`GovernanceSeamChangeRecord`。 |
| `ExpireGovernanceSeamRelation` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`GovernanceSeamRelationRef`;expiry reason。 | `GovernanceSeamCommandResult`;expired summary。 | 将 seam 标记为 expired / unresolved / forbidden 等语义。 | `GovernanceSeamRelation`;`GovernanceSeamChangeRecord`。 |
| `AttachCapabilityMethodRelation` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`CapabilityIdentityRef`;`MethodAssetRef`;relation scope;allowed body-free summary。 | `CapabilityMethodRelationCommandResult`;`CapabilityMethodBodyFreeRelationRef`。 | 建立 capability 与 method asset 的无正文关系。 | `CapabilityMethodBodyFreeRelation`;`MethodRelationChangeRecord`。 |
| `RemoveCapabilityMethodRelation` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`CapabilityMethodBodyFreeRelationRef`;removal reason。 | `CapabilityMethodRelationCommandResult`;removed summary。 | 显式移除 relation,防止 method body 或旧 relation 隐式保留。 | `CapabilityMethodBodyFreeRelation`;`MethodRelationChangeRecord`。 |

#### 6.4.3 Query API 骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetGovernanceSeamRelation` | `ActorContext`;`QueryMetadata`;`GovernanceSeamRelationRef` 或 capability ref。 | `GovernanceSeamRelationView`;reference resolution surface。 | `GovernanceSeamRelation`;`GovernanceResultRef`;safe summary。 | 不读取 approval / Policy / shared_rules 正文。 |
| `GetAccessGovernanceSeparation` | `ActorContext`;`QueryMetadata`;`CapabilityIdentityRef` 或 review fact ref。 | `AccessGovernanceSeparationView`。 | `CapabilityAccessReviewFact`;`GovernanceSeamRelation`;separation marker。 | 不把 access review fact 当 approval。 |
| `GetCapabilityMethodRelation` | `ActorContext`;`QueryMetadata`;`CapabilityMethodBodyFreeRelationRef` 或 capability / method ref。 | `CapabilityMethodRelationView`;body-free relation summary。 | `CapabilityMethodBodyFreeRelation`;`MethodAssetRef`。 | 不读取 Method Content、TaskDefinition、AIPolicyDef 或 method version body。 |
| `ListCapabilityRelations` | `ActorContext`;`QueryMetadata`;capability ref;relation kind;page。 | `CapabilityRelationPage`。 | seam / method relation read model。 | 不形成 source truth,不刷新 external refs。 |

#### 6.4.4 Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `ConsumeGovernanceResultReferenceChanged` | `L1-governance` 运行期 / 事件协作边界 | event envelope;source event id;dedup key;`GovernanceResultRef`;safe summary ref;trace context。 | 标记 seam candidate stale / pending,或形成需要 Command 处理的 seam update intent。 | 不创建 approval、Policy effective fact、shared_rules truth;不直接改写 formal exposure。 |
| `ConsumeMethodAssetReferenceChanged` | `L3-method-library` relation 边界 | event envelope;source event id;dedup key;`MethodAssetRef`;body-free summary;trace context。 | 标记 method relation stale / unresolved,或形成需要 Command 处理的 relation update intent。 | 不接收 method body,不建立源码依赖,不替代 method-library 生命周期。 |

#### 6.4.5 Outbound Event 候选

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `GovernanceSeamRelationChanged` | governance seam Command | exposure、trace / impact、derived maintenance、downstream consumers | 只传播 seam relation ref、change kind 和 trace context;不携带 governance truth。 |
| `CapabilityMethodRelationChanged` | method relation Command | method-library relation observer、exposure、trace / impact、consumer view | 只传播 relation ref、method asset ref 和 body-free change summary。 |

#### 6.4.6 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 对象能力是否承接 | pass | 接口回指 `GovernanceSeamRelation`、`GovernanceResultRef`、`CapabilityMethodBodyFreeRelation`、`MethodAssetRef` 和 change record。 |
| 读写类别是否正确 | pass | relation 变化为 Command,外部 ref 变化为 Inbound Consumer,读取为 Query。 |
| 是否误把内部 helper 当 API | pass | seam policy checker、method boundary validator、repository 未写成 API。 |
| 是否越界 | pass | 未写 approval、Policy、shared_rules、method body、method publication 或 runtime allow / deny。 |
| Step 8 承接 | pass | governance seam 挂接 / 失效、method relation 建立 / 移除和 external ref changed consumer 需要进入 Step 8 flow。 |

### 6.5 正式暴露与受控消费

#### 6.5.1 本部分接口判断:先思考

问题回答:

- formal exposure 是服务端正式暴露 truth,因此建立、调整、退役和 formal visibility / applicability 更新属于 Command。
- `ControlledConsumerView` 是 projection / snapshot,其读取属于 Query;其刷新属于“派生维护与只读输出”的 Job,不属于本部分 Command。
- runtime、tools、SDK 等消费方通过 consumer ref 和 controlled view 读取服务端边界,但不得把消费状态、SDK client 或 runtime cache 写回 exposure。
- exposure 变化需要 Outbound Event,供 trace / impact、consumer view refresh、runtime / tools / SDK 消费和外部协作边界感知。

取舍:

- 保留 4 个 Command、5 个 Query 和 2 个 Outbound Event 候选。
- `ControlledConsumerView` 的业务 owner 仍在本部分;刷新 job owner 在 §6.7,本步显式分开。
- 不恢复旧 `QueryCapabilities`、allow / deny enforcement、SDK client API 或 runtime dispatch API。

#### 6.5.2 Command API 骨架

| Command | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `EstablishFormalExposureBoundary` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`CapabilityRegistryEntryRef`;`AdapterDescriptorRef`;`GovernanceSeamRelationRef`;optional method relation ref;exposure intent。 | `FormalExposureCommandResult`;`FormalExposureBoundaryRef`。 | 基于 registry、descriptor、governance seam 和可选 method relation 建立服务端 formal exposure。 | `FormalExposureBoundary`;`FormalVisibilityApplicability`;`CapabilityExposureChangeRecord`。 |
| `UpdateFormalVisibilityApplicability` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`FormalExposureBoundaryRef`;visibility / applicability intent;reason。 | `FormalVisibilityCommandResult`;visibility summary。 | 调整正式可见 / 适用语义,并保持与 registry 和 governance seam 的来源可解释。 | `FormalVisibilityApplicability`;`CapabilityExposureChangeRecord`。 |
| `SuspendFormalExposureBoundary` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`FormalExposureBoundaryRef`;suspension reason。 | `FormalExposureCommandResult`;suspended summary。 | 显式挂起 exposure,不删除 history,不让 consumer view 自行决定。 | `FormalExposureBoundary`;`CapabilityExposureChangeRecord`。 |
| `RetireFormalExposureBoundary` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`FormalExposureBoundaryRef`;retirement reason。 | `FormalExposureCommandResult`;retired summary。 | 退役服务端暴露边界,并触发下游消费视图刷新。 | `FormalExposureBoundary`;`FormalVisibilityApplicability`;`CapabilityExposureChangeRecord`。 |

#### 6.5.3 Query API 骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetFormalExposureBoundary` | `ActorContext`;`QueryMetadata`;`FormalExposureBoundaryRef` 或 capability ref。 | `FormalExposureBoundaryView`;exposure state surface。 | `FormalExposureBoundary`;registry / descriptor / seam refs。 | 不读取 runtime allow / deny,不返回 SDK client config。 |
| `GetFormalVisibilityApplicability` | `ActorContext`;`QueryMetadata`;`FormalExposureBoundaryRef`;consumer scope。 | `FormalVisibilityApplicabilityView`。 | `FormalVisibilityApplicability`;visibility policy summary。 | 不把 registry local state 或 consumer view 当 formal visibility。 |
| `GetControlledConsumerView` | `ActorContext`;`QueryMetadata`;`RuntimeToolsConsumerRef` 或 `SdkExposureConsumerRef`;capability scope;consistency hint。 | `ControlledConsumerView`;freshness surface。 | `ControlledConsumerView`;`FormalExposureBoundary`;descriptor safe summary。 | 只读快照,不得反写 formal exposure 或 descriptor。 |
| `ListConsumableCapabilitiesForRuntimeTools` | `ActorContext`;`QueryMetadata`;`RuntimeToolsConsumerRef`;scope;page;freshness hint。 | `ControlledConsumerViewPage`;consumer view freshness summary。 | controlled consumer projection。 | 不等于 runtime execution availability,不做 allow / deny enforcement。 |
| `GetSdkExposureBoundary` | `ActorContext`;`QueryMetadata`;`SdkExposureConsumerRef`;exposure scope。 | `SdkExposureBoundaryView`;server-side exposure summary。 | `FormalExposureBoundary`;`ControlledConsumerView`;SDK consumer ref。 | 解释服务端边界,不定义 SDK package、binding 或 client cache。 |

#### 6.5.4 Outbound Event 候选

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `FormalExposureBoundaryChanged` | exposure Command | runtime、tools、SDK、trace / impact、derived maintenance、event collaboration port | 传播 formal exposure ref、change kind 和 required refresh hint;不传播 runtime state。 |
| `ControlledConsumerViewAvailabilityChanged` | consumer view refresh job 或 exposure change 后的派生状态 | runtime、tools、SDK、console、observability candidates | 传播 view ref、freshness state 和 safe summary ref;不作为 formal truth。 |

#### 6.5.5 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 对象能力是否承接 | pass | 接口回指 `FormalExposureBoundary`、`FormalVisibilityApplicability`、`ControlledConsumerView`、`ConsumerViewFreshnessPolicy` 和 exposure change record。 |
| 读写类别是否正确 | pass | exposure / visibility 变化为 Command,consumer view 读取为 Query,刷新 job 后移 §6.7。 |
| 是否误把内部 helper 当 API | pass | exposure policy checker、consumer view builder 未写成外部 API。 |
| 是否越界 | pass | 未恢复 `QueryCapabilities`,未写 runtime dispatch、tools execution、SDK client 或 allow / deny enforcement。 |
| Step 8 承接 | pass | formal exposure 建立 / 调整、consumer view 读取与刷新触发需要进入 Step 8 flow。 |

### 6.6 追溯、变化与影响

#### 6.6.1 本部分接口判断:先思考

问题回答:

- traceability 记录通常由各 Command 处理流产生,不应把每个内部 append helper 暴露成 API。但下游 impact summary 进入本仓并形成本仓 `CapabilityChangeImpactFact` 时,需要有正式 Command 或 Inbound Consumer 入口。
- traceability、change impact、downstream impact summary 和 audit handoff 读取属于 Query。
- 下游消费影响回报是 Inbound Event Consumer,只接收 body-free impact summary,不接收 runtime execution payload。
- impact identified 需要 Outbound Event 候选,供 downstream consumers、derived maintenance 和 audit handoff 感知。

取舍:

- 保留 2 个 Command、4 个 Query、1 个 Inbound Event Consumer 和 1 个 Outbound Event 候选。
- 不把 trace record repository append、audit log writer 或 observability exporter 写成正式 API。
- 不把 observability store、cost ledger、runtime invocation result 写入输入骨架。

#### 6.6.2 Command API 骨架

| Command | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `RecordCapabilityChangeImpactFact` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;source change record refs;`DownstreamConsumptionImpactSummary`;impact scope。 | `CapabilityChangeImpactCommandResult`;`CapabilityChangeImpactFactRef`。 | 基于已成立 access truth 变化和下游影响摘要记录本仓 impact fact。 | `CapabilityChangeImpactFact`;`CapabilityAccessTraceabilityRecord` link。 |
| `RecordTraceabilityHandoffSummary` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`CapabilityAccessTraceabilityRecordRef`;handoff scope;`ObservabilityAuditRef` optional。 | `TraceabilityHandoffCommandResult`;handoff summary ref。 | 记录追溯交接摘要是否可用,不保存 audit store 正文。 | `CapabilityAccessTraceabilityRecord` handoff marker;可供 `AuditFriendlyExportSummary` 使用的 summary ref。 |

#### 6.6.3 Query API 骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetCapabilityAccessTrace` | `ActorContext`;`QueryMetadata`;trace subject ref;page;consistency hint。 | `CapabilityAccessTraceabilityView`;trace page。 | `CapabilityAccessTraceabilityRecord`;change records。 | 不替代 observability audit store,不返回 forbidden body。 |
| `GetCapabilityChangeImpact` | `ActorContext`;`QueryMetadata`;`CapabilityChangeImpactFactRef` 或 capability / change ref。 | `CapabilityChangeImpactView`;impact state surface。 | `CapabilityChangeImpactFact`;downstream impact summary。 | 不读取 runtime execution payload,不回滚 truth。 |
| `GetDownstreamConsumptionImpactSummary` | `ActorContext`;`QueryMetadata`;consumer ref;capability ref;time / change scope。 | `DownstreamConsumptionImpactSummaryView`。 | `DownstreamConsumptionImpactSummary`;consumer ref state。 | 只读下游摘要,不拥有下游状态 truth。 |
| `GetAuditHandoffTraceSummary` | `ActorContext`;`QueryMetadata`;traceability record ref;handoff scope。 | `AuditHandoffTraceSummaryView`;observability ref surface。 | traceability record;`ObservabilityAuditRef`;audit-friendly summary candidate。 | 不输出 raw audit log、metric、trace 或 cost data。 |

#### 6.6.4 Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `ConsumeDownstreamConsumptionImpactReported` | runtime / tools / SDK 或产品入口的消费反馈边界 | event envelope;source event id;dedup key;`RuntimeToolsConsumerRef` 或 `SdkExposureConsumerRef`;body-free impact summary;trace context。 | `DownstreamConsumptionImpactSummary` accepted / partial / ignored;必要时形成 impact fact command intent。 | 不接收 execution payload、tool result、SDK client state 或下游 truth。 |

#### 6.6.5 Outbound Event 候选

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `CapabilityChangeImpactIdentified` | `RecordCapabilityChangeImpactFact`;核心 truth 变化处理流 | runtime、tools、SDK、observability candidates、derived maintenance | 传播 impact fact ref、impact scope 和 trace context;不携带下游执行正文。 |

#### 6.6.6 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 对象能力是否承接 | pass | 接口回指 `CapabilityAccessTraceabilityRecord`、`CapabilityChangeImpactFact`、`DownstreamConsumptionImpactSummary` 和 `ObservabilityAuditRef`。 |
| 读写类别是否正确 | pass | impact fact / handoff marker 为 Command,trace / impact 读取为 Query,下游影响回报为 Inbound Consumer。 |
| 是否误把内部 helper 当 API | pass | trace append helper、audit exporter、event publisher 未写成业务 API。 |
| 是否越界 | pass | 未保存 runtime execution payload、audit store 正文、cost ledger 或下游状态 truth。 |
| Step 8 承接 | pass | change impact 记录、downstream impact consumer 和 audit handoff summary 需要进入 Step 8 flow。 |

### 6.7 派生维护与只读输出

#### 6.7.1 本部分接口判断:先思考

问题回答:

- 本部分不暴露业务 Command。所有维护动作都是 Operations Job,因为它们只刷新 `ControlledConsumerView`、`DirectorySearchBrowseProjection`、`AuditFriendlyExportSummary`、`ReadOnlyEcosystemDiscoverySummary` 或 `CapabilityReconciliationReport`。
- search / browse、audit export summary、ecosystem discovery、reconciliation report 和 maintenance progress 读取属于 Query。
- refresh / rebuild / export prepare / reconciliation job 失败只能影响 freshness、partial、unavailable 或 report state,不得回滚或修核心 truth。
- consumer view 的刷新 job owner 在本部分,但业务 view owner 仍是“正式暴露与受控消费”。

取舍:

- 保留 5 个 Query 和 5 个 Operations Job。
- 保留 `DerivedMaterialRefreshed` 作为出站事件候选,用于告知读取方派生材料新鲜度变化。
- 不写 Command,不写 scheduler / worker / retry / lock。
- 不把 search / browse projection 或 read-only ecosystem discovery 升级为 marketplace listing truth。

#### 6.7.2 Query API 骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `SearchCapabilityDirectory` | `ActorContext`;`QueryMetadata`;directory search scope;filters;page;freshness hint。 | `DirectorySearchBrowseProjectionPage`;freshness surface。 | `DirectorySearchBrowseProjection`;registry / descriptor / exposure source refs。 | 不创建 registry entry,不作为 marketplace listing。 |
| `BrowseCapabilityDirectory` | `ActorContext`;`QueryMetadata`;browse scope;facet intent;page。 | `DirectoryBrowseView`;facet summary。 | directory search / browse projection。 | 不修 projection,不改变 visibility。 |
| `GetAuditFriendlyExportSummary` | `ActorContext`;`QueryMetadata`;export summary ref or audit scope。 | `AuditFriendlyExportSummaryView`;export state surface。 | `AuditFriendlyExportSummary`;traceability refs;observability ref summary。 | 不提供 raw audit log,不拥有 audit store。 |
| `GetReadOnlyEcosystemDiscoverySummary` | `ActorContext`;`QueryMetadata`;ecosystem context ref;capability scope。 | `ReadOnlyEcosystemDiscoverySummaryView`;discoverability summary。 | `ReadOnlyEcosystemDiscoverySummary`;formal exposure ref。 | 不形成 marketplace listing、transaction、pricing 或 fulfillment truth。 |
| `GetCapabilityReconciliationReport` | `ActorContext`;`QueryMetadata`;reconciliation report ref or scope。 | `CapabilityReconciliationReportView`;finding summary。 | `CapabilityReconciliationReport`;source truth refs。 | 只读报告,不得自动修正 truth 或 projection。 |

#### 6.7.3 Operations Job 骨架

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `RefreshControlledConsumerView` | `JobMetadata`;system / operator actor;`FormalExposureBoundaryRef`;consumer scope;run idempotency key。 | refreshed `ControlledConsumerView`;freshness state surface。 | 只从 formal exposure、descriptor safe summary 和 consumer refs 重建 view,不得改写 exposure。 |
| `RebuildDirectorySearchBrowseProjection` | `JobMetadata`;registry / descriptor / exposure scope;source truth refs;run idempotency key。 | `DirectorySearchBrowseProjection`;rebuild summary。 | projection 可重建且只读,不得补造 registry。 |
| `PrepareAuditFriendlyExportSummary` | `JobMetadata`;traceability scope;allowed export scope;`ObservabilityAuditRef` optional。 | `AuditFriendlyExportSummary`;partial / unavailable surface。 | 只输出 allowed summary 或 ref,不复制 audit store。 |
| `RebuildReadOnlyEcosystemDiscoverySummary` | `JobMetadata`;`FormalExposureBoundaryRef`;ecosystem context ref;run idempotency key。 | `ReadOnlyEcosystemDiscoverySummary`;freshness surface。 | 只读生态发现,不创建 marketplace listing。 |
| `RunDerivedMaterialReconciliation` | `JobMetadata`;derived material scope;source truth refs;run idempotency key。 | `CapabilityReconciliationReport`;rebuild required / inconsistent surface。 | 报告不修改 truth;修复动作必须通过对应 Job 或 Command 明确触发。 |

#### 6.7.4 Outbound Event 候选

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `DerivedMaterialRefreshed` | derived maintenance Job | query consumers、observability candidates、event collaboration port | 传播 projection / export / discovery / report freshness,不表示核心 truth 发生变化。 |

#### 6.7.5 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 对象能力是否承接 | pass | 接口回指 `ControlledConsumerView`、`DirectorySearchBrowseProjection`、`AuditFriendlyExportSummary`、`ReadOnlyEcosystemDiscoverySummary`、`CapabilityReconciliationReport` 和 `DerivedMaterialPolicy`。 |
| 读写类别是否正确 | pass | 本部分无业务 Command;读取为 Query;刷新 / 重建 / 对账为 Job;派生新鲜度变化为 Outbound Event。 |
| 是否误把内部 helper 当 API | pass | scheduler、worker、retry、repository、projection builder 未写成 API。 |
| 是否越界 | pass | 未让 projection、export、discovery、reconciliation 反写 identity / registry / descriptor / seam / relation / exposure。 |
| Step 8 承接 | pass | consumer view refresh、projection rebuild、export prepare、ecosystem discovery rebuild 和 reconciliation 需要进入 Step 8 flow。 |

### 6.8 外部引用与安全摘要支撑

#### 6.8.1 本部分接口判断:先思考

问题回答:

- 本部分负责外部 ref、safe summary、consumer ref、observability / audit ref 和 event collaboration boundary 的正式支撑语义。
- reference state 维护属于 Command 或 Operations Job:外部输入变化可先进入 Inbound Event Consumer,再通过 policy 检查形成 resolved / unresolved / stale / invalid / forbidden 状态。
- reference state、external document ref、runtime / tools consumer ref、SDK consumer ref、observability / audit ref 的读取属于 Query。
- `CapabilityAccessEventCollaborationPort` 是 external port skeleton,用于约束出站事件协作和 handoff 关系,不定义 topic、payload 或 adapter。

取舍:

- 保留 3 个 Command、5 个 Query、3 个 Inbound Event Consumer、2 个 Operations Job 和 6 个 External Port Skeleton。
- 保留 `ReferenceResolutionChanged` 作为出站事件候选,用于通知核心组件和派生维护 ref 状态变化。
- 不把 external source resolver、bus adapter、secret store adapter、SDK client 或 observability exporter 写成业务实现。
- 事件协作只传播已成立事实或维护状态,投递失败不回滚 truth。

#### 6.8.2 Command API 骨架

| Command | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `RecordReferenceResolutionState` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;reference candidate;`ReferenceKind`;resolution value;reason。 | `ReferenceResolutionCommandResult`;`ReferenceResolutionStateRef`。 | 记录外部 ref resolved / unresolved / stale / invalid / unavailable / forbidden 状态。 | `ReferenceResolutionState`;reference trace marker。 |
| `RegisterExternalDocumentReference` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;external document input;document kind;descriptor support scope。 | `ExternalDocumentReferenceCommandResult`;`ExternalDocumentRef`。 | 建立外部协议 / 标准 / 文档 ref,不保存文档正文。 | `ExternalDocumentRef`;`ReferenceResolutionState`。 |
| `RegisterCapabilityConsumerReference` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;consumer input;consumer kind;exposure scope。 | `CapabilityConsumerReferenceCommandResult`;`RuntimeToolsConsumerRef` 或 `SdkExposureConsumerRef`。 | 建立 runtime / tools / SDK consumer ref,供 controlled view 和 exposure handoff 使用。 | `RuntimeToolsConsumerRef` 或 `SdkExposureConsumerRef`;`ReferenceResolutionState`。 |

#### 6.8.3 Query API 骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetReferenceResolutionState` | `ActorContext`;`QueryMetadata`;reference id / kind;scope。 | `ReferenceResolutionStateView`;failure / freshness surface。 | `ReferenceResolutionState`;`ReferenceResolutionPolicy`。 | 不自动刷新外部 ref,不补造外部 truth。 |
| `GetExternalDocumentReference` | `ActorContext`;`QueryMetadata`;`ExternalDocumentRef`;document support scope。 | `ExternalDocumentRefView`;resolution surface。 | `ExternalDocumentRef`;reference state。 | 不返回外部文档正文或协议 schema 全集。 |
| `GetRuntimeToolsConsumerReference` | `ActorContext`;`QueryMetadata`;`RuntimeToolsConsumerRef`;consumer scope。 | `RuntimeToolsConsumerRefView`;resolution surface。 | `RuntimeToolsConsumerRef`;reference state。 | 不读取 runtime / tools execution state。 |
| `GetSdkExposureConsumerReference` | `ActorContext`;`QueryMetadata`;`SdkExposureConsumerRef`;exposure scope。 | `SdkExposureConsumerRefView`;resolution surface。 | `SdkExposureConsumerRef`;reference state。 | 不返回 SDK client、binding、package 或 cache。 |
| `GetObservabilityAuditReference` | `ActorContext`;`QueryMetadata`;`ObservabilityAuditRef`;audit material scope。 | `ObservabilityAuditRefView`;resolution surface。 | `ObservabilityAuditRef`;reference state。 | 不读取 log / metric / trace / alert / audit store 正文。 |

#### 6.8.4 Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `ConsumeExternalCapabilitySourceReferenceChanged` | 外部 MCP / A2A / API 来源或候选发现边界 | event envelope;source event id;dedup key;`ExternalCapabilitySourceRef`;source kind;trace context。 | reference state stale / unresolved / candidate accepted;必要时形成 identity intake command intent。 | 不直接创建 `CapabilityIdentity`,不保存外部来源正文。 |
| `ConsumeAuditMaterialReferenceChanged` | `L4-observability` 或审计材料边界 | event envelope;source event id;dedup key;`ObservabilityAuditRef`;safe summary ref;trace context。 | `ObservabilityAuditRef` resolution update;handoff pending / unavailable surface。 | 不复制 observability store 或 raw audit log。 |
| `ConsumeExternalDocumentReferenceChanged` | 外部协议 / 标准 / 文档来源边界 | event envelope;source event id;dedup key;`ExternalDocumentRef`;document change summary;trace context。 | external document ref stale / resolved / forbidden;descriptor support may require review。 | 不接收文档正文、API spec 全文或 provider runtime contract。 |

#### 6.8.5 Operations Job 骨架

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `RefreshExternalReferenceResolution` | `JobMetadata`;reference scope;allowed reference kinds;run idempotency key。 | updated `ReferenceResolutionState`;refresh summary。 | 只刷新 ref 状态,不得创建 identity、descriptor、seam、relation 或 exposure truth。 |
| `RepairCapabilityAccessEventCollaboration` | `JobMetadata`;event collaboration scope;pending event refs;run idempotency key。 | delivery / handoff status summary。 | 只维护协作投递 / handoff 状态,失败不回滚本仓 truth。 |

#### 6.8.6 External Port Skeleton

| Port | 方向 | 输入骨架 | 输出骨架 | 边界 |
|---|---|---|---|---|
| `ExternalCapabilitySourceReferencePort` | inbound reference | source locator summary;source kind;trace context。 | `ExternalCapabilitySourceRef`;resolution surface。 | 不执行外部 MCP / A2A / API 调用,不保存响应正文。 |
| `GovernanceResultReferencePort` | inbound reference / event | governance result ref;policy result ref;allowed safe summary。 | `GovernanceResultRef`;resolution surface。 | 不读取 approval / Policy / shared_rules truth 正文。 |
| `MethodAssetReferencePort` | inbound reference / event | method asset ref;body-free summary;trace context。 | `MethodAssetRef`;resolution surface。 | 不保存 method body 或 version body。 |
| `CapabilityConsumerReferencePort` | inbound / query support | runtime / tools / SDK consumer input;consumer scope。 | `RuntimeToolsConsumerRef` 或 `SdkExposureConsumerRef`;resolution surface。 | 不读取 execution state 或 SDK client state。 |
| `ObservabilityAuditHandoffPort` | outbound handoff / inbound ref | traceability summary ref;observability / audit ref;handoff scope。 | handoff accepted / unavailable summary。 | 不写 observability store,不复制 audit log。 |
| `CapabilityAccessEventCollaborationPort` | outbound event collaboration | fact ref;change record ref;impact summary ref;trace context。 | collaboration intent / pending delivery / delivered surface。 | 不定义 topic、payload、outbox、relay、retry 或 bus adapter。 |

#### 6.8.7 Outbound Event 候选

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `ReferenceResolutionChanged` | reference Command / Job / inbound consumer | core components、trace / impact、derived maintenance、event collaboration port | 传播 reference state、reference kind 和 trace context,不补造外部 truth。 |

#### 6.8.8 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 对象能力是否承接 | pass | 接口回指 `ReferenceResolutionState`、`ReferenceResolutionPolicy`、`ExternalDocumentRef`、`RuntimeToolsConsumerRef`、`SdkExposureConsumerRef`、`ObservabilityAuditRef` 和 `CapabilityAccessEventCollaborationPort`。 |
| 读写类别是否正确 | pass | reference state 维护为 Command / Job,读取为 Query,外部事实到达为 Inbound Consumer,ref 状态变化为 Outbound Event,相邻接缝为 Port skeleton。 |
| 是否误把内部 helper 当 API | pass | resolver implementation、bus adapter、secret store adapter、SDK client、observability exporter 未写成正式 API。 |
| 是否越界 | pass | 未保存外部正文、secret 正文、governance truth、method body、execution payload、SDK client 或 audit store。 |
| Step 8 承接 | pass | reference refresh、event collaboration、audit handoff 和外部 source changed consumer 需要进入 Step 8 flow。 |

---

## 7. 分类总表

### 7.1 Command API 总表

所有 Command 输入默认包含 `ActorContext`、`CommandMetadata`、`IdempotencyKey` 和 trace context。表中不再重复展开完整上下文字段。

| Command | 主要组成部分 | 输入骨架 | 输出骨架 | 写入结果 |
|---|---|---|---|---|
| `EstablishCapabilityAccessContext` | 能力身份与接入语境 | `ExternalCapabilitySourceRef`;`CapabilityAccessIntakeContext` | `CapabilityIdentityCommandResult`;identity / review refs | `CapabilityIdentity`;`CapabilityAccessReviewFact`;`CapabilityIdentityChangeRecord` |
| `CorrectCapabilityIdentity` | 能力身份与接入语境 | `CapabilityIdentityRef`;`IdentityCorrectionReason` | identity change summary | `CapabilityIdentity`;`CapabilityIdentityChangeRecord` |
| `RetireCapabilityIdentity` | 能力身份与接入语境 | `CapabilityIdentityRef`;`RetirementReason` | retirement summary | `CapabilityIdentity`;`CapabilityIdentityChangeRecord` |
| `RecordCapabilityAccessReviewFact` | 能力身份与接入语境 | `CapabilityIdentityRef`;`AccessReviewContext`;`AccessRiskSummary` | review fact ref | `CapabilityAccessReviewFact`;trace source |
| `RegisterCapabilityInRegistry` | 注册目录与生命周期 | `CapabilityIdentityRef`;initial lifecycle intent | registry entry ref | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryChangeRecord` |
| `UpdateRegistryLifecycleState` | 注册目录与生命周期 | registry entry ref;target lifecycle state;reason | lifecycle change summary | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryChangeRecord` |
| `UpdateRegistryVisibilityBasis` | 注册目录与生命周期 | registry entry ref;`RegistryVisibilityBasis`;reason | visibility command result | `CapabilityRegistryEntry`;`RegistryChangeRecord` |
| `RetireCapabilityRegistryEntry` | 注册目录与生命周期 | registry entry ref;retirement reason | retirement summary | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryChangeRecord` |
| `EstablishAdapterDescriptor` | 接入描述与风险摘要 | identity / registry refs;source ref;document ref summary;descriptor intent | descriptor ref | `AdapterDescriptor`;`DescriptorChangeRecord` |
| `ReplaceAdapterDescriptor` | 接入描述与风险摘要 | descriptor ref;replacement summary;reason | replacement summary | `AdapterDescriptor`;`DescriptorChangeRecord` |
| `RecordDescriptorRiskConstraintSummary` | 接入描述与风险摘要 | descriptor ref;risk / constraint input;review fact ref | risk summary ref | `DescriptorRiskConstraintSummary`;`DescriptorChangeRecord` |
| `AttachDescriptorSecretReference` | 接入描述与风险摘要 | descriptor ref;`SecretRef`;`SecretHandlingSafeSummary` | safe summary ref | `SecretRef` binding;`SecretHandlingSafeSummary`;`DescriptorChangeRecord` |
| `AttachGovernanceSeamRelation` | 治理与方法关系 | identity / registry refs;`GovernanceResultRef`;safe summary ref | seam relation ref | `GovernanceSeamRelation`;`GovernanceSeamChangeRecord` |
| `ReplaceGovernanceSeamRelation` | 治理与方法关系 | seam relation ref;next governance ref;reason | replacement summary | `GovernanceSeamRelation`;`GovernanceSeamChangeRecord` |
| `ExpireGovernanceSeamRelation` | 治理与方法关系 | seam relation ref;expiry reason | expired summary | `GovernanceSeamRelation`;`GovernanceSeamChangeRecord` |
| `AttachCapabilityMethodRelation` | 治理与方法关系 | identity ref;`MethodAssetRef`;relation scope;body-free summary | method relation ref | `CapabilityMethodBodyFreeRelation`;`MethodRelationChangeRecord` |
| `RemoveCapabilityMethodRelation` | 治理与方法关系 | method relation ref;removal reason | removed summary | `CapabilityMethodBodyFreeRelation`;`MethodRelationChangeRecord` |
| `EstablishFormalExposureBoundary` | 正式暴露与受控消费 | registry / descriptor / seam refs;optional method relation ref;exposure intent | formal exposure ref | `FormalExposureBoundary`;`FormalVisibilityApplicability`;`CapabilityExposureChangeRecord` |
| `UpdateFormalVisibilityApplicability` | 正式暴露与受控消费 | exposure ref;visibility / applicability intent;reason | visibility summary | `FormalVisibilityApplicability`;`CapabilityExposureChangeRecord` |
| `SuspendFormalExposureBoundary` | 正式暴露与受控消费 | exposure ref;suspension reason | suspended summary | `FormalExposureBoundary`;`CapabilityExposureChangeRecord` |
| `RetireFormalExposureBoundary` | 正式暴露与受控消费 | exposure ref;retirement reason | retired summary | `FormalExposureBoundary`;`FormalVisibilityApplicability`;`CapabilityExposureChangeRecord` |
| `RecordCapabilityChangeImpactFact` | 追溯、变化与影响 | source change record refs;impact summary;impact scope | impact fact ref | `CapabilityChangeImpactFact`;traceability link |
| `RecordTraceabilityHandoffSummary` | 追溯、变化与影响 | traceability ref;handoff scope;optional audit ref | handoff summary ref | traceability handoff marker |
| `RecordReferenceResolutionState` | 外部引用与安全摘要支撑 | reference candidate;reference kind;resolution value;reason | reference state ref | `ReferenceResolutionState` |
| `RegisterExternalDocumentReference` | 外部引用与安全摘要支撑 | external document input;document kind;descriptor support scope | external document ref | `ExternalDocumentRef`;`ReferenceResolutionState` |
| `RegisterCapabilityConsumerReference` | 外部引用与安全摘要支撑 | consumer input;consumer kind;exposure scope | runtime / SDK consumer ref | `RuntimeToolsConsumerRef` 或 `SdkExposureConsumerRef`;`ReferenceResolutionState` |

### 7.2 Query API 总表

所有 Query 输入默认包含 `ActorContext`、`QueryMetadata`、scope / subject / consumer context 和 consistency hint。

| Query | 主要组成部分 | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|---|
| `GetCapabilityIdentity` | 能力身份与接入语境 | identity ref | `CapabilityIdentityView` | identity truth + source ref + review summary | 不刷新来源 ref |
| `SearchCapabilityIdentities` | 能力身份与接入语境 | identity search scope;page | identity search page | identity read model | 不作为 registry truth |
| `GetCapabilityAccessReviewFact` | 能力身份与接入语境 | review fact ref 或 identity ref | review fact view | review fact truth | 不读取 governance approval |
| `GetCapabilityRegistryEntry` | 注册目录与生命周期 | registry entry ref | registry entry view | registry truth | 不补建 descriptor |
| `ListCapabilityRegistryEntries` | 注册目录与生命周期 | registry scope;filters;page | registry entry page | registry truth summary | 不等同 search projection |
| `GetRegistryVisibilitySemantics` | 注册目录与生命周期 | registry entry ref 或 identity ref | registry visibility view | visibility policy / registry state | 不形成 formal exposure |
| `GetAdapterDescriptor` | 接入描述与风险摘要 | descriptor ref 或 capability ref | descriptor view | descriptor truth | 不返回 provider runtime config |
| `GetDescriptorRiskConstraintSummary` | 接入描述与风险摘要 | descriptor ref;summary scope | risk summary view | risk summary truth | 不替代 governance approval |
| `GetDescriptorSecretSafeSummary` | 接入描述与风险摘要 | descriptor ref 或 secret ref | secret safe summary view | secret ref + safe summary | 不提供 secret value |
| `ListDescriptorsByCapability` | 接入描述与风险摘要 | capability identity ref;page | descriptor page | descriptor truth summary | 不形成 provider lookup truth |
| `GetGovernanceSeamRelation` | 治理与方法关系 | seam ref 或 capability ref | seam relation view | seam relation + governance ref | 不读取 governance truth |
| `GetAccessGovernanceSeparation` | 治理与方法关系 | identity ref 或 review fact ref | separation view | review fact + seam relation | 不把 review 当 approval |
| `GetCapabilityMethodRelation` | 治理与方法关系 | relation ref 或 capability / method ref | method relation view | body-free relation + method ref | 不读取 method body |
| `ListCapabilityRelations` | 治理与方法关系 | capability ref;relation kind;page | relation page | seam / method relation read model | 不刷新 external refs |
| `GetFormalExposureBoundary` | 正式暴露与受控消费 | exposure ref 或 capability ref | formal exposure view | exposure truth | 不返回 SDK client config |
| `GetFormalVisibilityApplicability` | 正式暴露与受控消费 | exposure ref;consumer scope | visibility applicability view | formal visibility truth | 不使用 consumer view 反推 |
| `GetControlledConsumerView` | 正式暴露与受控消费 | runtime / SDK consumer ref;capability scope | controlled consumer view | consumer view projection | 只读快照 |
| `ListConsumableCapabilitiesForRuntimeTools` | 正式暴露与受控消费 | runtime / tools consumer ref;scope;page | consumer view page | controlled consumer projection | 不做 execution allow / deny |
| `GetSdkExposureBoundary` | 正式暴露与受控消费 | SDK consumer ref;exposure scope | SDK exposure boundary view | exposure + consumer view | 不定义 SDK package |
| `GetCapabilityAccessTrace` | 追溯、变化与影响 | trace subject ref;page | traceability view | trace records + change records | 不替代 observability |
| `GetCapabilityChangeImpact` | 追溯、变化与影响 | impact fact ref 或 change ref | impact view | impact fact + impact summary | 不读取 execution payload |
| `GetDownstreamConsumptionImpactSummary` | 追溯、变化与影响 | consumer ref;capability ref;change scope | impact summary view | downstream summary | 不拥有下游 truth |
| `GetAuditHandoffTraceSummary` | 追溯、变化与影响 | traceability ref;handoff scope | audit handoff summary view | traceability + audit ref | 不输出 raw audit log |
| `SearchCapabilityDirectory` | 派生维护与只读输出 | directory search scope;filters;page | directory projection page | search / browse projection | 不创建 registry |
| `BrowseCapabilityDirectory` | 派生维护与只读输出 | browse scope;facet intent;page | browse view | directory projection | 不修改 visibility |
| `GetAuditFriendlyExportSummary` | 派生维护与只读输出 | export summary ref 或 audit scope | export summary view | export summary projection | 不拥有 audit store |
| `GetReadOnlyEcosystemDiscoverySummary` | 派生维护与只读输出 | ecosystem context ref;capability scope | discovery summary view | discovery projection | 不形成 marketplace listing |
| `GetCapabilityReconciliationReport` | 派生维护与只读输出 | report ref 或 scope | reconciliation report view | reconciliation report | 不自动修 truth |
| `GetReferenceResolutionState` | 外部引用与安全摘要支撑 | reference id / kind;scope | reference state view | reference state + policy | 不自动刷新 ref |
| `GetExternalDocumentReference` | 外部引用与安全摘要支撑 | external document ref | external document ref view | external document ref + state | 不返回文档正文 |
| `GetRuntimeToolsConsumerReference` | 外部引用与安全摘要支撑 | runtime / tools consumer ref | consumer ref view | consumer ref + state | 不读取 execution state |
| `GetSdkExposureConsumerReference` | 外部引用与安全摘要支撑 | SDK consumer ref | SDK consumer ref view | SDK ref + state | 不返回 SDK client |
| `GetObservabilityAuditReference` | 外部引用与安全摘要支撑 | observability audit ref | audit ref view | audit ref + state | 不读取 observability store |

### 7.3 Inbound Event Consumer 总表

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `ConsumeGovernanceResultReferenceChanged` | `L1-governance` | event envelope;source event id;dedup key;governance result ref;safe summary ref | seam stale / pending 或 update intent | 不创建 governance truth |
| `ConsumeMethodAssetReferenceChanged` | `L3-method-library` | event envelope;source event id;dedup key;method asset ref;body-free summary | relation stale / unresolved 或 update intent | 不保存 method body |
| `ConsumeDownstreamConsumptionImpactReported` | runtime / tools / SDK / product entry | event envelope;source event id;dedup key;consumer ref;impact summary | downstream impact summary accepted / partial / ignored | 不接收 execution payload |
| `ConsumeExternalCapabilitySourceReferenceChanged` | 外部 MCP / A2A / API 来源或候选发现边界 | event envelope;source event id;dedup key;external source ref;source kind | source ref stale / unresolved / candidate accepted | 不直接创建 identity |
| `ConsumeAuditMaterialReferenceChanged` | observability / audit boundary | event envelope;source event id;dedup key;observability audit ref;safe summary ref | audit ref resolution update | 不复制 raw audit log |
| `ConsumeExternalDocumentReferenceChanged` | 外部协议 / 标准 / 文档来源边界 | event envelope;source event id;dedup key;external document ref;change summary | document ref stale / resolved / forbidden | 不接收文档正文 |

### 7.4 Outbound Event 总表

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `CapabilityIdentityChanged` | identity Command | registry、descriptor、seam、relation、exposure、trace / impact | 只传播 identity ref、change kind、trace context。 |
| `CapabilityRegistryChanged` | registry Command / reconciliation result | descriptor、exposure、derived maintenance、downstream consumers | 不传播 allowlist 或 runtime state。 |
| `AdapterDescriptorChanged` | descriptor Command | exposure、consumer view refresh、trace / impact | 由 descriptor change record 产生,不携带 provider runtime。 |
| `GovernanceSeamRelationChanged` | governance seam Command | exposure、trace / impact、derived maintenance | 不携带 governance truth。 |
| `CapabilityMethodRelationChanged` | method relation Command | exposure、trace / impact、consumer view | 不携带 method body。 |
| `FormalExposureBoundaryChanged` | exposure Command | runtime、tools、SDK、derived maintenance、event collaboration port | 不传播 runtime execution state。 |
| `ControlledConsumerViewAvailabilityChanged` | consumer view refresh job | runtime、tools、SDK、console candidates | 传播 view freshness,不作为 formal truth。 |
| `CapabilityChangeImpactIdentified` | impact Command / core truth change flow | downstream consumers、observability candidates、derived maintenance | 不携带 downstream execution payload。 |
| `DerivedMaterialRefreshed` | derived maintenance Job | query consumers、observability candidates | 传播 projection / export / discovery / report freshness。 |
| `ReferenceResolutionChanged` | reference Command / Job / consumer | core components、trace / impact、event collaboration | 传播 reference state,不补造外部 truth。 |

### 7.5 Operations Job 总表

| Job | 主要组成部分 | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|---|
| `RunCapabilityRegistryReconciliation` | 注册目录与生命周期 | registry scope;source truth refs | `CapabilityReconciliationReport` | 不创建或修正 registry entry。 |
| `RefreshControlledConsumerView` | 派生维护与只读输出 | exposure ref;consumer scope | refreshed `ControlledConsumerView` | 不改写 formal exposure。 |
| `RebuildDirectorySearchBrowseProjection` | 派生维护与只读输出 | registry / descriptor / exposure source refs | `DirectorySearchBrowseProjection` | 不补造 registry。 |
| `PrepareAuditFriendlyExportSummary` | 派生维护与只读输出 | traceability scope;allowed export scope | `AuditFriendlyExportSummary` | 不复制 audit store。 |
| `RebuildReadOnlyEcosystemDiscoverySummary` | 派生维护与只读输出 | exposure ref;ecosystem context ref | `ReadOnlyEcosystemDiscoverySummary` | 不创建 marketplace listing。 |
| `RunDerivedMaterialReconciliation` | 派生维护与只读输出 | derived material scope;source truth refs | `CapabilityReconciliationReport` | 报告不修 truth。 |
| `RefreshExternalReferenceResolution` | 外部引用与安全摘要支撑 | reference scope;allowed reference kinds | updated `ReferenceResolutionState` | 不创建核心 truth。 |
| `RepairCapabilityAccessEventCollaboration` | 外部引用与安全摘要支撑 | event collaboration scope;pending event refs | delivery / handoff status summary | 投递失败不回滚 truth。 |

### 7.6 External Port Skeleton 总表

| Port | 方向 | 主要用途 | 承接对象 | 禁止事项 |
|---|---|---|---|---|
| `ExternalCapabilitySourceReferencePort` | inbound reference | 承接外部 MCP / A2A / API source ref。 | `ExternalCapabilitySourceRef`;`ReferenceResolutionState` | 不执行外部调用,不保存响应正文。 |
| `GovernanceResultReferencePort` | inbound reference / event | 承接 governance result / policy result ref 与 allowed safe summary。 | `GovernanceResultRef`;`ReferenceResolutionState` | 不读取 approval / Policy / shared_rules 正文。 |
| `MethodAssetReferencePort` | inbound reference / event | 承接 method asset ref 与 body-free summary。 | `MethodAssetRef`;`ReferenceResolutionState` | 不保存 method body。 |
| `CapabilityConsumerReferencePort` | inbound / query support | 承接 runtime / tools / SDK consumer ref。 | `RuntimeToolsConsumerRef`;`SdkExposureConsumerRef` | 不读取 execution state 或 SDK client state。 |
| `ObservabilityAuditHandoffPort` | outbound handoff / inbound ref | 交接 traceability summary 和 observability / audit ref。 | `ObservabilityAuditRef`;`AuditFriendlyExportSummary` | 不复制 audit store。 |
| `CapabilityAccessEventCollaborationPort` | outbound event collaboration | 输出已成立 access fact 变化协作边界。 | `CapabilityAccessTraceabilityRecord`;`CapabilityChangeImpactFact`;change records | 不定义 topic、payload、outbox、relay、retry。 |

---

## 8. Step 8 / Step 9 反查

### 8.1 Step 8 关键处理流反查

| 预计处理流 | 来源接口 | 必须使用的 Step 6 对象 | 说明 |
|---|---|---|---|
| 外部能力接入语境建立 | `EstablishCapabilityAccessContext` | `CapabilityIdentity`;`ExternalCapabilitySourceRef`;`CapabilityAccessReviewFact`;`CapabilityIdentityPolicy`;`CapabilityIdentityChangeRecord` | 不执行外部 MCP / A2A / API 调用。 |
| identity 更正 / 退役 | `CorrectCapabilityIdentity`;`RetireCapabilityIdentity` | `CapabilityIdentity`;`CapabilityIdentityPolicy`;`CapabilityIdentityChangeRecord`;`CapabilityAccessTraceabilityRecord` | 消费面不得隐式改写身份。 |
| registry 纳入 / 生命周期变化 | `RegisterCapabilityInRegistry`;`UpdateRegistryLifecycleState`;`RetireCapabilityRegistryEntry` | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryVisibilityPolicy`;`RegistryChangeRecord` | registry 不退化为 allowlist。 |
| descriptor 建立 / 替换 / 风险摘要维护 | `EstablishAdapterDescriptor`;`ReplaceAdapterDescriptor`;`RecordDescriptorRiskConstraintSummary`;`AttachDescriptorSecretReference` | `AdapterDescriptor`;`DescriptorRiskConstraintSummary`;`SecretRef`;`SecretHandlingSafeSummary`;`DescriptorBoundaryPolicy`;`DescriptorChangeRecord` | descriptor 不成为 ProviderContract。 |
| governance seam 挂接 / 失效 | `AttachGovernanceSeamRelation`;`ReplaceGovernanceSeamRelation`;`ExpireGovernanceSeamRelation`;`ConsumeGovernanceResultReferenceChanged` | `GovernanceSeamRelation`;`GovernanceResultRef`;`GovernanceSeamPolicy`;`GovernanceSeamChangeRecord`;`ReferenceResolutionState` | seam 不生成 governance truth。 |
| capability-method relation 建立 / 移除 | `AttachCapabilityMethodRelation`;`RemoveCapabilityMethodRelation`;`ConsumeMethodAssetReferenceChanged` | `CapabilityMethodBodyFreeRelation`;`MethodAssetRef`;`MethodRelationBoundaryPolicy`;`MethodRelationChangeRecord`;`ReferenceResolutionState` | relation 必须 body-free。 |
| formal exposure 建立 / 调整 / 退役 | `EstablishFormalExposureBoundary`;`UpdateFormalVisibilityApplicability`;`SuspendFormalExposureBoundary`;`RetireFormalExposureBoundary` | `FormalExposureBoundary`;`FormalVisibilityApplicability`;`FormalExposurePolicy`;`CapabilityExposureChangeRecord` | exposure 来源必须可解释。 |
| controlled consumer view 构建 / 刷新 | `GetControlledConsumerView`;`RefreshControlledConsumerView` | `ControlledConsumerView`;`ConsumerViewFreshnessPolicy`;`RuntimeToolsConsumerRef`;`SdkExposureConsumerRef`;`DerivedMaterialPolicy` | refresh 不反写 formal exposure。 |
| capability change / impact 解释 | `RecordCapabilityChangeImpactFact`;`ConsumeDownstreamConsumptionImpactReported` | `CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary`;`RuntimeToolsConsumerRef`;`SdkExposureConsumerRef` | 下游失败不回滚 truth。 |
| traceability / audit handoff | `GetCapabilityAccessTrace`;`RecordTraceabilityHandoffSummary`;`PrepareAuditFriendlyExportSummary` | `CapabilityAccessTraceabilityRecord`;change records;`ObservabilityAuditRef`;`AuditFriendlyExportSummary` | 不保存 raw audit log。 |
| search / browse projection rebuild | `SearchCapabilityDirectory`;`RebuildDirectorySearchBrowseProjection` | `DirectorySearchBrowseProjection`;`CapabilityRegistryEntry`;`AdapterDescriptor`;`FormalExposureBoundary`;`DerivedMaterialPolicy` | projection 只读可重建。 |
| read-only ecosystem discovery | `GetReadOnlyEcosystemDiscoverySummary`;`RebuildReadOnlyEcosystemDiscoverySummary` | `ReadOnlyEcosystemDiscoverySummary`;`FormalExposureBoundary`;`DerivedMaterialPolicy` | 不形成 marketplace listing。 |
| reference resolution / event collaboration | `RecordReferenceResolutionState`;`RefreshExternalReferenceResolution`;`RepairCapabilityAccessEventCollaboration`;external port skeleton | `ReferenceResolutionState`;`ReferenceResolutionPolicy`;all ref objects;`CapabilityAccessEventCollaborationPort` | 不定义 payload / topic / adapter。 |

### 8.2 Step 9 状态触发反查

| 状态主题 | 触发接口 | Step 6 对象来源 |
|---|---|---|
| capability identity lifecycle | `EstablishCapabilityAccessContext`;`CorrectCapabilityIdentity`;`RetireCapabilityIdentity` | `CapabilityIdentity`;`CapabilityIdentityChangeRecord` |
| access review fact lifecycle | `RecordCapabilityAccessReviewFact` | `CapabilityAccessReviewFact` |
| external source / reference resolution | inbound ref consumers;`RecordReferenceResolutionState`;`RefreshExternalReferenceResolution` | `ExternalCapabilitySourceRef`;`ReferenceResolutionState`;`ReferenceResolutionPolicy` |
| registry lifecycle | `RegisterCapabilityInRegistry`;`UpdateRegistryLifecycleState`;`RetireCapabilityRegistryEntry` | `CapabilityRegistryEntry`;`RegistryLifecycleState` |
| descriptor lifecycle | `EstablishAdapterDescriptor`;`ReplaceAdapterDescriptor` | `AdapterDescriptor`;`DescriptorChangeRecord` |
| risk / safe summary availability | `RecordDescriptorRiskConstraintSummary`;`AttachDescriptorSecretReference` | `DescriptorRiskConstraintSummary`;`SecretHandlingSafeSummary` |
| governance seam lifecycle | seam commands;`ConsumeGovernanceResultReferenceChanged` | `GovernanceSeamRelation`;`GovernanceResultRef` |
| method relation lifecycle | relation commands;`ConsumeMethodAssetReferenceChanged` | `CapabilityMethodBodyFreeRelation`;`MethodAssetRef` |
| formal exposure lifecycle | exposure commands | `FormalExposureBoundary`;`FormalVisibilityApplicability` |
| consumer view freshness | `RefreshControlledConsumerView`;consumer view queries | `ControlledConsumerView`;`ConsumerViewFreshnessPolicy` |
| traceability / handoff | `RecordTraceabilityHandoffSummary`;audit export job | `CapabilityAccessTraceabilityRecord`;`AuditFriendlyExportSummary` |
| change impact | `RecordCapabilityChangeImpactFact`;`ConsumeDownstreamConsumptionImpactReported` | `CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary` |
| derived material freshness | derived maintenance jobs | `DirectorySearchBrowseProjection`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary`;`CapabilityReconciliationReport` |

---

## 9. 跨接口一致性审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| 是否存在接口无人承接 | pass。所有接口均归属到 Step 5 的 8 个主要组成部分。 | Step 8 继续按本归属展开 flow。 |
| 是否存在对象能力没有入口 | pass。Step 6 中 truth / relation / projection / ref / report / port / job 主语均有 Command、Query、Event、Job 或 Port 承接。 | Step 12 handoff 时继续复核。 |
| 是否存在读写类别混淆 | pass。Command、Query、Inbound、Outbound、Job、Port 已分开。 | Query 和 Job 均不得修核心 truth。 |
| 是否存在 owner 冲突 | pass。`ControlledConsumerView` 业务 owner 为正式暴露与受控消费,刷新 job owner 为派生维护与只读输出;`ObservabilityAuditRef` owner 为外部引用与安全摘要支撑。 | Step 8 保持 owner 分离。 |
| 是否存在 forbidden body 入仓 | pass。接口输入输出均以 ref、safe summary、view、report 或 state 表达。 | `03` 不得在 DTO / event payload 中恢复正文。 |
| 是否存在旧接口名回流 | pass。旧 `QueryCapabilities`、ProviderContract、KMS、cost、allow / deny、policy refresh 均被排除或拆解。 | 旧材料只保留在 §10。 |
| 是否足以支撑 Step 8 | pass。关键处理流都有来源接口和对象反查。 | 用户确认后进入 Step 8。 |

---

## 10. 旧材料差异审计

| 旧材料口径 | 本轮处理 | 原因 |
|---|---|---|
| `QueryCapabilities` 作为 runtime / tools 高频查询和 allow / deny 主接口 | 不继承。拆为 formal exposure Command、controlled consumer view Query、consumer view refresh Job 和 outbound event。 | 旧接口混合 formal exposure truth、consumer view、policy decision 和 runtime enforcement。 |
| `RegisterProvider` / `ProviderContract` / `RotateProviderSecret` / `UpdateQuota` | 不继承。由 adapter descriptor、secret ref、safe summary 和 external reference support 分层替代。 | 旧接口把 provider runtime、secret、quota、route、cost、failover 和 descriptor 混在一起。 |
| `RefreshCapabilityDecision` / policy refresh / shared_rules allow-deny | 不继承。governance seam 只承接 `GovernanceResultRef` 和 safe summary。 | governance approval / Policy / shared_rules truth 属于 `L1-governance`。 |
| `RecordCost` / `RecordDeniedInvocationAudit` / cost event | 排除。 | cost / billing、runtime invocation 和 observability audit store 不归本仓。 |
| KMS / Vault adapter API | 排除为业务接口。 | 本仓只保存 `SecretRef` 和 `SecretHandlingSafeSummary`,不实现 secrets 平台。 |
| provider lookup / metadata output / marketplace metadata | 不继承为核心接口。只保留 controlled consumer view、directory projection 和 read-only ecosystem discovery。 | provider lookup 会靠近 runtime provider state;marketplace listing / transaction 不归本仓。 |
| 旧 `03` 的 Rust service / repo / projection / DTO / event 文件结构 | 不继承。 | 当前 Step 7 只做概要接口骨架,`03` 后续必须按新版 `02` 重新展开。 |

| Blocker ID | 位置 | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| `CH-HLD-INTERFACE-001` | 旧 `02/03` 接口主线 | resolved_for_step_7 | 旧材料把 QueryCapabilities、ProviderContract、KMS / Vault、cost / audit、allow / deny、policy refresh、provider lookup 和 runtime/tools execution 混入接口主线。 | Step 7 已按新版 Step 5/6 重建 Command / Query / Event / Job / Port 骨架,旧接口名仅作 historical material。 |

---

## 11. 回填草稿

以下内容供 Step 14 装配正式 `02-概要设计.md` §7 使用。Step 14 装配前不得直接修改正式 `02-概要设计.md`。

```md
## 7. API / 接口骨架

> 校准来源:
> - `design-calibration/02_hld_step_07_api_interface_skeleton.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/02_hld_step_07_api_interface_skeleton.md` 的“接口分类与候选池”“按主要组成部分组织的接口骨架”“分类总表”“Step 8 / Step 9 反查”和“跨接口一致性审计”小节,了解接口如何从 Step 5 组成部分和 Step 6 对象推导。

### 7.1 接口分类说明

本仓接口分为 Command API、Query API、Inbound Event Consumer、Outbound Event、Operations Job 和 External Port Skeleton:

- Command API:显式改写 capability access truth、relation、formal exposure、history / change record 或 reference support。
- Query API:只读取 truth summary、projection、consumer view、safe summary、trace、impact、reference state 或 report。
- Inbound Event Consumer:接收外部已成立事实线索,转为本地 ref、safe summary、pending input 或 impact summary。
- Outbound Event:传播本仓已提交事实或派生维护状态。
- Operations Job:基于已持久化 truth、ref 和 safe summary 维护派生材料、对账和 handoff。
- External Port Skeleton:表达相邻仓和外部系统的概要接缝,不定义 transport、topic、payload 或 adapter 实现。

### 7.2 Command API 骨架表

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `EstablishCapabilityAccessContext` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`ExternalCapabilitySourceRef`;`CapabilityAccessIntakeContext` | `CapabilityIdentityCommandResult` | 建立接入语境、identity 和初始审查事实 | `CapabilityIdentity`;`CapabilityAccessReviewFact`;`CapabilityIdentityChangeRecord` |
| `RegisterCapabilityInRegistry` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`CapabilityIdentityRef`;lifecycle intent | `CapabilityRegistryCommandResult` | 将稳定 identity 纳入 registry | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryChangeRecord` |
| `EstablishAdapterDescriptor` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;identity / registry / source refs;descriptor intent | `AdapterDescriptorCommandResult` | 建立能力接入描述 | `AdapterDescriptor`;`DescriptorChangeRecord` |
| `AttachGovernanceSeamRelation` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;capability refs;`GovernanceResultRef` | `GovernanceSeamCommandResult` | 建立 capability 与治理结果接缝 | `GovernanceSeamRelation`;`GovernanceSeamChangeRecord` |
| `AttachCapabilityMethodRelation` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`CapabilityIdentityRef`;`MethodAssetRef` | `CapabilityMethodRelationCommandResult` | 建立 body-free method relation | `CapabilityMethodBodyFreeRelation`;`MethodRelationChangeRecord` |
| `EstablishFormalExposureBoundary` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;registry / descriptor / seam refs | `FormalExposureCommandResult` | 建立服务端 formal exposure | `FormalExposureBoundary`;`FormalVisibilityApplicability`;`CapabilityExposureChangeRecord` |
| `RecordCapabilityChangeImpactFact` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;source change refs;impact summary | `CapabilityChangeImpactCommandResult` | 记录变化与消费影响事实 | `CapabilityChangeImpactFact`;traceability link |
| `RecordReferenceResolutionState` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;reference candidate;resolution value | `ReferenceResolutionCommandResult` | 记录外部 ref 解析状态 | `ReferenceResolutionState` |

### 7.3 Query API 骨架表

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetCapabilityIdentity` | `ActorContext`;`QueryMetadata`;identity ref | `CapabilityIdentityView` | identity truth + source ref | 不刷新来源 ref |
| `GetCapabilityRegistryEntry` | `ActorContext`;`QueryMetadata`;registry entry ref | `CapabilityRegistryEntryView` | registry truth | 不补建 descriptor |
| `GetAdapterDescriptor` | `ActorContext`;`QueryMetadata`;descriptor ref | `AdapterDescriptorView` | descriptor truth | 不返回 provider runtime config |
| `GetGovernanceSeamRelation` | `ActorContext`;`QueryMetadata`;seam ref | `GovernanceSeamRelationView` | seam relation + governance ref | 不读取 governance truth |
| `GetCapabilityMethodRelation` | `ActorContext`;`QueryMetadata`;relation ref | `CapabilityMethodRelationView` | body-free relation + method ref | 不读取 method body |
| `GetFormalExposureBoundary` | `ActorContext`;`QueryMetadata`;exposure ref | `FormalExposureBoundaryView` | exposure truth | 不返回 SDK client config |
| `GetControlledConsumerView` | `ActorContext`;`QueryMetadata`;consumer ref;capability scope | `ControlledConsumerView` | consumer view projection | 只读快照,不得反写 exposure |
| `GetCapabilityAccessTrace` | `ActorContext`;`QueryMetadata`;trace subject ref | `CapabilityAccessTraceabilityView` | trace records + change records | 不替代 observability |
| `SearchCapabilityDirectory` | `ActorContext`;`QueryMetadata`;search scope;filters | `DirectorySearchBrowseProjectionPage` | search / browse projection | 不创建 registry |
| `GetReferenceResolutionState` | `ActorContext`;`QueryMetadata`;reference id / kind | `ReferenceResolutionStateView` | reference state + policy | 不自动刷新 ref |

### 7.4 Inbound Event Consumer 骨架表

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `ConsumeGovernanceResultReferenceChanged` | `L1-governance` | event envelope;source event id;dedup key;`GovernanceResultRef`;safe summary ref | seam stale / pending 或 update intent | 不创建 governance truth |
| `ConsumeMethodAssetReferenceChanged` | `L3-method-library` | event envelope;source event id;dedup key;`MethodAssetRef`;body-free summary | relation stale / unresolved 或 update intent | 不保存 method body |
| `ConsumeDownstreamConsumptionImpactReported` | runtime / tools / SDK | event envelope;source event id;dedup key;consumer ref;impact summary | `DownstreamConsumptionImpactSummary` | 不接收 execution payload |
| `ConsumeExternalCapabilitySourceReferenceChanged` | 外部 MCP / A2A / API 来源 | event envelope;source event id;dedup key;source ref | reference state update 或 identity intake intent | 不直接创建 identity |
| `ConsumeAuditMaterialReferenceChanged` | observability / audit boundary | event envelope;source event id;dedup key;audit ref | audit ref resolution update | 不复制 audit store |

### 7.5 Outbound Event 骨架表

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `CapabilityIdentityChanged` | identity Command | registry、descriptor、seam、relation、exposure、trace / impact | 只传播 identity ref、change kind、trace context。 |
| `CapabilityRegistryChanged` | registry Command / reconciliation result | descriptor、exposure、derived maintenance、downstream consumers | 不传播 allowlist 或 runtime state。 |
| `AdapterDescriptorChanged` | descriptor Command | exposure、consumer view refresh、trace / impact | 不携带 provider runtime。 |
| `GovernanceSeamRelationChanged` | governance seam Command | exposure、trace / impact、derived maintenance | 不携带 governance truth。 |
| `CapabilityMethodRelationChanged` | method relation Command | exposure、trace / impact、consumer view | 不携带 method body。 |
| `FormalExposureBoundaryChanged` | exposure Command | runtime、tools、SDK、derived maintenance | 不传播 runtime execution state。 |
| `CapabilityChangeImpactIdentified` | impact Command / core truth change flow | downstream consumers、observability candidates、derived maintenance | 不携带 downstream execution payload。 |

### 7.6 Operations Job 骨架表

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `RunCapabilityRegistryReconciliation` | registry scope;source truth refs | `CapabilityReconciliationReport` | 不创建或修正 registry entry。 |
| `RefreshControlledConsumerView` | exposure ref;consumer scope | refreshed `ControlledConsumerView` | 不改写 formal exposure。 |
| `RebuildDirectorySearchBrowseProjection` | registry / descriptor / exposure source refs | `DirectorySearchBrowseProjection` | 不补造 registry。 |
| `PrepareAuditFriendlyExportSummary` | traceability scope;allowed export scope | `AuditFriendlyExportSummary` | 不复制 audit store。 |
| `RebuildReadOnlyEcosystemDiscoverySummary` | exposure ref;ecosystem context ref | `ReadOnlyEcosystemDiscoverySummary` | 不创建 marketplace listing。 |
| `RefreshExternalReferenceResolution` | reference scope;allowed reference kinds | updated `ReferenceResolutionState` | 不创建核心 truth。 |
| `RepairCapabilityAccessEventCollaboration` | pending event refs;collaboration scope | delivery / handoff status summary | 投递失败不回滚 truth。 |
```

---

## 12. 待确认事项

### 12.1 待确认项处理建议

| 待确认项 | 选项 | 建议 | 理由 | 当前处理 |
|---|---|---|---|---|
| `ControlledConsumerView` 读取接口归属 | A. 正式暴露与受控消费;B. 派生维护与只读输出 | A | view 的业务语义是受控消费,刷新才是派生维护 | 已采用 A |
| `ControlledConsumerView` refresh job 归属 | A. 正式暴露与受控消费;B. 派生维护与只读输出 | B | refresh 是可重建派生维护,不得反写 exposure truth | 已采用 B |
| governance / method ref changed 是否直接改 relation truth | A. 直接改;B. 只形成 stale / pending / command intent | B | 防止 event 绕过 Command 写 relation truth | 已采用 B |
| `CapabilityAccessEventCollaborationPort` 是否写成接口实现 | A. 写 trait / adapter;B. 只写概要 port skeleton | B | Step 7 禁止写 Rust trait、topic、payload、adapter | 已采用 B |
| old `QueryCapabilities` 是否保留兼容名 | A. 保留;B. 排除旧名并拆分语义 | B | 旧名混合 formal exposure、consumer view、policy decision 和 runtime enforcement | 已采用 B |

### 12.2 本 Step 未确认事项

- 具体 HTTP path、RPC method、JSON / proto / CloudEvent schema、error code、DTO 字段全集、transport envelope 和 SDK method 名称仍留给 `03-详细设计.md`。
- Outbound Event 的 topic、payload 字段全集、outbox / relay / retry / consumer group 和投递 SLA 仍留给 `03/05/06/07`。
- `GovernanceResultRef`、`MethodAssetRef`、`SecretHandlingSafeSummary`、`SdkExposureConsumerRef` 的字段强度仍需在 `03` 继续闭口,但不得突破 ref / safe summary / body-free 边界。
- formal exposure / controlled consumer view 的具体读取延迟和传播窗口仍留给 `05/06` 的测试与验收量化。

---

## 13. 进入下一步条件

- 已按 8 个主要组成部分完成 Command / Query / Inbound Event Consumer / Outbound Event / Operations Job / External Port Skeleton 的接口骨架。
- 每个接口均能回指 Step 6 对象、ref、summary、projection、report、policy、state 或 Step 6 明确后移的 port / job 主语。
- 已明确 Command 输入需要 `ActorContext`、`CommandMetadata`、`IdempotencyKey`;Query 输入需要 `ActorContext` / `QueryMetadata`;Inbound Event Consumer 需要 event envelope、source event id、dedup key 和 trace context。
- 已隔离旧 `QueryCapabilities`、`ProviderContract`、KMS / Vault、CostRecord、policy refresh、allow / deny、provider lookup 和 runtime execution gateway 污染。
- 已完成 Step 8 / Step 9 反查,关键处理流和状态触发接口均有来源。
- 正式 `02-概要设计.md` 尚未修改;Step 14 前不得装配正式 §7。

next_allowed_action:

```text
wait_user_review_to_02_step_08
```

当前不需要提交 commit。
