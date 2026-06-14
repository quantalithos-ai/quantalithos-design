# Step 8. 定义 API / Command / Query / Event / Job 协议契约

> 对应正式文档章节: `03-详细设计.md` 第 7 章 API / Command / Query / Event / Job 协议契约
> 当前状态: Step 8.7 cross protocol audit 已完成并已审核通过;已进入 Step 9 function flows
> 本文件性质: 详细设计 Step 8 中间产物,不是正式 `03-详细设计.md`
> 执行纪律: 本 Step 只在当前批次写当前批次内容;不得提前生成后续 Step 文件;不得直接修改正式 `03-详细设计.md`

---

## 1. Step 状态 + Step 内计划

### 1.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 8 protocol contracts |
| 当前批次 | 8.7 cross protocol audit |
| 当前结论 | 已完成并已审核通过 Step 8 全协议族 cross audit:secondary public types、DTO -> Step 6/7/9 闭环、body-free 边界、stored replay、phase boundary 和 Step 9 entry condition |
| 本批是否写业务 DTO schema | 否。只做跨协议审计和 Step 9 入口门禁 |
| 下一批 | Step 9 function flows |
| 停审要求 | 已满足;用户已审核通过 Step 8,已进入 Step 9 |

### 1.2 Step 8 总体目标

Step 8 的目标是把 Step 6 对象契约和 Step 7 port / adapter 契约转换为可实现的 public protocol surface,覆盖 API / Command / Query / Inbound Event / Outbound Event / Operations Job / callback / handoff 相关协议。每个协议必须能回答:

- 请求 DTO 从哪里取得字段,字段是否能回指 Step 6 对象字段、Step 7 port helper、系统生成规则或正式派生规则。
- response / result / receipt / report / view / page / marker DTO 是否有完整 schema,是否避免 bare type name。
- DTO / Event / Job 是否能构造或影响目标 domain object,或明确只读取 view / marker / report。
- empty / not visible / degraded / rejected / duplicate / stale / missing / rebuilding / disabled / unsupported / retryable / permanent failed 等 public surface 是否有统一口径。
- HLD 的接口名、DDD Request 名和 Rust DTO 名是否一一映射,避免 query / command / event 名称漂移。
- public DTO 是否只依赖 contracts shared 类型或明确 mapping,不得直接依赖 domain-only 类型。

### 1.3 Step 8 分批计划

| 批次 | 主题 | 输出 | 停审重点 | 状态 |
|---|---|---|---|---|
| 8.0 | framework / batch plan / redlines | Step 8 写作框架、协议族计划、清单和红线 | 是否按最新 SOP 和 governance 粒度执行 | 已审核通过 |
| 8.1 | shared protocol helper and protocol inventory | 公共 envelope / metadata / page / result / issue / marker / digest shell,协议总表 | 二级公开类型归属和命名收敛 | 已审核通过 |
| 8.2-a | member / lifecycle command DTOs | `EstablishGlobalMember`, `UpdateGlobalLifecycleState` request/result | actor、idempotency、basis、accepted/rejected result 闭环 | 已审核通过 |
| 8.2-b | role / career / memory command DTOs | `MaintainRoleCapabilitySummary`, `AppendCareerRecord`, `MaintainMemoryReference` request/result | source/evidence/work/memory body-free 字段来源 | 已审核通过 |
| 8.2-c | handoff command DTO | `PrepareTraceHandoff` request/result | safe material、target/scope、receipt/handoff marker | 已审核通过 |
| 8.3-a | core truth query DTOs | anchor/lifecycle/role/career/memory query request/view/page | visibility、empty、stale、not visible | 已审核通过 |
| 8.3-b | trace / audit / summary query DTOs | member summary、trace、audit request/view/page | redaction、page DTO、read subject/scope | 已审核通过 |
| 8.3-c | maintenance / outbox / handoff query DTOs | projection/reference/report/outbox/handoff query surface | degraded/missing/rebuilding/stale | 已审核通过 |
| 8.4 | inbound event / callback protocols | inbound envelope、5 consumer payload、receipt/outcome、callback surface | dedupe、source cursor/version、quarantine/degraded | 已审核通过 |
| 8.5 | outbound event protocols | outbound envelope、10 canonical payload、topic/schema marker | accepted-only、body-free、topic visibility | 已审核通过 |
| 8.6 | operations job protocols | 6 job input/output/report/stored replay surface | trigger、idempotency、partial/failed/retryable report | 已审核通过 |
| 8.7 | cross protocol audit | DTO construction closure、public surface audit、Step 9 entry condition | 无二级类型缺 schema、无 field source 缺口 | 已审核通过 |

---

## 2. 本步输入

| 输入 | 当前用途 |
|---|---|
| `03_ddd_step_06_object_contracts.md` | 对象字段、状态、domain method、policy、不变量和构造闭环来源 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | port/helper/facade/resolver/stored-result/entry/adapter outcome 来源 |
| `02_hld_step_07_api_interface_skeleton.md` | Command / Query / Consumer / Event / Job 清单与命名审计来源 |
| `02_hld_step_08_processing_flows.md` | 后续 Step 9 flow 展开顺序和接口独立性来源 |
| `standards/document/详细设计讨论流程_SOP.md` | Step 8 必须按协议族分批、停审、做 DTO 构造闭环 |
| `standards/document/详细设计书写规范.md` | 正式协议章节结构、Rust DTO、page DTO、secondary public type schema 规则 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 字段来源、DTO 构造、状态、phase boundary 和 fake parity 复核标准 |
| governance Step 8 中间产物 | 仅作为粒度和组织方式参考,不复制业务内容 |

---

## 3. SOP 问题回答

| SOP 问题 | 本轮回答 |
|---|---|
| 本轮需要定义哪些协议 | 6 个 Command、14 个 Query、5 个 Inbound Event Consumer、10 个 Outbound Event、6 个 Operations Job,外加 shared API envelope / result / page / receipt / report / issue / marker helper |
| 按什么分批定义 | 先 shared protocol helper,再 command、query、inbound event、outbound event、job,最后 cross protocol audit |
| handler / caller / transport 如何定位 | Step 8 只定义 public protocol DTO 和 entry surface;具体 handler dispatch flow 留 Step 9;transport adapter 绑定留 Step 14 |
| request 字段如何确定 | 只能来自 Step 6 对象字段、Step 7 helper / port 读取面、系统生成规则、HLD 已闭口接口骨架或正式派生规则 |
| response 字段如何确定 | command result / query view / page / receipt / report 必须有 schema 和字段来源;不得只写返回 domain object |
| DTO 如何构造 domain object | 每个 Command / Event / Job 批次必须写 DTO -> object / policy input / repository lookup closure |
| Query response 如何定义 | 每个 Query 同时写 request DTO、response view/page/marker DTO 和 empty/not visible/degraded/stale/missing surface |
| 二级公开类型如何处理 | result、receipt、report、payload、page、marker、issue、disposition、schema version、topic key 等必须在所属批次定义归属和字段 |
| page helper 如何映射 | Step 7 application-local `Page<T>` 不能直接暴露;Step 8 定义 public page DTO 和 mapping |
| HLD / DDD / Rust 命名如何收敛 | 8.1 建立协议总表,每个接口固定 HLD name、Request DTO name、Result/View name、handler target name |
| trusted source actor exception 如何处理 | 只在具体 command/consumer DTO 批次说明 actor/source marker,不得把外部 source event 默认当 actor 授权 |
| error / idempotency / audit 如何闭合 | shared helper 先定义 validation issue、request digest、idempotency key、stored result/ref、audit/trace/outbox marker shell;详细映射留各协议批次和 Step 12/13 |
| 协议族完成后如何停审 | 每个批次写 stop-review record:字段来源、二级类型、DTO 构造、port 回指、flow 入口、状态/错误后续承接 |

---

## 4. 当前材料 / 旧文档问题诊断

### 4.1 旧 `03-详细设计.md` 不能直接继承的问题

| 问题 | 风险 | Step 8 处理 |
|---|---|---|
| 旧文档接口和对象命名早于新版 `02` / Step 6 / Step 7 | 继承后会造成 command/query/event 名称漂移 | 以新版 HLD Step 7 审计表和 DDD Step 6/7 为准 |
| 旧文档可能把 DTO、domain object、repository helper 混写 | public DTO 依赖 domain-only 类型或 application-local helper | 每个 protocol DTO 明确归属 contracts,application helper 只能映射 |
| 旧文档可能一口气列全局 schema | 字段来源和 DTO 构造无法逐个验证 | 按 8.1~8.7 小批次停审 |
| 旧文档可能缺 query not visible / degraded / stale surface | 实现时 handler 需要自行发明返回形态 | query 批次必须统一定义这些 surface |
| 旧文档可能缺 consumer receipt / job report / outbound payload 二级类型 | duplicate replay 和 worker runner 无法落码 | inbound/job/outbound 批次必须定义 secondary public type |

### 4.2 当前 Step 8 不应提前做的事项

| 不做事项 | 原因 | 归属 |
|---|---|---|
| 不写 Step 9 flow 伪代码 | Step 8 只定义协议 schema 和构造闭环 | Step 9 |
| 不写状态矩阵 | 状态集合和迁移副作用需承接 flow | Step 10 |
| 不写 repository DDL / transaction order | 需要协议、flow、state 完成后才能定 | Step 11 |
| 不写 error recovery 全矩阵 | Step 8 只定义 public surface shell | Step 12 |
| 不写 idempotency replay 细则全矩阵 | Step 8 定义 result / receipt / report shape,语义矩阵留 Step 13 |
| 不写 runtime config / transport binding | 协议不等于 adapter 配置 | Step 14 |
| 不修改正式 `03-详细设计.md` | 正式文档只能 Step 19 装配 | Step 19 |

---

## 5. 改动前后对比

| 维度 | 改动前 | Step 8.0 后 |
|---|---|---|
| Step 8 执行方式 | 只有总流程中的 pending 行 | 明确 `8.0~8.7` 小批次和停审顺序 |
| 协议粒度 | 容易退回全局 DTO 总表 | 固定按 shared / command / query / inbound / outbound / job / audit 分批 |
| 详细 schema | 尚未开始 | 明确从 8.1 开始逐批写,本批不提前生成 |
| 协议数量 | 分散在 HLD Step 7 | 汇总为 6 Command、14 Query、5 Consumer、10 Outbound Event、6 Job |
| 可落码红线 | 依赖 Step 7 结尾说明 | 本批写入 Step 8 专属红线和暂停条件 |
| 下一步 | 等待 Step 7 审核 | 等待 8.0 审核;通过后进入 8.1 |

---

## 6. 设计取舍

### 6.1 为什么先写框架,再填协议细节

Step 8 的协议面同时覆盖 command、query、consumer、outbound event 和 job。如果直接从第一个 command 写 DTO,后续很容易出现 result enum、page DTO、receipt、issue marker、request metadata、stored replay surface 命名不一致的问题。因此本轮先写 8.0 框架和 8.1 shared helper,再进入具体协议。

这个方式不是把 Step 2~6 的内容推迟,而是先建立“所有协议必须使用同一套公共壳和命名规则”的执行框架。具体 DTO 字段仍按后续小批逐条补齐。

### 6.2 为什么不一次性生成所有 DTO

identity 的协议字段大量依赖 Step 6/7 中的 body-free ref、safe marker、stable view lookup、stored result、consumer receipt、job report、outbox payload marker 和 handoff receipt。一次性生成全局 DTO 很难逐字段证明来源,也容易把外部正文、domain-only 类型或 application-local helper 泄漏进 public contracts。

因此 Step 8 必须采用“每个协议族完成即停审”的模式。每批只允许定义已经有来源的字段。发现字段来源、port、状态或 phase boundary 缺口时,必须暂停并回 Step 6/7,不得在 Step 8 私自补口。

### 6.3 本 Step 对 governance 参考的使用边界

governance Step 8 只作为粒度参考:

- 采用 shared helper 先行、协议族分批、最后 cross audit 的组织方式。
- 采用 protocol inventory、secondary public type schema、DTO construction closure、stop-review record 的审查方式。
- 不复制 governance 的对象、字段、状态、event 或 job 业务内容。

---

## 7. 结构化中间产物

### 7.1 协议族总览

| 协议族 | 数量 | 来源 | Step 8 批次 |
|---|---:|---|---|
| Command | 6 | HLD Step 7 final interface inventory | 8.2-a / 8.2-b / 8.2-c |
| Query | 14 | HLD Step 7 final interface inventory | 8.3-a / 8.3-b / 8.3-c |
| Inbound Event Consumer / Callback | 5 | HLD Step 7 final interface inventory | 8.4 |
| Outbound Event | 10 | HLD Step 7 outbound event naming audit | 8.5 |
| Operations Job | 6 | HLD Step 7 final interface inventory | 8.6 |
| Shared protocol helper | 待 8.1 定义 | Step 7 startup surface | 8.1 |

### 7.2 Command inventory

| Command | 所属业务域 | 主要对象承接 | Step 8 批次 |
|---|---|---|---|
| `EstablishGlobalMember` | 身份锚定与成员真相 | `GlobalMember`, `IdentityAnchorState`, `IdentityAnchorPolicy` | 8.2-a |
| `UpdateGlobalLifecycleState` | 全局生命周期 | `GlobalLifecycleState`, `LifecycleTransitionPolicy`, `HighRiskLifecycleGuard` | 8.2-a |
| `MaintainRoleCapabilitySummary` | 角色能力摘要 | `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, `RoleCapabilitySourcePolicy` | 8.2-b |
| `AppendCareerRecord` | 身份生涯记录 | `CareerRecord`, `CareerAppendPolicy` | 8.2-b |
| `MaintainMemoryReference` | 记忆引用关系 | `MemoryReference`, `MemoryReferenceState`, `MemoryReferencePolicy` | 8.2-b |
| `PrepareTraceHandoff` | 身份事实传播与外部交接 | `TraceHandoffIntent`, `HandoffState`, `HandoffPolicy` | 8.2-c |

### 7.3 Query inventory

| Query | 所属业务域 | 主要对象 / view 承接 | Step 8 批次 |
|---|---|---|---|
| `GetGlobalMemberAnchor` | 身份锚定与成员真相 | `GlobalMember`, `IdentityAnchorState` | 8.3-a |
| `GetGlobalLifecycleSummary` | 全局生命周期 | `GlobalLifecycleState`, `MemberSummaryView` | 8.3-a |
| `GetRoleCapabilitySummary` | 角色能力摘要 | `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot` | 8.3-a |
| `ListCareerRecords` | 身份生涯记录 | `CareerRecord`, `MemberSummaryView` | 8.3-a |
| `ListMemoryReferences` | 记忆引用关系 | `MemoryReference`, `MemoryReferenceState`, `MemberSummaryView` | 8.3-a |
| `ReadMemberSummary` | 身份事实消费与追溯 | `MemberSummaryView`, `VisibilityPolicy`, `ProjectionState` | 8.3-b |
| `ReadIdentityTrace` | 身份事实消费与追溯 | `IdentityTraceRecord`, `VisibilityPolicy` | 8.3-b |
| `ReadAuditTrail` | 身份事实消费与追溯 | `AuditTrail`, `IdentityTraceRecord`, `VisibilityPolicy` | 8.3-b |
| `GetProjectionState` | 派生维护与对账 | `ProjectionState` | 8.3-c |
| `GetReferenceResolutionState` | 派生维护与对账 | `ReferenceResolutionState` | 8.3-c |
| `ReadReconciliationReport` | 派生维护与对账 | `ReconciliationReport`, `ReconciliationPolicy` | 8.3-c |
| `ListPendingIdentityOutbox` | 身份事实传播与外部交接 | `IdentityOutboxRecord`, `OutboxState` | 8.3-c |
| `GetIdentityOutboxState` | 身份事实传播与外部交接 | `IdentityOutboxRecord`, `OutboxState` | 8.3-c |
| `GetTraceHandoffState` | 身份事实传播与外部交接 | `TraceHandoffIntent`, `HandoffState` | 8.3-c |

### 7.4 Inbound Event Consumer / Callback inventory

| Consumer / Callback | 来源 | 主要对象承接 | Step 8 批次 |
|---|---|---|---|
| `HandleRoleCapabilitySourceChanged` | `L3-method-library` role / capability source change | `RoleCapabilitySourceSnapshot`, `ReferenceResolutionState` | 8.4 |
| `HandleWorkParticipationAccepted` | `L1-work` project participation accepted fact | `CareerRecord`, `CareerAppendPolicy` | 8.4 |
| `HandleMemoryReferenceSourceStateChanged` | memory / archive carrier source state event | `MemoryReferenceState`, `ReferenceResolutionState` | 8.4 |
| `HandleArchiveHandoffResult` | archive / memory handoff callback or event | `MemoryReference`, `MemoryReferenceState` | 8.4 |
| `HandleTraceHandoffResult` | trace handoff receipt / failure callback | `TraceHandoffIntent`, `HandoffState`, `HandoffPolicy` | 8.4 |

### 7.5 Outbound Event inventory

| Outbound Event | 产生来源 | 说明 | Step 8 批次 |
|---|---|---|---|
| `GlobalMemberEstablished` | `EstablishGlobalMember` accepted outbox material | 成员建档 accepted fact event | 8.5 |
| `IdentityAnchorChanged` | anchor accepted outbox material | anchor change event material | 8.5 |
| `GlobalLifecycleChanged` | `UpdateGlobalLifecycleState` accepted outbox material | lifecycle state change event | 8.5 |
| `GlobalMemberAvailabilityChanged` | lifecycle availability accepted outbox material | availability change event | 8.5 |
| `RoleCapabilitySummaryChanged` | role/capability summary accepted outbox material | role / capability summary accepted change | 8.5 |
| `RoleCapabilitySourceStateChanged` | role/capability source accepted or stale material | source state accepted / stale marker change | 8.5 |
| `CareerRecordAppended` | career append accepted outbox material | career append accepted event | 8.5 |
| `CareerCorrectionAppended` | career correction accepted outbox material | correction append accepted event | 8.5 |
| `MemoryReferenceChanged` | memory reference accepted state / relation material | memory reference accepted change | 8.5 |
| `MemoryArchiveHandoffStateChanged` | archive / migration handoff state material | archive / migration handoff state event | 8.5 |

### 7.6 Operations Job inventory

| Job | 所属业务域 | 主要对象承接 | Step 8 批次 |
|---|---|---|---|
| `RebuildIdentityProjection` | 派生维护与对账 | `ProjectionState`, `ReconciliationReport` | 8.6 |
| `RefreshExternalReferenceState` | 派生维护与对账 | `ReferenceResolutionState`, `ReconciliationReport` | 8.6 |
| `RunIdentityReconciliation` | 派生维护与对账 | `ReconciliationPolicy`, `ReconciliationReport` | 8.6 |
| `PublishIdentityOutbox` | 身份事实传播与外部交接 | `IdentityOutboxRecord`, `OutboxState`, `OutboundEventPolicy` | 8.6 |
| `DeliverTraceHandoff` | 身份事实传播与外部交接 | `TraceHandoffIntent`, `HandoffState`, `HandoffPolicy` | 8.6 |
| `RetryIdentityPropagationFailures` | 身份事实传播与外部交接 | `IdentityOutboxRecord`, `TraceHandoffIntent`, `OutboxState`, `HandoffState` | 8.6 |

### 7.7 Step 8 写作红线

| 编号 | 红线 | 处理 |
|---|---|---|
| DDD-S8-RULE-001 | 不得一次性生成全量 DTO schema 清单 | 按 8.1~8.7 分批停审 |
| DDD-S8-RULE-002 | 不得新增 Step 6/7 没有来源的 DTO 字段 | 暂停并回 Step 6/7 闭口 |
| DDD-S8-RULE-003 | public DTO 不得直接依赖 domain-only type | 上提到 contracts shared 或定义 mapping |
| DDD-S8-RULE-004 | application-local helper 不得直接暴露成 public DTO | 在 Step 8 写 public DTO mapping |
| DDD-S8-RULE-005 | Query 不得只写返回类型名 | 必须写 request DTO + view/page/marker DTO |
| DDD-S8-RULE-006 | Command result / Consumer receipt / Job report / Outbound payload 的二级类型不得悬空 | 所属批次写 schema、variant、缺失处理和归属 |
| DDD-S8-RULE-007 | outbound event 只能来自 accepted material | pending/rejected/report-only/stale 不能冒充 accepted event |
| DDD-S8-RULE-008 | inbound consumer 不得拥有外部 truth | 只消费 body-free fact / marker / safe summary |
| DDD-S8-RULE-009 | job report 不得保存 raw log / external body / secret | 只保存 safe issue refs、counts、marker 和 report ref |
| DDD-S8-RULE-010 | 发现需要新 port / lookup / state / object 时不得在 Step 8 私补 | 记录 blocker,回 Step 6/7 |

### 7.8 8.0 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否承接最新 SOP Step 8 | 通过 | 已按协议族分批、停审和 DTO 构造闭环组织 |
| 是否参考 governance 粒度 | 通过 | 采用 shared helper -> protocol family -> cross audit 的粒度 |
| 是否复制 governance 业务内容 | 未复制 | 只参考组织方式,业务清单来自 identity HLD / DDD |
| 是否提前写详细 DTO schema | 未提前 | 本批只写框架、清单和红线 |
| 是否创建未来 Step 文件 | 未创建 | 只创建当前 Step 8 文件 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档仍等 Step 19 装配 |
| 下一步 | 8.1 | 用户审核通过后进入 shared protocol helper and protocol inventory |

### 7.9 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| Step 8.0 范围 | 只写批次计划、协议清单、红线和停审条件 | 直接把 6 个 command 的 DTO 字段全部写完 |
| shared helper | 先定义 request metadata、result shell、page DTO、issue marker 的统一口径 | 每个 command / query 自己发明一套 metadata / page / issue 字段 |
| DTO 字段来源 | 字段能回指 Step 6 对象字段、Step 7 port/helper 或系统生成规则 | 因实现方便新增 `scope_ref` / `actor_snapshot` 等无来源字段 |
| Query response | 写 request DTO、view DTO、page DTO、not visible/degraded marker | 只写“返回 MemberSummaryView” |
| Inbound event | envelope 包含 source event id、dedup key、source cursor/version、安全 payload marker | 让外部 event 直接带完整 method/work/memory body |
| Outbound event | payload 只带 accepted fact refs、safe summary、trace ref、payload marker | payload 塞入 secret、raw body、adapter error string |
| Job report | report 区分 completed/partial/failed/retryable,并只保存 safe issue refs | job runner 只返回 bool 或 raw log |
| 缺口处理 | 发现字段缺 port/source 后暂停并回 Step 6/7 | 在 Step 8 写“由实现自行解析 ref 字符串” |

---

## 8. 8.1 shared protocol helper and protocol inventory

### 8.1.1 本批目标与边界

8.1 只定义跨协议复用的 public protocol helper、二级公开类型归属、协议总表和命名收敛。它承接 Step 6 的 application helper / entry objects 和 Step 7 的 application-local helper / port surface,但不展开具体业务 command、query、consumer、outbound event 或 job 的字段。

| 项 | 本批处理 |
|---|---|
| 公共 envelope | 定义 command/query/inbound/outbound/job 的统一壳,固定 actor/metadata/body 分层 |
| page mapping | 定义 public page request / page info,映射 Step 7 `IdentityRepositoryPage` / `Page<T>` |
| result surface | 定义 command outcome、query surface、consumer receipt、job report replay、callback receipt 的公共壳 |
| issue / degraded marker | 定义 body-free issue refs、validation issue、degraded marker 的 public 归属 |
| protocol inventory | 建立所有 41 个协议面的名称、类别、调用方/发布方、处理方/订阅方、传输方式和 flow 需要性 |
| 命名收敛 | 固定 HLD name、Request DTO、Result/View/Receipt/Report 名和 Step 9 flow 名的映射规则 |

本批不做:

- 不写 `EstablishGlobalMemberRequest` 等具体业务 request 字段。
- 不写 `MemberSummaryView` 等具体 query view 字段。
- 不写 10 个 outbound event payload 的字段级 schema。
- 不写 6 个 job input/report 的具体业务字段。
- 不定义 HTTP status、broker topic 字符串、配置项或函数级 transaction order。

### 8.1.2 Shared protocol naming types

以下类型归属 `identity-contracts::protocol` 或等价 public contracts module。它们只标识 public protocol surface,不得替代 domain truth ref、application transaction ref、repository cursor 或 stored result ref。

```rust
/// Names a public Identity command protocol.
pub struct IdentityCommandName(pub String);

/// Names a public Identity query protocol.
pub struct IdentityQueryName(pub String);

/// Names a public Identity inbound event consumer or callback protocol.
pub struct IdentityInboundConsumerName(pub String);

/// Names a public Identity outbound event protocol.
pub struct IdentityOutboundEventName(pub String);

/// Names a public Identity operations job protocol.
pub struct IdentityJobName(pub String);

/// Identifies a public protocol surface without binding it to HTTP, RPC, queue, or cron.
pub struct IdentityProtocolSurfaceRef(pub String);

/// Marker for the versioned canonical protocol schema used to compute request digests.
pub struct IdentityProtocolSchemaVersionRef(pub String);

/// Marker for the digest algorithm binding used by public canonicalization.
pub struct IdentityDigestAlgorithmMarkerRef(pub String);
```

| 类型 | 字段来源 | 约束 |
|---|---|---|
| `IdentityCommandName` | 8.1.10 Command protocol inventory | 必须等于 6 个 command 名称之一 |
| `IdentityQueryName` | 8.1.11 Query protocol inventory | 必须等于 14 个 query 名称之一 |
| `IdentityInboundConsumerName` | 8.1.12 Inbound protocol inventory | 必须等于 5 个 consumer/callback 名称之一 |
| `IdentityOutboundEventName` | 8.1.13 Outbound protocol inventory | 必须等于 10 个 canonical event 名称之一 |
| `IdentityJobName` | 8.1.14 Job protocol inventory | 必须等于 6 个 operations job 名称之一 |
| `IdentityProtocolSurfaceRef` | route/binding/job catalog | 只做 public surface identity;不保存 raw URL、topic、cron、handler 名或 secret |
| `IdentityProtocolSchemaVersionRef` | protocol schema registry / release marker | 用于 digest / compatibility;不得与 source version、optimistic version 或 truth cursor 混用 |
| `IdentityDigestAlgorithmMarkerRef` | digest canonicalization binding | 只表达算法绑定 marker;不得保存 raw canonical material、hash input 或 adapter 私有算法字符串 |

### 8.1.3 Public metadata and digest shell

Step 6 已定义 `IdentityOperationContext`、`IdentityRequestDigest`、`IdentityIdempotencyKey`、`IdentityOperationChannel` 等 application helper。Step 8 public DTO 不能直接暴露 application-local context object,只能暴露 public metadata shell,再由 API / worker / job entry 映射到 Step 7 `IdentityOperationContextFactoryPort`。

```rust
/// Public metadata carried by command requests.
pub struct IdentityCommandMetadata {
    pub idempotency_key: IdentityIdempotencyKey,
    pub request_marker_ref: IdentityApiRequestMarkerRef,
    pub schema_version_ref: IdentityProtocolSchemaVersionRef,
    pub trace_context_ref: Option<IdentityTraceContextRef>,
}

/// Public metadata carried by query requests.
pub struct IdentityQueryMetadata {
    pub request_marker_ref: IdentityApiRequestMarkerRef,
    pub schema_version_ref: IdentityProtocolSchemaVersionRef,
    pub visibility_context_ref: VisibilityContextRef,
    pub trace_context_ref: Option<IdentityTraceContextRef>,
}

/// Public digest marker produced by entry canonicalization.
pub struct IdentityRequestDigestMarker {
    pub canonical_marker_ref: IdentityCanonicalRequestMarkerRef,
    pub digest_value: IdentityRequestDigestValue,
    pub schema_version_ref: IdentityProtocolSchemaVersionRef,
    pub algorithm_marker_ref: IdentityDigestAlgorithmMarkerRef,
}
```

| 字段 | 来源 | 映射目标 | 约束 |
|---|---|---|---|
| `idempotency_key` | command metadata / consumer dedupe / job metadata | `IdentityOperationContext` / `IdentityIdempotencyRecord` | mutation/consumer/job 必填;不得用 cursor、timestamp 或 source event ref 代替 |
| `request_marker_ref` | entry canonicalizer | `IdentityApiEntryContext.request_marker_ref` | body-free;不保存 request body/header secret |
| `schema_version_ref` | protocol schema registry | request digest canonicalization | 不等于 source version / repository version |
| `visibility_context_ref` | query actor/read context extractor | visibility resolver | query 必填;command 不承载 query visibility context |
| `trace_context_ref` | entry trace metadata | observability / operation context | runtime trace marker,不等于 `IdentityTraceRecordRef` |
| `digest_value` | canonicalizer | `IdentityRequestDigest` | 不从 raw JSON 字符串临时计算;canonical material 规则留 Step 13 |
| `algorithm_marker_ref` | digest canonicalization binding | `IdentityRequestDigest.algorithm_ref` | public shell 固定为 `IdentityDigestAlgorithmMarkerRef`;不得另建 `IdentityDigestAlgorithmRef` 同义类型 |

### 8.1.4 Command request / response envelope

```rust
/// Public command request envelope.
pub struct IdentityCommandRequest<T> {
    pub actor_ref: ActorRef,
    pub command_name: IdentityCommandName,
    pub metadata: IdentityCommandMetadata,
    pub digest: IdentityRequestDigestMarker,
    pub body: T,
}

/// Public command response envelope.
pub struct IdentityCommandResponse<T> {
    pub command_name: IdentityCommandName,
    pub result_ref: IdentityStoredResultRef,
    pub result: T,
    pub effect: IdentityCommandEffectPublicSummary,
}

/// Public command outcome returned by handlers and duplicate replay.
pub enum IdentityCommandOutcome<T> {
    Accepted(IdentityCommandResponse<T>),
    Rejected(IdentityProtocolRejection),
}
```

```rust
/// Public accepted side-effect summary for command results.
pub struct IdentityCommandEffectPublicSummary {
    pub accepted_cursor_ref: IdentityTruthCursor,
    pub trace_refs: Vec<IdentityTraceRecordRef>,
    pub audit_subject_refs: Vec<IdentityAuditSubjectRef>,
    pub outbox_refs: Vec<IdentityOutboxRecordRef>,
    pub stale_projection_refs: Vec<IdentityProjectionRef>,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `actor_ref` | API actor extractor | handler 不从 body 推导 actor;trusted source 例外只在具体 consumer/command 批次说明 |
| `command_name` | route catalog | 必须与 `body` DTO 类型匹配 |
| `metadata` / `digest` | entry canonicalizer | API handler 映射到 operation context;service 不读取 raw request |
| `result_ref` | Step 7 stored result repository | duplicate replay 返回 stored surface,不得重跑 mutation |
| `effect.accepted_cursor_ref` | Step 7 UoW truth cursor assigner | accepted-only;rejected/entry failure 不生成 |
| `trace_refs` / `outbox_refs` | accepted transaction append or explicit empty side-effect inventory | 只返回 refs,不返回 trace body或 event body;`outbox_refs` 仅在该 flow 有正式 canonical outbound payload 时非空 |
| `stale_projection_refs` | projection stale marker expansion | stale marker 不是 query rebuild |

### 8.1.5 Query request / response envelope

```rust
/// Public query request envelope.
pub struct IdentityQueryRequest<T> {
    pub actor_ref: ActorRef,
    pub query_name: IdentityQueryName,
    pub metadata: IdentityQueryMetadata,
    pub page: Option<IdentityPublicPageRequest>,
    pub body: T,
}

/// Public single-object query response.
pub struct IdentityQueryResponse<T> {
    pub query_name: IdentityQueryName,
    pub surface: IdentityQuerySurface,
    pub body: Option<T>,
}

/// Public paged query response.
pub struct IdentityPageResponse<T> {
    pub query_name: IdentityQueryName,
    pub surface: IdentityQuerySurface,
    pub page_info: IdentityPublicPageInfo,
    pub items: Vec<T>,
}
```

```rust
pub struct IdentityPublicPageRequest {
    pub cursor: Option<IdentityPublicPageCursor>,
    pub limit: u32,
}

pub struct IdentityPublicPageInfo {
    pub next_cursor: Option<IdentityPublicPageCursor>,
    pub has_more: bool,
    pub item_count: u32,
}

pub struct IdentityPublicPageCursor(pub String);
```

| 映射 | 规则 |
|---|---|
| public request -> Step 7 repository page | `IdentityPublicPageRequest.cursor` 映射为 `IdentityRepositoryPage.cursor`;`limit` 映射为 `IdentityRepositoryPage.limit` |
| Step 7 page -> public page | `Page<T>.items.len()` 映射 `item_count`;`Page<T>.next_cursor` 映射 `next_cursor`;`has_more = next_cursor.is_some()` |
| page cursor 语义 | public page cursor 只表达读取分页位置;不得当 truth cursor、projection cursor、job cursor、optimistic version 或 idempotency key |

```rust
/// Public visibility marker copied from a body-free visibility decision.
pub struct IdentityVisibilityMarker {
    pub visibility_result_ref: VisibilityResultRef,
    pub read_surface_kind: IdentityReadSurfaceKind,
    pub redaction_marker_ref: Option<IdentityRedactionMarkerRef>,
}

/// Public degraded marker copied from safe resolver/projection/dependency summary.
pub struct IdentityDegradedMarker {
    pub degraded_marker_ref: IdentityDegradedMarkerRef,
    pub degraded_kind: IdentityDegradedKind,
}

/// Public degraded category. Variants are safe to expose and never carry raw errors.
pub enum IdentityDegradedKind {
    DependencyUnavailable,
    SourceUnavailable,
    ProjectionStale,
    ProjectionRebuilding,
    MaterialUnsafe,
    PartialResult,
    AdapterUnavailable,
    Disabled,
}

pub struct IdentityQuerySurface {
    pub disposition: IdentityQueryDisposition,
    pub visibility: IdentityVisibilityMarker,
    pub degraded: Option<IdentityDegradedMarker>,
    pub projection_freshness_ref: Option<ProjectionFreshnessMarkerRef>,
    pub decision_ref: Option<IdentityVisibilityDecisionRef>,
}

pub enum IdentityQueryDisposition {
    Visible,
    Redacted,
    NotVisible,
    Degraded,
    StaleVisible,
    Empty,
    Missing,
    Rebuilding,
    Disabled,
}
```

| disposition | body / items 规则 | 说明 |
|---|---|---|
| `Visible` | `body = Some`,或 `items` 可非空 | 正常可见读取 |
| `Redacted` | `body = Some` 但只含允许字段,或 `items` 已裁剪 | redaction marker 必须在 visibility/degraded surface 可追溯 |
| `NotVisible` | `body = None`,items 必须为空 | 不得伪装成 not found |
| `Degraded` | 可有 body 或空 body,必须有 degraded marker | dependency/source/projection 不完整 |
| `StaleVisible` | 可有 stale body,必须有 freshness/degraded marker | stale 不触发 query rebuild |
| `Empty` | `body = None` 或 items 为空 | 表达真实空集合/无记录,不得用于隐藏 not visible |
| `Missing` | `body = None` | 目标 ref 不存在或 projection lookup missing |
| `Rebuilding` | `body = None`,items 为空 | projection/report 正在重建或不可用 |
| `Disabled` | `body = None`,items 为空 | entry/adapter/feature disabled surface,不得伪造成 success |

| marker 字段 | 来源 | 约束 |
|---|---|---|
| `visibility.visibility_result_ref` | Step 6 `IdentityVisibilityDecision.visibility_result_ref` 或等价 visibility resolver summary | 必填;不保存 policy body、credential、denied raw reason |
| `visibility.read_surface_kind` | Step 6 `IdentityVisibilityDecision.surface_kind` / `VisibilityPolicy::classify_read_surface(...)` | 只表达 read surface;不替代 `IdentityQueryDisposition`,也不是 truth state |
| `visibility.redaction_marker_ref` | Step 6 `IdentityVisibilityDecision.redaction_marker_ref` | `Redacted` 时必须存在;非 redacted 可为空;不保存被裁剪字段正文 |
| `degraded.degraded_marker_ref` | Step 6 `IdentityVisibilityDecision.degraded_marker_ref` 或 resolver/projection/dependency safe summary | `Degraded` / `StaleVisible` / `Rebuilding` / `Disabled` 等 degraded-like surface 必填;不保存 raw external error |
| `degraded.degraded_kind` | safe degraded classifier | 必须使用 `IdentityDegradedKind`;不得用自由字符串、`ApplicationError` 文本或 adapter 私有错误码 |

| public surface | marker 规则 |
|---|---|
| `Visible` / `Empty` / `Missing` | `visibility` 必填;`degraded` 为空,除非 loaded material 同时带 safe stale/degraded 条件 |
| `Redacted` | `visibility.redaction_marker_ref` 必填;`degraded` 仅在同时存在 dependency/source degraded 时填写 |
| `NotVisible` | `visibility` 必填且 body/items 为空;不得改用 protocol rejection |
| `Degraded` | `degraded` 必填;body/items 是否为空由 flow 的 safe material 规则决定 |
| `StaleVisible` | `projection_freshness_ref` 或 `degraded` 至少一个必填;query 不触发 rebuild/refresh |
| `Rebuilding` / `Disabled` | `degraded` 必填;不得伪造成 `Missing` 或 visible success |

### 8.1.6 Protocol rejection, issue and degraded shell

```rust
pub struct IdentityProtocolValidationIssueRef(pub String);

pub struct IdentityProtocolValidationIssueRefSet(pub Vec<IdentityProtocolValidationIssueRef>);

pub struct IdentityProtocolRejection {
    pub surface_ref: IdentityProtocolSurfaceRef,
    pub rejection_kind: IdentityProtocolRejectionKind,
    pub issue_refs: IdentityProtocolValidationIssueRefSet,
    pub degraded: Option<IdentityDegradedMarker>,
}

pub enum IdentityProtocolRejectionKind {
    InvalidRequest,
    ForbiddenBody,
    PolicyDenied,
    NotFound,
    Conflict,
    DuplicateConflict,
    UnsupportedVersion,
    AdapterUnavailable,
    Disabled,
}
```

| 规则 | 说明 |
|---|---|
| issue body-free | issue ref 不保存 request body、event body、adapter response、stack trace、secret、credential 或 raw diagnostic |
| rejection vs entry validation | entry validation failure 不等于 domain/application rejection;Step 12 映射 public status |
| rejection vs query not visible | query not visible 使用 `IdentityQuerySurface`,不使用 command rejection |
| rejected stored result | 可 replay 的 rejected result 只保存 public rejection surface marker;完整 duplicate matrix 留 Step 13 |
| adapter unavailable | 使用 safe issue/degraded marker;不得把 raw adapter error string 写入 DTO |
| rejection degraded marker | 仅 dependency/adapter unavailable、disabled、source unavailable 等 safe degraded rejection 填写;validation/domain conflict 等普通 rejected surface 可为空 |

### 8.1.7 Inbound event / callback envelope and receipt shell

```rust
pub struct IdentityInboundEventEnvelope<T> {
    pub consumer_name: IdentityInboundConsumerName,
    pub envelope_marker_ref: IdentityEventEnvelopeMarkerRef,
    pub consumer_binding_ref: IdentityConsumerBindingRef,
    pub source_event_ref: IdentitySourceEventRef,
    pub idempotency_key: IdentityIdempotencyKey,
    pub schema_version_ref: IdentityProtocolSchemaVersionRef,
    pub occurred_at: Option<IdentityTimestamp>,
    pub received_at: IdentityTimestamp,
    pub trace_context_ref: Option<IdentityTraceContextRef>,
    pub payload: T,
}

pub struct IdentityConsumerReceipt {
    pub receipt_ref: IdentityConsumerReceiptRef,
    pub consumer_name: IdentityInboundConsumerName,
    pub outcome: IdentityConsumerOutcome,
    pub stored_result_ref: IdentityStoredResultRef,
    pub trace_refs: Vec<IdentityTraceRecordRef>,
    pub outbox_refs: Vec<IdentityOutboxRecordRef>,
    pub issue_refs: Vec<IdentityProtocolValidationIssueRef>,
}

pub enum IdentityConsumerOutcome {
    Accepted,
    DuplicateReplayed,
    Rejected,
    Quarantined,
    DelayedRetry,
    Noop,
    UnsupportedVersion,
}
```

| 字段 / outcome | 来源 | 约束 |
|---|---|---|
| `envelope_marker_ref` | worker envelope parser | payload body-free marker;不保存 raw envelope |
| `source_event_ref` | upstream event envelope | 必填;不得由 payload hash 临时生成 |
| `idempotency_key` | dedupe key builder | consumer duplicate replay 必填 |
| `payload` | typed consumer payload | 不能重复 envelope 字段;只写具体业务 safe refs/markers |
| `receipt_ref` | `IdentityIdGeneratorPort.new_identity_consumer_receipt_ref()` | 必填;不得等于 worker entry ref、source event ref、trace ref、stored result ref 或 surface marker ref |
| `stored_result_ref` | `IdentityIdGeneratorPort.new_identity_stored_result_ref()` / typed receipt envelope save | 必须与 stored envelope 同一 result ref |
| `Accepted` | application consumer accepted path | 可写 snapshot/marker/trace/outbox;具体 flow 留 Step 9 |
| `DuplicateReplayed` | typed stored consumer/callback receipt envelope | 不重跑 consumer mutation;不从 generic stored shell 临时重建 receipt |
| `Quarantined` / `DelayedRetry` | Step 12/13 细化 | 必须带 safe issue refs |

`IdentityConsumerReceiptRef` 是 public contracts ref,用于 consumer receipt surface。它不等于 worker entry ref、source event ref、trace ref 或 stored result ref。

### 8.1.8 Outbound event envelope shell

```rust
pub struct IdentityOutboundEventEnvelope<T> {
    pub event_name: IdentityOutboundEventName,
    pub event_ref: IdentityOutboundEventRef,
    pub outbox_record_ref: IdentityOutboxRecordRef,
    pub topic_key_ref: TopicKeyRef,
    pub schema_version_ref: IdentityProtocolSchemaVersionRef,
    pub payload_marker_ref: IdentityOutboxPayloadMarkerRef,
    pub trace_ref: IdentityTraceRecordRef,
    pub published_subject_ref: IdentityOutboxSubjectRef,
    pub payload: T,
}

pub struct IdentityOutboundEventRef(pub String);
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `event_ref` | outbox payload builder / id generator | 不等于 outbox record ref |
| `outbox_record_ref` | Step 7 outbox repository | accepted-only outbox material |
| `topic_key_ref` | Step 7 topic binding port | 不保存 broker topic string |
| `payload_marker_ref` | Step 6/7 outbox payload marker | body-free snapshot marker;publisher 读取 stored snapshot |
| `trace_ref` | accepted trace append | outbound event 必须可追溯到 accepted fact |
| `published_subject_ref` | accepted subject mapper / outbox subject | 不从 payload body 拼接 |
| `payload` | typed outbound payload | 只含 refs、state、safe summary marker;不得含 external body / secret |

### 8.1.9 Operations job request / report shell

```rust
pub struct IdentityJobRequest<T> {
    pub job_name: IdentityJobName,
    pub job_run_ref: IdentityJobRunRef,
    pub run_metadata_ref: IdentityJobRunMetadataRef,
    pub scope_marker_ref: IdentityJobScopeMarkerRef,
    pub idempotency_key: IdentityIdempotencyKey,
    pub input_cursor_ref: Option<IdentityJobCursorRef>,
    pub schema_version_ref: IdentityProtocolSchemaVersionRef,
    pub system_actor_ref: ActorRef,
    pub input: T,
}

pub struct IdentityJobResponse<T> {
    pub job_name: IdentityJobName,
    pub report_ref: IdentityJobReportRef,
    pub stored_result_ref: IdentityStoredResultRef,
    pub output: T,
    pub report: IdentityJobReportSurface,
}

pub struct IdentityJobReportSurface {
    pub job_run_ref: IdentityJobRunRef,
    pub result_kind: IdentityJobResultKind,
    pub affected_member_refs: Vec<GlobalMemberRef>,
    pub affected_projection_refs: Vec<IdentityProjectionRef>,
    pub rebuilt_projection_refs: Vec<IdentityProjectionRef>,
    pub failed_projection_refs: Vec<IdentityProjectionRef>,
    pub refreshed_reference_refs: Vec<ExternalReferenceRef>,
    pub failed_reference_refs: Vec<ExternalReferenceRef>,
    pub inspected_target_refs: Vec<IdentityMaintenanceTargetRef>,
    pub report_refs: Vec<ReconciliationReportRef>,
    pub outbox_record_refs: Vec<IdentityOutboxRecordRef>,
    pub published_outbox_refs: Vec<IdentityOutboxRecordRef>,
    pub failed_outbox_refs: Vec<IdentityOutboxRecordRef>,
    pub handoff_intent_refs: Vec<TraceHandoffIntentRef>,
    pub delivered_handoff_refs: Vec<TraceHandoffIntentRef>,
    pub failed_handoff_refs: Vec<TraceHandoffIntentRef>,
    pub handoff_receipt_refs: Vec<HandoffReceiptRef>,
    pub issue_refs: Vec<MaintenanceIssueRef>,
    pub input_cursor_ref: Option<IdentityJobCursorRef>,
    pub output_cursor_ref: Option<IdentityJobCursorRef>,
    pub started_at: IdentityTimestamp,
    pub finished_at: Option<IdentityTimestamp>,
}
```

| 规则 | 说明 |
|---|---|
| job request source | 映射自 `IdentityJobEntryContext`;runner 不直接访问 repository/adapter |
| job duplicate | 通过 stored `IdentityJobReportSurface` replay;不得重跑 rebuild/publish/handoff |
| partial / failed | `Partial` / `Failed` / `RetryableFailed` 必须有 safe issue refs |
| cursor | job cursor 不得用 page cursor、timestamp、idempotency key、source version 代替 |
| item refs | job report 必须保存本轮 job 的 body-free item refs,包括 projection/reference/report/outbox/handoff/receipt refs;duplicate replay 不得再扫描 repository 反推 |
| raw log | report 不保存 raw log、external body、secret、adapter response |

### 8.1.10 Command protocol inventory and naming convergence

| HLD Command | Request DTO | Result DTO | Handler target | Step 9 flow |
|---|---|---|---|---|
| `EstablishGlobalMember` | `EstablishGlobalMemberRequest` | `GlobalMemberCommandResult` | `IdentityApplicationFacade::dispatch_command` | `EstablishGlobalMemberFlow` |
| `UpdateGlobalLifecycleState` | `UpdateGlobalLifecycleStateRequest` | `GlobalLifecycleCommandResult` | `IdentityApplicationFacade::dispatch_command` | `UpdateGlobalLifecycleStateFlow` |
| `MaintainRoleCapabilitySummary` | `MaintainRoleCapabilitySummaryRequest` | `RoleCapabilityCommandResult` | `IdentityApplicationFacade::dispatch_command` | `MaintainRoleCapabilitySummaryFlow` |
| `AppendCareerRecord` | `AppendCareerRecordRequest` | `CareerRecordCommandResult` | `IdentityApplicationFacade::dispatch_command` | `AppendCareerRecordFlow` |
| `MaintainMemoryReference` | `MaintainMemoryReferenceRequest` | `MemoryReferenceCommandResult` | `IdentityApplicationFacade::dispatch_command` | `MaintainMemoryReferenceFlow` |
| `PrepareTraceHandoff` | `PrepareTraceHandoffRequest` | `TraceHandoffCommandResult` | `IdentityApplicationFacade::dispatch_command` | `PrepareTraceHandoffFlow` |

### 8.1.11 Query protocol inventory and naming convergence

| HLD Query | Request DTO | Response DTO | Handler target | Step 9 flow |
|---|---|---|---|---|
| `GetGlobalMemberAnchor` | `GetGlobalMemberAnchorRequest` | `IdentityQueryResponse<GlobalMemberAnchorView>` | `IdentityApplicationFacade::dispatch_query` | `GetGlobalMemberAnchorFlow` |
| `GetGlobalLifecycleSummary` | `GetGlobalLifecycleSummaryRequest` | `IdentityQueryResponse<GlobalLifecycleSummaryView>` | `IdentityApplicationFacade::dispatch_query` | `GetGlobalLifecycleSummaryFlow` |
| `GetRoleCapabilitySummary` | `GetRoleCapabilitySummaryRequest` | `IdentityQueryResponse<RoleCapabilitySummaryView>` | `IdentityApplicationFacade::dispatch_query` | `GetRoleCapabilitySummaryFlow` |
| `ListCareerRecords` | `ListCareerRecordsRequest` | `IdentityPageResponse<CareerRecordView>` | `IdentityApplicationFacade::dispatch_query` | `ListCareerRecordsFlow` |
| `ListMemoryReferences` | `ListMemoryReferencesRequest` | `IdentityPageResponse<MemoryReferenceView>` | `IdentityApplicationFacade::dispatch_query` | `ListMemoryReferencesFlow` |
| `ReadMemberSummary` | `ReadMemberSummaryRequest` | `IdentityQueryResponse<MemberSummaryView>` | `IdentityApplicationFacade::dispatch_query` | `ReadMemberSummaryFlow` |
| `ReadIdentityTrace` | `ReadIdentityTraceRequest` | `IdentityPageResponse<IdentityTraceRecordView>` | `IdentityApplicationFacade::dispatch_query` | `ReadIdentityTraceFlow` |
| `ReadAuditTrail` | `ReadAuditTrailRequest` | `IdentityPageResponse<AuditTrailEntryView>` | `IdentityApplicationFacade::dispatch_query` | `ReadAuditTrailFlow` |
| `GetProjectionState` | `GetProjectionStateRequest` | `IdentityQueryResponse<ProjectionStateView>` | `IdentityApplicationFacade::dispatch_query` | `GetProjectionStateFlow` |
| `GetReferenceResolutionState` | `GetReferenceResolutionStateRequest` | `IdentityQueryResponse<ReferenceResolutionStateView>` | `IdentityApplicationFacade::dispatch_query` | `GetReferenceResolutionStateFlow` |
| `ReadReconciliationReport` | `ReadReconciliationReportRequest` | `IdentityPageResponse<ReconciliationReportView>` | `IdentityApplicationFacade::dispatch_query` | `ReadReconciliationReportFlow` |
| `ListPendingIdentityOutbox` | `ListPendingIdentityOutboxRequest` | `IdentityPageResponse<IdentityOutboxRecordView>` | `IdentityApplicationFacade::dispatch_query` | `ListPendingIdentityOutboxFlow` |
| `GetIdentityOutboxState` | `GetIdentityOutboxStateRequest` | `IdentityQueryResponse<IdentityOutboxStateView>` | `IdentityApplicationFacade::dispatch_query` | `GetIdentityOutboxStateFlow` |
| `GetTraceHandoffState` | `GetTraceHandoffStateRequest` | `IdentityQueryResponse<TraceHandoffStateView>` | `IdentityApplicationFacade::dispatch_query` | `GetTraceHandoffStateFlow` |

### 8.1.12 Inbound event / callback protocol inventory

| Consumer / Callback | Envelope DTO | Payload DTO | Receipt DTO | Handler target | Step 9 flow |
|---|---|---|---|---|---|
| `HandleRoleCapabilitySourceChanged` | `IdentityInboundEventEnvelope<RoleCapabilitySourceChangedPayload>` | `RoleCapabilitySourceChangedPayload` | `IdentityConsumerReceipt` | `IdentityApplicationFacade::dispatch_inbound_event` | `HandleRoleCapabilitySourceChangedFlow` |
| `HandleWorkParticipationAccepted` | `IdentityInboundEventEnvelope<WorkParticipationAcceptedPayload>` | `WorkParticipationAcceptedPayload` | `IdentityConsumerReceipt` | `IdentityApplicationFacade::dispatch_inbound_event` | `HandleWorkParticipationAcceptedFlow` |
| `HandleMemoryReferenceSourceStateChanged` | `IdentityInboundEventEnvelope<MemoryReferenceSourceStateChangedPayload>` | `MemoryReferenceSourceStateChangedPayload` | `IdentityConsumerReceipt` | `IdentityApplicationFacade::dispatch_inbound_event` | `HandleMemoryReferenceSourceStateChangedFlow` |
| `HandleArchiveHandoffResult` | `IdentityInboundEventEnvelope<ArchiveHandoffResultPayload>` | `ArchiveHandoffResultPayload` | `IdentityConsumerReceipt` | `IdentityApplicationFacade::dispatch_callback` | `HandleArchiveHandoffResultFlow` |
| `HandleTraceHandoffResult` | `IdentityInboundEventEnvelope<TraceHandoffResultPayload>` | `TraceHandoffResultPayload` | `IdentityConsumerReceipt` | `IdentityApplicationFacade::dispatch_callback` | `HandleTraceHandoffResultFlow` |

### 8.1.13 Outbound event protocol inventory

| Outbound Event | Envelope DTO | Payload DTO | Publisher source | Step 9 flow |
|---|---|---|---|---|
| `GlobalMemberEstablished` | `IdentityOutboundEventEnvelope<GlobalMemberEstablishedPayload>` | `GlobalMemberEstablishedPayload` | accepted outbox material | `PublishIdentityOutboxFlow` |
| `IdentityAnchorChanged` | `IdentityOutboundEventEnvelope<IdentityAnchorChangedPayload>` | `IdentityAnchorChangedPayload` | accepted outbox material | `PublishIdentityOutboxFlow` |
| `GlobalLifecycleChanged` | `IdentityOutboundEventEnvelope<GlobalLifecycleChangedPayload>` | `GlobalLifecycleChangedPayload` | accepted outbox material | `PublishIdentityOutboxFlow` |
| `GlobalMemberAvailabilityChanged` | `IdentityOutboundEventEnvelope<GlobalMemberAvailabilityChangedPayload>` | `GlobalMemberAvailabilityChangedPayload` | accepted outbox material | `PublishIdentityOutboxFlow` |
| `RoleCapabilitySummaryChanged` | `IdentityOutboundEventEnvelope<RoleCapabilitySummaryChangedPayload>` | `RoleCapabilitySummaryChangedPayload` | accepted outbox material | `PublishIdentityOutboxFlow` |
| `RoleCapabilitySourceStateChanged` | `IdentityOutboundEventEnvelope<RoleCapabilitySourceStateChangedPayload>` | `RoleCapabilitySourceStateChangedPayload` | accepted outbox material | `PublishIdentityOutboxFlow` |
| `CareerRecordAppended` | `IdentityOutboundEventEnvelope<CareerRecordAppendedPayload>` | `CareerRecordAppendedPayload` | accepted outbox material | `PublishIdentityOutboxFlow` |
| `CareerCorrectionAppended` | `IdentityOutboundEventEnvelope<CareerCorrectionAppendedPayload>` | `CareerCorrectionAppendedPayload` | accepted outbox material | `PublishIdentityOutboxFlow` |
| `MemoryReferenceChanged` | `IdentityOutboundEventEnvelope<MemoryReferenceChangedPayload>` | `MemoryReferenceChangedPayload` | accepted outbox material | `PublishIdentityOutboxFlow` |
| `MemoryArchiveHandoffStateChanged` | `IdentityOutboundEventEnvelope<MemoryArchiveHandoffStateChangedPayload>` | `MemoryArchiveHandoffStateChangedPayload` | accepted outbox material | `PublishIdentityOutboxFlow` |

### 8.1.14 Operations job protocol inventory

| Job | Request DTO | Output DTO | Report surface | Handler target | Step 9 flow |
|---|---|---|---|---|---|
| `RebuildIdentityProjection` | `IdentityJobRequest<RebuildIdentityProjectionJobInput>` | `RebuildIdentityProjectionJobOutput` | `IdentityJobReportSurface` | `IdentityApplicationFacade::dispatch_job` | `RebuildIdentityProjectionFlow` |
| `RefreshExternalReferenceState` | `IdentityJobRequest<RefreshExternalReferenceStateJobInput>` | `RefreshExternalReferenceStateJobOutput` | `IdentityJobReportSurface` | `IdentityApplicationFacade::dispatch_job` | `RefreshExternalReferenceStateFlow` |
| `RunIdentityReconciliation` | `IdentityJobRequest<RunIdentityReconciliationJobInput>` | `RunIdentityReconciliationJobOutput` | `IdentityJobReportSurface` | `IdentityApplicationFacade::dispatch_job` | `RunIdentityReconciliationFlow` |
| `PublishIdentityOutbox` | `IdentityJobRequest<PublishIdentityOutboxJobInput>` | `PublishIdentityOutboxJobOutput` | `IdentityJobReportSurface` | `IdentityApplicationFacade::dispatch_job` | `PublishIdentityOutboxFlow` |
| `DeliverTraceHandoff` | `IdentityJobRequest<DeliverTraceHandoffJobInput>` | `DeliverTraceHandoffJobOutput` | `IdentityJobReportSurface` | `IdentityApplicationFacade::dispatch_job` | `DeliverTraceHandoffFlow` |
| `RetryIdentityPropagationFailures` | `IdentityJobRequest<RetryIdentityPropagationFailuresJobInput>` | `RetryIdentityPropagationFailuresJobOutput` | `IdentityJobReportSurface` | `IdentityApplicationFacade::dispatch_job` | `RetryIdentityPropagationFailuresFlow` |

### 8.1.15 Protocol total table

| 名称 | 类别 | 调用方 / 发布方 | 处理方 / 订阅方 | 传输方式 | 是否需要处理流 |
|---|---|---|---|---|---|
| `EstablishGlobalMember` | Command | API / SDK | identity application command service | API command dispatch | 是 |
| `UpdateGlobalLifecycleState` | Command | API / SDK | identity application command service | API command dispatch | 是 |
| `MaintainRoleCapabilitySummary` | Command | API / SDK | identity application command service | API command dispatch | 是 |
| `AppendCareerRecord` | Command | API / SDK | identity application command service | API command dispatch | 是 |
| `MaintainMemoryReference` | Command | API / SDK | identity application command service | API command dispatch | 是 |
| `PrepareTraceHandoff` | Command | API / SDK | identity application command service | API command dispatch | 是 |
| `GetGlobalMemberAnchor` | Query | API / SDK | identity application query service | API query dispatch | 是 |
| `GetGlobalLifecycleSummary` | Query | API / SDK | identity application query service | API query dispatch | 是 |
| `GetRoleCapabilitySummary` | Query | API / SDK | identity application query service | API query dispatch | 是 |
| `ListCareerRecords` | Query | API / SDK | identity application query service | API query dispatch | 是 |
| `ListMemoryReferences` | Query | API / SDK | identity application query service | API query dispatch | 是 |
| `ReadMemberSummary` | Query | API / SDK | identity application query service | API query dispatch | 是 |
| `ReadIdentityTrace` | Query | API / SDK | identity application query service | API query dispatch | 是 |
| `ReadAuditTrail` | Query | API / SDK | identity application query service | API query dispatch | 是 |
| `GetProjectionState` | Query | API / SDK / operations | identity application query service | API query dispatch | 是 |
| `GetReferenceResolutionState` | Query | API / SDK / operations | identity application query service | API query dispatch | 是 |
| `ReadReconciliationReport` | Query | API / SDK / operations | identity application query service | API query dispatch | 是 |
| `ListPendingIdentityOutbox` | Query | operations API / SDK | identity application query service | API query dispatch | 是 |
| `GetIdentityOutboxState` | Query | operations API / SDK | identity application query service | API query dispatch | 是 |
| `GetTraceHandoffState` | Query | operations API / SDK | identity application query service | API query dispatch | 是 |
| `HandleRoleCapabilitySourceChanged` | Inbound Event Consumer | method-library event publisher | identity worker/application consumer service | worker event dispatch | 是 |
| `HandleWorkParticipationAccepted` | Inbound Event Consumer | work event publisher | identity worker/application consumer service | worker event dispatch | 是 |
| `HandleMemoryReferenceSourceStateChanged` | Inbound Event Consumer | memory/archive event publisher | identity worker/application consumer service | worker event dispatch | 是 |
| `HandleArchiveHandoffResult` | Callback Consumer | archive/memory handoff adapter | identity worker/application callback service | worker callback dispatch | 是 |
| `HandleTraceHandoffResult` | Callback Consumer | handoff target / adapter | identity worker/application callback service | worker callback dispatch | 是 |
| `GlobalMemberEstablished` | Outbound Event | identity outbox publisher job | adjacent subscribed modules | outbox publish | 是 |
| `IdentityAnchorChanged` | Outbound Event | identity outbox publisher job | adjacent subscribed modules | outbox publish | 是 |
| `GlobalLifecycleChanged` | Outbound Event | identity outbox publisher job | adjacent subscribed modules | outbox publish | 是 |
| `GlobalMemberAvailabilityChanged` | Outbound Event | identity outbox publisher job | adjacent subscribed modules | outbox publish | 是 |
| `RoleCapabilitySummaryChanged` | Outbound Event | identity outbox publisher job | adjacent subscribed modules | outbox publish | 是 |
| `RoleCapabilitySourceStateChanged` | Outbound Event | identity outbox publisher job | adjacent subscribed modules | outbox publish | 是 |
| `CareerRecordAppended` | Outbound Event | identity outbox publisher job | adjacent subscribed modules | outbox publish | 是 |
| `CareerCorrectionAppended` | Outbound Event | identity outbox publisher job | adjacent subscribed modules | outbox publish | 是 |
| `MemoryReferenceChanged` | Outbound Event | identity outbox publisher job | adjacent subscribed modules | outbox publish | 是 |
| `MemoryArchiveHandoffStateChanged` | Outbound Event | identity outbox publisher job | adjacent subscribed modules | outbox publish | 是 |
| `RebuildIdentityProjection` | Operations Job | scheduler / operations runner | identity jobs/application job service | job dispatch | 是 |
| `RefreshExternalReferenceState` | Operations Job | scheduler / operations runner | identity jobs/application job service | job dispatch | 是 |
| `RunIdentityReconciliation` | Operations Job | scheduler / operations runner | identity jobs/application job service | job dispatch | 是 |
| `PublishIdentityOutbox` | Operations Job | scheduler / operations runner | identity jobs/application job service | job dispatch | 是 |
| `DeliverTraceHandoff` | Operations Job | scheduler / operations runner | identity jobs/application job service | job dispatch | 是 |
| `RetryIdentityPropagationFailures` | Operations Job | scheduler / operations runner | identity jobs/application job service | job dispatch | 是 |

### 8.1.16 8.1 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 shared helper 和 inventory | 通过 | 未展开具体业务 request/result/payload/input 字段 |
| 是否承接 Step 6 application helper / entry object | 通过 | metadata、digest、visibility、job report、entry marker 均回指 Step 6.6/6.7 |
| 是否承接 Step 7 application-local helper | 通过 | page mapping、stored result、operation context factory、facade dispatch、outbox/job/report surface 均回指 Step 7 |
| 是否把 application-local helper 直接暴露 | 未发生 | public page/digest/result shell 与 Step 7 helper 明确映射 |
| 是否定义二级公开类型归属 | 通过 | result、receipt、report、payload marker、issue、schema version、page、surface 均有 public 归属 |
| 是否有新增未来源业务字段 | 未发现 | 新增的是 protocol shell,不是 domain truth 字段 |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一步 | 8.2-a | 用户审核通过后进入 member / lifecycle command DTOs |

### 8.1.17 8.1 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| metadata | `IdentityCommandMetadata` 映射 entry marker、schema version、idempotency key | 每个 command DTO 自己发明 `request_id` / `trace_id` |
| digest | `IdentityRequestDigestMarker` 只保存 canonical marker、digest value、schema version、algorithm marker | 用 raw JSON、timestamp 或 idempotency key 当 digest |
| command outcome | `Accepted(response)` / `Rejected(rejection)` | 用 bool 表示 command 成败 |
| query not visible | `IdentityQuerySurface.disposition = NotVisible` 且 body 空 | 返回 empty 伪装成无数据 |
| page cursor | `IdentityPublicPageCursor` 映射 repository page cursor | 把 page cursor 当 truth cursor 或 job cursor |
| consumer receipt | `IdentityConsumerReceipt` 区分 accepted、duplicate、quarantined、delayed、unsupported | worker ack 后不保存 replay receipt |
| outbound event | envelope 绑定 outbox record、topic key、payload marker、trace ref | publisher 运行时重新拼 event body |
| job report | report surface 保存 result kind、affected refs、issue refs、cursor | job 只返回 raw log 或 success bool |
| protocol table | 每个 HLD 名称收敛到 request/result/flow | HLD `ReadMemberSummary` 和 DDD `GetMemberSummary` 双命名并存 |

---

## 9. 8.2-a member / lifecycle command DTOs

### 9.1 本批目标与边界

本批只定义两个 command:

- `EstablishGlobalMember`
- `UpdateGlobalLifecycleState`

它们必须沿用 8.1 的 `IdentityCommandRequest<T>`、`IdentityCommandOutcome<T>`、`IdentityCommandResponse<T>`、`IdentityCommandEffectPublicSummary` 和 `IdentityProtocolRejection`。本批不定义 query DTO、outbound payload DTO、function flow、transaction order、state matrix、HTTP status 或 Step 13 duplicate replay matrix。

### 9.2 Command batch table

| Command | Request DTO | Result DTO | 目标对象 | 依赖 Step 7 port | 后续 flow |
|---|---|---|---|---|---|
| `EstablishGlobalMember` | `EstablishGlobalMemberRequest` | `GlobalMemberCommandResult` | `GlobalMember`, `IdentityAnchorState`, 初始 `GlobalLifecycleState` | `IdentityIdGeneratorPort`, `IdentityClockPort`, `GlobalMemberRepository`, `GlobalLifecycleRepository`, idempotency/result/effect/outbox/trace ports | `EstablishGlobalMemberFlow` |
| `UpdateGlobalLifecycleState` | `UpdateGlobalLifecycleStateRequest` | `GlobalLifecycleCommandResult` | `GlobalLifecycleState`, terminal anchor hold candidate | `IdentityClockPort`, `GlobalMemberRepository`, `GlobalLifecycleRepository`, `IdentityExternalSourceResolverPort.resolve_governance_basis`, idempotency/result/effect/outbox/trace ports | `UpdateGlobalLifecycleStateFlow` |

### 9.3 `EstablishGlobalMember` protocol

#### 9.3.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_command(IdentityCommandRequest<EstablishGlobalMemberRequest>) -> Result<IdentityCommandOutcome<GlobalMemberCommandResult>, ApplicationError>` |
| HTTP / RPC / Event 名称 | API command dispatch route for `EstablishGlobalMember`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / trusted administrative command caller |
| 处理方 | `identity-application` command service through `IdentityApplicationFacade::dispatch_command` |

#### 9.3.2 请求 schema

```rust
/// Request body for establishing a platform-level global member identity.
pub struct EstablishGlobalMemberRequest {
    /// Optional caller-proposed member ref. When absent, application uses IdentityIdGeneratorPort.
    pub requested_member_ref: Option<GlobalMemberRef>,

    /// Body-free source marker used to establish the member.
    pub source_ref: IdentitySourceRef,

    /// Reason marker used for initial anchor / lifecycle trace material.
    pub anchor_reason_ref: Option<IdentityAnchorReasonRef>,

    /// Reason marker for the initial lifecycle state created with the member.
    pub initial_lifecycle_reason_ref: LifecycleReasonRef,
}
```

| 输入字段 | 类型 | 目标对象字段 / policy 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `requested_member_ref` | `Option<GlobalMemberRef>` | `GlobalMember.member_ref` / `IdentityAnchorPolicy.candidate_member_ref` | caller-proposed stable ref 或缺省时由 `IdentityIdGeneratorPort.new_global_member_id()` 生成 | 缺失时生成;若提供但已有 anchor state,走 rejected / duplicate 规则 |
| `source_ref` | `IdentitySourceRef` | `GlobalMember.source_ref` / `IdentityAnchorPolicy.source_ref` | command body;body-free source marker | 必填;缺失或 owner 非法 rejected |
| `anchor_reason_ref` | `Option<IdentityAnchorReasonRef>` | trace / optional anchor reason marker | command body 或 policy/source summary | 可为空;`Established` anchor state 本身不要求 reason |
| `initial_lifecycle_reason_ref` | `LifecycleReasonRef` | `GlobalLifecycleState.reason_ref` | command body / accepted basis summary | 必填;缺失 rejected |

Envelope 字段来自 8.1:

| Envelope 字段 | 目标 | 规则 |
|---|---|---|
| `actor_ref` | `GlobalMember.created_by_ref`, `GlobalLifecycleState.changed_by_ref`, policy actor | 必填;不得由 body 代替 |
| `metadata.idempotency_key` | idempotency reserve | 必填;同 key 同 digest replay |
| `digest` | `IdentityRequestDigest` | canonical request marker;不得由 service 重算 raw body |
| `command_name` | operation name | 必须是 `EstablishGlobalMember` |

#### 9.3.3 响应 schema

```rust
/// Accepted command result for EstablishGlobalMember.
pub struct GlobalMemberCommandResult {
    /// Established member ref.
    pub member_ref: GlobalMemberRef,

    /// Final anchor state after establishment.
    pub anchor_state_kind: IdentityAnchorStateKind,

    /// Initial lifecycle state created for the member.
    pub lifecycle_state_kind: GlobalLifecycleStateKind,

    /// Body-free source marker that established the member.
    pub source_ref: IdentitySourceRef,

    /// Accepted command side-effect summary.
    pub effect: IdentityCommandEffectPublicSummary,
}
```

| 响应字段 | 类型 | 字段来源 | 约束 |
|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | request 或 id generator + saved `GlobalMember` | 不等于 account / ProjectMember / runtime ref |
| `anchor_state_kind` | `IdentityAnchorStateKind` | `IdentityAnchorState::established(...)` | accepted 建档必须为 `Established` |
| `lifecycle_state_kind` | `GlobalLifecycleStateKind` | `GlobalLifecycleState::initial_available(...)` | accepted 建档初始为 `Available` |
| `source_ref` | `IdentitySourceRef` | request | body-free;不返回 source body |
| `effect` | `IdentityCommandEffectPublicSummary` | effect summary assembler | accepted-only;duplicate replay 返回 stored surface |

#### 9.3.4 DTO -> Domain 构造闭环

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `IdentityCommandRequest<EstablishGlobalMemberRequest>` | `IdentityAnchorPolicy::for_create(...)` | 齐全: member ref、source、actor、operation channel、existing anchor state | `member_ref` 可由 id generator 补齐;existing anchor state 来自 `GlobalMemberRepository.get_anchor_state(...)`;channel 来自 operation context | `ActorRef` 不等于 `GlobalMemberRef`;`IdentitySourceRef` 不等于 account body | 缺 source/actor/key rejected;已有 anchor rejected 或 duplicate replay |
| 同上 | `GlobalMember::establish(...)` | 齐全: member ref、source ref、actor ref、created_at | `created_at` 来自 `IdentityClockPort.now()` | created_at 不等于 truth cursor | 缺 clock/id source 为 application error;不由 domain 取系统时间 |
| 同上 | `GlobalLifecycleState::initial_available(...)` | 齐全: actor、initial reason、changed_at | `changed_at` 与 created_at 可由 same command clock source 提供 | lifecycle reason 不等于 anchor reason;anchor state 不等于 lifecycle state | 缺 initial lifecycle reason rejected |
| accepted output | `IdentityCommandEffectSummary` / public effect | 齐全: truth refs、cursor、trace/outbox/stale/stored refs | cursor 来自 UoW;trace/outbox refs 来自 accepted side effect builders | `IdentityTruthCursor` 不等于 timestamp/version/key | 若 accepted path 不能生成 cursor/effect,必须暂停到 Step 9/11 |

#### 9.3.5 错误映射

| 情况 | Protocol surface | 说明 |
|---|---|---|
| source 缺失 / 非法 owner / forbidden body marker | `IdentityProtocolRejectionKind::InvalidRequest` 或 `ForbiddenBody` | 不保存 raw source body |
| requested member ref 已存在或不可复用 | `PolicyDenied` / `Conflict` | 具体 conflict/reuse mapping 留 Step 12 |
| same idempotency key + different digest | `DuplicateConflict` | Step 13 固化 replay / conflict matrix |
| repository / transaction failure | `ApplicationError` | 不伪造成 rejected command |

#### 9.3.6 幂等与审计要求

- 必须使用 8.1 `IdentityCommandMetadata.idempotency_key` 和 `IdentityRequestDigestMarker`。
- accepted path 必须保存 stored accepted result surface,以支持 duplicate replay。
- accepted path 必须产生 trace refs、outbox refs 和 command effect summary refs;具体顺序留 Step 9/11。
- rejected 是否 stored 由 Step 12/13 细化,但若 stored rejected,必须使用 8.1 `IdentityProtocolRejection` surface。

### 9.4 `UpdateGlobalLifecycleState` protocol

#### 9.4.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_command(IdentityCommandRequest<UpdateGlobalLifecycleStateRequest>) -> Result<IdentityCommandOutcome<GlobalLifecycleCommandResult>, ApplicationError>` |
| HTTP / RPC / Event 名称 | API command dispatch route for `UpdateGlobalLifecycleState`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / trusted administrative command caller |
| 处理方 | `identity-application` command service through `IdentityApplicationFacade::dispatch_command` |

#### 9.4.2 请求 schema

```rust
/// Request body for explicitly changing a member global lifecycle state.
pub struct UpdateGlobalLifecycleStateRequest {
    /// Member whose lifecycle state will be updated.
    pub member_ref: GlobalMemberRef,

    /// Requested target lifecycle state.
    pub target_state: GlobalLifecycleStateKind,

    /// Body-free lifecycle reason marker.
    pub reason_ref: LifecycleReasonRef,

    /// Optional governance basis marker for high-risk lifecycle changes.
    pub basis_ref: Option<GovernanceBasisRef>,

    /// Lifecycle action risk marker used for high-risk precheck.
    pub action_risk_ref: Option<LifecycleRiskRef>,
}
```

| 输入字段 | 类型 | 目标对象字段 / policy 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | member dependency, lifecycle repository key | command body / route mapping | 必填;缺失 rejected;not found 映射留 Step 12 |
| `target_state` | `GlobalLifecycleStateKind` | `LifecycleTransitionPolicy.target_state`, `GlobalLifecycleState.state_kind` | command body | 必填;非法 variant rejected |
| `reason_ref` | `LifecycleReasonRef` | `GlobalLifecycleState.reason_ref`, policy reason | command body | 必填;缺失 rejected |
| `basis_ref` | `Option<GovernanceBasisRef>` | `GlobalLifecycleState.basis_ref`, high-risk guard | command body / governance basis picker | 非高风险可空;高风险缺失 rejected / pending basis surface 留 Step 12 |
| `action_risk_ref` | `Option<LifecycleRiskRef>` | `HighRiskLifecycleGuard.action_risk_ref` | command body / policy summary marker | 高风险目标必须有正式风险 marker;缺口不得由 service 猜测 |

High-risk basis resolution is not encoded as trusted request truth:

| 预检查输入 | 来源 | 规则 |
|---|---|---|
| `GovernanceBasisSummary` | `IdentityExternalSourceResolverPort.resolve_governance_basis(basis_ref, action_risk_ref)` | 只有 summary state valid 且 supports action risk 才能通过;不得用 `basis_ref.is_some()` 推断 valid |
| existing lifecycle | `GlobalLifecycleRepository.get_lifecycle_with_version(member_ref)` | transition save expected_version 来源 |
| existing member | `GlobalMemberRepository.get_member_with_version(member_ref)` | member 存在性和 anchor/lifecycle 分离 guard |

#### 9.4.3 响应 schema

```rust
/// Accepted command result for UpdateGlobalLifecycleState.
pub struct GlobalLifecycleCommandResult {
    /// Member whose lifecycle state changed.
    pub member_ref: GlobalMemberRef,

    /// Lifecycle state after the command.
    pub lifecycle_state_kind: GlobalLifecycleStateKind,

    /// Body-free lifecycle reason marker.
    pub reason_ref: LifecycleReasonRef,

    /// Governance basis marker persisted for the lifecycle change when present.
    pub basis_ref: Option<GovernanceBasisRef>,

    /// Anchor state after lifecycle terminal handling, when changed by the flow.
    pub anchor_state_kind: Option<IdentityAnchorStateKind>,

    /// Accepted command side-effect summary.
    pub effect: IdentityCommandEffectPublicSummary,
}
```

| 响应字段 | 类型 | 字段来源 | 约束 |
|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | request + loaded member | not a ProjectMember/runtime ref |
| `lifecycle_state_kind` | `GlobalLifecycleStateKind` | saved `GlobalLifecycleState` | 不表达 runtime health |
| `reason_ref` | `LifecycleReasonRef` | request | body-free reason marker |
| `basis_ref` | `Option<GovernanceBasisRef>` | request + resolver accepted summary | 只保存 ref,不保存 governance body |
| `anchor_state_kind` | `Option<IdentityAnchorStateKind>` | terminal anchor hold side effect,若 Step 9 flow 触发 | 非 terminal 可空;具体 terminal mapping 留 Step 10 |
| `effect` | `IdentityCommandEffectPublicSummary` | effect summary assembler | accepted-only |

#### 9.4.4 DTO -> Domain 构造闭环

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `IdentityCommandRequest<UpdateGlobalLifecycleStateRequest>` | `LifecycleTransitionPolicy::for_transition(...)` | 齐全: current state、target、reason、actor、channel | current state 来自 `GlobalLifecycleRepository.get_lifecycle_with_version(...)`;actor/channel 来自 operation context | target lifecycle 不等于 runtime / ProjectMember 状态 | 缺 current/member 走 not found/rejected;非法迁移 rejected |
| 同上 | `HighRiskLifecycleGuard::for_action(...)` | 高风险时齐全: target、risk、basis、actor | risk 来自 request/policy marker;basis summary 来自 resolver | basis ref presence 不等于 valid;`GovernanceBasisSummary` 不进入 lifecycle truth | 缺 basis、invalid/unavailable/mismatch rejected或 pending/degraded surface 留 Step 12 |
| 同上 | `GlobalLifecycleState::from_transition(...)` | 齐全: current、target、reason、actor、changed_at、basis | `changed_at` 来自 clock;basis_ref 仅在 precheck 通过后传入 | changed_at 不等于 cursor;basis body 不入仓 | 缺 clock/resolver 为 ApplicationError 或 protocol rejection,按 Step 12 |
| terminal side effect | `IdentityAnchorState::retired_held(...)` / `tombstone_held(...)` candidate | 需要 anchor reason;具体是否由 lifecycle reason 映射留 Step 9/10 | Step 9/10 明确 terminal anchor hold 规则 | anchor state 不等于 lifecycle state | 若 terminal mapping 不闭合,后续 Step 9/10 必须暂停 |
| accepted output | `IdentityCommandEffectSummary` / public effect | 齐全: lifecycle truth ref、cursor、trace/outbox/stale/stored refs | UoW / trace/outbox/effect builders | cursor 不等于 timestamp/version/key | 缺 effect/cursor surface 时暂停到 Step 9/11 |

#### 9.4.5 错误映射

| 情况 | Protocol surface | 说明 |
|---|---|---|
| member 不存在 | `IdentityProtocolRejectionKind::NotFound` | 不创建 member |
| target transition illegal | `PolicyDenied` | 不降级为 stale/degraded |
| reason 缺失 / illegal target variant | `InvalidRequest` | 不写 lifecycle |
| high-risk basis missing / invalid for action | `PolicyDenied` 或后续 Step 12 的 pending/dependency surface | 必须依赖 resolver summary,不能只看 ref |
| basis resolver unavailable | `AdapterUnavailable` + degraded marker 或 Step 12 指定 surface | 不 accepted |
| same idempotency key + different digest | `DuplicateConflict` | Step 13 固化 |
| repository / transaction failure | `ApplicationError` | 不伪造成 rejected command |

#### 9.4.6 幂等与审计要求

- 必须使用 8.1 `IdentityCommandMetadata.idempotency_key` 和 `IdentityRequestDigestMarker`。
- accepted path 必须 stored accepted result,duplicate replay 不重跑 lifecycle transition。
- accepted path 必须 append trace/outbox/effect summary;具体 trace kind、outbox payload 和 projection stale refs 留 Step 9/11。
- basis invalid/unavailable 的 rejected 是否 stored 留 Step 12/13,但 surface 必须是 8.1 `IdentityProtocolRejection`。

### 9.5 本批 DTO 构造闭环汇总

| Command | DTO 字段是否能构造目标对象 | Step 6 对象回指 | Step 7 port 回指 | 仍需后续 Step 闭口 |
|---|---|---|---|---|
| `EstablishGlobalMember` | 通过 | `GlobalMember`, `IdentityAnchorState`, `IdentityAnchorPolicy`, `GlobalLifecycleState` | id generator、clock、member/lifecycle repository、UoW、stored result、effect/outbox/trace ports | Step 9 transaction order;Step 10 initial lifecycle/anchor state matrix;Step 11 unique/version |
| `UpdateGlobalLifecycleState` | 通过,但 high-risk valid 必须依赖 resolver summary | `GlobalLifecycleState`, `LifecycleTransitionPolicy`, `HighRiskLifecycleGuard`, optional terminal `IdentityAnchorState` | clock、member/lifecycle repository、governance basis resolver、UoW、stored result、effect/outbox/trace ports | Step 9 basis precheck flow;Step 10 transition/terminal anchor matrix;Step 12 basis unavailable/invalid surface |

### 9.6 8.2-a 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只覆盖 member/lifecycle command | 通过 | 未展开 role/career/memory/handoff command |
| 是否沿用 8.1 shared envelope/result | 通过 | 两个 command 均使用 `IdentityCommandRequest<T>` 和 `IdentityCommandOutcome<T>` |
| DTO 字段是否有 Step 6/7 来源 | 通过 | request/result 字段均回指对象、policy、repository、clock/id/resolver surface |
| high-risk basis 是否避免伪闭合 | 通过 | 明确 `GovernanceBasisRef` presence 不等于 valid,必须消费 resolver `GovernanceBasisSummary` |
| 是否新增 port/state/object | 未新增 | 只引用 Step 6/7 已有对象和 port |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一步 | 8.2-b | 用户审核通过后进入 role / career / memory command DTOs |

### 9.7 8.2-a 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| member ref 来源 | request 可带 `requested_member_ref`,缺失时由 id generator 生成 | 用 account id 或 ProjectMember id 当 `GlobalMemberRef` |
| source ref | `IdentitySourceRef` 只作为 body-free 建档来源 | 保存账号、credential、runtime payload 或 ProjectMember body |
| initial lifecycle | `EstablishGlobalMember` 同步返回初始 `Available` lifecycle result | 建档只建 member,让 query 首次读取时补 lifecycle |
| lifecycle transition | request 明确 `target_state` 和 `reason_ref` | 用 runtime health 或 ProjectMember 状态反推 lifecycle |
| high-risk basis | resolver 返回 `GovernanceBasisSummary` 后再判断 valid for risk | `basis_ref.is_some()` 就 accepted |
| terminal anchor | terminal lifecycle 的 anchor hold 作为后续 flow/state matrix 明确 side effect | 在 DTO 里直接发明 anchor terminal mapping 规则 |
| command effect | accepted response 返回 trace/outbox/stale refs | response 内塞 outbound event body 或 trace body |

---

## 10. 8.2-b role / career / memory command DTOs

### 10.1 本批目标与边界

本批只定义三个 command:

- `MaintainRoleCapabilitySummary`
- `AppendCareerRecord`
- `MaintainMemoryReference`

它们必须沿用 8.1 的 `IdentityCommandRequest<T>`、`IdentityCommandOutcome<T>`、`IdentityCommandResponse<T>`、`IdentityCommandEffectPublicSummary` 和 `IdentityProtocolRejection`。本批不定义 query DTO、inbound event payload、outbound payload、function flow、transaction order、state matrix、HTTP status 或 duplicate replay matrix。

本批重点是把 role / capability source、work participation source、memory / archive source 都表达成 body-free refs / markers / safe summary refs,并让 request DTO 能构造 Step 6 policy 输入和 Step 7 resolver / repository 调用,但不得保存 method body、RoleDefinition body、CapabilityDefinition body、Project / WorkItem / ProjectMember body、memory body、embedding、archive package 或 receipt body。

### 10.2 Command batch table

| Command | Request DTO | Result DTO | 目标对象 | 依赖 Step 7 port | 后续 flow |
|---|---|---|---|---|---|
| `MaintainRoleCapabilitySummary` | `MaintainRoleCapabilitySummaryRequest` | `RoleCapabilityCommandResult` | `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, `RoleCapabilitySourcePolicy` | `GlobalMemberRepository`, `RoleCapabilityRepository`, `IdentityExternalSourceResolverPort.resolve_role_capability_source`, `resolve_capability_evidence`, id/clock/UoW/result/effect/outbox/trace ports | `MaintainRoleCapabilitySummaryFlow` |
| `AppendCareerRecord` | `AppendCareerRecordRequest` | `CareerRecordCommandResult` | `CareerRecord`, `CareerAppendPolicy` | `GlobalMemberRepository`, `CareerRecordRepository`, `IdentityExternalSourceResolverPort.resolve_work_participation`, id/clock/UoW/result/effect/outbox/trace ports | `AppendCareerRecordFlow` |
| `MaintainMemoryReference` | `MaintainMemoryReferenceRequest` | `MemoryReferenceCommandResult` | `MemoryReference`, `MemoryReferenceState`, `MemoryReferencePolicy` | `GlobalMemberRepository`, `MemoryReferenceRepository`, `IdentityExternalSourceResolverPort.resolve_memory_reference_source`, `resolve_archive_handoff_source`, id/clock/UoW/result/effect/outbox/trace ports | `MaintainMemoryReferenceFlow` |

### 10.3 `MaintainRoleCapabilitySummary` protocol

#### 10.3.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_command(IdentityCommandRequest<MaintainRoleCapabilitySummaryRequest>) -> Result<IdentityCommandOutcome<RoleCapabilityCommandResult>, ApplicationError>` |
| HTTP / RPC / Event 名称 | API command dispatch route for `MaintainRoleCapabilitySummary`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / trusted administrative command caller |
| 处理方 | `identity-application` command service through `IdentityApplicationFacade::dispatch_command` |

#### 10.3.2 请求 schema

```rust
/// Request body for maintaining the Identity-owned role/capability summary for a member.
pub struct MaintainRoleCapabilitySummaryRequest {
    /// Member whose role/capability summary is maintained.
    pub member_ref: GlobalMemberRef,

    /// Optional caller-known summary ref. When absent, application may create a new summary ref.
    pub requested_summary_ref: Option<RoleCapabilitySummaryRef>,

    /// Method-library source ref to resolve into a body-free source snapshot.
    pub source_ref: RoleCapabilitySourceRef,

    /// Optional role source wrapper used by the accepted summary.
    pub role_source_ref: Option<RoleSourceRef>,

    /// Capability source wrappers used by the accepted summary.
    pub capability_source_refs: Vec<CapabilitySourceRef>,

    /// Capability evidence refs;never evidence body.
    pub evidence_refs: Vec<CapabilityEvidenceRef>,

    /// Optional safe summary marker supplied by caller or resolver.
    pub safe_summary_ref: Option<RoleCapabilitySafeSummaryRef>,

    /// Body-free reason marker for this summary change.
    pub change_reason_ref: RoleCapabilityChangeReasonRef,

    /// Material classification used to reject forbidden method/definition/evidence/scoring body.
    pub change_material_marker: RoleCapabilityChangeMaterialMarker,
}
```

| 输入字段 | 类型 | 目标对象字段 / policy 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | `RoleCapabilitySummary.member_ref`, policy member guard | command body / route mapping | 必填;member missing rejected |
| `requested_summary_ref` | `Option<RoleCapabilitySummaryRef>` | `RoleCapabilitySummary.summary_ref` | caller-known ref 或 id generator | 缺失时 create path 由 `IdentityIdGeneratorPort.new_role_capability_summary_id()` 分配 |
| `source_ref` | `RoleCapabilitySourceRef` | source resolver input / `RoleCapabilitySourceSnapshot.source_ref` | command body;method-library body-free source ref | 必填;unrecognized/unavailable 不能 accepted active |
| `role_source_ref` | `Option<RoleSourceRef>` | `RoleCapabilitySummary.role_source_ref` | command body / resolver safe mapping | 可空;若 source 表达 role 则必须与 `source_ref` 同源 |
| `capability_source_refs` | `Vec<CapabilitySourceRef>` | `RoleCapabilitySummary.capability_source_refs` | command body / resolver safe mapping | 需要 capability summary 时不能为空;完整规则 Step 10 |
| `evidence_refs` | `Vec<CapabilityEvidenceRef>` | summary / snapshot evidence refs、policy evidence guard | command body / evidence resolver | 缺证据是否 rejected/pending 留 Step 10/12;不得 accepted 伪证据 |
| `safe_summary_ref` | `Option<RoleCapabilitySafeSummaryRef>` | `RoleCapabilitySummary.safe_summary_ref`, snapshot safe summary | command body 或 source resolver | `Active` accepted 通常必须存在;缺失分支留 Step 9/10/12 |
| `change_reason_ref` | `RoleCapabilityChangeReasonRef` | policy reason、trace material | command body | 必填;缺失 rejected |
| `change_material_marker` | `RoleCapabilityChangeMaterialMarker` | `RoleCapabilitySourcePolicy.change_material_marker` | entry DTO precheck / request marker | 必填;forbidden body / automatic scoring rejected |

Resolver / repository derived inputs:

| 派生输入 | 来源 | 规则 |
|---|---|---|
| `RoleCapabilitySourceResolution` | `IdentityExternalSourceResolverPort.resolve_role_capability_source(source_ref)` | 只返回 source state、source version、safe summary marker、evidence refs 和 material marker;不得返回 definition body |
| `CapabilityEvidenceResolution` | `IdentityExternalSourceResolverPort.resolve_capability_evidence(evidence_ref)` | 只验证 evidence ref / safe summary marker;不得保存 evidence / artifact body |
| existing member | `GlobalMemberRepository.get_member_with_version(member_ref)` | 只用于 existence guard;missing 不创建 member |
| existing summary / snapshot | `RoleCapabilityRepository.find_current_summary_by_member(...)`, `find_source_snapshot_by_source(...)` | expected_version 来源;不得从 source version 当 optimistic version |

#### 10.3.3 响应 schema

```rust
/// Accepted command result for MaintainRoleCapabilitySummary.
pub struct RoleCapabilityCommandResult {
    /// Member whose summary changed.
    pub member_ref: GlobalMemberRef,

    /// Identity-owned role/capability summary ref.
    pub summary_ref: RoleCapabilitySummaryRef,

    /// Source snapshot used by the summary.
    pub source_snapshot_ref: RoleCapabilitySourceSnapshotRef,

    /// Final summary state.
    pub summary_state_kind: RoleCapabilitySummaryStateKind,

    /// Source snapshot state used by the accepted result.
    pub source_state_kind: RoleCapabilitySourceStateKind,

    /// Optional role source wrapper.
    pub role_source_ref: Option<RoleSourceRef>,

    /// Capability source wrappers.
    pub capability_source_refs: Vec<CapabilitySourceRef>,

    /// Evidence refs retained by the summary.
    pub evidence_refs: Vec<CapabilityEvidenceRef>,

    /// Body-free safe summary marker.
    pub safe_summary_ref: Option<RoleCapabilitySafeSummaryRef>,

    /// Accepted command side-effect summary.
    pub effect: IdentityCommandEffectPublicSummary,
}
```

| 响应字段 | 类型 | 字段来源 | 约束 |
|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | request + loaded member | 不等于 ProjectMember / account / runtime ref |
| `summary_ref` | `RoleCapabilitySummaryRef` | requested ref 或 id generator + saved summary | opaque;不得用 source ref 拼接 |
| `source_snapshot_ref` | `RoleCapabilitySourceSnapshotRef` | id generator / existing snapshot save result | 不等于 source version |
| `summary_state_kind` | `RoleCapabilitySummaryStateKind` | saved `RoleCapabilitySummary` | stale/unavailable/pending 不得伪装 active |
| `source_state_kind` | `RoleCapabilitySourceStateKind` | saved `RoleCapabilitySourceSnapshot` | source state 必须与 snapshot 同源 |
| `role_source_ref` / `capability_source_refs` | role/capability typed refs | request / resolver mapping | 不保存 RoleDefinition / CapabilityDefinition body |
| `evidence_refs` | `Vec<CapabilityEvidenceRef>` | request + evidence resolver | 不保存 evidence body |
| `safe_summary_ref` | `Option<RoleCapabilitySafeSummaryRef>` | request / resolver / saved summary | marker only;最小 public schema 留 query/outbound 批次 |
| `effect` | `IdentityCommandEffectPublicSummary` | effect summary assembler | accepted-only |

#### 10.3.4 DTO -> Domain 构造闭环

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `IdentityCommandRequest<MaintainRoleCapabilitySummaryRequest>` | `RoleCapabilitySourceSnapshot::from_resolved_source(...)` 或 unavailable/unrecognized snapshot factory | 齐全: snapshot ref、source ref、source version、safe summary/evidence、resolved time | snapshot ref 来自 id generator;resolution/source version 来自 resolver;time 来自 clock | source version 不等于 snapshot id / optimistic version / cursor | source unavailable/unrecognized 不得 accepted active;resolver 若不给 source version,不得构造任何 source snapshot,按 Step 9/12 dependency/rejected surface 处理 |
| 同上 | `RoleCapabilitySourcePolicy::for_summary_update(...)` | 齐全: member, source snapshot, evidence refs, reason, actor, channel, material marker | member_exists 来自 member repo;actor/channel 来自 operation context | material marker 不等于 payload body;source ref presence 不等于 usable | member missing、forbidden body、automatic scoring、missing source/evidence rejected/pending |
| 同上 | `RoleCapabilitySummary::create_for_member(...)` 或 update methods | 齐全: summary ref、member、source snapshot、safe summary、evidence、actor/time | summary ref 来自 request/id generator;existing summary/version 来自 repository | safe summary ref 不等于 summary body | 缺 required safe summary / evidence 时按 Step 10/12;不得保存 body |
| accepted output | `IdentityCommandEffectSummary` / public effect | 齐全: summary/snapshot refs、cursor、trace/outbox/stale/stored refs | UoW / trace/outbox/effect builders | cursor 不等于 timestamp/version/source version | 缺 effect/cursor surface 时暂停到 Step 9/11 |

#### 10.3.5 错误映射

| 情况 | Protocol surface | 说明 |
|---|---|---|
| member 不存在 | `IdentityProtocolRejectionKind::NotFound` | 不创建 member |
| source ref 缺失 / owner 非法 / unrecognized | `InvalidRequest` / `PolicyDenied` | 不从字符串推断 source kind |
| source unavailable | `AdapterUnavailable` + degraded marker 或 Step 12 指定 surface | 不 accepted active |
| evidence missing / invalid | `PolicyDenied` 或 Step 12 指定 pending/dependency surface | 不保存 evidence body |
| forbidden definition / method / evidence / scoring material | `ForbiddenBody` | 不写 truth、trace、outbox、report body |
| same idempotency key + different digest | `DuplicateConflict` | Step 13 固化 |
| repository / transaction failure | `ApplicationError` | 不伪造成 protocol rejected |

### 10.4 `AppendCareerRecord` protocol

#### 10.4.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_command(IdentityCommandRequest<AppendCareerRecordRequest>) -> Result<IdentityCommandOutcome<CareerRecordCommandResult>, ApplicationError>` |
| HTTP / RPC / Event 名称 | API command dispatch route for `AppendCareerRecord`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / trusted administrative command caller |
| 处理方 | `identity-application` command service through `IdentityApplicationFacade::dispatch_command` |

#### 10.4.2 请求 schema

```rust
/// Request body for appending an Identity-owned career history record.
pub struct AppendCareerRecordRequest {
    /// Member whose career history receives an append-only record.
    pub member_ref: GlobalMemberRef,

    /// Optional caller-known career record ref. When absent, application generates one.
    pub requested_career_record_ref: Option<CareerRecordRef>,

    /// Requested append/correction/pending-review intent.
    pub change_intent: CareerRecordChangeIntent,

    /// Work-owned participation ref;never ProjectMember body.
    pub project_participation_ref: ProjectParticipationRef,

    /// Work source marker for this append.
    pub work_source_ref: WorkSourceRef,

    /// Stable duplicate-source marker.
    pub source_marker_ref: CareerSourceMarkerRef,

    /// Optional redaction-safe career summary marker.
    pub career_summary_ref: Option<CareerSafeSummaryRef>,

    /// Body-free reason marker for append/correction.
    pub append_reason_ref: CareerAppendReasonRef,

    /// Original career record being explained, required for correction intent.
    pub original_record_ref: Option<CareerRecordRef>,

    /// Material classification used to reject Project/Work/ProjectMember/artifact body.
    pub append_material_marker: CareerAppendMaterialMarker,
}
```

| 输入字段 | 类型 | 目标对象字段 / policy 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | `CareerRecord.member_ref`, policy member guard | command body / route mapping | 必填;member missing rejected |
| `requested_career_record_ref` | `Option<CareerRecordRef>` | `CareerRecord.career_record_ref` | caller-known ref 或 id generator | 缺失时 `IdentityIdGeneratorPort.new_career_record_id()` |
| `change_intent` | `CareerRecordChangeIntent` | `CareerAppendPolicy.change_intent` | command body | update/delete/reorder intents rejected |
| `project_participation_ref` | `ProjectParticipationRef` | `CareerRecord.project_participation_ref` | command body / work resolver summary | 必填;不得保存 ProjectMember body |
| `work_source_ref` | `WorkSourceRef` | `CareerRecord.work_source_ref`, work resolver input | command body | 必填;owner 非 Work rejected |
| `source_marker_ref` | `CareerSourceMarkerRef` | `CareerRecord.source_marker_ref`, duplicate lookup | command body / resolver summary | 必填;缺失无法判断 duplicate, rejected |
| `career_summary_ref` | `Option<CareerSafeSummaryRef>` | `CareerRecord.career_summary_ref` | command body / work resolver summary | accepted appended/correction 通常必须存在;pending 可空 |
| `append_reason_ref` | `CareerAppendReasonRef` | `CareerRecord.append_reason_ref`, policy reason | command body | 必填;缺失 rejected |
| `original_record_ref` | `Option<CareerRecordRef>` | correction relation | command body / loaded original | correction 必填;append new 必须为空或忽略规则 Step 10 |
| `append_material_marker` | `CareerAppendMaterialMarker` | `CareerAppendPolicy.append_material_marker` | DTO precheck / request marker | forbidden Project / WorkItem / ProjectMember / artifact body rejected |

Resolver / repository derived inputs:

| 派生输入 | 来源 | 规则 |
|---|---|---|
| `WorkParticipationSourceSummary` | `IdentityExternalSourceResolverPort.resolve_work_participation(work_source_ref)` | 只返回 project participation ref、source marker、safe summary marker 和 source state;不得返回 work body |
| existing member | `GlobalMemberRepository.get_member_with_version(member_ref)` | member existence guard;missing 不创建 member |
| duplicate source records | `CareerRecordRepository.find_duplicate_source_record(source_marker_ref)` / `find_records_by_source_marker(...)` | duplicate source 不新增 history;source marker 不等于 idempotency key |
| original record | `CareerRecordRepository.get_career_record(original_record_ref)` | correction intent 的 original existence / version 来源 |

#### 10.4.3 响应 schema

```rust
/// Accepted command result for AppendCareerRecord.
pub struct CareerRecordCommandResult {
    /// Member whose career history changed.
    pub member_ref: GlobalMemberRef,

    /// Appended career record ref.
    pub career_record_ref: CareerRecordRef,

    /// Final state of the appended record.
    pub record_state_kind: CareerRecordStateKind,

    /// Work-owned participation source.
    pub project_participation_ref: ProjectParticipationRef,

    /// Work source marker used for this append.
    pub work_source_ref: WorkSourceRef,

    /// Duplicate source marker.
    pub source_marker_ref: CareerSourceMarkerRef,

    /// Redaction-safe career summary marker.
    pub career_summary_ref: Option<CareerSafeSummaryRef>,

    /// Original record explained by this correction, when applicable.
    pub correction_of_ref: Option<CareerRecordRef>,

    /// Existing record marked as superseded by this correction, when applicable.
    pub superseded_record_ref: Option<CareerRecordRef>,

    /// Accepted command side-effect summary.
    pub effect: IdentityCommandEffectPublicSummary,
}
```

| 响应字段 | 类型 | 字段来源 | 约束 |
|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | request + loaded member | 不等于 ProjectMember |
| `career_record_ref` | `CareerRecordRef` | request/id generator + appended record | opaque;不得由 source marker 拼接 |
| `record_state_kind` | `CareerRecordStateKind` | saved `CareerRecord` | duplicate/rejected 不是 record state |
| `project_participation_ref` / `work_source_ref` | work boundary refs | request / resolver summary | 不保存 Project / WorkItem / ProjectMember body |
| `source_marker_ref` | `CareerSourceMarkerRef` | request / resolver summary | duplicate source marker,不等于 idempotency key |
| `career_summary_ref` | `Option<CareerSafeSummaryRef>` | request / resolver / saved record | safe marker only;不保存 work summary body |
| `correction_of_ref` / `superseded_record_ref` | `Option<CareerRecordRef>` | correction flow | correction 是追加,不是 in-place update |
| `effect` | `IdentityCommandEffectPublicSummary` | effect summary assembler | accepted-only |

#### 10.4.4 DTO -> Domain 构造闭环

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `IdentityCommandRequest<AppendCareerRecordRequest>` | `CareerAppendPolicy::for_append(...)` / `for_correction(...)` | 齐全: member, source summary, duplicate refs, reason, actor, channel, intent, material marker | member_exists 来自 member repo;source summary 来自 work resolver;duplicate refs 来自 career repo | source marker 不等于 idempotency key;work source ref 不等于 ProjectMember body | member missing、duplicate、untrusted source、forbidden body rejected/no-op |
| 同上 | `CareerRecord::append_from_work_source(...)` | append new 齐全: record ref、member、trusted source summary、reason、actor/time | record ref 来自 request/id generator;time 来自 clock | appended_at 不等于 truth cursor | 缺 trusted source/safe summary 时按 Step 9/10/12 |
| 同上 | `CareerRecord::correction_for_record(...)` + optional `mark_superseded_by_correction(...)` | correction 齐全: new record ref、original record、source summary、reason、actor/time | original record/version 来自 repository | correction 不覆盖 original;supersede 是解释性状态 | original missing rejected;state matrix 留 Step 10 |
| accepted output | `IdentityCommandEffectSummary` / public effect | 齐全: career refs、cursor、trace/outbox/stale/stored refs | UoW / trace/outbox/effect builders | cursor 不等于 timestamp/source marker | 缺 effect/cursor surface 时暂停到 Step 9/11 |

#### 10.4.5 错误映射

| 情况 | Protocol surface | 说明 |
|---|---|---|
| member 不存在 | `IdentityProtocolRejectionKind::NotFound` | 不从 work source 私下建 member |
| duplicate source marker | `Conflict` / duplicate no-op surface,具体留 Step 9/13 | 不新增 `CareerRecord` |
| work source untrusted / unresolved / unavailable | `PolicyDenied` / `AdapterUnavailable` + degraded marker 或 Step 12 指定 surface | 不 accepted 伪记录 |
| correction 缺 original record | `InvalidRequest` / `NotFound` | 不创建悬空 correction |
| forbidden Project / WorkItem / ProjectMember / artifact body | `ForbiddenBody` | 不保存 work body |
| same idempotency key + different digest | `DuplicateConflict` | Step 13 固化 |
| repository / transaction failure | `ApplicationError` | 不伪造成 rejected command |

### 10.5 `MaintainMemoryReference` protocol

#### 10.5.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_command(IdentityCommandRequest<MaintainMemoryReferenceRequest>) -> Result<IdentityCommandOutcome<MemoryReferenceCommandResult>, ApplicationError>` |
| HTTP / RPC / Event 名称 | API command dispatch route for `MaintainMemoryReference`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / trusted administrative command caller |
| 处理方 | `identity-application` command service through `IdentityApplicationFacade::dispatch_command` |

#### 10.5.2 请求 schema

```rust
/// Request body for maintaining an Identity-owned memory/archive reference relation.
pub struct MaintainMemoryReferenceRequest {
    /// Member whose memory/archive relation is maintained.
    pub member_ref: GlobalMemberRef,

    /// Optional caller-known relation ref. When absent, application may create one.
    pub requested_memory_reference_ref: Option<MemoryReferenceRef>,

    /// Requested relation change intent.
    pub change_intent: MemoryReferenceChangeIntent,

    /// External memory carrier ref.
    pub memory_ref: Option<MemoryRef>,

    /// External archive carrier ref.
    pub archive_ref: Option<ArchiveRef>,

    /// Archive handoff or migration marker.
    pub archive_handoff_ref: Option<ArchiveHandoffRef>,

    /// Source marker for resolver/callback summary.
    pub source_ref: MemoryReferenceSourceRef,

    /// Optional redaction-safe memory/archive summary marker.
    pub safe_summary_ref: Option<MemorySafeSummaryRef>,

    /// Body-free reason marker for this relation change.
    pub reason_ref: MemoryReferenceReasonRef,

    /// Material classification used to reject memory/archive/receipt body.
    pub change_material_marker: MemoryReferenceChangeMaterialMarker,
}
```

| 输入字段 | 类型 | 目标对象字段 / policy 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | `MemoryReference.member_ref`, policy member guard | command body / route mapping | 必填;member missing rejected |
| `requested_memory_reference_ref` | `Option<MemoryReferenceRef>` | `MemoryReference.memory_reference_ref` | caller-known ref 或 id generator | 缺失时 create path 由 `IdentityIdGeneratorPort.new_memory_reference_id()` |
| `change_intent` | `MemoryReferenceChangeIntent` | `MemoryReferencePolicy.change_intent` | command body | external owner write/delete intents rejected |
| `memory_ref` | `Option<MemoryRef>` | relation/state memory ref | command body / resolver summary | accepted relation 至少需 memory/archive/handoff marker之一;完整规则 Step 10 |
| `archive_ref` | `Option<ArchiveRef>` | relation/state archive ref | command body / resolver summary | 不保存 archive package |
| `archive_handoff_ref` | `Option<ArchiveHandoffRef>` | relation/state handoff marker | command body / resolver/callback summary | handoff marker 不等于 receipt body |
| `source_ref` | `MemoryReferenceSourceRef` | resolver input / `MemoryReference.source_ref` | command body | 必填;unrecognized/unavailable 不得伪成功 |
| `safe_summary_ref` | `Option<MemorySafeSummaryRef>` | relation safe summary | command body / resolver summary | marker only;是否必填 Step 10/12 |
| `reason_ref` | `MemoryReferenceReasonRef` | relation/state reason、policy reason | command body | 必填;缺失 rejected |
| `change_material_marker` | `MemoryReferenceChangeMaterialMarker` | policy body-free guard | DTO precheck / request marker | forbidden memory/archive/package/receipt body rejected |

Resolver / repository derived inputs:

| 派生输入 | 来源 | 规则 |
|---|---|---|
| `MemoryReferenceSourceSummary` | `IdentityExternalSourceResolverPort.resolve_memory_reference_source(source_ref)` | 只返回 memory/archive/handoff refs、safe summary marker 和 source state;不得返回 memory body/embedding/archive package |
| archive handoff summary | `IdentityExternalSourceResolverPort.resolve_archive_handoff_source(archive_handoff_ref)` | 只返回 body-free handoff result marker;不得返回 receipt/package body |
| existing member | `GlobalMemberRepository.get_member_with_version(member_ref)` | member existence guard |
| existing relation | `MemoryReferenceRepository.get_memory_reference_with_version(...)`, `find_reference_by_memory(...)`, `find_reference_by_archive(...)`, `find_reference_by_handoff(...)` | expected_version / duplicate relation lookup;query miss 不创建 relation unless command create path |

#### 10.5.3 响应 schema

```rust
/// Accepted command result for MaintainMemoryReference.
pub struct MemoryReferenceCommandResult {
    /// Member whose memory/archive relation changed.
    pub member_ref: GlobalMemberRef,

    /// Identity-owned memory reference relation ref.
    pub memory_reference_ref: MemoryReferenceRef,

    /// Final relation state kind.
    pub reference_state_kind: MemoryReferenceStateKind,

    /// External memory carrier ref.
    pub memory_ref: Option<MemoryRef>,

    /// External archive carrier ref.
    pub archive_ref: Option<ArchiveRef>,

    /// Archive handoff or migration marker.
    pub archive_handoff_ref: Option<ArchiveHandoffRef>,

    /// Source marker used for this relation state.
    pub source_ref: MemoryReferenceSourceRef,

    /// Redaction-safe summary marker.
    pub safe_summary_ref: Option<MemorySafeSummaryRef>,

    /// Body-free reason marker.
    pub reason_ref: MemoryReferenceReasonRef,

    /// Accepted command side-effect summary.
    pub effect: IdentityCommandEffectPublicSummary,
}
```

| 响应字段 | 类型 | 字段来源 | 约束 |
|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | request + loaded member | 不等于 memory owner identity |
| `memory_reference_ref` | `MemoryReferenceRef` | request/id generator + saved relation | opaque;不得由 memory/archive/handoff ref 拼接 |
| `reference_state_kind` | `MemoryReferenceStateKind` | saved `MemoryReference.reference_state` | relation state 不等于 handoff delivery state |
| `memory_ref` / `archive_ref` / `archive_handoff_ref` | external typed refs | request / resolver / saved relation | body-free;不保存 memory body、archive package、receipt body |
| `source_ref` | `MemoryReferenceSourceRef` | request / source summary | marker only |
| `safe_summary_ref` | `Option<MemorySafeSummaryRef>` | request / resolver / saved relation | summary body 不入 DTO |
| `reason_ref` | `MemoryReferenceReasonRef` | request / saved relation | body-free reason marker |
| `effect` | `IdentityCommandEffectPublicSummary` | effect summary assembler | accepted-only |

#### 10.5.4 DTO -> Domain 构造闭环

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `IdentityCommandRequest<MaintainMemoryReferenceRequest>` | `MemoryReferencePolicy::for_link(...)` / `for_refresh(...)` / `for_archive_handoff(...)` | 齐全: member, source summary, reason, actor, channel, intent, material marker | member_exists 来自 member repo;source summary 来自 resolver/callback mapper;actor/channel 来自 operation context | handoff marker 不等于 delivered receipt;source ref 不等于 memory body | member missing、missing refs、untrusted source、forbidden body rejected/pending |
| 同上 | `MemoryReference::link_for_member(...)` | create/link 齐全: relation ref、member、source summary、reason、actor/time | relation ref 来自 request/id generator;time 来自 clock | changed_at 不等于 cursor/version | 缺 memory/archive/handoff marker 不 accepted |
| 同上 | `MemoryReference::from_archive_handoff(...)` / `attach_archive_ref(...)` / `update_reference_state(...)` | archive/handoff 齐全: loaded relation or new ref、archive/handoff marker、reason、actor/time | existing relation/version 来自 repository;handoff summary 来自 resolver | handoff pending/failed 不等于 delivered;receipt body 不入仓 | callback/result marker 缺失时 rejected/pending/report-only 留 Step 9/12 |
| accepted output | `IdentityCommandEffectSummary` / public effect | 齐全: relation ref、cursor、trace/outbox/stale/stored refs | UoW / trace/outbox/effect builders | cursor 不等于 timestamp/source marker | 缺 effect/cursor surface 时暂停到 Step 9/11 |

#### 10.5.5 错误映射

| 情况 | Protocol surface | 说明 |
|---|---|---|
| member 不存在 | `IdentityProtocolRejectionKind::NotFound` | 不从 memory source 私下建 member |
| memory/archive/handoff marker 全缺 | `InvalidRequest` | 无正式 reference source 不 accepted |
| source unresolved / untrusted / unavailable | `PolicyDenied` / `AdapterUnavailable` + degraded marker 或 Step 12 指定 surface | 不伪造 linked |
| handoff result marker 缺失或不匹配 | `InvalidRequest` / `PolicyDenied` | 不把 callback raw body 当 receipt |
| forbidden memory body / embedding / archive package / receipt body | `ForbiddenBody` | 不写 truth、trace、outbox、report body |
| same idempotency key + different digest | `DuplicateConflict` | Step 13 固化 |
| repository / transaction failure | `ApplicationError` | 不伪造成 protocol rejected |

### 10.6 本批 DTO 构造闭环汇总

| Command | DTO 字段是否能构造目标对象 | Step 6 对象回指 | Step 7 port 回指 | 仍需后续 Step 闭口 |
|---|---|---|---|---|
| `MaintainRoleCapabilitySummary` | 通过,但 active accepted 必须依赖 resolver source/evidence summary | `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, `RoleCapabilitySourcePolicy` | member repo、role repository、source/evidence resolver、id/clock/UoW/result/effect/outbox/trace ports | Step 9 source unavailable/missing evidence flow;Step 10 summary/source state matrix;Step 12 forbidden body / adapter unavailable surface |
| `AppendCareerRecord` | 通过,但 duplicate/pending review 分支留后续矩阵 | `CareerRecord`, `CareerAppendPolicy`, `WorkParticipationSourceSummary` | member repo、career repo、work participation resolver、id/clock/UoW/result/effect/outbox/trace ports | Step 9 append/correction/duplicate flow;Step 10 pending review / correction state matrix;Step 12 source unavailable / forbidden work body |
| `MaintainMemoryReference` | 通过,但 handoff result / pending verification state 留后续矩阵 | `MemoryReference`, `MemoryReferenceState`, `MemoryReferencePolicy`, `MemoryReferenceSourceSummary` | member repo、memory repo、memory/archive resolver、id/clock/UoW/result/effect/outbox/trace ports | Step 9 link/refresh/archive flow;Step 10 relation state matrix;Step 12 handoff/result unavailable and forbidden body surface |

### 10.7 8.2-b 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只覆盖 role/career/memory command | 通过 | 未展开 handoff command、query、consumer、outbound event 或 job |
| 是否沿用 8.1 shared envelope/result | 通过 | 三个 command 均使用 `IdentityCommandRequest<T>` 和 `IdentityCommandOutcome<T>` |
| DTO 字段是否有 Step 6/7 来源 | 通过 | request/result 字段均回指 Step 6 object/policy/marker 和 Step 7 repository/resolver/id/clock surface |
| external body 是否排除 | 通过 | method definition、work truth、memory/archive/package/receipt body 均以 forbidden material marker rejected |
| 是否新增 port/state/object | 未新增 | 只引用 Step 6/7 已定义对象、marker、resolver 和 repository |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一步 | 8.2-c | 用户审核通过后进入 handoff command DTO |

### 10.8 8.2-b 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| role/capability source | request 使用 `RoleCapabilitySourceRef` 并由 resolver 返回 safe summary / evidence refs | request 携带 RoleDefinition JSON 或 capability definition body |
| source version | `RoleCapabilitySourceVersionRef` 只作为 source snapshot marker | 用 source version 当 optimistic lock version 或 truth cursor |
| evidence | `CapabilityEvidenceRef` 和 evidence resolver 只处理 body-free marker | 把 artifact/evidence正文塞进 command body |
| career append | `AppendCareerRecord` 使用 `CareerSourceMarkerRef` 做 duplicate source guard | 重放同一 work event 新增多条 career record |
| career correction | correction 追加新 `CareerRecord`,旧记录最多解释性 superseded | 原地更新、删除或重排旧 career history |
| work source | `WorkSourceRef` owner 明确为 Work,summary body-free | 保存 Project / WorkItem / ProjectMember body |
| memory relation | `MaintainMemoryReference` 至少有 memory/archive/handoff marker | 用空请求创建 relation,再让 job 后补外部 ref |
| archive handoff | `ArchiveHandoffRef` 是 body-free marker,delivery/receipt 留正式 callback | 把 HTTP 2xx、raw receipt 或 archive package 当 relation truth |
| command effect | accepted response 返回 effect refs | response 内返回 trace body、event body、memory body 或 archive package |

---

## 11. 8.2-c handoff command DTO

### 11.1 本批目标与边界

本批只定义一个 command:

- `PrepareTraceHandoff`

它必须沿用 8.1 的 `IdentityCommandRequest<T>`、`IdentityCommandOutcome<T>`、`IdentityCommandResponse<T>`、`IdentityCommandEffectPublicSummary` 和 `IdentityProtocolRejection`。本批不定义 `DeliverTraceHandoff` job DTO、不定义 `HandleTraceHandoffResult` callback payload、不定义 `GetTraceHandoffState` query DTO、不定义 handoff adapter config、target path、receipt body、transaction order、state matrix 或 duplicate replay matrix。

本批固定 `PrepareTraceHandoff` 的职责:只创建 pending `TraceHandoffIntent`,保存 body-free target/scope/safe material marker,并返回 accepted effect refs。它不执行交付、不调用 `IdentityHandoffDeliveryPort.deliver_handoff(...)`、不把 request sent / HTTP 2xx / job log success 标成 delivered、不保存 receipt body、archive package、trace body、audit raw log、target secret 或 adapter raw response。

### 11.2 Command batch table

| Command | Request DTO | Result DTO | 目标对象 | 依赖 Step 7 port | 后续 flow |
|---|---|---|---|---|---|
| `PrepareTraceHandoff` | `PrepareTraceHandoffRequest` | `TraceHandoffCommandResult` | `TraceHandoffIntent`, `HandoffState`, `HandoffPolicy` | `TraceHandoffIntentRepository`, `IdentityTraceRecordRepository`, `IdentityAuditTrailRepository`, `IdentityHandoffTargetPort.resolve_handoff_target`, id/clock/UoW/result/effect/trace ports | `PrepareTraceHandoffFlow` |

### 11.3 `PrepareTraceHandoff` protocol

#### 11.3.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_command(IdentityCommandRequest<PrepareTraceHandoffRequest>) -> Result<IdentityCommandOutcome<TraceHandoffCommandResult>, ApplicationError>` |
| HTTP / RPC / Event 名称 | API command dispatch route for `PrepareTraceHandoff`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / trusted administrative or operations command caller |
| 处理方 | `identity-application` command service through `IdentityApplicationFacade::dispatch_command` |

#### 11.3.2 请求 schema

```rust
/// Request body for preparing a pending trace/audit/archive handoff intent.
pub struct PrepareTraceHandoffRequest {
    /// Member whose trace/audit material is being prepared for handoff.
    pub member_ref: GlobalMemberRef,

    /// Optional caller-known handoff intent ref. When absent, application generates one.
    pub requested_handoff_intent_ref: Option<TraceHandoffIntentRef>,

    /// Trace records selected for handoff. Must be non-empty.
    pub trace_record_refs: Vec<IdentityTraceRecordRef>,

    /// Optional audit trail selected for handoff.
    pub audit_trail_ref: Option<AuditTrailRef>,

    /// Body-free handoff target marker.
    pub handoff_target_ref: HandoffTargetRef,

    /// Body-free handoff scope marker.
    pub handoff_scope_ref: HandoffScopeRef,

    /// Safe handoff material marker;never trace body, audit body, archive package, or raw log.
    pub safe_material_ref: TraceHandoffSafeMaterialRef,

    /// Handoff visibility context marker.
    pub visibility_context_ref: VisibilityContextRef,

    /// Body-free reason marker for preparing this handoff.
    pub handoff_reason_ref: HandoffReasonRef,
}
```

| 输入字段 | 类型 | 目标对象字段 / policy 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | `TraceHandoffIntent.member_ref` | command body / prepared context | 必填;member/trace mismatch 留 Step 9/12 |
| `requested_handoff_intent_ref` | `Option<TraceHandoffIntentRef>` | `TraceHandoffIntent.handoff_intent_ref` | caller-known ref 或 id generator | 缺失时 `IdentityIdGeneratorPort.new_trace_handoff_intent_ref()` |
| `trace_record_refs` | `Vec<IdentityTraceRecordRef>` | intent trace refs、`HandoffPolicy.trace_record_refs` | command body / trace selection UI / operations context | 必填且非空;空列表 rejected |
| `audit_trail_ref` | `Option<AuditTrailRef>` | optional audit trail binding | command body / loaded audit trail | 可空;不代表 trace 可空 |
| `handoff_target_ref` | `HandoffTargetRef` | intent target、target resolver input、policy target | command body / target catalog marker | 必填;target unavailable/unsupported 不能 accepted |
| `handoff_scope_ref` | `HandoffScopeRef` | intent scope、target resolver input、policy scope | command body / prepared scope marker | 必填;不得展开 bucket/path/tenant |
| `safe_material_ref` | `TraceHandoffSafeMaterialRef` | intent safe material、target resolver input、policy material | handoff material builder / prepared context | 必填;forbidden body rejected |
| `visibility_context_ref` | `VisibilityContextRef` | `HandoffPolicy.visibility_context_ref` | command body / entry visibility context | 必填;visibility failure rejected/not allowed |
| `handoff_reason_ref` | `HandoffReasonRef` | trace marker / audit reason / issue context | command body | 必填;不得保存 reason text |

Prepared / derived inputs:

| 派生输入 | 来源 | 规则 |
|---|---|---|
| trace records | `IdentityTraceRecordRepository.get_trace_record(...)` / list surface | 每个 trace ref 必须存在且适合 handoff;不得读取 trace raw body 填 DTO |
| optional audit trail | `IdentityAuditTrailRepository.get_audit_trail_with_version(...)` 或 equivalent read | audit trail ref 是 typed ref;不得从 audit subject 拼 ref |
| target resolution | `IdentityHandoffTargetPort.resolve_handoff_target(target_ref, scope_ref, safe_material_ref)` | 只返回 adapter boundary marker;不得返回 path/bucket/raw endpoint/secret |
| pending state | `HandoffState::pending(clock.now())` | prepare command 只创建 pending;不创建 delivered |
| handoff intent ref | request 或 `IdentityIdGeneratorPort.new_trace_handoff_intent_ref()` | 不从 target/scope/trace 拼接 |

#### 11.3.3 响应 schema

```rust
/// Accepted command result for PrepareTraceHandoff.
pub struct TraceHandoffCommandResult {
    /// Member whose trace/audit material was prepared.
    pub member_ref: GlobalMemberRef,

    /// Created or reused handoff intent ref.
    pub handoff_intent_ref: TraceHandoffIntentRef,

    /// Handoff state after preparation. Must be pending for fresh accepted prepare.
    pub handoff_state_kind: HandoffStateKind,

    /// Target marker retained by the intent.
    pub handoff_target_ref: HandoffTargetRef,

    /// Scope marker retained by the intent.
    pub handoff_scope_ref: HandoffScopeRef,

    /// Trace refs retained by the intent.
    pub trace_record_refs: Vec<IdentityTraceRecordRef>,

    /// Optional audit trail retained by the intent.
    pub audit_trail_ref: Option<AuditTrailRef>,

    /// Safe material marker retained by the intent.
    pub safe_material_ref: TraceHandoffSafeMaterialRef,

    /// Accepted command side-effect summary.
    pub effect: IdentityCommandEffectPublicSummary,
}
```

| 响应字段 | 类型 | 字段来源 | 约束 |
|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | request + prepared trace context | 不等于 target identity |
| `handoff_intent_ref` | `TraceHandoffIntentRef` | request/id generator + saved intent | opaque;不得由 target/scope/trace 拼接 |
| `handoff_state_kind` | `HandoffStateKind` | saved `TraceHandoffIntent.handoff_state` | fresh prepare accepted 必须为 `PendingHandoff`;delivered 留 callback/job |
| `handoff_target_ref` / `handoff_scope_ref` | boundary refs | request + target resolution | 不返回 external target path/bucket/secret |
| `trace_record_refs` | `Vec<IdentityTraceRecordRef>` | request + loaded trace selection | 非空;只返回 refs |
| `audit_trail_ref` | `Option<AuditTrailRef>` | request + loaded audit trail | 不返回 audit body |
| `safe_material_ref` | `TraceHandoffSafeMaterialRef` | request / material builder | marker only;不返回 package/body/raw log |
| `effect` | `IdentityCommandEffectPublicSummary` | effect summary assembler | accepted-only |

#### 11.3.4 DTO -> Domain 构造闭环

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `IdentityCommandRequest<PrepareTraceHandoffRequest>` | `HandoffPolicy::for_handoff(...)` | 齐全: target, scope, safe material, trace refs, visibility context | target/scope/safe material 来自 request;trace refs 来自 request + trace repo;visibility context 来自 request/metadata | target/scope 不等于 adapter config path;safe material 不等于 trace body | target unsupported, trace empty, invisible, forbidden body rejected |
| 同上 | `IdentityHandoffTargetPort.resolve_handoff_target(...)` | 齐全: target ref、scope ref、safe material ref | Step 7 target port | target resolution 不等于 delivery;adapter availability 不等于 delivered | target unavailable/unsupported rejected or adapter unavailable surface |
| 同上 | `TraceHandoffIntent::prepare(...)` | 齐全: intent ref、member, trace refs, optional audit, target/scope, safe material, pending state, timestamps | intent ref 来自 request/id generator;pending state/time 来自 clock | created_at 不等于 cursor;pending 不等于 delivered | 缺 trace refs/material/target/scope 时 rejected |
| accepted output | `IdentityCommandEffectSummary` / public effect | 齐全: intent ref、cursor、trace marker/audit/stale/stored refs;`outbox_refs` 明确为空 | UoW / trace/effect builders | handoff trace marker 不等于 external receipt;pending handoff intent 不等于 outbound payload | 缺 effect/cursor surface 时暂停到 Step 9/11 |

#### 11.3.5 错误映射

| 情况 | Protocol surface | 说明 |
|---|---|---|
| trace refs 为空 | `IdentityProtocolRejectionKind::InvalidRequest` | 无 trace 不可 handoff |
| trace / audit ref 不存在或不属于 member | `NotFound` / `PolicyDenied` | 不从 subject 字符串推断关联 |
| target / scope unsupported | `Disabled` / `PolicyDenied` 或 Step 12 指定 surface | 不拼 fallback target |
| target resolver unavailable | `AdapterUnavailable` + degraded marker 或 Step 12 指定 surface | prepare 不执行 delivery |
| safe material marker 缺失或 forbidden body | `ForbiddenBody` | 不保存 trace body、audit raw log、archive package 或 receipt body |
| visibility 不允许 handoff | `PolicyDenied` | 不通过 handoff 泄露不可见字段 |
| same idempotency key + different digest | `DuplicateConflict` | Step 13 固化 |
| repository / transaction failure | `ApplicationError` | 不伪造成 rejected command |

#### 11.3.6 幂等与审计要求

- 必须使用 8.1 `IdentityCommandMetadata.idempotency_key` 和 `IdentityRequestDigestMarker`。
- accepted path 必须 stored accepted result,duplicate replay 不重新创建 handoff intent。
- accepted path 可追加 handoff preparation trace marker,但不得追加 delivery receipt marker。
- accepted path 不创建 outbox record,`IdentityCommandEffectPublicSummary.outbox_refs = []`;Step 8 当前十条 canonical outbound event 没有 `TraceHandoffIntentPrepared` payload,不得复用 `MemoryArchiveHandoffStateChangedPayload` 或由实现私造第十一条 event。
- accepted response 只能返回 refs/markers;不能返回 trace body、audit body、archive package、adapter raw response、target secret 或 receipt body。
- `PrepareTraceHandoff` 不得调用 `IdentityHandoffDeliveryPort.deliver_handoff(...)`;delivery job/callback DTO 留 8.4/8.6 和 Step 9。

### 11.4 本批 DTO 构造闭环汇总

| Command | DTO 字段是否能构造目标对象 | Step 6 对象回指 | Step 7 port 回指 | 仍需后续 Step 闭口 |
|---|---|---|---|---|
| `PrepareTraceHandoff` | 通过,但 target unavailable / visibility denied / material forbidden 分支留 Step 9/12 | `TraceHandoffIntent`, `HandoffState`, `HandoffPolicy` | trace repo、audit repo、handoff intent repo、handoff target port、id/clock/UoW/result/effect/trace ports | Step 9 prepare flow;Step 10 handoff state matrix;Step 12 target/material/visibility rejection;Step 14 target config binding |

### 11.5 8.2-c 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只覆盖 handoff command | 通过 | 未展开 query、callback、outbound event、delivery job 或 retry job |
| 是否沿用 8.1 shared envelope/result | 通过 | 使用 `IdentityCommandRequest<T>` 和 `IdentityCommandOutcome<T>` |
| DTO 字段是否有 Step 6/7 来源 | 通过 | request/result 字段均回指 Step 6 intent/state/policy/marker 和 Step 7 repository/target/id/clock surface |
| 是否避免伪 delivered | 通过 | prepare 只创建 `PendingHandoff`;delivered 必须等待 formal receipt marker |
| 是否排除外部正文和秘密 | 通过 | trace body、audit raw log、archive package、receipt body、target secret、adapter raw response 均不进入 DTO |
| 是否新增 port/state/object | 未新增 | 只引用 Step 6/7 已定义对象、marker、repository 和 target port |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一步 | 8.3-a | 用户审核通过后进入 core truth query DTOs |

### 11.6 8.2-c 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| prepare 语义 | `PrepareTraceHandoff` 只保存 pending intent | prepare 里直接调用 adapter 并标 delivered |
| trace refs | request 明确非空 `trace_record_refs` | 无 trace 时创建空 handoff intent |
| target/scope | 使用 `HandoffTargetRef` / `HandoffScopeRef` 和 target port resolution | DTO 暴露 bucket、path、tenant、raw endpoint 或 secret |
| safe material | 使用 `TraceHandoffSafeMaterialRef` | DTO 携带 trace body、audit raw log、archive package |
| receipt | prepare result 不返回 receipt;delivered 必须由 callback/job formal receipt marker | HTTP 2xx、request sent 或 job log success 当 `HandoffReceiptRef` |
| visibility | handoff 前必须有 visibility context / policy input | 通过 handoff 泄露 not-visible trace/audit 字段 |
| command effect | accepted response 返回 effect refs | response 内返回 archive package、receipt body 或 adapter response |

---

## 12. 8.3-a core truth query DTOs

### 12.1 本批目标与边界

本批只定义五条 core truth query:

- `GetGlobalMemberAnchor`
- `GetGlobalLifecycleSummary`
- `GetRoleCapabilitySummary`
- `ListCareerRecords`
- `ListMemoryReferences`

它们必须沿用 8.1 的 `IdentityQueryRequest<T>`、`IdentityQueryResponse<T>`、`IdentityPageResponse<T>`、`IdentityQuerySurface`、`IdentityPublicPageRequest` 和 `IdentityPublicPageInfo`。本批不定义 `ReadMemberSummary`、trace、audit、projection/reference/report/outbox/handoff query,不定义 HTTP status、query cache、projection rebuild、function flow transaction order、field-level redaction matrix 或 Step 13 duplicate replay。

本批固定五条 query 的共同规则:

- query 只读,不得创建 `GlobalMember`、不得创建 lifecycle / summary / career / memory truth、不得刷新外部 source、不得 rebuild projection、不得 mark fresh、不得 append trace/audit/outbox。
- read subject、visibility scope 和 access summary 只能来自 Step 7 `IdentityReadVisibilityRepository.resolve_member_summary_read(...)`。service 不得从 route string、member id、view id、safe summary token 或 source ref 字符串推断。
- stable member summary view ref 只能来自 Step 7 `IdentityProjectionRepository.find_member_summary_view_ref(member_ref, visibility_scope_ref)`。query 不得拼 `member-summary:<id>`。
- list query 必须使用 envelope 的 `IdentityQueryRequest.page = Some(IdentityPublicPageRequest { cursor, limit })`;page cursor 只映射 repository page,不得当 truth cursor、projection cursor、job cursor、source version 或 idempotency key。
- `IdentityQueryMetadata.visibility_context_ref` 是 visibility context 的正式来源;本批 request body 不重复携带该字段。
- 本批 request body 显式携带 `ConsumerRef`,作为 Step 7 visibility repository 的 `consumer_ref` 输入。它只是读取方 boundary marker,不保存 consumer 私有权限状态。
- HLD 中的 optional `ConsistencyHintRef`、`CareerRecordFilterRef`、`MemoryReferenceFilterRef` 当前没有 Step 6/7 正式 schema/port 来源;本批不新增这些字段,只在待确认事项中保留承接缺口。

### 12.2 Query batch table

| Query | Request DTO | Response DTO | 读取对象 / view | 依赖 Step 7 port | 后续 flow |
|---|---|---|---|---|---|
| `GetGlobalMemberAnchor` | `GetGlobalMemberAnchorRequest` | `IdentityQueryResponse<GlobalMemberAnchorView>` | `GlobalMember`, `IdentityAnchorState`, optional `MemberSummaryView` anchor slice | `IdentityReadVisibilityRepository`, `IdentityProjectionRepository`, `GlobalMemberRepository` | `GetGlobalMemberAnchorFlow` |
| `GetGlobalLifecycleSummary` | `GetGlobalLifecycleSummaryRequest` | `IdentityQueryResponse<GlobalLifecycleSummaryView>` | `GlobalLifecycleState`, optional `MemberSummaryView` lifecycle slice | `IdentityReadVisibilityRepository`, `IdentityProjectionRepository`, `GlobalMemberRepository`, `GlobalLifecycleRepository` | `GetGlobalLifecycleSummaryFlow` |
| `GetRoleCapabilitySummary` | `GetRoleCapabilitySummaryRequest` | `IdentityQueryResponse<RoleCapabilitySummaryView>` | `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, optional `MemberSummaryView` role slice | `IdentityReadVisibilityRepository`, `IdentityProjectionRepository`, `GlobalMemberRepository`, `RoleCapabilityRepository` | `GetRoleCapabilitySummaryFlow` |
| `ListCareerRecords` | `ListCareerRecordsRequest` | `IdentityPageResponse<CareerRecordView>` | `CareerRecord`, optional `MemberSummaryView` career slice | `IdentityReadVisibilityRepository`, `IdentityProjectionRepository`, `GlobalMemberRepository`, `CareerRecordRepository` | `ListCareerRecordsFlow` |
| `ListMemoryReferences` | `ListMemoryReferencesRequest` | `IdentityPageResponse<MemoryReferenceView>` | `MemoryReference`, `MemoryReferenceState`, optional `MemberSummaryView` memory slice | `IdentityReadVisibilityRepository`, `IdentityProjectionRepository`, `GlobalMemberRepository`, `MemoryReferenceRepository` | `ListMemoryReferencesFlow` |

### 12.3 Shared query visibility / projection construction

All five queries use the same construction order. Step 9 may expand this into precise flow steps, but it may not change these field sources without returning to Step 6/7/8.

| 阶段 | 输入 | 正式来源 | 输出 | 禁止事项 |
|---|---|---|---|---|
| entry envelope | `IdentityQueryRequest<T>` | API / SDK query handler | `actor_ref`, `query_name`, `metadata.visibility_context_ref`, optional page, body | handler 不从 body 推 actor;query 不使用 command idempotency |
| read access seed | body `member_ref`, body `consumer_ref`, metadata `visibility_context_ref` | request body + 8.1 query metadata | `resolve_member_summary_read(member_ref, None, consumer_ref, visibility_context_ref)` | 不从 route/member id 拼 `IdentityReadSubjectRef` 或 `VisibilityScopeRef` |
| visibility summary | `IdentityReadVisibilityRepository` | Step 7 formal read visibility repository | `IdentityVisibilityAccessSummary` with `scope_ref`, `visibility_result_ref`, access state | repository 返回 `None` 时只能 degraded / unavailable surface,不得默认 visible |
| stable view lookup | `member_ref`, `access_summary.scope_ref` | `IdentityProjectionRepository.find_member_summary_view_ref(...)` | optional `MemberSummaryViewRef` | 不拼 view ref;lookup missing 不触发 rebuild |
| optional loaded view | `MemberSummaryViewRef` | `IdentityProjectionRepository.get_member_summary_view(...)` | optional `MemberSummaryView` | missing / stale / degraded 显式返回 surface |
| view-specific visibility | optional `view_ref` | `resolve_member_summary_read(member_ref, Some(view_ref), consumer_ref, visibility_context_ref)` when needed | final access summary / decision marker | 不用 loaded view 自行推 scope 或权限 |
| query body assembly | loaded truth + optional view slices | corresponding truth repository and loaded `MemberSummaryView` | typed view DTO or page items | 不保存/返回 external body,不修复 missing truth |
| public surface | access state + found/empty/stale/degraded inputs | `VisibilityPolicy` / `IdentityVisibilityDecision` / query assembler | `IdentityQuerySurface` | `NotVisible` 不伪装 `Missing`;`Empty` 不用于隐藏不可见 |

`IdentityQuerySurface` disposition for this batch:

| 情况 | disposition | body / items | 必填 surface marker | 说明 |
|---|---|---|---|---|
| visible and found | `Visible` | single body `Some(view)`;page items 可非空 | `visibility`, optional `decision_ref` | view 只含 refs/state/safe markers |
| visible but redacted | `Redacted` | body/items 只保留允许字段;敏感 marker 用 `None` | `visibility`, `decision_ref` | 字段级矩阵留 Step 12;不得返回 forbidden body |
| not visible | `NotVisible` | single body `None`;page items empty | `visibility`, `decision_ref` | 不泄露 found/missing 差异的内部原因正文 |
| visibility dependency missing/unavailable | `Degraded` | body 可空;items empty 或 safe partial | `degraded` | 不默认 visible,不创建 decision |
| loaded view/projection stale but allowed | `StaleVisible` | 可返回 stale safe refs | `projection_freshness_ref` 或 `degraded` | query 不 rebuild、不 mark fresh |
| list has no records | `Empty` | items empty,page_info item_count 0 | `visibility` | 真实空集合,不是 not visible |
| member/truth/projection lookup missing | `Missing` | body `None`;items empty | `visibility` if available | 缺 truth / view 不触发 create/rebuild |
| projection rebuilding / disabled | `Rebuilding` / `Disabled` | body `None`;items empty | `degraded` | 本批只保留 surface;具体来源 Step 9/12 |

### 12.4 `GetGlobalMemberAnchor` protocol

#### 12.4.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_query(IdentityQueryRequest<GetGlobalMemberAnchorRequest>) -> Result<IdentityQueryResponse<GlobalMemberAnchorView>, ApplicationError>` |
| HTTP / RPC 名称 | API query dispatch route for `GetGlobalMemberAnchor`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / trusted read caller |
| 处理方 | `identity-application` query service through `IdentityApplicationFacade::dispatch_query` |

#### 12.4.2 请求 schema

```rust
/// Request body for reading the platform-level anchor state of a global member.
pub struct GetGlobalMemberAnchorRequest {
    /// Member whose anchor state is being read.
    pub member_ref: GlobalMemberRef,

    /// Boundary consumer requesting the anchor material.
    pub consumer_ref: ConsumerRef,
}
```

| 输入字段 | 类型 | 目标读取 / visibility 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | member repository key, read visibility subject seed, optional projection lookup | request body / route binding | 必填;缺失是 entry validation failure;not found 返回 `Missing` |
| `consumer_ref` | `ConsumerRef` | `IdentityReadVisibilityRepository.resolve_member_summary_read(...)` | request body / API consumer context | 必填;缺失时不能推断 consumer,返回 entry validation failure或 degraded surface |
| `visibility_context_ref` | `VisibilityContextRef` | visibility context | `IdentityQueryMetadata.visibility_context_ref` | 必填;不从 body 或 actor 推断 |

#### 12.4.3 响应 view schema

```rust
/// Public view for a member anchor read.
pub struct GlobalMemberAnchorView {
    /// Member represented by this anchor view.
    pub member_ref: GlobalMemberRef,

    /// Current anchor state kind.
    pub anchor_state_kind: IdentityAnchorStateKind,

    /// Optional body-free reason marker associated with the anchor state.
    pub anchor_reason_ref: Option<IdentityAnchorReasonRef>,

    /// Last anchor state change time.
    pub anchor_changed_at: IdentityTimestamp,

    /// Optional body-free source marker. Redaction may omit this field.
    pub source_ref: Option<IdentitySourceRef>,

    /// Stable summary view ref when projection lookup succeeded.
    pub member_summary_view_ref: Option<MemberSummaryViewRef>,

    /// Anchor safe summary slice when loaded from a projection.
    pub anchor_slice_ref: Option<MemberSummarySliceRef>,
}
```

| 响应字段 | 字段来源 | 约束 |
|---|---|---|
| `member_ref` | request + loaded `GlobalMember` | 不等于 actor/account/runtime/ProjectMember ref |
| `anchor_state_kind` / `anchor_reason_ref` / `anchor_changed_at` | `GlobalMember.anchor_state` | state kind 可返回;reason 为 body-free marker且可 redacted |
| `source_ref` | `GlobalMember.source_ref` | optional,只返回 body-free source marker;不返回 source body |
| `member_summary_view_ref` | Step 7 projection lookup | optional;不得拼接 |
| `anchor_slice_ref` | loaded `MemberSummaryView.anchor_slice_ref` | optional;不保存 account/runtime body |

#### 12.4.4 DTO -> repository / visibility 构造闭环

| 输入契约 | 目标读取 / assembler | 必填字段是否齐全 | 派生字段来源 | 缺失时行为 |
|---|---|---|---|---|
| `IdentityQueryRequest<GetGlobalMemberAnchorRequest>` | visibility seed | 齐全: member, consumer, visibility context, actor | visibility context 来自 metadata;actor 只进入 context/observability | visibility summary missing -> `Degraded`,不默认 visible |
| same | `IdentityProjectionRepository.find_member_summary_view_ref(...)` | 齐全: member, scope | scope 来自 `IdentityVisibilityAccessSummary.scope_ref` | lookup missing -> view/slice `None` 或 `Missing` surface,不 rebuild |
| same | `GlobalMemberRepository.get_member_with_version(...)` / `get_anchor_state(...)` | 齐全: member ref | repository read | missing -> `Missing`,不调用 establish |
| output | `IdentityQueryResponse<GlobalMemberAnchorView>` | 齐全: query name、surface、optional body | surface 来自 visibility + found/stale/degraded classification | not visible -> body `None`;redacted -> safe optional fields omitted |

### 12.5 `GetGlobalLifecycleSummary` protocol

#### 12.5.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_query(IdentityQueryRequest<GetGlobalLifecycleSummaryRequest>) -> Result<IdentityQueryResponse<GlobalLifecycleSummaryView>, ApplicationError>` |
| HTTP / RPC 名称 | API query dispatch route for `GetGlobalLifecycleSummary`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / trusted read caller |
| 处理方 | `identity-application` query service through `IdentityApplicationFacade::dispatch_query` |

#### 12.5.2 请求 schema

```rust
/// Request body for reading a member global lifecycle summary.
pub struct GetGlobalLifecycleSummaryRequest {
    /// Member whose lifecycle state is being read.
    pub member_ref: GlobalMemberRef,

    /// Boundary consumer requesting lifecycle material.
    pub consumer_ref: ConsumerRef,
}
```

| 输入字段 | 类型 | 目标读取 / visibility 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | member existence read, lifecycle repository key, visibility seed | request body / route binding | 必填;member missing -> `Missing`,不创建 |
| `consumer_ref` | `ConsumerRef` | read visibility repository | request body / API consumer context | 必填;不得由 actor 或 route 推断 |
| `visibility_context_ref` | `VisibilityContextRef` | visibility context | `IdentityQueryMetadata.visibility_context_ref` | 必填 |

#### 12.5.3 响应 view schema

```rust
/// Public view for a member global lifecycle read.
pub struct GlobalLifecycleSummaryView {
    /// Member represented by this lifecycle view.
    pub member_ref: GlobalMemberRef,

    /// Current global lifecycle state kind.
    pub lifecycle_state_kind: GlobalLifecycleStateKind,

    /// Optional body-free lifecycle reason marker. Redaction may omit it.
    pub reason_ref: Option<LifecycleReasonRef>,

    /// Optional body-free governance basis marker. Redaction may omit it.
    pub basis_ref: Option<GovernanceBasisRef>,

    /// Actor that last changed lifecycle, when visible.
    pub changed_by_ref: Option<ActorRef>,

    /// Last lifecycle change time.
    pub changed_at: IdentityTimestamp,

    /// Stable summary view ref when projection lookup succeeded.
    pub member_summary_view_ref: Option<MemberSummaryViewRef>,

    /// Lifecycle safe summary slice when loaded from a projection.
    pub lifecycle_slice_ref: Option<MemberSummarySliceRef>,
}
```

| 响应字段 | 字段来源 | 约束 |
|---|---|---|
| `member_ref` | request + loaded member / lifecycle key | 不等于 runtime availability subject |
| `lifecycle_state_kind` | loaded `GlobalLifecycleState.state_kind` | 不表达 runtime health 或 ProjectMember state |
| `reason_ref` / `basis_ref` | loaded lifecycle truth | body-free;governance basis body 不进入 view |
| `changed_by_ref` / `changed_at` | loaded lifecycle truth | actor 可 redacted;time 不等于 cursor/version |
| `member_summary_view_ref` | Step 7 projection lookup | optional;不得拼接 |
| `lifecycle_slice_ref` | loaded `MemberSummaryView.lifecycle_slice_ref` | optional;不保存 governance basis body |

#### 12.5.4 DTO -> repository / visibility 构造闭环

| 输入契约 | 目标读取 / assembler | 必填字段是否齐全 | 派生字段来源 | 缺失时行为 |
|---|---|---|---|---|
| `IdentityQueryRequest<GetGlobalLifecycleSummaryRequest>` | visibility seed and scope | 齐全: member, consumer, visibility context | `resolve_member_summary_read(member_ref, None, ...)` | not visible -> body `None`;summary missing -> `Degraded` |
| same | `GlobalMemberRepository.get_member_with_version(...)` | 齐全: member ref | member repository | member missing -> `Missing`;不建档 |
| same | `GlobalLifecycleRepository.get_lifecycle_with_version(member_ref)` | 齐全: member ref | lifecycle repository | lifecycle missing -> `Missing` / degraded surface,不补 initial lifecycle |
| same | projection lookup/read | 齐全: member + scope | scope from visibility summary | view missing/stale -> optional slice omitted or stale/degraded surface |
| output | `IdentityQueryResponse<GlobalLifecycleSummaryView>` | 齐全: query name、surface、optional body | surface from visibility + loaded truth/projection classification | basis/body details redacted by surface |

### 12.6 `GetRoleCapabilitySummary` protocol

#### 12.6.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_query(IdentityQueryRequest<GetRoleCapabilitySummaryRequest>) -> Result<IdentityQueryResponse<RoleCapabilitySummaryView>, ApplicationError>` |
| HTTP / RPC 名称 | API query dispatch route for `GetRoleCapabilitySummary`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / trusted read caller |
| 处理方 | `identity-application` query service through `IdentityApplicationFacade::dispatch_query` |

#### 12.6.2 请求 schema

```rust
/// Request body for reading a member role/capability summary.
pub struct GetRoleCapabilitySummaryRequest {
    /// Member whose role/capability summary is being read.
    pub member_ref: GlobalMemberRef,

    /// Boundary consumer requesting role/capability material.
    pub consumer_ref: ConsumerRef,

    /// Optional explicit summary ref. When absent, the current member summary is read.
    pub summary_ref: Option<RoleCapabilitySummaryRef>,
}
```

| 输入字段 | 类型 | 目标读取 / visibility 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | member guard, current summary lookup, visibility seed | request body / route binding | 必填;member missing -> `Missing` |
| `consumer_ref` | `ConsumerRef` | read visibility repository | request body / API consumer context | 必填 |
| `summary_ref` | `Option<RoleCapabilitySummaryRef>` | explicit summary read | request body | 缺失时 use `RoleCapabilityRepository.find_current_summary_by_member(member_ref)` |
| `visibility_context_ref` | `VisibilityContextRef` | visibility context | `IdentityQueryMetadata.visibility_context_ref` | 必填 |

#### 12.6.3 响应 view schema

```rust
/// Public view for a member role/capability summary read.
pub struct RoleCapabilitySummaryView {
    /// Member represented by this summary.
    pub member_ref: GlobalMemberRef,

    /// Identity-owned summary ref.
    pub summary_ref: RoleCapabilitySummaryRef,

    /// Summary state kind.
    pub summary_state_kind: RoleCapabilitySummaryStateKind,

    /// Source snapshot used by the summary.
    pub source_snapshot_ref: RoleCapabilitySourceSnapshotRef,

    /// Source state, when the snapshot was loaded.
    pub source_state_kind: Option<RoleCapabilitySourceStateKind>,

    /// Optional role source wrapper, redacted when not allowed.
    pub role_source_ref: Option<RoleSourceRef>,

    /// Capability source wrappers allowed by visibility.
    pub capability_source_refs: Vec<CapabilitySourceRef>,

    /// Evidence refs allowed by visibility.
    pub evidence_refs: Vec<CapabilityEvidenceRef>,

    /// Body-free safe summary marker.
    pub safe_summary_ref: Option<RoleCapabilitySafeSummaryRef>,

    /// Stable summary view ref when projection lookup succeeded.
    pub member_summary_view_ref: Option<MemberSummaryViewRef>,

    /// Role/capability safe summary slices from projection.
    pub role_capability_slice_refs: Vec<MemberSummarySliceRef>,
}
```

| 响应字段 | 字段来源 | 约束 |
|---|---|---|
| `summary_ref`, `summary_state_kind`, `source_snapshot_ref` | loaded `RoleCapabilitySummary` | summary ref opaque;state stale/unavailable/pending 不伪装 active |
| `source_state_kind` | loaded `RoleCapabilitySourceSnapshot.source_state` | optional;source snapshot missing may return degraded |
| `role_source_ref` / `capability_source_refs` | loaded summary | body-free;不保存 RoleDefinition / CapabilityDefinition body |
| `evidence_refs` | loaded summary / snapshot | body-free;不保存 evidence body |
| `safe_summary_ref` | loaded summary / snapshot | marker only;不保存 summary body |
| `member_summary_view_ref` / `role_capability_slice_refs` | Step 7 projection lookup + loaded `MemberSummaryView` | optional;view ref 不拼接 |

#### 12.6.4 DTO -> repository / visibility 构造闭环

| 输入契约 | 目标读取 / assembler | 必填字段是否齐全 | 派生字段来源 | 缺失时行为 |
|---|---|---|---|---|
| `IdentityQueryRequest<GetRoleCapabilitySummaryRequest>` | visibility seed and scope | 齐全: member, consumer, visibility context | Step 7 visibility repository | not visible -> body `None`;visibility missing -> `Degraded` |
| same | `GlobalMemberRepository.get_member_with_version(member_ref)` | 齐全 | member repository | missing -> `Missing`,不创建 member |
| same | `RoleCapabilityRepository.get_summary_with_version(summary_ref)` or `find_current_summary_by_member(member_ref)` | explicit summary 或 current summary lookup | request optional summary ref / member ref | summary missing -> `Missing`;不创建 / 不刷新 source |
| same | `RoleCapabilityRepository.get_source_snapshot_with_version(source_snapshot_ref)` | source snapshot ref from summary | role repository | snapshot missing/unavailable -> degraded or stale visible surface |
| same | projection lookup/read | member + visibility scope | Step 7 projection repository | missing view -> optional slices empty;不 rebuild |
| output | `IdentityQueryResponse<RoleCapabilitySummaryView>` | query name、surface、optional body | visibility + summary/source state classification | stale/unavailable states are explicit,not hidden |

### 12.7 `ListCareerRecords` protocol

#### 12.7.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_query(IdentityQueryRequest<ListCareerRecordsRequest>) -> Result<IdentityPageResponse<CareerRecordView>, ApplicationError>` |
| HTTP / RPC 名称 | API query dispatch route for `ListCareerRecords`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / trusted read caller |
| 处理方 | `identity-application` query service through `IdentityApplicationFacade::dispatch_query` |

#### 12.7.2 请求 schema

```rust
/// Request body for listing append-only career records of a member.
pub struct ListCareerRecordsRequest {
    /// Member whose career records are being listed.
    pub member_ref: GlobalMemberRef,

    /// Boundary consumer requesting career material.
    pub consumer_ref: ConsumerRef,
}
```

| 输入字段 | 类型 | 目标读取 / visibility 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | member guard, career repository list key, visibility seed | request body / route binding | 必填;member missing -> `Missing` |
| `consumer_ref` | `ConsumerRef` | read visibility repository | request body / API consumer context | 必填 |
| `page` | `Option<IdentityPublicPageRequest>` | repository page | 8.1 query envelope | list query 必须为 `Some`;cursor 可空;limit 必须合法 |
| `visibility_context_ref` | `VisibilityContextRef` | visibility context | `IdentityQueryMetadata.visibility_context_ref` | 必填 |

本批不定义 `CareerRecordFilterRef`。在 Step 6/7 正式定义 filter ref、filter semantics 和 repository read surface 前,`ListCareerRecords` 只支持 member-scoped paged list。

#### 12.7.3 响应 item view schema

```rust
/// Public view for one append-only career record.
pub struct CareerRecordView {
    /// Career record ref.
    pub career_record_ref: CareerRecordRef,

    /// Member whose career history owns this record.
    pub member_ref: GlobalMemberRef,

    /// Career record state kind.
    pub record_state_kind: CareerRecordStateKind,

    /// Work-owned participation source, when visible.
    pub project_participation_ref: Option<ProjectParticipationRef>,

    /// Work source marker, when visible.
    pub work_source_ref: Option<WorkSourceRef>,

    /// Duplicate source marker, when visible.
    pub source_marker_ref: Option<CareerSourceMarkerRef>,

    /// Redaction-safe career summary marker.
    pub career_summary_ref: Option<CareerSafeSummaryRef>,

    /// Body-free append reason marker, when visible.
    pub append_reason_ref: Option<CareerAppendReasonRef>,

    /// Append time, when visible.
    pub appended_at: Option<IdentityTimestamp>,

    /// Original record explained by this correction.
    pub correction_of_ref: Option<CareerRecordRef>,

    /// Correction record that supersedes this record in interpretation.
    pub superseded_by_ref: Option<CareerRecordRef>,
}
```

| 响应字段 | 字段来源 | 约束 |
|---|---|---|
| `career_record_ref`, `member_ref`, `record_state_kind` | loaded `CareerRecord` | duplicate/rejected/empty/not visible 不是 record state |
| `project_participation_ref` / `work_source_ref` / `source_marker_ref` | loaded `CareerRecord` | optional for redaction;不保存 Project / WorkItem / ProjectMember body |
| `career_summary_ref` | loaded `CareerRecord.career_summary_ref` | marker only |
| `append_reason_ref` / `appended_at` | loaded record | optional for redaction;timestamp 不等于 cursor |
| `correction_of_ref` / `superseded_by_ref` | loaded record correction fields | correction 是追加解释,不是 in-place update |

#### 12.7.4 DTO -> repository / visibility 构造闭环

| 输入契约 | 目标读取 / assembler | 必填字段是否齐全 | 派生字段来源 | 缺失时行为 |
|---|---|---|---|---|
| `IdentityQueryRequest<ListCareerRecordsRequest>` | visibility seed and scope | 齐全: member, consumer, visibility context | Step 7 visibility repository | not visible -> empty items with `NotVisible`,不是 `Empty` |
| same | repository page | `IdentityPublicPageRequest` required | envelope `page` maps to `IdentityRepositoryPage` | missing/invalid page -> entry validation failure;不使用 truth cursor |
| same | `GlobalMemberRepository.get_member_with_version(member_ref)` | 齐全 | member repository | missing -> `Missing`,不创建 member |
| same | `CareerRecordRepository.list_records_by_member(member_ref, page)` | 齐全 | career repository | no items -> `Empty` |
| page item refs | `CareerRecordRepository.get_career_record(record_ref)` | record refs from repository page | career repository | missing item -> degraded partial surface;不修复 |
| output | `IdentityPageResponse<CareerRecordView>` | query name、surface、page_info、items | Step 8 page mapping | page cursor 不改变 career order 或 state |

### 12.8 `ListMemoryReferences` protocol

#### 12.8.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_query(IdentityQueryRequest<ListMemoryReferencesRequest>) -> Result<IdentityPageResponse<MemoryReferenceView>, ApplicationError>` |
| HTTP / RPC 名称 | API query dispatch route for `ListMemoryReferences`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / trusted read caller |
| 处理方 | `identity-application` query service through `IdentityApplicationFacade::dispatch_query` |

#### 12.8.2 请求 schema

```rust
/// Request body for listing memory/archive references of a member.
pub struct ListMemoryReferencesRequest {
    /// Member whose memory references are being listed.
    pub member_ref: GlobalMemberRef,

    /// Boundary consumer requesting memory reference material.
    pub consumer_ref: ConsumerRef,
}
```

| 输入字段 | 类型 | 目标读取 / visibility 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | member guard, memory repository list key, visibility seed | request body / route binding | 必填;member missing -> `Missing` |
| `consumer_ref` | `ConsumerRef` | read visibility repository | request body / API consumer context | 必填 |
| `page` | `Option<IdentityPublicPageRequest>` | repository page | 8.1 query envelope | list query 必须为 `Some`;cursor 可空;limit 必须合法 |
| `visibility_context_ref` | `VisibilityContextRef` | visibility context | `IdentityQueryMetadata.visibility_context_ref` | 必填 |

本批不定义 `MemoryReferenceFilterRef`。在 Step 6/7 正式定义 filter ref、filter semantics 和 repository read surface 前,`ListMemoryReferences` 只支持 member-scoped paged list。

#### 12.8.3 响应 item view schema

```rust
/// Public view for one Identity memory/archive reference relation.
pub struct MemoryReferenceView {
    /// Memory reference relation ref.
    pub memory_reference_ref: MemoryReferenceRef,

    /// Member whose relation owns this reference.
    pub member_ref: GlobalMemberRef,

    /// Current relation state kind.
    pub reference_state_kind: MemoryReferenceStateKind,

    /// External memory carrier ref, when visible.
    pub memory_ref: Option<MemoryRef>,

    /// External archive carrier ref, when visible.
    pub archive_ref: Option<ArchiveRef>,

    /// Archive handoff marker, when visible.
    pub archive_handoff_ref: Option<ArchiveHandoffRef>,

    /// Source marker for the relation state, when visible.
    pub source_ref: Option<MemoryReferenceSourceRef>,

    /// Redaction-safe memory/archive summary marker.
    pub safe_summary_ref: Option<MemorySafeSummaryRef>,

    /// Body-free change reason marker, when visible.
    pub reason_ref: Option<MemoryReferenceReasonRef>,

    /// Last relation change/check time, when visible.
    pub changed_at: Option<IdentityTimestamp>,
}
```

| 响应字段 | 字段来源 | 约束 |
|---|---|---|
| `memory_reference_ref`, `member_ref`, `reference_state_kind` | loaded `MemoryReference` / `MemoryReferenceState` | state 不等于 trace handoff delivery state |
| `memory_ref` / `archive_ref` / `archive_handoff_ref` | loaded relation/state | optional for redaction;不保存 memory body、embedding、archive package 或 receipt body |
| `source_ref` | loaded `MemoryReference.source_ref` | marker only |
| `safe_summary_ref` | loaded relation | summary body 不入 DTO |
| `reason_ref` / `changed_at` | loaded relation | optional for redaction;time 不等于 cursor/version |

#### 12.8.4 DTO -> repository / visibility 构造闭环

| 输入契约 | 目标读取 / assembler | 必填字段是否齐全 | 派生字段来源 | 缺失时行为 |
|---|---|---|---|---|
| `IdentityQueryRequest<ListMemoryReferencesRequest>` | visibility seed and scope | 齐全: member, consumer, visibility context | Step 7 visibility repository | not visible -> empty items with `NotVisible`,不是 `Empty` |
| same | repository page | `IdentityPublicPageRequest` required | envelope `page` maps to `IdentityRepositoryPage` | missing/invalid page -> entry validation failure |
| same | `GlobalMemberRepository.get_member_with_version(member_ref)` | 齐全 | member repository | missing -> `Missing`,不创建 member |
| same | `MemoryReferenceRepository.list_references_by_member(member_ref, page)` | 齐全 | memory repository | no items -> `Empty` |
| page item refs | `MemoryReferenceRepository.get_memory_reference_with_version(reference_ref)` | refs from repository page | memory repository | missing item -> degraded partial surface;不修复 |
| output | `IdentityPageResponse<MemoryReferenceView>` | query name、surface、page_info、items | Step 8 page mapping | page cursor 不改变 relation state |

### 12.9 本批 DTO 构造闭环汇总

| Query | DTO 字段是否能构造读取 / visibility 输入 | Step 6 对象回指 | Step 7 port 回指 | 仍需后续 Step 闭口 |
|---|---|---|---|---|
| `GetGlobalMemberAnchor` | 通过 | `GlobalMember`, `IdentityAnchorState`, `MemberSummaryView`, `VisibilityPolicy` | read visibility repo、projection repo、member repo | Step 9 exact query order;Step 12 redaction/not visible status |
| `GetGlobalLifecycleSummary` | 通过 | `GlobalLifecycleState`, `MemberSummaryView`, `VisibilityPolicy` | read visibility repo、projection repo、member/lifecycle repo | lifecycle missing/degraded public mapping;basis redaction matrix |
| `GetRoleCapabilitySummary` | 通过 | `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, `MemberSummaryView`, `VisibilityPolicy` | read visibility repo、projection repo、member/role repo | source snapshot missing/stale mapping;field redaction matrix |
| `ListCareerRecords` | 通过,但 filter 暂不定义 | `CareerRecord`, `MemberSummaryView`, `VisibilityPolicy` | read visibility repo、projection repo、member/career repo | optional filter ref and source-marker list semantics;partial item degraded mapping |
| `ListMemoryReferences` | 通过,但 filter 暂不定义 | `MemoryReference`, `MemoryReferenceState`, `MemberSummaryView`, `VisibilityPolicy` | read visibility repo、projection repo、member/memory repo | optional filter ref semantics;partial item degraded mapping |

### 12.10 8.3-a 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只覆盖 core truth query | 通过 | 未展开 member summary、trace、audit、maintenance/outbox/handoff query |
| 是否沿用 8.1 shared query envelope/page/surface | 通过 | 单对象 query 使用 `IdentityQueryResponse<T>`;list query 使用 `IdentityPageResponse<T>` |
| DTO 字段是否有 Step 6/7 来源 | 通过 | request/view 字段回指 Step 6 object/view/marker 和 Step 7 read visibility/projection/truth repository |
| read subject/scope 是否正式 | 通过 | scope 来自 `IdentityReadVisibilityRepository.resolve_member_summary_read(...)`;不从 route/member id 推断 |
| stable view ref 是否正式 | 通过 | view ref 只来自 `IdentityProjectionRepository.find_member_summary_view_ref(...)` |
| query no-write 是否保持 | 通过 | not found/empty/stale/degraded 均不创建 truth、不刷新 source、不 rebuild projection |
| 外部正文是否排除 | 通过 | role/work/memory/archive/governance body 均不进入 query DTO |
| 是否新增 port/state/object | 未新增 | 只定义 Step 8 public request/view DTO;未新增 Step 7 port 或 Step 6 truth |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一步 | 8.3-b | 用户审核通过后进入 trace / audit / summary query DTOs |

### 12.11 8.3-a 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| visibility scope | 先用 `resolve_member_summary_read(member_ref, None, consumer_ref, visibility_context_ref)` 取得 `scope_ref` | 从 URL、route name、member id 或 source ref 字符串拼 scope |
| stable view lookup | 用 `find_member_summary_view_ref(member_ref, scope_ref)` 读取 `MemberSummaryViewRef` | `format!("member-summary:{member_id}")` 临时构造 view ref |
| query miss | `GetGlobalMemberAnchor` missing 返回 `Missing` surface | 查询不到 member 时调用 establish 自动建档 |
| list page | `IdentityPublicPageRequest.cursor/limit` 映射 repository page | 把 page cursor 当 truth cursor、projection cursor 或 idempotency key |
| not visible | `IdentityQuerySurface.disposition = NotVisible`,body/items 空 | 返回 `Empty` 或 `Missing` 来隐藏权限结果 |
| stale projection | 返回 `StaleVisible` / `Degraded` marker,不 rebuild | query path 同步 rebuild projection 并 mark fresh |
| role summary | 返回 `RoleCapabilitySummaryRef`、safe summary、source/evidence refs | 返回 RoleDefinition / CapabilityDefinition / evidence body |
| career list | 返回 `CareerRecordView` refs/state/safe marker | 返回 Project、WorkItem、ProjectMember body |
| memory list | 返回 `MemoryReferenceView` refs/state/safe marker | 返回 memory body、embedding、archive package 或 receipt body |
| optional filters | filter ref 未闭合前不放入 DTO | 在 Step 8 私自定义字符串 filter 并让 repo 扫描 body |

---

## 13. 8.3-b trace / audit / summary query DTOs

### 13.1 本批目标与边界

本批只定义三条身份事实消费与追溯 query:

- `ReadMemberSummary`
- `ReadIdentityTrace`
- `ReadAuditTrail`

它们必须沿用 8.1 的 `IdentityQueryRequest<T>`、`IdentityQueryResponse<T>`、`IdentityPageResponse<T>`、`IdentityQuerySurface`、`IdentityPublicPageRequest` 和 `IdentityPublicPageInfo`。本批不定义 projection/reference/report/outbox/handoff query,不定义 trace append / audit append flow,不定义 query cache,不触发 projection rebuild,不定义 HTTP status,不定义完整字段级 redaction matrix,不定义 Step 13 duplicate replay。

本批固定三条 query 的共同规则:

- query 只读,不得创建 member、summary view、trace record、audit trail、projection state、reference state、outbox record 或 handoff intent。
- `ReadMemberSummary` 的 stable `MemberSummaryViewRef` 只能来自 Step 7 `IdentityProjectionRepository.find_member_summary_view_ref(member_ref, visibility_scope_ref)`;query 不得拼接 view ref。
- trace / audit read subject 必须来自 request 中的 typed subject、loaded trace record 或 Step 7 `IdentityTruthChangeSubjectMapper`;不得从 member id、route、source ref、trace ref、audit ref 或字符串前缀推断。
- `ConsumerRef` 显式放在 request body,作为 Step 7 read visibility repository 的 `consumer_ref` 输入;它不保存 consumer 私有权限状态。
- `VisibilityContextRef` 只来自 `IdentityQueryMetadata.visibility_context_ref`;本批 request body 不重复携带。
- `IdentityPublicPageRequest.cursor` 只映射 repository page cursor;`IdentityTruthCursor` 只用于 trace after-cursor selector;`AuditCursorRef` 只用于 audit entry cursor。三者不得互换。
- not visible、empty、missing、stale、degraded 必须通过 `IdentityQuerySurface` 显式表达;不得用 empty 或 missing 掩盖 not visible。
- response DTO 只返回 refs、state kind、safe summary marker、visibility marker、cursor marker 和 body-free reason/source/basis marker;不得返回 raw log、trace body、audit body、external payload body、secret、adapter diagnostic 或 debug body。

### 13.2 Query batch table

| Query | Request DTO | Response DTO | 读取对象 / view | 依赖 Step 7 port/helper | 后续 flow |
|---|---|---|---|---|---|
| `ReadMemberSummary` | `ReadMemberSummaryRequest` | `IdentityQueryResponse<MemberSummaryView>` | `MemberSummaryView`, optional `ProjectionState` marker | `IdentityReadVisibilityRepository`, `IdentityProjectionRepository` | `ReadMemberSummaryFlow` |
| `ReadIdentityTrace` | `ReadIdentityTraceRequest` | `IdentityPageResponse<IdentityTraceRecordView>` | `IdentityTraceRecord` append-only history | `IdentityTraceRecordRepository`, `IdentityReadVisibilityRepository` | `ReadIdentityTraceFlow` |
| `ReadAuditTrail` | `ReadAuditTrailRequest` | `IdentityPageResponse<AuditTrailEntryView>` | member canonical `AuditTrail`, `AuditTrailEntry`, trace refs | `IdentityTruthChangeSubjectMapper`, `IdentityAuditTrailRepository`, `IdentityReadVisibilityRepository` | `ReadAuditTrailFlow` |

### 13.3 Shared read visibility / redaction construction

| 阶段 | 输入 | 正式来源 | 输出 | 禁止事项 |
|---|---|---|---|---|
| entry envelope | `IdentityQueryRequest<T>` | API / SDK query handler | `actor_ref`, `query_name`, `metadata.visibility_context_ref`, optional page, body | handler 不从 body 推 actor;query 不使用 command idempotency |
| consumer marker | body `consumer_ref` | request body / API consumer context | visibility repository `consumer_ref` | 不保存 consumer 私有权限体 |
| summary read seed | `member_ref`, optional `view_ref`, `consumer_ref`, `visibility_context_ref` | request body + projection lookup + query metadata | `resolve_member_summary_read(...)` | 不从 member id 或 view id 拼 scope |
| trace read seed | `IdentityTraceSubjectRef`, `consumer_ref`, `visibility_context_ref` | request selector 或 loaded trace record | `resolve_trace_read(...)` | 不把 audit subject / outbox subject 强转成 trace subject |
| audit read seed | `IdentityAuditSubjectRef`, `AuditScopeRef`, `consumer_ref`, `visibility_context_ref` | subject mapper / request scope / metadata | `resolve_audit_read(...)` | 不从 trace subject 字符串切 audit subject |
| redaction policy | access summary + material marker | `VisibilityPolicy::for_summary/for_trace/for_audit(...)` | visible/redacted/not visible/degraded classification | policy 不读 repository、不调用外部授权 |
| public page | repository `Page<T>` | Step 7 page helper | `IdentityPublicPageInfo` | page cursor 不当 truth cursor、audit cursor 或 idempotency key |
| public DTO | loaded view/record/entry + visibility result | Step 6 objects + Step 7 access summary | `MemberSummaryView` / `IdentityTraceRecordView` / `AuditTrailEntryView` | 不输出 forbidden body、不补写 missing material |

`IdentityQuerySurface` disposition for this batch:

| 情况 | disposition | body / items | 必填 surface marker | 说明 |
|---|---|---|---|---|
| visible and found | `Visible` | summary body `Some`;trace/audit items 可非空 | `visibility` | 只含 body-free refs/markers |
| visible but redacted | `Redacted` | body/items 裁剪到允许字段 | `visibility`, `decision_ref` | 字段级矩阵留 Step 12 |
| not visible | `NotVisible` | body `None`;items empty | `visibility`, `decision_ref` | 不泄露 found/missing/entry count 内部原因 |
| dependency unavailable | `Degraded` | body/items 可空或 safe partial | `degraded` | visibility/projection/trace/audit material 不完整 |
| summary projection stale | `StaleVisible` | 可返回 stale safe summary refs | `projection_freshness_ref` 或 `degraded` | query 不 rebuild、不 mark fresh |
| no visible trace/audit entries after valid visible read | `Empty` | items empty,page_info item_count 0 | `visibility` | 表达真实空集合,不是 not visible |
| summary view lookup missing | `Missing` | body `None` | `visibility` if available | 不创建 view、不触发 rebuild |
| projection/audit material rebuilding or disabled | `Rebuilding` / `Disabled` | body `None`;items empty | `degraded` | 具体来源留 Step 9/12 |

### 13.4 `ReadMemberSummary` protocol

#### 13.4.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_query(IdentityQueryRequest<ReadMemberSummaryRequest>) -> Result<IdentityQueryResponse<MemberSummaryView>, ApplicationError>` |
| HTTP / RPC 名称 | API query dispatch route for `ReadMemberSummary`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / downstream consumer |
| 处理方 | `identity-application` query service through `IdentityApplicationFacade::dispatch_query` |

#### 13.4.2 请求 schema

```rust
/// Request body for reading the unified body-free member summary.
pub struct ReadMemberSummaryRequest {
    /// Member whose identity summary is being read.
    pub member_ref: GlobalMemberRef,

    /// Boundary consumer requesting the summary material.
    pub consumer_ref: ConsumerRef,
}
```

| 输入字段 | 类型 | 目标读取 / visibility 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | visibility seed, projection lookup | request body / route binding | 必填;projection missing 返回 `Missing`,不创建 member/view |
| `consumer_ref` | `ConsumerRef` | read visibility repository | request body / API consumer context | 必填;不得由 actor 或 route 推断 |
| `visibility_context_ref` | `VisibilityContextRef` | visibility context | `IdentityQueryMetadata.visibility_context_ref` | 必填 |

#### 13.4.3 响应 view schema

`ReadMemberSummary` 直接返回 Step 6 已定义的 public `MemberSummaryView`,但协议层必须固定字段来源,不能只写 bare type name。

```rust
/// Public member summary view returned by ReadMemberSummary.
pub struct MemberSummaryView {
    pub view_ref: MemberSummaryViewRef,
    pub member_ref: GlobalMemberRef,
    pub anchor_slice_ref: MemberSummarySliceRef,
    pub lifecycle_slice_ref: MemberSummarySliceRef,
    pub role_capability_slice_refs: Vec<MemberSummarySliceRef>,
    pub career_slice_refs: Vec<MemberSummarySliceRef>,
    pub memory_slice_refs: Vec<MemberSummarySliceRef>,
    pub visibility_result_ref: VisibilityResultRef,
    pub read_surface_kind: IdentityReadSurfaceKind,
    pub source_cursor_ref: Option<IdentityTruthCursor>,
    pub read_material_marker: IdentityReadMaterialMarker,
}
```

| 响应字段 | 字段来源 | 约束 |
|---|---|---|
| `view_ref` | `IdentityProjectionRepository.find_member_summary_view_ref(...)` + `get_member_summary_view(...)` | stable view ref;不得 query 拼接 |
| `member_ref` | request + loaded `MemberSummaryView` | 必须一致;不等于 actor/account/runtime ref |
| slice refs | loaded `MemberSummaryView` | 只含 safe summary refs;不返回 anchor/lifecycle/role/work/memory body |
| `visibility_result_ref` / `read_surface_kind` | `VisibilityPolicy::for_summary(...)` / prepared access summary | not visible/redacted/degraded 是 query surface,不是 truth state |
| `source_cursor_ref` | projection builder / committed truth scan | optional;不得用 page cursor、version、timestamp 代替 |
| `read_material_marker` | projection/read assembler | forbidden body 必须被拒绝或降级 |

#### 13.4.4 DTO -> repository / visibility 构造闭环

| 输入契约 | 目标读取 / assembler | 必填字段是否齐全 | 派生字段来源 | 缺失时行为 |
|---|---|---|---|---|
| `IdentityQueryRequest<ReadMemberSummaryRequest>` | initial visibility seed | 齐全: member, consumer, visibility context | `resolve_member_summary_read(member_ref, None, ...)` | access summary missing -> `Degraded`,不默认 visible |
| same | stable projection lookup | 齐全: member + scope | `IdentityVisibilityAccessSummary.scope_ref` | view ref missing -> `Missing` 或 rebuilding/degraded surface,不 rebuild |
| view ref | loaded summary view | 齐全: stable view ref | `get_member_summary_view(view_ref)` | view missing/stale -> `Missing` / `StaleVisible` / `Degraded` |
| loaded view | final visibility policy | 齐全: access summary + material marker | `VisibilityPolicy::for_summary(...)` | not visible -> body `None`;redacted -> body-free fields only |
| output | `IdentityQueryResponse<MemberSummaryView>` | 齐全: query name、surface、optional body | surface from visibility + projection freshness | no write / no repair |

### 13.5 `ReadIdentityTrace` protocol

#### 13.5.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_query(IdentityQueryRequest<ReadIdentityTraceRequest>) -> Result<IdentityPageResponse<IdentityTraceRecordView>, ApplicationError>` |
| HTTP / RPC 名称 | API query dispatch route for `ReadIdentityTrace`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / authorized trace consumer |
| 处理方 | `identity-application` query service through `IdentityApplicationFacade::dispatch_query` |

#### 13.5.2 请求 schema

Trace 查询不暴露自由组合的多个 optional 字段,而是用 selector 固定 Step 7 已支持的读取面,避免实现阶段再解释冲突组合。

```rust
/// Supported trace read selectors.
pub enum IdentityTraceReadSelector {
    /// Read trace records by member.
    ByMember {
        member_ref: GlobalMemberRef,
    },
    /// Read trace records by trace subject, optionally after a committed truth cursor.
    BySubject {
        member_ref: GlobalMemberRef,
        subject_ref: IdentityTraceSubjectRef,
        after_cursor_ref: Option<IdentityTruthCursor>,
    },
    /// Read trace records for a member and change kind.
    ByMemberAndChangeKind {
        member_ref: GlobalMemberRef,
        change_kind_ref: IdentityChangeKindRef,
    },
}

/// Request body for reading body-free identity trace material.
pub struct ReadIdentityTraceRequest {
    /// Trace selector mapped to a Step 7 repository read surface.
    pub selector: IdentityTraceReadSelector,

    /// Boundary consumer requesting trace material.
    pub consumer_ref: ConsumerRef,
}
```

| 输入字段 | 类型 | 目标读取 / visibility 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `selector.ByMember.member_ref` | `GlobalMemberRef` | `list_trace_records_by_member(member_ref, page)` | request body / route binding | 必填;no trace refs -> `Empty` |
| `selector.BySubject.member_ref` | `GlobalMemberRef` | loaded trace member guard | request body | 必填;loaded item member mismatch -> degraded / invalid material surface |
| `selector.BySubject.subject_ref` | `IdentityTraceSubjectRef` | `list_trace_records_after_cursor(subject_ref, after_cursor, page)` and visibility seed | request body typed ref | 必填;不得从 member id 拼接 |
| `selector.BySubject.after_cursor_ref` | `Option<IdentityTruthCursor>` | incremental trace read | request body | optional;只用于 trace source cursor,不当 page cursor |
| `selector.ByMemberAndChangeKind.change_kind_ref` | `IdentityChangeKindRef` | `list_trace_records_by_change_kind(member_ref, change_kind_ref, page)` | request body | 必填;不得用字符串 filter |
| `consumer_ref` | `ConsumerRef` | `resolve_trace_read(...)` | request body / API consumer context | 必填 |
| `page` | `IdentityPublicPageRequest` | repository page | envelope `page` | trace list 必填;缺失是 entry validation failure |
| `visibility_context_ref` | `VisibilityContextRef` | visibility context | `IdentityQueryMetadata.visibility_context_ref` | 必填 |

#### 13.5.3 响应 item schema

```rust
/// Public redaction-aware trace record view.
pub struct IdentityTraceRecordView {
    pub trace_record_ref: IdentityTraceRecordRef,
    pub member_ref: GlobalMemberRef,
    pub subject_ref: IdentityTraceSubjectRef,
    pub audit_subject_ref: IdentityAuditSubjectRef,
    pub change_kind_ref: IdentityChangeKindRef,
    pub source_cursor_ref: IdentityTruthCursor,
    pub reason_ref: Option<IdentityChangeReasonRef>,
    pub source_ref: Option<IdentitySourceRef>,
    pub basis_ref: Option<GovernanceBasisRef>,
    pub actor_ref: Option<ActorRef>,
    pub visibility_result_ref: VisibilityResultRef,
    pub superseded_by_trace_ref: Option<IdentityTraceRecordRef>,
    pub read_material_marker: IdentityReadMaterialMarker,
    pub occurred_at: IdentityTimestamp,
}
```

| 响应字段 | 字段来源 | 约束 |
|---|---|---|
| `trace_record_ref` | repository page ref + `get_trace_record(...)` | missing loaded record -> degraded partial,不修复 |
| `member_ref` | loaded `IdentityTraceRecord.member_ref` | 必须匹配 selector member guard |
| `subject_ref` / `audit_subject_ref` | loaded trace record | accepted flow mapper 生成;query 不强转 |
| `change_kind_ref` / `source_cursor_ref` | loaded trace record | cursor 不等于 page cursor或 version |
| `reason_ref` / `source_ref` / `basis_ref` / `actor_ref` | loaded trace record + redaction policy | optional;redaction 可置空;不返回 reason/source/basis body |
| `visibility_result_ref` | `resolve_trace_read(...)` / `VisibilityPolicy::for_trace(...)` | per-item visibility marker |
| `superseded_by_trace_ref` | loaded trace correction marker | 解释性 marker;不删除旧 trace |
| `read_material_marker` | loaded trace / read assembler | forbidden raw log/body 不进入 DTO |
| `occurred_at` | loaded trace record | time 不替代 cursor |

#### 13.5.4 DTO -> repository / visibility 构造闭环

| selector | repository read | visibility source | public behavior |
|---|---|---|---|
| `ByMember` | `list_trace_records_by_member(member_ref, page)` then `get_trace_record(...)` | each loaded record `subject_ref` -> `resolve_trace_read(subject_ref, consumer_ref, visibility_context_ref)` | 返回可见/redacted items;全部不可见时 `NotVisible` 或 empty priority 留 Step 10/12 |
| `BySubject` | `list_trace_records_after_cursor(subject_ref, after_cursor_ref, page)` then `get_trace_record(...)` | request `subject_ref` -> `resolve_trace_read(...)`;loaded record subject must match | after cursor 只用 `IdentityTruthCursor`;page cursor 仍来自 envelope |
| `ByMemberAndChangeKind` | `list_trace_records_by_change_kind(member_ref, change_kind_ref, page)` then `get_trace_record(...)` | each loaded record `subject_ref` -> `resolve_trace_read(...)` | change kind 是 typed marker;不扫描 reason/body |

| 输入契约 | 是否闭合 | 说明 |
|---|---|---|
| trace list page | 闭合 | `IdentityPublicPageRequest` -> Step 7 `IdentityRepositoryPage` |
| trace subject source | 闭合 | request typed subject 或 loaded trace record,不拼字符串 |
| trace visibility | 闭合 | `IdentityReadVisibilityRepository.resolve_trace_read(...)` |
| trace redaction | 闭合 | `VisibilityPolicy::for_trace(...)` + field optionality |
| trace missing / partial | 后续细化 | exact priority 留 Step 9/10/12,但本批固定不得补写或默认 visible |

### 13.6 `ReadAuditTrail` protocol

#### 13.6.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_query(IdentityQueryRequest<ReadAuditTrailRequest>) -> Result<IdentityPageResponse<AuditTrailEntryView>, ApplicationError>` |
| HTTP / RPC 名称 | API query dispatch route for `ReadAuditTrail`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / authorized audit consumer |
| 处理方 | `identity-application` query service through `IdentityApplicationFacade::dispatch_query` |

#### 13.6.2 请求 schema

```rust
/// Request body for reading a member canonical audit trail.
pub struct ReadAuditTrailRequest {
    /// Member whose canonical audit subject timeline is being read.
    pub member_ref: GlobalMemberRef,

    /// Audit scope requested by the caller.
    pub audit_scope_ref: AuditScopeRef,

    /// Optional audit cursor. This is not a truth cursor and not a page cursor.
    pub audit_cursor_ref: Option<AuditCursorRef>,

    /// Boundary consumer requesting audit material.
    pub consumer_ref: ConsumerRef,
}
```

| 输入字段 | 类型 | 目标读取 / visibility 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `member_ref` | `GlobalMemberRef` | member canonical audit subject mapper input, optional member guard | request body / route binding | 必填;不从 audit trail id 拼 member |
| `audit_scope_ref` | `AuditScopeRef` | audit visibility and entry filtering | request body | 必填;不得从 route string 推断 |
| `audit_cursor_ref` | `Option<AuditCursorRef>` | `list_audit_entries(...)` cursor | request body | optional;不得与 page cursor / truth cursor 混用 |
| `consumer_ref` | `ConsumerRef` | `resolve_audit_read(...)` | request body / API consumer context | 必填 |
| `page` | `IdentityPublicPageRequest` | repository page | envelope `page` | audit list 必填;缺失是 entry validation failure |
| `visibility_context_ref` | `VisibilityContextRef` | visibility context | `IdentityQueryMetadata.visibility_context_ref` | 必填 |

#### 13.6.3 响应 item schema

```rust
/// Public redaction-aware audit trail entry view.
pub struct AuditTrailEntryView {
    pub audit_trail_ref: AuditTrailRef,
    pub audit_subject_ref: IdentityAuditSubjectRef,
    pub audit_scope_ref: AuditScopeRef,
    pub member_ref: Option<GlobalMemberRef>,
    pub trace_record_ref: IdentityTraceRecordRef,
    pub change_kind_ref: IdentityChangeKindRef,
    pub visibility_result_ref: VisibilityResultRef,
    pub occurred_at: IdentityTimestamp,
}
```

| 响应字段 | 字段来源 | 约束 |
|---|---|---|
| `audit_trail_ref` | `find_audit_trail_by_subject(...)` loaded trail | query 不从 audit subject 拼 ref |
| `audit_subject_ref` | `IdentityTruthChangeSubjectMapper.member_subjects(member_ref).audit_subject_ref` + loaded trail | member canonical audit subject typed mapper 输出;不得从 trace subject 切割 |
| `audit_scope_ref` | request body | 只表达读取范围,不修改 trace |
| `member_ref` | request body / loaded `AuditTrail.member_ref` | optional for future system/report scope;本批 member query 应一致 |
| `trace_record_ref` / `change_kind_ref` / `visibility_result_ref` / `occurred_at` | `AuditTrailEntry` | entry 必须 body-free;不保存 raw log |

#### 13.6.4 DTO -> repository / visibility 构造闭环

| 输入契约 | 目标读取 / assembler | 必填字段是否齐全 | 派生字段来源 | 缺失时行为 |
|---|---|---|---|---|
| `IdentityQueryRequest<ReadAuditTrailRequest>` | member canonical audit subject mapping | 齐全: member ref | `IdentityTruthChangeSubjectMapper.member_subjects(member_ref).audit_subject_ref` | mapper 不得拼接外部字符串;本批不聚合 role/career/memory 等子 truth audit trail |
| same | audit visibility seed | 齐全: audit subject, audit scope, consumer, visibility context | `resolve_audit_read(audit_subject_ref, audit_scope_ref, consumer_ref, visibility_context_ref)` | access summary missing -> `Degraded`;not visible -> empty items with `NotVisible` |
| audit subject | audit trail lookup | 齐全 | `IdentityAuditTrailRepository.find_audit_trail_by_subject(...)` | missing trail -> `Empty` / `Missing` priority 留 Step 10;不创建 trail |
| loaded trail | paged entries | 齐全: audit trail ref, scope, audit cursor, repository page | `list_audit_entries(audit_trail_ref, audit_scope_ref, audit_cursor_ref, page)` | no entries -> `Empty` |
| entries | public page items | 齐全 | `AuditTrailEntry` + visibility result | no raw log/body;degraded item missing 不修复 trace |
| output | `IdentityPageResponse<AuditTrailEntryView>` | 齐全: query name、surface、page_info、items | Step 8 page mapping | page cursor 不改变 audit cursor |

### 13.7 本批 DTO 构造闭环汇总

| Query | DTO 字段是否能构造读取 / visibility 输入 | Step 6 对象回指 | Step 7 port/helper 回指 | 仍需后续 Step 闭口 |
|---|---|---|---|---|
| `ReadMemberSummary` | 通过 | `MemberSummaryView`, `VisibilityPolicy`, `IdentityReadSurfaceKind` | read visibility repo、projection repo | projection missing/stale/rebuilding exact priority;field redaction matrix |
| `ReadIdentityTrace` | 通过 | `IdentityTraceRecord`, `IdentityTraceRecordView`, `VisibilityPolicy` | trace record repo、read visibility repo | per-item visibility priority;all-not-visible vs empty distinction;trace ordering |
| `ReadAuditTrail` | 通过,但范围限定为 member canonical audit subject | `AuditTrail`, `AuditTrailEntry`, `AuditTrailEntryView`, `VisibilityPolicy` | truth subject mapper、audit trail repo、read visibility repo | 是否需要聚合 role/career/memory 等子 truth audit trail;missing trail vs empty priority;audit cursor/page cursor ordering;partial degraded entries |

### 13.8 8.3-b 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只覆盖 trace / audit / summary query | 通过 | 未展开 maintenance/outbox/handoff query |
| 是否沿用 8.1 shared query envelope/page/surface | 通过 | summary 使用 `IdentityQueryResponse<T>`;trace/audit 使用 `IdentityPageResponse<T>` |
| DTO 字段是否有 Step 6/7 来源 | 通过 | request/view 字段回指 Step 6 object/marker 和 Step 7 projection/trace/audit/read visibility port |
| read subject/scope 是否正式 | 通过 | summary scope 来自 read visibility summary;trace subject 来自 request或 loaded trace;audit subject 来自 subject mapper |
| stable view / audit trail ref 是否正式 | 通过 | summary view ref 来自 projection lookup;audit trail ref 来自 repository lookup |
| query no-write 是否保持 | 通过 | missing/empty/stale/degraded 均不创建、不修复、不 rebuild、不 append |
| page / cursor 是否分离 | 通过 | public page cursor、trace truth cursor、audit cursor 三者分离 |
| 外部正文 / raw log 是否排除 | 通过 | trace/audit response 只含 refs/markers/time;不返回 raw body |
| 是否新增 port/state/object | 未新增 | 只定义 Step 8 public DTO/selector/view;未新增 Step 7 port 或 Step 6 truth |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一步 | 8.3-c | 用户审核通过后进入 maintenance / outbox / handoff query DTOs |

### 13.9 8.3-b 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| summary view ref | `find_member_summary_view_ref(member_ref, scope_ref)` 后再 `get_member_summary_view(view_ref)` | `format!("member-summary:{member_id}")` 临时拼 view ref |
| trace selector | `IdentityTraceReadSelector::BySubject { subject_ref, after_cursor_ref, ... }` 对应 Step 7 cursor 读取面 | 同时传 subject/change_kind/cursor 三个 optional 字段让 service 自行猜优先级 |
| trace visibility | loaded trace 的 `subject_ref` 调 `resolve_trace_read(...)` | 从 route/member/source 字符串推断 visibility subject |
| audit subject | `IdentityTruthChangeSubjectMapper.member_subjects(member_ref).audit_subject_ref` | 把 `IdentityTraceSubjectRef` 字符串切割成 audit subject |
| audit trail ref | `find_audit_trail_by_subject(audit_subject_ref)` | `format!("audit:{member_id}")` 临时拼 audit trail ref |
| cursor | public page cursor 只分页;`IdentityTruthCursor` 只做 trace after-cursor;`AuditCursorRef` 只做 audit cursor | 把 page cursor 当 truth cursor或 audit cursor |
| not visible | `IdentityQuerySurface.disposition = NotVisible`,items/body 空 | 返回 `Empty` 或 `Missing` 掩盖权限结果 |
| trace/audit material | DTO 返回 refs、change kind、safe reason/source/basis marker、occurred_at | 返回 raw log、debug message、event body、reason body、source body |
| query stale/missing | 返回 `StaleVisible` / `Degraded` / `Missing` / `Empty` surface | query path rebuild projection、创建 audit trail、补 trace |
| consumer marker | request 显式 `ConsumerRef`,visibility context 来自 metadata | 用 actor ref、tenant string 或 route name 代替 consumer/scope |

---

## 14. 8.3-c maintenance / outbox / handoff query DTOs

### 14.1 本批目标与边界

本批只定义六条 operations / maintenance / propagation query:

- `GetProjectionState`
- `GetReferenceResolutionState`
- `ReadReconciliationReport`
- `ListPendingIdentityOutbox`
- `GetIdentityOutboxState`
- `GetTraceHandoffState`

它们必须沿用 8.1 的 `IdentityQueryRequest<T>`、`IdentityQueryResponse<T>`、`IdentityPageResponse<T>`、`IdentityQuerySurface`、`IdentityPublicPageRequest` 和 `IdentityPublicPageInfo`。本批不定义 inbound event payload、outbound event payload、job input/output/report、publisher adapter、handoff delivery adapter、HTTP status、完整 retry policy、完整 error recovery 或 duplicate replay。

本批固定共同规则:

- query 只读,不得创建或更新 `ProjectionState`、`ReferenceResolutionState`、`ReconciliationReport`、`IdentityOutboxRecord`、`TraceHandoffIntent`、trace、audit、stored result 或 idempotency record。
- `GetProjectionState` 的 `ProjectionStateRef` 只能来自 request optional state ref 或 Step 7 `IdentityProjectionRepository.find_projection_state_ref(projection_ref)` / `get_projection_state_with_version(projection_ref)`;不得从 `IdentityProjectionRef` 拼接。
- `GetReferenceResolutionState` 的 `ReferenceResolutionStateRef` 只能来自 request external ref 对应的 Step 7 `IdentityReferenceStateRepository.find_reference_state_ref(...)` / `get_reference_state_with_version(...)`;不得从 external source string 拼接。
- `ReadReconciliationReport` 按 maintenance scope 分页时必须先调用 Step 7 `IdentityReadVisibilityRepository.resolve_reconciliation_scope_read(...)`;单个 report item 读取时还要对 loaded `report_ref` 调 `resolve_report_read(...)`。本批使用 public page cursor,不新增未闭口的 `ReportCursorRef` public schema。
- `ListPendingIdentityOutbox` 使用 selector 固定 Step 7 已支持的读取面,避免 optional member/topic/state 的冲突组合。若需要从 `GlobalMemberRef` 派生 outbox subject,必须先通过正式 `IdentityTruthChangeSubjectMapper.member_subjects(member_ref).outbox_subject_ref`,不得由 service 拼接。
- `GetIdentityOutboxState` 和 `GetTraceHandoffState` 只能返回状态、attempt / receipt / issue marker 和 body-free material refs;不得调用 publisher、delivery adapter、retry runner 或下游查询。
- `ConsumerRef` 显式放在 request body,作为 Step 7 read visibility repository 输入;`VisibilityContextRef` 只来自 `IdentityQueryMetadata.visibility_context_ref`。
- not visible、empty、missing、stale、degraded、rebuilding、disabled 必须通过 `IdentityQuerySurface` 显式表达;不得用 empty / missing 掩盖 not visible,也不得用 query side effect 修复 missing/stale。
- response DTO 只返回 refs、state kind、safe summary marker、issue marker、visibility marker、cursor marker 和时间 marker;不得返回 projection body、external body、raw diagnostic、raw log、publisher response、topic private config、archive package、handoff receipt body、target path、secret 或 debug body。

### 14.2 Query batch table

| Query | Request DTO | Response DTO | 读取对象 / view | 依赖 Step 7 port/helper | 后续 flow |
|---|---|---|---|---|---|
| `GetProjectionState` | `GetProjectionStateRequest` | `IdentityQueryResponse<ProjectionStateView>` | `ProjectionState` | `IdentityProjectionRepository`, `IdentityReadVisibilityRepository` | `GetProjectionStateFlow` |
| `GetReferenceResolutionState` | `GetReferenceResolutionStateRequest` | `IdentityQueryResponse<ReferenceResolutionStateView>` | `ReferenceResolutionState`, typed sidecar refs | `IdentityReferenceStateRepository`, `IdentityReadVisibilityRepository` | `GetReferenceResolutionStateFlow` |
| `ReadReconciliationReport` | `ReadReconciliationReportRequest` | `IdentityPageResponse<ReconciliationReportView>` | `ReconciliationReport` page / optional single report | `IdentityReconciliationReportRepository`, `IdentityReadVisibilityRepository` | `ReadReconciliationReportFlow` |
| `ListPendingIdentityOutbox` | `ListPendingIdentityOutboxRequest` | `IdentityPageResponse<IdentityOutboxRecordView>` | `IdentityOutboxRecord`, `OutboxState` | `IdentityOutboxRepository`, `IdentityTruthChangeSubjectMapper`, `IdentityReadVisibilityRepository` | `ListPendingIdentityOutboxFlow` |
| `GetIdentityOutboxState` | `GetIdentityOutboxStateRequest` | `IdentityQueryResponse<IdentityOutboxStateView>` | `IdentityOutboxRecord`, `OutboxState` | `IdentityOutboxRepository`, `IdentityReadVisibilityRepository` | `GetIdentityOutboxStateFlow` |
| `GetTraceHandoffState` | `GetTraceHandoffStateRequest` | `IdentityQueryResponse<TraceHandoffStateView>` | `TraceHandoffIntent`, `HandoffState` | `TraceHandoffIntentRepository`, `IdentityReadVisibilityRepository` | `GetTraceHandoffStateFlow` |

### 14.3 Shared operations visibility / no-write construction

| 阶段 | 输入 | 正式来源 | 输出 | 禁止事项 |
|---|---|---|---|---|
| entry envelope | `IdentityQueryRequest<T>` | API / SDK query handler | `actor_ref`, `query_name`, `metadata.visibility_context_ref`, optional page, body | handler 不从 body 推 actor;query 不使用 command idempotency |
| consumer marker | body `consumer_ref` | request body / API consumer context | visibility repository `consumer_ref` | 不保存 consumer 私有权限体 |
| projection read seed | `projection_ref`, optional `projection_state_ref`, `consumer_ref`, `visibility_context_ref` | request body + projection repository lookup | `resolve_projection_state_read(...)` | 不从 projection ref string、state ref、member id 或 cursor 推 visibility scope |
| reference read seed | `external_reference_ref`, optional `owner_ref`, `consumer_ref`, `visibility_context_ref` | request body + reference repository lookup | `resolve_reference_state_read(...)` | 不调用 external resolver;不把 owner/external source 当 scope |
| report scope seed | `maintenance_scope_ref`, `consumer_ref`, `visibility_context_ref` | request body | `resolve_reconciliation_scope_read(...)` | 不先扫描 report store 再推断 scope visibility |
| report item seed | loaded `report_ref`, `consumer_ref`, `visibility_context_ref` | report repository result | `resolve_report_read(...)` | 不从 report id、scope string 或 target refs 拼可见性 |
| outbox read seed | optional outbox ref / subject / topic, `consumer_ref`, `visibility_context_ref` | request selector + formal subject mapper + repository result | `resolve_outbox_record_read(...)` | 不读取 payload body;不把 topic key / broker route 当 subject |
| handoff read seed | `handoff_intent_ref`, `consumer_ref`, `visibility_context_ref` | request body | `resolve_handoff_intent_read(...)` | 不读取 receipt body、target path、archive package 或 adapter state |
| public page | repository `Page<T>` | Step 7 page helper | `IdentityPublicPageInfo` | page cursor 不当 truth cursor、projection cursor、job cursor、source version 或 idempotency key |
| public DTO | loaded object + visibility result | Step 6 objects + Step 7 access summary | operation view DTO | 不输出 forbidden body、不补写 missing material、不触发 job |

`IdentityQuerySurface` disposition for this batch:

| 情况 | disposition | body / items | 必填 surface marker | 说明 |
|---|---|---|---|---|
| visible and found | `Visible` | body `Some`,或 page items 可非空 | `visibility` | 只含 body-free refs/markers |
| visible but redacted | `Redacted` | body/items 裁剪到允许字段 | `visibility`, `decision_ref` | 字段级矩阵留 Step 12 |
| not visible | `NotVisible` | body `None`;items empty | `visibility`, `decision_ref` | 不泄露 found/missing/count 内部原因 |
| dependency or resolver unavailable | `Degraded` | body/items 可空或 safe partial | `degraded` | visibility/repository/material 不完整 |
| projection/reference/report stale | `StaleVisible` | 可返回 stale safe marker | `projection_freshness_ref` 或 `degraded` | query 不 rebuild、不 refresh |
| no visible records after valid visible read | `Empty` | body `None`;items empty,page_info item_count 0 | `visibility` | 表达真实空集合,不是 not visible |
| requested ref or lookup missing | `Missing` | body `None`;items empty | `visibility` if available | 不创建 state/report/outbox/handoff |
| rebuild/refresh/report generation in progress | `Rebuilding` | body `None`;items empty | `degraded` or freshness marker | 不触发后台 job |
| feature/boundary disabled | `Disabled` | body `None`;items empty | `degraded` | 不伪造成 success |

### 14.4 `GetProjectionState` protocol

#### 14.4.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_query(IdentityQueryRequest<GetProjectionStateRequest>) -> Result<IdentityQueryResponse<ProjectionStateView>, ApplicationError>` |
| HTTP / RPC 名称 | API query dispatch route for `GetProjectionState`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / operations consumer |
| 处理方 | `identity-application` query service through `IdentityApplicationFacade::dispatch_query` |

#### 14.4.2 请求 schema

```rust
/// Request body for reading projection freshness without triggering rebuild.
pub struct GetProjectionStateRequest {
    /// Projection or derived view being inspected.
    pub projection_ref: IdentityProjectionRef,

    /// Optional stable projection state ref supplied by a previous lookup/result.
    pub projection_state_ref: Option<ProjectionStateRef>,

    /// Boundary consumer requesting operations state.
    pub consumer_ref: ConsumerRef,
}
```

| 输入字段 | 类型 | 目标读取 / visibility 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `projection_ref` | `IdentityProjectionRef` | `get_projection_state_with_version(projection_ref)`, visibility seed | request body / route binding | 必填;missing -> `Missing`,不创建 state |
| `projection_state_ref` | `Option<ProjectionStateRef>` | visibility seed / consistency guard | request body 或 `find_projection_state_ref(projection_ref)` | optional;若与 loaded state 不一致 -> degraded / invalid material surface |
| `consumer_ref` | `ConsumerRef` | `resolve_projection_state_read(...)` | request body / API consumer context | 必填 |
| `visibility_context_ref` | `VisibilityContextRef` | visibility context | `IdentityQueryMetadata.visibility_context_ref` | 必填 |

#### 14.4.3 响应 view schema

```rust
/// Public body-free projection state view.
pub struct ProjectionStateView {
    pub projection_state_ref: Option<ProjectionStateRef>,
    pub projection_ref: IdentityProjectionRef,
    pub member_ref: Option<GlobalMemberRef>,
    pub state_kind: Option<ProjectionStateKind>,
    pub source_cursor_ref: Option<IdentityProjectionCursorRef>,
    pub maintenance_scope_ref: Option<MaintenanceScopeRef>,
    pub issue_ref: Option<MaintenanceIssueRef>,
    pub checked_at: Option<IdentityTimestamp>,
    pub visibility_result_ref: VisibilityResultRef,
}
```

| 响应字段 | 字段来源 | 约束 |
|---|---|---|
| `projection_state_ref` | loaded `ProjectionState.projection_state_ref` 或 lookup missing `None` | 不从 projection ref 拼接 |
| `projection_ref` | request + loaded state | 必须一致;不等于 view ref unless formally mapped |
| `member_ref` | loaded `ProjectionState.member_ref` | optional;不得从 projection ref 字符串解析 |
| `state_kind` | loaded `ProjectionState.state_kind` | missing 时 `None`;surface 用 `Missing` |
| `source_cursor_ref` | loaded `ProjectionState.source_cursor_ref` | projection cursor;不得当 truth/page/job cursor |
| `maintenance_scope_ref` | loaded `ProjectionState.maintenance_scope_ref` | 只回显 marker;不展开 target |
| `issue_ref` | loaded `ProjectionState.issue_ref` | safe issue marker;不返回 raw diagnostic |
| `checked_at` | loaded `ProjectionState.checked_at` | time marker;不替代 cursor/version |
| `visibility_result_ref` | `resolve_projection_state_read(...)` / visibility policy output | not visible/redacted/degraded marker |

#### 14.4.4 DTO -> repository / visibility 构造闭环

| 输入契约 | 目标读取 / assembler | 必填字段是否齐全 | 派生字段来源 | 缺失时行为 |
|---|---|---|---|---|
| `IdentityQueryRequest<GetProjectionStateRequest>` | visibility precheck | 齐全: projection, optional state, consumer, visibility context | `resolve_projection_state_read(projection_ref, projection_state_ref, ...)` | access summary missing -> `NotVisible` / `Degraded`,不默认 visible |
| same | projection state lookup | 齐全: `projection_ref` | `get_projection_state_with_version(projection_ref)`;optional `find_projection_state_ref(...)` for ref-only guard | missing -> `Missing`,不创建 state |
| loaded state | state consistency check | 齐全: loaded state | request optional `projection_state_ref` must match loaded state when present | mismatch -> degraded / invalid material surface |
| loaded state | public view | 齐全: loaded state + visibility | fields copied from `ProjectionState` | stale/degraded/failed only surfaced;no rebuild |
| output | `IdentityQueryResponse<ProjectionStateView>` | 齐全: query name、surface、optional body | surface from visibility + `ProjectionStateKind` | no write / no repair |

### 14.5 `GetReferenceResolutionState` protocol

#### 14.5.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_query(IdentityQueryRequest<GetReferenceResolutionStateRequest>) -> Result<IdentityQueryResponse<ReferenceResolutionStateView>, ApplicationError>` |
| HTTP / RPC 名称 | API query dispatch route for `GetReferenceResolutionState`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / operations consumer |
| 处理方 | `identity-application` query service through `IdentityApplicationFacade::dispatch_query` |

#### 14.5.2 请求 schema

```rust
/// Request body for reading stored external reference resolution state.
pub struct GetReferenceResolutionStateRequest {
    /// External reference bundle being inspected.
    pub external_reference_ref: ExternalReferenceRef,

    /// Optional expected local owner for the reference.
    pub owner_ref: Option<IdentityReferenceOwnerRef>,

    /// Boundary consumer requesting reference state.
    pub consumer_ref: ConsumerRef,
}
```

| 输入字段 | 类型 | 目标读取 / visibility 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `external_reference_ref` | `ExternalReferenceRef` | `get_reference_state_with_version(...)`, visibility seed | request body / route binding | 必填;missing -> `Missing`,不创建 bundle |
| `owner_ref` | `Option<IdentityReferenceOwnerRef>` | owner consistency guard / visibility seed | request body 或 loaded `ReferenceResolutionState.reference_owner_ref` | optional;不从 external ref 推断 |
| `consumer_ref` | `ConsumerRef` | `resolve_reference_state_read(...)` | request body / API consumer context | 必填 |
| `visibility_context_ref` | `VisibilityContextRef` | visibility context | `IdentityQueryMetadata.visibility_context_ref` | 必填 |

#### 14.5.3 响应 view schema

```rust
/// Public body-free external reference resolution view.
pub struct ReferenceResolutionStateView {
    pub resolution_state_ref: Option<ReferenceResolutionStateRef>,
    pub external_reference_ref: ExternalReferenceRef,
    pub owner_ref: Option<IdentityReferenceOwnerRef>,
    pub state_kind: Option<ReferenceResolutionStateKind>,
    pub source_version_ref: Option<ExternalSourceVersionRef>,
    pub safe_summary_ref: Option<ExternalReferenceSafeSummaryRef>,
    pub sidecar_refs: Option<ReferenceResolutionSidecarRefsView>,
    pub issue_ref: Option<MaintenanceIssueRef>,
    pub checked_at: Option<IdentityTimestamp>,
    pub visibility_result_ref: VisibilityResultRef,
}

/// Public body-free sidecar refs for one external reference bundle.
pub struct ReferenceResolutionSidecarRefsView {
    pub role_capability_safe_summary_ref: Option<ExternalReferenceSafeSummaryRef>,
    pub career_safe_summary_ref: Option<ExternalReferenceSafeSummaryRef>,
    pub memory_safe_summary_ref: Option<ExternalReferenceSafeSummaryRef>,
    pub governance_basis_summary_ref: Option<ExternalReferenceSafeSummaryRef>,
    pub evidence_summary_ref: Option<ExternalReferenceSafeSummaryRef>,
    pub source_version_ref: Option<ExternalSourceVersionRef>,
}
```

| 响应字段 | 字段来源 | 约束 |
|---|---|---|
| `resolution_state_ref` | loaded `ReferenceResolutionState.resolution_state_ref` 或 lookup missing `None` | 不从 external ref 拼接 |
| `external_reference_ref` | request + loaded state | 必须一致;body-free marker only |
| `owner_ref` | request optional / loaded `ReferenceResolutionState.reference_owner_ref` | owner 和 external ref 分离;不相互推断 |
| `state_kind` | loaded `ReferenceResolutionState.state_kind` | missing 时 `None`;unavailable/unrecognized/refresh failed 显式暴露 |
| `source_version_ref` | loaded state | source version 不等于 optimistic version |
| `safe_summary_ref` | loaded state | body-free marker;不返回 external body |
| `sidecar_refs` | `get_typed_sidecar_refs(external_reference_ref)` mapped to public `ReferenceResolutionSidecarRefsView` after visible precheck | 同一 reference bundle sidecar;不跨 bundle;不直接暴露 Step 7 application-local helper |
| `issue_ref` | loaded state | safe issue marker;不返回 adapter raw error |
| `checked_at` | loaded state | time marker;不替代 cursor/version |
| `visibility_result_ref` | `resolve_reference_state_read(...)` / visibility policy output | not visible/redacted/degraded marker |

#### 14.5.4 DTO -> repository / visibility 构造闭环

| 输入契约 | 目标读取 / assembler | 必填字段是否齐全 | 派生字段来源 | 缺失时行为 |
|---|---|---|---|---|
| `IdentityQueryRequest<GetReferenceResolutionStateRequest>` | visibility precheck | 齐全: external reference, optional owner, consumer, visibility context | `resolve_reference_state_read(external_reference_ref, owner_ref, ...)` | access summary missing -> `NotVisible` / `Degraded` |
| same | stored reference state lookup | 齐全: `external_reference_ref` | `get_reference_state_with_version(external_reference_ref)` | missing -> `Missing`,不调用 resolver、不创建 state |
| loaded state | owner consistency check | 齐全: loaded state + optional owner | request owner ref must match loaded owner when present | mismatch -> degraded / invalid material surface |
| loaded state | typed sidecar read | 齐全: same external reference bundle | `get_typed_sidecar_refs(external_reference_ref)` -> `ReferenceResolutionSidecarRefsView` | sidecar missing -> `Degraded` or safe partial;不补写 |
| output | `IdentityQueryResponse<ReferenceResolutionStateView>` | 齐全: query name、surface、optional body | surface from visibility + `ReferenceResolutionStateKind` | no external refresh / no repair |

### 14.6 `ReadReconciliationReport` protocol

#### 14.6.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_query(IdentityQueryRequest<ReadReconciliationReportRequest>) -> Result<IdentityPageResponse<ReconciliationReportView>, ApplicationError>` |
| HTTP / RPC 名称 | API query dispatch route for `ReadReconciliationReport`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / operations consumer |
| 处理方 | `identity-application` query service through `IdentityApplicationFacade::dispatch_query` |

#### 14.6.2 请求 schema

Report query 统一使用 public page envelope 表达 HLD 中的 report cursor。若传入 `report_ref`,本批语义是读取该 report 并以单 item page 返回;若未传入 `report_ref`,按 `maintenance_scope_ref` 分页读取 report-only material。

```rust
/// Request body for reading report-only reconciliation reports.
pub struct ReadReconciliationReportRequest {
    /// Maintenance scope whose reports are being read.
    pub maintenance_scope_ref: MaintenanceScopeRef,

    /// Optional exact report ref. When present the response page contains at most one item.
    pub report_ref: Option<ReconciliationReportRef>,

    /// Boundary consumer requesting report material.
    pub consumer_ref: ConsumerRef,
}
```

| 输入字段 | 类型 | 目标读取 / visibility 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `maintenance_scope_ref` | `MaintenanceScopeRef` | scope visibility precheck, `list_reports_by_scope(...)` | request body / route binding | 必填;不从 report id 推断 |
| `report_ref` | `Option<ReconciliationReportRef>` | optional single report lookup | request body / previous job/report result | optional;missing exact report -> `Missing` |
| `consumer_ref` | `ConsumerRef` | `resolve_reconciliation_scope_read(...)` and `resolve_report_read(...)` | request body / API consumer context | 必填 |
| `page` | `IdentityPublicPageRequest` | repository page | envelope `page` | scope list 必填;single report 可使用 default one-item page |
| `visibility_context_ref` | `VisibilityContextRef` | visibility context | `IdentityQueryMetadata.visibility_context_ref` | 必填 |

#### 14.6.3 响应 item schema

```rust
/// Public body-free reconciliation report view.
pub struct ReconciliationReportView {
    pub report_ref: ReconciliationReportRef,
    pub maintenance_scope_ref: MaintenanceScopeRef,
    pub target_refs: Vec<IdentityMaintenanceTargetRef>,
    pub finding_refs: Vec<ReconciliationFindingRef>,
    pub issue_refs: Vec<MaintenanceIssueRef>,
    pub report_state: ReconciliationReportStateKind,
    pub generated_by_ref: Option<ActorRef>,
    pub generated_at: IdentityTimestamp,
    pub visibility_result_ref: VisibilityResultRef,
}
```

| 响应字段 | 字段来源 | 约束 |
|---|---|---|
| `report_ref` | loaded `ReconciliationReport.report_ref` | 不从 scope/time 拼接 |
| `maintenance_scope_ref` | request + loaded report | 必须一致;不展开 target |
| `target_refs` | loaded report | only maintenance target markers;不得是 repair action |
| `finding_refs` | loaded report | body-free finding refs;不保存 finding body/remediation plan |
| `issue_refs` | loaded report | safe issue refs;不返回 raw diagnostic |
| `report_state` | loaded report | `Partial` / `Failed` 不得隐藏 |
| `generated_by_ref` | loaded report | optional actor/system actor marker |
| `generated_at` | loaded report | time marker;不替代 report id/page cursor |
| `visibility_result_ref` | scope/report visibility resolver output | per-item visibility marker |

#### 14.6.4 DTO -> repository / visibility 构造闭环

| selector | repository read | visibility source | public behavior |
|---|---|---|---|
| exact `report_ref` | `get_report_with_version(report_ref)` | first `resolve_reconciliation_scope_read(scope, ...)`,then `resolve_report_read(report_ref, ...)` | found -> one-item page;missing -> `Missing`;scope mismatch -> degraded / invalid material |
| scope list | `list_reports_by_scope(maintenance_scope_ref, page)` then `get_report_with_version(report_ref)` for items | scope precheck + per-item `resolve_report_read(report_ref, ...)` | no reports -> `Empty`;not visible -> empty items with `NotVisible`;partial item visibility priority 留 Step 10/12 |

| 输入契约 | 是否闭合 | 说明 |
|---|---|---|
| report page cursor | 闭合 | 使用 8.1 `IdentityPublicPageRequest`,映射 Step 7 repository page |
| scope visibility | 闭合 | Step 7 `resolve_reconciliation_scope_read(...)` 已补为正式前置 resolver |
| report item visibility | 闭合 | `resolve_report_read(report_ref, ...)` |
| report body-free | 闭合 | view 只含 refs/state/time;不含 external body/raw diagnostic/repair plan |
| exact latest / latest-by-scope | 不在本批定义 | 需要额外 repository/index 规则时回 Step 7/9/11;本批不私造 latest 选择 |

### 14.7 `ListPendingIdentityOutbox` protocol

#### 14.7.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_query(IdentityQueryRequest<ListPendingIdentityOutboxRequest>) -> Result<IdentityPageResponse<IdentityOutboxRecordView>, ApplicationError>` |
| HTTP / RPC 名称 | API query dispatch route for `ListPendingIdentityOutbox`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / operations consumer |
| 处理方 | `identity-application` query service through `IdentityApplicationFacade::dispatch_query` |

#### 14.7.2 请求 schema

Outbox list 不暴露多 optional 字段让 service 猜优先级,而是使用 selector 固定 Step 7 已支持的读取面。

```rust
/// Supported outbox list selectors.
pub enum IdentityOutboxListSelector {
    /// List pending publish records, optionally by topic.
    Pending {
        topic_key_ref: Option<TopicKeyRef>,
    },
    /// List retryable failed records, optionally by topic.
    Retryable {
        topic_key_ref: Option<TopicKeyRef>,
    },
    /// List records by formal outbox subject.
    BySubject {
        subject_ref: IdentityOutboxSubjectRef,
    },
    /// List member records through the formal accepted subject mapper.
    ByMember {
        member_ref: GlobalMemberRef,
    },
    /// List outbox records linked to an accepted trace record.
    ByTrace {
        trace_record_ref: IdentityTraceRecordRef,
    },
}

/// Request body for listing body-free identity outbox state.
pub struct ListPendingIdentityOutboxRequest {
    /// Selector mapped to a Step 7 outbox repository read surface.
    pub selector: IdentityOutboxListSelector,

    /// Boundary consumer requesting outbox material.
    pub consumer_ref: ConsumerRef,
}
```

| 输入字段 | 类型 | 目标读取 / visibility 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `selector.Pending.topic_key_ref` | `Option<TopicKeyRef>` | `list_pending_outbox_records(topic_key_ref, page)` | request body / topic binding result | optional;topic ref 不等于 broker topic string |
| `selector.Retryable.topic_key_ref` | `Option<TopicKeyRef>` | `list_retryable_outbox_records(topic_key_ref, page)` | request body / topic binding result | optional;不定义 backoff |
| `selector.BySubject.subject_ref` | `IdentityOutboxSubjectRef` | `list_outbox_records_by_subject(subject_ref, page)` and visibility seed | request body typed subject | 必填;不得从 string 拼接 |
| `selector.ByMember.member_ref` | `GlobalMemberRef` | subject mapper then `list_outbox_records_by_subject(...)` | request body + `IdentityTruthChangeSubjectMapper.member_subjects(...)` | mapper unavailable -> degraded;不得自行拼 subject |
| `selector.ByTrace.trace_record_ref` | `IdentityTraceRecordRef` | `find_outbox_records_by_trace(trace_record_ref, page)` | request body / accepted effect result | 必填 |
| `consumer_ref` | `ConsumerRef` | `resolve_outbox_record_read(...)` | request body / API consumer context | 必填 |
| `page` | `IdentityPublicPageRequest` | repository page | envelope `page` | list query 必填;缺失是 entry validation failure |
| `visibility_context_ref` | `VisibilityContextRef` | visibility context | `IdentityQueryMetadata.visibility_context_ref` | 必填 |

#### 14.7.3 响应 item schema

```rust
/// Public body-free outbox record view.
pub struct IdentityOutboxRecordView {
    pub outbox_record_ref: IdentityOutboxRecordRef,
    pub member_ref: GlobalMemberRef,
    pub subject_ref: IdentityOutboxSubjectRef,
    pub change_kind_ref: IdentityChangeKindRef,
    pub payload_marker_ref: IdentityOutboxPayloadMarkerRef,
    pub topic_key_ref: TopicKeyRef,
    pub trace_record_ref: IdentityTraceRecordRef,
    pub outbox_state_kind: OutboxStateKind,
    pub attempt_ref: Option<OutboxDeliveryAttemptRef>,
    pub issue_ref: Option<OutboxDeliveryIssueRef>,
    pub created_at: IdentityTimestamp,
    pub updated_at: IdentityTimestamp,
    pub visibility_result_ref: VisibilityResultRef,
}
```

| 响应字段 | 字段来源 | 约束 |
|---|---|---|
| `outbox_record_ref` | loaded `IdentityOutboxRecord.outbox_record_ref` | 不从 subject/topic/trace 拼接 |
| `member_ref` | loaded record | accepted truth 主语 marker;不等于 actor |
| `subject_ref` | loaded record / accepted subject mapper | 不强转 trace/audit subject |
| `change_kind_ref` | loaded record | accepted change kind;不从 payload body读取 |
| `payload_marker_ref` | loaded record | body-free marker;不展开 event body |
| `topic_key_ref` | loaded record | topic boundary ref;不返回 broker route/secret |
| `trace_record_ref` | loaded record | accepted trace ref;不读取 trace body |
| state / attempt / issue | loaded `OutboxState` | published 只代表 outbound boundary;issue safe marker only |
| `created_at` / `updated_at` | loaded record | time marker;不替代 cursor/version |
| `visibility_result_ref` | `resolve_outbox_record_read(...)` / visibility output | per-item visibility marker |

#### 14.7.4 DTO -> repository / visibility 构造闭环

| selector | repository read | visibility source | public behavior |
|---|---|---|---|
| `Pending` | `list_pending_outbox_records(topic_key_ref, page)` then `get_outbox_record_with_version(...)` | list precheck uses `resolve_outbox_record_read(None, None, topic_key_ref, ...)`;per-item uses loaded outbox ref/subject/topic | empty -> `Empty`;no publish/retry |
| `Retryable` | `list_retryable_outbox_records(topic_key_ref, page)` then load records | same as pending | retryable 是 state view,query 不执行 retry |
| `BySubject` | `list_outbox_records_by_subject(subject_ref, page)` then load records | request subject -> `resolve_outbox_record_read(None, Some(subject_ref), None, ...)`;per-item visibility also checked | subject not visible -> `NotVisible`,not empty |
| `ByMember` | `IdentityTruthChangeSubjectMapper.member_subjects(member_ref).outbox_subject_ref` then by subject | formal mapper output | mapper missing/degraded -> `Degraded`;不拼 subject |
| `ByTrace` | `find_outbox_records_by_trace(trace_record_ref, page)` then load records | loaded record outbox ref/subject/topic | missing relation -> `Empty`;不补 outbox |

### 14.8 `GetIdentityOutboxState` protocol

#### 14.8.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_query(IdentityQueryRequest<GetIdentityOutboxStateRequest>) -> Result<IdentityQueryResponse<IdentityOutboxStateView>, ApplicationError>` |
| HTTP / RPC 名称 | API query dispatch route for `GetIdentityOutboxState`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / operations consumer |
| 处理方 | `identity-application` query service through `IdentityApplicationFacade::dispatch_query` |

#### 14.8.2 请求 schema

```rust
/// Request body for reading one outbox record state.
pub struct GetIdentityOutboxStateRequest {
    /// Outbox record being inspected.
    pub outbox_record_ref: IdentityOutboxRecordRef,

    /// Boundary consumer requesting outbox state.
    pub consumer_ref: ConsumerRef,
}
```

| 输入字段 | 类型 | 目标读取 / visibility 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `outbox_record_ref` | `IdentityOutboxRecordRef` | `get_outbox_record_with_version(...)`, visibility seed | request body / accepted effect / outbox list result | 必填;missing -> `Missing` |
| `consumer_ref` | `ConsumerRef` | `resolve_outbox_record_read(Some(outbox_record_ref), ...)` | request body / API consumer context | 必填 |
| `visibility_context_ref` | `VisibilityContextRef` | visibility context | `IdentityQueryMetadata.visibility_context_ref` | 必填 |

#### 14.8.3 响应 view schema

```rust
/// Public body-free outbox state view.
pub struct IdentityOutboxStateView {
    pub outbox_record_ref: IdentityOutboxRecordRef,
    pub subject_ref: IdentityOutboxSubjectRef,
    pub topic_key_ref: TopicKeyRef,
    pub trace_record_ref: IdentityTraceRecordRef,
    pub outbox_state_kind: OutboxStateKind,
    pub attempt_ref: Option<OutboxDeliveryAttemptRef>,
    pub issue_ref: Option<OutboxDeliveryIssueRef>,
    pub payload_marker_ref: IdentityOutboxPayloadMarkerRef,
    pub changed_at: IdentityTimestamp,
    pub visibility_result_ref: VisibilityResultRef,
}
```

| 响应字段 | 字段来源 | 约束 |
|---|---|---|
| `outbox_record_ref` | loaded record | request and loaded record must match |
| `subject_ref` / `topic_key_ref` / `trace_record_ref` | loaded record | refs only;no payload/topic private body |
| `outbox_state_kind` / `attempt_ref` / `issue_ref` | loaded `OutboxState` | `Published` 不等于 downstream consumed;failed/skipped 保留 issue marker |
| `payload_marker_ref` | loaded record | body-free;不展开 event payload |
| `changed_at` | loaded `OutboxState.changed_at` | state timestamp;不替代 cursor |
| `visibility_result_ref` | `resolve_outbox_record_read(...)` / visibility output | not visible/redacted/degraded marker |

#### 14.8.4 DTO -> repository / visibility 构造闭环

| 输入契约 | 目标读取 / assembler | 必填字段是否齐全 | 派生字段来源 | 缺失时行为 |
|---|---|---|---|---|
| `IdentityQueryRequest<GetIdentityOutboxStateRequest>` | initial visibility seed | 齐全: outbox ref, consumer, visibility context | `resolve_outbox_record_read(Some(outbox_record_ref), None, None, ...)` | access summary missing -> `NotVisible` / `Degraded` |
| same | outbox load | 齐全: outbox ref | `get_outbox_record_with_version(outbox_record_ref)` | missing -> `Missing`,不创建 outbox |
| loaded record | final visibility / consistency | 齐全: subject/topic from record | optional second visibility classification may pass `Some(subject_ref), Some(topic_key_ref)` | mismatch / forbidden body marker -> degraded |
| output | `IdentityQueryResponse<IdentityOutboxStateView>` | 齐全: state + markers | fields copied from record/state | no publish / no retry / no downstream lookup |

### 14.9 `GetTraceHandoffState` protocol

#### 14.9.1 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_query(IdentityQueryRequest<GetTraceHandoffStateRequest>) -> Result<IdentityQueryResponse<TraceHandoffStateView>, ApplicationError>` |
| HTTP / RPC 名称 | API query dispatch route for `GetTraceHandoffState`;具体 HTTP path 留 Step 14 route binding |
| 调用方 | API / SDK / operations consumer |
| 处理方 | `identity-application` query service through `IdentityApplicationFacade::dispatch_query` |

#### 14.9.2 请求 schema

```rust
/// Request body for reading trace handoff state without delivery side effects.
pub struct GetTraceHandoffStateRequest {
    /// Handoff intent being inspected.
    pub handoff_intent_ref: TraceHandoffIntentRef,

    /// Boundary consumer requesting handoff state.
    pub consumer_ref: ConsumerRef,
}
```

| 输入字段 | 类型 | 目标读取 / visibility 输入 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `handoff_intent_ref` | `TraceHandoffIntentRef` | `get_handoff_intent_with_version(...)`, visibility seed | request body / command result / job report | 必填;missing -> `Missing` |
| `consumer_ref` | `ConsumerRef` | `resolve_handoff_intent_read(...)` | request body / API consumer context | 必填 |
| `visibility_context_ref` | `VisibilityContextRef` | visibility context | `IdentityQueryMetadata.visibility_context_ref` | 必填 |

#### 14.9.3 响应 view schema

```rust
/// Public body-free trace handoff state view.
pub struct TraceHandoffStateView {
    pub handoff_intent_ref: TraceHandoffIntentRef,
    pub member_ref: GlobalMemberRef,
    pub trace_record_refs: Vec<IdentityTraceRecordRef>,
    pub audit_trail_ref: Option<AuditTrailRef>,
    pub handoff_target_ref: HandoffTargetRef,
    pub handoff_scope_ref: HandoffScopeRef,
    pub safe_material_ref: TraceHandoffSafeMaterialRef,
    pub handoff_state_kind: HandoffStateKind,
    pub attempt_ref: Option<HandoffAttemptRef>,
    pub receipt_ref: Option<HandoffReceiptRef>,
    pub issue_ref: Option<HandoffIssueRef>,
    pub created_at: IdentityTimestamp,
    pub updated_at: IdentityTimestamp,
    pub changed_at: IdentityTimestamp,
    pub visibility_result_ref: VisibilityResultRef,
}
```

| 响应字段 | 字段来源 | 约束 |
|---|---|---|
| `handoff_intent_ref` | loaded intent | request and loaded intent must match |
| `member_ref` / `trace_record_refs` / `audit_trail_ref` | loaded intent | refs only;不返回 trace/audit body |
| `handoff_target_ref` / `handoff_scope_ref` | loaded intent | boundary refs;不展开 target path/bucket/secret |
| `safe_material_ref` | loaded intent | body-free marker;不返回 archive package/raw log |
| `handoff_state_kind` / `attempt_ref` / `receipt_ref` / `issue_ref` | loaded `HandoffState` | delivered 必须有 receipt marker;receipt body 不入 DTO |
| `created_at` / `updated_at` / `changed_at` | loaded intent/state | time markers;不替代 cursor/version |
| `visibility_result_ref` | `resolve_handoff_intent_read(...)` / visibility output | not visible/redacted/degraded marker |

#### 14.9.4 DTO -> repository / visibility 构造闭环

| 输入契约 | 目标读取 / assembler | 必填字段是否齐全 | 派生字段来源 | 缺失时行为 |
|---|---|---|---|---|
| `IdentityQueryRequest<GetTraceHandoffStateRequest>` | visibility precheck | 齐全: intent ref, consumer, visibility context | `resolve_handoff_intent_read(handoff_intent_ref, ...)` | access summary missing -> `NotVisible` / `Degraded` |
| same | handoff intent load | 齐全: intent ref | `get_handoff_intent_with_version(handoff_intent_ref)` | missing -> `Missing`,不创建 intent |
| loaded intent | public view | 齐全: loaded intent + state | fields copied from `TraceHandoffIntent` / `HandoffState` | pending/delivered/failed/cancelled 显式暴露 |
| output | `IdentityQueryResponse<TraceHandoffStateView>` | 齐全: query name、surface、optional body | surface from visibility + `HandoffStateKind` | no delivery / no retry / no fake delivered |

### 14.10 8.3-c 构造闭环汇总

| 检查项 | 结论 | 说明 |
|---|---|---|
| query envelope 是否沿用 8.1 | 通过 | 六条 query 均使用 `IdentityQueryRequest<T>`、`IdentityQueryResponse<T>` 或 `IdentityPageResponse<T>` |
| public page 是否闭合 | 通过 | report/outbox list 使用 `IdentityPublicPageRequest` / `IdentityPublicPageInfo`;不新增 `ReportCursorRef` / `OutboxCursorRef` |
| visibility subject/scope 是否闭合 | 通过 | Step 7 已有 projection/reference/outbox/handoff resolver,本批补 report scope resolver |
| stable state/report/ref 来源是否闭合 | 通过 | state/report/outbox/handoff ref 均来自 request、repo lookup 或 loaded object;不得拼接 |
| query no-write 是否闭合 | 通过 | 不 rebuild、refresh、reconcile、publish、deliver、retry、append trace/audit/outbox |
| forbidden body 是否排除 | 通过 | projection body、external body、raw diagnostic、payload body、topic secret、receipt body、target path 均禁止 |
| HLD optional `ConsistencyHintRef` 是否进入 | 不进入 | 仍无 Step 6/7 formal schema;留 Step 9/12/13,本批不新增字段 |
| 是否新增 Step 6 object/state | 未新增 | 只定义 Step 8 public DTO/view/selector;未新增 truth object |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一步 | 8.4 | 用户审核通过后进入 inbound event / callback protocols |

### 14.11 8.3-c 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只覆盖 8.3-c 六条 query | 通过 | 未写 8.4 inbound payload、8.5 outbound payload 或 8.6 job DTO |
| projection query 是否禁止临时 ref | 通过 | `ProjectionStateRef` 来自 request/lookup/load,不得由 projection ref 拼接 |
| reference query 是否禁止 external refresh | 通过 | 只读 stored state/sidecar,不调用 resolver |
| report query 是否有 scope visibility 前置 | 通过 | 已回 Step 7 补 `resolve_reconciliation_scope_read(...)` |
| outbox list optional 组合是否收敛 | 通过 | 使用 `IdentityOutboxListSelector`,每个分支对应一个 Step 7 read surface |
| handoff state 是否防 fake delivered | 通过 | response 只读 state,`Delivered` 必须带 `HandoffReceiptRef` marker |
| page/cursor 是否避免混用 | 通过 | public page cursor 不等于 truth/projection/job/source/version cursor |
| not visible / missing / empty 是否区分 | 通过 | 统一由 `IdentityQuerySurface` 表达 |
| 是否记录后续待确认 | 通过 | partial item priority、redaction matrix、latest report 等留 Step 9/10/11/12 |

### 14.12 8.3-c 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| projection state ref | `find_projection_state_ref(projection_ref)` 或 loaded `ProjectionState.projection_state_ref` | `format!("projection-state:{projection_ref}")` |
| projection stale | 返回 `StaleVisible` / `Degraded` / `Rebuilding` surface | query 内触发 `RebuildIdentityProjection` |
| reference state | `get_reference_state_with_version(external_reference_ref)` 后只读 state/sidecar refs | query 调外部 resolver 重新解析 |
| reference safe summary | 返回 `ExternalReferenceSafeSummaryRef` marker | 返回 method/work/memory/archive/governance body |
| report scope | 先 `resolve_reconciliation_scope_read(scope, ...)`,再 `list_reports_by_scope(...)` | 先扫描所有 report,再从 report id 推断 scope 可见性 |
| report cursor | 使用 `IdentityPublicPageRequest.cursor` | 新增未闭口 `ReportCursorRef` public schema |
| outbox list | `IdentityOutboxListSelector::Pending { topic_key_ref }` 对应 `list_pending_outbox_records(...)` | 同时传 member/topic/state 三个 optional 字段让 service 猜优先级 |
| member outbox subject | `IdentityTruthChangeSubjectMapper.member_subjects(member).outbox_subject_ref` | 拼 `identity:member:<id>` 或把 trace subject 强转 outbox subject |
| outbox payload | DTO 返回 `IdentityOutboxPayloadMarkerRef` | 展开 outbound event body、broker route、secret 或 publisher response |
| published state | `Published` 只解释为 outbound boundary accepted | 当作所有 downstream consumer 已处理 |
| handoff delivered | `Delivered` 同时带 `HandoffReceiptRef` marker | request sent、HTTP 2xx、job log success 就标 delivered |
| handoff state query | 只读 `TraceHandoffIntent` / `HandoffState` | query 调 delivery adapter 或 retry runner |
| not visible | `IdentityQuerySurface.disposition = NotVisible`,body/items 空 | 返回 `Missing` 泄漏权限原因或返回 `Empty` 掩盖权限 |
| raw diagnostics | 返回 `MaintenanceIssueRef` / `HandoffIssueRef` marker | 返回 stack trace、adapter error body、archive package、raw log |

---

## 15. 8.4 inbound event / callback protocols

### 15.1 本批目标与边界

本批只定义五条 inbound event / callback protocol:

- `HandleRoleCapabilitySourceChanged`
- `HandleWorkParticipationAccepted`
- `HandleMemoryReferenceSourceStateChanged`
- `HandleArchiveHandoffResult`
- `HandleTraceHandoffResult`

它们必须沿用 8.1 的 `IdentityInboundEventEnvelope<T>`、`IdentityConsumerReceipt`、`IdentityConsumerOutcome`、`IdentityStoredResultRef` 和 `IdentityProtocolValidationIssueRef`。本批不定义 outbound event payload、不定义 publish/deliver job DTO、不定义 worker ack/dead-letter transport status、不定义完整 retry/backoff、不定义 HTTP callback route、不定义 Step 13 duplicate replay matrix。

本批固定共同规则:

- event / callback entry 只接受 typed refs、version marker、safe summary marker、state marker、receipt/issue marker 和 trace context marker;不得保存 raw envelope、source event body、method/work/memory/archive body、receipt body、adapter raw response、secret、credential 或 debug body。
- `IdentityInboundEventEnvelope<T>.source_event_ref` 和 `idempotency_key` 是 duplicate guard 的 public input。payload 不重复 envelope 字段,也不得用 payload hash 临时替代 source event id。
- application service 返回统一 `IdentityConsumerReceipt`;callback 也复用该 receipt surface,但 stored result kind 必须区分 `ConsumerReceipt` 与 `HandoffCallbackReceipt`。
- receipt `trace_refs`、`outbox_refs`、`issue_refs` 只保存 refs/markers。accepted side effect 的 trace/outbox/cursor 写入顺序、transaction order 和 duplicate replay 留 Step 9/11/13。
- rejected / quarantined / delayed retry / unsupported version 均返回 `IdentityConsumerReceipt` with safe issue refs;具体 public priority 留 Step 10/12/13。
- inbound consumer 可以更新 identity-owned truth/state 或 reference state,但只能通过 Step 7 repository/UoW/stored result surface;worker entry 不得直连 repository、resolver、publisher、handoff adapter 或 stored result。
- callback delivered / archived / migrated 等状态必须来自 formal marker;`HandoffReceiptRef` / `ArchiveHandoffRef` / safe handoff marker 不得被 raw HTTP 2xx、request sent、job log success 或 adapter raw response 替代。

### 15.2 Protocol batch table

| Consumer / Callback | Envelope DTO | Payload DTO | Receipt DTO | 主要读取/写入对象 | 依赖 Step 7 port/helper | 后续 flow |
|---|---|---|---|---|---|---|
| `HandleRoleCapabilitySourceChanged` | `IdentityInboundEventEnvelope<RoleCapabilitySourceChangedPayload>` | `RoleCapabilitySourceChangedPayload` | `IdentityConsumerReceipt` | `RoleCapabilitySourceSnapshot`, `RoleCapabilitySummary`, reference state/sidecar | role repository, reference repository, stored result, idempotency | `HandleRoleCapabilitySourceChangedFlow` |
| `HandleWorkParticipationAccepted` | `IdentityInboundEventEnvelope<WorkParticipationAcceptedPayload>` | `WorkParticipationAcceptedPayload` | `IdentityConsumerReceipt` | `GlobalMember`, `CareerRecord` | member/career repository, stored result, idempotency | `HandleWorkParticipationAcceptedFlow` |
| `HandleMemoryReferenceSourceStateChanged` | `IdentityInboundEventEnvelope<MemoryReferenceSourceStateChangedPayload>` | `MemoryReferenceSourceStateChangedPayload` | `IdentityConsumerReceipt` | `MemoryReference`, `MemoryReferenceState`, reference state/sidecar | member/memory/reference repository, stored result, idempotency | `HandleMemoryReferenceSourceStateChangedFlow` |
| `HandleArchiveHandoffResult` | `IdentityInboundEventEnvelope<ArchiveHandoffResultPayload>` | `ArchiveHandoffResultPayload` | `IdentityConsumerReceipt` | `MemoryReference`, `MemoryReferenceState` | memory repository callback lookup, stored result, idempotency | `HandleArchiveHandoffResultFlow` |
| `HandleTraceHandoffResult` | `IdentityInboundEventEnvelope<TraceHandoffResultPayload>` | `TraceHandoffResultPayload` | `IdentityConsumerReceipt` | `TraceHandoffIntent`, `HandoffState` | handoff intent repository, stored callback result, idempotency | `HandleTraceHandoffResultFlow` |

### 15.3 Shared envelope / receipt / stored replay construction

| 阶段 | 输入 | 正式来源 | 输出 | 禁止事项 |
|---|---|---|---|---|
| worker envelope | `IdentityInboundEventEnvelope<T>` | worker parser / callback adapter | consumer name, binding ref, source event ref, idempotency key, schema version, trace context, typed payload | 不保存 raw message、headers、secret、source JSON |
| operation context | envelope marker + binding + dedupe | Step 7 `IdentityOperationContextFactoryPort::from_worker_event_entry(...)` or `from_worker_callback_entry(...)` | `IdentityOperationContext` with `InboundEvent` / `HandoffCallback` channel | consumer service 不猜 channel |
| idempotency reserve | context + digest | Step 7 `IdentityIdempotencyRepository.reserve(...)` | reserved / replay / conflict / in-flight | repository 不硬编码 channel;duplicate 不重跑 mutation |
| payload validation | typed payload fields | this section + Step 6 refs/markers | accepted candidate or issue refs | 不从 raw body补 typed ref;不解析 opaque id |
| domain/service write | loaded truth/state + policy | Step 7 repositories + UoW | updated truth/state/reference/report marker | worker entry 不直连 store;query/job path 不混用 |
| side effects | accepted consumer/callback result | trace/outbox/projection/stored result builders | trace refs, outbox refs, issue refs, stored result ref | trace/outbox 不保存 forbidden body |
| receipt | service outcome + stored result | `IdentityConsumerReceipt` | public receipt/replay surface | 不另造 callback receipt 壳 |

`IdentityOperationContext` 是 Step 7 application-local facade 参数,不是 public DTO 字段。Public protocol surface 仍只暴露 `IdentityInboundEventEnvelope<T>`、payload DTO 和 `IdentityConsumerReceipt`;worker entry 负责把 envelope marker / binding / idempotency material 映射成 operation context 后再调用 facade。

`IdentityConsumerOutcome` use in this batch:

| 情况 | outcome | 必填 marker | 说明 |
|---|---|---|---|
| fresh accepted mutation | `Accepted` | `receipt_ref`, `stored_result_ref`, trace/outbox refs as applicable | 只表示 identity application accepted,不是 worker ack status |
| same key same digest completed | `DuplicateReplayed` | stored result ref | 不重跑 mutation |
| invalid payload / policy denied | `Rejected` | safe issue refs | rejection 分类细节留 Step 12 |
| missing dependency / untrusted source / needs manual review | `Quarantined` | safe issue refs | 是否持久化 pending state 留 Step 9/10/12 |
| transient dependency unavailable | `DelayedRetry` | safe issue refs | retry/backoff 留 Step 12/14 |
| already reflected source marker / no new state | `Noop` | stored result ref, optional trace refs | no-op 不等于 missing stored result |
| schema unsupported | `UnsupportedVersion` | issue refs | worker ack/dead-letter mapping 留 Step 12/14 |

### 15.4 `HandleRoleCapabilitySourceChanged` protocol

#### 15.4.1 函数签名 / dispatch

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_inbound_event(IdentityOperationContext, IdentityInboundEventEnvelope<RoleCapabilitySourceChangedPayload>) -> Result<IdentityConsumerReceipt, ApplicationError>` |
| worker 名称 | `HandleRoleCapabilitySourceChanged` |
| 调用方 | method-library event publisher / worker event adapter |
| 处理方 | `identity-application` consumer service through `IdentityApplicationFacade::dispatch_inbound_event` |

#### 15.4.2 payload schema

```rust
/// Body-free method-library role/capability source change payload.
pub struct RoleCapabilitySourceChangedPayload {
    pub member_ref: GlobalMemberRef,
    pub source_ref: RoleCapabilitySourceRef,
    pub source_version_ref: RoleCapabilitySourceVersionRef,
    pub source_state_kind: RoleCapabilitySourceStateKind,
    pub safe_summary_ref: Option<RoleCapabilitySafeSummaryRef>,
    pub evidence_refs: Vec<CapabilityEvidenceRef>,
    pub external_reference_ref: Option<ExternalReferenceRef>,
    pub reference_owner_ref: Option<IdentityReferenceOwnerRef>,
    pub change_reason_ref: Option<RoleCapabilityChangeReasonRef>,
    pub material_marker: RoleCapabilityChangeMaterialMarker,
}
```

| 字段 | 字段来源 | 目标对象 / port | 缺失处理 |
|---|---|---|---|
| `member_ref` | payload body-free member marker | role summary relation / trace/outbox subject | 必填;不从 source ref 推 member |
| `source_ref` | method-library source event marker | `RoleCapabilitySourceSnapshot.source_ref` | 必填 |
| `source_version_ref` | method-library version marker | snapshot stale/superseded source version | 必填;不当 optimistic version |
| `source_state_kind` | upstream safe state marker | snapshot state / summary stale/unavailable decision | 必填 |
| `safe_summary_ref` | resolver/event safe summary marker | snapshot safe summary;required when resolved | missing resolved summary -> rejected/quarantined |
| `evidence_refs` | upstream evidence markers | snapshot evidence refs / policy check | optional by state;不保存 evidence body |
| `external_reference_ref` / `reference_owner_ref` | optional reference bundle marker | `IdentityReferenceStateRepository` state/sidecar update | both present for reference sidecar update;partial -> degraded/rejected |
| `change_reason_ref` | optional body-free reason marker | trace/result marker | optional;不保存 reason body |
| `material_marker` | forbidden body guard | `RoleCapabilitySourcePolicy.assert_no_forbidden_body(...)` | forbidden -> rejected/quarantined |

#### 15.4.3 DTO -> object / repository closure

| 输入契约 | 目标 | 是否闭合 | 说明 |
|---|---|---|---|
| payload source fields | `RoleCapabilitySourceSnapshot::from_resolved_source(...)` / unavailable / unrecognized / stale update | 闭合 | id/time 由 service/id generator/clock 准备;source ref/version/state 来自 payload;unavailable / unrecognized factory 也必须传入 payload `source_version_ref`;payload 不生成 id |
| optional external reference bundle | `ReferenceResolutionState` / typed sidecar save | 闭合但条件化 | 只有 external reference + owner 都存在时更新同 bundle;expected_version 来自 `get_reference_state_with_version(...)` |
| source event accepted | trace/outbox/stale projection material | 后续 flow | Step 9 定义 transaction order和 outbox payload marker |
| receipt | `IdentityConsumerReceipt` + typed stored `ConsumerReceipt` envelope | 闭合 | `save_consumer_receipt(...)` 保存完整 public receipt replay envelope,不保存 payload body |

### 15.5 `HandleWorkParticipationAccepted` protocol

#### 15.5.1 函数签名 / dispatch

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_inbound_event(IdentityOperationContext, IdentityInboundEventEnvelope<WorkParticipationAcceptedPayload>) -> Result<IdentityConsumerReceipt, ApplicationError>` |
| worker 名称 | `HandleWorkParticipationAccepted` |
| 调用方 | L1-work event publisher / worker event adapter |
| 处理方 | `identity-application` consumer service through `IdentityApplicationFacade::dispatch_inbound_event` |

#### 15.5.2 payload schema

```rust
/// Body-free work participation accepted payload.
pub struct WorkParticipationAcceptedPayload {
    pub member_ref: GlobalMemberRef,
    pub project_participation_ref: ProjectParticipationRef,
    pub work_source_ref: WorkSourceRef,
    pub career_source_marker_ref: CareerSourceMarkerRef,
    pub safe_summary_ref: CareerSafeSummaryRef,
    pub append_reason_ref: Option<CareerAppendReasonRef>,
    pub material_marker: CareerAppendMaterialMarker,
}
```

| 字段 | 字段来源 | 目标对象 / port | 缺失处理 |
|---|---|---|---|
| `member_ref` | work accepted fact marker | `GlobalMemberRepository`, `CareerRecord.member_ref` | 必填;成员 missing -> rejected/quarantined |
| `project_participation_ref` | work participation ref | `CareerRecord.project_participation_ref` / policy source guard | 必填 |
| `work_source_ref` | work source boundary marker | `CareerAppendPolicy.assert_source_trusted(...)` | 必填 |
| `career_source_marker_ref` | duplicate source marker | `CareerRecordRepository.find_by_source_marker(...)` | 必填;不等于 idempotency key |
| `safe_summary_ref` | body-free career summary marker | `CareerRecord.safe_summary_ref` | 必填;不保存 work body |
| `append_reason_ref` | optional append reason marker | trace/result marker | optional |
| `material_marker` | forbidden body guard | `CareerAppendPolicy.assert_not_work_truth_write(...)` | forbidden -> rejected/quarantined |

#### 15.5.3 DTO -> object / repository closure

| 输入契约 | 目标 | 是否闭合 | 说明 |
|---|---|---|---|
| member/source fields | `CareerAppendPolicy::for_append(...)` | 闭合 | loaded member + duplicate source lookup + operation channel |
| accepted payload | `CareerRecord::append_from_work_source(...)` | 闭合 | new record ref/time 由 service/id generator/clock 准备 |
| duplicate source | receipt `Noop` or `DuplicateReplayed` | 后续细化 | Step 13 决定 stored replay vs source duplicate no-op priority |
| accepted append | trace/outbox/stale projection material | 后续 flow | Step 9 定义 accepted side effect |

### 15.6 `HandleMemoryReferenceSourceStateChanged` protocol

#### 15.6.1 函数签名 / dispatch

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_inbound_event(IdentityOperationContext, IdentityInboundEventEnvelope<MemoryReferenceSourceStateChangedPayload>) -> Result<IdentityConsumerReceipt, ApplicationError>` |
| worker 名称 | `HandleMemoryReferenceSourceStateChanged` |
| 调用方 | memory/archive source event publisher / worker event adapter |
| 处理方 | `identity-application` consumer service through `IdentityApplicationFacade::dispatch_inbound_event` |

#### 15.6.2 payload schema

```rust
/// Body-free memory/archive carrier source state payload.
pub struct MemoryReferenceSourceStateChangedPayload {
    pub member_ref: GlobalMemberRef,
    pub memory_reference_ref: Option<MemoryReferenceRef>,
    pub source_ref: MemoryReferenceSourceRef,
    pub memory_ref: Option<MemoryRef>,
    pub archive_ref: Option<ArchiveRef>,
    pub target_state_kind: MemoryReferenceStateKind,
    pub safe_summary_ref: Option<MemorySafeSummaryRef>,
    pub external_reference_ref: Option<ExternalReferenceRef>,
    pub reference_owner_ref: Option<IdentityReferenceOwnerRef>,
    pub reason_ref: Option<MemoryReferenceReasonRef>,
    pub material_marker: MemoryReferenceChangeMaterialMarker,
}
```

| 字段 | 字段来源 | 目标对象 / port | 缺失处理 |
|---|---|---|---|
| `member_ref` | source event member marker | member/memory repository guard | 必填 |
| `memory_reference_ref` | optional local relation ref | `MemoryReferenceRepository.get_memory_reference_with_version(...)` | optional;missing lookup strategy留 Step 9 |
| `source_ref` | memory/archive source marker | `MemoryReferencePolicy.assert_source_trusted(...)` | 必填 |
| `memory_ref` / `archive_ref` | optional carrier refs | `MemoryReference` relation fields | at least one required for linked/archive-related states |
| `target_state_kind` | safe state marker | `MemoryReferenceState` candidate | 必填;state matrix 留 Step 10 |
| `safe_summary_ref` | body-free memory/archive summary marker | relation safe summary | required for linked/migrated/archived when policy says usable |
| `external_reference_ref` / `reference_owner_ref` | optional reference bundle marker | reference state/sidecar update | both present or neither |
| `reason_ref` | optional reason marker | trace/result marker | optional |
| `material_marker` | forbidden body guard | `MemoryReferencePolicy.assert_body_free(...)` | forbidden -> rejected/quarantined |

#### 15.6.3 DTO -> object / repository closure

| 输入契约 | 目标 | 是否闭合 | 说明 |
|---|---|---|---|
| source state payload | `MemoryReferencePolicy::for_refresh(...)` / state update | 闭合 | loaded member + optional loaded memory reference + body-free source summary |
| optional reference bundle | `ReferenceResolutionState` / typed sidecar save | 闭合但条件化 | same external reference bundle rule as 8.3-c |
| accepted state update | trace/outbox/stale projection material | 后续 flow | Step 9 定义 exact state transition and side effects |
| missing relation | rejected/quarantine/pending review | 后续细化 | Step 9/10/12 决定是否 create relation or report-only;本批不私造 |

### 15.7 `HandleArchiveHandoffResult` protocol

#### 15.7.1 函数签名 / dispatch

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_callback(IdentityOperationContext, IdentityInboundEventEnvelope<ArchiveHandoffResultPayload>) -> Result<IdentityConsumerReceipt, ApplicationError>` |
| worker 名称 | `HandleArchiveHandoffResult` |
| 调用方 | archive/memory handoff adapter / callback event adapter |
| 处理方 | `identity-application` callback service through `IdentityApplicationFacade::dispatch_callback` |

#### 15.7.2 payload schema

```rust
/// Body-free archive/memory handoff result payload for memory reference state.
pub struct ArchiveHandoffResultPayload {
    pub member_ref: GlobalMemberRef,
    pub memory_reference_ref: Option<MemoryReferenceRef>,
    pub archive_ref: ArchiveRef,
    pub archive_handoff_ref: ArchiveHandoffRef,
    pub target_state_kind: MemoryReferenceStateKind,
    pub reason_ref: Option<MemoryReferenceReasonRef>,
    pub issue_ref: Option<HandoffIssueRef>,
    pub material_marker: MemoryReferenceChangeMaterialMarker,
}
```

| 字段 | 字段来源 | 目标对象 / port | 缺失处理 |
|---|---|---|---|
| `member_ref` | callback/event marker | member/memory relation guard | 必填 |
| `memory_reference_ref` | optional local relation ref | direct memory relation lookup | optional;if absent, service may use `find_callback_target_by_handoff(...)` in Step 9 |
| `archive_ref` | archive boundary ref | `MemoryReference` archive relation | 必填;不保存 archive package |
| `archive_handoff_ref` | archive handoff marker | callback target lookup / state update marker | 必填 |
| `target_state_kind` | safe result state marker | `MemoryReferenceState` candidate | 必填;must be memory relation state,not `HandoffState` |
| `reason_ref` | optional reason marker | trace/result marker | optional |
| `issue_ref` | optional handoff issue marker | failed/pending states | required when failed by Step 10 rules |
| `material_marker` | forbidden body guard | `MemoryReferencePolicy.assert_handoff_marker_body_free(...)` | forbidden -> rejected/quarantined |

#### 15.7.3 DTO -> object / repository closure

| 输入契约 | 目标 | 是否闭合 | 说明 |
|---|---|---|---|
| callback target | `MemoryReferenceRepository.find_callback_target_by_handoff(...)` or direct ref load | 闭合 | lookup returns body-free relation ref only |
| result marker | `MemoryReferencePolicy::for_archive_handoff(...)` | 闭合 | no archive package,receipt body or raw adapter response |
| accepted state update | `MemoryReferenceState` update + trace/outbox/stale projection | 后续 flow | Step 9/10 decide exact state transitions |
| callback receipt | typed stored `HandoffCallbackReceipt` envelope | 闭合 | via `save_handoff_callback_receipt(...)`;no external receipt body |

### 15.8 `HandleTraceHandoffResult` protocol

#### 15.8.1 函数签名 / dispatch

| 项 | 内容 |
|---|---|
| 函数签名 | `dispatch_callback(IdentityOperationContext, IdentityInboundEventEnvelope<TraceHandoffResultPayload>) -> Result<IdentityConsumerReceipt, ApplicationError>` |
| worker 名称 | `HandleTraceHandoffResult` |
| 调用方 | handoff target / archive / observability / audit callback adapter |
| 处理方 | `identity-application` callback service through `IdentityApplicationFacade::dispatch_callback` |

#### 15.8.2 payload schema

```rust
/// Body-free trace handoff receipt/failure payload.
pub struct TraceHandoffResultPayload {
    pub handoff_intent_ref: TraceHandoffIntentRef,
    pub handoff_target_ref: HandoffTargetRef,
    pub handoff_scope_ref: Option<HandoffScopeRef>,
    pub attempt_ref: HandoffAttemptRef,
    pub result_kind: TraceHandoffResultKind,
    pub receipt_ref: Option<HandoffReceiptRef>,
    pub issue_ref: Option<HandoffIssueRef>,
}

pub enum TraceHandoffResultKind {
    Delivered,
    RetryableFailed,
    Failed,
    Cancelled,
}
```

| 字段 | 字段来源 | 目标对象 / port | 缺失处理 |
|---|---|---|---|
| `handoff_intent_ref` | callback marker | `TraceHandoffIntentRepository.get_handoff_intent_with_version(...)` | 必填 |
| `handoff_target_ref` | callback target marker | intent target consistency guard | 必填 |
| `handoff_scope_ref` | optional scope marker | intent scope consistency guard | optional;missing exact rule留 Step 9/12 |
| `attempt_ref` | delivery attempt marker | `HandoffState` transition | 必填;not delivered by itself |
| `result_kind` | callback result marker | state transition selector | 必填 |
| `receipt_ref` | delivered receipt marker | `HandoffState::delivered(...)`, `HandoffPolicy.assert_receipt_is_marker(...)` | required when `Delivered` |
| `issue_ref` | failure/cancel issue marker | retryable/failed/cancelled state | required for failed/cancelled by Step 10 rules |

#### 15.8.3 DTO -> object / repository closure

| 输入契约 | 目标 | 是否闭合 | 说明 |
|---|---|---|---|
| callback payload | `TraceHandoffIntent` load and target/attempt consistency | 闭合 | loaded version is save expected_version |
| delivered marker | `HandoffPolicy.assert_receipt_is_marker(...)` + `HandoffState::delivered(...)` | 闭合 | delivered without receipt is rejected/quarantined |
| failed marker | `HandoffState::retryable_failed(...)` / `failed(...)` / `cancelled(...)` | 闭合 | issue marker body-free;no raw adapter error |
| callback receipt | `IdentityConsumerReceipt` + typed stored `HandoffCallbackReceipt` envelope | 闭合 | via `save_handoff_callback_receipt(...)`;duplicate replay returns stored envelope receipt,no mutation |

### 15.9 Receipt / stored result closure

```rust
/// Body-free receipt marker used by inbound event/callback stored replay.
pub struct IdentityConsumerReceiptSurfaceMarker {
    pub receipt_ref: IdentityConsumerReceiptRef,
    pub consumer_name: IdentityInboundConsumerName,
    pub outcome: IdentityConsumerOutcome,
    pub trace_refs: Vec<IdentityTraceRecordRef>,
    pub outbox_refs: Vec<IdentityOutboxRecordRef>,
    pub issue_refs: Vec<IdentityProtocolValidationIssueRef>,
}

pub struct IdentityConsumerReceiptEnvelope {
    pub stored_result_ref: IdentityStoredResultRef,
    pub operation_context_ref: IdentityOperationContextRef,
    pub result_kind: IdentityStoredResultKind,
    pub surface_marker_ref: IdentityStoredSurfaceMarkerRef,
    pub receipt: IdentityConsumerReceipt,
    pub recorded_at: IdentityTimestamp,
}
```

| result kind | save surface | 用于 | 禁止事项 |
|---|---|---|---|
| `ConsumerReceipt` | `IdentityStoredResultRepository.save_consumer_receipt(...)` / `get_consumer_receipt(...)` | role/work/memory inbound consumer replay | 不保存 event payload body;不得只保存 generic shell |
| `HandoffCallbackReceipt` | `IdentityStoredResultRepository.save_handoff_callback_receipt(...)` / `get_handoff_callback_receipt(...)` | archive/trace callback replay | 不保存 receipt body、archive package 或 adapter response;wrong-kind 不得回放 |

`IdentityConsumerReceiptSurfaceMarker` 是 8.4 的 body-free stored marker schema,用于说明 `StoredIdentityOperationResult.surface_marker_ref` 指向的 receipt surface。它不替代 `IdentityConsumerReceipt`,也不保存 public response body。`IdentityConsumerReceiptEnvelope` 是 duplicate replay 的正式 typed stored surface:accepted / rejected / quarantined / delayed / noop / unsupported 分支只要进入 idempotency complete 并返回 public receipt,必须在同一 UoW 内保存 envelope。Duplicate replay 必须读取 envelope.receipt;不得只凭 `StoredIdentityOperationResult`、surface marker、trace refs 或 result kind 临时重建 receipt。

### 15.10 8.4 构造闭环汇总

| 检查项 | 结论 | 说明 |
|---|---|---|
| envelope 是否沿用 8.1 | 通过 | 五条 consumer/callback 均使用 `IdentityInboundEventEnvelope<T>` |
| receipt 是否统一 | 通过 | 均返回 `IdentityConsumerReceipt`;callback 不另造 receipt 壳 |
| idempotency/stored result 是否有 port | 通过 | Step 7 `reserve(...)` + typed consumer/callback receipt envelope save/get 对称 |
| payload 字段来源是否闭合 | 通过 | 均来自 Step 6 typed refs/state/marker 和 HLD body-free event skeleton |
| forbidden body 是否排除 | 通过 | method/work/memory/archive/receipt/raw adapter body 全部禁止 |
| source version / expected version 是否混用 | 通过 | source version 只做 source marker;repository expected version 来自 versioned read |
| callback delivered 是否防伪成功 | 通过 | `TraceHandoffResultKind::Delivered` 必须带 `HandoffReceiptRef` |
| 是否新增 Step 6 object/state | 未新增 | 只定义 Step 8 public payload/result marker;未新增 truth object |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一步 | 8.5 | 用户审核通过后进入 outbound event protocols |

### 15.11 8.4 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只覆盖 8.4 五条 consumer/callback | 通过 | 未写 outbound payload/job/transport ack |
| source event idempotency 是否明确 | 通过 | envelope `source_event_ref` + `idempotency_key`;payload 不重复 |
| role source event 是否 body-free | 通过 | only source ref/version/state/safe summary/evidence refs |
| work participation event 是否 body-free | 通过 | only participation/work/source/safe summary markers |
| memory source event 是否 body-free | 通过 | only memory/archive/source/state/safe summary markers |
| archive callback 是否不保存 package/receipt body | 通过 | only archive/handoff refs/state/issue marker |
| trace handoff callback 是否不伪 delivered | 通过 | delivered requires receipt marker |
| stored result symmetry 是否承接 | 通过 | consumer/callback receipt result save surface 均已存在 |

### 15.12 8.4 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| event id | `IdentityInboundEventEnvelope.source_event_ref` | payload hash 或 raw broker offset 当 source event id |
| duplicate | same key same digest -> stored receipt replay | 重跑 consumer mutation |
| role source | `RoleCapabilitySourceRef` + `RoleCapabilitySourceVersionRef` + safe summary marker | 保存 RoleDefinition / CapabilityDefinition body |
| evidence | `CapabilityEvidenceRef` list | evidence attachment body / artifact body |
| work accepted | `ProjectParticipationRef` + `WorkSourceRef` + `CareerSourceMarkerRef` | Project / WorkItem / ProjectMember JSON |
| source duplicate | `CareerSourceMarkerRef` duplicate guard | 用 idempotency key 代替 career source uniqueness |
| memory source | `MemoryReferenceSourceRef` + optional `MemoryRef` / `ArchiveRef` | memory text、embedding、index、archive package |
| archive callback | `ArchiveHandoffRef` + target memory relation state marker | archive package metadata or raw receipt body |
| trace delivered | `TraceHandoffResultKind::Delivered` with `HandoffReceiptRef` | HTTP 2xx、request sent 或 job log success |
| callback failed | `HandoffIssueRef` safe marker | adapter raw error body、stack trace、secret |
| receipt | `IdentityConsumerReceipt` + stored surface marker | worker ack/dead-letter 当 application accepted |
| worker entry | entry calls facade with operation context | worker 直连 repository / handoff adapter |

---

## 16. 8.5 outbound event protocols

### 16.1 本批目标与边界

本批只定义十条 outbound event 的 public envelope 复用规则、payload DTO、topic key / schema version marker、payload marker 构造来源和 DTO -> outbox / publisher 闭环:

- `GlobalMemberEstablished`
- `IdentityAnchorChanged`
- `GlobalLifecycleChanged`
- `GlobalMemberAvailabilityChanged`
- `RoleCapabilitySummaryChanged`
- `RoleCapabilitySourceStateChanged`
- `CareerRecordAppended`
- `CareerCorrectionAppended`
- `MemoryReferenceChanged`
- `MemoryArchiveHandoffStateChanged`

它们必须沿用 8.1 的 `IdentityOutboundEventEnvelope<T>`、`IdentityOutboundEventRef`、`IdentityOutboxPayloadMarkerRef`、`TopicKeyRef`、`IdentityProtocolSchemaVersionRef` 和 8.1 outbound inventory。本批不定义 publish job input/output、不定义 broker topic 字符串、不定义 adapter delivery retry、不定义 stored payload body persistence、不定义 Step 13 duplicate replay matrix、不定义 Step 14 deployment binding。

Outbound event 只能从 accepted identity truth change / accepted callback state change 的 outbox material 构造。publish 失败只更新 `OutboxState`,不得回滚 accepted truth。publisher 只能消费 `IdentityOutboxRecordRef`、`TopicBindingResolution` 和 `IdentityOutboxPayloadMarkerRef`;不得从 current truth 重新拼 payload。

### 16.2 Envelope 复用与 materialization 规则

```rust
pub type GlobalMemberEstablishedEvent =
    IdentityOutboundEventEnvelope<GlobalMemberEstablishedPayload>;
pub type IdentityAnchorChangedEvent =
    IdentityOutboundEventEnvelope<IdentityAnchorChangedPayload>;
pub type GlobalLifecycleChangedEvent =
    IdentityOutboundEventEnvelope<GlobalLifecycleChangedPayload>;
pub type GlobalMemberAvailabilityChangedEvent =
    IdentityOutboundEventEnvelope<GlobalMemberAvailabilityChangedPayload>;
pub type RoleCapabilitySummaryChangedEvent =
    IdentityOutboundEventEnvelope<RoleCapabilitySummaryChangedPayload>;
pub type RoleCapabilitySourceStateChangedEvent =
    IdentityOutboundEventEnvelope<RoleCapabilitySourceStateChangedPayload>;
pub type CareerRecordAppendedEvent =
    IdentityOutboundEventEnvelope<CareerRecordAppendedPayload>;
pub type CareerCorrectionAppendedEvent =
    IdentityOutboundEventEnvelope<CareerCorrectionAppendedPayload>;
pub type MemoryReferenceChangedEvent =
    IdentityOutboundEventEnvelope<MemoryReferenceChangedPayload>;
pub type MemoryArchiveHandoffStateChangedEvent =
    IdentityOutboundEventEnvelope<MemoryArchiveHandoffStateChangedPayload>;
```

| Envelope 字段 | 来源 | 约束 |
|---|---|---|
| `event_name` | 8.1 outbound inventory | 必须等于十个 canonical outbound event name 之一 |
| `event_ref` | `IdentityIdGeneratorPort` / outbox payload builder | 不得等于 `outbox_record_ref`,不得从 topic/member/trace 拼接 |
| `outbox_record_ref` | saved `IdentityOutboxRecord` | accepted-only;record 初始 `PendingPublish` |
| `topic_key_ref` | event topic map / Step 7 topic binding input | topic ref only;broker topic string 留 Step 14 |
| `schema_version_ref` | 本批 schema map | outbound v1 marker;unsupported evolution 留 Step 12/14 |
| `payload_marker_ref` | body-free payload material builder | 必须与 `IdentityOutboxRecord.payload_marker_ref` 一致;不保存 payload body |
| `trace_ref` | accepted trace append | 必须与 `IdentityOutboxRecord.trace_record_ref` 一致 |
| `published_subject_ref` | formal outbox subject mapper | 必须与 `IdentityOutboxRecord.subject_ref` 一致;不得从 payload 字符串解析 |
| `payload` | 本批 typed payload DTO | 只含 refs、state kind、safe marker、accepted cursor;不得含 external body / secret |

Payload DTO 不重复 envelope 已拥有的 outbox ref、topic key、payload marker、trace ref 和 published subject ref。若下游需要审计这些字段,必须读取 envelope,不得让 payload 私自复制一套可能漂移的字段。

### 16.3 Outbound event batch table

| Outbound Event | Payload DTO | accepted source | primary object / marker | Step 9 flow |
|---|---|---|---|---|
| `GlobalMemberEstablished` | `GlobalMemberEstablishedPayload` | `EstablishGlobalMember` accepted | `GlobalMember`, initial `IdentityAnchorState`, initial `GlobalLifecycleState` | `PublishIdentityOutboxFlow` |
| `IdentityAnchorChanged` | `IdentityAnchorChangedPayload` | anchor accepted change | `IdentityAnchorState` | `PublishIdentityOutboxFlow` |
| `GlobalLifecycleChanged` | `GlobalLifecycleChangedPayload` | `UpdateGlobalLifecycleState` accepted | `GlobalLifecycleState`, optional terminal anchor side effect | `PublishIdentityOutboxFlow` |
| `GlobalMemberAvailabilityChanged` | `GlobalMemberAvailabilityChangedPayload` | lifecycle availability accepted change | `GlobalLifecycleState::is_available()` result marker | `PublishIdentityOutboxFlow` |
| `RoleCapabilitySummaryChanged` | `RoleCapabilitySummaryChangedPayload` | `MaintainRoleCapabilitySummary` accepted | `RoleCapabilitySummary` | `PublishIdentityOutboxFlow` |
| `RoleCapabilitySourceStateChanged` | `RoleCapabilitySourceStateChangedPayload` | source accepted / stale state change | `RoleCapabilitySourceSnapshot` | `PublishIdentityOutboxFlow` |
| `CareerRecordAppended` | `CareerRecordAppendedPayload` | career normal append accepted | `CareerRecord` with `Appended` state | `PublishIdentityOutboxFlow` |
| `CareerCorrectionAppended` | `CareerCorrectionAppendedPayload` | career correction append accepted | new correction `CareerRecord` and optional superseded original marker | `PublishIdentityOutboxFlow` |
| `MemoryReferenceChanged` | `MemoryReferenceChangedPayload` | memory relation accepted state change | `MemoryReference`, `MemoryReferenceState` | `PublishIdentityOutboxFlow` |
| `MemoryArchiveHandoffStateChanged` | `MemoryArchiveHandoffStateChangedPayload` | archive / trace handoff accepted state marker | `MemoryReferenceState` and/or `TraceHandoffIntent` marker | `PublishIdentityOutboxFlow` |

`GlobalLifecycleChanged` 与 `GlobalMemberAvailabilityChanged` 是否同一 accepted lifecycle change 同时产生、何时合并或只发一条,留 Step 9/10 的 flow/state matrix 闭口。本批只固定两种 payload 的 schema 和 accepted-only 来源,不决定 co-emission priority。

### 16.4 Topic key / schema version map

| Event | `IdentityOutboundEventName` value | `TopicKeyRef` canonical key | `IdentityProtocolSchemaVersionRef` canonical key | Payload schema |
|---|---|---|---|---|
| `GlobalMemberEstablished` | `GlobalMemberEstablished` | `identity.global-member.established.v1` | `identity.outbound.global-member-established.v1` | `GlobalMemberEstablishedPayload` |
| `IdentityAnchorChanged` | `IdentityAnchorChanged` | `identity.anchor.changed.v1` | `identity.outbound.anchor-changed.v1` | `IdentityAnchorChangedPayload` |
| `GlobalLifecycleChanged` | `GlobalLifecycleChanged` | `identity.lifecycle.changed.v1` | `identity.outbound.lifecycle-changed.v1` | `GlobalLifecycleChangedPayload` |
| `GlobalMemberAvailabilityChanged` | `GlobalMemberAvailabilityChanged` | `identity.global-member.availability.changed.v1` | `identity.outbound.member-availability-changed.v1` | `GlobalMemberAvailabilityChangedPayload` |
| `RoleCapabilitySummaryChanged` | `RoleCapabilitySummaryChanged` | `identity.role-capability.summary.changed.v1` | `identity.outbound.role-capability-summary-changed.v1` | `RoleCapabilitySummaryChangedPayload` |
| `RoleCapabilitySourceStateChanged` | `RoleCapabilitySourceStateChanged` | `identity.role-capability.source-state.changed.v1` | `identity.outbound.role-capability-source-state-changed.v1` | `RoleCapabilitySourceStateChangedPayload` |
| `CareerRecordAppended` | `CareerRecordAppended` | `identity.career.record.appended.v1` | `identity.outbound.career-record-appended.v1` | `CareerRecordAppendedPayload` |
| `CareerCorrectionAppended` | `CareerCorrectionAppended` | `identity.career.correction.appended.v1` | `identity.outbound.career-correction-appended.v1` | `CareerCorrectionAppendedPayload` |
| `MemoryReferenceChanged` | `MemoryReferenceChanged` | `identity.memory.reference.changed.v1` | `identity.outbound.memory-reference-changed.v1` | `MemoryReferenceChangedPayload` |
| `MemoryArchiveHandoffStateChanged` | `MemoryArchiveHandoffStateChanged` | `identity.memory.archive-handoff-state.changed.v1` | `identity.outbound.memory-archive-handoff-state-changed.v1` | `MemoryArchiveHandoffStateChangedPayload` |

这些 key 是 topic-neutral protocol marker。Step 14 才能把 `TopicKeyRef` 绑定到 broker topic、exchange、partition、tenant route 或 delivery target;Step 8 不保存 broker 字符串、secret、credential 或 deployment routing expression。

### 16.5 Core member / lifecycle payload schema

```rust
/// Body-free outbound payload emitted when a GlobalMember is established.
pub struct GlobalMemberEstablishedPayload {
    pub member_ref: GlobalMemberRef,
    pub source_ref: IdentitySourceRef,
    pub anchor_state_kind: IdentityAnchorStateKind,
    pub lifecycle_state_kind: GlobalLifecycleStateKind,
    pub created_by_ref: ActorRef,
    pub established_at: IdentityTimestamp,
    pub accepted_cursor_ref: IdentityTruthCursor,
}

/// Body-free outbound payload emitted when the member anchor state changes.
pub struct IdentityAnchorChangedPayload {
    pub member_ref: GlobalMemberRef,
    pub anchor_state_kind: IdentityAnchorStateKind,
    pub anchor_reason_ref: Option<IdentityAnchorReasonRef>,
    pub changed_at: IdentityTimestamp,
    pub accepted_cursor_ref: IdentityTruthCursor,
}

/// Body-free outbound payload emitted when global lifecycle truth changes.
pub struct GlobalLifecycleChangedPayload {
    pub member_ref: GlobalMemberRef,
    pub lifecycle_state_kind: GlobalLifecycleStateKind,
    pub reason_ref: LifecycleReasonRef,
    pub basis_ref: Option<GovernanceBasisRef>,
    pub changed_by_ref: ActorRef,
    pub changed_at: IdentityTimestamp,
    pub anchor_state_kind: Option<IdentityAnchorStateKind>,
    pub accepted_cursor_ref: IdentityTruthCursor,
}

/// Body-free outbound payload emitted when member availability changes.
pub struct GlobalMemberAvailabilityChangedPayload {
    pub member_ref: GlobalMemberRef,
    pub lifecycle_state_kind: GlobalLifecycleStateKind,
    pub is_available: bool,
    pub reason_ref: LifecycleReasonRef,
    pub changed_at: IdentityTimestamp,
    pub accepted_cursor_ref: IdentityTruthCursor,
}
```

| Payload | 字段来源 | body boundary |
|---|---|---|
| `GlobalMemberEstablishedPayload` | saved `GlobalMember`, initial anchor/lifecycle state, command actor/time, accepted cursor | 不保存 account、credential、runtime、ProjectMember body |
| `IdentityAnchorChangedPayload` | saved `IdentityAnchorState`, optional anchor reason, accepted cursor | 不保存 reason body、governance body |
| `GlobalLifecycleChangedPayload` | saved `GlobalLifecycleState`, optional terminal anchor side effect, accepted cursor | 不保存 governance basis body、runtime health、ProjectMember state |
| `GlobalMemberAvailabilityChangedPayload` | `GlobalLifecycleState.state_kind` + `is_available()` derived bool, reason/time, accepted cursor | 不新增 `AvailabilitySummaryRef`;availability 是 lifecycle safe marker |

`GlobalMemberAvailabilityChangedPayload.is_available` 只能由 `GlobalLifecycleState::is_available()` 或 Step 10 固定的 lifecycle availability matrix 派生,不得由 runtime health、worker heartbeat、ProjectMember assignment 或 downstream subscription result 推断。

### 16.6 Role / career / memory payload schema

```rust
/// Body-free outbound payload emitted when role/capability summary changes.
pub struct RoleCapabilitySummaryChangedPayload {
    pub member_ref: GlobalMemberRef,
    pub summary_ref: RoleCapabilitySummaryRef,
    pub summary_state: RoleCapabilitySummaryStateKind,
    pub role_source_ref: Option<RoleSourceRef>,
    pub capability_source_refs: Vec<CapabilitySourceRef>,
    pub evidence_refs: Vec<CapabilityEvidenceRef>,
    pub safe_summary_ref: RoleCapabilitySafeSummaryRef,
    pub source_snapshot_ref: RoleCapabilitySourceSnapshotRef,
    pub accepted_cursor_ref: IdentityTruthCursor,
}

/// Body-free outbound payload emitted when role/capability source snapshot state changes.
pub struct RoleCapabilitySourceStateChangedPayload {
    pub member_ref: GlobalMemberRef,
    pub summary_ref: Option<RoleCapabilitySummaryRef>,
    pub snapshot_ref: RoleCapabilitySourceSnapshotRef,
    pub source_ref: RoleCapabilitySourceRef,
    pub source_version_ref: RoleCapabilitySourceVersionRef,
    pub source_state: RoleCapabilitySourceStateKind,
    pub safe_summary_ref: Option<RoleCapabilitySafeSummaryRef>,
    pub evidence_refs: Vec<CapabilityEvidenceRef>,
    pub accepted_cursor_ref: IdentityTruthCursor,
}

/// Body-free outbound payload emitted when a normal career record is appended.
pub struct CareerRecordAppendedPayload {
    pub member_ref: GlobalMemberRef,
    pub career_record_ref: CareerRecordRef,
    pub record_state: CareerRecordStateKind,
    pub project_participation_ref: ProjectParticipationRef,
    pub work_source_ref: WorkSourceRef,
    pub source_marker_ref: CareerSourceMarkerRef,
    pub career_summary_ref: Option<CareerSafeSummaryRef>,
    pub append_reason_ref: CareerAppendReasonRef,
    pub appended_at: IdentityTimestamp,
    pub accepted_cursor_ref: IdentityTruthCursor,
}

/// Body-free outbound payload emitted when a correction career record is appended.
pub struct CareerCorrectionAppendedPayload {
    pub member_ref: GlobalMemberRef,
    pub correction_record_ref: CareerRecordRef,
    pub original_record_ref: CareerRecordRef,
    pub record_state: CareerRecordStateKind,
    pub project_participation_ref: ProjectParticipationRef,
    pub work_source_ref: WorkSourceRef,
    pub source_marker_ref: CareerSourceMarkerRef,
    pub career_summary_ref: Option<CareerSafeSummaryRef>,
    pub append_reason_ref: CareerAppendReasonRef,
    pub appended_at: IdentityTimestamp,
    pub accepted_cursor_ref: IdentityTruthCursor,
}

/// Body-free outbound payload emitted when a memory/archive relation changes.
pub struct MemoryReferenceChangedPayload {
    pub member_ref: GlobalMemberRef,
    pub memory_reference_ref: MemoryReferenceRef,
    pub reference_state_kind: MemoryReferenceStateKind,
    pub memory_ref: Option<MemoryRef>,
    pub archive_ref: Option<ArchiveRef>,
    pub archive_handoff_ref: Option<ArchiveHandoffRef>,
    pub source_ref: MemoryReferenceSourceRef,
    pub safe_summary_ref: Option<MemorySafeSummaryRef>,
    pub reason_ref: MemoryReferenceReasonRef,
    pub changed_at: IdentityTimestamp,
    pub accepted_cursor_ref: IdentityTruthCursor,
}

/// Body-free outbound payload emitted when memory/archive handoff state changes.
pub struct MemoryArchiveHandoffStateChangedPayload {
    pub member_ref: GlobalMemberRef,
    pub memory_reference_ref: Option<MemoryReferenceRef>,
    pub archive_ref: Option<ArchiveRef>,
    pub archive_handoff_ref: ArchiveHandoffRef,
    pub memory_reference_state_kind: MemoryReferenceStateKind,
    pub handoff_intent_ref: Option<TraceHandoffIntentRef>,
    pub handoff_state_kind: Option<HandoffStateKind>,
    pub receipt_ref: Option<HandoffReceiptRef>,
    pub issue_ref: Option<HandoffIssueRef>,
    pub accepted_cursor_ref: IdentityTruthCursor,
}
```

| Payload | 字段来源 | body boundary |
|---|---|---|
| `RoleCapabilitySummaryChangedPayload` | saved `RoleCapabilitySummary` and accepted cursor | 不保存 RoleDefinition、CapabilityDefinition、method body、evidence body |
| `RoleCapabilitySourceStateChangedPayload` | saved `RoleCapabilitySourceSnapshot` and optional linked summary | 不保存 source body;source version 不等于 optimistic version |
| `CareerRecordAppendedPayload` | saved `CareerRecord` with `Appended` state | 不保存 Project、WorkItem、ProjectMember、artifact body |
| `CareerCorrectionAppendedPayload` | new correction `CareerRecord` + loaded original record ref | 不覆盖原记录;不保存 correction note body |
| `MemoryReferenceChangedPayload` | saved `MemoryReference` and `MemoryReferenceState` | 不保存 memory text、embedding、index、archive package、receipt body |
| `MemoryArchiveHandoffStateChangedPayload` | archive/handoff accepted state marker, memory relation ref and/or trace handoff intent marker | `receipt_ref` 是 formal marker;不保存 receipt body、adapter response 或 archive package |

`CareerRecordAppendedPayload.record_state` 必须为 `CareerRecordStateKind::Appended`。`CareerCorrectionAppendedPayload.record_state` 必须为 `CareerRecordStateKind::CorrectionAppended`。`SupersededByCorrection` 是否另发 event 或只作为 correction append 的 side-effect marker,留 Step 9/10 闭口,不得在 8.5 发明第十一条 event。

### 16.7 DTO -> outbox / publisher closure

| 阶段 | 输入 | 输出 | 约束 |
|---|---|---|---|
| accepted truth / callback state | saved truth object, accepted cursor, trace ref, formal outbox subject | typed outbound payload DTO | 只能来自 accepted path;rejected / query / report-only 不产生 normal outbound event |
| payload material builder | event name, schema version, typed payload, trace ref, subject ref, topic key | `IdentityOutboxPayloadMarkerRef` | marker body-free;exact serialized snapshot storage 留 Step 11/13 |
| outbox factory | member ref, subject ref, change kind, payload marker, topic key, trace ref, clock | `IdentityOutboxRecord::from_accepted_change(...)` | 初始 `PendingPublish`;record 不保存 event body |
| publish job | `IdentityOutboxRecordRef`, `TopicKeyRef`, `IdentityOutboxPayloadMarkerRef` | `IdentityTopicBindingPort.resolve_topic_binding(...)` then `IdentityOutboxPublisherPort.publish_outbox_record(...)` | publisher 不读取 current truth、不重算 payload、不保存 downstream receipt |
| publish result | `OutboxPublishOutcome` | `OutboxState::Published` / `RetryableFailed` / `Failed` / `SkippedByPolicy` | publish failure 不回滚 accepted truth;状态矩阵留 Step 10 |

当前 Step 7 publisher port 只接收 `payload_marker_ref`,没有 public `get_payload_snapshot(...)` / `save_payload_snapshot(...)` 对称口。因此 8.5 只定义 payload DTO 与 marker 构造的协议真相,不声称已经有 serialized event body persistence。若后续实现需要 durable publisher 读取完整 serialized envelope,必须在 Step 11/13/14 正式定义 marker -> payload snapshot 的存储/读取/重放 surface,不得在 adapter 私造 body store。

### 16.8 Payload marker audit rules

| Audit item | Rule |
|---|---|
| event name | marker material event name must equal envelope `event_name` |
| schema version | marker material schema version must equal envelope `schema_version_ref` and §16.4 map |
| outbox ref | marker material must be tied to the same `outbox_record_ref` that owns publication |
| subject ref | envelope `published_subject_ref` must equal `IdentityOutboxRecord.subject_ref` |
| trace ref | envelope `trace_ref` must equal `IdentityOutboxRecord.trace_record_ref` |
| topic key | envelope `topic_key_ref` must equal `IdentityOutboxRecord.topic_key_ref` and topic map result |
| accepted cursor | payload `accepted_cursor_ref` must come from accepted truth cursor assigner,not from timestamp/version/idempotency key |
| body boundary | payload marker may refer to safe summary refs and body-free typed refs only;forbidden body must be rejected or skipped by policy before normal publish |
| publisher input | publisher receives record ref + topic binding + payload marker;it must not query current truth to reconstruct event |

### 16.9 8.5 构造闭环汇总

| 检查项 | 结论 | 说明 |
|---|---|---|
| envelope 是否沿用 8.1 | 通过 | 十条 event 均使用 `IdentityOutboundEventEnvelope<T>` |
| event name / payload schema 是否一一映射 | 通过 | §16.4 固定 event name、topic key、schema version、payload DTO |
| accepted-only source 是否明确 | 通过 | 每条 payload 都绑定 accepted truth / callback state marker |
| payload 字段来源是否闭合 | 通过 | 字段均来自 Step 6 object/state/marker、Step 7 id/subject/topic/payload marker builder 或 accepted cursor |
| body-free 是否闭合 | 通过 | method/work/memory/archive/governance/receipt/adapter body 全部排除 |
| topic visibility 是否越界 | 未越界 | 只定义 topic key marker;broker binding、tenant route、secret 留 Step 14 |
| stored payload body 是否越界 | 未越界 | 明确当前只有 marker;serialized snapshot storage 留 Step 11/13 |
| 是否新增 Step 6 object/state | 未新增 | `is_available` 使用 lifecycle helper bool;未新增 availability truth |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一步 | 8.6 | 用户审核通过后进入 operations job protocols |

### 16.10 8.5 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只覆盖 8.5 十条 outbound event | 通过 | 未写 job input/output、transport ack、DDL 或 retry policy |
| topic/schema marker 是否闭合 | 通过 | 每条 event 有 canonical topic key 和 schema version marker |
| payload marker 是否 body-free | 通过 | DTO 只含 refs/state/safe marker/cursor |
| event body 是否进入 outbox record | 未发生 | `IdentityOutboxRecord` 仍只保存 payload marker |
| accepted cursor 是否防混用 | 通过 | payload 使用 `IdentityTruthCursor`,不得用 timestamp/source version/idempotency key |
| availability 是否新增 truth | 未发生 | 用 lifecycle state + `is_available` derived bool,不新增 `AvailabilitySummaryRef` |
| source-state event 是否避免 source body | 通过 | 只输出 source ref/version/state/safe summary/evidence refs |
| handoff event 是否防伪 delivered | 通过 | receipt 仍是 formal `HandoffReceiptRef`;adapter raw response 不进入 payload |
| publisher 是否回查 current truth | 禁止 | publish job 只能经 outbox record + payload marker + topic binding |

### 16.11 8.5 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| event ref | `IdentityOutboundEventRef` 由 id source / builder 分配 | 用 outbox ref、trace ref 或 topic key 拼 event ref |
| topic | `TopicKeyRef("identity.lifecycle.changed.v1")` | 在 domain / payload 写 Kafka topic、exchange、URL |
| schema version | `IdentityProtocolSchemaVersionRef("identity.outbound.lifecycle-changed.v1")` | adapter 按当前二进制版本临时决定 |
| member established | member/source/anchor/lifecycle refs and state kind | account profile、credential、runtime payload |
| lifecycle | lifecycle state / reason / basis ref | governance basis body、approval body、runtime health |
| availability | `is_available` from lifecycle helper | worker heartbeat 或 downstream consumer state |
| role summary | source refs、safe summary、evidence refs | RoleDefinition / CapabilityDefinition / evidence attachment body |
| career append | ProjectParticipationRef / WorkSourceRef / CareerSourceMarkerRef | Project / WorkItem / ProjectMember JSON |
| memory reference | MemoryRef / ArchiveRef / ArchiveHandoffRef markers | memory text、embedding、archive package |
| handoff receipt | `HandoffReceiptRef` marker | raw receipt body、HTTP 2xx、request sent log |
| publisher | publish by payload marker | reload current truth and reconstruct payload |

---

## 17. 8.6 operations job protocols

Operations Job 是显式后台维护入口,只允许通过 application facade 维护 projection、external reference state、reconciliation report、outbox publish state、trace handoff state 和 retry marker。Job 不是 command,不得静默修复 `GlobalMember`、lifecycle、role/career/memory truth,也不得绕过 application service 直接访问 repository、publisher 或 handoff adapter。

### 17.1 本批边界

| 项 | 口径 |
|---|---|
| 覆盖 job | `RebuildIdentityProjection` / `RefreshExternalReferenceState` / `RunIdentityReconciliation` / `PublishIdentityOutbox` / `DeliverTraceHandoff` / `RetryIdentityPropagationFailures` |
| 使用 envelope | 沿用 8.1 `IdentityJobRequest<T>`、`IdentityJobResponse<T>`、`IdentityJobReportSurface` |
| entry 来源 | `IdentityJobEntryContext` 解析 scheduler/CLI/ops request 后经 `IdentityApplicationFacade::dispatch_job` |
| stored replay | job duplicate 只能 replay stored `IdentityJobReportSurface`;不得重跑 rebuild/refresh/publish/handoff |
| body-free | input/output/report 只保存 refs、marker、state kind、cursor、issue refs;不保存 raw job args、raw logs、external body、payload body、receipt body 或 secret |
| phase boundary | publish/handoff failure 只更新 outbox/handoff state 和 report issue;不得回滚 accepted truth |

### 17.2 Shared job outcome and report item surface

```rust
pub enum IdentityJobRunDisposition {
    Completed,
    Partial,
    Failed,
    RetryableFailed,
    Noop,
    DuplicateReplayed,
    Rejected,
}

pub struct IdentityJobItemCounts {
    pub scanned_count: u32,
    pub changed_count: u32,
    pub failed_count: u32,
    pub skipped_count: u32,
}
```

| 字段 / variant | 来源 | 约束 |
|---|---|---|
| `Completed` | job body 完成且无 failed item | 可对应 `IdentityJobResultKind::Succeeded` |
| `Partial` | 至少一个 item 成功且至少一个 item failed/skipped/degraded | 必须带 `issue_refs` 和 item refs |
| `Failed` | job 无成功 item或遇到不可恢复 boundary failure | 必须带 safe issue refs;不保存 raw error |
| `RetryableFailed` | 失败来自 retryable publisher/handoff/resolver/store dependency | 不等于 silent retry;必须可被 Step 14 retry policy 读取 |
| `Noop` | 无 pending/stale/target item | 不创建 fake success marker |
| `DuplicateReplayed` | idempotency same key/same digest 且 stored report 存在 | 不重扫 repository |
| `Rejected` | job request invalid / forbidden repair intent / missing required idempotency | rejected stored report 范围留 Step 12/13 |
| item counts | application job report assembly | 只统计本次 job request 范围;不得从 duplicate replay 时重算 |

`IdentityJobReportSurface` 在 8.1 壳上补齐 projection/reference/report/outbox/handoff/receipt item refs。每个 item ref 都必须来自 Step 7 repository list/load/update、external resolver/publisher/handoff outcome 或 reconciliation report writer;stored duplicate replay 只读取 report/stored result,不得再扫描 store 反推出这些 refs。

Job `issue_refs` are always `MaintenanceIssueRef`. Projection/reference/reconciliation jobs obtain them from maintenance/report issue markers or Step 7 `IdentityMaintenanceIssueMapper` methods for missing state, missing cursor, unsupported writer, and refresh failure. Publish/handoff/retry jobs must map propagation issue markers through the same mapper:

| Job family | Native issue marker | Job report issue source |
|---|---|---|
| projection rebuild missing state / missing cursor / unsupported writer | `IdentityProjectionRef` marker | `IdentityMaintenanceIssueMapper.projection_*_issue(...)` |
| reference refresh missing state / classified refresh failure | `ExternalReferenceRef` marker | `IdentityMaintenanceIssueMapper.reference_*_issue(...)` |
| publish outbox retryable / permanent / skipped / unsupported | `OutboxDeliveryIssueRef` from `OutboxPublishOutcome` and `OutboxState` | `IdentityMaintenanceIssueMapper.outbox_*_issue(...)` |
| deliver handoff retryable / permanent / cancelled / unsupported | `HandoffIssueRef` from `HandoffDeliveryOutcome` and `HandoffState` | `IdentityMaintenanceIssueMapper.handoff_*_issue(...)` |
| retry propagation | reused publish/handoff outcome issue markers | same mapper as fresh publish / deliver flow |

The mapper only projects a body-free issue marker into report surface. It does not replace `OutboxState.issue_ref` / `HandoffState.issue_ref`,does not read raw adapter errors,does not parse projection/reference/topic/target strings, and must be replayed from stored `IdentityJobRunReport` rather than recomputed on duplicate.

### 17.3 Job scope DTO helpers

```rust
pub enum IdentityProjectionRebuildScopeDto {
    ExplicitProjectionRefs(Vec<IdentityProjectionRef>),
    StaleInMaintenanceScope,
}

pub enum IdentityExternalReferenceRefreshScopeDto {
    ExplicitReferenceRefs(Vec<ExternalReferenceRef>),
    StaleInMaintenanceScope,
    ByOwner(IdentityReferenceOwnerRef),
    ByKind(ExternalReferenceKind),
}

pub enum IdentityPropagationRetryScopeDto {
    OutboxRetryable {
        topic_key_ref: Option<TopicKeyRef>,
    },
    HandoffRetryable {
        target_ref: Option<HandoffTargetRef>,
    },
}

pub enum IdentityReconciliationTargetScopeDto {
    ExplicitTargets(Vec<IdentityMaintenanceTargetRef>),
    ByMaintenanceScope,
}

pub enum IdentityHandoffDeliveryScopeDto {
    ExplicitIntentRefs(Vec<TraceHandoffIntentRef>),
    ByTarget(HandoffTargetRef),
}
```

| DTO | 映射到 Step 7 | 禁止事项 |
|---|---|---|
| `ExplicitProjectionRefs` | exact `IdentityProjectionRef` load/save | 不从 view ref、member id 或 scope string 拼 projection ref |
| `StaleInMaintenanceScope` | outer `maintenance_scope_ref` + `IdentityProjectionRepository.list_stale_projection_states(...)` 或 `IdentityMaintenanceRepository.list_projection_targets_for_rebuild(...)` | 不全表扫描;不在 enum 内重复 scope 字段造成 mismatch |
| `ExplicitReferenceRefs` | `IdentityReferenceStateRepository.get_reference_state_with_version(...)` | 不把 business source ref 自动当 reference bundle |
| `StaleInMaintenanceScope` reference | outer `maintenance_scope_ref` + `IdentityReferenceStateRepository.list_stale_reference_states(...)` / `IdentityMaintenanceRepository.list_reference_targets_for_refresh(...)` | 不从 external ref 前缀猜 scope |
| `ByOwner` / `ByKind` | `list_reference_states_by_owner(...)` / `list_reference_states_by_kind(...)` | owner/kind 必须是 typed ref/enum |
| propagation retry scope | `list_retryable_outbox_records(...)` 或 `list_retryable_handoff_intents(...)` | 单次 job run 只处理一种 retry family,避免一个 cursor/page 同时表达两条列表;组合调度留 Step 14 |
| reconciliation target scope | explicit targets 或 `IdentityMaintenanceRepository.expand_maintenance_targets(...)` | 不从 report history 反推本次目标 |
| handoff delivery scope | exact intent refs 或 `TraceHandoffIntentRepository.list_handoff_intents_by_target(...)` | 不支持“未指定目标时扫全量”;不得扫所有 intent |

### 17.4 Operations job input / output DTO schema

```rust
pub struct RebuildIdentityProjectionJobInput {
    pub rebuild_scope: IdentityProjectionRebuildScopeDto,
    pub maintenance_scope_ref: MaintenanceScopeRef,
    pub page: IdentityPublicPageRequest,
}

pub struct RebuildIdentityProjectionJobOutput {
    pub disposition: IdentityJobRunDisposition,
    pub counts: IdentityJobItemCounts,
    pub rebuilt_projection_refs: Vec<IdentityProjectionRef>,
    pub failed_projection_refs: Vec<IdentityProjectionRef>,
    pub report_refs: Vec<ReconciliationReportRef>,
    pub issue_refs: Vec<MaintenanceIssueRef>,
}

pub struct RefreshExternalReferenceStateJobInput {
    pub refresh_scope: IdentityExternalReferenceRefreshScopeDto,
    pub maintenance_scope_ref: MaintenanceScopeRef,
    pub page: IdentityPublicPageRequest,
}

pub struct RefreshExternalReferenceStateJobOutput {
    pub disposition: IdentityJobRunDisposition,
    pub counts: IdentityJobItemCounts,
    pub refreshed_reference_refs: Vec<ExternalReferenceRef>,
    pub failed_reference_refs: Vec<ExternalReferenceRef>,
    pub issue_refs: Vec<MaintenanceIssueRef>,
}

pub struct RunIdentityReconciliationJobInput {
    pub maintenance_scope_ref: MaintenanceScopeRef,
    pub target_scope: IdentityReconciliationTargetScopeDto,
    pub finding_intent_ref: ReconciliationFindingIntentRef,
    pub finding_material: ReconciliationFindingMaterial,
    pub page: IdentityPublicPageRequest,
}

pub struct RunIdentityReconciliationJobOutput {
    pub disposition: IdentityJobRunDisposition,
    pub counts: IdentityJobItemCounts,
    pub report_refs: Vec<ReconciliationReportRef>,
    pub inspected_target_refs: Vec<IdentityMaintenanceTargetRef>,
    pub issue_refs: Vec<MaintenanceIssueRef>,
}

pub struct PublishIdentityOutboxJobInput {
    pub topic_key_ref: Option<TopicKeyRef>,
    pub page: IdentityPublicPageRequest,
}

pub struct PublishIdentityOutboxJobOutput {
    pub disposition: IdentityJobRunDisposition,
    pub counts: IdentityJobItemCounts,
    pub scanned_outbox_refs: Vec<IdentityOutboxRecordRef>,
    pub published_outbox_refs: Vec<IdentityOutboxRecordRef>,
    pub failed_outbox_refs: Vec<IdentityOutboxRecordRef>,
    pub issue_refs: Vec<MaintenanceIssueRef>,
}

pub struct DeliverTraceHandoffJobInput {
    pub delivery_scope: IdentityHandoffDeliveryScopeDto,
    pub page: IdentityPublicPageRequest,
}

pub struct DeliverTraceHandoffJobOutput {
    pub disposition: IdentityJobRunDisposition,
    pub counts: IdentityJobItemCounts,
    pub scanned_handoff_intent_refs: Vec<TraceHandoffIntentRef>,
    pub delivered_handoff_intent_refs: Vec<TraceHandoffIntentRef>,
    pub failed_handoff_intent_refs: Vec<TraceHandoffIntentRef>,
    pub receipt_refs: Vec<HandoffReceiptRef>,
    pub issue_refs: Vec<MaintenanceIssueRef>,
}

pub struct RetryIdentityPropagationFailuresJobInput {
    pub retry_scope: IdentityPropagationRetryScopeDto,
    pub page: IdentityPublicPageRequest,
}

pub struct RetryIdentityPropagationFailuresJobOutput {
    pub disposition: IdentityJobRunDisposition,
    pub counts: IdentityJobItemCounts,
    pub retried_outbox_refs: Vec<IdentityOutboxRecordRef>,
    pub published_outbox_refs: Vec<IdentityOutboxRecordRef>,
    pub failed_outbox_refs: Vec<IdentityOutboxRecordRef>,
    pub retried_handoff_intent_refs: Vec<TraceHandoffIntentRef>,
    pub delivered_handoff_intent_refs: Vec<TraceHandoffIntentRef>,
    pub failed_handoff_intent_refs: Vec<TraceHandoffIntentRef>,
    pub receipt_refs: Vec<HandoffReceiptRef>,
    pub issue_refs: Vec<MaintenanceIssueRef>,
}
```

### 17.5 Job input field sources

| Job | Required input | Step 7 / Step 6 source | Rejected when |
|---|---|---|---|
| `RebuildIdentityProjection` | rebuild scope、maintenance scope、page | projection repository stale list / maintenance target expansion、`ProjectionState`、`ReconciliationPolicy::for_projection_rebuild(...)` | empty explicit projection refs;page invalid;target resolves to core truth repair |
| `RefreshExternalReferenceState` | refresh scope、maintenance scope、page | reference state repository versioned read/list、external reference resolver、`ReconciliationPolicy::for_reference_refresh(...)` | empty explicit refs;owner/kind unsupported;reference state missing required owner |
| `RunIdentityReconciliation` | maintenance scope、target scope、finding intent/material、page | maintenance expansion、report writer/repository、`ReconciliationPolicy::for_reconciliation(...)` | target scope empty;target includes core truth write target;finding material forbidden |
| `PublishIdentityOutbox` | optional topic、page | outbox pending list、topic binding port、publisher port、maintenance issue mapper | page invalid;topic binding unsupported before item issue mapping is available |
| `DeliverTraceHandoff` | exact intents 或 target-scoped intents、page | `TraceHandoffIntentRepository.get_handoff_intent_with_version(...)` / `list_handoff_intents_by_target(...)`,handoff target/delivery ports | delivery scope empty;target disabled/unavailable with no safe issue marker;page invalid |
| `RetryIdentityPropagationFailures` | retry scope、page | retryable outbox list, retryable handoff list, publisher/handoff outcome、maintenance issue mapper | retry scope empty/unsupported;retryable item cannot be loaded with version |

### 17.6 Job output / report mapping

| Job | Output refs | Report surface fields | State owner |
|---|---|---|---|
| `RebuildIdentityProjection` | rebuilt / failed projection refs, optional report refs | `rebuilt_projection_refs`, `failed_projection_refs`, `affected_projection_refs`, `report_refs`, `issue_refs`, counts | projection repository saves view/state;job report only records refs |
| `RefreshExternalReferenceState` | refreshed / failed external reference refs | `refreshed_reference_refs`, `failed_reference_refs`, `issue_refs`, counts | reference repository saves state/sidecar;job report only records refs |
| `RunIdentityReconciliation` | report refs and inspected maintenance targets | `inspected_target_refs`, `report_refs`, `issue_refs`, counts | reconciliation report repository creates report-only material |
| `PublishIdentityOutbox` | scanned/published/failed outbox refs | `outbox_record_refs`, `published_outbox_refs`, `failed_outbox_refs`, mapper-produced `issue_refs`, counts | outbox repository updates publish state;Published 不等于 downstream consumed |
| `DeliverTraceHandoff` | scanned/delivered/failed handoff intent refs, receipt refs | `handoff_intent_refs`, `delivered_handoff_refs`, `failed_handoff_refs`, `handoff_receipt_refs`, mapper-produced `issue_refs`, counts | handoff intent repository updates `HandoffState`;Delivered 必须有 receipt |
| `RetryIdentityPropagationFailures` | retried/published/failed outbox refs, retried/delivered/failed handoff refs, receipt refs | outbox + handoff report fields;mapper-produced `issue_refs` | retry job 不定义 schedule/backoff,只执行本次 explicit retry attempt |

### 17.7 Job duplicate replay contract

| 场景 | Required behavior | Forbidden behavior |
|---|---|---|
| first run accepted | reserve idempotency, run job body, save `IdentityJobRunReport`, save `StoredIdentityOperationResult(JobReport)`, complete idempotency | return report without stored result |
| duplicate same key/digest | load stored result, then load stored job report/surface, return `DuplicateReplayed` | rescan projection/reference/outbox/handoff |
| duplicate same key/different digest | return conflict/rejected surface with safe issue marker | reuse previous report |
| stored result missing | return degraded/rejected replay error per Step 12/13 | rerun job body to recreate report |
| partial first run | save partial report with item refs and issue refs | silently mark succeeded or drop failed refs |

Stored job report surface 必须足够 replay public `IdentityJobResponse<T>` 中的 `report` 和 job-specific `output` item refs。若后续 implementation 发现 report repository 只保存 aggregate counts 或 surface marker,必须回 Step 6/7/11/13 闭口,不得在 duplicate path 重扫 repository。

### 17.8 Job DTO construction closure

| Job | DTO -> application closure | 禁止事项 |
|---|---|---|
| `RebuildIdentityProjection` | request scope -> projection refs via explicit refs or maintenance/projection repository;each target creates `ReconciliationPolicy::for_projection_rebuild(...)`;output from saved projection state/view refs | query path rebuild;missing projection state 自动修 truth;从 projection ref 字符串拼 member |
| `RefreshExternalReferenceState` | request scope -> external reference refs via reference/maintenance repository;each loaded bundle version feeds resolver + reference save/sidecar save | business source ref 当 bundle key;source version 当 optimistic version;resolver body 入仓 |
| `RunIdentityReconciliation` | explicit/expanded targets + finding material -> report-only policy -> `ReconciliationReport` save | finding 变 repair action;保存 raw diagnostic/body/secret |
| `PublishIdentityOutbox` | pending outbox refs -> load record/version -> topic binding -> publisher outcome -> outbox state update -> issue mapper -> report item refs | publisher 读取 current truth 重拼 payload;publish failed 回滚 accepted truth;raw adapter error 决定 job issue kind |
| `DeliverTraceHandoff` | exact/target-scoped handoff intents -> target resolution -> delivery outcome -> handoff state update -> issue mapper -> report item refs | HTTP 2xx 或 request sent 标 delivered;receipt body 入仓;未指定目标时扫全量;raw adapter error 决定 job issue kind |
| `RetryIdentityPropagationFailures` | retryable outbox/handoff selectors -> reuse publish/deliver outcome mapping and issue mapper -> report item refs | job runner 内部绕过 application;retry schedule/backoff 写进 protocol DTO |

`HandoffDeliveryOutcome::RetryableFailed` and `HandoffDeliveryOutcome::PermanentlyFailed` must carry a formal `HandoffAttemptRef`, because `HandoffState::retryable_failed(...)` and `HandoffState::failed(...)` require the attempt marker. Outcomes that do not start a delivery attempt must use `CancelledByPolicy` or `UnsupportedTarget`;job flow maps those to `HandoffState::cancelled(...)` plus mapper-produced `MaintenanceIssueRef`, not to failed state.

### 17.9 8.6 构造闭环汇总

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只覆盖 6 个 operations job | 通过 | 未新增 command/query/event/callback |
| 是否沿用 8.1 job envelope | 通过 | 未新造 job envelope shell |
| job input 字段是否有 Step 6/7 来源 | 通过 | scope/page/target/ref 均回指 Step 6 object/ref 或 Step 7 repository/port |
| report item refs 是否闭合 | 通过 | `IdentityJobReportSurface` 和 `IdentityJobRunReport` 同步补齐 item refs |
| job scope marker 是否命名一致 | 通过 | `IdentityJobRunReport.job_scope_ref` 统一使用 `IdentityJobScopeMarkerRef` |
| duplicate replay 是否闭合 | 通过 | stored job report replay 不重跑 job body |
| partial / failed / retryable surface 是否闭合 | 通过 | `IdentityJobRunDisposition` + `IdentityJobResultKind` + `MaintenanceIssueRef`;publish/handoff issue refs 通过 Step 7 mapper 投影 |
| job 是否修复 truth | 禁止 | 只写 projection/reference/report/outbox/handoff state/report |
| outbox Published 是否等于下游 consumed | 否 | Published 只代表 outbound boundary |
| handoff Delivered 是否防 fake success | 通过 | Delivered 必须带 `HandoffReceiptRef` |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一步 | 8.7 | 用户审核通过后进入 cross protocol audit |

### 17.10 8.6 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| job metadata / idempotency 是否闭合 | 通过 | request 沿用 `IdentityJobRequest<T>` 的 run/key/scope/cursor/schema/system actor |
| job cursor 是否防混用 | 通过 | cursor 只在 envelope/report 中作为 `IdentityJobCursorRef`;page cursor 仍是 public page DTO |
| maintenance target expansion 是否私造 | 未私造 | 只引用 Step 7 maintenance/projection/reference repository |
| publisher / handoff failure 分类是否私造 | 未私造 | 使用 Step 7 outcome 的 retryable/permanent/skipped/unsupported 分类,并用 Step 7 maintenance issue mapper 生成 report issue refs |
| report 是否保存 raw log | 禁止 | report 只保存 refs/counts/issue markers |
| worker / job runner 是否可直连 store | 禁止 | runner 只调 application facade |
| retry job 是否定义 backoff | 未定义 | backoff / timeout / schedule 留 Step 14 |

### 17.11 8.6 正反例

| 场景 | 正例 | 反例 |
|---|---|---|
| job run ref | `IdentityJobRunRef` 来自 scheduler/job entry/id generator | job name + timestamp 拼 run ref |
| job cursor | `IdentityJobCursorRef` 来自 previous report/source scan | page cursor、timestamp、idempotency key 当 cursor |
| projection rebuild | stale/explicit refs 经 repository load/save | query miss 时直接 rebuild |
| reference refresh | `ExternalReferenceRef` bundle + loaded version | business source ref == bundle key |
| reconciliation | report-only, finding material body-free | finding 执行 repair action |
| outbox publish | load pending outbox + payload marker + topic binding | publisher reload current truth 重算 event |
| outbox failure | Retryable/Permanent/Unsupported outcome -> issue marker | raw adapter error string 决定状态且入仓 |
| handoff delivery | Delivered outcome 必须有 `HandoffReceiptRef` | HTTP 2xx/request sent/job log success |
| duplicate replay | load stored job report surface | duplicate 时重扫 pending outbox / stale projection |
| fake parity | fake 使用同一 outcome variant 和 stored report | fake 默认 publish/deliver 成功 |

---

## 18. 8.7 cross protocol audit

8.7 不新增业务 DTO 字段,只审计 Step 8 已定义的 public protocol surface 是否能进入 Step 9 function flows。审计目标是防止后续 flow 实现时再遇到二级类型无 schema、request 字段无来源、stored replay 缺载体、query 写状态、event/job 绕过 application facade 或 body boundary 漂移。

### 18.1 Newly defined public secondary types

| Type / family | Protocol family | Owner module | Closure source |
|---|---|---|---|
| `IdentityCommandName` / `IdentityQueryName` / `IdentityInboundConsumerName` / `IdentityOutboundEventName` / `IdentityJobName` | shared protocol naming | `identity-contracts::protocol` | 8.1 shared protocol helper |
| `IdentityProtocolSurfaceRef` / `IdentityProtocolSchemaVersionRef` / `IdentityDigestAlgorithmMarkerRef` | shared protocol metadata | `identity-contracts::protocol` | 8.1 shared protocol helper |
| `IdentityCommandMetadata` / `IdentityQueryMetadata` / `IdentityRequestDigestMarker` | command/query entry shell | `identity-contracts::protocol` | 8.1 metadata and digest shell |
| `IdentityCommandRequest<T>` / `IdentityCommandResponse<T>` / `IdentityCommandOutcome<T>` / `IdentityCommandEffectPublicSummary` | command request/result | `identity-contracts::commands` | 8.1, 8.2-a~c |
| `IdentityQueryRequest<T>` / `IdentityQueryResponse<T>` / `IdentityPageResponse<T>` / `IdentityPublicPageRequest` / `IdentityPublicPageInfo` / `IdentityQuerySurface` | query request/response | `identity-contracts::queries` | 8.1, 8.3-a~c |
| `IdentityVisibilityMarker` / `IdentityDegradedMarker` / `IdentityDegradedKind` / `IdentityRedactionMarkerRef` / `IdentityDegradedMarkerRef` | query visibility/degraded markers | `identity-contracts::views` | 8.1 public marker shell + Step 6 marker refs, 8.3-a~c |
| `IdentityProtocolValidationIssueRefSet` / `IdentityProtocolRejection` / `IdentityProtocolRejectionKind` / `IdentityDegradedMarker` | rejection / validation | `identity-contracts::protocol` | 8.1 rejection shell |
| `IdentityInboundEventEnvelope<T>` / `IdentityConsumerReceipt` / `IdentityConsumerOutcome` | inbound consumer / callback | `identity-contracts::events` | 8.1, 8.4 |
| `IdentityOutboundEventEnvelope<T>` / `IdentityOutboundEventRef` | outbound event envelope | `identity-contracts::events` | 8.1, 8.5 |
| `IdentityJobRequest<T>` / `IdentityJobResponse<T>` / `IdentityJobReportSurface` | operations job | `identity-contracts::jobs` | 8.1, 8.6 |
| 6 command request DTOs and 6 command result DTOs | command payload/result | `identity-contracts::commands` | 8.2-a~c |
| 14 query request/view DTOs plus selectors and sidecar view | query payload/view | `identity-contracts::queries` | 8.3-a~c |
| 5 inbound payload DTOs | inbound consumer/callback payload | `identity-contracts::events` | 8.4 |
| 10 outbound payload DTOs | outbound event payload | `identity-contracts::events` | 8.5 |
| `IdentityJobRunDisposition` / `IdentityJobItemCounts` / job scope DTOs / 6 job input-output DTO pairs | operations job payload/output | `identity-contracts::jobs` | 8.6 |

审计结论:上述二级 public 类型均有 owner、字段 schema、使用批次和后续 flow 入口。后续 Step 不得再以 bare string、bare enum 名或 application-local helper 替代这些 public surface。

### 18.2 DTO to object / port / flow closure audit

| Protocol family | Step 6 object closure | Step 7 port closure | Step 9 flow required |
|---|---|---|---|
| Command | request DTO 能构造 member/lifecycle/role/career/memory/handoff domain object 或 policy input,result DTO 能承接 accepted effect | truth repositories、subject mapper、trace/audit/outbox、stored result、id generator、clock | 6 command flows with transaction order, accepted cursor, outbox/stale/effect summary and stored replay |
| Query | request/view DTO 映射到 truth/projection/reference/report/outbox/handoff read object,query surface 表达 missing/not visible/degraded/stale | read visibility repository、truth read repositories、projection lookup、reference/report/outbox/handoff repositories、page mapping | 14 query flows with visibility precheck, no-write rule, stable view lookup and degraded priority |
| Inbound Event / Callback | payload DTO 映射到 role/career/memory source summary、reference state/sidecar、handoff callback state and receipt | external source resolver、reference repository、trace/outbox/effect where applicable、stored receipt/result | 5 consumer/callback flows with dedupe, unsupported version, delayed/quarantine/rejected/noop and callback receipt replay |
| Outbound Event | payload DTO 映射到 accepted fact/outbox material,只承载 event-specific refs/state/marker/cursor | outbox repository、topic binding、publisher port、payload marker builder | accepted outbox append and publish flows;publisher must not reconstruct payload from current truth |
| Operations Job | job input/output/report DTO 映射到 projection/reference/report/outbox/handoff maintenance surface | projection/reference/maintenance/report/outbox/handoff repositories, publisher/handoff ports, stored job report | 6 job flows with idempotency, stored report replay, partial/failed/retryable item refs and no truth repair |

审计结论:Step 8 已为每个 protocol family 提供 Step 9 可展开入口。Step 9 若需要额外字段、repository method、状态或 stored result variant,必须暂停回 Step 6/7/8 对应批次闭口,不得在 function flow 中直接发明。

### 18.3 Public body boundary audit

| External / private family | Allowed in Step 8 DTOs | Forbidden |
|---|---|---|
| actor/account/auth | `ActorRef`, system actor marker, trace context marker | account profile、credential、auth token、permission policy body |
| governance | `GovernanceBasisRef`, `GovernanceBasisSummary` marker refs | governance decision body、approval body、policy document body |
| role/capability/method | role/capability source refs、safe summary refs、evidence refs | RoleDefinition、CapabilityDefinition、method body、scoring body |
| work/project | `ProjectParticipationRef`, `WorkSourceRef`, `CareerSourceMarkerRef`, safe career summary | Project、WorkItem、ProjectMember JSON/body |
| memory/archive | `MemoryRef`, `ArchiveRef`, `ArchiveHandoffRef`, safe memory summary | memory text、embedding、index、archive package、receipt body |
| handoff | `TraceHandoffIntentRef`, target/scope refs、safe material marker、attempt/receipt/issue refs | target path、bucket、endpoint、adapter raw response、receipt body |
| outbox/publisher | `IdentityOutboxRecordRef`, `TopicKeyRef`, payload marker, publish attempt/issue refs | broker topic string、exchange、payload body、downstream response body、secret |
| reference refresh | `ExternalReferenceRef`, owner ref、source version marker、safe sidecar refs | external truth body、raw resolver response、source version as optimistic version |
| runtime/job | job refs、scope marker、cursor marker、report refs/counts/issues | raw CLI args、cron raw config、job log、stack trace、secret |

审计结论:Step 8 DTOs 均保持 body-free。字段级 redaction matrix、serialized outbound payload snapshot、stored job durable payload 和 retry/backoff config 留 Step 11/12/13/14/16,但不得因此允许 adapter/repository 私存 forbidden body。

### 18.4 Stored replay and idempotency audit

| Replay surface | Public output | Stored source | Missing / wrong-kind rule |
|---|---|---|---|
| command accepted | `IdentityCommandResponse<T>` + `IdentityCommandEffectPublicSummary` | `StoredIdentityOperationResult(CommandAccepted)` + command result/effect summary marker | Step 13 定义 degraded/rejected replay error;不得重跑 command |
| command rejected | `IdentityProtocolRejection` | `StoredIdentityOperationResult(CommandRejected)` only for replayable rejection | 普通 validation/internal error 是否存储留 Step 12/13 |
| consumer receipt | `IdentityConsumerReceipt` | `IdentityConsumerReceiptEnvelope(result_kind = ConsumerReceipt)` + `StoredIdentityOperationResult(ConsumerReceipt)` shell | missing typed envelope 不得重放 consumer mutation |
| handoff callback receipt | `IdentityConsumerReceipt` with callback family | `IdentityConsumerReceiptEnvelope(result_kind = HandoffCallbackReceipt)` + `StoredIdentityOperationResult(HandoffCallbackReceipt)` shell | kind mismatch 不得当普通 consumer receipt |
| operations job report | `IdentityJobResponse<T>` with `IdentityJobReportSurface` | `StoredIdentityOperationResult(JobReport)` + `IdentityJobRunReport` | missing stored report 不得重扫 projection/reference/outbox/handoff |

审计结论:Step 8 public replay surface 已和 Step 6/7 stored result kind 对齐。Consumer/callback replay 必须使用 typed receipt envelope,不只使用 generic stored shell。Step 13 必须补 digest、same-key conflict、missing typed envelope、wrong-kind stored result 和 in-flight replay matrix;Step 8 不定义 digest algorithm 或 durable table。

### 18.5 Handler target and entry boundary audit

| Entry family | Public protocol shell | Allowed target | Forbidden |
|---|---|---|---|
| API command | `IdentityCommandRequest<T>` | `IdentityApplicationFacade::dispatch_command` | handler 直连 repository / UoW / idempotency / outbox |
| API query | `IdentityQueryRequest<T>` | `IdentityApplicationFacade::dispatch_query` | handler 直连 projection/read repository 或 query path 写状态 |
| worker event | `IdentityInboundEventEnvelope<T>` | `IdentityApplicationFacade::dispatch_inbound_event` | worker 直连 resolver/reference repo 或 ack 当 accepted |
| worker callback | `IdentityInboundEventEnvelope<T>` callback payload | `IdentityApplicationFacade::dispatch_callback` | callback raw receipt body 直接改 handoff/memory state |
| outbox publisher | `IdentityOutboundEventEnvelope<T>` from outbox material | application publish job + publisher port | publisher reload current truth 重算 payload |
| operations job | `IdentityJobRequest<T>` | `IdentityApplicationFacade::dispatch_job` | job runner 扫 store、rebuild projection、publish outbox 或 deliver handoff |

审计结论:所有 handler target 都收敛到 application facade。Step 9 只能写 application service flow;API/worker/jobs entry 的 route/binding/config 细节留 Step 14/15/16。

### 18.6 Phase boundary and deferred item audit

| Deferred item | Deferred Step | Current Step 8 stance |
|---|---|---|
| function-level transaction order / save-before-side-effect order | Step 9 / Step 11 | Step 8 只固定 DTO surface 和 closure source |
| state transition priority and terminal/reopen rules | Step 10 | Step 8 只引用 state kind,不新增迁移 |
| persistence schema / version / UoW commit ordering | Step 11 | Step 8 只要求 repository/stored surface 可承载 |
| error recovery / public status mapping / retryable vs permanent priority | Step 12 | Step 8 定义 outcome shell,不定义全部 priority |
| idempotency digest algorithm and duplicate conflict matrix | Step 13 | Step 8 固定 digest marker和 stored replay surface |
| topic binding, adapter config, retry schedule and timeout | Step 14 | Step 8 只使用 topic/target/adapter marker |
| observability/audit/log metric boundaries | Step 15 | Step 8 只禁止 raw log/body 进入 DTO |
| executable test cuts / redaction matrix | Step 16 | Step 8 给出 public surface,测试组合后续展开 |

审计结论:无 Step 8 内必须提前补的后续 Step 内容。所有 deferred item 都有明确 Step 归属,不是当前 blocker。

### 18.7 Step 8 completion checklist

| Checklist | Status |
|---|---|
| 6 command request/result schemas are defined | [x] |
| 14 query request/view/page/surface schemas are defined | [x] |
| 5 inbound consumer/callback envelope/payload/receipt schemas are defined | [x] |
| 10 outbound event envelope/payload/topic/schema marker schemas are defined | [x] |
| 6 operations job input/output/report/stored replay schemas are defined | [x] |
| Shared protocol naming, metadata, digest, page, issue and rejection shells are defined | [x] |
| Query response surfaces distinguish visible/redacted/not visible/degraded/stale/empty/missing/rebuilding/disabled | [x] |
| Consumer receipt outcomes distinguish accepted/duplicate/rejected/quarantined/delayed/noop/unsupported | [x] |
| Outbound event payloads are accepted-only and body-free | [x] |
| Job duplicate replay uses stored job report surface with item refs, not rerun | [x] |
| Public DTOs avoid domain-only objects and application-local repository page/context helpers | [x] |
| Step 9 entry names are one-to-one with HLD protocol names and handler targets | [x] |

### 18.8 Step 9 entry condition

Step 9 可以开始,但必须遵守以下入口门禁:

- 每条 flow 必须从本 Step 8 对应 DTO 出发,不得引入同义 request/result/payload/report 名称。
- 每个 DTO 字段必须回指 Step 6 object/state/ref 或 Step 7 port/helper;缺口必须暂停回写,不能在 flow 中临时补字段。
- Command accepted flow 必须明确 transaction order、truth save、accepted cursor、trace/audit/outbox/stale、stored result 和 idempotency complete。
- Query flow 必须先闭合 read visibility / stable view lookup / page mapping / no-write surface,不得 query miss rebuild 或 refresh。
- Consumer/callback flow 必须闭合 idempotency、stored receipt、reference bundle version、marker trace subject、callback receipt marker 和 unsupported/quarantine/delay path。
- Outbound publish flow 必须使用 saved outbox record + payload marker + topic binding;不得读取 current truth 重构 event body。
- Job flow 必须使用 application facade、stored job report replay、body-free item refs 和 formal retryable/permanent outcome;不得 runner 直连 store。
- Step 9 若发现 Step 8 的 DTO/result/report 与 Step 6/7 surface 不一致,优先修正设计真相源,不得将不一致留给实现。

### 18.9 8.7 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否新增业务 DTO 字段 | 未新增 | 本批只审计和收口 |
| secondary public type 是否无悬空 | 通过 | §18.1 列出 owner 和 closure source |
| DTO -> object / port / flow 是否闭合 | 通过 | §18.2 按协议族审计 |
| body-free 边界是否闭合 | 通过 | §18.3 禁止 forbidden body |
| stored replay 是否闭合 | 通过 | §18.4 覆盖 command/consumer/callback/job |
| entry handler 是否只进 application facade | 通过 | §18.5 固定 target |
| 后续 Step deferred item 是否明确 | 通过 | §18.6 分配到 Step 9~16 |
| 是否修改正式 `03` | 未修改 | 正式 `03` 仍等 Step 19 装配 |
| 下一步 | Step 9 | 用户审核通过 Step 8 后进入 function flows |

---

## 19. 复杂度判断 / 是否拆模块、协议族、接口或附录

Step 8 复杂度高,必须拆分。当前 identity 的协议数量为 41 个正式协议面:6 Command、14 Query、5 Inbound Event Consumer / Callback、10 Outbound Event、6 Operations Job。并且每组都需要 shared metadata、idempotency、visibility、stored replay、receipt、report、payload marker、page DTO、safe issue marker 等二级 public surface。

因此本 Step 采用 `8.0~8.7` 批次。当前已完成 `8.0 framework / batch plan / redlines`、`8.1 shared protocol helper and protocol inventory`、`8.2-a member / lifecycle command DTOs`、`8.2-b role / career / memory command DTOs`、`8.2-c handoff command DTO`、`8.3-a core truth query DTOs`、`8.3-b trace / audit / summary query DTOs`、`8.3-c maintenance / outbox / handoff query DTOs`、`8.4 inbound event / callback protocols`、`8.5 outbound event protocols`、`8.6 operations job protocols` 和 `8.7 cross protocol audit`。Step 8 已完成并已审核通过,后续进入 Step 9。

---

## 20. 回填草稿

正式 `03-详细设计.md` 第 7 章后续应从已审核的 Step 8 中间产物装配。当前 8.0 可回填为:

```text
Step 8 协议契约采用分批停审方式执行,先建立 shared protocol helper 和协议总表,再分别展开 Command、Query、Inbound Event Consumer / Callback、Outbound Event 和 Operations Job,最后进行跨协议 public surface 审计。

本仓协议清单承接新版 HLD Step 7 和 DDD Step 6/7:6 个 Command、14 个 Query、5 个 Inbound Event Consumer / Callback、10 个 Outbound Event 和 6 个 Operations Job。每个协议必须定义 request / response / result / view / page / marker / payload / receipt / report 中实际需要的 public DTO schema,并说明字段来源、缺失处理、empty / not visible / degraded / rejected / duplicate / stale / missing / retryable / permanent failed 等 public surface。

Step 8 不得一次性生成全局 schema 大表,不得新增 Step 6/7 没有来源的 DTO 字段,不得让 public DTO 直接依赖 domain-only type,不得把 application-local helper 暴露为 public contracts。发现字段来源、port、状态或对象缺口时,必须暂停并回 Step 6/7 闭口。
```

当前 8.1 可追加回填为:

```text
Step 8 shared protocol helper 定义 public protocol naming、metadata、digest、command outcome、query surface、public page DTO、protocol rejection、consumer receipt、outbound event envelope 和 job report surface。Step 7 的 `IdentityRepositoryPage` / `Page<T>` / `IdentityOperationContext` / stored result / facade dispatch 均为 application-local surface,不得直接暴露到 public DTO;Step 8 通过 public page、metadata、digest、result、receipt、report shell 建立正式映射。

所有 protocol surface 均使用 HLD 已审核名称作为 canonical name。Command、Query、Inbound Consumer / Callback、Outbound Event 和 Operations Job 均建立 HLD name -> Request / Payload / Result / View / Receipt / Report DTO -> handler target -> Step 9 flow 的一对一映射。后续具体协议批次必须沿用这些名称,不得再引入同义接口名。
```

当前 8.2-a 可追加回填为:

```text
`EstablishGlobalMemberRequest` 只承载 optional requested member ref、body-free source ref、optional anchor reason ref 和 initial lifecycle reason ref。accepted result 返回 member ref、anchor state kind、initial lifecycle state kind、source ref 和 accepted effect summary。建档 DTO 能构造 `IdentityAnchorPolicy::for_create(...)`、`GlobalMember::establish(...)` 和 `GlobalLifecycleState::initial_available(...)`;member ref 缺失时由 id generator 生成,created/changed time 来自 clock,existing anchor state 来自 member repository,accepted cursor/effect/outbox/trace 来自 application side-effect builder。

`UpdateGlobalLifecycleStateRequest` 承载 member ref、target lifecycle state、lifecycle reason ref、optional governance basis ref 和 optional action risk ref。accepted result 返回 member ref、lifecycle state kind、reason ref、optional basis ref、optional anchor state kind 和 accepted effect summary。高风险处置不得仅凭 `GovernanceBasisRef` presence accepted;必须通过 governance basis resolver 取得 `GovernanceBasisSummary`,并证明 basis valid for action risk。lifecycle DTO 能构造 `LifecycleTransitionPolicy::for_transition(...)`、`HighRiskLifecycleGuard::for_action(...)` 和 `GlobalLifecycleState::from_transition(...)`;terminal anchor hold 的具体 side effect 由 Step 9/10 闭口。
```

当前 8.2-b 可追加回填为:

```text
`MaintainRoleCapabilitySummaryRequest` 承载 member ref、optional summary ref、role/capability source refs、evidence refs、optional safe summary marker、change reason 和 material marker。accepted result 返回 summary ref、source snapshot ref、summary/source state、source/evidence refs、safe summary marker 和 accepted effect summary。DTO 能构造 `RoleCapabilitySourceSnapshot`、`RoleCapabilitySourcePolicy::for_summary_update(...)` 和 `RoleCapabilitySummary`;source/evidence validity 必须来自 Step 7 resolver summary,不得保存 RoleDefinition / CapabilityDefinition / method / evidence body,也不得用 source version 替代 optimistic version。

`AppendCareerRecordRequest` 承载 member ref、optional career record ref、append/correction intent、ProjectParticipationRef、WorkSourceRef、CareerSourceMarkerRef、optional safe summary marker、append reason、optional original record ref 和 material marker。accepted result 返回 appended record ref、record state、work source markers、safe summary marker、correction refs 和 accepted effect summary。DTO 能构造 `CareerAppendPolicy` 和 `CareerRecord::append_from_work_source(...)` / `correction_for_record(...)`;duplicate source 不新增 history,correction 必须追加新 record,Project / WorkItem / ProjectMember body 不得进入 DTO、truth、trace、outbox 或 report。

`MaintainMemoryReferenceRequest` 承载 member ref、optional memory reference ref、change intent、optional memory/archive/handoff refs、source ref、optional safe summary marker、reason 和 material marker。accepted result 返回 memory reference ref、relation state kind、memory/archive/handoff refs、source ref、safe summary marker、reason 和 accepted effect summary。DTO 能构造 `MemoryReferencePolicy`、`MemoryReference::link_for_member(...)` / `from_archive_handoff(...)` / state update;memory body、embedding、index、archive package、receipt body 和 external carrier truth 不得进入 identity。
```

当前 8.2-c 可追加回填为:

```text
`PrepareTraceHandoffRequest` 承载 member ref、optional handoff intent ref、非空 trace refs、optional audit trail ref、handoff target/scope refs、safe material marker、visibility context 和 handoff reason。accepted result 返回 handoff intent ref、`PendingHandoff` state、target/scope refs、trace refs、optional audit trail ref、safe material marker 和 accepted effect summary。DTO 能构造 `HandoffPolicy::for_handoff(...)`、`HandoffState::pending(...)` 和 `TraceHandoffIntent::prepare(...)`;prepare 只创建 pending intent,不得执行 delivery,不得保存 trace body、audit raw log、archive package、receipt body、target secret 或 adapter raw response。Delivered 只能由后续 callback/job 的 formal `HandoffReceiptRef` 驱动。
```

当前 8.3-a 可追加回填为:

```text
`GetGlobalMemberAnchorRequest` / `GetGlobalLifecycleSummaryRequest` / `GetRoleCapabilitySummaryRequest` / `ListCareerRecordsRequest` / `ListMemoryReferencesRequest` 均沿用 `IdentityQueryRequest<T>`、`IdentityQueryResponse<T>`、`IdentityPageResponse<T>` 和 `IdentityQuerySurface`。request body 只承载 `member_ref`、`consumer_ref` 以及 role summary 的 optional `summary_ref`;list query 的分页只使用 envelope `IdentityPublicPageRequest`。`visibility_context_ref` 来自 `IdentityQueryMetadata`,read subject/scope/access summary 来自 Step 7 `IdentityReadVisibilityRepository.resolve_member_summary_read(...)`,stable member summary view ref 来自 `IdentityProjectionRepository.find_member_summary_view_ref(...)`;query service 不得从 route、member id、view id 或 source token 拼接 subject/scope/view ref。

五条 core truth query 的 view DTO 只返回 typed refs、state kind、safe summary marker、reason/basis marker 和 optional projection slice refs。`GlobalMemberAnchorView` 读取 `GlobalMember` / `IdentityAnchorState`;`GlobalLifecycleSummaryView` 读取 `GlobalLifecycleState`;`RoleCapabilitySummaryView` 读取 `RoleCapabilitySummary` / `RoleCapabilitySourceSnapshot`;`CareerRecordView` 读取 append-only `CareerRecord`;`MemoryReferenceView` 读取 `MemoryReference` / `MemoryReferenceState`。query missing / empty / not visible / degraded / stale visible 均通过 `IdentityQuerySurface` 表达,不得创建 truth、刷新外部 source、rebuild projection、mark fresh、append trace/audit/outbox 或返回 role/work/memory/archive/governance 正文。
```

当前 8.3-b 可追加回填为:

```text
`ReadMemberSummaryRequest` 读取统一成员摘要,request body 只承载 `member_ref` 和 `consumer_ref`;`visibility_context_ref` 来自 `IdentityQueryMetadata`。query service 先用 `IdentityReadVisibilityRepository.resolve_member_summary_read(...)` 取得可见性输入和 scope,再通过 `IdentityProjectionRepository.find_member_summary_view_ref(member_ref, scope_ref)` 取得稳定 `MemberSummaryViewRef`,最后加载 `MemberSummaryView` 并用 `VisibilityPolicy::for_summary(...)` 分类为 visible/redacted/not visible/stale/degraded/missing。summary query 不创建 view、不重建 projection、不刷新外部 source、不追加 trace/audit/outbox。

`ReadIdentityTraceRequest` 使用 `IdentityTraceReadSelector` 固定三种 Step 7 已支持的读取面:按 member、按 trace subject + optional accepted truth cursor、按 member + change kind。trace list 使用 envelope public page cursor;after-cursor 只能使用 `IdentityTruthCursor`,不得与 page cursor 混用。每条 loaded `IdentityTraceRecord` 通过其 typed `subject_ref` 调 `IdentityReadVisibilityRepository.resolve_trace_read(...)`,再由 `VisibilityPolicy::for_trace(...)` 生成可见/redacted/not visible/degraded surface。`IdentityTraceRecordView` 只返回 trace refs、member、trace/audit subject refs、change kind、source cursor、safe reason/source/basis/actor marker、visibility result、correction marker、material marker 和 occurred_at;不得返回 raw log、reason body、source body 或 governance body。

`ReadAuditTrailRequest` 承载 `member_ref`、`audit_scope_ref`、optional `audit_cursor_ref` 和 `consumer_ref`。本批 audit read 明确限定为 member canonical audit subject:audit subject 必须由 `IdentityTruthChangeSubjectMapper.member_subjects(member_ref).audit_subject_ref` 生成,visibility 通过 `IdentityReadVisibilityRepository.resolve_audit_read(...)` 取得,audit trail ref 通过 `IdentityAuditTrailRepository.find_audit_trail_by_subject(...)` 取得,entries 通过 `list_audit_entries(audit_trail_ref, audit_scope_ref, audit_cursor_ref, page)` 分页读取。若后续需要聚合 role/career/memory 等成员子 truth 的 audit trail,必须先在 Step 6/7/9/11 增加正式聚合规则或读取面。`AuditTrailEntryView` 只返回 audit trail/ref/scope、member、trace record ref、change kind、visibility result 和 occurred_at;missing/empty/not visible/degraded 均走 `IdentityQuerySurface`,不得创建 audit trail、修复缺失 trace 或保存 raw audit log。
```

当前 8.3-c 可追加回填为:

```text
`GetProjectionStateRequest` 承载 `IdentityProjectionRef`、optional `ProjectionStateRef` 和 `ConsumerRef`;`visibility_context_ref` 来自 `IdentityQueryMetadata`。query service 先调用 `IdentityReadVisibilityRepository.resolve_projection_state_read(...)`,再通过 `IdentityProjectionRepository.get_projection_state_with_version(projection_ref)` 读取 stored `ProjectionState`。`ProjectionStateView` 只返回 projection state ref、projection ref、optional member、state kind、projection source cursor、maintenance scope、issue marker、checked_at 和 visibility result。stale、degraded、rebuild pending、rebuild failed 都只通过 `IdentityQuerySurface` 表达;query 不触发 rebuild、不 mark fresh、不创建 projection state。

`GetReferenceResolutionStateRequest` 承载 `ExternalReferenceRef`、optional `IdentityReferenceOwnerRef` 和 `ConsumerRef`。query service 先调用 `IdentityReadVisibilityRepository.resolve_reference_state_read(...)`,再读取 `IdentityReferenceStateRepository.get_reference_state_with_version(...)` 和同 bundle 的 `get_typed_sidecar_refs(...)`,并映射为 public `ReferenceResolutionSidecarRefsView`。`ReferenceResolutionStateView` 只返回 resolution state ref、external reference ref、owner ref、state kind、external source version marker、safe summary marker、typed sidecar refs、issue marker、checked_at 和 visibility result。query 不调用 external resolver、不刷新 source、不保存 sidecar、不把 source version 当 optimistic version,也不返回 method/work/memory/archive/governance body。

`ReadReconciliationReportRequest` 承载 `MaintenanceScopeRef`、optional `ReconciliationReportRef` 和 `ConsumerRef`,分页只使用 `IdentityPublicPageRequest`。scope list 必须先调用 `IdentityReadVisibilityRepository.resolve_reconciliation_scope_read(...)`,再使用 `IdentityReconciliationReportRepository.list_reports_by_scope(...)`;exact report read 还必须对 loaded `report_ref` 调 `resolve_report_read(...)`。`ReconciliationReportView` 只返回 report ref、scope、target refs、finding refs、issue refs、report state、generated metadata 和 visibility result。report 是 report-only material,不含 repair action、external body、raw diagnostic、debug dump 或自动 remediation plan。

`ListPendingIdentityOutboxRequest` 使用 `IdentityOutboxListSelector` 固定 Step 7 已支持读取面:pending by topic、retryable by topic、by formal outbox subject、by member via `IdentityTruthChangeSubjectMapper.member_subjects(...).outbox_subject_ref`、by trace record。`IdentityOutboxRecordView` 只返回 outbox record ref、member、subject、change kind、payload marker、topic key、trace ref、outbox state kind、attempt/issue marker、created/updated time 和 visibility result。query 不发布、不重试、不读取 payload body、不展开 topic private config,`Published` 只表示 outbound boundary 成功。

`GetIdentityOutboxStateRequest` 承载 `IdentityOutboxRecordRef` 和 `ConsumerRef`,先调用 `IdentityReadVisibilityRepository.resolve_outbox_record_read(...)`,再读取 `IdentityOutboxRepository.get_outbox_record_with_version(...)`。`IdentityOutboxStateView` 只暴露 outbox state、attempt/issue marker、payload marker、subject/topic/trace refs、changed_at 和 visibility result;missing / not visible / degraded 走 `IdentityQuerySurface`,不得创建 outbox、调用 publisher 或查询下游消费状态。

`GetTraceHandoffStateRequest` 承载 `TraceHandoffIntentRef` 和 `ConsumerRef`,先调用 `IdentityReadVisibilityRepository.resolve_handoff_intent_read(...)`,再读取 `TraceHandoffIntentRepository.get_handoff_intent_with_version(...)`。`TraceHandoffStateView` 只返回 handoff intent、member、trace refs、optional audit trail、target/scope refs、safe material marker、handoff state、attempt/receipt/issue markers、created/updated/changed time 和 visibility result。query 不执行 delivery、不 retry、不保存 receipt body、archive package、target private path 或 observability raw log;`Delivered` 必须来自正式 `HandoffReceiptRef` marker。
```

当前 8.4 可追加回填为:

```text
五条 inbound event / callback protocol 均沿用 `IdentityInboundEventEnvelope<T>` 和 `IdentityConsumerReceipt`。Envelope 承载 consumer name、envelope marker、binding ref、source event ref、idempotency key、schema version、occurred/received time、trace context 和 typed payload。`source_event_ref` 与 `idempotency_key` 是 duplicate guard 的正式输入,payload 不重复 envelope 字段,也不得用 payload hash、broker offset 或 raw callback body 临时代替。Application service 返回统一 `IdentityConsumerReceipt`;callback 不另造 receipt 壳,但 stored result kind 必须区分 `ConsumerReceipt` 与 `HandoffCallbackReceipt`。

`RoleCapabilitySourceChangedPayload` 只承载 member ref、role/capability source ref、source version、source state、optional safe summary、evidence refs、optional external reference bundle marker、optional reason 和 material marker。它能构造/更新 `RoleCapabilitySourceSnapshot` 和相关 reference state/sidecar,但不保存 RoleDefinition、CapabilityDefinition、method body、evidence body 或 scoring body。source version 只表示上游 source version,不得当 identity optimistic version。

`WorkParticipationAcceptedPayload` 只承载 member ref、ProjectParticipationRef、WorkSourceRef、CareerSourceMarkerRef、CareerSafeSummaryRef、optional append reason 和 material marker。它通过 `CareerAppendPolicy` 追加 `CareerRecord` 或返回 duplicate/rejected/quarantine/noop receipt,不保存 Project、WorkItem、ProjectMember body,也不反写 work truth。`CareerSourceMarkerRef` 是 source duplicate guard,不等于 idempotency key。

`MemoryReferenceSourceStateChangedPayload` 只承载 member ref、optional MemoryReferenceRef、MemoryReferenceSourceRef、optional MemoryRef/ArchiveRef、target MemoryReferenceStateKind、optional safe summary、optional external reference bundle marker、optional reason 和 material marker。它更新 identity-owned memory reference relation/state 或 reference sidecar,但不保存 memory body、embedding、index、archive package、carrier truth 或 receipt body。missing relation / pending verification 的精确处理留 Step 9/10/12。

`ArchiveHandoffResultPayload` 只承载 member ref、optional MemoryReferenceRef、ArchiveRef、ArchiveHandoffRef、target MemoryReferenceStateKind、optional reason、optional HandoffIssueRef 和 material marker。它通过 direct ref 或 `find_callback_target_by_handoff(...)` 找到 memory relation,并把 archive handoff result 映射为 memory relation state marker,不保存 archive package、receipt body、adapter response 或外部 archive truth。

`TraceHandoffResultPayload` 只承载 TraceHandoffIntentRef、HandoffTargetRef、optional HandoffScopeRef、HandoffAttemptRef、TraceHandoffResultKind、optional HandoffReceiptRef 和 optional HandoffIssueRef。`Delivered` 必须同时带 formal `HandoffReceiptRef`,失败/取消必须保留 safe issue marker;HTTP 2xx、request sent、job log success 或 adapter raw response 都不得推进 delivered。Callback receipt 使用 `IdentityConsumerReceipt` 和 stored `HandoffCallbackReceipt`,duplicate callback 不重跑状态更新。
```

当前 8.5 可追加回填为:

```text
十条 outbound event protocol 均沿用 `IdentityOutboundEventEnvelope<T>`。Envelope 承载 event name、event ref、outbox record ref、topic key、schema version、payload marker、trace ref、published subject ref 和 typed payload。Envelope 字段必须与 saved `IdentityOutboxRecord` 对齐:outbox record ref、topic key、payload marker、trace ref 和 outbox subject 不得漂移。Payload DTO 不重复 envelope 字段,只承载 event-specific refs、state kind、safe summary marker、reason/basis marker 和 accepted cursor。

`GlobalMemberEstablishedPayload` 承载 member ref、source ref、anchor state kind、initial lifecycle state kind、created actor/time 和 accepted cursor,不保存 account、credential、runtime 或 ProjectMember body。`IdentityAnchorChangedPayload` 承载 member ref、anchor state kind、optional anchor reason、changed time 和 accepted cursor,不保存 reason body 或 governance body。`GlobalLifecycleChangedPayload` 承载 lifecycle state、reason、optional basis、changed actor/time、optional terminal anchor state 和 accepted cursor,不保存 governance basis body、runtime health 或 ProjectMember state。`GlobalMemberAvailabilityChangedPayload` 用 lifecycle state + `is_available` derived bool 表达 availability,不新增 availability truth 或 summary ref。

`RoleCapabilitySummaryChangedPayload` 承载 summary ref、summary state、role/capability source refs、evidence refs、safe summary、source snapshot 和 accepted cursor。`RoleCapabilitySourceStateChangedPayload` 承载 snapshot ref、source ref/version/state、optional linked summary、safe summary/evidence refs 和 accepted cursor。两者都不得保存 RoleDefinition、CapabilityDefinition、method body、evidence body 或 scoring body。

`CareerRecordAppendedPayload` 承载 normal appended career record ref、ProjectParticipationRef、WorkSourceRef、CareerSourceMarkerRef、safe career summary、append reason/time 和 accepted cursor。`CareerCorrectionAppendedPayload` 承载 correction record ref、original record ref、work/source markers、safe summary、append reason/time 和 accepted cursor。career outbound event 必须保持 append-only,不得覆盖或删除 original record,也不得保存 Project、WorkItem、ProjectMember 或 correction note body。

`MemoryReferenceChangedPayload` 承载 memory reference ref、memory/archive/handoff refs、source ref、safe summary、reason/time、reference state kind 和 accepted cursor。`MemoryArchiveHandoffStateChangedPayload` 承载 archive handoff marker、optional memory relation、optional trace handoff intent、handoff state marker、formal receipt/issue marker 和 accepted cursor。memory/archive outbound event 不保存 memory text、embedding、index、archive package、receipt body 或 adapter raw response;`HandoffReceiptRef` 仍只是 delivered marker。

Topic key 和 schema version 在 Step 8 只作为 protocol marker 固定,例如 `identity.lifecycle.changed.v1` 与 `identity.outbound.lifecycle-changed.v1`;broker topic、exchange、tenant route、credential 和 deployment binding 留 Step 14。当前 Step 7 publisher 只接收 `IdentityOutboxPayloadMarkerRef`,因此 Step 8 只闭合 payload DTO 与 body-free marker 的协议真相;若后续需要 durable serialized envelope snapshot,必须在 Step 11/13 正式定义 marker -> snapshot 的保存、读取和 duplicate replay surface,不得由 publisher 私造 current-truth payload。
```

当前 8.6 可追加回填为:

```text
六条 operations job protocol 均沿用 `IdentityJobRequest<T>`、`IdentityJobResponse<T>` 和 `IdentityJobReportSurface`。Job request 承载 job name、run ref、metadata marker、scope marker、idempotency key、optional job cursor、schema version、system actor 和 typed input;job response 返回 stored result ref、typed output 和 replayable report surface。Job runner 只能解析 entry/context 并调用 `IdentityApplicationFacade::dispatch_job`,不得直连 repository、publisher、handoff adapter 或 projection store。

`RebuildIdentityProjectionJobInput` 通过 explicit projection refs 或 outer maintenance scope 选择 projection target,输出 rebuilt/failed projection refs、report refs、issue refs 和 counts。`RefreshExternalReferenceStateJobInput` 通过 explicit refs、stale-in-scope、owner 或 kind 选择 `ExternalReferenceRef` bundle,输出 refreshed/failed reference refs;refresh 必须使用 loaded reference state version,不得把 business source ref 或 source version 当 bundle key/version。`RunIdentityReconciliationJobInput` 承载 maintenance scope、explicit/expanded target scope、finding intent 和 body-free finding material,输出 report refs、inspected target refs 和 issue refs;report-only policy 禁止 repair truth。

`PublishIdentityOutboxJobInput` 只按 optional `TopicKeyRef` 和 page 读取 pending outbox,经 topic binding 和 publisher outcome 更新 outbox state,输出 scanned/published/failed outbox refs;Published 只代表 outbound boundary 成功,不代表 downstream consumed。`DeliverTraceHandoffJobInput` 通过 explicit intent refs 或 target-scoped intent list 选择 handoff,经 target resolution 和 delivery outcome 更新 handoff state,输出 scanned/delivered/failed intent refs 与 receipt refs;Delivered 必须带 formal `HandoffReceiptRef`,HTTP 2xx、request sent 或 job log success 都不得推进 delivered。`RetryIdentityPropagationFailuresJobInput` 单次只选择 outbox retryable 或 handoff retryable 一种 family,组合调度留 Step 14。

Job duplicate replay 必须读取 stored `IdentityJobReportSurface` / `IdentityJobRunReport`,并 replay report item refs、counts、issue refs 和 output refs;不得重跑 rebuild/refresh/reconciliation/publish/handoff,也不得 duplicate 时重扫 repository 反推 item refs。Partial、Failed、RetryableFailed 必须保留 safe issue marker;report 不保存 raw job log、external body、payload body、receipt body、broker response、target path 或 secret。
```

当前 8.7 可追加回填为:

```text
Step 8 cross protocol audit 确认所有 command、query、inbound consumer/callback、outbound event 和 operations job 的 public secondary types 均有 owner、字段 schema、closure source 和 Step 9 flow 入口。Public DTO 不暴露 domain-only object、application-local `IdentityOperationContext`、repository `Page<T>` 或 raw adapter/config/body;entry 通过 command/query/event/job envelope 映射到 application facade。

Command replay 依赖 stored command result 和 accepted effect summary;query 使用 `IdentityQuerySurface` 表达 visible/redacted/not visible/degraded/stale/empty/missing/rebuilding/disabled;consumer/callback replay 依赖 stored receipt;outbound event 使用 saved outbox record + payload marker + topic binding;operations job replay 依赖 stored job report surface 和 `IdentityJobRunReport` item refs。所有 replay path 均不得重跑 mutation 或重扫 store 反推 result。

Step 9 可以开始逐接口 function flows,但每条 flow 必须从 Step 8 对应 DTO 出发,并回指 Step 6 object/state/ref 与 Step 7 port/helper。若 flow 需要额外字段、状态、port、stored result variant、visibility mapping、reference bundle version、payload snapshot 或 job report item refs,必须回 Step 6/7/8 对应批次闭口,不得在 Step 9 或实现阶段自行补 schema、port、状态或 phase boundary。
```

当前不写入正式 `03-详细设计.md`。

---

## 21. 待确认事项

| 编号 | 待确认 | 影响 | 当前处理 |
|---|---|---|---|
| DDD-S8-OPEN-001 | 8.1 shared helper 的具体二级公开类型命名 | 影响所有 request/result/page/receipt/report/payload 命名 | 已在 8.1 闭口 |
| DDD-S8-OPEN-002 | command result 是否采用统一 envelope + typed result body | duplicate replay、handler mapping、stored result surface | 已在 8.1 闭口;具体 result body 留 8.2 |
| DDD-S8-OPEN-003 | query visible success / not visible / degraded 的 response envelope 形态 | API query handler result 和 public surface | 已在 8.1 闭口;具体 view body 留 8.3 |
| DDD-S8-OPEN-004 | inbound consumer receipt 的 accepted / duplicate / delayed / quarantined / rejected 命名 | worker ack/retry/dead-letter 和 stored receipt | 已在 8.1 闭口;具体 payload 留 8.4 |
| DDD-S8-OPEN-005 | job report status 和 partial / retryable failed / permanent failed variant | worker runner、stored job report、query report | 已在 8.6 闭口;`IdentityJobRunDisposition` + `IdentityJobResultKind` |
| DDD-S8-OPEN-006 | outbound event envelope 的 schema version、topic key 和 payload marker 字段 | publisher adapter、topic binding、redaction | 已在 8.1 / 8.5 闭口 |
| DDD-S8-OPEN-007 | terminal lifecycle 是否同步更新 anchor hold,以及 reason 映射规则 | `UpdateGlobalLifecycleState` terminal side effect、state matrix、transaction | 留 Step 9/10;8.2-a 只把 optional result 字段和暂停条件写清 |
| DDD-S8-OPEN-008 | high-risk basis unavailable 是 rejected、pending basis 还是 degraded dependency surface | lifecycle command public rejection、error recovery | 留 Step 12;8.2-a 固定不得 accepted |
| DDD-S8-OPEN-009 | role/capability source unavailable、missing evidence、missing safe summary 是 rejected、pending 还是 accepted stale/unavailable | `MaintainRoleCapabilitySummary` flow、state matrix、error surface | 留 Step 9/10/12;8.2-b 固定不得 accepted active |
| DDD-S8-OPEN-010 | career pending review 是否持久化 `SourcePendingReview` record,还是返回 rejected / report-only surface | `AppendCareerRecord` pending/untrusted source flow、state matrix、stored result | 留 Step 9/10/12/13;8.2-b 固定 duplicate 不新增 history |
| DDD-S8-OPEN-011 | memory relation pending verification / handoff result marker 的 precise state mapping | `MaintainMemoryReference` state matrix、callback flow、error surface | 留 Step 9/10/12;8.2-b 固定不得保存 receipt/package body |
| DDD-S8-OPEN-012 | `PrepareTraceHandoff` target unavailable / unsupported / disabled 的 precise public rejection kind | handoff prepare flow、handler status、target config | 留 Step 9/12/14;8.2-c 固定不得 fallback target |
| DDD-S8-OPEN-013 | trace/audit visibility denied 时是 `PolicyDenied` 还是 specialized not-visible command rejection | handoff prepare flow、error recovery、test cuts | 留 Step 9/12;8.2-c 固定不得 handoff invisible material |
| DDD-S8-OPEN-014 | handoff safe material builder 的最小 public schema / marker source | material redaction、forbidden body tests、archive handoff | 留 8.4/8.5/Step 12/16;8.2-c 只使用 `TraceHandoffSafeMaterialRef` |
| DDD-S8-OPEN-015 | HLD optional `ConsistencyHintRef` 是否进入正式 query metadata / request schema | query cache、projection freshness、read-your-write 语义 | 留 Step 9/12/13;8.3-c 不新增未闭合字段 |
| DDD-S8-OPEN-016 | `CareerRecordFilterRef` / `MemoryReferenceFilterRef` 的正式 schema、过滤语义和 repository read surface | list query filter、page cursor 稳定性、fake/durable 等价 | 留 Step 6/7/9/11;8.3-a 只支持 member-scoped paged list |
| DDD-S8-OPEN-017 | core query partial item missing / snapshot missing 是 `Degraded`、`StaleVisible` 还是 `Missing` 的精确优先级 | query state matrix、error recovery、test cuts | 留 Step 9/10/12;8.3-a 只固定不得修复或默认 visible |
| DDD-S8-OPEN-018 | trace page 中部分 item not visible / degraded / missing 时 response surface 的精确优先级 | trace query state matrix、redaction tests、page count | 留 Step 9/10/12;8.3-b 固定 per-item visibility 且不得默认 visible |
| DDD-S8-OPEN-019 | audit trail missing 与 visible empty 的 public priority | audit query surface、handler tests | 留 Step 10/12;8.3-b 固定 query 不创建 audit trail |
| DDD-S8-OPEN-020 | trace/audit 字段级 redaction matrix | trace/audit view optional fields、not visible diagnostics | 留 Step 12/16;8.3-b 只固定 body-free DTO 和 marker |
| DDD-S8-OPEN-021 | audit cursor 与 public page cursor 的排序、稳定性和 next cursor 规则 | audit pagination、durable/fake parity | 留 Step 9/11/16;8.3-b 固定 cursor 不混用 |
| DDD-S8-OPEN-022 | `ReadAuditTrail` 是否需要聚合 member 下 role/career/memory 等子 truth audit trail | audit query coverage、repository lookup、pagination、visibility priority | 留 Step 6/7/9/11;8.3-b 仅闭合 member canonical audit subject,不自行扫描多个 audit trails |
| DDD-S8-OPEN-023 | operations query partial item not visible / degraded / missing 的 page-level disposition priority | report/outbox list tests、redaction matrix、page count | 留 Step 9/10/12;8.3-c 固定 per-item visibility 不默认 visible |
| DDD-S8-OPEN-024 | latest reconciliation report / latest projection state shortcut 是否需要正式 lookup | operations API ergonomics、repository index、fake parity | 留 Step 7/9/11;8.3-c 只支持 exact ref 或 paged list,不私造 latest |
| DDD-S8-OPEN-025 | outbox selector 是否需要按 arbitrary `OutboxStateKind` 查询 | operations query coverage、retry/publish filters | 留 Step 7/9/11;8.3-c 只支持 pending、retryable、subject、member、trace 五个闭合 selector |
| DDD-S8-OPEN-026 | projection/reference/report/outbox/handoff 字段级 redaction matrix | operations query safe marker、not visible diagnostics | 留 Step 12/16;8.3-c 只固定 forbidden body exclusion 和 visibility marker |
| DDD-S8-OPEN-027 | consumer rejected / quarantined / delayed retry / noop 的精确 outcome priority | worker ack/retry/dead-letter、stored receipt replay、handler tests | 留 Step 9/10/12/13;8.4 只固定 receipt surface 和 safe issue marker |
| DDD-S8-OPEN-028 | inbound event payload schema version mismatch 的 public issue/ref mapping | unsupported version tests、worker dead-letter | 留 Step 12/14;8.4 固定 `UnsupportedVersion` outcome 可用 |
| DDD-S8-OPEN-029 | memory source missing relation 时 create relation、quarantine 还是 report-only | memory callback/source consumer flow、state matrix | 留 Step 9/10/12;8.4 不私造 create-on-event 规则 |
| DDD-S8-OPEN-030 | archive callback target resolution 若 direct ref 与 handoff lookup 不一致的优先级 | callback safety、fake parity、replay | 留 Step 9/12/16;8.4 固定不得从 raw body 修正 target |
| DDD-S8-OPEN-031 | callback stored kind `ConsumerReceipt` vs `HandoffCallbackReceipt` 的 exact replay envelope | duplicate callback replay、stored result schema | 留 Step 13;8.4 固定保存面区分两类 |
| DDD-S8-OPEN-032 | outbound payload marker 是否需要 serialized envelope snapshot 的正式保存/读取面 | durable publisher、duplicate replay、redaction tests | 留 Step 11/13;8.5 只闭合 body-free DTO 与 marker |
| DDD-S8-OPEN-033 | lifecycle changed 与 availability changed 是否同一 accepted flow 同时发、合并发或条件发 | outbox count、subscriber contract、state matrix | 留 Step 9/10;8.5 只定义两种 payload schema |
| DDD-S8-OPEN-034 | outbound topic key 到 broker route / tenant / partition / adapter mode 的正式绑定 | publisher config、topic visibility、unsupported topic surface | 留 Step 14;8.5 只定义 topic-neutral key |
| DDD-S8-OPEN-035 | outbound payload 字段级 redaction / compatibility matrix | safe summary、schema evolution、consumer compatibility tests | 留 Step 12/16;8.5 固定 forbidden body exclusion |
| DDD-S8-OPEN-036 | career correction accepted 时是否另发 original superseded event | append-only audit、subscriber replay、state matrix | 留 Step 9/10;8.5 不新增第十一条 event |
| DDD-S8-OPEN-037 | job retry backoff、timeout、max batch 和 schedule policy | retry job、operations runner、config binding | 留 Step 14;8.6 只定义单次 run DTO |
| DDD-S8-OPEN-038 | job report/query 字段级 redaction matrix | operations query、report read、audit | 留 Step 12/16;8.6 只固定 body-free refs |
| DDD-S8-OPEN-039 | stored job report durable payload 是否需要独立 serialized snapshot 表 | duplicate replay、durable storage、migration | 留 Step 11/13;8.6 固定 surface 必须可 replay |

这些是 Step 9/10/11/12/13/14/16 的待展开项,不是 Step 8 blocker。

---

## 22. 进入下一步记录

进入 Step 9 前条件已满足:

- 用户已审核通过 Step 8 全部批次,包括 8.7 cross protocol audit。
- 不修改正式 `03-详细设计.md`。
- 已创建当前 Step 9 中间产物;不得提前创建 Step 10~19 文件。
- Step 9 必须按协议族和接口小循环逐条写 function flow,每条 flow 都要回指 Step 6/7/8。
- Step 9 不得新增未在 Step 6/7/8 闭口的 schema、port、状态、stored result variant 或 phase boundary。
- Step 9 若发现 Step 8 protocol surface 与 Step 6/7 object/port 不一致,必须先回写对应 Step 中间产物,再继续 flow。
