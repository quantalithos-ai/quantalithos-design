# L3-capability-hub 02 概要 Step 9: 状态定义与状态流转

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 9
> 回填章节: `projects/L3-capability-hub/02-概要设计.md` §9 状态定义与状态流转
> 生成日期: 2026-07-09
> 状态: completed_wait_user_review
> 本轮口径: 从 Step 6 的 43 个关键对象、Step 7 的接口骨架和 Step 8 的处理流触发点收束状态集合、迁移方向、禁止迁移和状态传播关系;本步不写状态机代码、数据库状态列、完整错误码、UI 展示规则、outbox / relay 实现、topic、payload 或补偿脚本。

---

## 0. Step 开工确认

| 项 | 内容 |
|---|---|
| 当前文档 | `02-概要设计.md` |
| 当前 Step | Step 9 `状态定义与状态流转` |
| 上一恢复点 | Step 8 `关键处理流 / 重要函数数据流` 已完成并停审 |
| 用户确认 | 用户已回复“同意”,允许从 Step 8 进入 Step 9 |
| 本步正式文档写入 | 不写入正式 `02-概要设计.md`;正式装配仍等待 Step 14 |
| 本步输出文件 | `design-calibration/02_hld_step_09_state_machine.md` |
| flow / ledger 更新 | 本步完成后更新 `02_hld_calibration_flow.md` 和 `project_execution_ledger.md` |
| 旧材料处理 | 旧 `02/03` 中的 ProviderContract、CapabilityDecision、CostRecord、QueryCapabilities、KMS / Vault、policy refresh、runtime execution state 和 outbox relay 只作 historical material / 差异审计输入 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | SOP、书写规范、Step 5~8、正式 `00/01`、参考项目 Step 9 已读取 | pass | 进入状态候选接收。 |
| SOP 问题回答 | done | 9 个 Step 9 问题逐项回答 | pass | 进入状态边界总览。 |
| 状态候选接收 | done | 从 Step 6/7/8 反查状态主题、owner、触发接口和状态集合 | pass | 进入逐组成部分状态定义。 |
| 逐组成部分状态定义 | done | 8 个主要组成部分的状态定义、允许迁移和禁止迁移 | pass | 进入状态图。 |
| 状态流转图 | done | 核心接入事实状态流转图 | pass | 进入允许 / 禁止迁移清单。 |
| 状态传播关系 | done | 状态变化到事件候选、派生材料、下游感知和 handoff 的传播图与表 | pass | 进入停审记录。 |
| 每个组成部分状态停审 | done | 8 个组成部分状态归属停审记录 | pass | 进入跨状态审计。 |
| 跨状态一致性审计 | done | 同名状态、触发覆盖、owner、query / job no-write 和旧材料污染审计 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式 §9 回填草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | Step 10 进入条件 | pass_wait_review | 等待用户确认后进入 Step 10。 |

---

## 2. 必读文档

| 文档 | 已读取内容 | 本步使用方式 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 9 | 要求输出状态定义表、状态流转图、允许 / 禁止迁移、传播关系、按组成部分归属、停审记录和跨状态一致性审计。 | 本文件按 8 个主要组成部分逐个收敛状态,每个状态触发回指 Step 7 / Step 8。 |
| `standards/document/概要设计书写规范.md` §4.9 / §5.3.4 | 状态表格式、状态流转图、状态传播关系图和 ASCII 图统一格式。 | 本文件使用 `text` 代码块、2~5 条关键说明,不写实现细节。 |
| `design-calibration/02_hld_step_05_components_boundary.md` | 已确认 8 个主要组成部分和各部分 capability 的状态线索。 | 状态按 8 个组成部分归属,不新增第 9 个业务组成部分。 |
| `design-calibration/02_hld_step_06_key_objects.md` | 已正式化 43 个关键对象并给出状态集合线索。 | 状态主语必须回指 Step 6 对象;`CapabilityAccessEventCollaborationPort` 作为 Step 7 / 8 后移 port 主语处理。 |
| `design-calibration/02_hld_step_07_api_interface_skeleton.md` | 已完成 Step 9 状态触发接口反查。 | 每个状态迁移的触发动作必须来自 Command、Inbound Event Consumer、Operations Job 或 Event Candidate。 |
| `design-calibration/02_hld_step_08_processing_flows.md` | 已完成 Step 9 状态触发处理流反查。 | 迁移方向只沿 Step 8 flow;Query 不触发持久状态变化,Job 不修核心 truth。 |
| `projects/L3-capability-hub/00-需求文档.md` | 本仓是外部 MCP / A2A / API capability access truth 仓,不拥有 execution、governance truth、method body、SDK client、marketplace listing、secret / KMS、cost / billing。 | 状态集合不得吸收 runtime execution state、governance approval state、method lifecycle、SDK cache state 或 marketplace listing state。 |
| `projects/L3-capability-hub/01-架构设计.md` | 架构已收稳 truth / snapshot / ref / forbidden body 分层、同步 / 异步 / 后台三分和 formal exposure / consumer view 分层。 | 状态传播必须保护 core truth、derived material 和 external ref 的分层。 |
| `projects/L1-governance/design-calibration/02_hld_step_09_state_machine.md` | 参考多状态族、状态定义表、迁移清单和传播关系图粒度。 | 只参考结构密度,不复制 governance 领域状态。 |
| `projects/L1-artifact/design-calibration/02_hld_step_09_state_machine.md` | 参考按状态族分组、正常主线判断和 no-write 边界表达。 | 只参考粒度,不复制 artifact 领域状态。 |
| `projects/L3-method-library/design-calibration/02_hld_step_09_state_machine.md` | 参考 P0 状态机与 outbox / P1 状态分离表达。 | 本仓同样分离核心 capability access truth、derived material 和 event collaboration。 |

---

## 3. SOP 问题回答

### 3.1 本仓有哪些影响主线成立的正式状态?

`L3-capability-hub` 存在正式状态语义,但不是一个单一全局状态机。当前概要层收稳 8 组状态族:

1. 能力身份与接入审查状态。
2. 注册目录与可见性生命周期状态。
3. 接入描述、风险摘要、secret ref 与 safe summary 可用性状态。
4. governance seam 与 method relation 状态。
5. formal exposure、formal visibility 和 controlled consumer view 状态。
6. traceability、change impact、downstream impact 和 handoff 状态。
7. search / browse、export、discovery、reconciliation 等派生材料状态。
8. external reference resolution 与 event collaboration 状态。

这些状态由 Step 6 对象、Step 7 接口和 Step 8 flow 共同承接。`QueryCapabilities`、`ProviderContract`、`CapabilityDecision`、`CostRecord`、runtime execution state、governance approval state、method body lifecycle、SDK client state、marketplace listing state 不进入当前状态主线。

### 3.2 每个状态的含义是什么,是否可以进入正常主线?

正常主线只允许依赖已经成立且符合边界的状态:

- `CapabilityIdentity::active` 才能作为 registry、descriptor、seam、relation 和 exposure 的稳定主体。
- `CapabilityAccessReviewFact::recorded` 可被 descriptor、seam 和 traceability 引用,但不等于 governance approval。
- `RegistryLifecycleState::registered` 表示已纳入目录;`formal_visible` 才表示满足正式可见前置,且仍不代表 runtime allow / deny。
- `AdapterDescriptor::accepted` 和 `DescriptorRiskConstraintSummary::available / partial` 可进入 exposure 前置判断;`partial` 必须显式暴露限制。
- `GovernanceSeamRelation::active` 和 `CapabilityMethodBodyFreeRelation::active` 可以支撑 exposure 判断,但不迁入 governance truth 或 method body。
- `FormalExposureBoundary::accepted / active` 与 `FormalVisibilityApplicability::visible` 共同支撑服务端正式消费边界。
- `ControlledConsumerView::ready` 可直接读;`stale / partial / rebuilding` 只能受限或降级读。
- `ReferenceResolutionState::resolved` 可作为已解析 ref;`unresolved / stale / invalid / unavailable / forbidden` 必须显式影响 pending、partial、unavailable 或 forbidden surface。
- 派生材料 `ready` 可读;`stale / rebuilding / partial / unavailable / inconsistent / rebuild_required / failed` 必须显式暴露,不得反写核心 truth。

### 3.3 哪些接口、事件或动作会触发状态迁移?

| 触发类型 | 触发范围 | 允许改变的状态 |
|---|---|---|
| Command API | `EstablishCapabilityAccessContext`;`RegisterCapabilityInRegistry`;`EstablishAdapterDescriptor`;seam / relation / exposure / impact / reference commands | 核心 truth、relation、summary、reference state、change record 或 trace marker |
| Inbound Event Consumer | governance result ref changed、method asset ref changed、external source ref changed、downstream impact reported、audit / document ref changed | 本地 ref state、stale marker、pending surface、impact summary 或 command intent;不得直接写核心 relation truth |
| Operations Job | registry reconciliation、consumer view refresh、projection rebuild、audit export preparation、discovery rebuild、reconciliation、reference refresh、event collaboration repair | projection、summary、report、freshness、reference resolution 或 handoff / delivery status;不得修 core truth |
| Outbound Event Candidate | 已提交 truth / change record / impact fact / derived freshness 变化 | event candidate / collaboration status;不得重新计算或改写 truth |
| Query API | 所有查询 | 不触发持久状态迁移,只返回当前 truth、snapshot、ref、freshness 或 failure surface |

### 3.4 哪些迁移明确允许,哪些迁移明确禁止?

允许迁移按组成部分列在 §6,按核心清单列在 §8。禁止迁移按组成部分列在 §6,按红线清单列在 §9。概要层只保留主线迁移和红线迁移;详细设计继续展开 enum、guard、expected version、幂等重复、并发冲突、错误映射和事务边界。

### 3.5 状态变化如何影响事件、投影、下游感知或只读供给?

核心 truth / relation / exposure 状态变化必须形成 change record 或 traceability 线索,按需产生 outbound event candidate,并标记受影响 consumer view、directory projection、export summary、ecosystem discovery 或 reconciliation report 为 `stale / rebuild_required / partial / unavailable`。reference 状态变化只能影响 pending / unresolved / forbidden surface、derived material freshness 和 handoff 解释,不得补造外部 truth。event collaboration 失败只影响投递 / handoff 状态,不得回滚本仓 truth。

### 3.6 每个状态属于哪个主要组成部分或关键对象?

状态归属见 §5、§6 和 §11。所有状态均能回指 Step 6 对象或 Step 7 / 8 明确后移的 port / job 主语,当前没有新增孤儿状态主语。

### 3.7 状态触发接口和处理流是否已经在 Step 7 / Step 8 定义?

已定义。Step 7 §8.2 和 Step 8 §9 已给出状态触发反查。本步只沿这些触发源收敛迁移,不新增接口。

### 3.8 是否存在同名 / 近义状态跨组成部分语义冲突?

存在近义状态,但当前已按语义族隔离:

- `unresolved` 用于引用、外部来源、descriptor support、seam / relation 前置不可解析,不是业务拒绝。
- `unavailable` 用于依赖或派生材料暂不可用,不是 truth 被删除。
- `forbidden` 用于 forbidden body、越界输入或不允许承接,不是普通失败。
- `stale` 只用于 ref、safe summary、consumer view 或派生材料新鲜度,不得用于核心 identity / registry truth 的任意过期。
- `pending` 表示前置条件未满足或等待外部 ref / handoff,不是隐藏的 approval 状态。

### 3.9 每个主要组成部分的状态集合完成后是否通过停审?

已通过。停审记录见 §12。每个组成部分均检查了状态 owner、触发接口 / flow、允许 / 禁止迁移、传播影响和越界风险。

---

## 4. 状态机边界总览

### 4.1 状态族总览

| 状态族 | 承载对象 | 主要触发 | 正常主线判断 | 传播影响 |
|---|---|---|---|---|
| Identity / Review | `CapabilityIdentity`;`CapabilityAccessReviewFact`;`ExternalCapabilitySourceRef` | identity / review command;source ref consumer | `active` identity + `recorded` review fact 可被后续引用 | identity changed event candidate;registry / descriptor / exposure stale or pending |
| Registry lifecycle | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryChangeRecord` | registry command;visibility update;reconciliation job | `registered` 可目录管理;`formal_visible` 可作为正式可见前置 | registry changed event candidate;directory projection stale |
| Descriptor / Risk / Secret | `AdapterDescriptor`;`DescriptorRiskConstraintSummary`;`SecretRef`;`SecretHandlingSafeSummary` | descriptor command;risk / secret command;external doc / secret ref consumer | `accepted` descriptor + explicit risk / secret surface 可进入 exposure 判断 | descriptor changed event candidate;consumer view stale |
| Governance / Method relation | `GovernanceSeamRelation`;`GovernanceResultRef`;`CapabilityMethodBodyFreeRelation`;`MethodAssetRef` | seam / relation command;governance / method ref consumer | `active` seam / relation 可支撑 formal exposure;ref unresolved blocks or degrades | seam / relation changed event candidate;exposure pending / unavailable |
| Formal exposure / Consumer view | `FormalExposureBoundary`;`FormalVisibilityApplicability`;`ControlledConsumerView` | exposure command;visibility command;consumer view query / refresh job | `accepted / active` exposure + `visible` applicability + `ready` view 可正常消费 | exposure event candidate;consumer view availability changed |
| Trace / Impact / Handoff | `CapabilityAccessTraceabilityRecord`;`CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary` | impact command;downstream consumer;handoff command / export job | `recorded` trace and `identified / resolved` impact 可解释变化 | impact event candidate;audit export stale / partial |
| Derived material | `DirectorySearchBrowseProjection`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary`;`CapabilityReconciliationReport` | rebuild / export / discovery / reconciliation job | `ready / completed` 可读;其他状态必须显式降级 | derived material refreshed event candidate;reports do not repair truth |
| Reference / Event collaboration | `ReferenceResolutionState`;external ref objects;`CapabilityAccessEventCollaborationPort` | reference command;ref consumers;reference refresh job;event repair job | `resolved` 可用;`forbidden / invalid` 阻断;event `delivered` 只说明协作完成 | reference changed event candidate;pending delivery / failed handoff surface |

### 4.2 状态表达边界

| 边界 | 结论 |
|---|---|
| 无单一全局状态机 | 本仓以多个对象状态族协作,不合成 `CapabilityStatus` 或 `CapabilityDecision`。 |
| 核心 truth 与派生 freshness 分离 | identity、registry、descriptor、seam、relation、exposure 的状态变化不能由 projection / search / view / export 反写。 |
| ref state 与外部 truth 分离 | `ReferenceResolutionState` 只表达本仓能否安全引用外部材料,不拥有 governance、method、secret、SDK、runtime、observability 或 marketplace truth。 |
| event collaboration 与 outbox 实现分离 | 本步只点名 candidate、pending delivery、delivered、failed、handoff unavailable 等协作状态,不定义 outbox 表、topic、payload、relay、consumer group 或 retry 实现。 |
| Query no-write | 查询只能返回 current state surface,不能在读取路径刷新 ref、重建 projection 或更正 truth。 |
| Job no core-truth-write | Job 只能维护派生材料、reference state、report 或 handoff status,不得创建、修正、退役或回滚核心 truth。 |

---

## 5. Step 6 / 7 / 8 状态候选接收

| 状态主题 | 主要组成部分 | Step 6 对象来源 | Step 7 / 8 触发来源 | 当前状态集合 | 接收结论 |
|---|---|---|---|---|---|
| capability identity lifecycle | 能力身份与接入语境 | `CapabilityIdentity`;`CapabilityIdentityChangeRecord` | `EstablishCapabilityAccessContext`;`CorrectCapabilityIdentity`;`RetireCapabilityIdentity` | `candidate`;`active`;`correction_pending`;`retired`;`unresolved` | 接收为正式状态族。 |
| access review fact lifecycle | 能力身份与接入语境 | `CapabilityAccessReviewFact` | `RecordCapabilityAccessReviewFact` | `draft`;`recorded`;`superseded`;`invalidated` | 接收为正式状态族,但不等同 governance approval。 |
| external source / reference resolution | 能力身份与接入语境;外部引用与安全摘要支撑 | `ExternalCapabilitySourceRef`;`ReferenceResolutionState` | ref consumers;`RecordReferenceResolutionState`;`RefreshExternalReferenceResolution` | `resolved`;`unresolved`;`stale`;`invalid`;`unavailable`;`forbidden` | 接收为 reference state,不保存外部正文。 |
| registry lifecycle | 注册目录与生命周期 | `CapabilityRegistryEntry`;`RegistryLifecycleState` | `RegisterCapabilityInRegistry`;`UpdateRegistryLifecycleState`;`RetireCapabilityRegistryEntry` | `draft`;`registered`;`undescribed`;`ungoverned`;`visibility_pending`;`formal_visible`;`retired` | 接收为 registry 状态族。 |
| descriptor lifecycle | 接入描述与风险摘要 | `AdapterDescriptor`;`DescriptorChangeRecord` | `EstablishAdapterDescriptor`;descriptor replacement flow | `draft`;`accepted`;`unresolved`;`replaced`;`retired` | 接收为 descriptor 状态族。 |
| risk / safe summary availability | 接入描述与风险摘要 | `DescriptorRiskConstraintSummary`;`SecretRef`;`SecretHandlingSafeSummary` | `RecordDescriptorRiskConstraintSummary`;`AttachDescriptorSecretReference`;secret safe summary refresh | `available`;`partial`;`unavailable`;`superseded`;`resolved`;`unresolved`;`stale`;`forbidden` | 接收为 summary / ref 状态族。 |
| governance seam lifecycle | 治理与方法关系 | `GovernanceSeamRelation`;`GovernanceResultRef` | seam commands;`ConsumeGovernanceResultReferenceChanged` | `pending`;`active`;`unresolved`;`expired`;`forbidden`;ref `resolved / unresolved / expired / forbidden` | 接收为 seam 状态族,不迁入 governance truth。 |
| method relation lifecycle | 治理与方法关系 | `CapabilityMethodBodyFreeRelation`;`MethodAssetRef` | relation commands;`ConsumeMethodAssetReferenceChanged` | `pending`;`active`;`stale`;`unresolved`;`removed`;`forbidden`;ref `resolved / unresolved / stale / forbidden` | 接收为 relation 状态族,不迁入 method body。 |
| formal exposure lifecycle | 正式暴露与受控消费 | `FormalExposureBoundary`;`FormalVisibilityApplicability` | exposure commands;visibility / suspend / retire variants | `draft`;`pending`;`accepted`;`active`;`suspended`;`unavailable`;`retired`;visibility `not_visible / visible / pending / unavailable / retired` | 接收为 exposure / visibility 状态族。 |
| controlled consumer view freshness | 正式暴露与受控消费;派生维护与只读输出 | `ControlledConsumerView`;`ConsumerViewFreshnessPolicy` | `GetControlledConsumerView`;`RefreshControlledConsumerView` | `ready`;`stale`;`rebuilding`;`unavailable`;`partial` | 接收为 snapshot freshness 状态;读取 owner 与刷新 owner 分离。 |
| change impact | 追溯、变化与影响 | `CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary` | `RecordCapabilityChangeImpactFact`;`ConsumeDownstreamConsumptionImpactReported` | `identified`;`partial`;`delayed`;`ignored`;`resolved`;summary `received / partial / delayed / unavailable / ignored` | 接收为 impact / downstream summary 状态族。 |
| traceability / audit handoff | 追溯、变化与影响;派生维护与只读输出 | `CapabilityAccessTraceabilityRecord`;`AuditFriendlyExportSummary`;`ObservabilityAuditRef` | `RecordTraceabilityHandoffSummary`;`PrepareAuditFriendlyExportSummary` | `recorded`;`partial`;`handoff_pending`;`superseded`;export `ready / partial / unavailable / stale` | 接收为 trace / handoff 状态族。 |
| derived material freshness | 派生维护与只读输出 | `DirectorySearchBrowseProjection`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary`;`CapabilityReconciliationReport` | derived maintenance jobs | `ready`;`stale`;`rebuilding`;`partial`;`unavailable`;`completed`;`inconsistent`;`rebuild_required`;`failed` | 接收为 derived / report 状态族。 |
| event collaboration status | 外部引用与安全摘要支撑 | `CapabilityAccessEventCollaborationPort`;change records | `ProduceCapabilityAccessEventCandidate`;`RepairCapabilityAccessEventCollaboration` | `candidate`;`pending_delivery`;`delivered`;`failed`;`handoff_unavailable` | 接收为协作状态,不写 outbox / relay 实现。 |

---

## 6. 按主要组成部分组织的状态定义与迁移

### 6.1 能力身份与接入语境

#### 6.1.1 状态定义表

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `CapabilityIdentityState` | `candidate` | 外部能力已有接入语境,但 identity 尚未稳定成立。 | 受限 | 可继续审查和补充来源,不得被 registry / exposure 当正式主体消费。 |
| `CapabilityIdentityState` | `active` | identity 已稳定成立,可被 registry、descriptor、seam、relation 和 exposure 引用。 | 是 | 下游消费仍需 registry、descriptor、seam 和 exposure 前置。 |
| `CapabilityIdentityState` | `correction_pending` | identity 需要合并、拆分或更正。 | 受限 | 消费面不得隐式修正;必须经 `CorrectCapabilityIdentity`。 |
| `CapabilityIdentityState` | `retired` | identity 已退役,仅保留追溯和历史读取。 | 否 | 终态;新能力应建立新 identity 或新关系。 |
| `CapabilityIdentityState` | `unresolved` | 来源或身份判断材料不足。 | 否 | 不得补造正式 identity;只能等待 ref resolution 或重新提交。 |
| `CapabilityAccessReviewFactState` | `draft` | 审查事实正在形成。 | 否 | 不可作为 governance seam 或 descriptor 前置依据。 |
| `CapabilityAccessReviewFactState` | `recorded` | 审查事实已记录。 | 是 | 可供 descriptor、seam、traceability 引用,但不等于 governance approval。 |
| `CapabilityAccessReviewFactState` | `superseded` | 审查事实被后续事实替代。 | 否 | 历史可追溯,不作为当前前置。 |
| `CapabilityAccessReviewFactState` | `invalidated` | 审查事实因来源或边界问题作废。 | 否 | 终态,必须重建新的 review fact。 |

#### 6.1.2 允许迁移

- `none -> candidate`: `EstablishCapabilityAccessContext` 接收外部来源线索但 identity 未闭口。
- `candidate -> active`: 来源、边界和 identity policy 判断闭口。
- `candidate -> unresolved`: source ref 或身份判断材料不足。
- `unresolved -> candidate`: ref 状态恢复后重新进入接入语境判断。
- `unresolved -> active`: ref 恢复且 identity policy 判断一次性闭口。
- `active -> correction_pending`: `CorrectCapabilityIdentity` 发起更正、合并或拆分。
- `correction_pending -> active`: 更正闭口并写入 `CapabilityIdentityChangeRecord`。
- `candidate / active / correction_pending -> retired`: `RetireCapabilityIdentity` 显式退役。
- `draft -> recorded`: `RecordCapabilityAccessReviewFact` 写入正式审查事实。
- `recorded -> superseded`: 后续 review fact 替代。
- `draft / recorded -> invalidated`: 来源越界或审查事实不成立。

#### 6.1.3 禁止迁移

- 禁止 `candidate / unresolved -> formal_visible / active exposure`: identity 未闭口不得绕过 registry / descriptor / exposure。
- 禁止 `retired -> active`: 退役 identity 不得原地复活。
- 禁止 `correction_pending -> formal_visible`: 更正未闭口不得进入正式可见链。
- 禁止 Query、consumer view、runtime、tools、SDK 或 marketplace 触发 identity 合并、拆分或更正。
- 禁止 `recorded` review fact 被解释为 governance approval、Policy effective fact 或 shared_rules truth。

#### 6.1.4 本部分停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 状态 owner 是否明确 | pass | `CapabilityIdentity` 与 `CapabilityAccessReviewFact` 承载。 |
| 触发接口 / flow 是否存在 | pass | Step 7/8 已定义 identity 和 review fact command。 |
| 正常主线是否清楚 | pass | 只有 `active` identity 和 `recorded` review fact 可进入后续主线。 |
| 是否越界 | pass | 未引入 provider runtime、URL、tool config、governance approval 或 SDK client 状态。 |

### 6.2 注册目录与生命周期

#### 6.2.1 状态定义表

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `RegistryLifecycleState` | `draft` | registry entry 已创建但尚未正式注册。 | 否 | 不得被正式消费或暴露。 |
| `RegistryLifecycleState` | `registered` | entry 已正式纳入 registry。 | 是 | 可被目录管理、descriptor 和 visibility 判断读取,但不等于 formal visible。 |
| `RegistryLifecycleState` | `undescribed` | 缺少有效 adapter descriptor。 | 否 | 需要 descriptor accepted 后才能继续可见链。 |
| `RegistryLifecycleState` | `ungoverned` | 治理前置未满足或不可解析。 | 否 | 不得由本地目录状态替代治理结果。 |
| `RegistryLifecycleState` | `visibility_pending` | formal visibility 前置缺失、不可解析或等待刷新。 | 否 | 可读但必须显式 pending。 |
| `RegistryLifecycleState` | `formal_visible` | registry 满足正式可见前置。 | 是 | 仍不代表 runtime allow / deny 或 marketplace listing。 |
| `RegistryLifecycleState` | `retired` | entry 退出正式目录。 | 否 | 终态;仅保留历史和追溯。 |

#### 6.2.2 允许迁移

- `none -> draft`: 以 active identity 建立目录草稿。
- `draft -> registered`: `RegisterCapabilityInRegistry` 正式纳入目录。
- `registered -> undescribed`: descriptor 缺失或 descriptor ref 不可用。
- `registered -> ungoverned`: governance seam 前置缺失或不可解析。
- `registered / undescribed / ungoverned -> visibility_pending`: formal visibility 前置需要重新判断。
- `visibility_pending -> formal_visible`: descriptor、governance seam、method relation 和 exposure 前置满足。
- `formal_visible -> visibility_pending`: descriptor、governance ref、method ref 或 exposure 前置发生变化,需要重新判断。
- `draft / registered / undescribed / ungoverned / visibility_pending / formal_visible -> retired`: `RetireCapabilityRegistryEntry` 显式退出。

#### 6.2.3 禁止迁移

- 禁止 `draft -> formal_visible`: registry 草稿不得绕过 registered、descriptor 和 governance 前置。
- 禁止 `undescribed -> formal_visible`: 未描述能力不得正式可见。
- 禁止 `ungoverned -> formal_visible`: 未治理或治理 ref 不可解析不得正式可见。
- 禁止 `retired -> registered / formal_visible`: 退役 entry 不得原地恢复。
- 禁止 registry state 由 runtime availability、allowlist、cache、search index、marketplace listing 或 provider lookup 反向定义。
- 禁止 reconciliation job 自动更正 registry truth;它只能生成 report 或 stale / rebuild_required 语义。

#### 6.2.4 本部分停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 状态 owner 是否明确 | pass | `CapabilityRegistryEntry` 与 `RegistryLifecycleState` 承载。 |
| 触发接口 / flow 是否存在 | pass | Step 7/8 已定义 registry register、lifecycle update、retire 和 reconciliation flow。 |
| 传播边界是否清楚 | pass | registry 变化可标记 directory projection stale,但 projection 不反写 registry。 |
| 是否越界 | pass | 未引入 allowlist、runtime cache、marketplace listing 或 execution state。 |

### 6.3 接入描述与风险摘要

#### 6.3.1 状态定义表

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `AdapterDescriptorState` | `draft` | descriptor 草稿存在,尚未正式接受。 | 否 | 不能作为 exposure 或 consumer view 前置。 |
| `AdapterDescriptorState` | `accepted` | descriptor 作为接入描述 truth 成立。 | 是 | 可进入 risk、secret safe summary 和 exposure 判断。 |
| `AdapterDescriptorState` | `unresolved` | 来源、外部文档或必要 ref 不可解析。 | 否 | 不得补造 Provider Contract。 |
| `AdapterDescriptorState` | `replaced` | descriptor 被新描述替代。 | 否 | 历史可追溯,不作为当前描述。 |
| `AdapterDescriptorState` | `retired` | descriptor 不再作为当前接入描述使用。 | 否 | 终态或历史态。 |
| `DescriptorRiskConstraintSummaryState` | `available` | 风险和约束摘要可用于 exposure 和 consumer view。 | 是 | 不等于 governance truth。 |
| `DescriptorRiskConstraintSummaryState` | `partial` | 摘要不完整。 | 受限 | 读取和 exposure 必须显式表达 partial。 |
| `DescriptorRiskConstraintSummaryState` | `unavailable` | 摘要不可用。 | 否 | 不得伪装为低风险或空风险。 |
| `DescriptorRiskConstraintSummaryState` | `superseded` | 摘要被新事实替换。 | 否 | 历史可追溯。 |
| `SecretRefState` | `resolved` | secret ref 可解析,但本仓仍不读取正文。 | 受限 | 只说明 ref 可用。 |
| `SecretRefState` | `unresolved` | secret ref 不可解析。 | 否 | 只能显示 pending / unavailable。 |
| `SecretRefState` | `unavailable` | 外部 secret 系统或引用暂不可用。 | 否 | 不改变 descriptor truth。 |
| `SecretRefState` | `forbidden` | secret ref 不符合本仓边界或携带 forbidden body。 | 否 | 阻断相关摘要,不能入仓。 |
| `SecretHandlingSafeSummaryState` | `available` | 允许展示的安全摘要可用。 | 是 | 不包含 secret 正文。 |
| `SecretHandlingSafeSummaryState` | `stale` | 安全摘要可能过期。 | 受限 | 读取必须显式 stale。 |
| `SecretHandlingSafeSummaryState` | `unavailable` | 安全摘要不可用。 | 否 | 不得伪造摘要。 |
| `SecretHandlingSafeSummaryState` | `forbidden` | 摘要不允许展示。 | 否 | 只能返回 forbidden surface。 |

#### 6.3.2 允许迁移

- `none -> draft`: `EstablishAdapterDescriptor` 创建 descriptor 草稿。
- `draft -> accepted`: descriptor 边界、source ref 和 policy 判断闭口。
- `draft -> unresolved`: 来源或外部文档 ref 不可解析。
- `unresolved -> accepted`: ref 状态恢复并通过 descriptor policy。
- `accepted -> replaced`: `ReplaceAdapterDescriptor` 写入替代描述。
- `accepted / unresolved -> retired`: descriptor 显式退役。
- `none / partial / unavailable -> available`: `RecordDescriptorRiskConstraintSummary` 写入可用摘要。
- `available -> partial / unavailable`: 关联 ref 或摘要材料失效。
- `available / partial / unavailable -> superseded`: 新摘要替代旧摘要。
- `resolved -> stale / unavailable / forbidden`: secret ref 变化或边界检查失败。
- `unresolved / stale / unavailable -> resolved`: ref resolution 恢复。
- `available -> stale / unavailable / forbidden`: safe summary 过期、不可用或被判定不可展示。

#### 6.3.3 禁止迁移

- 禁止 `draft / unresolved -> accepted` 时携带 provider runtime、quota、route、cost、failover、retry 或 secret 正文。
- 禁止 `unavailable / forbidden` secret safe summary 被解释为空风险或默认安全。
- 禁止 `replaced / retired -> accepted` 原地恢复;需要新 descriptor 或新 summary。
- 禁止 descriptor state 反向拥有 KMS / Vault truth、provider client 状态或外部 API 响应正文。

#### 6.3.4 本部分停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 状态 owner 是否明确 | pass | `AdapterDescriptor`、`DescriptorRiskConstraintSummary`、`SecretRef`、`SecretHandlingSafeSummary` 承载。 |
| 触发接口 / flow 是否存在 | pass | Step 7/8 已定义 descriptor、risk summary、secret ref 和 safe summary flow。 |
| forbidden body 是否隔离 | pass | secret 正文和 provider runtime 不进入状态或摘要。 |
| 是否越界 | pass | 未恢复旧 `ProviderContract`、KMS / Vault、quota、route、cost 或 failover 状态。 |

### 6.4 治理与方法关系

#### 6.4.1 状态定义表

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `GovernanceSeamState` | `pending` | seam 关系等待治理结果 ref 或安全摘要解析。 | 否 | 不得被视为 governance approval。 |
| `GovernanceSeamState` | `active` | seam 关系已成立,可供 visibility / exposure 判断。 | 是 | 只表达 relation truth,不拥有 approval / Policy truth。 |
| `GovernanceSeamState` | `unresolved` | governance ref 不可解析。 | 否 | exposure 必须 pending 或 unavailable。 |
| `GovernanceSeamState` | `expired` | governance ref 或允许摘要过期。 | 否 | 需要 replace 或 refresh。 |
| `GovernanceSeamState` | `forbidden` | seam 输入越界或不允许承接。 | 否 | 禁止把 governance 正文入仓。 |
| `GovernanceResultRefState` | `resolved` | governance result ref 可解析。 | 是 | 只说明 ref 可用。 |
| `GovernanceResultRefState` | `unresolved` | ref 不可解析。 | 否 | formal exposure 不得继续当作治理前置已满足。 |
| `GovernanceResultRefState` | `expired` | ref 或摘要过期。 | 否 | 需 refresh 或 replace。 |
| `GovernanceResultRefState` | `forbidden` | ref 携带 forbidden governance body 或越界内容。 | 否 | 阻断 seam。 |
| `CapabilityMethodRelationState` | `pending` | method asset ref 或关系前置未满足。 | 否 | 不保存 method body。 |
| `CapabilityMethodRelationState` | `active` | body-free relation 成立。 | 是 | 可供 exposure / consumer view 读取。 |
| `CapabilityMethodRelationState` | `stale` | method asset ref 可能过期。 | 受限 | 读取必须显式 stale。 |
| `CapabilityMethodRelationState` | `unresolved` | method asset ref 不可解析。 | 否 | 不能复制 method body。 |
| `CapabilityMethodRelationState` | `removed` | relation 已移除。 | 否 | 历史可追溯。 |
| `CapabilityMethodRelationState` | `forbidden` | relation 试图携带 method body 或越界摘要。 | 否 | 阻断 relation。 |
| `MethodAssetRefState` | `resolved` | method asset ref 可解析。 | 是 | 只说明 ref 可用。 |
| `MethodAssetRefState` | `unresolved` | method asset ref 不可解析。 | 否 | relation pending / unresolved。 |
| `MethodAssetRefState` | `stale` | method asset ref 可能过期。 | 受限 | 读取必须显式 stale。 |
| `MethodAssetRefState` | `forbidden` | ref 输入携带 method body 或越界内容。 | 否 | 阻断 relation。 |

#### 6.4.2 允许迁移

- `none -> pending`: seam / method relation 建立请求已接收但 ref 未闭口。
- `pending -> active`: ref 解析完成且边界 policy 通过。
- `pending -> unresolved / forbidden`: ref 不可解析或输入越界。
- `active -> expired`: governance ref 或允许摘要过期。
- `active -> stale`: method asset ref 过期或发生 source change。
- `expired / stale / unresolved -> pending`: replace / refresh 后重新判断。
- `expired / stale / unresolved -> active`: ref 恢复且 relation policy 通过。
- `active / pending / unresolved / stale -> removed`: `RemoveCapabilityMethodRelation` 或 relation 明确移除。
- `resolved -> stale / unresolved / expired / forbidden`: inbound ref changed consumer 或 reference refresh 标记。

#### 6.4.3 禁止迁移

- 禁止 `pending / unresolved / expired / forbidden -> active` 时复制 governance truth、Policy 正文、shared_rules truth 或 method body。
- 禁止 inbound governance / method event 直接改写 active relation truth;它只能形成 ref state、stale marker 或 command intent。
- 禁止 `removed -> active` 原地恢复;需新建 relation。
- 禁止 seam 状态替代 `L1-governance` 的 approval / Policy 状态。
- 禁止 method relation 状态替代 `L3-method-library` 的 method asset lifecycle。

#### 6.4.4 本部分停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 状态 owner 是否明确 | pass | seam / relation 状态由本仓 relation 对象承载;外部 ref 状态由 ref 对象承载。 |
| 触发接口 / flow 是否存在 | pass | Step 7/8 已定义 seam、relation command 和 ref changed consumer。 |
| 与相邻 truth 是否隔离 | pass | governance truth 和 method body 不进入本仓。 |
| 是否越界 | pass | 未写 approval execution、policy refresh、method content lifecycle 或 body schema。 |

### 6.5 正式暴露与受控消费

#### 6.5.1 状态定义表

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `FormalExposureState` | `draft` | exposure 尚在准备或前置检查中。 | 否 | 不能对 runtime / tools / SDK 正式暴露。 |
| `FormalExposureState` | `pending` | descriptor、governance seam、method relation 或 ref 前置未满足。 | 否 | 需显式 pending。 |
| `FormalExposureState` | `accepted` | 服务端正式暴露边界成立。 | 是 | 仍需 visibility / applicability 判断才能活跃消费。 |
| `FormalExposureState` | `active` | exposure 当前可作为正式服务端能力边界消费。 | 是 | 不等于 runtime allow / deny enforcement。 |
| `FormalExposureState` | `suspended` | exposure 暂停正式消费。 | 受限 | 保留历史,不得由 consumer view 反写。 |
| `FormalExposureState` | `unavailable` | 依赖 ref 或摘要不可用。 | 否 | 读取面必须显式 unavailable。 |
| `FormalExposureState` | `retired` | exposure 停止作为正式消费边界。 | 否 | 终态。 |
| `FormalVisibilityState` | `not_visible` | 不具备正式可见前置。 | 否 | 可管理读取,不可正式消费。 |
| `FormalVisibilityState` | `pending` | 正式可见性等待前置或 ref。 | 否 | 不得伪装为 visible。 |
| `FormalVisibilityState` | `visible` | 可作为正式服务端能力被消费。 | 是 | 仍不代表 SDK client 已发布。 |
| `FormalVisibilityState` | `unavailable` | 可见性前置不可用。 | 否 | 不得伪装为 visible。 |
| `FormalVisibilityState` | `retired` | 可见事实已终止。 | 否 | 历史可追溯。 |
| `ConsumerViewFreshnessState` | `ready` | consumer view 可读取。 | 是 | 只读快照,不能反写 exposure。 |
| `ConsumerViewFreshnessState` | `stale` | 快照落后于正式 truth。 | 受限 | Query 必须返回 freshness surface。 |
| `ConsumerViewFreshnessState` | `rebuilding` | 快照正在重建。 | 受限 | Query 不得顺手修复。 |
| `ConsumerViewFreshnessState` | `unavailable` | 快照不可用。 | 否 | 不回滚 exposure truth。 |
| `ConsumerViewFreshnessState` | `partial` | 快照只包含部分允许摘要。 | 受限 | 下游必须感知 partial。 |

#### 6.5.2 允许迁移

- `none -> draft`: `EstablishFormalExposureBoundary` 开始前置检查。
- `draft -> pending`: descriptor、seam、method relation 或 ref 前置未满足。
- `draft / pending -> accepted`: 前置条件满足并写入 exposure truth。
- `accepted -> active`: formal visibility `visible` 且 applicability 成立。
- `active -> suspended`: `SuspendFormalExposureBoundary` 暂停正式消费。
- `suspended -> active`: 恢复后重新满足前置。
- `accepted / active / suspended / pending -> unavailable`: 关键 ref 或摘要不可用。
- `unavailable -> pending / accepted`: ref 恢复后重新判断或恢复 exposure。
- `accepted / active / suspended / unavailable -> retired`: `RetireFormalExposureBoundary` 退役。
- `not_visible -> pending -> visible`: formal visibility 前置逐步满足。
- `visible -> pending / unavailable`: 前置变化或 ref 不可用。
- `none / stale / unavailable / partial -> rebuilding -> ready`: `RefreshControlledConsumerView` 重建消费快照。
- `ready -> stale`: core truth、descriptor、seam、relation、reference 或 exposure 变化。

#### 6.5.3 禁止迁移

- 禁止 `draft / pending / unavailable -> active` 绕过 accepted exposure 和 visible applicability。
- 禁止 `retired -> active / visible`: retired exposure / visibility 不得原地恢复。
- 禁止 `ready` consumer view 反写 `FormalExposureBoundary`、`FormalVisibilityApplicability` 或 registry。
- 禁止 runtime / tools / SDK consumer ref、SDK client、runtime cache、allow / deny enforcement 或 `QueryCapabilities` 定义 exposure 状态。
- 禁止 Query 触发 `rebuilding` 或隐式刷新。

#### 6.5.4 本部分停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 状态 owner 是否明确 | pass | exposure / visibility 归本部分;view 刷新由派生维护 job 维护但业务 owner 仍为本部分。 |
| 触发接口 / flow 是否存在 | pass | Step 7/8 已定义 exposure command、visibility command、consumer view query 和 refresh job。 |
| formal exposure / consumer view 分层是否清楚 | pass | consumer view 只是 snapshot,不能反写 exposure。 |
| 是否越界 | pass | 未引入 SDK client、runtime execution、runtime cache 或 marketplace listing 状态。 |

### 6.6 追溯、变化与影响

#### 6.6.1 状态定义表

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `TraceabilityState` | `recorded` | 追溯记录已形成。 | 是 | 可解释 access truth 来源与变化。 |
| `TraceabilityState` | `partial` | 部分来源不可解析。 | 受限 | 必须显式 partial。 |
| `TraceabilityState` | `handoff_pending` | 审计或外部 handoff 尚未完成。 | 受限 | 不影响 core truth,但影响审计交接。 |
| `TraceabilityState` | `superseded` | 被新追溯记录替代。 | 否 | 历史可追溯。 |
| `CapabilityImpactState` | `identified` | 变化影响已识别。 | 是 | 对应 Step 8 的 accepted local impact fact。 |
| `CapabilityImpactState` | `partial` | 仅部分消费方影响已知。 | 受限 | 需显式 partial。 |
| `CapabilityImpactState` | `delayed` | 下游感知延迟。 | 受限 | 不回滚 core truth。 |
| `CapabilityImpactState` | `ignored` | 下游明确无需处理该影响。 | 是 | 必须可追溯,不能隐藏变化。 |
| `CapabilityImpactState` | `resolved` | 影响解释和必要派生已完成。 | 是 | 对应 Step 8 的 linked / closed impact 语义。 |
| `DownstreamImpactSummaryState` | `received` | 已收到下游影响摘要。 | 是 | 不等于下游 execution truth。 |
| `DownstreamImpactSummaryState` | `partial` | 下游反馈不完整。 | 受限 | 只作为摘要。 |
| `DownstreamImpactSummaryState` | `delayed` | 下游反馈延迟。 | 受限 | 影响 impact surface。 |
| `DownstreamImpactSummaryState` | `unavailable` | 下游反馈不可用。 | 否 | 不反写 formal exposure。 |
| `DownstreamImpactSummaryState` | `ignored` | 下游明确无需处理。 | 是 | 必须保留说明。 |

#### 6.6.2 允许迁移

- `none -> recorded / partial`: traceability record 写入,根据来源完整性决定。
- `recorded / partial -> handoff_pending`: 需要 audit / external handoff。
- `handoff_pending -> recorded`: handoff summary 记录完成。
- `recorded / partial / handoff_pending -> superseded`: 新追溯记录替代。
- `none -> identified`: `RecordCapabilityChangeImpactFact` 记录影响事实。
- `identified -> partial / delayed / ignored / resolved`: 下游反馈、派生维护或影响闭合后更新解释。
- `partial / delayed -> resolved / ignored`: 补齐影响或确认无需处理。
- `none -> received / partial / delayed / unavailable / ignored`: `ConsumeDownstreamConsumptionImpactReported` 记录下游摘要。

#### 6.6.3 禁止迁移

- 禁止 downstream summary 改写 identity、registry、descriptor、seam、relation 或 exposure truth。
- 禁止 traceability 状态替代 observability store、audit log store 或 production payload。
- 禁止 `ignored` 隐藏 core truth change;必须保留 reason 和 trace。
- 禁止 handoff failure 回滚已提交 truth。

#### 6.6.4 本部分停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 状态 owner 是否明确 | pass | traceability、impact fact 和 downstream summary 承载。 |
| 触发接口 / flow 是否存在 | pass | Step 7/8 已定义 impact command、downstream consumer 和 handoff command / export job。 |
| 下游 truth 是否隔离 | pass | 下游影响只作为摘要,不保存执行正文或下游状态 truth。 |
| 是否越界 | pass | 未引入 observability store、audit log、cost ledger 或 runtime payload。 |

### 6.7 派生维护与只读输出

#### 6.7.1 状态定义表

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `DirectoryProjectionState` | `ready` | search / browse 投影可读。 | 是 | 派生快照,不拥有 registry truth。 |
| `DirectoryProjectionState` | `stale` | 投影落后于 truth。 | 受限 | Query 必须显式 freshness。 |
| `DirectoryProjectionState` | `rebuilding` | 投影正在重建。 | 受限 | 不阻塞 core truth。 |
| `DirectoryProjectionState` | `unavailable` | 投影不可用。 | 否 | 不补造 registry。 |
| `AuditExportState` | `ready` | 审计友好摘要可用于 handoff。 | 是 | 不复制 audit store。 |
| `AuditExportState` | `partial` | 仅部分摘要可用。 | 受限 | 必须显式 partial。 |
| `AuditExportState` | `unavailable` | 摘要不可用。 | 否 | 不影响 core truth。 |
| `AuditExportState` | `stale` | 摘要需要重建。 | 受限 | 由 export job 维护。 |
| `EcosystemDiscoveryState` | `ready` | 只读生态发现摘要可读。 | 是 | 不形成 marketplace listing truth。 |
| `EcosystemDiscoveryState` | `partial` | 摘要缺少部分外围上下文。 | 受限 | 不阻塞核心闭环。 |
| `EcosystemDiscoveryState` | `stale` | 摘要过期。 | 受限 | 可重建。 |
| `EcosystemDiscoveryState` | `unavailable` | 摘要不可用。 | 否 | 不创建 listing。 |
| `ReconciliationReportState` | `completed` | 对账已完成。 | 是 | 只解释一致性,不修 truth。 |
| `ReconciliationReportState` | `partial` | 仅部分范围完成。 | 受限 | 必须显式范围。 |
| `ReconciliationReportState` | `inconsistent` | 发现派生材料不一致。 | 受限 | 可触发 rebuild_required,不改 core truth。 |
| `ReconciliationReportState` | `rebuild_required` | 需要重建派生材料。 | 受限 | 后续由对应 Job 执行。 |
| `ReconciliationReportState` | `failed` | 对账失败。 | 否 | 不回滚 core truth。 |

#### 6.7.2 允许迁移

- `none / stale / unavailable -> rebuilding -> ready`: projection rebuild 成功。
- `ready -> stale`: core truth、reference 或 exposure 变化。
- `rebuilding -> unavailable`: rebuild 无法形成可读投影。
- `none / stale / unavailable -> ready / partial`: export 或 discovery job 生成摘要。
- `ready / partial -> stale`: 来源 truth 或 ref 变化。
- `stale / partial -> unavailable`: 摘要无法继续安全提供。
- `none -> completed / partial / inconsistent / failed`: reconciliation job 生成报告。
- `inconsistent -> rebuild_required`: 对账发现需要重建。
- `rebuild_required -> completed / partial / failed`: 相关重建或对账再次完成后形成新报告。

#### 6.7.3 禁止迁移

- 禁止 projection、export、discovery、reconciliation report 创建、修正、退役或回滚 identity、registry、descriptor、seam、relation 或 exposure truth。
- 禁止 `ready` 派生材料被解释为 formal exposure truth。
- 禁止 `completed` reconciliation report 自动修复 registry truth;需要业务变更必须回到 Command。
- 禁止 marketplace listing、console UI 状态或 observability store 状态进入派生 material truth。

#### 6.7.4 本部分停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 状态 owner 是否明确 | pass | 各 projection / export / discovery / report 对象承载自身 freshness / report state。 |
| 触发接口 / flow 是否存在 | pass | Step 7/8 已定义 search、refresh、rebuild、export、discovery、reconciliation jobs。 |
| 派生反写是否阻断 | pass | `DerivedMaterialPolicy` 约束 projection / report no-write truth。 |
| 是否越界 | pass | 未引入 marketplace listing、console state、audit store 或 cache truth。 |

### 6.8 外部引用与安全摘要支撑

#### 6.8.1 状态定义表

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `ReferenceResolutionValue` | `resolved` | ref 可解析。 | 是 | 只说明本仓可安全引用外部材料。 |
| `ReferenceResolutionValue` | `unresolved` | ref 无法解析。 | 否 | 需要 pending 或 degraded surface。 |
| `ReferenceResolutionValue` | `stale` | ref 可能过期。 | 受限 | 需要 refresh 或重新确认。 |
| `ReferenceResolutionValue` | `invalid` | ref 不符合本仓边界。 | 否 | 阻断引用。 |
| `ReferenceResolutionValue` | `unavailable` | 外部来源暂不可用。 | 否 | 不补造外部 truth。 |
| `ReferenceResolutionValue` | `forbidden` | ref 试图携带 forbidden body。 | 否 | 阻断并记录边界原因。 |
| `ExternalDocumentRefState` | `resolved` | 外部文档 ref 可解析。 | 是 | 不保存文档正文。 |
| `ExternalDocumentRefState` | `unresolved` | 文档 ref 不可解析。 | 否 | descriptor / summary 进入 unresolved。 |
| `ExternalDocumentRefState` | `stale` | 文档 ref 可能过期。 | 受限 | 需要 refresh。 |
| `ExternalDocumentRefState` | `forbidden` | 文档内容不允许进入本仓摘要。 | 否 | 只返回 forbidden surface。 |
| `ConsumerRefState` | `resolved` | runtime / tools / SDK consumer ref 可解析。 | 是 | 不读取 execution 或 SDK client state。 |
| `ConsumerRefState` | `unresolved` | consumer ref 不可解析。 | 否 | consumer view 需显式 pending / unavailable。 |
| `ConsumerRefState` | `unavailable` | consumer 边界暂不可用。 | 否 | 不影响 exposure truth。 |
| `ConsumerRefState` | `stale` | consumer ref 需要刷新。 | 受限 | 只能影响消费 surface。 |
| `ObservabilityAuditRefState` | `resolved` | observability / audit ref 可解析。 | 是 | 不保存观测或审计正文。 |
| `ObservabilityAuditRefState` | `unresolved` | audit ref 不可解析。 | 否 | handoff 或 export partial。 |
| `ObservabilityAuditRefState` | `unavailable` | 外部材料暂不可用。 | 否 | 不阻塞 core truth。 |
| `ObservabilityAuditRefState` | `forbidden` | 外部材料不允许进入摘要。 | 否 | 禁止正文入仓。 |
| `EventCollaborationStatus` | `candidate` | 已成立 fact / change 形成传播候选。 | 不适用 | 不是业务 truth 状态。 |
| `EventCollaborationStatus` | `pending_delivery` | 传播或 handoff 等待送达。 | 不适用 | 不改变 core truth。 |
| `EventCollaborationStatus` | `delivered` | 协作送达或 handoff 完成。 | 不适用 | 只说明协作状态。 |
| `EventCollaborationStatus` | `failed` | 协作投递失败。 | 不适用 | 可修复,但不得回滚 truth。 |
| `EventCollaborationStatus` | `handoff_unavailable` | 外部 handoff 边界不可用。 | 不适用 | 影响可见性和重试,不影响 core truth。 |

#### 6.8.2 允许迁移

- `none -> resolved / unresolved / invalid / unavailable / forbidden`: `RecordReferenceResolutionState` 或 ref consumer 记录当前 ref 状态。
- `resolved -> stale / unresolved / unavailable / forbidden`: external ref changed 或 refresh 发现变化。
- `stale / unresolved / unavailable -> resolved`: `RefreshExternalReferenceResolution` 或 command 重新闭口。
- `invalid / forbidden -> resolved`: 只能通过新的 ref 或新的允许摘要重新建立,不得原地修正旧 forbidden body。
- `none -> candidate`: `ProduceCapabilityAccessEventCandidate` 基于已提交 fact / change record 形成协作候选。
- `candidate -> pending_delivery`: event collaboration port 接收待送达项。
- `pending_delivery -> delivered / failed / handoff_unavailable`: 协作结果返回。
- `failed / handoff_unavailable -> pending_delivery`: `RepairCapabilityAccessEventCollaboration` 重新尝试。

#### 6.8.3 禁止迁移

- 禁止 `unresolved / stale / unavailable` ref 补造 governance、method、secret、runtime、SDK、observability、external document 或 marketplace truth。
- 禁止 `forbidden` ref 通过 safe summary 伪装为 resolved。
- 禁止 event `failed` 回滚已提交 core truth 或 change record。
- 禁止 event collaboration 状态被写成 outbox table、topic、payload、consumer group、retry policy 或 bus adapter 实现。
- 禁止 consumer ref 读取 runtime execution state、tools execution state 或 SDK client state。

#### 6.8.4 本部分停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 状态 owner 是否明确 | pass | `ReferenceResolutionState` 和各 external ref 对象承载 ref 状态;`CapabilityAccessEventCollaborationPort` 承接协作状态。 |
| 触发接口 / flow 是否存在 | pass | Step 7/8 已定义 reference command、ref consumers、reference refresh job 和 event collaboration repair。 |
| forbidden body 是否隔离 | pass | forbidden ref 阻断正文入仓,只能返回显式 surface。 |
| 是否越界 | pass | 未写 outbox / relay 实现、runtime state、SDK client state、observability store 或 marketplace listing truth。 |

---

## 7. 状态流转图

#### 状态流转图

```text
external capability source
  │ EstablishCapabilityAccessContext
  ▼
identity candidate
  │ identity accepted
  ▼
identity active
  │ RegisterCapabilityInRegistry
  ▼
registry registered
  │ descriptor / governance / method prerequisites
  ▼
registry visibility_pending
  │ prerequisites resolved
  ▼
registry formal_visible
  │ EstablishFormalExposureBoundary
  ▼
formal exposure accepted
  │ visibility applicable
  ▼
formal exposure active
  │ truth or prerequisite change
  ▼
consumer view stale
  │ RefreshControlledConsumerView
  ▼
consumer view ready

formal exposure active
  │ SuspendFormalExposureBoundary
  ▼
formal exposure suspended
  │ RetireFormalExposureBoundary
  ▼
formal exposure retired
```

关键说明：
- 图表达核心接入事实从外部来源、identity、registry、visibility 到 formal exposure 和 consumer view 的主线状态方向。
- descriptor、governance seam 和 method relation 在图中作为 formal visibility / exposure 前置表达,其内部状态由 §6.3 和 §6.4 独立定义。
- consumer view 的 `stale -> ready` 由派生维护 Job 触发,不代表 Query 可以修复状态。
- 图不表达数据库字段、错误码、事务、重试、topic、payload、outbox 或 SDK / runtime 实现。

---

## 8. 允许的核心迁移清单

| 状态族 | 允许的核心迁移 |
|---|---|
| Identity | `none -> candidate`;`candidate -> active`;`candidate -> unresolved`;`unresolved -> candidate / active`;`active -> correction_pending`;`correction_pending -> active`;`candidate / active / correction_pending -> retired` |
| Review fact | `none / draft -> recorded`;`recorded -> superseded`;`draft / recorded -> invalidated` |
| Registry | `none -> draft`;`draft -> registered`;`registered -> undescribed / ungoverned / visibility_pending`;`undescribed / ungoverned -> visibility_pending`;`visibility_pending -> formal_visible`;`formal_visible -> visibility_pending`;`* non-retired -> retired` |
| Descriptor | `none -> draft`;`draft -> accepted / unresolved`;`unresolved -> accepted`;`accepted -> replaced`;`accepted / unresolved -> retired` |
| Risk / secret summary | `none / partial / unavailable -> available`;`available -> partial / unavailable / superseded`;`resolved -> stale / unavailable / forbidden`;`stale / unresolved / unavailable -> resolved` |
| Governance seam | `none -> pending`;`pending -> active / unresolved / forbidden`;`active -> expired / unresolved`;`expired / unresolved -> pending / active` |
| Method relation | `none -> pending`;`pending -> active / unresolved / forbidden`;`active -> stale / removed`;`stale / unresolved -> pending / active / removed` |
| Formal exposure | `none -> draft`;`draft -> pending / accepted`;`pending -> accepted`;`accepted -> active`;`active -> suspended`;`suspended -> active / retired`;`accepted / active / suspended / pending -> unavailable`;`unavailable -> pending / accepted`;`* non-retired -> retired` |
| Formal visibility | `not_visible -> pending`;`pending -> visible / unavailable`;`visible -> pending / unavailable / retired`;`unavailable -> pending`;`* non-retired -> retired` |
| Consumer view | `none / stale / unavailable / partial -> rebuilding`;`rebuilding -> ready / partial / unavailable`;`ready -> stale`;`partial -> ready / stale / rebuilding` |
| Trace / impact | `none -> recorded / partial`;`recorded / partial -> handoff_pending / superseded`;`none -> identified`;`identified -> partial / delayed / ignored / resolved`;`partial / delayed -> resolved / ignored` |
| Derived material | `none / stale / unavailable -> rebuilding`;`rebuilding -> ready / partial / unavailable`;`ready / partial -> stale`;`none -> completed / partial / inconsistent / failed`;`inconsistent -> rebuild_required`;`rebuild_required -> completed / partial / failed` |
| Reference resolution | `none -> resolved / unresolved / invalid / unavailable / forbidden`;`resolved -> stale / unresolved / unavailable / forbidden`;`stale / unresolved / unavailable -> resolved`;`invalid / forbidden -> resolved only with new allowed ref` |
| Event collaboration | `none -> candidate`;`candidate -> pending_delivery`;`pending_delivery -> delivered / failed / handoff_unavailable`;`failed / handoff_unavailable -> pending_delivery` |

---

## 9. 禁止的核心迁移清单

| 禁止迁移 | 原因 |
|---|---|
| `candidate / unresolved identity -> registry formal_visible / formal exposure active` | identity 未正式成立不得进入正式消费。 |
| `retired identity / registry / exposure -> active / formal_visible` | 退役对象不得原地复活;需要新对象或新关系。 |
| `draft registry -> formal_visible` | 必须先 registered,再完成 descriptor / governance / visibility 前置。 |
| `undescribed / ungoverned registry -> formal_visible` | 未描述或未治理能力不得正式可见。 |
| `unresolved descriptor -> accepted` 且携带 provider runtime / secret / cost / quota / route / failover 正文 | descriptor 不得恢复旧 ProviderContract 语义。 |
| `pending / unresolved governance seam -> active` 且复制 approval / Policy / shared_rules truth | seam 只承接 ref / allowed summary。 |
| `pending / unresolved method relation -> active` 且携带 method body | relation 必须 body-free。 |
| `pending / unavailable formal exposure -> active` 绕过 accepted exposure 和 visible applicability | formal exposure 与 visibility 必须分层成立。 |
| `ready consumer view / ready projection -> core truth update` | projection / snapshot 只能派生,不得反写真相。 |
| `query -> any persistent state change` | Query no-write。 |
| `operations job -> identity / registry / descriptor / seam / relation / exposure truth repair` | Job 只维护派生材料、reference state、report 或 handoff。 |
| `event collaboration failed -> core truth rollback` | 投递失败只影响协作状态。 |
| `forbidden ref -> resolved` without new allowed ref | forbidden body 不得被包装成 safe summary。 |
| `downstream impact summary -> formal exposure / registry state update` | 下游反馈不是本仓 truth 写源。 |
| `marketplace listing / SDK client / runtime cache / provider lookup -> formal exposure state` | 下游消费面或边界外状态不得定义服务端 exposure。 |

---

## 10. 状态传播关系

#### 状态传播关系图

```text
core truth / relation / exposure state change
  │ write change record or traceability record
  ▼
capability access event candidate
  │
  ├─► affected consumer view freshness = stale
  │
  ├─► directory / export / discovery material = stale or rebuild_required
  │
  ├─► impact fact = identified / partial / delayed
  │
  └─► event collaboration = candidate / pending_delivery

reference resolution state change
  │
  ├─► dependent seam / relation / descriptor / exposure = pending or unavailable
  │
  ├─► affected derived material = stale or partial
  │
  └─► handoff / audit surface = partial or unavailable
```

关键说明：
- 图表达状态变化如何传播到 event candidate、consumer view freshness、derived material、impact fact 和 handoff surface。
- reference 状态变化只能影响本仓 ref surface、pending / unavailable 前置和派生材料新鲜度,不能补造外部 truth。
- event collaboration 状态只说明协作投递或 handoff 进度,不表达 outbox 表、topic、payload、relay、retry 或 bus adapter。
- 派生材料进入 `stale / rebuild_required / partial / unavailable` 后只能由 Job 重建,不能反写核心 truth。

### 10.1 传播关系表

| 来源状态变化 | 传播到 | 传播状态 / 影响 | 禁止事项 |
|---|---|---|---|
| identity active / correction / retired | registry、descriptor、seam、relation、exposure、trace / impact | 相关 change record;event candidate;consumer view / projection stale | runtime / SDK 不得隐式更正 identity。 |
| registry formal_visible / retired / visibility_pending | directory projection、formal exposure、downstream consumers | projection stale;exposure pending / unavailable;event candidate | search / marketplace 不得反写 registry。 |
| descriptor accepted / replaced / retired / unresolved | exposure、consumer view、trace / impact | consumer view stale;exposure pending / unavailable;descriptor changed event candidate | provider runtime、secret、cost 不得进入 descriptor。 |
| governance seam active / expired / unresolved / forbidden | exposure、trace / impact、derived material | exposure pending / unavailable;seam changed event candidate | 不迁入 approval / Policy truth。 |
| method relation active / stale / removed / forbidden | exposure、consumer view、trace / impact | consumer view stale;relation changed event candidate | 不迁入 method body。 |
| formal exposure active / suspended / retired / unavailable | runtime / tools / SDK consumer view、event collaboration | consumer view stale;availability changed;event candidate | runtime allow / deny 不定义 exposure。 |
| impact identified / partial / delayed / resolved | downstream impact surface、audit export、derived material | event candidate;export stale / partial | 下游反馈不反写 core truth。 |
| derived material stale / rebuilding / unavailable | queries、audit / discovery consumers | degraded / rebuilding / unavailable surface | Query 不触发 rebuild。 |
| reference resolved / unresolved / stale / forbidden | descriptor、seam、relation、exposure、trace / handoff | pending / unavailable / forbidden surface;reference changed event candidate | 不补造外部 truth 或保存正文。 |
| event collaboration failed / handoff_unavailable | operations visibility、repair job | pending repair surface | 不回滚已提交 truth。 |

---

## 11. 状态归属总表

| 主要组成部分 | 状态 owner | 状态族 | 维护触发 |
|---|---|---|---|
| 能力身份与接入语境 | `CapabilityIdentity`;`CapabilityAccessReviewFact`;`ExternalCapabilitySourceRef` | identity、review fact、source ref resolution | identity / review commands;source ref consumer |
| 注册目录与生命周期 | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryChangeRecord` | registry lifecycle、visibility pending / formal visible | registry commands;reconciliation job only reports |
| 接入描述与风险摘要 | `AdapterDescriptor`;`DescriptorRiskConstraintSummary`;`SecretRef`;`SecretHandlingSafeSummary` | descriptor lifecycle、risk availability、secret ref / safe summary | descriptor / risk / secret commands;safe summary refresh |
| 治理与方法关系 | `GovernanceSeamRelation`;`GovernanceResultRef`;`CapabilityMethodBodyFreeRelation`;`MethodAssetRef` | seam、governance ref、method relation、method ref | seam / relation commands;governance / method ref consumers |
| 正式暴露与受控消费 | `FormalExposureBoundary`;`FormalVisibilityApplicability`;`ControlledConsumerView` | exposure、visibility、consumer view freshness | exposure commands;visibility commands;consumer view refresh job |
| 追溯、变化与影响 | `CapabilityAccessTraceabilityRecord`;`CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary` | traceability、impact、downstream summary | impact command;downstream consumer;handoff command |
| 派生维护与只读输出 | `DirectorySearchBrowseProjection`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary`;`CapabilityReconciliationReport` | projection freshness、export、discovery、reconciliation report | rebuild / export / discovery / reconciliation jobs |
| 外部引用与安全摘要支撑 | `ReferenceResolutionState`;`ExternalDocumentRef`;`RuntimeToolsConsumerRef`;`SdkExposureConsumerRef`;`ObservabilityAuditRef`;`CapabilityAccessEventCollaborationPort` | reference resolution、external ref、event collaboration | reference commands;ref consumers;reference refresh;event repair |

---

## 12. 状态归属停审记录

| 主要组成部分 | 状态是否归属对象 | 触发接口 / flow 是否存在 | 允许 / 禁止迁移是否清楚 | 传播是否过度或缺失 | 越界检查 |
|---|---|---|---|---|---|
| 能力身份与接入语境 | pass | pass | pass | pass | 未引入 runtime、provider、SDK 或 governance approval 状态。 |
| 注册目录与生命周期 | pass | pass | pass | pass | 未将 registry 写成 allowlist、cache、listing 或 search truth。 |
| 接入描述与风险摘要 | pass | pass | pass | pass | 未恢复 ProviderContract、KMS、secret body、quota、route、cost、failover。 |
| 治理与方法关系 | pass | pass | pass | pass | seam / relation 不拥有 approval / Policy truth 或 method body。 |
| 正式暴露与受控消费 | pass | pass | pass | pass | consumer view、SDK、runtime、tools 不反写 exposure。 |
| 追溯、变化与影响 | pass | pass | pass | pass | 不保存 observability store、audit log、cost ledger 或 execution payload。 |
| 派生维护与只读输出 | pass | pass | pass | pass | projection / export / discovery / report 不创造业务 truth。 |
| 外部引用与安全摘要支撑 | pass | pass | pass | pass | ref state 不复制外部正文;event collaboration 不写 outbox / relay 实现。 |

---

## 13. 跨状态一致性审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| 是否存在孤儿状态 | pass。状态均来自 Step 6 对象或 Step 7 / 8 后移 port / job 主语。 | Step 10 异常边界继续沿这些状态展开。 |
| 是否存在状态触发未定义 | pass。所有核心状态变化均能回指 Step 7 接口和 Step 8 flow。 | 详细设计不得新增未追溯 command / job / consumer。 |
| 是否存在同名状态语义冲突 | pass。`unresolved`、`unavailable`、`forbidden`、`stale`、`pending` 已按语义族定义。 | 详细设计 enum 可按对象命名,但含义不得漂移。 |
| 是否存在 Query 写状态 | pass。Query 只返回 state surface。 | Step 10 异常中继续保护 query no-write。 |
| 是否存在 Inbound Event 直接写核心 truth | pass。Consumer 只写 ref state、summary、stale marker 或 command intent。 | relation truth 仍由 Command 改写。 |
| 是否存在 Job 修核心 truth | pass。Job 只写 projection、summary、report、reference state 或 handoff / collaboration status。 | registry / exposure / identity 修复必须走 Command。 |
| 是否存在派生材料反写真相 | pass。consumer view、search、browse、export、discovery、reconciliation 均是 snapshot / projection / report。 | Step 11 配置影响不得改变该边界。 |
| 是否存在 forbidden body 入仓 | pass。secret、governance、method、runtime、SDK、observability、marketplace 和 external document 均以 ref / allowed summary / projection 表达。 | DTO / event payload 在 03 不得恢复 forbidden body。 |
| 是否存在旧状态口径回流 | pass。旧 ProviderContract、CapabilityDecision、CostRecord、QueryCapabilities、KMS / Vault、policy refresh、runtime state 和 outbox relay 均未作为状态主语。 | 旧材料继续保留为 historical material。 |
| 是否足以支撑 Step 10 | pass。异常与边界场景可围绕 unresolved、forbidden、stale、unavailable、pending、partial、rebuild_required、failed 等状态继续展开。 | 用户确认后进入 Step 10。 |

---

## 14. 旧材料差异审计

| 旧材料状态 / 主语 | 当前处理 | 理由 |
|---|---|---|
| `ProviderContract` lifecycle | 不继承。由 `AdapterDescriptorState`、`SecretRefState`、`SecretHandlingSafeSummaryState` 和 `ReferenceResolutionValue` 分层替代。 | 旧主语混合 provider runtime、secret、quota、route、cost、failover。 |
| `CapabilityDecision` / allow-deny 状态 | 不继承。formal exposure、visibility 和 consumer view 分层表达。 | capability-hub 不做 runtime allow / deny enforcement。 |
| `CostRecord` 状态 | 不继承。 | cost / billing / finance ledger 已被需求和架构裁出本仓。 |
| `QueryCapabilities` 状态 | 不继承。拆为 formal exposure state、consumer view freshness、directory projection 和 reference surface。 | 旧名混合 formal truth、runtime 高频查询、policy decision 和 consumer cache。 |
| KMS / Vault secret lifecycle | 不继承。只保留 `SecretRefState` 和 `SecretHandlingSafeSummaryState`。 | 本仓不是 secrets 平台。 |
| governance approval / Policy refresh 状态 | 不继承。只保留 `GovernanceSeamState` 和 `GovernanceResultRefState`。 | approval、Policy effective fact 和 shared_rules truth 属于 `L1-governance`。 |
| method asset lifecycle | 不继承。只保留 `CapabilityMethodRelationState` 和 `MethodAssetRefState`。 | method body 与 method lifecycle 属于 `L3-method-library`。 |
| runtime / tools execution state | 不继承。 | execution truth 属于执行侧。 |
| marketplace listing / provider lookup 状态 | 不继承。只保留只读生态发现摘要状态。 | listing / transaction / provider runtime 不归本仓。 |
| outbox relay / retry 状态 | 不继承为概要实现状态。只保留 event collaboration status。 | Step 9 只表达协作状态,不写 outbox / relay 实现。 |

### 14.1 Blocker 记录

| Blocker ID | 位置 | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| `CH-HLD-STATE-001` | 旧 `02/03` 状态主线 | resolved_for_step_9 | 旧材料把 ProviderContract、CapabilityDecision、CostRecord、QueryCapabilities、KMS / Vault、policy refresh、runtime execution state、marketplace listing 和 outbox relay 混入状态机。 | Step 9 已按新版 Step 6/7/8 重建多状态族,旧状态口径全部隔离为 historical material。 |

---

## 15. 正式 §9 回填草稿

> 注意: 本节只是 Step 14 装配正式 `02-概要设计.md` 时的回填草稿,当前不直接修改正式文档。

````md
## 9. 状态定义与状态流转

> 校准来源：
> - `design-calibration/02_hld_step_09_state_machine.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/02_hld_step_09_state_machine.md` 的“按主要组成部分组织的状态定义与迁移”“状态传播关系”“跨状态一致性审计”和“旧材料差异审计”小节,了解状态集合如何从 Step 6 对象、Step 7 接口和 Step 8 处理流收敛。

### 9.1 状态机边界

`L3-capability-hub` 没有单一全局 `CapabilityStatus`。本仓状态按核心 truth、relation、snapshot / projection、reference resolution 和 event collaboration 分组表达。identity、registry、descriptor、governance seam、method relation、formal exposure 是核心接入事实主线;controlled consumer view、directory projection、audit export、ecosystem discovery 和 reconciliation report 是派生 / 只读状态;governance、method、secret、runtime、SDK、observability、marketplace 和 external document 只以 ref 或 allowed summary 表达。

### 9.2 状态定义表

| 状态组 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| capability identity | `candidate`;`active`;`correction_pending`;`retired`;`unresolved` | 外部能力身份从候选到正式成立、更正、退役或不可解析。 | `active` 是;`correction_pending` 受限;其余否 | identity 是后续 registry、descriptor、seam、relation 和 exposure 的主体锚点。 |
| access review fact | `draft`;`recorded`;`superseded`;`invalidated` | 接入审查事实从草稿到记录、替代或作废。 | `recorded` 是 | 不等于 governance approval。 |
| registry lifecycle | `draft`;`registered`;`undescribed`;`ungoverned`;`visibility_pending`;`formal_visible`;`retired` | 目录项从草稿、注册、前置缺失到正式可见或退役。 | `registered` 是;`formal_visible` 是;缺失前置状态否 | 不代表 runtime allow / deny 或 marketplace listing。 |
| descriptor / risk / secret | descriptor `draft / accepted / unresolved / replaced / retired`;risk `available / partial / unavailable / superseded`;secret `resolved / unresolved / stale / unavailable / forbidden` | 接入描述、风险摘要和 secret safe summary 的成立与可用性。 | `accepted` descriptor 与 `available / partial` 摘要可进入受控判断 | 不保存 provider runtime、secret 正文、quota、route、cost 或 failover。 |
| governance seam | `pending`;`active`;`unresolved`;`expired`;`forbidden` | capability 与 governance result ref 的关系状态。 | `active` 是 | 不拥有 approval / Policy / shared_rules truth。 |
| method relation | `pending`;`active`;`stale`;`unresolved`;`removed`;`forbidden` | capability 与 method asset ref 的 body-free relation 状态。 | `active` 是;`stale` 受限 | 不保存 method body。 |
| formal exposure / visibility | exposure `draft / pending / accepted / active / suspended / unavailable / retired`;visibility `not_visible / pending / visible / unavailable / retired` | 服务端正式暴露边界和正式可见性状态。 | `accepted / active` exposure 和 `visible` visibility 是 | 不由 SDK client、runtime cache 或 query view 反写。 |
| consumer view freshness | `ready`;`stale`;`rebuilding`;`unavailable`;`partial` | 受控消费快照的新鲜度和可读性。 | `ready` 是;`stale / rebuilding / partial` 受限 | snapshot 不反写 formal exposure。 |
| trace / impact | trace `recorded / partial / handoff_pending / superseded`;impact `identified / partial / delayed / ignored / resolved` | 追溯、变化影响和 handoff 状态。 | `recorded`;`identified`;`resolved`;`ignored` 是 | downstream summary 不保存执行正文或下游 truth。 |
| derived material | projection / export / discovery `ready / stale / rebuilding / partial / unavailable`;reconciliation `completed / partial / inconsistent / rebuild_required / failed` | 派生材料、导出、发现和对账状态。 | `ready / completed` 是;其余受限或否 | 派生材料可重建,不得反写真相。 |
| reference resolution | `resolved`;`unresolved`;`stale`;`invalid`;`unavailable`;`forbidden` | 外部 ref 是否可被本仓安全引用。 | `resolved` 是 | 不拥有外部 truth,不得保存 forbidden body。 |
| event collaboration | `candidate`;`pending_delivery`;`delivered`;`failed`;`handoff_unavailable` | 已成立事实的协作 / handoff 进度。 | 不适用 | 不是业务 truth,不定义 outbox / relay 实现。 |

### 9.3 状态流转图

#### 状态流转图

```text
external capability source
  │ EstablishCapabilityAccessContext
  ▼
identity candidate
  │ identity accepted
  ▼
identity active
  │ RegisterCapabilityInRegistry
  ▼
registry registered
  │ descriptor / governance / method prerequisites
  ▼
registry visibility_pending
  │ prerequisites resolved
  ▼
registry formal_visible
  │ EstablishFormalExposureBoundary
  ▼
formal exposure accepted
  │ visibility applicable
  ▼
formal exposure active
  │ truth or prerequisite change
  ▼
consumer view stale
  │ RefreshControlledConsumerView
  ▼
consumer view ready
```

关键说明：
- 图表达核心接入事实从外部来源、identity、registry、visibility 到 formal exposure 和 consumer view 的主线状态方向。
- descriptor、governance seam 和 method relation 是 formal visibility / exposure 前置,其内部状态独立定义。
- consumer view 的刷新由后台维护触发,Query 不得修复状态。
- 图不表达数据库字段、错误码、事务、重试、topic、payload、outbox 或 SDK / runtime 实现。

### 9.4 允许 / 禁止迁移

允许的核心迁移：
- identity 可从 `candidate` 进入 `active / unresolved / retired`,从 `active` 进入 `correction_pending / retired`,从 `correction_pending` 回到 `active` 或进入 `retired`。
- registry 可从 `draft` 进入 `registered`,再根据 descriptor / governance / visibility 前置进入 `undescribed / ungoverned / visibility_pending / formal_visible`,所有非退役状态可显式进入 `retired`。
- descriptor 可从 `draft` 进入 `accepted / unresolved`,已接受 descriptor 可进入 `replaced / retired`。
- seam / relation 可从 `pending` 进入 `active / unresolved / forbidden`,已成立关系可进入 `expired / stale / removed` 等受控状态。
- exposure 可从 `draft / pending` 进入 `accepted`,从 `accepted` 进入 `active / unavailable / retired`,从 `active` 进入 `suspended / unavailable / retired`。
- consumer view 与派生材料可在 `ready / stale / rebuilding / partial / unavailable` 之间由维护 Job 推进。
- reference resolution 可在 `resolved / unresolved / stale / invalid / unavailable / forbidden` 之间由 Command、consumer 或 refresh job 推进。

禁止的核心迁移：
- 禁止未 active 的 identity、未 registered / formal_visible 的 registry、未 accepted 的 descriptor 或 unresolved seam / relation 直接进入 formal exposure active。
- 禁止 retired identity、registry 或 exposure 原地恢复为 active。
- 禁止 Query、consumer view、projection、search、export、discovery、reconciliation 或 downstream summary 反写核心 truth。
- 禁止 inbound event 绕过 Command 直接改写 seam / relation / exposure truth。
- 禁止 Job 修复 identity、registry、descriptor、seam、relation 或 exposure truth。
- 禁止 governance truth、method body、secret 正文、runtime execution、SDK client、marketplace listing、observability store 或 cost ledger 通过状态迁移进入本仓。

### 9.5 状态传播关系

#### 状态传播关系图

```text
core truth / relation / exposure state change
  │ write change record or traceability record
  ▼
capability access event candidate
  │
  ├─► affected consumer view freshness = stale
  │
  ├─► directory / export / discovery material = stale or rebuild_required
  │
  ├─► impact fact = identified / partial / delayed
  │
  └─► event collaboration = candidate / pending_delivery

reference resolution state change
  │
  ├─► dependent seam / relation / descriptor / exposure = pending or unavailable
  │
  ├─► affected derived material = stale or partial
  │
  └─► handoff / audit surface = partial or unavailable
```

关键说明：
- 核心 truth 状态变化必须产生 change / trace 线索,并影响受控消费、派生材料、impact 和 event collaboration。
- reference 状态变化只能影响本仓 ref surface、pending / unavailable 前置和派生新鲜度,不能补造外部 truth。
- event collaboration 状态只说明协作进度,不定义 outbox、topic、payload、relay 或 retry 实现。
- 派生材料进入 stale / rebuild_required 后只能由 Job 重建,不能反写真相。
````

---

## 16. 待确认事项

### 16.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否合并为单一 `CapabilityStatus` | A. 合并;B. 保持多状态族 | B | capability-hub 同时拥有 truth、relation、snapshot、ref 和 event collaboration,合并会混淆 owner 和触发。 | 已采用 B |
| `accepted` 与 `active` exposure 是否同时保留 | A. 只保留 active;B. 同时保留 | B | `accepted` 表示服务端 exposure truth 成立,`active` 表示可见性和适用性使其可消费。 | 已采用 B |
| `unresolved`、`unavailable`、`forbidden` 是否作为统一失败态 | A. 统一;B. 分开 | B | 三者分别表示不可解析、暂不可用和越界 / forbidden body,后续异常处理不同。 | 已采用 B |
| event collaboration 是否展开 outbox 状态 | A. 展开;B. 只保留协作状态 | B | Step 9 不能写 outbox / relay 实现;详细设计后续再承接。 | 已采用 B |

### 16.2 本 Step 未确认事项

| 未确认项 | 后续承接 |
|---|---|
| 完整 enum 命名、字段名、状态 guard、错误映射、expected version、并发冲突和事务边界 | `03-详细设计.md` |
| 完整 DTO、event schema、topic、payload、consumer group、relay、retry 和 outbox 持久化形态 | `03-详细设计.md`;`05-测试方案.md`;`07-实施计划.md` |
| 状态异常、边界场景、恢复和降级策略 | Step 10 `异常与边界场景轮廓` |
| 配置是否会影响状态刷新、派生维护或外部 ref 解析 | Step 11 `配置影响轮廓` |

---

## 17. 进入下一步条件

- 已明确本仓存在多个正式状态族,不存在单一全局状态机。
- 已按 8 个主要组成部分定义状态集合、状态含义、正常主线判断和说明。
- 已列出允许迁移、禁止迁移、状态流转图和状态传播关系图。
- 每个状态主题均能回指 Step 6 对象、Step 7 接口和 Step 8 处理流。
- 已完成每个主要组成部分的状态归属停审记录。
- 已完成跨状态一致性审计,未发现 unresolved 冲突。
- 旧状态主线污染已记录为 `CH-HLD-STATE-001`,当前不阻塞进入 Step 10。
- 正式 `02-概要设计.md` 未修改,等待 Step 14 装配。

当前 gate_status = `pass_wait_review`。用户确认后,下一步应读取:

- `standards/document/概要设计讨论流程_SOP.md` Step 10
- `standards/document/概要设计书写规范.md` §4.10
- `design-calibration/02_hld_step_01_upstream_boundary.md` 至 `02_hld_step_09_state_machine.md`
- 正式 `00-需求文档.md`
- 正式 `01-架构设计.md`
- 参考项目 `projects/L1-governance/design-calibration/02_hld_step_10_exceptions_boundaries.md`
- 参考项目 `projects/L3-method-library/design-calibration/02_hld_step_10_exceptions_boundaries.md`

当前不需要提交 commit。
