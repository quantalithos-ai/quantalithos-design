# Step 6. 设计测试场景与用例矩阵

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 6
> 回填章节: `05-测试方案.md` §6 测试场景与用例设计

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6 设计测试场景与用例矩阵 |
| 当前状态 | 已写入;待用户审查 |
| 输入基线 | Step 5 覆盖矩阵;Step 3 测试切口;Step 4 测试分层;`03` protocol / flow / state / error / consistency;`04` 配置门禁 |
| 输出文件 | `projects/L1-identity/design-calibration/05_test_plan_step_06_cases.md` |
| 正式文档状态 | 本 Step 不修改正式 `05-测试方案.md` |
| 停审方式 | 按测试切口分批写入用例;完成后暂停,由用户审查后再进入 Step 7 |

## 2. 本步目标

把 Step 5 的覆盖矩阵落成可执行、可断言、可留证的测试场景和用例矩阵。

本 Step 只回答:

- 每个 P0 正向主线如何执行。
- 每个关键负向、边界、非法状态、事务回滚、并发、恢复、配置和 redaction 场景如何触发。
- 每个用例断言哪些正式字段、状态、错误 surface、event、marker 或副作用。
- 每个用例是否有前置数据、自动化候选和候选证据 ID。
- 是否存在只测 happy path、断言重复、断言缺失、phase 越界或证据冲突。

本 Step 不定义 fixture 具体文件、数据生成器实现、CI suite 名称、artifact 路径、正式 evidence ID 或验收裁决。测试数据由 Step 7 固定,自动化 gate 由 Step 9 固定,正式 evidence ID 和归档路径由 Step 13 固定。本文中的 `EV-CAND-ID-*` 是候选证据 ID,不是最终 `EV-*` 编号。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_05_traceability_coverage.md` | 已审核通过 | 提供需求 / 规则 / 设计契约到测试切口的追溯 |
| `05_test_plan_step_03_test_objects_cuts.md` | 已审核通过 | 提供 P0 测试对象、切口和负向风险入口 |
| `05_test_plan_step_04_strategy_layers.md` | 已审核通过 | 提供每个切口的主发现层级 |
| `03_ddd_step_08_protocol_contracts.md` | 正式输入 | 提供 6 Command、14 Query、5 Inbound/Callback、10 Outbound Material、6 Job DTO 和 result surface |
| `03_ddd_step_09_function_flows.md` | 正式输入 | 提供 accepted/rejected/duplicate/no-write/partial failure 编排 |
| `03_ddd_step_10_state_matrix.md` | 正式输入 | 提供正式 state enum、合法 / 非法转换和 terminal guard |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 正式输入 | 提供 UoW、version、stored result/report、outbox snapshot、projection/reference/handoff 一致性口径 |
| `03_ddd_step_12_error_recovery.md` | 正式输入 | 提供 `IdentityDomainError`、`ApplicationError`、protocol rejection、worker/job disposition 映射 |
| `03_ddd_step_13_concurrency_idempotency.md` | 正式输入 | 提供 duplicate replay、same-key conflict、commit unknown、race guard |
| `03_ddd_step_14_config_external_binding.md` / `04-配置设计.md` §12 | 正式输入 | 提供 config validation、profile、adapter、topic、handoff target 和 degraded/no-write 测试入口 |
| `03_ddd_step_15_observability_audit.md` | 正式输入 | 提供 logs / metrics / audit / trace / redaction 断言 |
| `03_ddd_step_16_test_cuts.md` | 直接输入 | 提供最小测试切口汇总 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 正向主线怎么执行? | 按 contracts/domain/application/entry 分层执行。Command 主线调用正式 command flow 并断言 truth、trace/audit、outbox、projection stale、stored result 同 UoW;Query 主线读取 view/report/trace 并断言 no-write;Consumer/Callback 主线消费 envelope 并写 typed receipt、snapshot/reference/stale;Outbound 主线发布 stored payload marker;Job 主线写 report/marker 且不修 business truth。 |
| 每个关键反向和边界场景如何触发? | 通过 missing metadata、unsupported schema version、forbidden body、invalid reference、wrong actor、same key different digest、version conflict、source unavailable、publisher failure、handoff target disabled、unsafe config、query degraded、dependency violation 等输入触发。 |
| 每个状态非法迁移如何断言? | 以 Step 10 正式 enum 为唯一来源。非法转换断言 `IdentityDomainError::InvalidStateTransition` 或对应 `ApplicationError` / protocol surface,并断言不写 success trace、audit、outbox、stored accepted result 或 projection fresh marker。 |
| 每个事务回滚和副作用如何验证? | 通过 fake repository / fake UoW 注入 store unavailable、outbox append failure、stored result failure、idempotency complete failure、version conflict、rollback failure。断言 truth、history、trace、audit、outbox、projection、reference、stored result/report 的提交边界。 |
| 每个恢复场景如何复现? | 使用 duplicate same digest、stored result missing、commit status unknown、publisher retryable/permanent failure、reference unavailable、projection rebuild race、job partial failure 和 handoff failed marker 复现。恢复只读取 stored result/receipt/report 或 marker,不得从 current truth 重算。 |
| 每个用例预期结果引用了哪些正式字段、状态、错误或事件? | 用例矩阵的断言点列引用正式 DTO、state enum、error surface、outbound material、worker/job disposition、repository marker 或 config validation state。 |
| 是否存在把后续 phase 状态或证据提前写入当前用例的问题? | 当前未发现。P1 real-like、P2 production/capacity、正式 EV 编号、artifact 路径和 release verdict 不在本 Step 固定。 |
| 每个测试切口下有哪些正向、负向、边界、并发、恢复或一致性用例? | 见 §8.2~§8.8。每个测试切口至少有正向主线和关键负向 / 边界用例。 |
| 每个用例是否有明确断言点、数据前置、自动化候选和证据 ID? | 是。当前证据列使用 `EV-CAND-ID-*` 候选 ID,正式 evidence ID 留 Step 13。 |
| 当前测试切口的用例完成后是否通过停审? | 通过。见 §8.9 单测试切口用例停审记录。 |
| 所有用例完成后是否存在断言重复、断言缺失、phase 越界、证据冲突或只测 happy path? | 当前未发现 unresolved 冲突。见 §8.10 跨用例审计。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧用例围绕历史主线,无法覆盖新版 6 Command、14 Query、5 Inbound/Callback、10 Outbound、6 Job 和状态矩阵 | 不继承旧用例,按新版 Step 3~5 重建 |
| Step 5 | 已有覆盖矩阵和用例候选族,但没有可执行步骤和断言 | 本 Step 生成具体 TC 矩阵 |
| Step 3 / Step 16 | 已有测试切口,但不是正式用例矩阵 | 本 Step 按切口生成正向 / 负向 / 边界 / 并发 / 恢复用例 |
| Error / state 断言 | 容易使用口语状态或泛化错误 | 本 Step 明确引用 Step 10 / Step 12 正式名称 |
| Evidence | Step 13 尚未执行,不能固定最终 EV | 本 Step 使用 `EV-CAND-ID-*` 候选证据,不生成正式 evidence index |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 用例来源 | 覆盖矩阵只有候选族 | 按测试切口拆成稳定 TC | 测试人员可执行和审查 |
| 断言粒度 | 只说明覆盖场景 | 每个 TC 有前置、输入、预期和断言点 | 防止只测成功返回 |
| 负向覆盖 | 只列风险入口 | 为 metadata、body、version、state、duplicate、config 等给出负向 TC | 一票否决风险必须可触发 |
| 证据 | 预留证据族 | 每个 TC 有候选证据 ID | Step 13 可继续收敛 |
| phase 边界 | P1/P2 只在范围中说明 | 用例矩阵明确不写 P1/P2 pass 证据 | 防止 release gate 伪通过 |

## 7. 测试设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 每个 command 是否都拆多个 TC | A. 每个 command 全量拆正负边界;B. 每个 command 一个主 TC + command common negative TC | 采用 B。避免矩阵失控,同时通过 common negative 覆盖 metadata、duplicate、version、rollback |
| 每个 query 是否都写 degraded/not-visible | A. 每个 query 全量展开;B. 每个 query 主 TC + query common degraded/no-write TC | 采用 B。关键 surface 可复用,Step 7 再映射数据 |
| Evidence 是否固定 | A. 固定正式 EV;B. 只固定候选证据 ID | 采用 B。正式归档依赖 Step 9 / Step 13 |
| P1 real-like 是否写用例 | A. 写成 P0;B. 仅记录 selected-run 候选和 residual | 采用 B。当前 P0 只证明 fake / controlled / product-neutral seam |
| 性能是否写硬断言 | A. 写旧 P95;B. 只写结构性非功能候选 | 采用 B。硬阈值未被正式设计锁定 |

## 8. 结构化中间产物

### 8.1 用例批次表

| 测试切口 | 用例批次 | 覆盖场景 | 优先级 | 数据前置 | 证据候选 ID | 停审状态 |
|---|---|---|---|---|---|---|
| contracts protocol / metadata / body-free | 6.1 | DTO roundtrip、required metadata、schema version、body-free request/result | P0 | protocol DTO builders | `EV-CAND-ID-CONTRACT-*` | 通过 |
| domain object / policy / state | 6.1 | factory invariant、policy reject、legal/illegal transition | P0 | domain fixture builders | `EV-CAND-ID-STATE-*` | 通过 |
| command orchestration | 6.2 | 6 Command accepted/rejected/duplicate/version/rollback | P0 | truth + reference fixtures | `EV-CAND-ID-CMD-*` | 通过 |
| query no-write | 6.3 | 14 Query hit/missing/not-visible/degraded/no-write | P0 | projection/view fixtures | `EV-CAND-ID-QUERY-*` | 通过 |
| inbound consumer / callback | 6.3 | 5 Consumer/Callback accepted/duplicate/unsupported/delayed/body-free | P0 | event envelope fixtures | `EV-CAND-ID-CONSUMER-*` | 通过 |
| outbound material / publish | 6.4 | 10 material payload snapshot、topic、publish failure | P0 | outbox payload fixtures | `EV-CAND-ID-OUTBOX-*` | 通过 |
| operations job | 6.4 | 6 Job success/partial/duplicate/no truth repair | P0 | job input + store fixtures | `EV-CAND-ID-JOB-*` | 通过 |
| consistency / idempotency / recovery | 6.5 | same-key replay/conflict、commit unknown、stored result missing、race | P0 | fake UoW/repository fault fixtures | `EV-CAND-ID-IDEMP-*` | 通过 |
| config / redaction / dependency | 6.5 | strict config、profile isolation、redaction scan、dependency boundary | P0 | config/artifact fixtures | `EV-CAND-ID-CONFIG-*` | 通过 |

### 8.2 Contract / domain / state 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 | 证据候选 ID |
|---|---|---|---|---|---|---|---|---|
| TC-ID-CONTRACT-001 | public DTO roundtrip | P0 | Command / Query / Event / Job DTO builders 可构造 | serialize + deserialize 所有 public DTO family | DTO roundtrip 后 ref、state、reason、metadata、schema version 不丢失 | `IdentityCommandRequest<T>`、query response、event payload、job request/report 字段稳定 | 是 | EV-CAND-ID-CONTRACT-001 |
| TC-ID-CONTRACT-002 | required metadata validation | P0 | handler validation fixture | 缺 command idempotency key、actor、trace context 或 event/job dedupe key | 返回 `IdentityProtocolRejectionKind::InvalidRequest` 或 entry failure | 不 begin UoW、不 reserve idempotency、不调用 domain transition | 是 | EV-CAND-ID-CONTRACT-002 |
| TC-ID-CONTRACT-003 | unsupported schema version | P0 | inbound event envelope fixture | event schema version 不在 allowlist | worker disposition `UnsupportedVersion` | 不 parse payload、不写 snapshot/reference/stale/receipt accepted success | 是 | EV-CAND-ID-CONTRACT-003 |
| TC-ID-CONTRACT-004 | body-free schema negative | P0 | request/result/outbound/report scan fixture | 提交含 RoleDefinition、ProjectMember、memory text、archive package 或 credential 的 DTO | request rejected or forbidden material issue | truth/outbox/audit/report/log/artifact 候选输出均无 raw body / secret | 是 | EV-CAND-ID-CONTRACT-004 |
| TC-ID-DOMAIN-001 | GlobalMember establish invariant | P0 | valid actor/source/member refs | `GlobalMember::establish(...)` / `IdentityAnchorState::established(...)` | `IdentityAnchorStateKind::Established`;initial `GlobalLifecycleStateKind::Available` | member ref 占用且不释放;anchor reason absent only for established state | 是 | EV-CAND-ID-STATE-001 |
| TC-ID-DOMAIN-002 | Global lifecycle legal transitions | P0 | member established;current lifecycle loaded | `Available -> Paused -> Available`;`Available -> Retired`;`Retired -> Tombstoned` | legal transitions accepted by domain policy | availability event condition follows old/new `is_available()`;Retired 到 Tombstoned 是唯一 terminal upgrade | 是 | EV-CAND-ID-STATE-002 |
| TC-ID-DOMAIN-003 | lifecycle illegal transitions | P0 | lifecycle `Tombstoned` or `Retired` fixture | attempt `Tombstoned -> Available` or `Retired -> Paused` | `IdentityDomainError::InvalidStateTransition` | no lifecycle save、no anchor update、no success outbox | 是 | EV-CAND-ID-STATE-003 |
| TC-ID-DOMAIN-004 | RoleCapabilitySummary source guard | P0 | source snapshot not `SourceResolved` | create active summary from stale/unavailable/unrecognized source | policy rejected | no `RoleCapabilitySummaryStateKind::Active`;no RoleDefinition / CapabilityDefinition body | 是 | EV-CAND-ID-STATE-004 |
| TC-ID-DOMAIN-005 | CareerRecord append-only | P0 | existing career record and correction target | append correction | new `CareerRecordStateKind::CorrectionAppended`;original not overwritten | no reorder/delete;correction has original record ref | 是 | EV-CAND-ID-STATE-005 |
| TC-ID-DOMAIN-006 | MemoryReference state body-free | P0 | member exists;memory/archive refs valid | create/update memory reference | formal `MemoryReferenceStateKind` persisted | memory text、embedding、archive package absent;state belongs to memory relation owner | 是 | EV-CAND-ID-STATE-006 |
| TC-ID-STATE-001 | Projection / reference / report no repair | P0 | projection stale, reference unavailable, report finding fixture | read/query and run maintenance paths | query surfaces `StaleVisible` / `Degraded`;jobs write projection/reference/report only | no `GlobalMember`、lifecycle、role、career、memory truth repair | 是 | EV-CAND-ID-STATE-007 |
| TC-ID-STATE-002 | outbox and handoff terminal guards | P0 | outbox `Published` / `Failed`;handoff `Delivered` / `Cancelled` | retry terminal record / intent | terminal retry rejected or skipped by formal selector | retry only selects `RetryableFailed`;`Published` does not mean downstream consumed | 是 | EV-CAND-ID-STATE-008 |

### 8.3 Command 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 | 证据候选 ID |
|---|---|---|---|---|---|---|---|---|
| TC-ID-CMD-001 | EstablishGlobalMember accepted | P0 | actor/source valid;requested member ref absent or free | call `EstablishGlobalMemberFlow` | saves `GlobalMember`, `IdentityAnchorStateKind::Established`, initial `GlobalLifecycleStateKind::Available` | creates `GlobalMemberEstablished` + initial `IdentityAnchorChanged`;no initial `GlobalLifecycleChanged` / availability event;stored result saved | 是 | EV-CAND-ID-CMD-001 |
| TC-ID-CMD-002 | EstablishGlobalMember ref reuse rejected | P0 | existing anchor owns requested ref | call `EstablishGlobalMemberFlow` with same ref | command rejected | no new member;no anchor release/reuse;no accepted outbox or stored accepted result | 是 | EV-CAND-ID-CMD-002 |
| TC-ID-CMD-003 | UpdateGlobalLifecycleState accepted | P0 | member established;lifecycle loaded;basis valid if high-risk | call `UpdateGlobalLifecycleStateFlow` to `Paused`, `Retired` or `Tombstoned` | lifecycle saved;terminal target updates anchor hold | `GlobalLifecycleChanged` always emitted for accepted transition;availability material only when derived availability flips | 是 | EV-CAND-ID-CMD-003 |
| TC-ID-CMD-004 | high-risk lifecycle basis missing rejected | P0 | action risk `High` or `Critical`;basis absent | call `UpdateGlobalLifecycleStateFlow` | rejected by high-risk guard | no lifecycle/anchor save;no accepted trace/outbox/stored result | 是 | EV-CAND-ID-CMD-004 |
| TC-ID-CMD-005 | MaintainRoleCapabilitySummary accepted | P0 | member exists;resolver returns `SourceResolved` with safe summary/evidence refs | call `MaintainRoleCapabilitySummaryFlow` | saves source snapshot and active summary | `RoleCapabilitySummaryChanged`;optional `RoleCapabilitySourceStateChanged`;no source body/scoring body | 是 | EV-CAND-ID-CMD-005 |
| TC-ID-CMD-006 | MaintainRoleCapabilitySummary unavailable source rejected/degraded | P0 | resolver unavailable or source unrecognized | call role command | no active summary accepted | source/reference issue uses formal surface;no silent pollution of summary | 是 | EV-CAND-ID-CMD-006 |
| TC-ID-CMD-007 | AppendCareerRecord accepted | P0 | trusted work participation source;member exists | call `AppendCareerRecordFlow` normal append | saves career record `Appended` | emits `CareerRecordAppended`;Project/WorkItem/ProjectMember body absent | 是 | EV-CAND-ID-CMD-007 |
| TC-ID-CMD-008 | AppendCareerRecord duplicate source noop/conflict | P0 | same source marker already appended | call same append intent | no second career record | duplicate command replays stored result or explicit no-op/conflict surface;history count unchanged | 是 | EV-CAND-ID-CMD-008 |
| TC-ID-CMD-009 | MaintainMemoryReference accepted | P0 | memory/archive/handoff refs valid;member exists | call `MaintainMemoryReferenceFlow` | saves `MemoryReference` and formal state | emits `MemoryReferenceChanged`;optional archive/handoff material per state;body-free | 是 | EV-CAND-ID-CMD-009 |
| TC-ID-CMD-010 | MaintainMemoryReference forbidden body rejected | P0 | request embeds memory text,embedding,archive package,or receipt body | call memory command | rejected / quarantined per formal surface | no memory relation accepted;forbidden material absent from outputs | 是 | EV-CAND-ID-CMD-010 |
| TC-ID-CMD-011 | PrepareTraceHandoff accepted | P0 | non-empty trace refs;target/scope/material visible and supported | call `PrepareTraceHandoffFlow` | saves `TraceHandoffIntent` with `HandoffStateKind::PendingHandoff` | no delivery call;no receipt;command effect has explicit empty outbox refs | 是 | EV-CAND-ID-CMD-011 |
| TC-ID-CMD-012 | PrepareTraceHandoff empty trace rejected | P0 | trace refs empty | call handoff command | rejected | no handoff intent;no delivery adapter call;no archive/receipt body | 是 | EV-CAND-ID-CMD-012 |
| TC-ID-CMD-013 | command duplicate same digest replay | P0 | stored command result exists for same key/digest | repeat representative command | replay stored command result | no resolver/domain/repository mutation;no second trace/outbox/stale marker | 是 | EV-CAND-ID-CMD-013 |
| TC-ID-CMD-014 | command duplicate different digest conflict | P0 | same key existing with different canonical digest | call changed command payload | `DuplicateConflict` / rejected conflict surface | original stored result authoritative;no mutation;digest not overwritten | 是 | EV-CAND-ID-CMD-014 |
| TC-ID-CMD-015 | command version conflict rollback | P0 | loaded expected_version stale | call representative mutating command | version conflict / conflict surface | truth、trace、outbox、stored result、idempotency completion rolled back | 是 | EV-CAND-ID-CMD-015 |

### 8.4 Query / inbound consumer 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 | 证据候选 ID |
|---|---|---|---|---|---|---|---|---|
| TC-ID-QUERY-001 | GetGlobalMemberAnchor hit/missing | P0 | visible member exists or missing member ref | call `GetGlobalMemberAnchorFlow` | returns anchor view or `Missing` | no member create;no projection repair;not visible does not reveal found/missing | 是 | EV-CAND-ID-QUERY-001 |
| TC-ID-QUERY-002 | GetGlobalLifecycleSummary hit | P0 | lifecycle truth exists;visibility allowed | call `GetGlobalLifecycleSummaryFlow` | returns lifecycle summary | lifecycle state is formal `Available/Paused/Retired/Tombstoned`;no runtime state substitution | 是 | EV-CAND-ID-QUERY-002 |
| TC-ID-QUERY-003 | GetRoleCapabilitySummary degraded | P0 | role summary missing/stale or source sidecar unavailable | call `GetRoleCapabilitySummaryFlow` | returns `Missing` / `Degraded` / `StaleVisible` per priority | no source resolver refresh;no active summary creation | 是 | EV-CAND-ID-QUERY-003 |
| TC-ID-QUERY-004 | ListCareerRecords page | P0 | career records page includes visible and invalid/missing item fixtures | call `ListCareerRecordsFlow` | visible page,empty page,or degraded partial | no append/correction repair;per-item visibility applied | 是 | EV-CAND-ID-QUERY-004 |
| TC-ID-QUERY-005 | ListMemoryReferences page | P0 | memory refs with pending/archive/handoff states | call `ListMemoryReferencesFlow` | page shows formal memory relation states | no memory/archive resolver call;no body leak | 是 | EV-CAND-ID-QUERY-005 |
| TC-ID-QUERY-006 | ReadMemberSummary stable lookup | P0 | member summary view ref exists or lookup missing | call `ReadMemberSummaryFlow` | returns loaded view or missing/degraded surface | view ref comes from formal lookup;query does not synthesize view ref or rebuild | 是 | EV-CAND-ID-QUERY-006 |
| TC-ID-QUERY-007 | ReadIdentityTrace body-free | P0 | trace records exist for member/subject/change kind | call `ReadIdentityTraceFlow` | returns visible trace page or not-visible/degraded surface | per-item visibility;no trace append;no raw audit/log body | 是 | EV-CAND-ID-QUERY-007 |
| TC-ID-QUERY-008 | ReadAuditTrail canonical subject | P0 | member audit subject exists or empty | call `ReadAuditTrailFlow` | returns audit entries or `Empty` | subject from `IdentityTruthChangeSubjectMapper.member_subjects`;no audit trail create | 是 | EV-CAND-ID-QUERY-008 |
| TC-ID-QUERY-009 | GetProjectionState read-only | P0 | projection state fresh/stale/rebuilding/failed/unavailable fixture | call `GetProjectionStateFlow` | returns state surface | no rebuild,mark fresh,or write UoW | 是 | EV-CAND-ID-QUERY-009 |
| TC-ID-QUERY-010 | GetReferenceResolutionState read-only | P0 | reference state and optional sidecar refs exist | call `GetReferenceResolutionStateFlow` | returns state + sidecar refs | no external resolver call;missing sidecar degrades safely | 是 | EV-CAND-ID-QUERY-010 |
| TC-ID-QUERY-011 | ReadReconciliationReport report-only | P0 | report exists or missing by scope/exact ref | call `ReadReconciliationReportFlow` | returns report page/exact report or `Missing` / `Empty` | no report generation;scope mismatch is degraded invalid material | 是 | EV-CAND-ID-QUERY-011 |
| TC-ID-QUERY-012 | ListPendingIdentityOutbox filtered | P0 | pending/retryable/by member/by trace records seeded | call `ListPendingIdentityOutboxFlow` | returns visible body-free outbox records | no publish/retry;payload marker not expanded | 是 | EV-CAND-ID-QUERY-012 |
| TC-ID-QUERY-013 | GetIdentityOutboxState exact | P0 | outbox record exists in `Published` or `RetryableFailed` | call `GetIdentityOutboxStateFlow` | returns stored outbox state | `Published` only outbound boundary;not downstream consumed | 是 | EV-CAND-ID-QUERY-013 |
| TC-ID-QUERY-014 | GetTraceHandoffState exact | P0 | handoff intent exists in `PendingHandoff` / `Delivered` / failed state | call `GetTraceHandoffStateFlow` | returns stored handoff state | `Delivered` has `HandoffReceiptRef`;query does not call delivery adapter | 是 | EV-CAND-ID-QUERY-014 |
| TC-ID-QUERY-015 | query visibility/no-write audit | P0 | write-audit fake repository installed | run all representative query flows | no query performs write side effects | no UoW mutation, idempotency reserve, trace/audit append, projection/reference repair | 是 | EV-CAND-ID-QUERY-015 |
| TC-ID-CONSUMER-001 | HandleRoleCapabilitySourceChanged accepted | P0 | envelope valid;source safe snapshot body-free | consume `RoleCapabilitySourceChangedPayload` | source snapshot/reference sidecar updated;typed receipt accepted | duplicate receipt stored;no RoleDefinition / CapabilityDefinition body | 是 | EV-CAND-ID-CONSUMER-001 |
| TC-ID-CONSUMER-002 | HandleWorkParticipationAccepted accepted | P0 | trusted work participation payload;member exists | consume `WorkParticipationAcceptedPayload` | appends career record | duplicate source no second record;no ProjectMember body | 是 | EV-CAND-ID-CONSUMER-002 |
| TC-ID-CONSUMER-003 | HandleMemoryReferenceSourceStateChanged accepted | P0 | valid memory relation/source state payload | consume `MemoryReferenceSourceStateChangedPayload` | memory relation/state/reference sidecar updated | missing relation branch follows formal quarantined/no-create rule;no memory text | 是 | EV-CAND-ID-CONSUMER-003 |
| TC-ID-CONSUMER-004 | HandleArchiveHandoffResult callback | P0 | handoff lookup resolves same memory relation;callback has formal marker | consume `ArchiveHandoffResultPayload` | relation/archive marker updated or failed safely | target mismatch rejected/quarantined;no archive package or receipt body | 是 | EV-CAND-ID-CONSUMER-004 |
| TC-ID-CONSUMER-005 | HandleTraceHandoffResult callback | P0 | handoff intent exists;callback has receipt or issue marker | consume `TraceHandoffResultPayload` | intent moves to `Delivered` or failed/cancelled state | delivered requires `HandoffReceiptRef`;duplicate callback replays receipt | 是 | EV-CAND-ID-CONSUMER-005 |
| TC-ID-CONSUMER-006 | consumer unsupported/delayed branches | P0 | unsupported schema or dependency unavailable | consume representative event | `UnsupportedVersion` or delayed/quarantined surface | payload not parsed on unsupported;no accepted marker on delayed/quarantined | 是 | EV-CAND-ID-CONSUMER-006 |

### 8.5 Outbound material / operations job 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 | 证据候选 ID |
|---|---|---|---|---|---|---|---|---|
| TC-ID-OUTBOX-001 | GlobalMemberEstablished payload snapshot | P0 | accepted establish outbox record exists | build/publish stored material | publishes `GlobalMemberEstablishedPayload` | payload has member/source/anchor/initial lifecycle markers;no account/credential/runtime body | 是 | EV-CAND-ID-OUTBOX-001 |
| TC-ID-OUTBOX-002 | IdentityAnchorChanged payload snapshot | P0 | initial or terminal anchor outbox record exists | publish anchor material | publishes `IdentityAnchorChangedPayload` | terminal anchor reason marker only;ref remains non-reusable | 是 | EV-CAND-ID-OUTBOX-002 |
| TC-ID-OUTBOX-003 | GlobalLifecycleChanged payload snapshot | P0 | lifecycle accepted outbox exists | publish lifecycle material | publishes `GlobalLifecycleChangedPayload` | reason/basis refs only;no governance basis body | 是 | EV-CAND-ID-OUTBOX-003 |
| TC-ID-OUTBOX-004 | GlobalMemberAvailabilityChanged conditional material | P0 | lifecycle transition changes derived availability | publish availability material | material exists only when old/new `is_available()` differs | establish initial available does not create extra availability material | 是 | EV-CAND-ID-OUTBOX-004 |
| TC-ID-OUTBOX-005 | role source and summary material | P0 | role summary/source accepted outbox records exist | publish role material | publishes role summary/source state payloads | no method body、definition body、evidence body、scoring body | 是 | EV-CAND-ID-OUTBOX-005 |
| TC-ID-OUTBOX-006 | career append/correction material | P0 | normal and correction career outbox records exist | publish career material | publishes append or correction payload | correction payload carries original ref;no original-superseded separate event | 是 | EV-CAND-ID-OUTBOX-006 |
| TC-ID-OUTBOX-007 | memory/archive handoff material | P0 | memory relation or archive handoff state accepted outbox exists | publish memory material | publishes memory reference or archive handoff state payload | receipt ref only marker;no memory text/archive package/adapter response | 是 | EV-CAND-ID-OUTBOX-007 |
| TC-ID-OUTBOX-008 | outbound accepted-only guard | P0 | rejected command/consumer and query/job retry fixtures | inspect outbox creation | no accepted material for rejected/query/retry-only path | only accepted command/consumer/callback transaction creates accepted material | 是 | EV-CAND-ID-OUTBOX-008 |
| TC-ID-OUTBOX-009 | PublishIdentityOutbox retryable failure | P0 | pending outbox record;publisher returns retryable issue | run `PublishIdentityOutboxFlow` | outbox `RetryableFailed`;job report partial or retryable failed | accepted truth unchanged;safe issue marker only | 是 | EV-CAND-ID-OUTBOX-009 |
| TC-ID-OUTBOX-010 | PublishIdentityOutbox permanent/unsupported failure | P0 | pending outbox record;publisher returns permanent or unsupported topic | run publish job | outbox `Failed`;job report issue | no `DeadLettered` state;no fallback topic;no truth rollback | 是 | EV-CAND-ID-OUTBOX-010 |
| TC-ID-JOB-001 | RebuildIdentityProjection completed | P0 | explicit/stale projection refs and source cursor exist | run `RebuildIdentityProjectionFlow` | selected views rebuilt;projection state success surface saved | no business truth repair;unsupported writer yields failed item | 是 | EV-CAND-ID-JOB-001 |
| TC-ID-JOB-002 | RefreshExternalReferenceState completed/partial | P0 | tracked references by scope/kind;resolver success/failure mix | run refresh job | refreshed refs and failed refs recorded | loaded bundle version used;no source version as optimistic version;no external body | 是 | EV-CAND-ID-JOB-002 |
| TC-ID-JOB-003 | RunIdentityReconciliation report-only | P0 | clean or drifted target scope | run reconciliation job | report `NoFinding` / `FindingDetected` / `Partial` / `Failed` | findings are safe refs/issues only;no remediation/truth repair | 是 | EV-CAND-ID-JOB-003 |
| TC-ID-JOB-004 | DeliverTraceHandoff delivered/retryable | P0 | pending handoff intent;delivery fake configured | run `DeliverTraceHandoffFlow` | delivered with receipt or retryable/failed with issue | `Delivered` requires attempt + receipt;failed requires attempt;unsupported target maps to cancelled | 是 | EV-CAND-ID-JOB-004 |
| TC-ID-JOB-005 | RetryIdentityPropagationFailures one family | P0 | retryable outbox and handoff fixtures | run retry job with one retry family | retries only selected family | does not combine schedule/backoff;terminal states not retried | 是 | EV-CAND-ID-JOB-005 |
| TC-ID-JOB-006 | job duplicate report replay | P0 | completed job idempotency points to stored report | rerun same job metadata/digest | `DuplicateReplayed` with stored report | no rescan, publish, rebuild, refresh, deliver or retry side effect | 是 | EV-CAND-ID-JOB-006 |
| TC-ID-JOB-007 | job invalid input rejected before mutation | P0 | malformed job scope/page/target or missing idempotency key | run representative job | entry failure or application rejection | no report unless application-level rejected report is formally allowed;no direct repository scan | 是 | EV-CAND-ID-JOB-007 |
| TC-ID-JOB-008 | maintenance job no business truth repair | P0 | write-audit fake over core truth repos | run rebuild/refresh/reconcile/publish/deliver/retry | only maintenance/propagation/report stores change | no `GlobalMember`、lifecycle、role、career、memory truth mutation | 是 | EV-CAND-ID-JOB-008 |

### 8.6 Consistency / idempotency / recovery 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 | 证据候选 ID |
|---|---|---|---|---|---|---|---|---|
| TC-ID-IDEMP-001 | operation namespace isolation | P0 | same raw idempotency key in command/event/callback/job channels | reserve each operation | records do not conflict across namespaces | conflict only within same operation name + channel + key + digest profile | 是 | EV-CAND-ID-IDEMP-001 |
| TC-ID-IDEMP-002 | duplicate stored result missing no recompute | P0 | completed idempotency record points to missing stored result | repeat command/consumer/job | replay error/degraded surface | does not rebuild result from current truth;no new mutation | 是 | EV-CAND-ID-IDEMP-002 |
| TC-ID-IDEMP-003 | consumer/callback duplicate receipt replay | P0 | accepted typed receipt envelope stored | replay same envelope | duplicate returns stored receipt | no snapshot/reference/stale/trace rewrite | 是 | EV-CAND-ID-IDEMP-003 |
| TC-ID-IDEMP-004 | job duplicate stored report replay | P0 | stored `IdentityJobRunReport` exists | rerun same job | report replayed | no relist pending/stale/retryable stores | 是 | EV-CAND-ID-IDEMP-004 |
| TC-ID-IDEMP-005 | commit unknown same key recovery | P0 | fake UoW commit returns unknown after possible durable write | retry same command key | service checks idempotency/stored result/truth before action | no blind second truth write;unknown marker/dependency surface if unresolved | 是 | EV-CAND-ID-IDEMP-005 |
| TC-ID-IDEMP-006 | stored result saved before idempotency complete | P0 | result store fails or complete fails injected | run accepted command | rollback or dependency failure | completed idempotency never points to missing result | 是 | EV-CAND-ID-IDEMP-006 |
| TC-ID-IDEMP-007 | outbox enqueue failure rolls back accepted command | P0 | outbox append / payload marker save failure | run accepted command reaching outbox append | command fails;transaction rollback | truth/history/trace/stale/result absent after rollback | 是 | EV-CAND-ID-IDEMP-007 |
| TC-ID-IDEMP-008 | projection rebuild race preserves newer state | P0 | existing view freshness has newer cursor;job holds older cursor | run rebuild replace | older replacement rejected/skipped | newer state not overwritten;failed marker does not clear newer state | 是 | EV-CAND-ID-IDEMP-008 |
| TC-ID-IDEMP-009 | reference refresh preserves last good snapshot | P0 | resolved snapshot exists;next resolver unavailable/digest mismatch | run refresh | state marked unavailable/stale/failed as designed | last good snapshot retained;affected views stale;no body persisted | 是 | EV-CAND-ID-IDEMP-009 |
| TC-ID-IDEMP-010 | handoff delivered requires formal receipt | P0 | delivery fake returns success without receipt marker | run deliver or callback | delivery not marked `Delivered` | HTTP success/request sent/adapter healthy is insufficient | 是 | EV-CAND-ID-IDEMP-010 |
| TC-ID-IDEMP-011 | rollback failure surfaces manual intervention | P0 | fake UoW rollback fails | run mutation that must rollback | returns safe consistency/dependency surface | no hidden compensating write;redacted issue only | 是 | EV-CAND-ID-IDEMP-011 |

### 8.7 Config / redaction / dependency 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 | 证据候选 ID |
|---|---|---|---|---|---|---|---|---|
| TC-ID-CONFIG-001 | P0 profile validation | P0 | `local-dev`、`ci-test`、`integration-like`、`operations-replay` config fixtures | load and validate each profile | `IdentityConfigValidationStateKind::Validated` or allowed `Degraded` | profile does not change domain invariant or command/query semantics | 是 | EV-CAND-ID-CONFIG-001 |
| TC-ID-CONFIG-002 | invalid config not assembled | P0 | config with missing required adapter or redline violation | run runtime builder | runtime assembly `Failed` or entry pre-dispatch failure | no dispatchable facade;no business rejected result saved before application | 是 | EV-CAND-ID-CONFIG-002 |
| TC-ID-CONFIG-003 | disabled adapter no fake success | P0 | resolver/publisher/handoff adapter disabled | call representative command/job | formal disabled/unavailable/degraded outcome | no accepted/published/delivered/completed default success | 是 | EV-CAND-ID-CONFIG-003 |
| TC-ID-CONFIG-004 | topic/target completeness | P0 | outbound topic or handoff target binding missing | assemble runtime or run publish/deliver | fail-fast or formal item issue | service does not invent fallback topic/target | 是 | EV-CAND-ID-CONFIG-004 |
| TC-ID-REDACTION-001 | log/report/artifact forbidden material scan | P0 | tests emit representative logs/reports/material | run forbidden material scan | scan clean | no raw body、secret、credential、endpoint raw value、adapter response、archive package | 是 | EV-CAND-ID-REDACTION-001 |
| TC-ID-REDACTION-002 | metric low-cardinality labels | P0 | metric output fixture | inspect labels | labels use finite kind/state/result/error/source family | no ref/request/actor/subject/idempotency/topic/free text as label | 是 | EV-CAND-ID-REDACTION-002 |
| TC-ID-REDACTION-003 | observability not business audit | P0 | accepted command and query flow fixture | inspect trace/audit/log split | accepted mutation writes formal trace/audit;query logs only safe diagnostics | logs/metrics cannot replace business trace/audit/outbox/stored result | 是 | EV-CAND-ID-REDACTION-003 |
| TC-ID-ARCH-001 | non-core sibling dependency guard | P0 | source dependency graph available | run dependency scan | no sibling business implementation path dependency except allowed core contracts | runtime/event collaboration via ports/refs only;no truth mixing | 是 | EV-CAND-ID-ARCH-001 |

### 8.8 场景到用例反向断言矩阵

| 测试用例 | 设计契约 | 字段 / 状态断言 | 负向条件 | 证据候选 ID |
|---|---|---|---|---|
| TC-ID-CMD-001~015 | Step 8 command DTO;Step 9 command flow;Step 10 truth state;Step 11/13 UoW/replay | command result、effect refs、outbox refs、stored result、state enum | missing metadata、policy denied、duplicate conflict、version conflict、forbidden body | EV-CAND-ID-CMD-* |
| TC-ID-QUERY-001~015 | Step 8 query DTO;Step 9 query no-write;Step 12 query priority | `IdentityQueryDisposition::{Visible,NotVisible,Missing,Empty,Degraded,StaleVisible}` | visibility denied、missing view/report/ref、stale/degraded dependency | EV-CAND-ID-QUERY-* |
| TC-ID-CONSUMER-001~006 | Step 8 inbound envelope;Step 9 consumer/callback flow;Step 13 receipt replay | typed receipt、snapshot/ref state、worker disposition | unsupported version、missing dedupe key、target mismatch、forbidden body | EV-CAND-ID-CONSUMER-* |
| TC-ID-OUTBOX-001~010 | Step 8 outbound material;Step 9 accepted-only and publish flow;Step 10 outbox state | payload marker、topic key、`OutboxStateKind` | rejected path material、publisher retryable/permanent failure、unsupported topic | EV-CAND-ID-OUTBOX-* |
| TC-ID-JOB-001~008 | Step 8 job DTO;Step 9 operations job;Step 10 job result;Step 12 job disposition | `IdentityJobResultKind`、report refs、issue refs | invalid job input、partial failure、duplicate report replay、no truth repair | EV-CAND-ID-JOB-* |
| TC-ID-IDEMP-001~011 | Step 11 transaction;Step 12 recovery;Step 13 idempotency/concurrency | idempotency state、stored result kind、commit/rollback boundary | stored missing/wrong-kind、commit unknown、race、rollback failure | EV-CAND-ID-IDEMP-* |
| TC-ID-CONFIG/REDACTION/ARCH-* | Step 14 config/runtime/adapter;Step 15 observability/redaction | config validation state、runtime assembly state、safe log/metric/audit/report material | invalid config、disabled adapter default success、forbidden material,dependency loop | EV-CAND-ID-CONFIG-* |

### 8.9 单测试切口用例停审记录

| 测试切口 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| contracts protocol / metadata / body-free | 是否覆盖 roundtrip、required metadata、unsupported version、body-free | 通过 | Step 7 补 fixture 细节 |
| domain object / policy / state | 是否覆盖 truth invariant、legal/illegal transition、terminal guard | 通过 | Step 7 补 domain builder |
| command orchestration | 是否覆盖 6 Command 主线和 common negative | 通过 | 用例采用 common negative 控制规模 |
| query no-write | 是否覆盖 14 Query 和 no-write audit | 通过 | Step 9 固定 write-audit 工具 |
| inbound consumer / callback | 是否覆盖 5 Inbound/Callback、duplicate、unsupported、delayed/body-free | 通过 | Step 7 补 envelope 数据 |
| outbound material / publish | 是否覆盖 10 material、accepted-only、publisher failure | 通过 | Step 9 固定 topic/publisher fake |
| operations job | 是否覆盖 6 Job、partial、duplicate、no truth repair | 通过 | Step 9 固定 runner/gate |
| consistency / idempotency / recovery | 是否覆盖 stored replay、commit unknown、rollback、race | 通过 | Step 7 补 fault injection 数据 |
| config / redaction / dependency | 是否覆盖 profile、runtime builder、disabled adapter、redaction、dependency | 通过 | Step 9/13 固定 scan artifact |

### 8.10 跨用例断言 / phase 审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在只测 happy path | 通过 | 每个用例批次均有负向 / 边界 / 恢复断言 |
| 是否存在 P0 需求无用例 | 通过 | Step 5 P0 覆盖项均映射到 TC 批次 |
| 是否存在状态 / 错误命名漂移 | 通过 | 使用 Step 10 / Step 12 正式名称 |
| 是否存在 phase 越界 | 通过 | 不写 P1/P2 pass、正式 EV、artifact 路径或 release verdict |
| 是否存在 query 写副作用 | 通过 | Query 批次显式 no-write audit |
| 是否存在 job truth repair | 通过 | Job 批次显式 write-audit no business truth repair |
| 是否存在 duplicate rerun | 通过 | Command/consumer/job duplicate 均要求 stored result/receipt/report replay |
| 是否存在 evidence ID 冲突 | 通过 | 仅用 `EV-CAND-ID-*` 候选,正式编号留 Step 13 |
| 是否提前编辑正式 `05-测试方案.md` | 通过 | 本 Step 只写 `design-calibration` |

## 9. 对上游设计的影响判定

| 用例结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| P0 用例均可从 `03` / `04` 找到正式契约 | 否 | 测试方案细化 | 无需回写 |
| 用例 ID 已按候选形式分配 | 否 | 测试方案内部编号 | Step 15 装配正式 `05` 时可保留或微调 |
| Evidence 仍是候选 ID | 否 | SOP 分工 | Step 13 固定正式 evidence |
| write-audit / scan / fake fault injection 需要测试工具 | 否 | 自动化实现需求 | Step 7/9 继续设计数据和 gate |
| 若 Step 7 发现某 TC 无法构造数据 | 是 | 可验证性缺口 | 回写 `03` 或记录 blocker |
| 若 Step 9 发现某 TC 无自动化产面 | 是 | 测试执行闭环缺口 | 回写 Step 9 / Step 13 或记录风险 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_06_cases.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“用例批次表”“Command 用例矩阵”“Query / inbound consumer 用例矩阵”“Outbound material / operations job 用例矩阵”“Consistency / idempotency / recovery 用例矩阵”和“跨用例断言 / phase 审计表”小节,了解测试场景如何落成可执行用例。

正式 `05-测试方案.md` §6 应回填:

- 测试用例必须按测试切口组织,不得生成无归属的大表。
- P0 用例覆盖 contracts/domain/state、6 Command、14 Query、5 Inbound/Callback、10 Outbound Material、6 Operations Job、一致性/幂等/恢复、配置/redaction/dependency。
- 每个用例必须有前置条件、输入 / 操作、预期结果、断言点、自动化候选和候选证据 ID。
- Query 用例必须断言 no-write;Job 用例必须断言 no business truth repair;duplicate 用例必须断言 stored result/receipt/report replay。
- 正式 evidence ID、artifact 路径、CI suite 和 release verdict 由 Step 9 / Step 13 / 新版 `06` 固定,本章只保留候选证据。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 7 需要为每个 TC 批次设计 fixture / builder / fault injection | 影响用例可执行性 | 下一步按用例批次设计数据 |
| query no-write 和 job no-repair 需要 write-audit helper | 影响自动化断言 | Step 9 固定工具或脚本 |
| forbidden material scan 需要统一扫描对象 | 影响 redaction evidence | Step 9/13 固定 artifact/report 产面 |
| 候选 TC / EV 命名是否最终保留 | 影响正式 `05` / evidence index | Step 13/15 前可微调,但不改变覆盖关系 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 用例可执行、可断言、可留证 | 通过 | 当前每个 TC 有前置、输入、预期、断言和候选证据 |
| 每个 P0 测试切口用例已停审 | 通过 | 见 §8.9 |
| 跨用例审计无 unresolved 冲突 | 通过 | 见 §8.10 |
| 正式 `05` 未提前改写 | 通过 | 本 Step 只写 `design-calibration` 中间产物 |
| 可进入 Step 7 | 待用户确认 | 用户审核通过后进入 Step 7: 设计测试数据 |
