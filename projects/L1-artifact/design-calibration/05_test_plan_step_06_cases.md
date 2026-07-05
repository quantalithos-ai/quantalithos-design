# Step 6. 设计测试场景与用例矩阵

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 6
> 回填章节: `05-测试方案.md` §6 测试场景与用例设计

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6 设计测试场景与用例矩阵 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 3 测试对象与切口、Step 4 分层、Step 5 覆盖矩阵,以及正式 `03/04` |
| 输出文件 | `projects/L1-artifact/design-calibration/05_test_plan_step_06_cases.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 7 |

## 2. 本步目标

把 Step 5 的覆盖矩阵落成可执行、可断言、可留证的 P0 用例矩阵。

本 Step 只回答:

- 每个核心主线和每类公共协议如何形成正向主用例。
- 哪些负向、边界、非法转换、duplicate replay、query no-write、job no-truth-repair、config fail-fast 和 redaction 用例必须进入 P0。
- 每个用例至少断言哪些正式状态、错误 surface、stored result / receipt / report、relay snapshot、marker 或 no-write / no-repair 边界。
- 每个用例的自动化候选和候选证据族如何预留。

本 Step 不定义 fixture 文件、数据生成器实现、脚本名、CI job 名、artifact 路径或正式 evidence ID。测试数据由 Step 7 固定,自动化 gate 由 Step 9 固定,正式 evidence 编号与归档路径由 Step 13 固定。本文使用的 `EV-CAND-ART-*` 只表示证据候选族。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_05_traceability_coverage.md` | 已完成 | 提供需求 / 规则 / 验收 / gate 到测试切口的追溯 |
| `05_test_plan_step_03_test_objects_cuts.md` | 已完成 | 提供 16 Command、13 Query、6 Consumer、8 Event、6 public job 和 internal relay facade 盘点 |
| `05_test_plan_step_04_strategy_layers.md` | 已完成 | 提供 contract / service / integration / entry / release gate 分层 |
| `03_ddd_step_08_protocol_contracts.md` | 正式输入 | 提供请求 / 响应、Query surface 和协议边界 |
| `03_ddd_step_09_function_flows.md` | 正式输入 | 提供 accepted / rejected / duplicate / degraded / partial failure 主流程 |
| `03_ddd_step_10_state_machine.md` 与 `03_ddd_step_16_test_cuts.md` | 正式输入 | 提供状态机、最小 test cut 和非法转换要求 |
| `03_ddd_step_11_persistence_tx_consistency.md` 与 `03_ddd_step_13_concurrency_idempotency.md` | 正式输入 | 提供 UoW、version、stored result / receipt / report、duplicate replay、race 和 rollback 语义 |
| `03_ddd_step_12_error_recovery.md` | 正式输入 | 提供 protocol rejection、domain / application / worker / job 错误 surface |
| `04-配置设计.md` 与 `04_config_step_12_downstream_handoff.md` | 正式输入 | 提供四个 P0 profile、strict JSON、source priority、redaction、builder gate、degraded no-write 和 replay gate |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 主线如何执行? | 以 Command / Query / Consumer / Event / Job 五类协议为主线,分别覆盖 accepted、rejected、duplicate、degraded、partial failure 和 no-write / no-repair 边界。 |
| 用例矩阵是否需要逐条落 16 个 Command 和 13 个 Query? | 需要。每个 public protocol 至少要有一个主用例行,共用负向和一致性场景再由共用矩阵补齐。 |
| 如何避免只测 happy path? | 每个协议族都至少带一组主线和一组共用负向:Command 带 duplicate / invalid / conflict,Query 带 degraded / selector invalid / no-write,Consumer 带 duplicate / unsupported / delayed,Job 带 duplicate / invalid / no-truth-repair。 |
| Step 6 是否现在固定正式证据编号? | 否。这里只保留 `EV-CAND-ART-*` 候选证据族,正式 evidence ID 留给 Step 13。 |
| worker-only `PublishPendingArtifactRelays` 如何处理? | 单独列为 internal worker facade 用例,验证 stored snapshot publish、retryable / terminal failure 和 truth unchanged,不得并入 6 个 public job 计数。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 5 | 已有覆盖矩阵,但还没有可执行用例表 | 本 Step 把覆盖关系落成 TC 级矩阵 |
| `03_ddd_step_16_test_cuts.md` | 只有最小切口,还不是测试方案用例层 | 本 Step 转译成主线 / 共用负向 / 一致性 / config / redaction 用例 |
| 旧 `05-测试方案.md` | 历史用例主线与新版 `03/04` 不一致 | 不继承旧用例,只承接新版正式设计 |
| Step 7 | 尚未定义具体测试数据 | 本 Step 只写前置条件级别,不提前写 fixture 文件 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 用例粒度 | 只有切口名和覆盖族 | 形成 TC 级矩阵 | 方便后续 Step 7 / Step 9 承接 |
| 公共协议覆盖 | 只有协议盘点 | 每个 public protocol 至少一行主用例 | 防止协议孤儿 |
| 负向边界 | 只在风险表出现 | 形成 duplicate / no-write / no-repair / redaction / config 明确用例 | 直接支撑 `VF-ART` 和 config gates |
| worker-only relay | 只有切口名 | 单列 internal facade 用例 | 防止与 public job 混淆 |

## 7. 测试设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 16 个 Command 是否都拆全正负矩阵 | A. 每个 Command 拆完整正负;B. 每个 Command 一条主线,共用负向由一致性矩阵承接 | 采用 B。先保证协议完备,再用共用矩阵控制规模 |
| 13 个 Query 是否每个都写 no-write | A. 只在 query 总则中写一次;B. 每个 Query 行都带 no-write 断言 | 采用 B。Query no-write 是 P0 红线 |
| 配置和 redaction 是否延后 | A. 延后到 Step 8 / Step 10;B. 先列入 Step 6 的 P0 用例矩阵 | 采用 B。它们直接支撑 `VF-ART-002/004` 和 `04` gate |

## 8. 结构化中间产物

### 8.1 用例批次表

| 批次 | 覆盖对象 | 主要内容 | 优先级 | 证据候选族 |
|---|---|---|---|---|
| 6.1 | contracts / domain / state | DTO、metadata、state matrix、body-free invariant | P0 | `EV-CAND-ART-CONTRACT-*`;`EV-CAND-ART-STATE-*` |
| 6.2 | 16 Command | 每个 Command 主线 accepted / key guard | P0 | `EV-CAND-ART-CMD-*` |
| 6.3 | 13 Query + 6 Consumer | query no-write、selector / degraded、consumer body-free / duplicate / delayed | P0 | `EV-CAND-ART-QUERY-*`;`EV-CAND-ART-CONSUMER-*` |
| 6.4 | 8 Event + relay facade + 6 public job | stored payload snapshot、publish failure、job report replay、no-truth-repair | P0 | `EV-CAND-ART-OUTBOX-*`;`EV-CAND-ART-JOB-*`;`EV-CAND-ART-HANDOFF-*` |
| 6.5 | 一致性 / idempotency / config / redaction / dependency | duplicate replay、rollback、strict JSON、no silent fallback、redaction、dependency boundary | P0 | `EV-CAND-ART-IDEMP-*`;`EV-CAND-ART-CONFIG-*`;`EV-CAND-ART-REDACTION-*`;`EV-CAND-ART-ARCH-*` |

### 8.2 测试场景总表

| 场景组 | 需求 / 规则主轴 | 主切口 | 场景类型 | 断言重点 |
|---|---|---|---|---|
| 制品事实收束 | `FR-ART-001~004`;`BR-ART-001~005` | command + query + redaction | 正向 / 负向 | fact 入口唯一、forbidden body absent、责任 / 审查锚点稳定 |
| 制品版本化 | `FR-ART-005~008`;`BR-ART-006~010` | command + state + idempotency | 正向 / 边界 / 恢复 | candidate / publish / supersede、history 保留、no silent overwrite |
| 制品血缘关联 | `FR-ART-009~012`;`BR-ART-011~015` | command + query + consumer | 正向 / 负向 | lineage 只能显式建立,trace / event 不替代 lineage |
| 制品基线冻结 | `FR-ART-013~016`;`BR-ART-016~020` | command + query + job | 正向 / 边界 | formal version only、freeze 后成员稳定、历史 baseline 可回溯 |
| 制品消费表达 | `FR-ART-017~020`;`BR-ART-021~025` | command + query + consumer + handoff | 正向 / 负向 | consumable ref / backref、跨仓回指、下游不反写 truth |
| 全局 veto / config gate | `VF-ART-001~004`;`NFR-ART-GLOB-*`;`04` §12 | query / job / config / redaction / dependency | 负向 / gate | no-write、no-truth-repair、strict JSON、no silent fallback、redaction、dependency boundary |

### 8.3 Contract / domain / state 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 | 证据候选 ID |
|---|---|---|---|---|---|---|---|---|
| `TC-ART-CONTRACT-001` | public DTO roundtrip | P0 | 各协议 DTO builder 可构造 | serialize + deserialize Command / Query / Event / Job / View / Error DTO | roundtrip 后字段稳定 | typed ref、metadata、schema version、surface variant 不丢失 | 是 | `EV-CAND-ART-CONTRACT-001` |
| `TC-ART-CONTRACT-002` | required metadata missing | P0 | handler validation fixture | 缺 actor / trace / idempotency / required ref | 返回 `ArtifactProtocolRejection::InvalidRequest` 或等价 rejected surface | 不 begin write UoW、不 reserve idempotency | 是 | `EV-CAND-ART-CONTRACT-002` |
| `TC-ART-CONTRACT-003` | unsupported schema version | P0 | inbound event fixture | schema version 不命中 allowlist | worker disposition `UnsupportedVersion` | 不 parse payload、不写 resolution / receipt accepted success | 是 | `EV-CAND-ART-CONTRACT-003` |
| `TC-ART-CONTRACT-004` | same key different digest conflict | P0 | existing idempotency record with same key | 同 key 不同 digest 重放 | 返回 idempotency conflict surface | 不进入 domain transition、不写 accepted trace / relay | 是 | `EV-CAND-ART-CONTRACT-004` |
| `TC-ART-STATE-001` | domain object body-free invariant | P0 | valid truth / support builder | 提交带 forbidden body 的 fact / lineage / preview related input | invariant reject | truth 只保留 formal ref / summary / context,不保留 raw body | 是 | `EV-CAND-ART-STATE-001` |
| `TC-ART-STATE-002` | formal state legal / illegal transitions | P0 | Step 10 正式 state fixtures | 执行一条主线合法转换和一条非法转换 | 合法转换成功;非法转换返回 `DomainError::InvalidStateTransition` 或等价 surface | 非法转换不写 success trace / result / relay | 是 | `EV-CAND-ART-STATE-002` |
| `TC-ART-STATE-003` | terminal guard | P0 | terminal fact / version / lineage / baseline / review fixture | 对终态对象再次执行变更 | 返回 rejected / invalid transition | 终态对象不被重写,history 不追加成功变更 | 是 | `EV-CAND-ART-STATE-003` |

### 8.4 Command 用例矩阵

| 用例 ID | 协议 | 优先级 | 主线场景 | 关键负向 / 边界 | 断言重点 | 自动化候选 | 证据候选 ID |
|---|---|---|---|---|---|---|---|
| `TC-ART-CMD-001` | `RegisterArtifactIntake` | P0 | intake created with pending / ready branch | missing source ref / resolver unavailable / duplicate replay | intake saved, trace / audit / relay / stale / stored result 同 UoW | 是 | `EV-CAND-ART-CMD-001` |
| `TC-ART-CMD-002` | `EstablishArtifactFact` | P0 | fact established from formal intake / definition / review context | forbidden body / policy reject / duplicate replay | fact truth established, no external body persisted, committed change relay emitted | 是 | `EV-CAND-ART-CMD-002` |
| `TC-ART-CMD-003` | `CreateArtifactVersionCandidate` | P0 | candidate created from fact + content context + submission | missing content context / version conflict / duplicate replay | candidate truth saved, history / trace / relay appended | 是 | `EV-CAND-ART-CMD-003` |
| `TC-ART-CMD-004` | `PublishArtifactVersion` | P0 | candidate published and current bind updated | invalid state / missing candidate / duplicate replay | version state changes formally, fact current pointer由 formal flow 更新 | 是 | `EV-CAND-ART-CMD-004` |
| `TC-ART-CMD-005` | `SupersedeArtifactVersion` | P0 | current version superseded by next version | same-fact guard / version conflict / duplicate replay | current not in-place overwritten, relay snapshot from committed change | 是 | `EV-CAND-ART-CMD-005` |
| `TC-ART-CMD-006` | `EstablishArtifactLineageLink` | P0 | lineage link created between formal versions | endpoint uniqueness conflict / relation kind guard / duplicate replay | lineage truth anchored on formal versions only | 是 | `EV-CAND-ART-CMD-006` |
| `TC-ART-CMD-007` | `RejectArtifactLineageLink` | P0 | proposed lineage formally rejected | terminal lineage guard / duplicate replay | rejection is explicit lineage state change,not implicit deletion | 是 | `EV-CAND-ART-CMD-007` |
| `TC-ART-CMD-008` | `CreateArtifactBaselineCandidate` | P0 | ordered members accepted into candidate | membership uniqueness / scope guard / duplicate replay | ordered member refs preserved,不从 current version 动态重算 | 是 | `EV-CAND-ART-CMD-008` |
| `TC-ART-CMD-009` | `FreezeArtifactBaseline` | P0 | baseline candidate frozen | membership validation failure / invalid transition / duplicate replay | freeze only accepts formal version members and stable membership set | 是 | `EV-CAND-ART-CMD-009` |
| `TC-ART-CMD-010` | `SupersedeArtifactBaseline` | P0 | current baseline superseded by next baseline | version conflict / duplicate replay | prior baseline history retained, membership not deleted | 是 | `EV-CAND-ART-CMD-010` |
| `TC-ART-CMD-011` | `OpenArtifactReviewAnchor` | P0 | review anchor opened with optional responsibility branch | missing truth anchor / duplicate replay | review anchor and related responsibility formalized, no private review state shortcut | 是 | `EV-CAND-ART-CMD-011` |
| `TC-ART-CMD-012` | `AssignArtifactResponsibility` | P0 | responsibility assigned to formal actor / basis | capability unavailable / duplicate replay | responsibility chain updated,review truth anchor unchanged | 是 | `EV-CAND-ART-CMD-012` |
| `TC-ART-CMD-013` | `RegisterAutomationArtifactInput` | P0 | automation input registered against formal source / anchor | body-free source guard / duplicate replay | automation input stays formal input truth,not runtime output truth | 是 | `EV-CAND-ART-CMD-013` |
| `TC-ART-CMD-014` | `AcceptAutomationArtifactInput` | P0 | automation input accepted into formal intake context | intake context guard / version conflict / duplicate replay | accepted automation path only updates formal automation state,not direct fact creation | 是 | `EV-CAND-ART-CMD-014` |
| `TC-ART-CMD-015` | `IssueConsumableArtifactReference` | P0 | consumable reference issued for truth anchor and consumer scope | scope / anchor guard / duplicate replay | consumable ref formalized;downstream only consumes this ref surface | 是 | `EV-CAND-ART-CMD-015` |
| `TC-ART-CMD-016` | `RecordArtifactConsumptionBackref` | P0 | backref recorded against consumable and consumer | wrong consumable / wrong consumer scope / duplicate replay | traceability record appended without rewriting truth anchor | 是 | `EV-CAND-ART-CMD-016` |

### 8.5 Query 与 Consumer 用例矩阵

| 用例 ID | 协议 | 优先级 | 主线场景 | 关键负向 / 边界 | 断言重点 | 自动化候选 | 证据候选 ID |
|---|---|---|---|---|---|---|---|
| `TC-ART-QUERY-001` | `GetArtifactFact` | P0 | fact hit | missing / degraded summary / no-write | `ArtifactQueryResponse` surface 正确,不写 truth / trace / relay | 是 | `EV-CAND-ART-QUERY-001` |
| `TC-ART-QUERY-002` | `GetArtifactVersion` | P0 | version hit | missing / degraded summary / no-write | historical / superseded version 可读取但不修复 | 是 | `EV-CAND-ART-QUERY-002` |
| `TC-ART-QUERY-003` | `ListArtifactVersionsByFact` | P0 | ordered page hit | empty page / current pointer 不得重解释列表 / no-write | page order、cursor 稳定 | 是 | `EV-CAND-ART-QUERY-003` |
| `TC-ART-QUERY-004` | `GetArtifactLineageSummary` | P0 | lineage summary hit | empty relation set / degraded summary / no-write | lineage comes from formal repository,not trace reconstruction | 是 | `EV-CAND-ART-QUERY-004` |
| `TC-ART-QUERY-005` | `GetArtifactBaseline` | P0 | baseline hit | missing / incomplete membership -> degraded / no-write | membership reads existing refs only,不从 current version 重算 | 是 | `EV-CAND-ART-QUERY-005` |
| `TC-ART-QUERY-006` | `GetArtifactReviewSummary` | P0 | review summary hit | missing / no assignment / degraded / no-write | review and responsibility surface formal and read-only | 是 | `EV-CAND-ART-QUERY-006` |
| `TC-ART-QUERY-007` | `GetArtifactReadSurface` | P0 | consumable selector branch hit | both / none selector rejected, not visible, degraded / stale, no-write | truth-anchor branch and consumable branch都只读,不调用 `RecordArtifactConsumptionBackrefFlow` | 是 | `EV-CAND-ART-QUERY-007` |
| `TC-ART-QUERY-008` | `GetArtifactTrace` | P0 | trace page hit | empty page / no append / no-write | trace query 只读现有记录 | 是 | `EV-CAND-ART-QUERY-008` |
| `TC-ART-QUERY-009` | `SearchArtifactFacts` | P0 | search page hit | empty page / stale summary / no rebuild | stale surfaced as degraded,不触发 rebuild | 是 | `EV-CAND-ART-QUERY-009` |
| `TC-ART-QUERY-010` | `GetArtifactPreview` | P0 | preview hit | missing preview -> degraded / no-write | preview is derived view,not truth repair trigger | 是 | `EV-CAND-ART-QUERY-010` |
| `TC-ART-QUERY-011` | `GetArtifactReport` | P0 | report hit | missing / failed state / no-write | report query does not regenerate report | 是 | `EV-CAND-ART-QUERY-011` |
| `TC-ART-QUERY-012` | `GetArtifactReconciliationReport` | P0 | reconciliation report hit | missing / stale state / no-write | query reads stored report only | 是 | `EV-CAND-ART-QUERY-012` |
| `TC-ART-QUERY-013` | `GetExternalReferenceResolution` | P0 | state-ref branch or external+kind branch hit | both / none selector rejected, unresolved / failed -> degraded, no-write | formal selector closure only,不扫描 sibling body | 是 | `EV-CAND-ART-QUERY-013` |
| `TC-ART-CONSUMER-001` | `ConsumeWorkArtifactContextChanged` | P0 | accepted resolution state + refresh record saved | duplicate / unsupported version / delayed | work body forbidden,只保存 ref / resolution / receipt | 是 | `EV-CAND-ART-CONSUMER-001` |
| `TC-ART-CONSUMER-002` | `ConsumeProcessArtifactContextChanged` | P0 | accepted process context snapshot | duplicate / unsupported / delayed | no process body persisted | 是 | `EV-CAND-ART-CONSUMER-002` |
| `TC-ART-CONSUMER-003` | `ConsumeGovernanceArtifactContextChanged` | P0 | accepted governance context snapshot | duplicate / delayed | governance truth not copied as local truth | 是 | `EV-CAND-ART-CONSUMER-003` |
| `TC-ART-CONSUMER-004` | `ConsumeMethodArtifactDefinitionChanged` | P0 | definition resolution state saved | duplicate / unsupported / delayed | no method definition body stored | 是 | `EV-CAND-ART-CONSUMER-004` |
| `TC-ART-CONSUMER-005` | `ConsumeRuntimeArtifactSignalRecorded` | P0 | accepted automation source state saved | duplicate / quarantined / delayed | runtime output not treated as Artifact truth | 是 | `EV-CAND-ART-CONSUMER-005` |
| `TC-ART-CONSUMER-006` | `ConsumeExternalContentSourceChanged` | P0 | local mirror snapshot + resolution state saved | duplicate / unsupported / failed | content body forbidden,只保存 mirror snapshot contract | 是 | `EV-CAND-ART-CONSUMER-006` |

### 8.6 Outbound / relay / job 用例矩阵

| 用例 ID | 协议 | 优先级 | 主线场景 | 关键负向 / 边界 | 断言重点 | 自动化候选 | 证据候选 ID |
|---|---|---|---|---|---|---|---|
| `TC-ART-OUTBOX-001` | `ArtifactFactChanged` | P0 | payload published from stored snapshot | publish retryable / terminal failure | payload only carries formal refs / state,不读 current truth 重算 | 是 | `EV-CAND-ART-OUTBOX-001` |
| `TC-ART-OUTBOX-002` | `ArtifactVersionChanged` | P0 | version payload published | publish failure | no raw content body / mutable current view dump | 是 | `EV-CAND-ART-OUTBOX-002` |
| `TC-ART-OUTBOX-003` | `ArtifactLineageChanged` | P0 | lineage payload published | publish failure | lineage payload is ref / kind only | 是 | `EV-CAND-ART-OUTBOX-003` |
| `TC-ART-OUTBOX-004` | `ArtifactBaselineChanged` | P0 | baseline payload published | publish failure | no baseline member body dump | 是 | `EV-CAND-ART-OUTBOX-004` |
| `TC-ART-OUTBOX-005` | `ArtifactReviewChanged` | P0 | review payload published | publish failure | no actor profile or review body leak | 是 | `EV-CAND-ART-OUTBOX-005` |
| `TC-ART-OUTBOX-006` | `ConsumableArtifactReferenceChanged` | P0 | consumable payload published | publish failure | only anchor / scope / state refs | 是 | `EV-CAND-ART-OUTBOX-006` |
| `TC-ART-OUTBOX-007` | `ArtifactTraceAvailable` | P0 | trace payload published | publish failure | only trace / anchor / handoff refs | 是 | `EV-CAND-ART-OUTBOX-007` |
| `TC-ART-OUTBOX-008` | `ArtifactDerivedViewStateChanged` | P0 | derived view state payload published | publish failure | no projection body dump | 是 | `EV-CAND-ART-OUTBOX-008` |
| `TC-ART-RELAY-001` | `PublishPendingArtifactRelays` | P0 | pending relay batch published successfully | retryable / terminal failure, duplicate / race | published / failed markers move,truth unchanged,stored snapshot is唯一发布来源 | 是 | `EV-CAND-ART-RELAY-001` |
| `TC-ART-JOB-001` | `RebuildArtifactDerivedViews` | P0 | selected derived views rebuilt | partial failure / duplicate replay | stale / failed -> fresh,core truth unchanged | 是 | `EV-CAND-ART-JOB-001` |
| `TC-ART-JOB-002` | `RefreshExternalReferenceStates` | P0 | tracked reference states refreshed | unresolved / failed / duplicate replay | last good snapshot preserved,derived state stale only as formalized | 是 | `EV-CAND-ART-JOB-002` |
| `TC-ART-JOB-003` | `RunArtifactReconciliation` | P0 | clean or drift report generated | failed report / duplicate replay | no inline repair,stored reconciliation report readable | 是 | `EV-CAND-ART-JOB-003` |
| `TC-ART-JOB-004` | `PrepareArtifactArchiveHandoff` | P0 | archive handoff prepared | target disabled / invalid trace refs / failed marker | no archive package body,trace refs mandatory | 是 | `EV-CAND-ART-JOB-004` |
| `TC-ART-JOB-005` | `PrepareArtifactObservabilityHandoff` | P0 | observability handoff prepared | target disabled / retryable / failed | no observability body dump,only safe refs / markers | 是 | `EV-CAND-ART-JOB-005` |
| `TC-ART-JOB-006` | `PrepareArtifactSyncHandoff` | P0 | sync handoff prepared | target disabled / retryable / failed | sync surface does not migrate ownership | 是 | `EV-CAND-ART-JOB-006` |

### 8.7 一致性 / 幂等 / config / redaction 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 | 证据候选 ID |
|---|---|---|---|---|---|---|---|---|
| `TC-ART-IDEMP-001` | command duplicate same key same digest | P0 | existing stored command result | 重放相同 command | 返回 stored result | 不新写 truth / history / trace / relay | 是 | `EV-CAND-ART-IDEMP-001` |
| `TC-ART-IDEMP-002` | duplicate result missing no recompute | P0 | completed idempotency -> missing / wrong result kind | 重放 command / consumer / job | 返回 consistency / dependency error | 不从 current truth / current report 重算 | 是 | `EV-CAND-ART-IDEMP-002` |
| `TC-ART-IDEMP-003` | consumer duplicate receipt replay | P0 | accepted receipt exists | 重放 inbound event | duplicate receipt returned | snapshot / stale marker 不重写 | 是 | `EV-CAND-ART-IDEMP-003` |
| `TC-ART-IDEMP-004` | commit unknown same key recovery | P0 | fake UoW commit unknown | retry same key | 先查 idempotency / stored result / truth state 再决定 | 不盲写第二次 truth | 是 | `EV-CAND-ART-IDEMP-004` |
| `TC-ART-IDEMP-005` | relay enqueue failure rolls back truth | P0 | outbox append failure injected | run accepted command | command fails and rollback | accepted truth / trace / result / relay 都不可见 | 是 | `EV-CAND-ART-IDEMP-005` |
| `TC-ART-IDEMP-006` | query no-write side effects | P0 | representative query fixtures + write audit | run degraded / stale / not-visible query | query returns formal surface only | 不 begin write UoW、不 refresh / rebuild / append audit | 是 | `EV-CAND-ART-IDEMP-006` |
| `TC-ART-IDEMP-007` | maintenance job no truth repair | P0 | drifted derived / reference / report fixture | run public jobs | jobs only update derived / reference / report / handoff markers | core truth store unchanged | 是 | `EV-CAND-ART-IDEMP-007` |
| `TC-ART-CONFIG-001` | P0 profile matrix assembles | P0 | `local-dev` / `ci-test` / `integration-like` / `operations-replay` config fixtures | build runtime | valid P0 profiles reach `Ready` | required stores / adapters / topic map / redaction / clock / id all assembled | 是 | `EV-CAND-ART-CONFIG-001` |
| `TC-ART-CONFIG-002` | strict JSON rejects loose syntax | P0 | parser fixture | parse comment / trailing comma / unknown field | fail-fast | no silent fallback to defaults | 是 | `EV-CAND-ART-CONFIG-002` |
| `TC-ART-CONFIG-003` | high-priority invalid no fallback | P0 | defaults and file valid,env override invalid | load config | reject / fail-fast | invalid env / run-local override does not silently fall back | 是 | `EV-CAND-ART-CONFIG-003` |
| `TC-ART-CONFIG-004` | forbidden boundary not configurable | P0 | valid startup config + invalid entry-local override | attempt override no-write / no-truth-repair / redaction / truth boundary | entry rejected | startup invariants stay fixed | 是 | `EV-CAND-ART-CONFIG-004` |
| `TC-ART-REDACTION-001` | logs / audit / reports no forbidden body | P0 | representative command / consumer / job run | collect logs / audit / report outputs | redaction scan passes | no raw body / external response / secret / full sensitive ref | 是 | `EV-CAND-ART-REDACTION-001` |
| `TC-ART-REDACTION-002` | metrics low-cardinality labels | P0 | metric output fixture | emit standard metrics | labels stay within allowlist | no trace id / free text / secret / high-cardinality ref | 是 | `EV-CAND-ART-REDACTION-002` |
| `TC-ART-ARCH-001` | non-core sibling not cargo dependency | P0 | dependency metadata available | run architecture boundary check | check passes only with allowed compile-time upstreams | sibling repos only via contracts / events / adapters,not direct package dependency | 是 | `EV-CAND-ART-ARCH-001` |

### 8.8 单测试切口停审记录

| 测试切口 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| contracts / domain / state | DTO、metadata、非法转换和 body-free invariant 是否有明确用例 | 通过 | Step 7 再落具体 fixture |
| 16 Command | 是否全部有主线和关键 guard | 通过 | 更深边界由共用一致性矩阵承接 |
| 13 Query | 是否全部显式带 no-write | 通过 | write-audit helper 留 Step 9 固定 |
| 6 Consumer | 是否全部带 duplicate / unsupported / delayed / body-free 断言 | 通过 | 具体 event fixture 留 Step 7 |
| 8 Event + relay facade | 是否全部来自 stored snapshot 且不读 current truth 重算 | 通过 | topic / publisher suite 留 Step 9 |
| 6 public job | 是否都有 duplicate / partial / no-truth-repair | 通过 | report artifact 细节留 Step 13 |
| consistency / config / redaction | 是否承接 `VF-ART` 与 `04` gates | 通过 | 正式脚本名和路径留 Step 9 |

### 8.9 跨用例审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在只测 happy path 的协议族 | 否 | 每个协议族都有主线和共用负向 / 边界矩阵 |
| 是否存在 P0 孤儿协议 | 否 | 16 Command、13 Query、6 Consumer、8 Event、6 public job、relay facade 全部覆盖 |
| 是否存在 query write / job repair 未被显式测试 | 否 | `TC-ART-IDEMP-006/007` 已单列 |
| 是否存在把 P1/P2 写成 P0 用例 | 否 | 真实产品、production-like、容量和跨仓 E2E 未进入本矩阵 |
| 是否提前固定正式 evidence ID 或 CI 路径 | 否 | 仍只使用候选证据族 |

## 9. 对上游设计的影响判定

| 用例结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 当前 P0 用例矩阵可完全承接 Step 5 覆盖矩阵 | 否 | 测试方案细化 | 无需回写 |
| Query no-write 与 job no-truth-repair 仍依赖统一 write-audit / store-audit 能力 | 否 | 测试实现工具需求 | 留 Step 9 收口 |
| 若 Step 7 无法为某些 formal guard 提供稳定数据前置 | 是 | 可验证性缺口 | 回写 `03/04` 或记录阻塞 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_06_cases.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“测试场景总表”“Command 用例矩阵”“Query 与 Consumer 用例矩阵”“Outbound / relay / job 用例矩阵”“一致性 / 幂等 / config / redaction 用例矩阵”和“跨用例审计表”小节。

正式 `05-测试方案.md` §6 应回填:

- 用例矩阵必须逐条承接 16 Command、13 Query、6 Consumer、8 Event、6 public job 和 worker-only `PublishPendingArtifactRelays`。
- 每个 Query 行都必须显式带 no-write 断言,每个 public job 行都必须显式带 no-truth-repair 断言。
- duplicate replay、missing stored result no recompute、commit unknown、relay enqueue rollback、strict JSON、no silent fallback、redaction no-output 和 dependency boundary 必须作为 P0 共用负向用例族保留。
- `PublishPendingArtifactRelays` 只作为 internal relay publication facade 用例,不得并入 public job 统计。
- 正式 evidence ID、artifact 路径和 gate 套件名由 Step 9 / Step 13 再固定。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 7 需要按本矩阵分配 fixture 组和 truth / derived / replay 数据 | 影响测试数据组织 | 下一步直接按本矩阵展开 |
| write-audit / no-truth-repair helper 需要统一实现口径 | 影响 Step 9 自动化脚本 | 当前已在用例矩阵保留,后续收口 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 每个 public protocol 至少一条主用例 | 通过 | 见 §8.4~§8.6 |
| duplicate / no-write / no-truth-repair / config / redaction 共用负向已闭合 | 通过 | 见 §8.7 |
| P0 无协议孤儿和 phase 越界 | 通过 | 见 §8.9 |
| 可进入 Step 7 | 通过 | 下一步设计测试数据;进入前等待用户审查 |
