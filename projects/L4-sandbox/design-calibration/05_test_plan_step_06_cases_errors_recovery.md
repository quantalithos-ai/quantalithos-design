# Step 6 分件 D. 38个命名错误与恢复用例矩阵

> 父Step: `05_test_plan_step_06_cases.md`
> 正式来源: `03-详细设计.md` §11;`03_ddd_step_12_error_recovery.md` §7~§13
> 生成日期: 2026-07-12
> 状态: reviewed_passed_with_step_06
> 边界: 本分件逐项验证typed error与正式surface,不得只比较错误字符串。manual review / intervention是恢复disposition,不是验收签署或已发生事实。

---

## 1. 共用错误断言

| 断言面 | 固定要求 |
|---|---|
| producer | 必须由正式contract / domain / application / infra / entry / relay / handoff触发,不能由测试专用错误代替。 |
| safe surface | public error、query surface、consumer receipt、relay status或job report必须符合owner;不暴露raw SQL / IO / HTTP / SDK body / panic / stack。 |
| 副作用 | rejected前后写集、rollback、no-truth-rewrite、no-recompute、guard状态必须可判定。 |
| 恢复 | 只允许正式new command / refresh / retry job / new relay / new handoff / manual integrity流程;不得修旧truth、result、receipt或report。 |
| planned evidence | 全部映射PER-SBX-026;涉及原子性 /幂等 /安全时叠加PER-SBX-022 /024 /029 /032 /035。 |

## 2. 错误用例矩阵

| 用例ID | 正式错误 / producer触发 | 预期surface | 副作用与恢复断言 | CUT / PER |
|---|---|---|---|---|
| TC-SBX-ERR-001 | `ContractError::InvalidCarrier`: required空、非法enum payload或ref set结构错 | `Validation`;entry `Rejected` | reserve / service / port调用0;调用方修正新输入 | CUT-SBX-001/026;PER-SBX-001/026 |
| TC-SBX-ERR-002 | `ContractError::UnsupportedProtocolVersion`: DTO / inbound schema不支持 | `UnsupportedVersion`;consumer `Delayed` / `Quarantined` | 不写core success;producer升级后才可新投递 | CUT-SBX-011/026;PER-SBX-011/026 |
| TC-SBX-ERR-003 | `DomainError::InvalidStateTransition`: 调用未列合法迁移 | `Validation`或safe `Internal` | owner object / group不变;按合法command重新发起 | CUT-SBX-014~021/026;PER-SBX-014~021/026 |
| TC-SBX-ERR-004 | `DomainError::TerminalStateReopen`: Rejected / Closed / Released / handoff Delivered / relay Published / DeadLetter等重开 | `Validation` / `BoundaryRejected` | terminal truth保持;恢复必须new truth / relay / authorized handoff path | CUT-SBX-014~020/026;PER-SBX-014~020/026 |
| TC-SBX-ERR-005 | `DomainError::PolicyFailClosedBypass`: missing / stale / conflict / unsafe被映射allow | `PolicyFailClosed`;command Rejected / Blocked | run / backend调用0;新summary后新evaluate | CUT-SBX-005/016/026;PER-SBX-005/016/026 |
| TC-SBX-ERR-006 | `DomainError::WeakBoundaryFallbackRejected`: unsupported / incomplete被降级coherent | `BoundaryRejected` | 无Coherent / active handle / launch;修正式requirements / capability | CUT-SBX-004/015/026/034;PER-SBX-004/015/026/034 |
| TC-SBX-ERR-007 | `DomainError::BoundaryCoherenceViolation`: 四维、handle、context / identity不一致 | `BoundaryRejected`或`AdapterUnavailable` | partial group不可见;不host fallback;new boundary flow | CUT-SBX-004/015/026;PER-SBX-004/015/026 |
| TC-SBX-ERR-008 | `DomainError::ForbiddenExternalBodyPersistence`: raw policy / artifact / capture / adapter body进入truth | `ForbiddenExternalBody`;consumer Quarantined | 全carrier无marker外正文;安全阻断,上游改body-free ref | CUT-SBX-001/026/029;PER-SBX-001/026/029 |
| TC-SBX-ERR-009 | `DomainError::NoRollbackInvariantViolation`: handoff / relay failure试图回滚committed source / capture | `Internal`;manual review | source / capture保持;只写owning failure marker / report | CUT-SBX-006/012/017/026;PER-SBX-006/012/017/026 |
| TC-SBX-ERR-010 | `DomainError::CleanupGuardRejected`: non-Allowed、handoff / investigation pending仍release | `PolicyFailClosed` / `BoundaryRejected`;job Skipped / Failed | release=0;等待guard正式变化后new flow | CUT-SBX-007/018/026/035;PER-SBX-007/018/026/035 |
| TC-SBX-ERR-011 | `DomainError::RedlineContainmentRequired`: detected后advisory-only / launch / release | `Quarantined` / `PolicyFailClosed` / safe Internal | containment truth与cleanup block保留;人工安全调查 | CUT-SBX-007/018/026/035;PER-SBX-007/018/026/035 |
| TC-SBX-ERR-012 | `DomainError::HandoffTargetMismatch`: feedback target与committed relation不符 | consumer `Quarantined`;public `Quarantined` | handoff / capture / redline / cleanup不变;禁止猜target | CUT-SBX-011/017/018/026;PER-SBX-011/017/018/026 |
| TC-SBX-ERR-013 | `ApplicationError::Validation`: selector / scope / job input / current finder非法 | `Validation`或formal degraded surface | 不scan /拼ref /mutate;调用方修正input | CUT-SBX-010/013/023/026;PER-SBX-010/013/023/026 |
| TC-SBX-ERR-014 | `ApplicationError::ReferenceUnresolved`: required external / context / projection / report ref缺失 | `ReferenceUnresolved`;consumer Delayed;query Unavailable / MissingProjection | 不猜truth;外部暂不可用可refresh,错误ref须修正 | CUT-SBX-003/010/011/026;PER-SBX-003/010/011/026 |
| TC-SBX-ERR-015 | `ApplicationError::NotAuthorized`: actor不在scope或visibility hidden | Command `NotAuthorized`;Query `NotVisible` / `Restricted` | response无view body;不audit raw actor body;修正authority | CUT-SBX-003/010/026;PER-SBX-003/010/026 |
| TC-SBX-ERR-016 | `ApplicationError::VersionConflict`: stale expected version | `VersionConflict`;job item retryable failed | current UoW全rollback;fresh-read + same key / digest才可重试 | CUT-SBX-023/025/026;PER-SBX-023/025/026 |
| TC-SBX-ERR-017 | `ApplicationError::IdempotencyConflict`: same key不同digest / operation | `IdempotencyConflict`;entry Rejected | original record / result不覆盖;新语义使用new key | CUT-SBX-024/026;PER-SBX-024/026 |
| TC-SBX-ERR-018 | `ApplicationError::DuplicateMissingResult`: completed但result缺失 / wrong kind | `DuplicateMissingResult` | resolver / backend / mutation / result重算=0;manual integrity | CUT-SBX-021/024/026;PER-SBX-021/024/026 |
| TC-SBX-ERR-019 | `ApplicationError::NoWriteViolation`: Query尝试write UoW / refresh / rebuild / handoff / release | `NoWriteViolation`;query failed safe surface | mutation=0;停止错误query path;只允许safe diagnostic | CUT-SBX-010/019/026;PER-SBX-010/019/026 |
| TC-SBX-ERR-020 | `ApplicationError::JobNoRepairViolation`: maintenance试图修core truth | `Validation` / `Internal`;job Failed | core write=0;失败report可replay;修实现而非truth | CUT-SBX-013/019/026;PER-SBX-013/019/026 |
| TC-SBX-ERR-021 | `ApplicationError::CursorInvariantViolation`: page / timestamp / id / version / trace / digest作truth cursor | safe `Internal`;manual review | 不保存marker / result;cursor不可猜测转换 | CUT-SBX-002/023/026;PER-SBX-002/023/026 |
| TC-SBX-ERR-022 | `ApplicationError::TransactionBeginFailed`: write UoW begin失败 | `AdapterUnavailable` / `Internal` | reserve与全部write=0;依赖恢复后原retry identity | CUT-SBX-022/026;PER-SBX-022/026 |
| TC-SBX-ERR-023 | `ApplicationError::TransactionCommitFailed`: commit失败 /无法证明原子可见 | safe `Internal`;manual intervention | 不自动重放side effect;先核idempotency / result / truth integrity | CUT-SBX-022/026;PER-SBX-022/026 |
| TC-SBX-ERR-024 | `ApplicationError::RollbackFailed`: rollback未确认隐藏staged writes | safe `Internal`;manual integrity | 不宣称成功或clean rollback;不伪造stored result / evidence | CUT-SBX-022/026;PER-SBX-022/026 |
| TC-SBX-ERR-025 | `ApplicationError::ProjectionMissing`: query / rebuild缺projection或snapshot | Query `MissingProjection` / `Degraded`;job item Degraded | query不rebuild;job可由正式selection后续重跑 | CUT-SBX-010/019/026;PER-SBX-010/019/026 |
| TC-SBX-ERR-026 | `ApplicationError::QueryMaterialDegraded`: status / relation / ref / report部分缺失 | Query `Degraded` | 返回safe markers;write / refresh / repair=0 | CUT-SBX-010/019/026;PER-SBX-010/019/026 |
| TC-SBX-ERR-027 | `InfraError::AdapterUnavailable`: resolver / backend / handoff / publisher / store暂不可用 | `AdapterUnavailable`;Delayed / Retryable / Degraded / PartialFailed按owner | 不改业务success;正式retry / backoff且identity不变 | CUT-SBX-004~013/026;PER-SBX-004~013/026 |
| TC-SBX-ERR-028 | `InfraError::AdapterDisabled`: profile禁用required adapter | `Disabled`;startup blocked / job skipped | hard guard仍启用;配置修复后new generation | CUT-SBX-021/026/028;PER-SBX-021/026/028 |
| TC-SBX-ERR-029 | `InfraError::OutcomeClassificationMissing`: adapter无formal outcome或fake / durable不一致 | safe `Internal`;manual review | 不解析error string / default success;0 business allow | CUT-SBX-021/026/031;PER-SBX-021/026/031 |
| TC-SBX-ERR-030 | `InfraError::RuntimeBuilderFailed`: required port / config summary / profile ref缺失 | `AdapterUnavailable` / `Disabled` / `Internal`;startup blocked | 发布0或完整generation;无partial handle / fallback | CUT-SBX-028/031/026;PER-SBX-028/031/026 |
| TC-SBX-ERR-031 | `ApiError::InvalidEntryMetadata`: actor / trace / key / digest无法规范化 | `Validation`;entry Rejected | service / repository / port调用0;修正request | CUT-SBX-002/026/031;PER-SBX-002/026/031 |
| TC-SBX-ERR-032 | `WorkerError::EnvelopeInvalid`: event id / source / schema / dedup / digest缺失或source不可信 | receipt `Rejected` / `Quarantined` | reserve前失败;core / marker / receipt truth不伪造 | CUT-SBX-011/026/031;PER-SBX-011/026/031 |
| TC-SBX-ERR-033 | `WorkerError::UnsafeExternalBody`: event payload / snapshot含forbidden marker | receipt `Quarantined`;`ForbiddenExternalBody` | 不保存payload;不delayed重试不可信正文 | CUT-SBX-011/026/029;PER-SBX-011/026/029 |
| TC-SBX-ERR-034 | `JobsError::ReportPersistenceFailed`: report / stored job result保存失败 | job `Failed`;safe `Internal` | 不宣称report / job success;按commit状态retry或manual,不伪report | CUT-SBX-013/022/026;PER-SBX-013/022/026 |
| TC-SBX-ERR-035 | `RelayError::RetryablePublishFailure`: exact attempt得到Retryable或post-call relay version conflict | relay `Retryable`或local CAS recovery;job `PartialFailed` | source truth不回滚;CAS loser不重新publish;future retry创建new committed attempt | CUT-SBX-012/020/026;PER-SBX-012/020/026 |
| TC-SBX-ERR-036 | `RelayError::DeadLetter`: outcome DeadLetter / retry exhausted | relay `DeadLetter`;failed item | terminal record不复活;仅new source event可new relay;manual review | CUT-SBX-012/020/026;PER-SBX-012/020/026 |
| TC-SBX-ERR-037 | `HandoffError::RetryableDeliveryFailure`: exact target attempt得到Retryable | target progress `Retryable`;`HandoffFactStatus`从完整set重新派生;job PartialFailed | capture / guard不回滚;future retry先commit新`Attempting` attempt;不重用原attempt | CUT-SBX-006/017/026;PER-SBX-006/017/026 |
| TC-SBX-ERR-038 | `HandoffError::PermanentDeliveryFailure`: exact target attempt permanent reject / Failed | target progress `Failed`;聚合状态机械派生;failed item | capture保持;cleanup可继续blocked;material handoff不写`DeadLetter`;downstream / manual处理 | CUT-SBX-006/017/026;PER-SBX-006/017/026 |

## 3. 错误闭集与恢复停审

| 审查项 | 结论 | 后续边界 |
|---|---|---|
| 38个正式错误是否逐项有producer | 通过,38 /38 | Step 7提供触发数据;Step 9选择injection point |
| public / receipt / relay / report owner是否混淆 | 否 | 不把所有错误压成HTTP / string |
| retryable是否由entry猜测 | 否 | 由application mapper / formal outcome决定 |
| no-recovery / manual是否伪造签署 | 否 | 只定义disposition,无真实ticket / sign-off |
| 错误是否改写非owner truth | 否 | no rollback / no recompute / no repair均显式断言 |
