# Step 12. 定义错误模型、异常分支与恢复口径

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 12
> 回填章节: `03-详细设计.md` §11 错误模型、异常分支与恢复口径
> 生成日期: 2026-07-09
> 状态: completed_wait_user_review
> 所属流程: `03_ddd_calibration_flow.md`
> 本 Step 口径: 在 Step 6 对象错误载体、Step 8 public error / query / receipt / job surface、Step 9 函数级异常分支、Step 10 状态非法转换和 Step 11 事务一致性契约基础上,定义 L4-sandbox 的代码层错误 taxonomy、协议映射、异常处理和恢复 / 不恢复口径。本步不写实现代码、HTTP path、topic、配置 key、测试结果、run_id、evidence alias、验收签署、实施 commit boundary 或正式 `03-详细设计.md`。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 12 | 是。Step 11 审查点后用户已回复“同意”,允许进入 Step 12。 |
| 项目级台账是否允许进入 Step 12 | 是。`project_execution_ledger.md` 原恢复点为 Step 11 `pass_wait_review`,用户确认后可进入 Step 12。 |
| 文档级 flow 是否允许进入 Step 12 | 是。`03_ddd_calibration_flow.md` 原记录 Step 12 `blocked_by_step_11_review`,用户确认后门禁满足。 |
| 是否已读取 Step 11 持久化 / 事务契约 | 是。Step 11 已闭口 UoW ordering、version / cursor、rollback visibility、projection / relay / stored replay 和 fake / durable parity。 |
| 是否已读取 Step 9 / Step 10 | 是。Step 9 已闭口 command / query / consumer / relay / job 异常分支;Step 10 已闭口非法转换总表和 Step 12 handoff。 |
| 是否已读取详细设计 SOP Step 12 | 是。本步必须输出错误类型表、错误映射表、异常分支处理表和恢复口径表。 |
| 是否已读取详细设计书写规范 §5.11 | 是。本章必须区分可重试、不可重试、需人工介入,且错误类型能回指模块、协议或 flow。 |
| 是否已读取真相源闭环标准相关条目 | 是。重点检查 state matrix error coverage、duplicate missing result、query degraded marker、adapter outcome classification、relay dead-letter、handoff failure、no-write violation 和 recovery boundary。 |
| 是否发现阻塞 Step 12 的上游 blocker | 未发现阻塞本步生成的 blocker。`04/07` 缺失仍为 downstream gap;Step 11 direct selector gap 已作为 current callable boundary 收口。 |

---

## 2. 本步目标

本步把前序对象、协议、flow、状态矩阵和事务契约中出现的错误统一收敛到可编码的错误模型。重点不是扩大业务能力,而是让实现者能按同一错误类型完成:

- domain invariant / state transition error 到 application / public error 的映射。
- protocol validation、query surface、consumer receipt、relay status、job report 的稳定失败面。
- retryable、non-retryable、manual-intervention 三类恢复口径。
- transaction begin / commit / rollback、version conflict、cursor allocation、stored result missing 等一致性异常处理。
- adapter outcome 与 raw error 的边界:service / fake 不得解析错误字符串、HTTP status、SDK body 或 private map。

本步不处理:

- Step 13 的 idempotency key schema、digest canonicalization、retry backoff / window / concurrency lock 粒度。
- Step 14 的配置 key、adapter binding、retry / dead-letter threshold 数值。
- Step 15 的完整 observability field catalog。
- Step 16 的测试用例全集或真实测试结果。
- `07-实施计划.md` 的 implementation boundary。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `project_execution_ledger.md` | 已读取 | 确认当前恢复点、进入 Step 12 的用户门禁和 downstream gap。 |
| `03_ddd_calibration_flow.md` | 已读取 | 确认 Step 1~11 已完成,正式 `03` 仍不得修改。 |
| `03_ddd_step_06_object_contracts.md` | 已读取 | 提供 `ContractError`、`DomainError`、`ApplicationError`、`InfraError`、`ApiError`、public error carrier、query / job / adapter status owner。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已读取 | 提供 repository / port / adapter callable surface、adapter outcome enum、entry mapping 和 fake parity。 |
| `03_ddd_step_08_protocol_contracts.md` | 已读取 | 提供 `SandboxPublicErrorKind`、query surface、consumer receipt、relay envelope、job report 和公共错误映射。 |
| `03_ddd_step_09_function_flows.md` | 已读取 | 提供 command / query / consumer / relay / job 的异常分支、UoW 顺序、stored replay、no-write / no-rollback 测试切口。 |
| `03_ddd_step_10_state_matrix.md` | 已读取 | 提供非法转换总表和 Step 12 handoff:terminal reopen、fail-closed bypass、weak boundary fallback、query write、job core repair、no-rollback、duplicate recompute、cursor misuse、external body persistence。 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已读取 | 提供 begin / commit / rollback、version conflict、cursor allocation、projection missing、relay dead-letter、duplicate missing stored result 等事务失败场景。 |
| 正式 `00/01/02` | 已读取过并在前序 Step 承接 | 提供 sandbox truth ownership、fail-closed、capture / handoff 分层、cleanup / redline、query no-write、job no-repair、security redlines。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 恢复项目级台账、文档级 flow 和 Step 11 当前文件。 | done | 确认用户已允许进入 Step 12。 |
| 2 | 读取 Step 12 SOP、详细设计书写规范 §5.11 和真相源闭环标准相关条目。 | done | 明确错误类型 / 映射 / 异常 / 恢复四张表为必出。 |
| 3 | 从 Step 6/8/9/10/11 抽取模块错误、public surface、flow 分支、非法转换和事务异常。 | done | 形成错误 taxonomy 输入池。 |
| 4 | 定义错误命名、分层和 public mapping 稳定规则。 | done | Step 8 public error kind 不被破坏;内部错误可细分。 |
| 5 | 输出错误类型表、错误映射表、异常分支处理表和恢复口径表。 | done | 实现者可以 1:1 编码错误处理。 |
| 6 | 输出审计 / 事件 / 日志口径、禁止行为和回填草稿。 | done | 不混入 observability store、artifact truth、runtime loop 或 tools semantic execution。 |
| 7 | 更新 `03_ddd_calibration_flow.md` 和项目级台账。 | pending | 当前恢复点停在 Step 12 审查点,不跨到 Step 13。 |

---

## 5. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 每个模块有哪些错误类型 | `contracts` 定义 carrier / DTO 构造错误;`domain` 定义 invariant、非法状态、boundary / policy / cleanup / redline guard 错误;`application` 定义 validation、reference、version、idempotency、no-write、duplicate missing result、query degraded 和 transaction wrapper;`infra` 定义 adapter availability、disabled、outcome classification、runtime builder / config validation;`api/worker/jobs` 定义 entry metadata、envelope、receipt / report mapping 错误。 |
| 哪些错误映射到 HTTP / RPC / Event 失败 | 不写具体 transport code,但所有 entry 均映射到 Step 8 的 `SandboxPublicErrorKind`、`SandboxQuerySurfaceStatus`、`SandboxConsumerReceiptStatus`、`EventRelayStatus`、`HandoffStatus` 或 `SandboxJobReportStatus`。 |
| 哪些错误可重试 | version conflict、adapter unavailable、relay retryable、handoff retryable、reference refresh unavailable、projection rebuild snapshot missing、derived / reconciliation partial failure、job item repository transient failure可按 Step 13/14 backoff 重试。 |
| 哪些错误不可重试 | validation、unsupported schema、forbidden body、not authorized、terminal reopen、fail-closed bypass、weak boundary fallback、job no-repair、query no-write、external body persistence、duplicate digest conflict 不可用同一输入重试。 |
| 哪些错误需要人工介入 | redline containment、cleanup blocked by investigation、relay dead-letter、handoff permanently failed、duplicate missing stored result、cursor invariant / commit integrity / rollback failure、unmapped internal error 需要 operations / design review 或安全调查。 |
| 事务失败、并发冲突、重复请求、外部依赖失败如何处理 | 事务 begin/commit/cursor/storage integrity 映射 operational/internal failure;rollback hides staged writes。version conflict 返回 conflict 并允许 fresh-read retry。duplicate 只 replay stored result,missing result 不重算。外部 adapter 必须返回结构化 outcome;availability failure 不可变成业务 allow。 |
| 哪些异常需要写审计、日志或事件 | domain accepted / rejected、fail-closed、boundary rejected、failure classification、cleanup / redline、handoff/relay terminal failure、duplicate missing result、no-write violation、cursor / rollback / commit integrity error需要 audit / safe log / report surface。query degraded 只返回 marker,不写 audit。 |

---

## 6. 当前文档问题诊断

| 问题来源 | 风险 | 本步处理 |
|---|---|---|
| Step 6 public error family 比 Step 8 protocol public kind 粗 | 若沿用 Step 6 旧粗粒度,`ForbiddenExternalBody`、`VersionConflict`、`DuplicateMissingResult`、`NoWriteViolation` 会被压成 `Failed` 或 `Internal`。 | 对外映射以 Step 8 `SandboxPublicErrorKind` 为准;Step 6 owner 仅作为模块错误载体来源。 |
| Step 10 多处使用 `InvalidStateTransition` 占位 | 若不细分,无法区分 terminal reopen、fail-closed bypass、weak fallback、no-rollback、external body persistence。 | 在 Domain error detail 中细分触发条件和 public mapping,同时保留 `DomainError` owner。 |
| Step 11 duplicate missing result | 若实现选择重算 command / consumer / job,会破坏幂等和 side effect 一致性。 | 定义 `DuplicateMissingResult` 为 manual-intervention / blocker;不得重跑 mutation 或伪造 stored result。 |
| Query degraded / missing projection | 若 query 从 repository error 文本拼 marker,会形成 fake/durable 第二真相。 | Query surface 必须来自 projection / snapshot / visibility decision 或 Step 11 index 规则;缺 callable surface 时返回 validation / missing / degraded,不扫描。 |
| Adapter failure classification | 若 service / fake 解析 raw error 或 HTTP status,状态机与 durable 行为会漂移。 | Adapter port 必须返回 Step 7 outcome enum;raw error 只进入 sanitized reason 或 safe log,不得驱动业务状态。 |

---

## 7. 错误命名、分层与映射规则

| 规则 | 正式口径 | 禁止替代 |
|---|---|---|
| public error 名称来源 | `SandboxPublicErrorKind` 使用 Step 8 名称: `Validation`,`ReferenceUnresolved`,`ForbiddenExternalBody`,`NotAuthorized`,`NotVisible`,`VersionConflict`,`IdempotencyConflict`,`DuplicateMissingResult`,`BoundaryRejected`,`PolicyFailClosed`,`AdapterUnavailable`,`UnsupportedVersion`,`Quarantined`,`Disabled`,`NoWriteViolation`,`Internal`。 | 回退到 Step 6 粗粒度 `Failed` / `Unavailable`;新增未在 Step 8 承接的 public code。 |
| internal detail 来源 | internal error 可以按 `ContractError` / `DomainError` / `ApplicationError` / `InfraError` / `ApiError` / `WorkerError` / `JobsError` 细分,但必须映射到上表 public 或 status surface。 | service 临时 `anyhow` / raw string / fake-only enum。 |
| retryability owner | retryable 标志由 application mapper 根据 error detail / adapter outcome / repository conflict 决定。 | entry handler 根据 HTTP status、错误文本或 adapter kind 猜测 retry。 |
| query surface 与 error 区分 | Query 可返回 `Visible/Empty/NotVisible/Restricted/Stale/Degraded/Rebuilding/MissingProjection/Unavailable` surface;不是所有 query 异常都抛 public error。 | 把 `NotVisible`、`Empty`、`Degraded` 全部变成 `Internal` 或 raw repository error。 |
| event / job surface 与 error 区分 | Consumer 使用 receipt status;relay 使用 relay / publisher status;job 使用 report / item status。 | inbound event 直接抛异常导致 ack/retry/quarantine 规则不明。 |
| manual-intervention 标记 | 安全红线、commit integrity、dead-letter、duplicate missing result 等必须可被 operations / review surface 追踪。 | 自动修复 core truth、删除 evidence、重跑副作用或把错误吞成 success。 |

---

## 8. 错误类型表

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `ContractError::InvalidCarrier` | `contracts` | public DTO / ref / reason / marker 必填字段为空、enum payload 非法、ref set 结构非法。 | 否;调用方修正输入。 | `Validation`;entry `Rejected`。 |
| `ContractError::UnsupportedProtocolVersion` | `contracts` | inbound event / public DTO schema_version 不在当前支持集合。 | 当前输入不可重试;可升级 producer 后重投。 | `UnsupportedVersion`;consumer `Delayed` 或 `Quarantined`。 |
| `DomainError::InvalidStateTransition` | `domain` | 状态矩阵未允许的普通迁移。 | 否;除非调用方重新读取并选择合法命令。 | `Validation` 或 `Internal`;按入口是否由 caller 输入触发。 |
| `DomainError::TerminalStateReopen` | `domain` | `Rejected -> Accepted`,`Closed -> Active`,`Released -> Active`,`Delivered/DeadLetter -> Pending` 等终态重开。 | 否。 | `Validation` / `BoundaryRejected`;写 safe audit。 |
| `DomainError::PolicyFailClosedBypass` | `domain` | missing / stale / conflicted / unsafe policy 被试图映射成 allow。 | 否;需上游 policy summary 恢复后重新发起。 | `PolicyFailClosed`;拒绝或 blocked。 |
| `DomainError::WeakBoundaryFallbackRejected` | `domain` | unsupported / incomplete boundary 被试图静默降级成 coherent boundary。 | 否。 | `BoundaryRejected`;failure classification 可记录。 |
| `DomainError::BoundaryCoherenceViolation` | `domain` | resource limits、filesystem / network / process boundary、handle / context 绑定不一致。 | 通常否;adapter unavailable 分支另行 retry。 | `BoundaryRejected` 或 `AdapterUnavailable`。 |
| `DomainError::ForbiddenExternalBodyPersistence` | `domain` | external policy / artifact / observability / capture / adapter raw body 试图进入 sandbox truth。 | 否;安全阻断。 | `ForbiddenExternalBody`;consumer `Quarantined`。 |
| `DomainError::NoRollbackInvariantViolation` | `domain` | handoff / relay / publish failure 试图回滚 committed capture / source truth。 | 否;implementation bug。 | `Internal`;manual review。 |
| `DomainError::CleanupGuardRejected` | `domain` | cleanup / release 在 guard 非 `Allowed`、redline / investigation 未闭合或 handoff pending 时执行。 | 否;等 guard 变为 allowed 后新 flow 可执行。 | `PolicyFailClosed` / `BoundaryRejected`;job item `Skipped` 或 `Failed`。 |
| `DomainError::RedlineContainmentRequired` | `domain` | redline 被发现但 flow 试图 advisory-only 或继续 release / launch。 | 否;人工安全调查。 | `Quarantined` / `PolicyFailClosed` / `Internal`。 |
| `DomainError::HandoffTargetMismatch` | `domain` | handoff feedback target 与 committed handoff/capture/redline/cleanup truth 不匹配。 | 否;quarantine 当前事件。 | consumer `Quarantined`;public `Quarantined`。 |
| `ApplicationError::Validation` | `application` | selector missing、scope invalid、current boundary 未开放 direct finder、job no-repair 输入非法。 | 否;调用方修正请求。 | `Validation`;query 可为 `MissingProjection` / `Degraded`。 |
| `ApplicationError::ReferenceUnresolved` | `application` | 必需 external / context / projection / report / source ref 缺失或无法解析。 | 视来源:外部引用可稍后重试;输入错不可。 | `ReferenceUnresolved`;consumer `Delayed`;query `Unavailable` / `MissingProjection`。 |
| `ApplicationError::NotAuthorized` | `application` | actor context 不在允许 scope 或可见性 resolver 返回 hidden。 | 否。 | Command `NotAuthorized`;Query `NotVisible` / `Restricted`。 |
| `ApplicationError::VersionConflict` | `application` | repository expected version 与 committed version 不一致。 | 是;fresh read 后重试,不得覆盖。 | `VersionConflict`;job item failed/retryable。 |
| `ApplicationError::IdempotencyConflict` | `application` | 同一 operation/channel/key 但 digest 或 operation 不匹配。 | 否;新请求必须使用新 key。 | `IdempotencyConflict`;entry `Rejected`。 |
| `ApplicationError::DuplicateMissingResult` | `application` | idempotency record 已 completed 但 stored result 缺失、wrong kind 或不可 replay。 | 否;需人工 / design review。 | `DuplicateMissingResult`;不得重跑 mutation。 |
| `ApplicationError::NoWriteViolation` | `application` | query path begin write UoW、save truth、append relay、mark stale、refresh、rebuild、handoff、cleanup 或 release。 | 否;implementation bug。 | `NoWriteViolation`;safe audit / log。 |
| `ApplicationError::JobNoRepairViolation` | `application` | projection / derived / reconciliation / report job 试图修复 core truth。 | 否;implementation bug。 | `Validation` 或 `Internal`;job `Failed`。 |
| `ApplicationError::CursorInvariantViolation` | `application` | page cursor、timestamp、id、version、trace ref、digest 被用作 truth / reference marker cursor。 | 否;manual review。 | `Internal`;safe audit / log。 |
| `ApplicationError::TransactionBeginFailed` | `application` | write UoW begin 失败,mutation 未开始。 | 是;依赖恢复后可重试。 | `AdapterUnavailable` / `Internal`;no truth write。 |
| `ApplicationError::TransactionCommitFailed` | `application` | commit 返回失败或无法证明 staged writes 原子可见。 | 未自动重试;人工确认完整性。 | `Internal`;manual intervention。 |
| `ApplicationError::RollbackFailed` | `application` | rollback 未确认 staged writes 已隐藏。 | 否;manual integrity review。 | `Internal`;safe audit / log。 |
| `ApplicationError::ProjectionMissing` | `application` | query / rebuild 所需 projection 或 rebuild snapshot 缺失。 | Query 不重建;job 可后续重跑。 | Query `MissingProjection` / `Degraded`;job item `Degraded`。 |
| `ApplicationError::QueryMaterialDegraded` | `application` | status snapshot、relation、material ref、report item、projection marker 部分缺失但可安全返回降级 surface。 | Query 否;maintenance 可后续恢复。 | Query `Degraded`;不写 truth。 |
| `InfraError::AdapterUnavailable` | `infra` | resolver、isolation backend、handoff、publisher、projection store、truth store 暂不可用。 | 是;按 Step 13/14 retry / backoff。 | `AdapterUnavailable`;delayed / retryable / degraded。 |
| `InfraError::AdapterDisabled` | `infra` | runtime config 禁用某 adapter 或启动 profile blocked。 | 否;需配置变更。 | `Disabled`;startup blocked / job skipped。 |
| `InfraError::OutcomeClassificationMissing` | `infra` | adapter 未返回正式 outcome enum,或 fake/durable 分类不一致。 | 否;implementation defect。 | `Internal`;manual review。 |
| `InfraError::RuntimeBuilderFailed` | `infra` | runtime builder 缺少 required port、config summary 或 profile refs。 | 否/依赖配置;不得 fallback allow。 | `AdapterUnavailable` / `Disabled` / `Internal`。 |
| `ApiError::InvalidEntryMetadata` | `api` | command / query metadata、actor、trace、idempotency key、digest 缺失或无法规范化。 | 否;修正请求。 | `Validation`;entry `Rejected`。 |
| `WorkerError::EnvelopeInvalid` | `worker` | inbound envelope 缺 event id/source/schema/dedup/digest 或 source authority 不可信。 | 否;或 producer 修正后重投。 | receipt `Rejected` / `Quarantined`。 |
| `WorkerError::UnsafeExternalBody` | `worker` | event payload 或 source snapshot 含 forbidden body marker。 | 否;安全隔离。 | receipt `Quarantined`;public `ForbiddenExternalBody`。 |
| `JobsError::ReportPersistenceFailed` | `jobs` | job report / stored job result 保存失败。 | 是/人工视 commit 状态;不得伪造 report。 | job `Failed`;`Internal`。 |
| `RelayError::RetryablePublishFailure` | `application` / `worker` | publisher outcome `Retryable` 或 relay save version conflict。 | 是;relay job 后续重试。 | relay `Retryable`;job `PartialFailed`。 |
| `RelayError::DeadLetter` | `application` / `worker` | publisher outcome `DeadLetter` 或 retry exhausted。 | 否;人工 review / new relay record only after new source event。 | relay `DeadLetter`;job report dead-letter item。 |
| `HandoffError::RetryableDeliveryFailure` | `application` / `jobs` | material / observability / investigation handoff outcome `Retryable`。 | 是;handoff retry job。 | `HandoffStatus::Retryable`;job partial failed。 |
| `HandoffError::PermanentDeliveryFailure` | `application` / `jobs` | handoff outcome `Failed` 或 target permanently rejected。 | 否;manual / downstream repair。 | `HandoffStatus::Failed`;cleanup may remain blocked。 |

---

## 9. 错误映射表

| 内部错误 | HTTP / RPC / Event 映射 | 调用方应如何处理 |
|---|---|---|
| `ContractError::InvalidCarrier`;`ApiError::InvalidEntryMetadata` | `SandboxPublicErrorKind::Validation`;entry `Rejected`。 | 修正 DTO / metadata / selector;不得用同一 digest 重试 mutation。 |
| `ContractError::UnsupportedProtocolVersion` | `UnsupportedVersion`;consumer `Delayed` 或 `Quarantined`。 | 升级 producer 或路由到兼容 consumer;当前事件不得写 core truth success。 |
| `ApplicationError::ReferenceUnresolved` | `ReferenceUnresolved`;consumer `Delayed`;query `Unavailable` / `MissingProjection`。 | 若是外部引用暂不可用,等待 refresh / upstream event;若是 request ref 错误,调用方修正。 |
| `WorkerError::UnsafeExternalBody`;`DomainError::ForbiddenExternalBodyPersistence` | `ForbiddenExternalBody`;consumer `Quarantined`;command `Rejected`。 | 安全隔离;不得保存 external body;需要上游提供 body-free summary / ref。 |
| `ApplicationError::NotAuthorized` | Command `NotAuthorized`;Query `NotVisible` / `Restricted` surface。 | 不暴露 view body;调用方需更换 actor / scope 或停止请求。 |
| `ApplicationError::VersionConflict` | `VersionConflict`;job item retryable failed。 | fresh-read 后重试;不得覆盖 committed version。 |
| `ApplicationError::IdempotencyConflict` | `IdempotencyConflict`;entry `Rejected`;stored replay 不执行。 | 使用新 idempotency key 或修正 duplicate digest;不得自动 replay。 |
| `ApplicationError::DuplicateMissingResult` | `DuplicateMissingResult`;command / consumer / job failure surface。 | 进入 manual investigation;不得重跑 mutation、consumer 或 job。 |
| `DomainError::PolicyFailClosedBypass` | `PolicyFailClosed`;command `Rejected`;failure classification 可写。 | 等上游 policy summary / authorization summary 恢复后重新发起;不可 fallback allow。 |
| `DomainError::WeakBoundaryFallbackRejected`;`BoundaryCoherenceViolation` | `BoundaryRejected`;command `Rejected` / `Failed`。 | 修复 boundary requirement / backend capability;不得 silent degrade。 |
| `InfraError::AdapterUnavailable`;`TransactionBeginFailed` | `AdapterUnavailable`;command `Pending/Failed`;consumer `Delayed`;query `Unavailable/Degraded`;job `PartialFailed/Skipped`。 | 按 Step 13/14 retry/backoff;不改 core truth success。 |
| `InfraError::AdapterDisabled`;`RuntimeBuilderFailed` due config | `Disabled`;startup blocked / job skipped。 | 配置设计或运维修复;不得让 disabled adapter 关闭 hard guard。 |
| `ApplicationError::NoWriteViolation` | `NoWriteViolation`;query failed surface。 | implementation bug;停止该 query path,记录 safe audit / log,不得补写。 |
| `ApplicationError::JobNoRepairViolation` | `Validation` 或 `Internal`;job report `Failed`。 | job 只能报告 / mark read side;不得修 core truth。 |
| `ApplicationError::ProjectionMissing`;`QueryMaterialDegraded` | Query `MissingProjection` / `Degraded`;不一定生成 public error。 | query 调用方读取降级 marker;maintenance job 可后续 rebuild,query 不触发 rebuild。 |
| `RelayError::RetryablePublishFailure` | relay `Retryable`;job report `PartialFailed`。 | relay retry job 后续重试;source truth 不回滚。 |
| `RelayError::DeadLetter` | relay `DeadLetter`;job report failed/dead-letter item。 | manual review;只有新 source event 才能创建新 relay record。 |
| `HandoffError::RetryableDeliveryFailure` | `HandoffStatus::Retryable`;job report partial failed。 | handoff retry job 后续重试;capture truth 不回滚。 |
| `HandoffError::PermanentDeliveryFailure` | `HandoffStatus::Failed`;job report failed item。 | downstream / operations 处理;cleanup may remain blocked。 |
| `DomainError::CleanupGuardRejected` | query cleanup readiness `Blocked/Pending`;job `Skipped` / `Failed`;public `PolicyFailClosed` when command attempts release。 | 等 guard allowed 或 investigation handoff complete;不得释放。 |
| `DomainError::RedlineContainmentRequired` | `Quarantined` / `PolicyFailClosed`;redline containment status pending/contained。 | 安全调查;cleanup / release / launch 保持阻断。 |
| `ApplicationError::CursorInvariantViolation`;`TransactionCommitFailed`;`RollbackFailed`;`InfraError::OutcomeClassificationMissing` | `Internal`;safe reason only。 | manual integrity / design review;不得自动修复或伪造 evidence。 |

---

## 10. 异常分支处理表

| 场景 | 检测位置 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|---|
| command DTO / selector / metadata invalid | API entry adapter / application input factory | 不 begin mutation UoW;返回 rejected `Validation`;若已 reserve 但未写 truth,按 Step 11 rollback / idempotency fail 策略处理。 | safe log;一般不发 relay。 |
| required external ref unresolved | reference resolver / application service | command 可 rejected / pending;consumer delayed;query unavailable / missing;不得构造 fake ref。 | accepted rejection 可写 audit;delayed consumer receipt 保存。 |
| forbidden external body marker present | entry / consumer / capture / policy / observability handoff mapper | quarantine or reject;丢弃 raw body,只保留 marker / safe reason。 | 写 quarantine receipt / safe audit;不发业务 success event。 |
| actor not authorized / not visible | visibility resolver / query access decision | command rejected;query 返回 `NotVisible` / `Restricted` 且 view body redacted / None。 | command rejection 写 audit;query 不写 truth。 |
| policy missing / stale / conflicted | policy summary port / domain policy decision | 生成 fail-closed decision 或 rejected result;不得 allow。 | 写 policy decision audit / failure event if formal payload exists。 |
| boundary unsupported / weak fallback | boundary requirement builder / backend capability outcome | `BoundaryRejected`;若 adapter unavailable,映射 pending / failed;不创建 coherent boundary。 | 写 boundary decision audit;relay only if canonical payload source exists。 |
| isolation backend launch unavailable | isolation backend port outcome | run 保持 failed / pending surface;不执行 tools semantic execution;不保存 raw backend response。 | 写 failure classification / run audit if accepted path。 |
| capture adapter partial / failed | capture port outcome | 保存 capture status partial/failed with material refs only;handoff failure 不回滚 capture。 | 写 capture audit / relay if payload source完整。 |
| handoff target mismatch | handoff feedback consumer / retry job | quarantine feedback;不修改 capture truth;不重写 target。 | 写 quarantine receipt;可写 handoff mismatch safe audit。 |
| handoff retryable / permanent failure | handoff port outcome | update `HandoffStatus::Retryable` or `Failed`;cleanup guard stays blocked if material/investigation not complete。 | 写 handoff audit / job report;不回滚 capture。 |
| redline detected | redline command / consumer / safety job | persist containment;release / cleanup / launch blocked until investigation handoff and guard permit。 | 必须写 redline audit / containment record;relay if canonical event exists。 |
| cleanup guard not allowed | cleanup / reaper job | skip release;record blocked / pending report item;不得删除 evidence 或 release handle。 | 写 job report;guard evaluation audit if truth changed。 |
| query selector lacks callable finder | query service selector normalization | 按 Step 9/11 返回 `Validation` / `MissingProjection` / `Degraded`;不扫描 storage、不拼 ref。 | 不写 audit / relay;safe debug log allowed。 |
| query attempts write / rebuild / retry / release | query service guard / UoW manager | return `NoWriteViolation`;do not commit staged data;block implementation path。 | 写 safe audit / log because it is implementation defect。 |
| projection / snapshot missing | query / projection rebuild job | query returns `MissingProjection` / `Degraded`;job item degraded/failed;core truth unchanged。 | query no;job report yes。 |
| relay payload source missing before append | source transaction relay builder | do not append relay;stored result has empty relay refs or rejected result according to flow;source truth may still commit if event optional。 | audit source mutation;no relay event。 |
| relay publish retryable / dead-letter | relay publish job | update relay status in relay transaction;source truth untouched。 | job report yes;dead-letter requires operations review surface。 |
| duplicate request with completed stored result | idempotency repository reserve | rollback/no-op current UoW;return stored command / receipt / report;do not re-execute。 | no new business audit;safe replay log optional。 |
| duplicate record completed but stored result missing | stored result repository `get_result` | return `DuplicateMissingResult`;do not recompute;mark recovery blocker。 | safe audit/log and operations report required。 |
| version conflict | repository save with expected_version | rollback current UoW;return conflict;caller/job may fresh-read retry later。 | safe log;business audit only if formal conflict record exists。 |
| cursor allocation failure | UoW cursor assign after staged writes | rollback;return internal / adapter unavailable depending cause;no cursor visible。 | safe log;manual review if invariant issue。 |
| commit failure | UoW commit | do not assume success;surface internal;manual integrity check required。 | safe audit/log if available outside failed tx;no fake success。 |
| rollback failure | UoW rollback | surface internal;block retry until staging visibility is confirmed;no staged cursor / result can be exposed。 | safe audit/log and manual integrity review required。 |
| job item failure | operations job per target UoW | record failed/skipped/degraded item and continue when safe;report `PartialFailed` / `Failed`;no core repair。 | job report yes;audit only when target truth changed formally。 |

---

## 11. 恢复口径表

| 场景 | 恢复分类 | 恢复方式 | 禁止行为 |
|---|---|---|---|
| validation / selector / metadata invalid | 不可重试;caller fix | 返回 `Validation`;调用方修正后新请求。 | 用默认值补缺字段;从 route / string 猜 selector。 |
| unsupported schema version | 不可自动重试 | producer 升级或兼容 consumer;当前事件 delayed/quarantined。 | 解析未知 payload body 后继续。 |
| external ref temporarily unavailable | 可重试 | reference refresh / upstream event 后重试;consumer delayed。 | 将 unavailable 当 allow 或写 resolved truth。 |
| policy missing / stale / conflicted | 不可业务继续;可等上游恢复 | fail-closed;上游 policy summary 恢复后重新评估。 | fallback allow;保存 policy DSL / approval body。 |
| adapter unavailable | 可重试 | 按 Step 13/14 retry/backoff;surface pending/degraded/skipped。 | adapter availability 决定 business allow。 |
| adapter disabled / config startup blocked | 不可自动重试 | 配置设计 / 运维修复后重新启动或重跑 job。 | disabled adapter 关闭 fail-closed、redline 或 no-egress guard。 |
| version conflict | 可重试 | fresh-read committed truth 后重试合法迁移。 | blind overwrite、fake 忽略 version。 |
| duplicate completed + stored result exists | 不执行恢复;正常 replay | 返回 stored public result / receipt / report。 | 重新执行 mutation 或重新 publish。 |
| duplicate missing stored result | 需人工介入 | 标记 blocker;检查 store / idempotency integrity;必要时回写设计。 | 重算 result、伪造 stored result、补发 relay。 |
| query missing projection | 非 query 恢复 | query 返回 `MissingProjection`;maintenance rebuild job 后续恢复。 | query rebuild / refresh / save projection。 |
| query degraded material | 非 query 恢复 | query 返回 degraded marker;maintenance / reconciliation report 后续刷新。 | query 反写 truth 或读取 raw adapter body。 |
| relay retryable | 可重试 | relay job 依据 retry/backoff 重投。 | 回滚 source truth;重建 payload from latest truth。 |
| relay dead-letter | 需人工介入 | operations review;只有新 source event 创建新 relay。 | 复活同一 dead-letter record 到 pending。 |
| handoff retryable | 可重试 | handoff retry job 重试 target delivery。 | 回滚 capture truth;删除 material refs。 |
| handoff failed | 需人工 / downstream 修复 | downstream / investigation 修复;cleanup guard 继续阻断。 | cleanup before required handoff complete。 |
| cleanup guard blocked | 等待条件变化 | investigation / material handoff / redline cleared 后重新 evaluate。 | release handle、delete evidence、mark cleanup complete。 |
| redline containment | 需安全介入 | containment + investigation handoff;直到 guard allowed。 | advisory-only、自动 release、继续 launch。 |
| commit / rollback / cursor invariant | 需人工完整性审查 | stop automatic retry;safe log;检查 durable/fake parity。 | 暴露 staged cursor、stored result、audit 或半提交 truth。 |
| job partial failure | 可重试部分目标 | 保存 report,下次按 scope / page / retry policy 重跑失败项。 | job 修 core truth 或隐藏 failed refs。 |

---

## 12. 审计、日志、事件与 report 口径

| 异常类别 | 审计 / 日志 / 事件要求 | 说明 |
|---|---|---|
| accepted / rejected domain decision | 写 `SandboxAuditTrace` 和 canonical relay when payload source exists。 | audit 与 source truth 同 UoW;relay append 不保证 publish。 |
| fail-closed / boundary rejected / high-risk blocked | 写 decision audit;必要时 failure classification。 | 不暴露 raw policy / backend body。 |
| consumer delayed / rejected / quarantined | 保存 typed consumer receipt / stored result if replayable。 | quarantine marker body-free。 |
| duplicate replay | 不写新的业务 audit;可写 safe replay log。 | duplicate must not create new trace / relay。 |
| duplicate missing result | 写 safe audit/log 或 operations report;标记 manual blocker。 | 不可通过事件补发修复。 |
| query degraded / missing / not visible | 默认不写 audit / event;返回 marker。 | Query no-write 优先。 |
| no-write violation / job no-repair violation | 写 safe audit/log;标记 implementation defect。 | 不通过补写消除错误。 |
| relay retryable / dead-letter | relay record / job report 更新;dead-letter 进入 operations review。 | source truth unchanged。 |
| handoff retryable / failed | handoff fact / job report 更新;cleanup guard 读取该状态。 | capture truth unchanged。 |
| redline / cleanup guard | 必须写 safety audit / containment / guard record。 | release / cleanup 仍需 guard allowed。 |
| commit / rollback / cursor integrity | safe log / operations report;不伪造 evidence alias 或测试结果。 | 若无法确认持久化可见性,停止自动恢复。 |

---

## 13. 禁止行为与 security redlines

| 禁止行为 | 触发错误 / surface | 恢复口径 |
|---|---|---|
| Query begin write UoW、refresh、rebuild、handoff、cleanup、release | `ApplicationError::NoWriteViolation`;public `NoWriteViolation`。 | 停止该 query path;implementation defect review;query 不补写。 |
| Job 修复 context / identity / policy / run / capture 等 core truth | `ApplicationError::JobNoRepairViolation`;job `Failed`。 | job 改为 report-only 或维护 read-side;不得 repair core truth。 |
| Handoff / relay failure 回滚 capture / source truth | `DomainError::NoRollbackInvariantViolation`;public `Internal`。 | 停止自动恢复;manual design / integrity review。 |
| Duplicate missing result 时重跑 mutation | `ApplicationError::DuplicateMissingResult`。 | manual blocker;检查 idempotency + stored result 一致性。 |
| Adapter / fake 解析 raw error string 驱动业务状态 | `InfraError::OutcomeClassificationMissing`;public `Internal`。 | 回写 adapter outcome enum / mapping;fake 与 durable 必须等价。 |
| External body 进入 sandbox truth | `DomainError::ForbiddenExternalBodyPersistence`;public `ForbiddenExternalBody`。 | quarantine / reject;只允许 body-free ref / digest / safe marker。 |
| Adapter availability 变成 business allow | `ApplicationError::Validation` / `InfraError`。 | policy / boundary owner 重新评估;availability 只表达技术可用性。 |
| Disabled adapter 关闭 fail-closed、redline、cleanup guard 或 no-egress | `InfraError::AdapterDisabled`;startup blocked / job skipped。 | 配置修复;不得软化 hard guard。 |
| Redline 被当 advisory-only | `DomainError::RedlineContainmentRequired`;public `Quarantined` / `PolicyFailClosed`。 | 安全调查;containment / cleanup guard 必须阻断。 |
| Page cursor / timestamp / id / trace / digest 当 truth cursor | `ApplicationError::CursorInvariantViolation`;public `Internal`。 | 停止自动发布 / stale marking;manual integrity review。 |
| Entry 模块直接访问 repository / adapter private state | `ApplicationError::Validation` / `Internal`。 | entry 只能经 application facade。 |
| 把 tools semantic execution、runtime agent loop、member lifecycle、artifact truth、observability store、policy definition / approval / allowlist / capability truth 写入 sandbox | `DomainError::BoundaryCoherenceViolation` / `Validation`。 | 回退设计边界;只保存 sandbox-owned truth / refs / body-free markers。 |

---

## 14. Historical material / blocker 处理

| 项目 | 状态 | Step 12 处理 |
|---|---|---|
| 旧 `03-详细设计.md` 的泛化失败口径 | historical_material | 未继承旧“backend failure / failed”一类到底的口径;本步按当前 Step 6~11 重建错误 taxonomy。 |
| 旧 README 的 Docker/gVisor / backend 失败线索 | historical_material | 未把旧 backend 产品或 raw container error 写成当前错误来源;adapter outcome 仍为抽象 port surface。 |
| Step 6 public error family 较粗 | contained_for_step_12 | 对外 public error 以 Step 8 细分后的 `SandboxPublicErrorKind` 为准;Step 6 仅作为 owner / carrier 来源。 |
| `SBX-DDD-FLOW-QUERY-001` | contained_for_step_12 | current callable surface 未开放的 selector 继续映射 `Validation` / `MissingProjection` / `Degraded`;不得扫描 storage 或拼 ref。 |
| 正式 `04-配置设计.md` 缺失 | open_downstream | 不阻塞 Step 12;retry/backoff/dead-letter threshold、disabled adapter binding 和 config owner 后续 Step 14 / 04 承接。 |
| 正式 `07-实施计划.md` 缺失 | open_downstream | 不阻塞 Step 12;进入 07 时必须同步 implementation ledger 和 planned boundary skeleton。 |

---

## 15. 回填草稿

正式 `03-详细设计.md` Step 19 装配时,§11 可按以下结构回填。本步不直接修改正式 `03`。

```md
## 11. 错误模型、异常分支与恢复口径

> 校准来源:
> - `design-calibration/03_ddd_step_06_object_contracts.md`
> - `design-calibration/03_ddd_step_08_protocol_contracts.md`
> - `design-calibration/03_ddd_step_09_function_flows.md`
> - `design-calibration/03_ddd_step_10_state_matrix.md`
> - `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md`
> - `design-calibration/03_ddd_step_12_error_recovery.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“错误类型表”“错误映射表”“异常分支处理表”“恢复口径表”和“禁止行为与 security redlines”,了解错误如何从对象、协议、flow、状态和事务契约收敛。

L4-sandbox 的 public error surface 使用 Step 8 已定义的 `SandboxPublicErrorKind`: `Validation`、`ReferenceUnresolved`、`ForbiddenExternalBody`、`NotAuthorized`、`NotVisible`、`VersionConflict`、`IdempotencyConflict`、`DuplicateMissingResult`、`BoundaryRejected`、`PolicyFailClosed`、`AdapterUnavailable`、`UnsupportedVersion`、`Quarantined`、`Disabled`、`NoWriteViolation` 和 `Internal`。内部错误按 owner 分为 `ContractError`、`DomainError`、`ApplicationError`、`InfraError`、`ApiError`、`WorkerError`、`JobsError` 以及 relay / handoff helper error,但所有内部错误都必须映射到 public error、query surface、consumer receipt、relay status、handoff status 或 job report。

`DomainError` 负责 invariant 与状态矩阵错误,包括 terminal reopen、policy fail-closed bypass、weak boundary fallback、boundary coherence violation、forbidden external body persistence、cleanup guard rejection、redline containment required、handoff target mismatch 和 no-rollback invariant violation。`ApplicationError` 负责 validation、reference unresolved、authorization / visibility、version conflict、idempotency conflict、duplicate missing result、no-write violation、job no-repair、cursor invariant、transaction begin / commit / rollback 和 query degraded。`InfraError` 负责 adapter unavailable / disabled、runtime builder failure 和 outcome classification missing;service / fake 不得解析 raw error string 或 adapter private map。

可重试错误只包括 fresh-read 后的 version conflict、adapter unavailable、relay retryable、handoff retryable、reference refresh unavailable、projection rebuild / derived / reconciliation 的 report-only partial failure 等。不可重试错误包括 validation、unsupported version、forbidden body、not authorized、terminal reopen、policy fail-closed bypass、weak fallback、query no-write、job no-repair、external body persistence、idempotency conflict。需要人工介入的错误包括 redline containment、cleanup blocked by investigation、relay dead-letter、handoff permanently failed、duplicate missing stored result、cursor invariant、commit / rollback integrity 和 unmapped internal error。

Query 只返回 read surface,不得写 audit、relay、truth、projection 或 stored result。`MissingProjection`、`Degraded`、`NotVisible` 和 `Restricted` 必须来自正式 projection / snapshot / visibility decision / degraded marker 来源,不得由 repository error 文本或 fake private map 合成。Consumer 使用 typed receipt 承载 delayed / rejected / quarantined / duplicate;relay publish failure 只更新 relay record / job report,不回滚 source truth;handoff failure 只更新 handoff status / report,不回滚 capture truth;job partial failure 只进入 report,不得修 core truth。

事务异常按 Step 11 处理:rollback 后 truth、trace、relay、stale、stored result、idempotency complete/fail 和 cursor 均不可见;cursor allocation failure 必须 rollback;commit / rollback integrity failure 不得自动恢复或伪造 success。Duplicate replay 只读取 stored result;stored result missing 必须返回 `DuplicateMissingResult`,不得重新执行 mutation、consumer 或 job。
```

---

## 16. Step 13 handoff items

| 后续 Step | 承接项 | 约束 |
|---|---|---|
| Step 13 concurrency / idempotency | idempotency key schema、request digest canonicalization、reservation conflict、same-key in-flight handling、expected version retry、duplicate replay under concurrent retry。 | 必须保留本步 `DuplicateMissingResult` 不重算、`VersionConflict` fresh-read retry、query no-write 和 job no-repair 口径。 |
| Step 14 config / external binding | adapter disabled/unavailable、retry/backoff/dead-letter thresholds、runtime builder startup blocked/degraded、lease/reaper cadence。 | 配置不得改变本步 retryability、fail-closed、cleanup guard、redline 或 no-egress redline。 |
| Step 15 observability / audit | safe audit/log/report fields、trace subject mapper、redaction marker、manual intervention surface。 | 不伪造 evidence alias;不保存 raw external body / raw adapter diagnostics。 |
| Step 16 test cuts | error mapping、illegal transition、query no-write、relay no-rollback、duplicate missing result、cursor invariant、fake/durable outcome parity。 | 只定义测试切口;不写真实执行结果。 |
| Step 17 implementation handoff | implementation boundary 必须包含已闭合的 error types、mapper、adapter outcome enum、stored result missing handling 和 no-write guard。 | 07 才能形成 commit boundary;当前不写实施计划。 |

---

## 17. 待确认事项

| 待确认 | 当前处理 | 是否阻塞 Step 12 |
|---|---|---|
| HTTP status / RPC status code 具体数值 | 本步只定义 transport-neutral public error / status surface;具体 transport mapping 若需要由 API 设计或实施阶段细化。 | 否 |
| retry/backoff/dead-letter 阈值 | 本步只定义 retryable / non-retryable / manual 分类;数值交 Step 13 / Step 14。 | 否 |
| `ApplicationError` 内部 detail 是否单独 enum | 本步给出可编码 detail 名称;正式 Step 19 可决定 `ApplicationErrorKind + detail` 或独立 detail enum,但 public mapping 不变。 | 否 |
| commit failure 后如何做 durable reconciliation | 本步规定必须 manual integrity review,不自动恢复;具体运维手册后续文档承接。 | 否 |

---

## 18. 自检

| 检查项 | 结论 |
|---|---|
| 是否创建 Step 12 中间产物 | 通过。本文为 `03_ddd_step_12_error_recovery.md`。 |
| 是否修改正式 `03-详细设计.md` | 未修改。正式文档仍等 Step 19 装配。 |
| 是否提前创建 Step 13 | 未创建。 |
| 是否输出错误类型表 | 通过。见 §8。 |
| 是否输出错误映射表 | 通过。见 §9。 |
| 是否输出异常分支处理表 | 通过。见 §10。 |
| 是否输出恢复口径表 | 通过。见 §11。 |
| 是否覆盖 Step 10 状态矩阵错误 | 通过。terminal reopen、fail-closed bypass、weak boundary fallback、query write、job core repair、no-rollback、duplicate recompute、adapter outcome、cursor misuse、external body persistence均已映射。 |
| 是否覆盖 Step 11 事务失败 | 通过。begin / commit / rollback、version conflict、cursor allocation、projection missing、relay dead-letter、handoff failed、duplicate missing stored result均已定义。 |
| 是否保持 query no-write | 通过。query degraded / missing / not visible 只返回 surface,不写 truth、audit、relay、projection 或 stored result。 |
| 是否保持 relay / handoff no-rollback | 通过。publish / handoff failure 只更新 relay / handoff / report surface,不回滚 source truth / capture truth。 |
| 是否保持 job no core repair | 通过。job partial failure 只进 report/read side,不得修 core truth。 |
| 是否混入禁止范围 | 未混入。未把 tools semantic execution、runtime agent loop、member lifecycle、artifact truth、observability store、policy definition / approval / allowlist / capability truth 写入 sandbox 错误恢复。 |
| 是否发现上游 blocker | 未发现阻塞 Step 12 的上游 blocker。 |
| 是否需要提交 commit | 否。用户未要求提交。 |

---

## 19. 进入下一步条件

```text
当前 Step 12 已完成并停在用户审查点。

用户确认后,才能进入 Step 13 `定义并发、幂等与重入保护`。
进入 Step 13 前必须读取:
1. `project_execution_ledger.md`
2. `03_ddd_calibration_flow.md`
3. `03_ddd_step_12_error_recovery.md`
4. `03_ddd_step_11_persistence_transaction_consistency.md`
5. `03_ddd_step_09_function_flows.md`
6. `03_ddd_step_10_state_matrix.md`
7. 详细设计 SOP Step 13
8. 详细设计书写规范 §5.12
9. 真相源标准中 idempotency duplicate replay、stored job report、expected version、same-key conflict、retry boundary 和 no re-entry 相关条目

Step 13 必须闭口 idempotency、expected version、重复控制信号、并发冲突和重入保护;
不得在用户确认前创建 Step 13 文件。
```
