# L3-capability-hub 02 Step 10 异常与边界场景轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 10
> 回填章节: `projects/L3-capability-hub/02-概要设计.md` §10 异常与边界场景轮廓
> 生成日期: 2026-07-09
> 状态: completed_wait_user_review
> 本轮口径: 基于 Step 8 关键处理流和 Step 9 多状态族,点名会改变主线理解、状态传播或跨仓边界的异常;不写错误码全集、重试参数、补偿脚本、恢复作业实现、事务细节、测试结果、证据 alias 或实现 commit。

---

## 0. Step 开工确认

| 项 | 结论 |
|---|---|
| 用户确认 | 已确认进入 `02-概要设计.md` Step 10。 |
| 当前恢复点 | Step 9 `状态定义与状态流转` 已完成并停审通过。 |
| 正式文档状态 | `projects/L3-capability-hub/02-概要设计.md` 仍为 historical material,本步不得修改。 |
| 上游基线 | 新版正式 `00-需求文档.md`、新版正式 `01-架构设计.md`、`02` Step 1~9 calibration 产物。 |
| 旧材料处理 | 旧 `02/03/05/06`、README 仅作后置差异审计,不得作为异常真相源。 |

---

## 1. Step 内计划

| 子任务 | 状态 | 说明 | gate |
|---|---|---|---|
| 标准读取 | done | 读取概要设计 SOP Step 10、书写规范 §4.10 和 ASCII 图规则。 | pass |
| 上游读取 | done | 读取 Step 5~9 的组成部分、对象、接口、处理流和状态结论。 | pass |
| 参考粒度 | done | 参考 `L1-governance`、`L1-artifact`、`L3-method-library` 的 Step 10 粒度。 | pass |
| 异常候选接收 | done | 从 Command / Query / Consumer / Job / event collaboration 五类路径提取异常。 | pass |
| 结构化产物 | done | 输出异常总览、流族异常、状态影响、影响图、停审与审计。 | pass |
| 回填草稿 | done | 准备正式 §10 回填草稿,但不写正式 `02`。 | pass |
| 恢复点更新 | pending_in_flow | 本文件完成后更新 flow 与项目台账。 | pending |

---

## 2. 必读文档

| 文档 | 读取结论 | 本步使用方式 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 10 | 本步必须点名不能留到详细设计才发现的关键异常路径和边界场景。 | 输出异常与边界场景表,按需补异常影响图。 |
| `standards/document/概要设计书写规范.md` §4.10 | 必须写场景、落在哪个部分处理和当前概要口径;不得列普通参数校验大全或完整错误码。 | 本文件所有主表采用“场景 / 应落在哪个部分处理 / 当前概要口径”。 |
| `standards/document/概要设计书写规范.md` §5.3.4 | 异常影响图必须为允许图型,用 `text` 代码块并给出关键说明。 | 本步补 1 张异常影响图,只表达主线断开和落点。 |
| `02_hld_step_05_components_boundary.md` | 已收稳 8 个主要组成部分和支撑关系。 | 异常归属只能落到这些组成部分、application service、对象或边界。 |
| `02_hld_step_06_key_objects.md` | 已正式化 43 个关键对象和禁止事项。 | 异常影响必须回指对象 owner 和 forbidden body 红线。 |
| `02_hld_step_07_api_interface_skeleton.md` | 已按 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job、External Port Skeleton 分类。 | 异常按接口类别组织,保护读写性质。 |
| `02_hld_step_08_processing_flows.md` | 已收稳通用写路径、读路径、consumer、job、event candidate 路径和独立 flow。 | 异常按处理流族归类,不新增处理流。 |
| `02_hld_step_09_state_machine.md` | 已收稳多状态族、允许 / 禁止迁移和状态传播。 | 本步只使用已定义状态词,不新造状态主语。 |
| `projects/L3-capability-hub/00-需求文档.md` | 已收稳 capability access truth、非目标、规则边界和数据归属。 | 保护 runtime execution、marketplace、governance approval、method body、secret、cost 等非目标。 |
| `projects/L3-capability-hub/01-架构设计.md` | 已收稳 truth / snapshot / ref / derived / forbidden body 分层。 | 保护外部依赖不可用、异步协作失败和派生维护失败的分层口径。 |
| 参考项目 Step 10 | 参考按 Command / Query / Consumer / Job 组织和“异常影响图 + 状态影响清单”密度。 | 只参考结构和粒度,不复制领域内容。 |

---

## 3. SOP 问题回答

### 3.1 哪些关键异常路径必须在概要设计层先点名?

必须先点名的异常路径包括:

- Command 写路径缺少 actor、metadata、idempotency key、typed ref 或必须的接入语境。
- `CapabilityIdentity` 仍为 `candidate / unresolved / correction_pending / retired`,却被用于 registry、descriptor、seam、relation 或 exposure。
- registry 仍为 `draft / undescribed / ungoverned / visibility_pending / retired`,却被推入 formal visibility 或 formal exposure。
- descriptor、risk summary、secret ref 或 safe summary 处于 `draft / unresolved / partial / unavailable / forbidden`,却被伪装成 accepted 或低风险。
- governance result ref、method asset ref、external document ref、consumer ref、observability ref 处于 `unresolved / stale / unavailable / forbidden`,却被当作 resolved。
- governance seam 或 method relation 通过 inbound event 直接变更 active relation truth,绕过正式 Command。
- formal exposure 在 descriptor、governance seam、method relation 或 visibility 前置未闭口时直接 `active`。
- consumer view、directory projection、audit export、ecosystem discovery 或 reconciliation report stale / failed / unavailable 时反写核心 truth。
- Query 读路径在 projection stale、reference unresolved、view rebuilding 或 surface unavailable 时顺手刷新、修复或创建 missing truth。
- Inbound Event Consumer 遇到 duplicate、unsupported version、older source、forbidden body 或 unavailable source 时直接写核心 relation / exposure truth。
- Operations Job 遇到 drift、rebuild failure、reference refresh failure 或 handoff failure 时修复 identity、registry、descriptor、seam、relation 或 exposure truth。
- event collaboration failed / handoff unavailable 时回滚已提交 access truth 或 change record。

### 3.2 哪些边界场景会改写主要组成部分、接口、对象或状态机的协作关系?

会改写协作关系的边界场景包括:

- 前置 ref 不可解析时,Command 不得继续向 accepted / active truth 推进,只能 rejected、pending、unresolved 或 unavailable。
- Query 遇到 freshness / visibility / reference surface 时,只返回 degraded surface,不能触发 refresh job、external lookup 或 truth repair。
- Inbound Event Consumer 只能写 ref state、safe summary、stale marker、impact summary 或 command intent,不能直接写 seam、relation、exposure 或 identity truth。
- Job 只能写 projection、summary、report、reference state、freshness 或 handoff status,不能修核心 truth。
- reference 状态变化只能把依赖对象推到 pending / unavailable / partial / forbidden surface,不能补造 governance、method、secret、runtime、SDK、observability 或 external document truth。
- event collaboration 状态只说明协作 / handoff 进度,不能替代 outbox / relay 实现,也不能反向定义业务状态。

### 3.3 哪些失败不能留到详细设计才发现?

不能留到详细设计才发现的失败,都是会打穿 capability access truth、ref / safe summary、formal exposure 或 derived material 边界的失败:

- 外部 MCP / A2A / API source body、provider runtime、request / response、route、quota、failover、cost 或 secret 正文进入 descriptor。
- governance approval、Policy、shared_rules 正文或 method body 通过 safe summary、event 或 relation 输入进入本仓。
- SDK client、runtime cache、tools execution、marketplace listing 或 provider lookup 反向定义 formal exposure。
- downstream consumption impact、observability ref、audit handoff 或 event delivery failure 反写 identity、registry、descriptor、seam、relation 或 exposure。
- reconciliation report、directory projection、consumer view 或 export summary 被实现成第二 truth。
- forbidden ref 被包装成 resolved,或 unavailable / partial 被伪装成正常 ready。

### 3.4 异常与边界场景在概要设计层需要讲到什么程度才足够?

概要设计层需要讲清:

- 异常场景是什么。
- 异常落在哪个主要组成部分、application service、对象或边界。
- 它会让处理流停在 reject、pending、unresolved、stale、partial、unavailable、rebuild_required、failed 还是 handoff_unavailable。
- 哪些状态迁移明确不能发生。
- 哪些内容必须交给 `03-详细设计.md` 继续展开。

不需要写正式错误码、response schema、重试次数、backoff、DLQ、事务 rollback、恢复脚本、adapter error mapping、测试断言或验收证据。

### 3.5 哪些内容仍属于详细设计的错误码、重试、补偿或恢复细节,不应在本步展开?

| 内容 | 留给后续的原因 |
|---|---|
| 每个 Command / Query / Consumer / Job 的正式错误码 | 属于 `03-详细设计.md` API / protocol contract。 |
| duplicate replay、幂等结果结构和 expected version 冲突处理 | 属于 `03-详细设计.md` application service 与持久化契约。 |
| event envelope schema、payload 字段、topic、consumer group、outbox 表 | 属于 `03-详细设计.md` 和后续实施计划。 |
| retry、backoff、dead letter、quarantine、manual recovery 参数 | 属于详细设计、测试方案和运维设计。 |
| projection rebuild cursor、batch、checkpoint、lock 和 scheduler | 属于详细设计和实现。 |
| audit export receipt、external handoff target error mapping、evidence alias | 属于 `03/05/06` 后续文档,本步不伪造。 |

---

## 4. 异常候选接收

| 来源 | 异常候选 | 接收结论 |
|---|---|---|
| Step 7 Command API | actor / metadata / idempotency 缺失;非法前置;forbidden body;非法状态迁移;重复写入。 | 接收为 Command 写路径异常族。 |
| Step 7 Query API | not visible、stale、rebuilding、unavailable、unresolved、forbidden surface。 | 接收为 Query 只读异常族。 |
| Step 7 Inbound Event Consumer | duplicate、unsupported version、stale source、older source、forbidden body、source unavailable。 | 接收为 Consumer 异常族。 |
| Step 7 Operations Job | rebuild failed、refresh unavailable、reconciliation inconsistent、handoff failed。 | 接收为 Job 异常族。 |
| Step 8 GenericCommandWritePath | accepted / pending / rejected 边界、event candidate 只能来自已提交事实。 | 接收为写入成立边界。 |
| Step 8 GenericQueryReadPath | Query 不刷新、不解析 ref、不创建 missing truth。 | 接收为 Query no-write 红线。 |
| Step 8 GenericInboundEventConsumerPath | Consumer 只写 ref / summary / stale marker / command intent。 | 接收为 Consumer no-core-truth-write 红线。 |
| Step 8 GenericOperationsJobPath | Job 只写 projection / summary / report / freshness / handoff。 | 接收为 Job no-core-truth-repair 红线。 |
| Step 8 ProduceCapabilityAccessEventCandidate | 投递失败不回滚 truth。 | 接收为 event collaboration 异常。 |
| Step 9 状态传播 | core truth 变化影响 consumer view、derived material、impact、event collaboration;reference 变化影响 pending / unavailable / partial。 | 接收为状态影响清单。 |

---

## 5. 异常与边界场景总览

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| Command 缺少 `ActorContext`、`CommandMetadata` 或 `IdempotencyKey` | Inbound adapter / 对应 application service | 不进入 domain transition,不写 truth、change record 或 event candidate;详细设计再定义 invalid request surface。 |
| idempotency key 重复且已存在 stored result | Application idempotency support / 对应 command service | 返回 replay / duplicate surface,不得重复创建 identity、registry、descriptor、relation、exposure、trace 或 event candidate。 |
| external source ref unresolved / unavailable | 能力身份与接入语境;外部引用与安全摘要支撑 | identity 停在 `candidate / unresolved`;不得补造 `CapabilityIdentity` 或保存外部来源正文。 |
| candidate / correction_pending identity 被用于 registry 或 exposure | 能力身份与接入语境;注册目录与生命周期;正式暴露与受控消费 | Command 被拒绝或保持 pending;只有 `CapabilityIdentity::active` 可作为后续主体。 |
| retired identity / registry / exposure 试图原地复活 | 对应 truth owner application service | 禁止 `retired -> active / formal_visible`;需要新对象、新关系或正式重新接入。 |
| registry draft / undescribed / ungoverned 直接进入 formal visible | 注册目录与生命周期 | registry 保持 `draft / undescribed / ungoverned / visibility_pending`;不得绕过 descriptor 和 governance 前置。 |
| registry reconciliation 发现 drift | 注册目录与生命周期;派生维护与只读输出 | 写 `CapabilityReconciliationReport` 的 `inconsistent / rebuild_required / failed` surface;不得自动修 registry truth。 |
| descriptor 输入携带 provider runtime、quota、route、cost、failover、request / response 或 secret 正文 | 接入描述与风险摘要;`DescriptorBoundaryPolicy` | `EstablishAdapterDescriptor` 或 risk / secret command 拒绝,必要时标记 `forbidden`;不得恢复旧 `ProviderContract`。 |
| descriptor external document ref unresolved / stale | 接入描述与风险摘要;外部引用与安全摘要支撑 | descriptor 进入 `unresolved` 或相关 summary `partial / unavailable`;不得复制 API spec / 协议正文。 |
| risk / safe summary partial 或 unavailable 被当作完整可用 | 接入描述与风险摘要 | 读取和 exposure 前置必须显式 `partial / unavailable`;不得伪装为空风险或默认安全。 |
| secret ref forbidden 或 secret safe summary forbidden | 接入描述与风险摘要;外部引用与安全摘要支撑 | 阻断相关 safe summary,返回 forbidden surface;secret value、token、API key、KMS / Vault truth 永不入仓。 |
| governance result ref unresolved / expired / forbidden | 治理与方法关系;外部引用与安全摘要支撑 | seam 保持 `pending / unresolved / expired / forbidden`;formal exposure 必须 pending 或 unavailable。 |
| governance event 携带 approval、Policy 或 shared_rules 正文 | 治理与方法关系;Inbound Event Consumer boundary | consumer 拒绝正文或只保留允许 safe summary / ref;不得创建 governance truth。 |
| inbound governance event 直接替换 active seam relation | 治理与方法关系 | 禁止直接改 relation truth;只能写 ref state、stale marker 或 seam update command intent。 |
| method asset ref unresolved / stale / forbidden | 治理与方法关系;外部引用与安全摘要支撑 | method relation 进入 `pending / stale / unresolved / forbidden`;不得保存 Method Content、TaskDefinition 或 method version body。 |
| inbound method event 试图建立 / 移除 relation truth | 治理与方法关系 | 禁止绕过 `AttachCapabilityMethodRelation` / `RemoveCapabilityMethodRelation`;consumer 只写 marker 或 command intent。 |
| formal exposure 前置 descriptor / seam / method relation 未满足 | 正式暴露与受控消费;`FormalExposurePolicy` | exposure 保持 `draft / pending / unavailable`,不得进入 `accepted / active`。 |
| consumer view、runtime cache、SDK client 或 QueryCapabilities 反向定义 exposure | 正式暴露与受控消费 | 拒绝反写;formal exposure 只能由 exposure Command 和正式 access truth 推进。 |
| `GetControlledConsumerView` 遇到 `stale / rebuilding / unavailable / partial` | 正式暴露与受控消费;派生维护与只读输出 | Query 返回 freshness / degraded surface;不得触发 refresh job 或改写 exposure。 |
| downstream consumption impact summary incomplete / delayed / unavailable | 追溯、变化与影响 | 只进入 `partial / delayed / unavailable / ignored` surface,不得回滚 exposure 或 registry truth。 |
| downstream impact event 携带 execution payload、tool result、SDK client state 或 cost data | 追溯、变化与影响;Inbound Event Consumer boundary | consumer 拒绝 forbidden body,只接收 body-free impact summary。 |
| traceability handoff 或 observability audit ref unavailable | 追溯、变化与影响;外部引用与安全摘要支撑 | trace / export 进入 `handoff_pending / partial / unavailable`;不复制 raw log、metric、trace、audit store 或 evidence alias。 |
| `SearchCapabilityDirectory` projection stale / rebuilding / unavailable | 派生维护与只读输出 | Query 返回 stale / rebuilding / unavailable surface;不得重建 projection 或创建 registry entry。 |
| `DirectorySearchBrowseProjection` ready 被解释为 registry / visibility truth | 派生维护与只读输出;注册目录与生命周期 | 禁止 projection 反写;registry lifecycle 和 formal visibility 仍由 truth owner 管理。 |
| `RefreshControlledConsumerView` 失败 | 派生维护与只读输出 | consumer view 标记 `stale / partial / unavailable`,不回滚 formal exposure。 |
| `RebuildDirectorySearchBrowseProjection` 失败 | 派生维护与只读输出 | projection 进入 `unavailable / stale / rebuild_required`;核心 truth 不变。 |
| `PrepareAuditFriendlyExportSummary` 发现 forbidden body | 派生维护与只读输出;追溯、变化与影响 | export summary 标记 `partial / unavailable` 或拒绝该材料;不复制 audit store。 |
| `RebuildReadOnlyEcosystemDiscoverySummary` 被要求输出 marketplace listing / transaction / pricing / fulfillment truth | 派生维护与只读输出 | 拒绝边界外输出;只读生态发现摘要不形成 marketplace truth。 |
| `RunDerivedMaterialReconciliation` 发现 inconsistency | 派生维护与只读输出 | 写 report `inconsistent / rebuild_required`;需要业务修复时回到正式 Command。 |
| `RecordReferenceResolutionState` 输入携带 forbidden body | 外部引用与安全摘要支撑;`ReferenceResolutionPolicy` | ref 状态为 `forbidden` 或 command rejected;不得包装为 safe summary。 |
| `GetReferenceResolutionState` 遇到 unresolved / unavailable / forbidden | 外部引用与安全摘要支撑 | Query 只返回 state surface,不得 external lookup、refresh 或补造 external truth。 |
| external source / document / audit ref changed event duplicate | 外部引用与安全摘要支撑;Consumer idempotency | 返回 duplicate receipt 或 ignored surface;不得重复写 ref state、marker 或 command intent。 |
| inbound event unsupported schema / contract version | 外部引用与安全摘要支撑;对应 Consumer | rejected / delayed / quarantine surface 后移详细设计;概要层要求不得猜 schema 或写核心 truth。 |
| inbound event source version older / out-of-order | 外部引用与安全摘要支撑;对应 Consumer | 标记 stale / ignored / delayed,不得倒退 relation、reference 或 exposure 状态。 |
| `RefreshExternalReferenceResolution` 外部来源不可用 | 外部引用与安全摘要支撑 | 更新 ref `unavailable / unresolved / stale`;不得创建 identity、descriptor、seam、relation 或 exposure truth。 |
| `RepairCapabilityAccessEventCollaboration` 失败 | 外部引用与安全摘要支撑;event collaboration boundary | event collaboration 为 `failed / handoff_unavailable`;不得回滚已提交 truth 或 change record。 |
| event collaboration output 被要求定义 topic、payload、outbox 或 relay retry | 外部引用与安全摘要支撑 | 本步只保留 candidate / pending_delivery / delivered / failed / handoff_unavailable 协作状态;实现细节后移。 |

---

## 6. 按处理流族归类的异常口径

### 6.1 Command 写路径异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| actor / metadata / idempotency 缺失 | 无 truth 状态变化 | 在 inbound / application 层拒绝,不得进入 domain object 或写 change record。 |
| typed ref 不存在、unresolved、unavailable 或 forbidden | 对象保持原状态;相关 surface 为 `pending / unresolved / unavailable / forbidden` | Command 不得假设外部事实成立;等待 ref resolution 或重新提交。 |
| policy guard 不通过 | 对象保持原状态或进入显式 rejected / forbidden surface | 不写成功 trace,不产生 outbound event candidate。 |
| expected current state 不匹配 | 对象保持原状态 | 详细设计定义并发冲突和 expected version;概要层要求不得跨越 Step 9 禁止迁移。 |
| forbidden body 进入 input | `forbidden` 或 rejected surface | 只允许 ref / allowed safe summary;正文不得落库。 |
| persistence / change record / result 成立边界未闭合 | 不产生 accepted truth | 详细设计定义事务;概要层要求 truth、change record、trace link、idempotency result 与 event candidate 的成立边界一致。 |

### 6.2 Query 只读异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| actor 不可见或 scope 不允许 | 无持久状态变化 | 返回 not visible / redacted / forbidden surface,不泄露正文或越界摘要。 |
| projection / consumer view stale | 无持久状态变化 | 返回 freshness surface,不触发 rebuild / refresh。 |
| projection / consumer view rebuilding | 无持久状态变化 | 返回 rebuilding / degraded surface,不等待或启动 job。 |
| projection / summary / report unavailable | 无持久状态变化 | 返回 unavailable / partial surface,不创建临时 truth。 |
| reference unresolved / forbidden | 无持久状态变化 | 返回 unresolved / forbidden surface,不 external lookup 或补造 external truth。 |
| trace / handoff link 缺失 | 无持久状态变化 | 显式暴露 trace / handoff degraded,不伪造 audit evidence。 |

### 6.3 Inbound Event Consumer 异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| duplicate source event | receipt / idempotency surface only | 不重复写 ref state、safe summary、impact summary、stale marker 或 command intent。 |
| unsupported schema / contract version | rejected / delayed / quarantine surface | 不猜测 payload,不写核心 truth;正式状态和队列策略后移详细设计。 |
| source event carries forbidden body | 无核心 truth 状态变化;可能写 `forbidden` ref surface | 丢弃或拒绝正文,只保留 ref / safe summary / body-free impact summary。 |
| older source version / out-of-order | `stale / ignored / delayed` surface | 不倒退 reference、relation 或 consumer view 状态。 |
| source unavailable | `unavailable / unresolved / partial` surface | 只影响 ref state、pending surface 或 derived freshness,不创建 truth。 |
| event implies relation / exposure truth change | command intent / stale marker only | relation / exposure truth 仍由正式 Command 改写。 |

### 6.4 Operations Job 异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| registry reconciliation drift | `CapabilityReconciliationReport::inconsistent / rebuild_required` | 只写 report,不得修 registry truth。 |
| consumer view refresh failed | `ConsumerViewFreshnessState::stale / partial / unavailable` | exposure truth 不变,Query 读取降级。 |
| directory projection rebuild failed | `DirectoryProjectionState::stale / unavailable` | projection degraded,不补造 registry / descriptor。 |
| audit export preparation failed | `AuditExportState::partial / unavailable / stale` | 不复制 raw audit / evidence;handoff 降级。 |
| ecosystem discovery rebuild failed | `EcosystemDiscoveryState::partial / unavailable / stale` | 不创建 marketplace listing truth。 |
| derived reconciliation failed | `ReconciliationReportState::failed` | 只影响 report / operations visibility,不回滚 truth。 |
| reference refresh unavailable | `ReferenceResolutionValue::unavailable / unresolved / stale` | 不创建外部 truth,受影响对象显式 pending / unavailable。 |
| event collaboration repair failed | `EventCollaborationStatus::failed / handoff_unavailable` | 只影响协作状态,不回滚已提交 fact / change record。 |

### 6.5 Event collaboration / handoff 异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| event candidate assembly detects forbidden body | event candidate rejected / not produced | 只传播 fact ref、change kind、trace context 和 allowed summary;不携带正文。 |
| collaboration port unavailable | `handoff_unavailable` | 已提交 truth 不变;operations surface 可见,详细设计定义 retry / manual handling。 |
| delivery failed | `failed` | 不回滚 identity、registry、descriptor、seam、relation、exposure 或 impact fact。 |
| downstream rejects event / handoff | `failed / handoff_unavailable` | 下游不可用不定义本仓 truth;只能进入协作 / handoff surface。 |

---

## 7. 异常影响图

#### 异常影响图

```text
+------------------------+
| Command exception     |
+------------------------+
  │ invalid actor / metadata / idempotency / ref / policy / state
  ▼
rejected / pending / unresolved / forbidden surface
  │
  └─ no accepted truth, no success change record, no event candidate

+------------------------+
| Query exception       |
+------------------------+
  │ not visible / stale / rebuilding / unavailable / unresolved
  ▼
degraded read surface
  │
  └─ no refresh, no external lookup, no truth repair

+------------------------+
| Consumer exception    |
+------------------------+
  │ duplicate / unsupported / older source / forbidden body
  ▼
receipt / ref state / stale marker / command intent
  │
  └─ no direct seam, relation, exposure or identity truth write

+------------------------+
| Job or handoff failure|
+------------------------+
  │ rebuild / refresh / reconcile / delivery / handoff failed
  ▼
projection / report / reference / collaboration failure surface
  │
  └─ no core truth repair and no rollback of committed truth
```

关键说明:

- 图表达异常如何让主线停在对应 surface,不是错误码、重试参数、补偿脚本或恢复作业设计。
- Command 异常的红线是未成立的写入不得产生 accepted truth、success trace 或 event candidate。
- Query 异常的红线是只读路径不得刷新 projection、解析外部 ref、创建 missing truth 或修复状态。
- Consumer 和 Job 异常只能影响本地 marker、ref state、derived material、report 或 handoff surface,不能改写核心 truth。
- event collaboration 失败只影响协作状态,不得回滚已提交 fact、change record 或 formal exposure。

---

## 8. 状态机影响清单

| 异常类别 | 可能进入的状态 | 禁止进入的状态 / 迁移 |
|---|---|---|
| identity source unresolved | `CapabilityIdentityState::candidate / unresolved`;`ReferenceResolutionValue::unresolved / unavailable` | `identity candidate / unresolved -> registry formal_visible / exposure active` |
| identity correction pending | `CapabilityIdentityState::correction_pending` | consumer view、runtime、SDK 或 Query 触发 identity 合并 / 拆分 / 更正 |
| retired truth reuse | `retired` historical surface | `retired identity / registry / exposure -> active / formal_visible` |
| registry missing descriptor / governance | `RegistryLifecycleState::undescribed / ungoverned / visibility_pending` | `draft / undescribed / ungoverned -> formal_visible` |
| descriptor forbidden body | `AdapterDescriptorState::unresolved`;`ReferenceResolutionValue::forbidden`;command rejected | `unresolved descriptor -> accepted` 且携带 provider runtime / secret / cost / route 等正文 |
| risk / safe summary incomplete | `DescriptorRiskConstraintSummaryState::partial / unavailable`;`SecretHandlingSafeSummaryState::stale / unavailable / forbidden` | `unavailable / forbidden` 被解释为 available 或 low risk |
| governance ref unresolved / forbidden | `GovernanceSeamState::pending / unresolved / expired / forbidden`;`FormalExposureState::pending / unavailable` | seam 复制 approval / Policy / shared_rules truth 后进入 active |
| method ref stale / forbidden | `CapabilityMethodRelationState::pending / stale / unresolved / forbidden` | method relation 保存 method body 后进入 active |
| formal exposure prerequisites missing | `FormalExposureState::draft / pending / unavailable`;`FormalVisibilityState::pending / unavailable` | `pending / unavailable formal exposure -> active` 绕过 accepted / visible |
| consumer view stale / rebuilding | `ConsumerViewFreshnessState::stale / rebuilding / partial / unavailable` | `ready consumer view -> core truth update`;Query 触发 `rebuilding` |
| downstream impact partial / delayed | `CapabilityImpactState::partial / delayed`;`DownstreamImpactSummaryState::partial / delayed / unavailable` | downstream summary -> registry / exposure truth update |
| trace / handoff unavailable | `TraceabilityState::partial / handoff_pending`;`AuditExportState::partial / unavailable`;`EventCollaborationStatus::handoff_unavailable` | handoff failure -> rollback of committed truth |
| derived material rebuild failed | `DirectoryProjectionState::stale / unavailable`;`ReconciliationReportState::failed / rebuild_required` | projection / report -> identity / registry / exposure truth repair |
| reference unavailable / forbidden | `ReferenceResolutionValue::unresolved / stale / invalid / unavailable / forbidden` | unresolved / forbidden ref -> resolved without new allowed ref |
| event collaboration failed | `EventCollaborationStatus::failed / handoff_unavailable` | event failed -> core truth rollback |

---

## 9. 按主要组成部分的异常归属停审记录

| 主要组成部分 | 停审结果 | 说明 |
|---|---|---|
| 能力身份与接入语境 | pass | 已点名 source ref unresolved、candidate / correction_pending / retired identity 越界消费和 review fact 不等于 governance approval。 |
| 注册目录与生命周期 | pass | 已点名 draft / undescribed / ungoverned / retired registry 的非法推进和 reconciliation 不修 truth。 |
| 接入描述与风险摘要 | pass | 已点名 ProviderContract 污染、secret 正文、risk / safe summary partial / unavailable / forbidden。 |
| 治理与方法关系 | pass | 已点名 governance ref / method ref unresolved / forbidden、inbound event 不得直接改 relation truth。 |
| 正式暴露与受控消费 | pass | 已点名前置未满足不能 active、consumer view / runtime / SDK 不得反写 exposure、consumer view 读取降级。 |
| 追溯、变化与影响 | pass | 已点名 downstream impact 不回滚 truth、trace / handoff 不复制 observability 或 evidence。 |
| 派生维护与只读输出 | pass | 已点名 projection / export / discovery / reconciliation failure 只影响派生 surface。 |
| 外部引用与安全摘要支撑 | pass | 已点名 ref forbidden / unresolved、inbound event duplicate / unsupported / old source、event collaboration failed / handoff unavailable。 |

---

## 10. 跨异常一致性审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在异常要求 Query 写状态 | pass | Query 始终只返回 state / freshness / visibility / reference surface。 |
| 是否存在异常要求 Consumer 直接写核心 truth | pass | Consumer 只写 ref state、safe summary、stale marker、impact summary 或 command intent。 |
| 是否存在异常要求 Job 修核心 truth | pass | Job 只写 projection、summary、report、reference state、freshness 或 handoff status。 |
| 是否把 event / handoff 失败当作 command rollback | pass | 协作失败不回滚已提交 truth。 |
| 是否把 forbidden body 写成可接受输入 | pass | forbidden body 只导致 rejected / forbidden surface,不入仓。 |
| 是否新增 Step 9 未定义状态 | pass | 使用 `unresolved / stale / unavailable / forbidden / pending / partial / rebuilding / rebuild_required / failed / handoff_unavailable` 等已定义语义。 |
| 是否恢复旧 `ProviderContract` / `CapabilityDecision` / `QueryCapabilities` | pass | 旧名只作为污染源排除,未进入异常处理主语。 |
| 是否下沉到详细设计错误码或恢复实现 | pass | 未写错误码全集、retry 参数、DLQ、补偿脚本、transaction 细节或测试。 |

---

## 11. 旧材料差异审计

| 旧材料口径 | 本轮处理 | 原因 |
|---|---|---|
| 旧 `ProviderContract` 异常 | 不继承;拆到 descriptor forbidden body、external document ref unresolved、secret safe summary unavailable。 | 旧主语混入 provider runtime、secret、quota、route、cost、failover。 |
| 旧 `CapabilityDecision` / allow-deny 异常 | 不继承;拆到 formal exposure 前置、controlled consumer view freshness 和 Query degraded surface。 | 本仓不做 runtime allow / deny enforcement。 |
| 旧 `QueryCapabilities` 查询失败 | 不继承;拆到 `GetControlledConsumerView`、directory projection、reference state 查询异常。 | 旧查询混合 formal truth、policy decision、runtime cache 和 consumer view。 |
| KMS / Vault / secret rotate failure | 不继承;只保留 `SecretRef` / `SecretHandlingSafeSummary` 的 unresolved / unavailable / forbidden surface。 | 本仓不是 secret 平台。 |
| cost / billing / invocation audit failure | 排除。 | cost ledger、runtime execution payload、observability store 不归本仓。 |
| policy refresh / shared_rules failure | 不继承;只保留 governance result ref / seam relation 的 pending / unresolved / expired / forbidden surface。 | governance truth 属于 `L1-governance`。 |
| method publication / method body failure | 不继承;只保留 `MethodAssetRef` 和 body-free relation 的 stale / unresolved / forbidden surface。 | method body 和生命周期属于 `L3-method-library`。 |
| provider lookup / marketplace listing failure | 不继承;只保留 read-only ecosystem discovery 的 partial / unavailable surface。 | marketplace listing / provider runtime 不归本仓。 |
| outbox relay / retry 实现异常 | 不继承为概要实现;只保留 event collaboration failed / handoff_unavailable。 | Step 10 不写 outbox 表、topic、payload、relay 或 retry 参数。 |

当前新增 blocker:

| Blocker ID | 位置 | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| `CH-HLD-EXCEPTION-001` | 旧 `02/03` 异常与失败口径 | resolved_for_step_10 | 旧材料把 ProviderContract、CapabilityDecision、CostRecord、QueryCapabilities、KMS / Vault、policy refresh、runtime execution、marketplace listing 和 outbox relay failure 混入异常主线。 | Step 10 已按新版 Step 7/8/9 重建异常落点,旧异常口径只保留为 historical material。 |

---

## 12. 正式 §10 回填草稿

以下内容供 Step 14 装配正式 `02-概要设计.md` §10 使用。当前不得直接修改正式文档。

````md
## 10. 异常与边界场景轮廓

> 校准来源:
> - `design-calibration/02_hld_step_10_exceptions_boundaries.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/02_hld_step_10_exceptions_boundaries.md` 的“异常与边界场景总览”“按处理流族归类的异常口径”“状态机影响清单”和“跨异常一致性审计”小节,了解异常如何落到 Command、Query、Consumer、Job 和 event collaboration 边界。

### 10.1 异常与边界场景表

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| Command 缺少 `ActorContext`、`CommandMetadata` 或 `IdempotencyKey` | Inbound adapter / 对应 application service | 不进入 domain transition,不写 truth、change record 或 event candidate。 |
| external source ref unresolved / unavailable | 能力身份与接入语境;外部引用与安全摘要支撑 | identity 停在 `candidate / unresolved`;不得补造 `CapabilityIdentity` 或保存外部来源正文。 |
| candidate / correction_pending identity 被用于 registry 或 exposure | 能力身份与接入语境;注册目录与生命周期;正式暴露与受控消费 | Command 被拒绝或保持 pending;只有 `CapabilityIdentity::active` 可作为后续主体。 |
| registry draft / undescribed / ungoverned 直接进入 formal visible | 注册目录与生命周期 | registry 保持 `draft / undescribed / ungoverned / visibility_pending`;不得绕过 descriptor 和 governance 前置。 |
| descriptor 输入携带 provider runtime、quota、route、cost、failover、request / response 或 secret 正文 | 接入描述与风险摘要;`DescriptorBoundaryPolicy` | descriptor command 拒绝或标记 `forbidden`;不得恢复旧 `ProviderContract`。 |
| risk / safe summary partial 或 unavailable 被当作完整可用 | 接入描述与风险摘要 | 读取和 exposure 前置必须显式 `partial / unavailable`;不得伪装为空风险或默认安全。 |
| governance result ref unresolved / expired / forbidden | 治理与方法关系;外部引用与安全摘要支撑 | seam 保持 `pending / unresolved / expired / forbidden`;formal exposure 必须 pending 或 unavailable。 |
| inbound governance / method event 直接改 relation truth | 治理与方法关系 | 禁止直接改 relation truth;只能写 ref state、stale marker 或 command intent。 |
| formal exposure 前置 descriptor / seam / method relation 未满足 | 正式暴露与受控消费;`FormalExposurePolicy` | exposure 保持 `draft / pending / unavailable`,不得进入 `accepted / active`。 |
| consumer view、runtime cache、SDK client 或 QueryCapabilities 反向定义 exposure | 正式暴露与受控消费 | 拒绝反写;formal exposure 只能由 exposure Command 和正式 access truth 推进。 |
| `GetControlledConsumerView` 遇到 `stale / rebuilding / unavailable / partial` | 正式暴露与受控消费;派生维护与只读输出 | Query 返回 freshness / degraded surface;不得触发 refresh job 或改写 exposure。 |
| downstream consumption impact summary incomplete / delayed / unavailable | 追溯、变化与影响 | 只进入 `partial / delayed / unavailable / ignored` surface,不得回滚 exposure 或 registry truth。 |
| `SearchCapabilityDirectory` projection stale / rebuilding / unavailable | 派生维护与只读输出 | Query 返回 stale / rebuilding / unavailable surface;不得重建 projection 或创建 registry entry。 |
| `RunDerivedMaterialReconciliation` 发现 inconsistency | 派生维护与只读输出 | 写 report `inconsistent / rebuild_required`;需要业务修复时回到正式 Command。 |
| `GetReferenceResolutionState` 遇到 unresolved / unavailable / forbidden | 外部引用与安全摘要支撑 | Query 只返回 state surface,不得 external lookup、refresh 或补造 external truth。 |
| inbound event duplicate / unsupported / older source / forbidden body | 外部引用与安全摘要支撑;对应 Consumer | 只写 receipt、ref state、stale marker、impact summary 或 command intent,不得写核心 truth。 |
| `RefreshExternalReferenceResolution` 外部来源不可用 | 外部引用与安全摘要支撑 | 更新 ref `unavailable / unresolved / stale`;不得创建 identity、descriptor、seam、relation 或 exposure truth。 |
| `RepairCapabilityAccessEventCollaboration` 失败 | 外部引用与安全摘要支撑;event collaboration boundary | event collaboration 为 `failed / handoff_unavailable`;不得回滚已提交 truth 或 change record。 |

### 10.2 异常影响图

#### 异常影响图

```text
+------------------------+
| Command exception     |
+------------------------+
  │ invalid actor / metadata / idempotency / ref / policy / state
  ▼
rejected / pending / unresolved / forbidden surface
  │
  └─ no accepted truth, no success change record, no event candidate

+------------------------+
| Query exception       |
+------------------------+
  │ not visible / stale / rebuilding / unavailable / unresolved
  ▼
degraded read surface
  │
  └─ no refresh, no external lookup, no truth repair

+------------------------+
| Consumer exception    |
+------------------------+
  │ duplicate / unsupported / older source / forbidden body
  ▼
receipt / ref state / stale marker / command intent
  │
  └─ no direct seam, relation, exposure or identity truth write

+------------------------+
| Job or handoff failure|
+------------------------+
  │ rebuild / refresh / reconcile / delivery / handoff failed
  ▼
projection / report / reference / collaboration failure surface
  │
  └─ no core truth repair and no rollback of committed truth
```

关键说明:
- 图表达异常如何让主线停在对应 surface,不是错误码、重试参数、补偿脚本或恢复作业设计。
- Command 异常的红线是未成立的写入不得产生 accepted truth、success trace 或 event candidate。
- Query 异常的红线是只读路径不得刷新 projection、解析外部 ref、创建 missing truth 或修复状态。
- Consumer 和 Job 异常只能影响本地 marker、ref state、derived material、report 或 handoff surface,不能改写核心 truth。

### 10.3 状态机影响说明

| 异常类别 | 可能进入的状态 | 禁止进入的状态 / 迁移 |
|---|---|---|
| identity source unresolved | `CapabilityIdentityState::candidate / unresolved`;`ReferenceResolutionValue::unresolved / unavailable` | `identity candidate / unresolved -> registry formal_visible / exposure active` |
| registry missing descriptor / governance | `RegistryLifecycleState::undescribed / ungoverned / visibility_pending` | `draft / undescribed / ungoverned -> formal_visible` |
| descriptor forbidden body | `AdapterDescriptorState::unresolved`;`ReferenceResolutionValue::forbidden`;command rejected | `unresolved descriptor -> accepted` 且携带 provider runtime / secret / cost / route 等正文 |
| governance ref unresolved / forbidden | `GovernanceSeamState::pending / unresolved / expired / forbidden`;`FormalExposureState::pending / unavailable` | seam 复制 approval / Policy / shared_rules truth 后进入 active |
| formal exposure prerequisites missing | `FormalExposureState::draft / pending / unavailable`;`FormalVisibilityState::pending / unavailable` | `pending / unavailable formal exposure -> active` 绕过 accepted / visible |
| consumer view stale / rebuilding | `ConsumerViewFreshnessState::stale / rebuilding / partial / unavailable` | `ready consumer view -> core truth update`;Query 触发 `rebuilding` |
| derived material rebuild failed | `DirectoryProjectionState::stale / unavailable`;`ReconciliationReportState::failed / rebuild_required` | projection / report -> identity / registry / exposure truth repair |
| event collaboration failed | `EventCollaborationStatus::failed / handoff_unavailable` | event failed -> core truth rollback |

详细设计必须继续展开各接口的错误码、response surface、幂等 replay、并发冲突、event quarantine、retry、dead-letter、rebuild / refresh / handoff 恢复和测试矩阵,但不得改变本章的 truth owner、Query no-write、Consumer no-core-truth-write、Job no-core-truth-repair 和 forbidden body 红线。
````

---

## 13. 待确认事项

### 13.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否按每个接口逐项列异常 | A. 逐接口列;B. 按流族和关键场景归纳 | B | 概要层需要保护边界和状态影响,逐接口错误码留给 `03`。 | 已采用 B |
| 是否补异常影响图 | A. 不补;B. 补 1 张 | B | Command / Query / Consumer / Job 异常会改变主线和跨部分协作,图能明确断点。 | 已采用 B |
| event collaboration 是否写 outbox / retry 异常 | A. 写实现细节;B. 只写协作状态失败 | B | Step 10 不写 outbox、topic、payload、relay 或 retry 参数。 | 已采用 B |
| Query 遇到 stale 是否允许触发 refresh | A. 允许;B. 不允许 | B | Step 7~9 已固定 Query no-write,refresh 属于 Job。 | 已采用 B |

### 13.2 本 Step 未确认事项

本步不新增阻塞 Step 11 的上游 blocker。以下内容后移:

- 每个 Command / Query / Consumer / Job 的正式错误码、response schema 和错误映射。
- actor / metadata / idempotency 的具体字段、幂等 replay 存储结构、expected version 和并发冲突处理。
- event envelope、payload schema、topic、outbox、consumer group、quarantine、dead letter 和 retry 参数。
- projection / export / discovery / reconciliation 的 rebuild cursor、batch、checkpoint、scheduler 和 recovery job 细节。
- external handoff receipt、audit export target error mapping、evidence alias、测试用例和验收证据。

---

## 14. 进入下一步条件

- 已明确影响主线理解的关键异常路径和边界场景。
- 已说明异常落在哪个主要组成部分、application service、对象或边界处理。
- 已按 Command / Query / Inbound Event Consumer / Operations Job / Event collaboration 归类异常口径。
- 已说明异常对 Step 9 状态流转和状态传播的影响。
- 已明确 Query no-write、Consumer 不直接写核心 truth、Job 不修 core truth、event collaboration failed 不回滚 truth。
- 已隔离旧 `ProviderContract`、`CapabilityDecision`、`CostRecord`、`QueryCapabilities`、KMS / Vault、policy refresh、runtime execution、marketplace listing 和 outbox relay 实现异常口径。
- 未写完整错误码、重试参数、补偿脚本、DLQ / outbox 实现、事务细节、测试结果、证据 alias、验收签署或实现 commit。
- 正式 `02-概要设计.md` 尚未修改;Step 14 前不得装配正式 §10。
- 用户确认后可以进入 Step 11 `配置影响轮廓`。
