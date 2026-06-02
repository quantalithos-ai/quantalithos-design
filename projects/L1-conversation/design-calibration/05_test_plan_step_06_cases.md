# L1-conversation 05 测试方案 Step 6: 设计测试场景与用例矩阵

> 所属流程: `05_test_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/05-测试方案.md` §6 测试场景与用例设计
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 6 |
| 主题 | 设计测试场景与用例矩阵 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/05_test_plan_step_06_cases.md` |

本步把 Step 5 的追溯矩阵落成可执行、可断言的测试用例。测试数据、fixture、环境矩阵、CI 门禁和证据编号仍分别留给 Step 7、Step 8、Step 9 和 Step 13。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `05_test_plan_step_05_traceability_matrix.md` | FR / BR / NFR 覆盖矩阵 | 作为用例分组和优先级来源 |
| `03_ddd_step_08_protocol_contracts.md` | Command / Query / Consumer / Event / Job 协议、错误映射和构造闭环 | 作为接口用例来源 |
| `03_ddd_step_09_function_flows.md` | 每个 flow 的事务、幂等、outbox 和状态副作用 | 作为正向、回滚和恢复用例来源 |
| `03_ddd_step_10_state_matrix.md` | 正式状态 enum 和非法转换 | 作为状态断言来源 |
| `03_ddd_step_12_error_recovery.md` | `ProtocolError`、`ApplicationError`、`DomainError`、`JobError` 和恢复口径 | 作为负向断言来源 |
| `03-详细设计.md` §15 | 最小验证切口和脚本输出规则 | 作为 P0 用例下限 |

## 3. SOP 问题回答

### 3.1 每个 P0 正向主线怎么执行?

P0 正向主线按“create space / scope -> append fact -> authorized query -> manifest external fact -> trace / handoff -> outbox publish -> projection / cursor maintenance -> report”执行。每段主线都必须断言正式对象状态、outbox 或 job receipt,不能只断言接口成功返回。

### 3.2 每个关键反向和边界场景如何触发?

反向场景通过缺少 envelope 必填字段、重复幂等键、同 key 不同 digest、sealed visibility 扩张、forbidden body、source unresolved、digest mismatch、invalid cursor、invalid event envelope、publish failure、handoff failure 和 unsupported profile 触发。

### 3.3 每个状态非法迁移如何断言?

非法迁移必须断言 `DomainError::InvalidStateTransition`、`DomainError::BoundaryViolation`、`ApplicationError::Conflict` 或对应 job failed marker。不得用 panic 或旧口语状态断言。

### 3.4 每个事务回滚和副作用如何验证?

Command 写流必须注入 outbox enqueue failure 或 repository failure,断言 truth、trace、receipt、outbox 和 idempotency complete 同事务回滚。Outbox publish、handoff delivery、projection rebuild 失败不得回滚已提交 truth,只能推进 `RetryPending`、`Failed`、`Stale` 或 job receipt。

### 3.5 每个恢复场景如何复现?

恢复场景通过 fake publisher、fake resolver、fake handoff、in-memory repository failure injection 和 job rerun 构造。重跑必须使用同一 `IdempotencyKey`、`JobRunId`、event id 或 outbox id,断言 existing result、retry refs、failed refs 或 report ref。

### 3.6 每个用例预期结果引用了哪些正式字段、状态、错误或事件?

用例矩阵中的预期结果必须引用 `ConversationTruthState`、`ConversationSpaceLifecycleState`、`VisibilityScopeState`、`ConversationFactState`、`ManifestationState`、`ReferenceResolutionState`、`ProjectionFreshnessState`、`ConversationOutboxPublicationState`、`TraceHandoffState`、`ArchiveHandoffState`、正式 event 名和正式 error 名。

### 3.7 是否存在把后续 phase 状态或证据提前写入当前用例的问题?

本步允许生成 TC ID,但不生成证据 ID。所有证据列写为“待 Step 13”。P1 真实 DB、真实 broker、真实 resolver、真实 handoff endpoint、production-like 和 hot reload 不作为本步 P0 通过条件。

## 4. 当前文档问题诊断

| 文档 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧用例围绕 Turn / stream,不适配新版协议和状态矩阵 | 不继承旧用例 |
| Step 5 | 已有覆盖关系,但没有可执行输入和断言点 | 本步生成 TC 矩阵 |
| `03` Step 8 / Step 9 | 接口和 flow 很完整,但测试方案还需按业务主线重排 | 本步按 P0 闭环与风险主线聚合 |
| `03` Step 10 / Step 12 | 状态和错误已正式化 | 本步全部使用正式状态和错误名 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 测试场景 | 只有覆盖族 | 每个族落成可执行 TC |
| 断言点 | 容易写“接口成功” | 明确字段、状态、错误、event、outbox、job receipt |
| 负向测试 | 分散在详细设计 | 收敛为 P0-blocking 和 gate negative 用例 |
| 证据 ID | 未定义 | 明确留给 Step 13 |

## 6. 测试设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 用例粒度 | 每个协议一个正向和负向全量展开 | 按 P0 风险主线展开,再用接口覆盖表兜底 | B | 可执行且不把 Step 6 写成超长清单 |
| Query 用例 | 只测 read model | 覆盖 read model、fact、cursor、search、trace、projection marker | B | 授权消费是核心闭环 |
| Consumer 用例 | 只测合法事件 | 合法、duplicate、invalid envelope、forbidden body 都测 | B | 防止来源事件污染 truth |
| Job 用例 | 只测成功 | 成功、partial failure、rerun、no auto repair 都测 | B | 维护动作不能修写真相 |
| 证据 ID | 本步生成 | Step 13 生成 | B | 证据编号依赖报告归档结构 |

## 7. 结构化中间产物

### 7.1 测试场景总表

| 场景组 | 覆盖需求 / 规则 | 主要协议 / flow | 核心断言 | 自动化候选 |
|---|---|---|---|---|
| Space / scope truth | FR001; BR001 / 013 / 020 | `CreateConversationSpace`、`CloseConversationSpace`、`UpdateParticipantScope`、`UpdateVisibilityScope` | `ConversationTruthState`、`ConversationSpaceLifecycleState`、`VisibilityScopeState`、outbox | CI unit + service + API |
| Fact append truth | FR002; BR002 / 014 / 020 | `AppendConversationFact`、`RetractConversationFact`、runtime / bridge consumer | `ConversationFactState`、`FactAppendResult`、trace、append-only | CI service + gate |
| Authorized consumption | FR003; BR003 / 018 | 11 个 Query API | `ApplicationError::NotVisible`、stale marker、query no-write | CI query + contract |
| Cross-domain manifestation | FR004; BR004 / 015 / 017 / 019 | `ManifestExternalFact`、source consumers、snapshot refresh job | `ManifestationState`、`ReferenceResolutionState`、source body absent | CI service + integration |
| Trace / handoff | FR005; BR005 / 020 | `CreateReviewAnchor`、`RequestTraceHandoff`、`RequestArchiveHandoff`、handoff jobs | `TraceHandoffState`、`ArchiveHandoffState`、payload ref-only | CI service + job |
| Derived views / search / cursor | FR006 / 007 / 008; BR016 / 021 | projection rebuild、search rebuild、cursor maintenance、change polling | `ProjectionFreshnessState`、cursor no regress、no auto repair | CI + operations-replay |
| Outbox / event collaboration | FR008; NFR003 / 009 | 9 outbound events、`PublishConversationOutbox` | `ConversationOutboxPublicationState`、duplicate event id、retry / failed | CI worker + job |
| Configuration / redaction / evidence | NFR006 / 011 / 012 | config validator、gate / report / redaction check scripts | strict redaction、path shape、fake-as-production reject | release gate |

### 7.2 P0 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 |
|---|---|---|---|---|---|---|---|
| TC-CONV-SPACE-001 | 创建对话空间主线 | P0-blocking | actor、owner、participant refs 有效 | `CreateConversationSpace` with `CommandMetadata` + `IdempotencyKey` | 创建 space / scope / visibility,写 `ConversationSpaceChangedEvent` outbox | `ConversationTruthState::Open`; `ConversationSpaceLifecycleState::Active`; `VisibilityScopeState::Open`; outbox `Pending` | CI service + API |
| TC-CONV-SPACE-002 | 创建缺少幂等键拒绝 | P0-blocking | 无 | `CreateConversationSpace` missing `idempotency_key` | 请求拒绝,不写 truth / outbox | `ProtocolError::MissingRequiredField`; no `ConversationSpace` | CI contract |
| TC-CONV-SPACE-003 | 关闭后再次打开拒绝 | P0-blocking | space 已 `Closed` | 触发 `Closed -> Open` 或 append reopen | 非法状态转换拒绝 | `DomainError::InvalidStateTransition`; no outbox | CI domain |
| TC-CONV-SCOPE-001 | visibility 收紧并标记派生陈旧 | P0-blocking | space active,read model fresh | `UpdateVisibilityScope` narrow visibility | visibility 更新,read model / cursor stale,scope changed outbox | `VisibilityScopeState::Restricted`; `ProjectionFreshnessState::Stale`; `ConversationScopeChangedEvent` | CI service |
| TC-CONV-SCOPE-002 | sealed visibility 扩张拒绝 | P0-blocking | visibility `Sealed` | `UpdateVisibilityScope` expand visibility | 拒绝,不改变 read model | `DomainError::InvalidStateTransition`; visibility expansion denied evidence 待 Step 13 | CI domain + service |
| TC-CONV-FACT-001 | 追加协作事实主线 | P0-blocking | space active,actor visible | `AppendConversationFact` with `payload_ref` | fact、receipt、trace、outbox 同事务提交 | `ConversationFactState::Accepted`; `FactAppendResult::Accepted`; `ConversationFactAppendedEvent` | CI service + API |
| TC-CONV-FACT-002 | 重复 append 返回已有 receipt | P0-blocking | TC-CONV-FACT-001 已提交 | same `IdempotencyKey` + same digest | 返回已有 result,不新增 fact / outbox | existing `FactAppendReceipt`; outbox count unchanged | CI service |
| TC-CONV-FACT-003 | 同幂等键不同 digest 冲突 | P0-blocking | idempotency key 已占用 | same key + different request digest | 冲突拒绝 | `IdempotencyError::Conflict`; no new fact | CI service |
| TC-CONV-FACT-004 | forbidden body 不得落库 | P0-blocking | runtime / bridge 输入包含正文 | `AppendConversationFact` 或 consumer 带 reasoning / platform body | 拒绝或 quarantine,不写 truth / log / event | `DomainError::SourceTruthViolation` or `BoundaryViolation`; redaction check later | CI gate |
| TC-CONV-FACT-005 | 撤回 fact 主线 | P0-blocking | fact `Accepted` 且 actor authorized | `RetractConversationFact` | fact 进入撤回状态,trace 保留,outbox 生成 | `ConversationFactState::Retracted`; `ConversationFactRetractedEvent` | CI service |
| TC-CONV-TX-001 | command outbox enqueue failure 回滚 | P0-blocking | fake outbox repo 可注入失败 | append / create 时 outbox enqueue fails | truth、trace、receipt、idempotency complete 均回滚 | no committed fact / scope; `RepositoryError` or `TransactionError` | CI repository + service |
| TC-CONV-QUERY-001 | 授权读取 read model | P0-blocking | visible consumer,read model exists | `GetConversationReadModel` | 返回裁剪后的 authorized view | no forbidden body; query no-write | CI query |
| TC-CONV-QUERY-002 | 未授权读取拒绝 | P0-blocking | consumer 不在 visibility scope | 任一 Query API 读取 hidden fact | 返回 403 或 empty authorized view | `ApplicationError::NotVisible`; no audit secret | CI query + gate |
| TC-CONV-QUERY-003 | stale projection 只暴露 marker | P0-blocking | projection `Stale` or `Failed` | `GetConversationProjectionState` / read model query | 返回 stale / failed marker,不 rebuild | `ProjectionFreshnessState::Stale` or `Failed`; query no-write | CI query |
| TC-CONV-QUERY-004 | cursor 不可恢复 | P0-blocking | cursor `Expired` or `Invalidated` | `PollConversationChanges` with old cursor | 拒绝或要求 reset | `ApplicationError::CursorNotResumable`; no cursor advance | CI query |
| TC-CONV-SEARCH-001 | 授权搜索只返回 refs | P0-supporting | search index fresh | `SearchConversationHistory` | 返回 visible refs / fragments,不返回 forbidden body | visibility filter applied; payload body absent | CI query + redaction |
| TC-CONV-MAN-001 | 跨域事实显化主线 | P0-blocking | source resolver 返回 safe snapshot | `ManifestExternalFact` | manifestation / snapshot / optional fact / outbox 提交 | `ManifestationState::Manifested`; `ReferenceResolutionState::Fresh`; `CrossDomainManifestationChangedEvent` | CI service |
| TC-CONV-MAN-002 | 来源不可解析不补造 truth | P0-blocking | resolver returns unresolved | `ManifestExternalFact` or refresh job | 写 unresolved marker,不写来源正文 | `ReferenceResolutionState::Unresolved`; `ResolverError`; source body absent | CI integration |
| TC-CONV-MAN-003 | digest mismatch 记录 evidence | P0-blocking | snapshot digest 与 source digest 不一致 | `RefreshExternalReferenceSnapshots` | 标记 unresolved / mismatch,不覆盖旧 truth | `DomainError::DigestMismatch`; digest evidence 待 Step 13 | CI job |
| TC-CONV-CONSUMER-001 | runtime 结果事实入库 | P0-blocking | valid inbound envelope | `ConsumeRuntimeResultCommitted` with result ref only | 追加 fact、trace、outbox | `ConversationFactState::Accepted`; `ConversationFactAppendedEvent` | CI worker |
| TC-CONV-CONSUMER-002 | inbound envelope 缺字段 quarantine | P0-blocking | invalid event envelope | any consumer missing event id / source ref / idempotency key | quarantine,不写 truth | `ProtocolError::InvalidEnvelope`; quarantine evidence 待 Step 13 | CI worker |
| TC-CONV-CONSUMER-003 | bridge 平台正文拒绝 | P0-blocking | bridge event contains platform body | `ConsumeBridgeMappedFactReceived` | 拒绝或 quarantine,不写 body | `DomainError::SourceTruthViolation`; redaction gate | CI worker + gate |
| TC-CONV-TRACE-001 | 创建 review anchor | P0-blocking | visible target fact / manifestation | `CreateReviewAnchor` | anchor 保存,trace context 可读,outbox 生成 | `ReviewAnchor` target visible; audit trace present | CI service |
| TC-CONV-HANDOFF-001 | 请求 trace handoff | P0-blocking | trace context exists | `RequestTraceHandoff` | 创建 pending handoff,outbox 生成 | `TraceHandoffState::Pending`; `TraceHandoffRequestedEvent` | CI service |
| TC-CONV-HANDOFF-002 | trace handoff retry / failed 不改 fact | P0-blocking | pending handoff,fake handoff fails | `DeliverTraceHandoff` | handoff 进入 retry 或 failed,fact truth 不变 | `TraceHandoffState::RetryPending` or `Failed`; fact state unchanged | CI job |
| TC-CONV-HANDOFF-003 | archive handoff 只保存 package ref | P0-blocking | archive handoff pending | `DeliverArchiveHandoff` success | handoff archived,只保存 package ref | `ArchiveHandoffState::Archived`; archive package body absent | CI job + redaction |
| TC-CONV-OUTBOX-001 | 发布 outbox 成功 | P0-blocking | outbox `Pending` | `PublishConversationOutbox` with fake publisher success | 状态转 published,记录 published ref | `ConversationOutboxPublicationState::Published`; event id stable | CI job |
| TC-CONV-OUTBOX-002 | 发布失败进入 retry / failed | P0-blocking | fake publisher failure | `PublishConversationOutbox` | truth 不回滚,outbox 进入 retry 或 failed | `RetryPending` or `Failed`; published count / failed count correct | CI job |
| TC-CONV-OUTBOX-003 | publish rerun 不重复事件 | P0-blocking | publish succeeded but state write failed once | rerun same outbox id | 不重复 publish 或使用同 event id 补状态 | stable event id; no duplicate downstream record | CI job |
| TC-CONV-DERIVED-001 | 重建 read model 不修写真相 | P0-supporting | facts and manifestations exist | `RebuildConversationReadModels` | read model fresh,truth unchanged | `ProjectionFreshnessState::Fresh`; fact count unchanged | CI job |
| TC-CONV-DERIVED-002 | search rebuild 失败暴露 failed marker | P0-supporting | fake index failure | `RebuildConversationSearchIndex` | projection failed,query 暴露 failed marker | `ProjectionFreshnessState::Failed`; report ref later | CI job + query |
| TC-CONV-CURSOR-001 | cursor 前进且不倒退 | P0-blocking | committed outbox sequence exists | `MaintainConversationChangeCursors` | cursor only advances | no `DomainError::SequenceRegression`; stale on outbox gap | CI job |
| TC-CONV-CONSISTENCY-001 | consistency validation 只报告不修复 | P0-blocking | 构造 read model 缺失 | `ValidateConversationConsistency` | 输出 issue count / suggested repair refs,不修写真相 | report ref later; no fact / projection auto repair | operations-replay |
| TC-CONV-CONFIG-001 | unsupported profile fail-fast | P0-blocking | config contains unsupported profile | start api / worker / job | 启动失败,不构造 runtime | config validation failure; no runtime graph | CI config |
| TC-CONV-REPORT-001 | evidence path shape 固定 | P0-blocking | run id available | run gate / report scripts | 产物写入 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>` | no `<project>` layer; failure summary on non-zero | release gate |
| TC-CONV-REDACTION-001 | redaction check 命中失败 | P0-blocking | artifact / report 含 raw secret 或 forbidden body | `scripts/checks/check_redaction.sh` | 非 0 退出,保留 failure summary | raw secret / raw payload detected; evidence ID 待 Step 13 | release gate |

### 7.3 契约断言矩阵

| 测试用例 | 设计契约 | 字段 / 状态断言 | 负向条件 | 证据 ID |
|---|---|---|---|---|
| TC-CONV-SPACE-* | Step 8 `CreateConversationSpace` / Step 9 `CreateConversationSpaceFlow` / Step 10 truth and space states | `CommandMetadata`、`IdempotencyKey`、`ConversationTruthState::Open`、`ConversationSpaceLifecycleState::Active` | missing field、duplicate key、invalid state、outbox rollback | 待 Step 13 |
| TC-CONV-SCOPE-* | Step 8 scope commands / Step 10 `VisibilityScopeState` | `VisibilityScopeState::Restricted` / `Sealed`、`ConversationScopeChangedEvent` | sealed expansion、projection save failure | 待 Step 13 |
| TC-CONV-FACT-* | Step 8 fact commands / Step 9 fact flows / Step 13 idempotency | `ConversationFactState::Accepted` / `Retracted`、`FactAppendResult`、`ConversationFactAppendedEvent` | forbidden body、same key conflict、outbox failure | 待 Step 13 |
| TC-CONV-QUERY-* | Step 8 query APIs / Step 9 query flows | consumer context、visibility filter、`ProjectionFreshnessState` marker | `ApplicationError::NotVisible`、`InvalidQuery`、cursor expired | 待 Step 13 |
| TC-CONV-MAN-* | Step 8 manifestation / consumer / job contracts | `ManifestationState`、`ReferenceResolutionState`、safe snapshot ref | unresolved、digest mismatch、source body present | 待 Step 13 |
| TC-CONV-CONSUMER-* | Step 8 inbound consumer contracts | event id、source ref、idempotency key、quarantine marker | `ProtocolError::InvalidEnvelope`、duplicate、forbidden body | 待 Step 13 |
| TC-CONV-HANDOFF-* | Step 8 handoff command / jobs / Step 10 handoff states | `TraceHandoffState`、`ArchiveHandoffState`、payload ref-only | missing trace、retention reject、handoff failure | 待 Step 13 |
| TC-CONV-OUTBOX-* | Step 8 outbound events / Step 9 publish flow | `ConversationOutboxPublicationState::Published` / `RetryPending` / `Failed` | publish failure、duplicate event id、state conflict | 待 Step 13 |
| TC-CONV-DERIVED-* | Step 9 jobs / Step 10 projection and cursor states | `ProjectionFreshnessState`、cursor sequence、report ref | rebuild failure、sequence regression、auto repair attempt | 待 Step 13 |
| TC-CONV-CONFIG-* / REPORT-* / REDACTION-* | `04` §7 / §11 / §12 and `03` §15 scripts | strict redaction、path shape、run id、failure summary | unsupported profile、raw secret、extra project layer | 待 Step 13 |

### 7.4 后续 phase 防提前写入检查

| 检查项 | 结论 |
|---|---|
| 是否生成证据 ID | 否,统一待 Step 13 |
| 是否定义 fixture / seed 细节 | 否,留给 Step 7 |
| 是否定义环境矩阵 | 否,留给 Step 8 |
| 是否定义 CI 命令和门禁顺序 | 否,留给 Step 9 |
| 是否把 P1 真实外部依赖作为 P0 通过条件 | 否 |
| 是否使用旧状态名或旧 Turn / stream 主线 | 否 |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §6 时摘录。

```markdown
## 6. 测试场景与用例设计

> 校准来源：
> - `design-calibration/05_test_plan_step_06_cases.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“SOP 问题回答”“测试场景总表”“P0 用例矩阵”和“契约断言矩阵”小节，了解每个 P0 场景如何从详细设计协议、处理流、状态矩阵和错误恢复口径落成可执行用例。

本轮 P0 用例按 space / scope truth、fact append truth、authorized consumption、cross-domain manifestation、trace / handoff、derived views / search / cursor、outbox / event collaboration、configuration / redaction / evidence 八组组织。所有 P0-blocking 用例必须有明确输入、预期状态、错误或 event 断言,不得只写“执行接口,看是否成功”。

用例 ID 采用 `TC-CONV-<GROUP>-NNN`。证据 ID 不在本章生成,由 Step 13 按 reports / artifacts 结构统一编号。
```

## 9. 待确认事项

无阻塞进入 Step 7 的待确认事项。

后续 Step 必须继续收口:

- Step 7 必须为本步每组用例定义 fixture / builder / seed 和隔离键。
- Step 8 必须把本步 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 用例放入环境矩阵。
- Step 9 必须把 P0-blocking 用例纳入 CI / release gate。
- Step 13 必须为本步所有 evidence placeholder 生成正式证据编号和归档路径。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 用例可执行 | 通过 | 每个用例都有前置条件和输入 / 操作 |
| P0 用例可断言 | 通过 | 每个用例都有正式状态、错误、event 或 path 断言 |
| P0 用例可留证 | 通过 | 证据类别已保留,ID 留给 Step 13 |
| 未提前写入后续 phase | 通过 | 数据、环境、门禁、证据编号均未提前固化 |
| 可以进入 Step 7 | 通过 | 下一步设计测试数据 |
