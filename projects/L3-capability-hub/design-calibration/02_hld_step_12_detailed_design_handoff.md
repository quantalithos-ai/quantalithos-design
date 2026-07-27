# L3-capability-hub 02 概要 Step 12: 详细设计承接清单

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 12
> 回填章节: `projects/L3-capability-hub/02-概要设计.md` §12 详细设计承接清单
> 生成日期: 2026-07-09
> 状态: completed_wait_user_review
> 本轮口径: 只把 Step 4 ~ Step 11 已收稳的代码主体、主要组成部分、对象、接口、处理流、状态、异常和配置影响列为 `03-详细设计.md` 的稳定输入;不新增对象、接口、流程、状态、配置项、测试结果、实现任务、commit boundary、run_id 或验收签署。

---

## 0. Step 开工确认

| 项目 | 内容 |
|---|---|
| 当前文档 | `02-概要设计.md` |
| 当前 Step | Step 12 `详细设计承接清单` |
| 用户确认 | 用户已回复“同意”,允许从 Step 11 进入 Step 12 |
| 正式文档写入 | 本 Step 不修改正式 `02-概要设计.md`;正式装配仍留到 Step 14 |
| 上游基线 | 新版 `00-需求文档.md`;新版 `01-架构设计.md`;`02` Step 1 ~ Step 11 中间产物 |
| 旧材料处理 | 旧 `02/03/05/06`、README 仅作 historical material 和差异审计,不得作为详细设计输入 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 恢复点确认 | done | 已读取项目台账和 `02_hld_calibration_flow.md`,确认 Step 11 已获用户同意 | pass | 进入标准与上游读取 |
| 标准读取 | done | 已读取概要设计 SOP Step 12、概要设计书写规范 §4.12 和表格模板 | pass | 进入上游结论接收 |
| 上游结论接收 | done | 接收 Step 4 ~ Step 11 的稳定主语和禁止越界项 | pass | 进入 SOP 问题回答 |
| SOP 问题回答 | done | 回答 6 个 Step 12 必问问题 | pass | 进入承接清单表 |
| 详细设计承接清单表 | done | 输出已收稳主语与详细设计继续展开方向 | pass | 进入继续展开方向 |
| 继续展开方向 | done | 输出对象、接口、流程、持久化、配置、测试承接方向 | pass | 进入回退规则 |
| 回退规则与排除项 | done | 输出概要设计回退规则和不进入本清单内容 | pass | 进入旧材料差异审计 |
| 旧材料差异审计 | done | 记录旧 `02/03` 污染项不作为当前 handoff | pass | 进入回填草稿 |
| 回填草稿 | done | 准备正式 §12 回填草稿,但不写正式 `02` | pass | 进入停审 |
| 自检与停审 | done | 检查未新增主语、未下沉详细实现、未伪造证据 | pass_wait_review | 等待用户审查 Step 12;确认后进入 Step 13 |

---

## 2. 必读文档

| 文档 | 已读取结论 | 对本 Step 的约束 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 12 | 本步输出详细设计承接清单表、详细设计继续展开方向说明、概要设计回退规则说明。 | 只写 Step 4 ~ Step 11 已收稳结论,不新增对象 / 接口 / 流程 / 状态。 |
| `standards/document/概要设计书写规范.md` §4.12 | §12 必须使用“已由概要设计收稳 / 详细设计继续展开”表,且禁止画图。 | 本文件不画图,不写实施路线图、任务拆分图或开发排期图。 |
| `design-calibration/02_hld_step_04_code_subject_framework.md` | 已收稳 8 个业务主要组成部分候选和实现分层。 | 详细设计不得把 Inbound / Application / Domain / Ports 等实现层误当业务组成部分。 |
| `design-calibration/02_hld_step_05_components_boundary.md` | 已收稳 8 个主要组成部分、职责 / 非职责、capability 清单和对象发现线索。 | `03` 必须按这些组成部分继续展开,不得恢复 provider / cost / decision 主线。 |
| `design-calibration/02_hld_step_06_key_objects.md` | 已正式化 43 个关键对象,并完成对象反查和旧对象污染审计。 | `03` 可补完整字段、函数、状态和不变量,但不能替换对象 owner。 |
| `design-calibration/02_hld_step_07_api_interface_skeleton.md` | 已按 Command / Query / Inbound Event Consumer / Outbound Event / Operations Job / External Port Skeleton 分类。 | `03` 可补协议和错误面,但不得把 Query / Job / Consumer 变成核心 truth 写入口。 |
| `design-calibration/02_hld_step_08_processing_flows.md` | 已收稳通用写 / 读 / consumer / job / event candidate 路径和重点独立处理流。 | `03` 可补 service、repository、transaction、port trait,但不得改处理流读写性质。 |
| `design-calibration/02_hld_step_09_state_machine.md` | 已收稳多状态族、允许 / 禁止迁移和状态传播。 | `03` 可补 enum、guard、并发和错误映射,但不得合并为单一 `CapabilityStatus`。 |
| `design-calibration/02_hld_step_10_exceptions_boundaries.md` | 已收稳 Command / Query / Consumer / Job / event collaboration 异常边界。 | `03` 可补错误码、retry、quarantine 和 response schema,但不得改变红线。 |
| `design-calibration/02_hld_step_11_configuration_impact.md` | 已收稳配置影响轮廓、禁止配置化边界和 `03/04` 分工。 | `03` 只收口配置实现契约,`04` 再说明具体 key、默认值、环境变量和填写规则。 |
| `projects/L1-governance/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 参考其单文件承接清单、继续展开方向和回退规则密度。 | 只参考结构粒度,不复制 governance 领域主语。 |
| `projects/L1-artifact/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 参考其将对象、接口、flow、状态、异常和配置统一交给 `03` 的方式。 | 本仓仍以 capability identity / registry / descriptor / seam / exposure 为主线。 |
| `projects/L3-method-library/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 参考其旧材料污染审计和正式 §12 草稿壳层。 | 本仓不继承旧 `ProviderContract`、`QueryCapabilities` 或 method body 口径。 |

---

## 3. SOP 问题回答

### 3.1 哪些代码主体框架已经由概要设计收稳,详细设计不能重新发明?

已收稳的代码主体框架包括:

- 业务主要组成部分:能力身份与接入语境、注册目录与生命周期、接入描述与风险摘要、治理与方法关系、正式暴露与受控消费、追溯 / 变化与影响、派生维护与只读输出、外部引用与安全摘要支撑。
- 实现分层:Inbound / Operations、Application Services、Domain Model and Policies、Ports、Persistence、Projection / Material、Collaboration / External Adapters。
- 核心代码主体方向:`CapabilityIdentityService`、`CapabilityRegistryService`、`AdapterDescriptorService`、`CapabilityGovernanceRelationService`、`CapabilityExposureService`、`CapabilityTraceabilityService`、`CapabilityDerivedMaintenanceService`、`CapabilityReferenceResolutionService`。
- 关键边界:核心 truth、relation truth、safe summary、controlled consumer view、derived material、reference state、event collaboration / handoff 均分层表达。

详细设计可以继续落 module / service / repository / port / adapter / projection / job runner 的正式边界,但不能把 runtime execution、tools execution、governance approval、method body、SDK client、marketplace listing、secret / KMS、cost / billing、provider runtime 或 observability store 合并进 capability-hub。

### 3.2 哪些对象、接口、处理流和状态机已经成为详细设计输入?

以下内容已经成为 `03-详细设计.md` 的稳定输入:

- Step 5 的 8 个主要组成部分与每个组成部分的 capability / 非职责 / 接缝。
- Step 6 的 43 个关键对象,覆盖 identity、registry、descriptor、governance seam、method relation、formal exposure、trace / impact、derived material 和 external reference support。
- Step 7 的六类接口骨架:Command、Query、Inbound Event Consumer、Outbound Event、Operations Job、External Port Skeleton。
- Step 8 的通用处理流和独立处理流:P0 Command、复杂 Query、body-free Inbound Consumer、Operations Job、统一 Outbound Event Candidate。
- Step 9 的多状态族:identity / review、registry、descriptor / risk / secret、governance / method relation、formal exposure / consumer view、trace / impact / handoff、derived material、reference / event collaboration。
- Step 10 的异常边界:Command invalid / forbidden / unresolved、Query degraded no-write、Consumer duplicate / unsupported / forbidden body、Job failed no truth repair、event collaboration failure no rollback。
- Step 11 的配置影响轮廓:entry、consumer、job、adapter、publisher、handoff 和 external port 受配置影响;domain object、policy、核心状态机和 truth owner 不直接读取配置。

### 3.3 详细设计应继续展开哪些字段、协议、函数、事务、异常和测试内容?

详细设计应继续展开:

- 每个关键对象的正式 aggregate / entity / value object / enum / typed ref、字段、状态字段、工厂函数、成员函数、不变量和 domain error。
- 每个 Command / Query / Consumer / Outbound Event / Job / Port 的 request / response、envelope、result、receipt、error surface、idempotency、actor / trace context 和 authorization / visibility 语义。
- 每个关键处理流的 application service 编排、repository / port trait、transaction boundary、expected version、stored result、change record、trace link、event candidate 和 fallback surface。
- 每个状态族的正式状态矩阵、允许 / 禁止迁移、guard、并发冲突、重复请求 replay、状态传播和序列化 / migration 口径。
- 每个异常族的错误分类、response mapping、retry / delayed / quarantine / dead-letter / recovery 切口和 negative tests。
- persistence / projection / material / report / handoff / event collaboration 的持久化 surface 和只读 / 派生边界。
- runtime builder、config owner、ConfigValidator、AdapterConfig、JobConfig、Query / ReadConfig、Consumer / EventConfig、Publisher / HandoffConfig 的实现契约,但不写配置 key / 默认值 / env var。
- 后续 `05-测试方案.md` 与 `06-验收标准.md` 需要承接的测试矩阵输入,不在本步伪造测试结果或验收证据。

### 3.4 如果详细设计发现主语需要变更,应回退到哪里修正?

如果详细设计发现需要新增、删除、合并、重命名或改变职责归属,说明概要设计尚未真正收稳,必须回退到对应概要 Step 修正,不得在 `03-详细设计.md` 中暗改。

- 代码主体、实现分层或业务主线变更:回退 Step 4。
- 主要组成部分、职责、非职责或接缝变更:回退 Step 5。
- 关键对象、对象 owner、对象类别或对象边界变更:回退 Step 6。
- 接口分类、接口族、读写性质或 external port skeleton 变更:回退 Step 7。
- 处理流族、处理顺序、Query no-write、Consumer / Job 红线变更:回退 Step 8。
- 状态族、状态主线、允许 / 禁止迁移或传播关系变更:回退 Step 9。
- 异常边界、forbidden body 处理、degraded surface 或 event failure 口径变更:回退 Step 10。
- 配置影响、禁止配置化边界、runtime builder / adapter / job / handoff 配置口径变更:回退 Step 11。
- truth owner、数据归属、依赖裁剪、非目标或上游架构边界变更:回退 Step 1 ~ Step 3,必要时回到 `00` 或 `01`。

### 3.5 哪些配置影响需要交给详细设计收口为实现契约?

需要交给 `03-详细设计.md` 收口为实现契约的配置影响包括:

- entry / command / query / consumer / job / port / publisher / handoff 的 config owner 和 runtime builder 注入边界。
- Config validation 的 startup blocked、entry disabled、adapter unavailable、job delayed、handoff unavailable、degraded / forbidden surface。
- AdapterConfig 对 external source、governance result、method asset、secret safe summary、consumer ref、observability / audit ref、external document ref 的抽象方式。
- JobConfig 对 refresh、rebuild、reconciliation、reference resolution、consumer view refresh、event collaboration repair 的 scope、cursor、batch、retry category 和 report surface。
- Query / ReadConfig 对 freshness hint、projection availability、fallback、redaction、page / filter 和 consumer view profile 的只读 surface。
- Consumer / EventConfig 对 source profile、schema / contract version allowlist、dedup、forbidden body check、delayed / ignored / rejected surface 的契约。
- Publisher / HandoffConfig 对 event candidate、publisher result、handoff target、delivery failure 和 handoff unavailable 的抽象。

具体配置 key、默认值、环境变量、secret 名称、产品参数、部署挂载、retry 数字、cron、worker 并发和 message bus 参数仍后移 `04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md` 或 `07-实施计划.md`。

### 3.6 哪些未闭环内容不能写入承接清单,而应进入风险与待确认事项?

以下内容不能当作“已由概要设计收稳”写入本承接清单:

- 具体 DB、cache、message bus、search、object storage、audit store、API gateway、external source、KMS / secret 平台或 observability 产品选型。
- `QueryCapabilities` 兼容名、旧 ProviderContract、旧 CapabilityDecision、CostRecord、policy refresh、allow / deny、provider lookup、outbox relay 等旧实现主语。
- 完整 DTO schema、Rust trait、DDL、索引、topic、payload、worker loop、retry / backoff 数字、dead-letter 参数、capacity / SLO 数字。
- governance approval / Policy truth、method body / method lifecycle、runtime execution payload、tools execution result、SDK package / cache、marketplace listing / transaction、secret 正文、cost ledger、observability store 正文。
- 完整测试用例全集、真实 evidence alias、验收签署、实现 commit、run_id、开发排期和实施 boundary。

---

## 4. 上游结论接收清单

| 来源 Step | 已收稳结论 | 本 Step 接收方式 |
|---|---|---|
| Step 4 代码主体框架 | 业务主要组成部分与实现分层分开;旧 provider / cost / decision / KMS / QueryCapabilities 主线被排除。 | 作为 `03` module / layer / service / port 展开上限。 |
| Step 5 主要组成部分 | 8 个业务主要组成部分、capability、对象发现线索和跨组成部分接缝已收稳。 | 作为 `03` 模块 owner 和对象 / 接口归属的上限。 |
| Step 6 关键对象 | 43 个正式关键对象及其所属组成部分已收稳。 | 作为 `03` struct / enum / value object / repository / fixture 展开输入。 |
| Step 7 接口骨架 | Command / Query / Inbound / Outbound / Job / Port 分类和读写性质已收稳。 | 作为 `03` protocol / handler / port trait / DTO 展开输入。 |
| Step 8 处理流 | 通用路径、P0 Command、复杂 Query、Consumer、Job、event candidate 处理流已收稳。 | 作为 `03` service 编排、transaction、outbound candidate 和 error path 展开输入。 |
| Step 9 状态机 | 多状态族、允许 / 禁止迁移、状态传播和 no-write 红线已收稳。 | 作为 `03` enum、guard、state transition matrix 和 concurrency 展开输入。 |
| Step 10 异常边界 | Command / Query / Consumer / Job / event collaboration 异常落点和红线已收稳。 | 作为 `03` error taxonomy、response mapping 和 negative tests 输入。 |
| Step 11 配置影响 | 受配置影响结构、禁止配置化边界和 `03/04` 分工已收稳。 | 作为 `03` runtime construction contract 和 `04` 配置说明输入。 |

---

## 5. 详细设计承接清单表

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| 8 个业务主要组成部分 | 为每个组成部分定义 module boundary、application service、domain owner、repository / projection / port / job 归属和跨部分协作契约。 |
| Inbound / Operations、Application Services、Domain Model and Policies、Ports、Persistence、Projection / Material、Collaboration / External Adapters 实现分层 | 定义 crate / module / handler / service / trait / adapter / builder 的正式边界,但不改变业务 owner。 |
| 能力身份与接入语境 | 定义 `CapabilityIdentity`、`CapabilityAccessReviewFact`、`CapabilityIdentityPolicy`、`ExternalCapabilitySourceRef`、`CapabilityIdentityChangeRecord` 的字段、函数、状态和持久化契约。 |
| 注册目录与生命周期 | 定义 `CapabilityRegistryEntry`、`RegistryLifecycleState`、`RegistryVisibilityPolicy`、`RegistryChangeRecord` 的生命周期、visibility guard、history 和 query view。 |
| 接入描述与风险摘要 | 定义 `AdapterDescriptor`、`DescriptorRiskConstraintSummary`、`SecretRef`、`SecretHandlingSafeSummary`、`DescriptorBoundaryPolicy`、`DescriptorChangeRecord` 的 safe summary、forbidden body 和 descriptor unavailable surface。 |
| 治理与方法关系 | 定义 `GovernanceSeamRelation`、`GovernanceResultRef`、`GovernanceSeamPolicy`、`CapabilityMethodBodyFreeRelation`、`MethodAssetRef`、`MethodRelationBoundaryPolicy` 与两类 change record 的 body-free relation 契约。 |
| 正式暴露与受控消费 | 定义 `FormalExposureBoundary`、`FormalVisibilityApplicability`、`FormalExposurePolicy`、`ControlledConsumerView`、`ConsumerViewFreshnessPolicy`、`CapabilityExposureChangeRecord` 的 truth / projection 分层和 consumer-scope read surface。 |
| 追溯、变化与影响 | 定义 `CapabilityAccessTraceabilityRecord`、`CapabilityChangeImpactFact`、`DownstreamConsumptionImpactSummary` 的 trace link、impact summary、handoff marker 和下游反馈边界。 |
| 派生维护与只读输出 | 定义 `DirectorySearchBrowseProjection`、`AuditFriendlyExportSummary`、`ReadOnlyEcosystemDiscoverySummary`、`CapabilityReconciliationReport`、`DerivedMaterialPolicy` 的 rebuild source、freshness、report 和 no-truth-write guard。 |
| 外部引用与安全摘要支撑 | 定义 `ReferenceResolutionState`、`ReferenceResolutionPolicy`、`ExternalDocumentRef`、`RuntimeToolsConsumerRef`、`SdkExposureConsumerRef`、`ObservabilityAuditRef` 的 resolution state、safe summary 和 forbidden body 拒绝面。 |
| Command API 骨架 | 逐 Command 定义 request / response、actor context、metadata、idempotency、expected version、stored result、DomainError 和 event candidate 生成条件。 |
| Query API 骨架 | 逐 Query 定义 request / response、scope、visibility、freshness、page、degraded / not visible / unresolved surface 和 no-write tests。 |
| Inbound Event Consumer 骨架 | 定义 event envelope、source system ref、schema / contract version、dedup、forbidden body check、accepted / duplicate / ignored / delayed / rejected / quarantine receipt。 |
| Outbound Event 骨架 | 定义 event candidate 来源、publication envelope、fact ref / change record ref / trace context、unsupported consumer 和 publication failure surface,不提前固定 topic / payload 全集。 |
| Operations Job 骨架 | 定义 job input、scope、cursor、batch、idempotency、operator actor、report、partial failure、retryable / failed marker 和 no-core-truth-repair guard。 |
| External Port Skeleton | 定义 external source、governance result、method asset、consumer ref、observability / audit handoff、capability access event collaboration 的 port contract 与 unavailable / forbidden 映射。 |
| `GenericCommandWritePath` | 定义 validation、load current truth、domain transition、save truth / relation / summary / reference state、history / trace、stored result 和 event candidate 的事务顺序。 |
| `GenericQueryReadPath` | 定义 read authorization、projection / safe summary / reference state load、fallback、degraded response 和“读取不写入”的实现级保护。 |
| `GenericInboundEventConsumerPath` | 定义 envelope validation、dedup、version check、body-free mapping、stale marker / command intent / safe summary 写入和 consumer result。 |
| `GenericOperationsJobPath` | 定义 pending scan、source truth snapshot、projection / summary / report / reference state 更新、job result persistence 和 failure surface。 |
| `ProduceCapabilityAccessEventCandidate` | 定义 committed fact / change record / material refresh 形成 event candidate 的规则,以及投递失败不回滚已提交 truth。 |
| P0 Command 独立处理流 | 定义 identity intake、registry registration、descriptor establishment、governance seam attach、method relation attach、formal exposure establishment、impact fact record、reference state record 的 service 编排。 |
| 复杂 Query 独立处理流 | 定义 `GetControlledConsumerView`、`SearchCapabilityDirectory`、`GetReferenceResolutionState` 的 freshness、visibility、projection readiness、reference failure 和 degraded surface。 |
| Inbound Consumer 独立 / 同构处理流 | 定义 governance / method / external source / downstream impact / audit material / external document ref changed 的 body-free 接收、stale / pending / ignored 语义。 |
| Operations Job 独立处理流 | 定义 consumer view refresh、directory projection rebuild、audit export preparation、ecosystem discovery rebuild、derived reconciliation、external reference refresh、event collaboration repair。 |
| 8 组状态族 | 定义正式 enum、初始态、终态、允许 / 禁止迁移矩阵、状态传播、expected version、并发冲突和 migration / serialization 规则。 |
| Step 10 异常与边界场景 | 定义 error taxonomy、error-to-response mapping、duplicate replay、retry / delayed / quarantine / dead-letter、recovery cut 和 negative tests。 |
| Step 11 配置影响轮廓 | 定义 runtime builder、config owner、ConfigValidator、AdapterConfig、JobConfig、Query / ReadConfig、Consumer / EventConfig、Publisher / HandoffConfig 和 config failure surface。 |
| 禁止配置化边界 | 定义 config validation tests 和 safety gate,确保配置不能改变 truth owner、domain invariant、状态红线、forbidden body、Query / Consumer / Job 红线。 |
| 旧材料污染隔离结论 | 在 `03` 开篇继续声明旧 `ProviderContract`、`CapabilityDecision`、`CostRecord`、`QueryCapabilities`、KMS / Vault、policy refresh、execution gateway、outbox relay 不作为当前详细设计来源。 |

---

## 6. 详细设计继续展开方向

### 6.1 对象与状态契约

`03-详细设计.md` 必须把 Step 6 / Step 9 的对象和状态闭合为可落码契约:

- 对每个 aggregate / relation / summary / projection / ref / report / policy 定义正式字段、typed ref、newtype、enum variant、状态字段、factory、member function 和 invariant。
- 对 identity、registry、descriptor、seam、method relation、formal exposure、trace / impact、derived material、reference state 分别定义状态迁移函数、guard、DomainError 和 history / trace / event candidate 副作用。
- 对 forbidden body、safe summary、unresolved / stale / unavailable / forbidden state 定义不可伪装为 ready 的实现级保护。

### 6.2 协议与接口契约

`03` 必须把 Step 7 的接口骨架闭合为正式 protocol:

- Command / Query request-response DTO、actor context、metadata、trace context、idempotency key、expected version 和 stored result。
- Inbound / Outbound event envelope、source id、contract version、dedup key、trace context、publication result、unsupported version 和 quarantine / dead-letter surface。
- Operations Job input / report、cursor、scope、operator actor、idempotency、partial failure 和 retryable / failed marker。
- External Port contract 的 unavailable、forbidden、partial、degraded 和 handoff unavailable 映射。

### 6.3 Application flow 与事务契约

`03` 必须把 Step 8 的处理流闭合为 application / transaction contract:

- application service 编排、repository / port trait、unit-of-work、save order、history / trace / stale marker / event candidate 顺序。
- Command accepted / pending / rejected 的成立边界,以及 idempotency replay 与并发冲突处理。
- Query no-write、Consumer no-core-truth-write、Job no-core-truth-repair、event collaboration no-rollback 的实现级测试钩子。

### 6.4 Persistence / projection / handoff 契约

`03` 必须定义:

- truth repository、relation repository、history / change record repository、reference state repository、safe summary repository。
- projection / material repository、consumer view store、directory search / browse material、audit export summary、ecosystem discovery summary、reconciliation report。
- trace / impact / handoff / event collaboration 的 persisted shape、receipt、publication state、handoff target ref、failed marker 和 report surface。

### 6.5 配置与运行承载契约

`03` 必须定义:

- runtime builder、entry builder、adapter builder、consumer runner、job runner、publisher / handoff builder 的配置 owner。
- config validation 失败时的 startup blocked、entry disabled、adapter unavailable、job delayed、handoff unavailable、degraded / forbidden surface。
- domain object / policy / state machine 不直接读取配置的 dependency injection 边界。
- 对 `04-配置设计.md` 的承接:只输出配置项类别、填写位置、校验规则和运行装配说明,不在 `03` 伪造实际环境参数。

### 6.6 测试与验收承接

`03` 必须为后续 `05-测试方案.md` 和 `06-验收标准.md` 提供结构化输入:

- command state transition tests。
- object invariant / policy guard negative tests。
- DTO / envelope / job report contract roundtrip tests。
- query no-write / visibility / freshness / degraded tests。
- consumer duplicate / unsupported version / forbidden body tests。
- job no-truth-repair / partial failure / reconciliation report tests。
- config validation / forbidden configuration / boundary violation tests。

本 Step 不写真实测试结果、证据 alias、验收签署或 run_id。

---

## 7. 概要设计回退规则

如果详细设计发现下列问题,说明概要设计尚未真正收稳,应先回到概要设计修正,不得在 `03-详细设计.md` 中暗改。

| 详细设计发现的问题 | 回退位置 | 说明 |
|---|---|---|
| 需要改变代码主体框架、实现分层、业务主线或运行承载分层 | Step 4 | 代码主体框架必须先在概要层重审。 |
| 需要新增、删除、合并或重命名主要组成部分 | Step 5 | 主要组成部分是对象、接口、flow、状态的来源轴。 |
| 需要新增关键对象、删除对象、改变对象 owner 或恢复旧对象名 | Step 6 | 对象主语必须先进入关键对象轮廓。 |
| 需要新增 Command / Query / Consumer / Event / Job / Port 或改变读写性质 | Step 7 | 接口分类和读写边界必须先收稳。 |
| 需要改变处理流族、处理顺序、事务成立口径或 Query / Consumer / Job 红线 | Step 8 | 处理流变更会影响状态、异常和详细事务。 |
| 需要新增状态族、合并为单一状态机、改变允许 / 禁止迁移或状态传播 | Step 9 | 状态主线不能在详细设计暗改。 |
| 需要改变异常边界、forbidden body、degraded surface、event failure no-rollback 口径 | Step 10 | 异常边界关系到架构和测试否决线。 |
| 需要改变配置影响、禁止配置化边界或让配置绕过 domain invariant | Step 11 | 配置不能改变 truth owner 和状态红线。 |
| 需要改变 capability access truth owner、数据归属、依赖裁剪、非目标或上游依赖边界 | Step 1 ~ Step 3 / `00` / `01` | 已超出概要局部修正范围。 |

---

## 8. 不进入本承接清单的内容

| 内容 | 后续归属 |
|---|---|
| 具体数据库、cache、message bus、search、object store、API gateway、KMS / secret、observability、external provider 产品选型 | Step 13 风险与待确认 / `04` / `07` / ADR |
| 完整字段全集、DTO schema、Rust trait、DDL、索引、topic、payload、worker loop、retry 数字 | `03-详细设计.md` 后续 Step |
| 配置 key、默认值、环境变量、secret 名称、配置文件路径、部署挂载、产品参数 | `04-配置设计.md` |
| 完整测试用例、自动化脚本、证据路径、验收签署 | `05-测试方案.md` / `06-验收标准.md` |
| 实施 commit boundary、开发排期、planned boundary skeleton、implementation ledger | `07-实施计划.md` |
| runtime execution、tools execution、governance approval、method body、SDK client、marketplace listing / transaction、secret 正文、cost ledger、observability store 正文 | 边界外职责 / forbidden body |

---

## 9. 旧材料差异审计

| 旧材料内容 | 当前问题 | 本轮处理 |
|---|---|---|
| 旧 `ProviderContract` 作为核心对象 / 接口 / 配置主语 | 混入 provider runtime、secret、quota、route、cost、failover 和外部调用执行。 | 不继承;由 `AdapterDescriptor`、risk / constraint summary、secret ref / safe summary 和 descriptor boundary policy 分层替代。 |
| 旧 `CapabilityDecision` / allow-deny / policy refresh | 把 governance decision、runtime enforcement 和本仓 formal exposure 混写。 | 不继承;由 governance seam ref、formal exposure、controlled consumer view 和 Query degraded surface 分层替代。 |
| 旧 `QueryCapabilities` | 混合 formal exposure truth、runtime 高频查询、allow / deny、consumer cache 和 SDK view。 | 不继承;拆为 formal exposure Command、controlled consumer view Query、consumer view refresh Job 和 outbound event candidate。 |
| 旧 `CostRecord` / billing | cost ledger 不归 capability-hub。 | 不进入 `03` 承接清单;如需后续出现必须作为外部 ref 或边界外依赖。 |
| 旧 KMS / Vault / secret store | secret 平台与 secret 正文不归 capability-hub。 | 只保留 `SecretRef` 和 `SecretHandlingSafeSummary`;具体 secret 平台后移边界外 / 配置设计。 |
| 旧 provider lookup / runtime route / quota / failover | provider runtime 不归 capability-hub。 | 不进入当前 handoff;descriptor 只表达接入描述和风险摘要。 |
| 旧 outbox relay / retry 实现 | Step 8~11 只收稳 event candidate、handoff 和 failure surface,未定义 outbox 实现。 | `03/07` 可定义 planned boundary,但不得把投递失败写成 truth 回滚。 |
| 旧 `03` Rust 目录、service、repository、DTO、state | 建立在旧对象和接口主线之上。 | 只作 historical material;`03` 必须按新版 `02` Step 4~12 重新展开。 |

---

## 10. 正式 §12 回填草稿

> 注意: 本节只是 Step 14 装配正式 `02-概要设计.md` 时的回填草稿,当前不直接修改正式文档。

```md
## 12. 详细设计承接清单

> 校准来源：
> - `design-calibration/02_hld_step_12_detailed_design_handoff.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/02_hld_step_12_detailed_design_handoff.md` 的“详细设计承接清单表”“详细设计继续展开方向”“概要设计回退规则”和“旧材料差异审计”小节,了解 `03-详细设计.md` 应从哪些稳定输入继续展开。

本章把 Step 4 ~ Step 11 已收稳的代码主体、主要组成部分、关键对象、接口骨架、处理流、状态机、异常边界和配置影响显式交给 `03-详细设计.md`。详细设计可以补字段、协议、函数、事务、错误、持久化、配置实现契约和测试矩阵输入,但不得重新发明 capability-hub 的业务主语或暗改概要设计边界。

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| 8 个业务主要组成部分 | 为每个组成部分定义 module boundary、application service、domain owner、repository / projection / port / job 归属和跨部分协作契约。 |
| 43 个关键对象 | 为 identity、registry、descriptor、governance seam、method relation、formal exposure、trace / impact、derived material 和 reference support 对象补正式字段、函数、状态、不变量和持久化契约。 |
| Command / Query / Inbound Event Consumer / Outbound Event / Operations Job / External Port Skeleton | 补 request / response、envelope、result、error surface、idempotency、actor / trace context、visibility 和 external port contract。 |
| 通用写 / 读 / consumer / job / event candidate 路径与重点独立处理流 | 补 application service 编排、repository / port trait、transaction boundary、stored result、trace link、event candidate 和 failure surface。 |
| 多状态族、允许 / 禁止迁移和状态传播 | 补 enum、guard、状态矩阵、expected version、并发冲突、重复 replay 和序列化 / migration 规则。 |
| Command / Query / Consumer / Job / event collaboration 异常边界 | 补 error taxonomy、response mapping、retry / delayed / quarantine / dead-letter、recovery cut 和 negative tests。 |
| 配置影响轮廓与禁止配置化边界 | 补 runtime builder、config owner、ConfigValidator、AdapterConfig、JobConfig、Query / ReadConfig、Consumer / EventConfig、Publisher / HandoffConfig 和 config failure surface。 |

如果详细设计发现上述主语需要变更,说明概要设计尚未真正收稳,应先回到概要设计对应 Step 修正,不得在 `03-详细设计.md` 中暗改。代码主体变更回退 Step 4,主要组成部分变更回退 Step 5,对象变更回退 Step 6,接口变更回退 Step 7,处理流变更回退 Step 8,状态变更回退 Step 9,异常边界变更回退 Step 10,配置影响或禁止配置化边界变更回退 Step 11。若涉及 truth owner、数据归属、依赖裁剪或非目标变更,需回到 Step 1 ~ Step 3,必要时回到 `00` 或 `01`。

不进入本承接清单的内容包括:具体产品选型、完整 DTO / trait / DDL / topic / payload、配置 key / 默认值 / env var、完整测试用例、验收证据、实施 commit boundary、run_id、开发排期,以及 runtime execution、tools execution、governance approval、method body、SDK client、marketplace listing / transaction、secret 正文、cost ledger 和 observability store 正文。
```

---

## 11. 自检与停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只承接 Step 4 ~ Step 11 已收稳结论 | pass | 承接清单均回指代码主体、组成部分、对象、接口、flow、状态、异常和配置 Step。 |
| 是否新增对象、接口、流程或状态 | pass | 未新增正式业务对象或接口;只把已收稳主语列为 `03` 输入。 |
| 是否提前写详细 schema / trait / DDL / config key | pass | 只写继续展开方向,未写字段全集、协议 schema、配置 key、默认值或实现代码。 |
| 是否保留 capability-hub 边界 | pass | 未合并 runtime execution、tools execution、governance approval、method body、SDK client、marketplace listing、secret / KMS、cost / billing、provider runtime 或 observability store。 |
| 是否隔离旧材料污染 | pass | 旧 `ProviderContract`、`CapabilityDecision`、`CostRecord`、`QueryCapabilities`、KMS / Vault、policy refresh、execution gateway 和 outbox relay 均保留为 historical material。 |
| 是否修改正式 `02-概要设计.md` | no | 本 Step 只创建中间产物,正式文档仍等 Step 14 装配。 |
| 是否伪造测试、证据、run_id、签署或 commit | no | 未写真实测试结果、evidence alias、验收签署、run_id 或 commit。 |

---

## 12. 进入下一步条件

- 已明确 `03-详细设计.md` 应承接的稳定输入。
- 已明确详细设计继续展开对象、接口、处理流、状态、异常、持久化、配置和测试矩阵输入。
- 已明确发现主语变更时的概要设计回退位置。
- 已明确不进入承接清单的风险 / 待确认 / 后续文档内容。
- 已隔离旧正式文档和 README 的污染项。
- 用户审查确认后才允许进入 Step 13 `设计风险与待确认事项`。
