# L2-tools 03 详细设计 Step 16: 测试切口与最小验证清单

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 16
> 对应正式章节: `03-详细设计.md` §15
> 状态: completed / pass
> 模式: full-restart / single-agent-serial
> 说明: 本文件只定义可落码的最小测试切口，不声明实现、测试执行、覆盖率、run_id、artifact、evidence 或验收结果。

## 0. Step 开工确认

| 项目 | 结论 |
|---|---|
| 前序门禁 | Step 15 `completed / pass`; 日志、指标、TraceContext、ToolAuditEntry 原子性、redaction 与 forbidden-field 规则已收口。 |
| 直接输入 | Step 5~15 全部中间产物；正式 02 的七模块、41 对象、`13/11/5/4/4` public surface。 |
| 本步目标 | 为实现者和后续 `05-测试方案.md` 提供模块、协议、状态、事务、并发、错误、配置和观测的最小验证入口。 |
| 本步边界 | 不编写完整测试方案、TC 编号体系、优先级、覆盖率阈值、fixture 全集、CI 排期、真实外部联调或测试报告。 |
| 实现仓状态 | `/home/aris/Projects/quantalithos-tools` 当前不存在；不得声称已有源码、Cargo、脚本、构建或测试。 |
| 上游 blocker | `L2T-UP-001~009` 继续开放；测试必须验证 blocked/unavailable/unknown 负路径，不得验证未闭口的外部正向 readiness。 |

## 1. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个模块至少需要哪些单元测试？ | `contracts` 验证 DTO、typed ref、metadata、view、receipt、report、error 的字段/版本/roundtrip；`domain` 验证六业务组成部分对象 factory、不变量、状态和 policy；`application` 验证 13 Command、11 Query、5 Consumer、4 outbound continuation、4 Job 的编排、UoW、幂等和错误映射；`infra` 验证 Store/Port adapter、CAS、semantic uniqueness、fake/durable parity、builder/config；`api` 验证 metadata/body validation、mapping、redaction；`worker` 验证 envelope、dedup、blocked continuation 和 projection lifecycle；`jobs` 验证 bounded slice、cursor/watermark、partial report 和 no-truth-repair。 |
| 每个接口至少需要哪些正向和异常测试？ | 每个 Command 至少覆盖 accepted、invalid/domain reject、duplicate replay、same-key-different-digest、version/unique conflict；每个 Query 至少覆盖 readable hit、missing/not-visible、stale/rebuilding/unavailable/failed 和 no-write；每个 Consumer 至少覆盖 accepted、duplicate、unsupported version、rejected/quarantined/blocked；每个 outbound continuation 至少覆盖 local attempt mapping、duplicate/prepared、route blocked、local failure、unknown；每个 Job 至少覆盖 completed、duplicate report replay、invalid bounded input、partial failure 和 dependency blocked。 |
| 状态机合法和非法转换如何测试？ | 以 Step 10 六个状态族附录的正式 enum、触发函数和转换矩阵为唯一真相源。每个状态族至少覆盖一条主线合法迁移、一条边界合法迁移和一条非法迁移；非法迁移必须返回指定 typed error，并断言没有 accepted truth、history、audit、outbox、projection repair 或 stored success result。 |
| 事务、一致性、幂等和并发如何验证？ | 使用 fake/in-memory Store、UoW、IdempotencyStore、Clock、IdGenerator、resolver、handoff/collaboration Port；注入 version/unique conflict、rollback、commit unknown、side-effect unknown、same/different digest、duplicate delivery、cursor/watermark race 和 partial Job，检查写入顺序及 no-write 边界。 |
| 哪些细节留给 05？ | 具体用例编号、测试优先级、fixture/生成器目录、运行命令、真实 durable backend/broker/provider 联调、CI 分层、报告模板、artifact/evidence 命名和执行排期留给 `05-测试方案.md` 及后续文档。 |

## 2. 当前材料诊断与设计取舍

### 2.1 Historical material / conflict audit

| 材料 | 发现 | 处理 |
|---|---|---|
| 旧正式 `03/05/06` 与 README | 可能包含 HTTP/RPC、数据库、Broker、executor、registry 或“已完成测试”口径。 | 标记为 `historical_material`; 不作为测试 fixture、实现或结果来源。 |
| Step 9 flow annexes | 每条 flow 已给出 callable、Store/Port、UoW、state、error、replay 提示，但测试入口分散。 | 本步建立统一的 per-flow positive/negative/no-write/duplicate cut。 |
| Step 10 state annexes | 六状态族已给出合法/非法迁移和错误，但没有统一的测试回指表。 | 本步按状态族列合法、边界和非法断言。 |
| Step 11~13 | 事务、CAS、semantic uniqueness、commit/call unknown 和 23 个 `L2T-CONC-*` 切口分散。 | 原样保留 canonical IDs，补充模块和断言层映射，不改 key/digest 语义。 |
| Step 14~15 | 配置、adapter availability、redaction、低基数 metric 和审计原子性已有规则。 | 将其转为可观察的 contract predicate，不宣称 backend 或脚本已存在。 |

### 2.2 设计取舍

| 议题 | 选择 | 原因 |
|---|---|---|
| 详细设计是否写完整测试计划 | 只写最小切口 | 保持 §15 与 `05-测试方案.md` 边界。 |
| 接口粒度 | 每个 `CF/QF/IF/OF/JF` 独立列出 | 实现者不能用模块摘要替代关键协议的正反向覆盖。 |
| 状态粒度 | 合法、边界、非法都列出 | 非法转换和 terminal fence 是实现安全边界。 |
| duplicate | 回放 immutable stored surface | 与 Step 11/13 一致，禁止从 mutable current truth 重算。 |
| external positive path | 以 blocked/unavailable/unknown 为当前可验证分支 | `L2T-UP-001~009` 未闭口，不能伪造 provider/schema/route readiness。 |
| 脚本 | 仅记录 planned contract | Step 4 已规定 scripts/artifacts/reports 延后由 05/06/07 承接；本仓暂无脚本。 |

## 3. 测试层级与公共断言

### 3.1 测试层级

| 层级 | 允许依赖 | 必须证明 | 不得证明 |
|---|---|---|---|
| contract unit | `contracts` public types、纯 canonical mapper | required field、版本、enum、typed ref、body-free roundtrip | transport/backend/provider readiness |
| domain unit | domain factory/policy/state、显式 time/ID | invariant、合法/非法 transition、terminal uniqueness、四门安全判定 | Store/Port I/O、外部 owner truth |
| application service | fake Store/UoW/Port/clock/id | call order、UoW、idempotency、error mapping、no-write/replay | durable backend 性能或外部实际投递 |
| adapter contract | fake 与计划中的 durable adapter interface | mapping、CAS、semantic key、redaction、blocked/unavailable parity | provider delivered/observed/readiness |
| entry contract | api/worker/jobs facade | metadata/body/envelope/job validation 和 protocol mapping | 固定 HTTP/RPC/broker/scheduler 实现 |
| cross-module contract | 七模块公开 seam | DTO -> object -> port -> flow -> state -> result 闭环 | 未定义的 sibling client 或新业务 owner |

### 3.2 公共 invariant 断言

每个适用测试都应优先断言以下 typed predicate，而不是匹配自由文本：

| Predicate | 最小断言 |
|---|---|
| metadata authority | actor/request/correlation/trace/idempotency/time 只来自相应 metadata/envelope；body 重复或缺失按 validation error 处理。 |
| body-free | log/span/metric/audit/result/error/report/receipt 不含 raw body、prompt、capture、provider response、secret、credential 或 stack trace。 |
| local truth | accepted 只在本地 UoW commit confirmed 后返回；commit unknown 不返回 accepted。 |
| duplicate | same scope/key/digest 只读取 immutable stored result/receipt/report；不再调用 domain transition、Port、projection write 或 audit append。 |
| digest conflict | same key/different digest 返回 typed conflict；不进入 domain、不写新事实。 |
| query no-write | Query 不开写 UoW、不写 idempotency/audit/outbox/projection/reference/gap、不调 external Port。 |
| job no-truth-repair | Job 只写 assessment/ref/gap/projection/report/status marker，不修 Contract/Binding/Invocation/Outcome/Audit。 |
| external boundary | local attempt/ref/unknown 不升级为 delivered、observed、executed、capture、DLQ 或 readiness。 |
| atomic pair | `ToolInvocationOutcome` 与 `ToolAuditEntry` 只能通过 `OutcomeAuditStore::insert_outcome_audit_pair` 同一 UoW 成对存在。 |

## 4. 七模块测试切口

| 测试切口 | 对应模块/契约 | 验证内容 | 建议类型 |
|---|---|---|---|
| `L2T-MOD-CON-001` | `contracts` shared refs | typed ID/ref 构造、scope 对称、空值和非法组合拒绝 | contract unit |
| `L2T-MOD-CON-002` | `contracts` metadata | Command/Query/Envelope/Job metadata 必填、authority 唯一来源、TraceContext 缺失拒绝 | contract unit |
| `L2T-MOD-CON-003` | `contracts` protocol DTO | `13/11/5/4/4` request/response/envelope/report roundtrip、version/unknown variant | contract unit |
| `L2T-MOD-CON-004` | `contracts` view surface | missing/not-visible/empty/stale/rebuilding/unavailable/failed view 不坍缩为 empty success | contract unit |
| `L2T-MOD-CON-005` | `contracts` error/result | ProtocolError 分类、retry hint、safe refs-only payload、stored result symmetry | contract unit |
| `L2T-MOD-DOM-001` | `domain` 41 objects | factory 所需字段、owner/invariant、显式 clock/ID、禁止 raw body | domain unit |
| `L2T-MOD-DOM-002` | contract/binding policy | revision/source/mode symmetry、compatibility impact、binding replacement/invalidating guards | domain unit |
| `L2T-MOD-DOM-003` | invocation/precondition | canonical invocation、context sufficiency、requirement classification、admission/no-execution outcome | domain unit |
| `L2T-MOD-DOM-004` | outcome/safe handoff | source assessment、outcome/result/error symmetry、four-gate eligibility、event material mapping | domain unit |
| `L2T-MOD-DOM-005` | integrity/derived | validity/gap/report/freshness transition guards、watermark monotonicity | domain unit |
| `L2T-MOD-APP-001` | application command facade | accepted/rejected/blocked/error order、UoW participation、stored typed result | service/fake |
| `L2T-MOD-APP-002` | application query facade | all 11 Query read paths and no-write call spy | service/fake |
| `L2T-MOD-APP-003` | consumer service | envelope validation, source isolation, dedup, receipt and CF-11 re-entry boundary | service/fake |
| `L2T-MOD-APP-004` | continuation service | material/event/target symmetry, phase-1/2 attempt fence, one Port call and unknown preservation | service/fake |
| `L2T-MOD-APP-005` | job service | bounded target plan, per-target UoW, cursor/watermark, partial report, duplicate report replay | service/fake |
| `L2T-MOD-APP-006` | application errors/recovery | domain/Store/Port/UoW errors map to Step 12 stable classes and recovery owners | service/fake |
| `L2T-MOD-INF-001` | seven logical Stores | `Loaded<T>.expected_version`, page cursor/scope digest, semantic uniqueness, missing/result symmetry | adapter contract |
| `L2T-MOD-INF-002` | UoW manager | begin/commit/rollback ordering, atomic outcome/audit pair, commit-known/unknown and resolve path | adapter contract |
| `L2T-MOD-INF-003` | idempotency/clock/id | scoped key/digest, deterministic fake clock/ID, generated IDs excluded from digest | adapter contract |
| `L2T-MOD-INF-004` | external adapter seams | blocked/unavailable/unsupported/conflicting/unverifiable mapping and no positive fallback | adapter contract |
| `L2T-MOD-INF-005` | fake/durable parity | same typed result/error/redaction semantics; fake does not claim provider readiness | contract/integration boundary |
| `L2T-MOD-INF-006` | config/builder | section validation, cross-section invariants, missing capability rejection, no raw config leakage | adapter contract |
| `L2T-MOD-API-001` | api Command handlers | metadata/body validation, DTO mapping, accepted/error response and redaction | entry contract |
| `L2T-MOD-API-002` | api Query handlers | query mapping, visibility/freshness surface, no-write and no external call | entry contract |
| `L2T-MOD-WRK-001` | worker consumers | envelope version/dedup/order, accepted/rejected/quarantine/blocked receipt | worker service |
| `L2T-MOD-WRK-002` | worker continuations | event derived only from committed material, prepared replay, route-blocked/local failure/unknown | worker service |
| `L2T-MOD-WRK-003` | worker projection lifecycle | rebuild marker, bounded replacement, stale/rebuilding/failed state, no subject mutation | worker service |
| `L2T-MOD-JOB-001` | jobs entry | system actor/job metadata, non-empty bounded scope, cursor/watermark validation | entry contract |
| `L2T-MOD-JOB-002` | four Job runners | target-level outputs, counts conservation, report persistence and replay | service/fake |
| `L2T-MOD-JOB-003` | job no-repair fence | no Contract/Binding/Invocation/Outcome/Audit mutation on maintenance paths | service/fake |

## 5. Public Command test cuts: `CF-01~13`

每行至少需要一个 accepted/eligible 或本地确定性成功切口和一个异常/blocked/replay 切口。若外部正向 seam 仍被 blocker 拦截，成功切口只验证 L2 对 blocked-aware carrier 的正确保存，不验证 provider success。

| ID | Command / callable | 正向最小切口 | 异常、重复与副作用断言 |
|---|---|---|---|
| `CF-01` | `EstablishToolContract` | 有效 `ToolId`、首个 revision、binding mode 对称时，写 current contract、definition、evolution fact、stored result 一次。 | duplicate identity/digest conflict/source unresolved；失败不切换 current，不伪造 authority。 |
| `CF-02` | `AssessToolDefinitionChange` | 可归属 body-free source ref 构造 Candidate + CompatibilityImpact，current 不变。 | source missing/stale/conflicting/unverifiable、semantic duplicate；只写 assessment/error，不升 current。 |
| `CF-03` | `AdoptToolDefinitionRevision` | compatible candidate + exact expected version 原子替换 current，旧 revision `Superseded`。 | incompatible/conditional closure missing/version conflict/projection unavailable；所有 staged truth rollback，禁止旧 revision resurrection。 |
| `CF-04` | `RetireToolContract` | Active -> RetirementPending -> Retired 的 closure 两阶段迁移和历史保留。 | missing/stale blocking closure、非法终态回退、version conflict；不删除历史、不接受新 invocation。 |
| `CF-05` | `DeclareCapabilityBinding` | Hub seam 返回可归属 snapshot 时写 relation、assessment、change fact、stored result。 | Hub blocked/unavailable/conflicting/unverifiable、mode/ref asymmetry、duplicate；不使用 local registry/name fallback。 |
| `CF-06` | `ReplaceCapabilityBinding` | exact CAS、distinct successor、对称 mode/ref 在同一 local UoW 完成 replacement。 | stale version/duplicate successor/Hub blocked；旧 relation 不半替换，replacement race 返回 conflict。 |
| `CF-07` | `InvalidateCapabilityBinding` | Active relation 以 typed reason 转为 Invalidated 并写 change fact/replay。 | terminal/missing relation、empty reason、CAS conflict；不从 Invalidated 恢复。 |
| `CF-08` | `SubmitToolInvocation` | active contract + canonical context 生成 invocation/admission；无外部执行。 | forbidden/missing context、retired contract、binding conflict；Rejected/Unavailable 分支必须原子写 outcome/audit pair，不得写 accepted call。 |
| `CF-09` | `EvaluateExecutionPreconditions` | 对 `NoExternalGovernance` 或已满足的本地 requirement 形成 immutable assessment。 | auth/sandbox blocked, missing, stale, deny, mapping conflict；fail closed，必要时写 no-execution outcome/audit，绝不自授权。 |
| `CF-10` | `PrepareExecutionHandoff` | eligible handoff 先提交 `Prepared` marker，再映射一次 local Port response 到 terminal local attempt。 | precondition blocked、carrier unavailable、known local failure、side-effect unknown、phase-2 CAS conflict；unknown 不重调、不写 external accepted。 |
| `CF-11` | `AcceptExecutionSource` | attributable source + safe summary 生成 assessment 和 atomic outcome/audit pair。 | source missing/conflicting/mapping-blocked/unverifiable、terminal duplicate、late material；只追加 gap/assessment，不覆盖 terminal outcome。 |
| `CF-12` | `PrepareSafeExternalHandoff` | 四个 safety checks 全通过时生成 target-specific `SafeHandoffMaterial` 并转入唯一 OF branch。 | minimal/body-free/redacted/correlation 任一失败；不生成 material、不调用 Port、不绕过 target gate。 |
| `CF-13` | `RecordConsistencyGapResolution` | Open -> ResolutionPending -> Resolved 的 evidence/owner re-read 对称流程，或明确 supersede。 | scope mismatch、evidence missing/unverifiable、terminal gap、stale CAS；不修 Contract/Binding/Invocation/Outcome/Audit。 |

## 6. Public Query test cuts: `QF-01~11`

所有 Query 都必须配 no-write spy：不创建写 UoW、不调用 `IdempotencyStore::reserve/complete`、不写 audit/outbox/projection/reference/gap、不调用 external Port。读取失败不能被转成空成功页。

| ID | Query / callable | 正向最小切口 | 异常/降级切口与 no-write 断言 |
|---|---|---|---|
| `QF-01` | `GetToolContract` | 按 tool/ref 读取 current 或历史 body-free view。 | missing/not-visible/stale；无修复、无 current fallback 越权、无写。 |
| `QF-02` | `CompareToolDefinitionRevisions` | 两个同 tool、可见、可比 revision 生成 deterministic diff summary。 | revision mismatch/source unverifiable/projection unavailable；不重建 projection、不改 revision。 |
| `QF-03` | `GetCapabilityBinding` | selector 与 binding 对称，返回 relation + selected assessment/snapshot/gaps。 | selector mismatch/not-visible/missing/stale/conflicting；不调用 Hub refresh、不改变 binding。 |
| `QF-04` | `GetToolInvocation` | invocation + admission + anchor view 可读。 | missing/not-visible/integrity gap；不重新 admission、不重放 Command。 |
| `QF-05` | `GetExecutionPreconditionView` | 返回 requirement/assessment/handoff/attempt layered view。 | blocked/missing/unknown external seam 以 typed surface 返回；不做 readiness fallback/port call。 |
| `QF-06` | `GetOutcomeAudit` | 返回 outcome/audit pair、source assessment、attempt/status refs。 | half pair/missing result/unknown status/late gap 返回 integrity/unknown；不补 audit。 |
| `QF-07` | `GetReferenceConsistencyReport` | 按 bounded scope/watermark 读取 Current/Partial report。 | stale/failed/missing report；不触发 JF-02、不修 gap。 |
| `QF-08` | `SearchToolContracts` | bounded filter/page 返回 deterministic projection page。 | invalid cursor/scope digest, stale/rebuilding/unavailable/failed；不全表扫描、不写 projection。 |
| `QF-09` | `CompareToolContracts` | 两个 selected contract view 生成 body-free comparison。 | visibility mismatch/not-found/derived unavailable；不调用 resolver、不改变 truth。 |
| `QF-10` | `GetToolDiagnostic` | 组合已有 refs/facts/gaps/reports 为 safe diagnostic view。 | missing source/partial projection/unknown dependency；不创建新 gap、audit 或 repair。 |
| `QF-11` | `GetToolConsumerGuidance` | 从已提交 contract/binding/outcome/gap 生成 guidance view。 | stale/unavailable/blocked guidance surface；不把 guidance 当 authorization、readiness 或 SDK client。 |

## 7. Inbound Consumer test cuts: `IF-01~05`

Consumer 测试必须使用带可信 metadata 的 `InboundEventEnvelope<T>`；payload 不得重复 authority 字段，也不得含 raw body/secret。duplicate 只回放 `ConsumerReceipt`，不二次 Port/page/write。

| ID | Consumer | 正向最小切口 | 异常/重复/边界断言 |
|---|---|---|---|
| `IF-01` | `ConsumeHubCapabilityChangeClue` | supported envelope + bounded Hub clue 生成 snapshot/assessment/gap/receipt。 | unsupported version、source mismatch、duplicate、Hub blocked/unavailable；不改 Binding relation、不把 clue 当 registry truth。 |
| `IF-02` | `ConsumeAuthorizationResultChangeClue` | invocation-bound typed result 生成 reference assessment/gap/receipt。 | owner/schema blocker、subject/revision conflict、duplicate/quarantine；不生成 effective authorization。 |
| `IF-03` | `ConsumeSandboxExecutionSource` | envelope claim 通过确定性 CF-11 key re-entry，生成 source assessment/outcome/audit + receipt。 | redelivery 只重放 CF-11 result；unsupported/mapping blocked/altered digest 不直接写 outcome。 |
| `IF-04` | `ConsumeBusDeliveryStatusFeedback` | attributable feedback 为 attempt 追加 `BusDeliveryStatusRef`/gap/receipt。 | unknown/stale/conflicting/route blocked、duplicate；不写 Delivered 或 Bus store truth。 |
| `IF-05` | `ConsumeObservationStatusFeedback` | attributable observation material ref 追加 local status/gap/receipt。 | producer/route blocker、unknown/stale/conflicting、duplicate；不写 Observed、不建 Observability store。 |

## 8. Outbound continuation test cuts: `OF-01~04`

所有 OF 必须验证“已提交 material -> pure event mapping -> phase-1 Prepared -> 最多一次 local Port call -> phase-2 local disposition”。`Prepared` 或 `SubmissionOutcomeUnknown` 重入不能自动再次调用 collaboration Port。

| ID | Semantic event | 正向最小切口 | 异常/重复/边界断言 |
|---|---|---|---|
| `OF-01` | `ToolContractChanged` | ContractChange material 映射 canonical event id/name/schema，创建唯一 Prepared 并记录 local response。 | material/event/target mismatch、existing terminal/duplicate、route blocked/local failure/unknown；不声明 delivered。 |
| `OF-02` | `CapabilityBindingChanged` | BindingChange material 对称映射并保存 attempt view。 | binding source mismatch、target conflict、Prepared replay、Port unavailable/unknown；不改 Binding truth。 |
| `OF-03` | `ToolOutcomeAuditMaterialAvailable` | OutcomeAudit material 只引用 outcome/audit refs，完成一次 local submission disposition。 | half pair/forbidden body/route blocker/unknown；不复制 audit body或升级 Observed。 |
| `OF-04` | `ToolConsistencyGapChanged` | Gap material 映射 canonical event 并保存 attempt/gap refs。 | terminal/scope mismatch、duplicate、status unknown；不改变 gap owner state、不重开无依据 gap。 |

## 9. Operations Job test cuts: `JF-01~04`

Job 仅处理显式、非空、去重且有界的 scope；每个 target 使用规定 watermark 和局部 UoW。Duplicate 必须回放原 `JobReport`，不重扫、不重写 projection、不再调用 external Port。

| ID | Job | 正向最小切口 | 异常/partial/replay/no-repair 断言 |
|---|---|---|---|
| `JF-01` | `CheckCapabilityBindingConsistency` | bounded tool IDs 逐项读取 relation，必要时保存 Hub snapshot/assessment/gap 和 report。 | empty scope/cursor conflict/Hub blocked/partial target failure；不隐式全扫、不改 Binding relation。 |
| `JF-02` | `CheckReferenceIntegrity` | bounded reference targets 在 source watermark 下产出 validity assessments/gaps/report。 | Core authority candidate-only、unverifiable source、partial/failed report；不发明 authority query、不修 subject。 |
| `JF-03` | `RebuildToolDerivedViews` | bounded projection source bundle 在 claim 下从 Rebuilding -> Fresh/Partial/Failed。 | older watermark race/version conflict/store unavailable；Query 期间 no-write，不改 Contract/Binding/Invocation/Outcome/Audit。 |
| `JF-04` | `RefreshExternalStatusRefs` | explicit attempt refs 按 freshness skip/one feedback call，保存 Bus/Observation ref 与 report。 | route blocked/unknown/ambiguous call/duplicate/partial；不升级 local attempt、不自动二次调用、不写 Delivered/Observed。 |

## 10. 六状态族合法/非法转换测试

| 状态族 | 合法主线切口 | 边界合法切口 | 至少一条非法切口及必须断言 |
|---|---|---|---|
| contract evolution | `Active -> RetirementPending -> Retired`；`Candidate -> Current -> Superseded` | Candidate/Current -> Withdrawn；conditional compatibility 在 closure 通过后 promote | `Retired -> Active`、`Superseded -> Current`、incompatible promote：`InvalidStateTransition`/`IncompatibleRevision`，零 accepted mutation。 |
| binding/source | `Active -> ReplacementPending -> Replaced`；`Active -> Invalidated` | ExplicitUnbound assessment 与 Bound assessment 分离；late snapshot 只新增 assessment | terminal relation replace/invalidate、empty ref 当 ExplicitUnbound、source snapshot 改写 old anchor：typed invalid/uniqueness error，relation 不半写。 |
| invocation/admission | request -> `Admitted` 或 `AwaitingPrecondition` | deterministic reject/unavailable 形成 linked no-execution outcome | `AwaitingPrecondition -> Admitted` 原地翻转、terminal re-admission、retired contract admission：invalid state，outcome/audit pair 不重复。 |
| precondition/handoff | `Preparing -> Eligible`；`Preparing -> Blocked/Invalidated`；attempt `Prepared -> AttemptedLocally` | Prepared -> CarrierUnavailable/MappingBlocked/LocallyFailed | Eligible handoff without applicable checks、terminal attempt back to Prepared、unknown auto retry：typed transition error/no second Port call。 |
| outcome/safe handoff | source assessment -> terminal outcome；attempt `Prepared -> SubmittedLocally/Degraded/RouteBlocked` | four-gate eligibility -> material；Bus/Obs status independent append | terminal outcome overwrite、Ineligible material creation、SubmittedLocally -> Delivered/Observed local transition：terminal conflict/no material/no external truth claim。 |
| integrity/derived | gap `Open -> ResolutionPending -> Resolved`；report `Current/Partial -> Stale`；projection `Rebuilding -> Fresh` | Open/ResolutionPending -> Superseded；Failed/Unavailable -> Rebuilding | resolve without formal owner re-read、Stale -> Current without rebuild、Query triggers rebuild：unverifiable/invalid transition/no subject repair/no query writes。 |

## 11. 持久化、事务和一致性最小切口

| ID | 断言 | 最小 fixture / 注入 |
|---|---|---|
| `L2T-TX-001` | accepted Contract/Binding/Invocation/Outcome writes and stored result commit atomically | fake UoW fails at each staged write; assert all local writes rollback |
| `L2T-TX-002` | `ToolInvocationOutcome` and `ToolAuditEntry` are an indivisible pair | `OutcomeAuditStore::insert_outcome_audit_pair` spy + half-write failure |
| `L2T-TX-003` | phase-1 Prepared marker commits before CF-10/OF Port call | call-order spy; crash between commits leaves Prepared only |
| `L2T-TX-004` | phase-2 local disposition and stored result use same attempt version | stale `Loaded<T>` produces CAS conflict and preserves terminal marker |
| `L2T-TX-005` | Query never participates in write UoW | write counter on every Store/UoW/idempotency adapter |
| `L2T-TX-006` | each Job target and report has bounded named UoW | target failure preserves prior committed target refs; report counts remain conservative |
| `L2T-TX-007` | commit known rollback vs commit unknown are distinct | UoW fake returns `KnownRolledBack` / `CommitOutcomeUnknown`; assert different recovery surface |
| `L2T-TX-008` | projection/reference/status writes cannot satisfy core truth precondition | dependency spy and staged-store guard |
| `L2T-TX-009` | semantic unique append equal duplicate vs divergent content is deterministic | same semantic key with equal/different canonical digest |
| `L2T-TX-010` | report/receipt/result missing is integrity defect, not reconstruction | remove sidecar after subject mutation; replay returns `DuplicateResultMissing` |

## 12. 并发、幂等、重入与 late material

Step 13 的 `L2T-CONC-001~023` 是 canonical IDs；本表只给每组的实现断言，不能被更名或弱化：

| ID 范围 | 必须验证的切口 |
|---|---|
| `L2T-CONC-001~005` | same key/same digest 单赢家 + exact replay；different digest conflict；operation scope 隔离；stale `Loaded<T>` CAS；semantic unique equal/divergent。 |
| `L2T-CONC-006~009` | Consumer redelivery receipt replay；同 dedup key altered payload quarantine/conflict；unsupported schema 在 parse/write 前拒绝；IF-03 derived CF-11 key 至多一次。 |
| `L2T-CONC-010~012` | OF duplicate 不二次 collaboration；Prepared/unknown 不 auto-submit；phase-2 attempt CAS 不覆盖 terminal。 |
| `L2T-CONC-013~015` | Job duplicate replay report；next cursor requires new key + exact watermark；partial Job 保留成功 refs 并报告失败 refs。 |
| `L2T-CONC-016~019` | projection older watermark cannot overwrite newer；rebuild 时 Query no-write；reference/status equal duplicate preserves first, divergent opens gap；stale handoff marker cannot overwrite terminal。 |
| `L2T-CONC-020~023` | commit unknown 同 key resolution before mutation；missing stored result never reconstructs；late material append assessment/gap only；body/secret/prompt excluded from digest/error surface。 |

## 13. 错误、恢复和 blocked seam 测试

| 测试切口 | 对应 Step 12/13 contract | 必须断言 |
|---|---|---|
| `L2T-ERR-001` | metadata/body/forbidden-field validation | `InvalidInput`/`ProtocolError::InvalidInput`，写入计数为零，不生成 accepted audit。 |
| `L2T-ERR-002` | domain invalid transition/invariant | `DomainRejected`/`InvalidState`，没有 state/history/outbox/result mutation。 |
| `L2T-ERR-003` | version/uniqueness conflict | `VersionConflict` 或 equal replay/divergent integrity conflict；不得 blind retry。 |
| `L2T-ERR-004` | Store/UoW unavailable/begin/rollback failure | `DependencyUnavailable` 或 `IntegrityFailure`，恢复 owner/ref 明确，不能返回 empty success。 |
| `L2T-ERR-005` | commit outcome unknown | `CommitOutcomeUnknown` marker、manual resolution surface、同 key 不直接重写。 |
| `L2T-ERR-006` | side-effect outcome unknown | attempt `CallOutcomeUnknown`/`SubmissionOutcomeUnknown`，不二次 Port call、不声明 delivery。 |
| `L2T-ERR-007` | blocked/unavailable/unsupported external resolver | typed blocked/unavailable/unsupported result + gap where attributable；不伪造 positive provider state。 |
| `L2T-ERR-008` | invalid external response/forbidden body | `IntegrityFailure`/`ForbiddenBody`，不保存 response body 或 credential。 |
| `L2T-ERR-009` | duplicate result/receipt/report missing | `DuplicateResultMissing`，停止 replay并转 manual integrity owner，不从 current truth 重算。 |
| `L2T-ERR-010` | unsupported event/job schema | reject/quarantine before payload parse or write；不调用 Port、不写业务事实。 |
| `L2T-ERR-011` | partial Job | `Partial`/`Blocked` report 只引用已提交 output/gap refs，失败 target 不抹除成功 target。 |
| `L2T-ERR-012` | late material/terminal conflict | append new assessment/gap，terminal outcome/audit immutable。 |

Blocked upstream seams must have negative tests for `L2T-UP-001~009`:

| Blocker | Negative test predicate |
|---|---|
| `UP-001/002` | Authorization/Sandbox owner/schema absent => fail closed; no local allow/deny/readiness invention. |
| `UP-003/004` | L2-to-Sandbox mapping/receipt absent => mapping blocked/carrier unavailable/unknown; no host fallback or fake receipt. |
| `UP-005/006` | Observation producer/status chain absent => route blocked/unknown; no Observability store/readiness. |
| `UP-007` | workspace baseline not frozen => no test/evidence claim or immutable source assertion. |
| `UP-008` | Core tools-specific schema absent => candidate-only/unverifiable; no invented Core type/query. |
| `UP-009` | SDK client seam absent => server contract remains callable; no client coverage/readiness claim. |

## 14. 配置、builder 和 adapter availability 测试

| 测试切口 | 对应 Step 14 | 必须断言 |
|---|---|---|
| `L2T-CFG-001` | section-local config validation | malformed/oversized/unbounded values return typed issue with `ConfigSourceRef`; raw config/secret not logged. |
| `L2T-CFG-002` | cross-section invariants | seven Store/UoW/idempotency/projection bindings inconsistent => builder rejects before serving entries. |
| `L2T-CFG-003` | missing capability | absent required atomic pair/CAS/resolve capability => `MissingUnitOfWorkCapability`, no silent downgrade. |
| `L2T-CFG-004` | adapter slot states | disabled/degraded/unavailable/blocked map to typed availability; no provider readiness or local truth mutation. |
| `L2T-CFG-005` | feature flags | outbound/projection/status feature disabled changes only peripheral registration; no safety/admission/identity semantics change. |
| `L2T-CFG-006` | fake/durable parity | same config candidate yields same typed errors, key/digest, redaction and blocked behavior across adapters. |
| `L2T-CFG-007` | forbidden config overrides | config cannot alter actor authority, schema semantics, key derivation, safety gates, state transitions, query write guard or external delivered meaning. |

## 15. 可观测性、审计和 redaction 测试

| 测试切口 | 对应 Step 15 | 必须断言 |
|---|---|---|
| `L2T-OBS-001` | log entry/level coverage | each API/worker/job/Store/UoW/Port/config error boundary emits structured safe record; no free-text body. |
| `L2T-OBS-002` | metric cardinality | labels are closed low-cardinality enums only; no actor/subject/request/trace/result/idempotency/payload digest or secret. |
| `L2T-OBS-003` | TraceContext source | context derives only from Command/Query/Envelope/Job metadata; missing context rejects; domain/Store/adapter cannot mint business trace. |
| `L2T-OBS-004` | outcome/audit pair | accepted CF-08/CF-11 pair has symmetric refs in one UoW; half pair/commit unknown returns integrity/unknown surface. |
| `L2T-OBS-005` | accepted/rejected/duplicate | accepted local truth has committed facts; rejected has error only; duplicate has replay log/metric only, no second audit/outbox/call. |
| `L2T-OBS-006` | Query/Job fence | Query emits read telemetry only; Job emits bounded report telemetry and never truth-repair audit. |
| `L2T-OBS-007` | external status boundary | local attempt + Bus/Observation refs remain independent; no delivered/observed/readiness wording or state. |
| `L2T-OBS-008` | forbidden-field sweep | generated log/span/metric/audit/receipt/report/error/material/event contains no raw request/query/event/job body, prompt, capture, provider response, SQL, URL credential, token, secret or stack trace. |
| `L2T-OBS-009` | redaction parity | fake and durable adapters apply identical body-free mapping; missing redaction guard fails closed. |

## 16. Planned script boundary (not created or executed in this Step)

Step 4 将 scripts/artifacts/reports 延后到 `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md`。因此本步只记录未来契约，不声称文件存在：

| Planned script | 类型 | 预期参数 | 预期输入/输出 | 失败语义 |
|---|---|---|---|---|
| `scripts/gates/run_test_gate.sh` | gate | `--run-id --artifact-root --config-profile` | source + test config -> `artifacts/test/<run_id>` | 非 0；保留 typed failure report，不伪造通过。 |
| `scripts/checks/check_redaction.sh` | check | `--artifact-root --report-root` | generated artifacts -> redaction report | 发现 forbidden field 非 0；当前未创建。 |
| `scripts/reports/generate_test_reports.sh` | report | `--run-id --artifact-root --report-root` | test artifacts -> `reports/runs/<run_id>` | 缺 artifact/输入非法非 0；当前未创建。 |

## 17. Cross-step closure audit

| 审计项 | 结果 | 回指 |
|---|---|---|
| 七模块均有独立最小切口 | pass | Step 5、§4 |
| 每个 `13/11/5/4/4` public protocol 有正向和异常入口 | pass | Step 8/9、§5~§9 |
| 六状态族有合法、边界和非法转换 | pass | Step 10、§10 |
| Store/UoW/version/semantic key/rollback/commit unknown | pass | Step 11~13、§11~§12 |
| error/recovery/blocked/late/partial | pass | Step 12~13、§13 |
| config/builder/adapter disabled parity | pass | Step 14、§14 |
| log/metric/trace/audit/redaction | pass | Step 15、§15 |
| Query no-write | pass | Step 9/13/15、§3、§6、§11、§12 |
| Job no-truth-repair | pass | Step 9/10/15、§9、§13 |
| 没有新增 owner / store / registry / SDK / runtime loop | pass | Step 2、Step 5~15 |
| 未把 blocker 写成 positive readiness | pass | `L2T-UP-001~009`、§13 |

## 18. 正式 §15 回填草稿

正式 `03-详细设计.md` §15 只回填以下收口结论：

1. 七模块测试主轴和每模块最小切口。
2. `CF-01~13`、`QF-01~11`、`IF-01~05`、`OF-01~04`、`JF-01~04` 的正向/异常/no-write/replay 入口。
3. 六状态族合法、边界、非法迁移切口。
4. 持久化、UoW、CAS、semantic uniqueness、rollback、commit/call unknown 和 `L2T-CONC-001~023`。
5. 错误恢复、blocked seam、配置/builder、观测/redaction 断言。
6. 测试方案、脚本、artifact、report、真实结果和 evidence 由后续文档承接。

正式 §15 不得回填完整测试计划、coverage、run_id、证据别名、验收签署或实现已通过声明。

## 19. 待确认事项与进入下一步条件

| 项目 | 状态 | 处理 |
|---|---|---|
| `L2T-UP-001~009` | open | 保持 negative/blocked tests；不阻塞本地契约切口。 |
| 实现仓不存在 | open | 仅给 planned cuts，不声明代码或测试已执行。 |
| 真实 durable/provider/broker/SDK binding | deferred | 由 04/05/06/07 和对应 owner 关闭后再加入联调方案。 |
| Step 16 gate | `completed / pass` | 所有关键契约已有可回指最小测试入口；可创建 Step 17。 |

```text
step_status = completed
gate_status = pass
gate_reason = seven modules, 37 public flows, six state families, transaction/idempotency/concurrency, error/recovery, config/builder and observability/redaction all have implementation-addressable positive and negative cuts without claiming external readiness or test execution
next_allowed_action = create_step_17_implementation_handoff.md
formal_03_write_allowed = false
commit_required = false
```
