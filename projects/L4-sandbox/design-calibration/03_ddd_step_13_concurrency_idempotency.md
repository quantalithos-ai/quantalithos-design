# Step 13. 定义并发、幂等与重入保护

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 13
> 回填章节: `03-详细设计.md` §12 并发、幂等与重入保护
> 生成日期: 2026-07-09
> 状态: completed_wait_user_review
> 所属流程: `03_ddd_calibration_flow.md`
> 本 Step 口径: 在 Step 8 协议契约、Step 9 函数级 flow、Step 11 持久化 / 事务一致性和 Step 12 错误恢复口径基础上,定义 L4-sandbox 的并发冲突、幂等键、重复请求 / 事件 / job 和重入保护策略。本步不写实现代码、具体锁实现、配置 key、阈值数值、真实测试结果、run_id、evidence alias、验收签署、实施 commit boundary 或正式 `03-详细设计.md`。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 13 | 是。Step 12 审查点后用户已回复“同意”,允许进入 Step 13。 |
| 项目级台账是否允许进入 Step 13 | 是。`project_execution_ledger.md` 原恢复点为 Step 12 `pass_wait_review`,用户确认后可进入 Step 13。 |
| 文档级 flow 是否允许进入 Step 13 | 是。`03_ddd_calibration_flow.md` 原记录 Step 13 `blocked_by_step_12`,用户确认后门禁满足。 |
| 是否已读取 Step 12 错误恢复口径 | 是。duplicate missing result、version conflict、query no-write、relay / handoff no-rollback、job no-repair 和 adapter outcome mapping 已作为本步约束。 |
| 是否已读取 Step 11 持久化 / 事务契约 | 是。`Versioned<T>`、`expected_version`、UoW staging / rollback / cursor / stored replay / fake parity 是并发控制基础。 |
| 是否已读取 Step 8 / Step 9 协议与 flow | 是。Command / Query / Consumer / Relay / Job 的 DTO、receipt、report、stored result 和 transaction template 已作为本步输入。 |
| 是否已读取详细设计 SOP Step 13 | 是。本步必须输出并发场景表、幂等键表、重入保护表,并回答重复事件 / job 如何处理。 |
| 是否已读取详细设计书写规范 §5.12 | 是。本章只写真实影响实现的并发 / 幂等场景,且幂等键必须可从请求、事件或 job 参数确定。 |
| 是否已读取真相源闭环标准相关条目 | 是。重点检查 idempotency reserve 承接 operation context/channel、stored result typed save/get、duplicate replay、不用 source event ref / job run id / trace id 替代 key、same-key conflict、retry boundary 和 no re-entry。 |
| 是否发现阻塞 Step 13 的上游 blocker | 未发现阻塞本步生成的 blocker。`04/07` 缺失仍为 downstream gap;Step 11 direct selector gap 已作为 current callable boundary 收口。 |

---

## 2. 本步目标

本步把并发、幂等和重入保护固定到实现者可以直接编码的规则,防止以下风险:

- 同一 command / consumer / job 被重复调用后再次执行 mutation、publish、handoff、cleanup 或 rebuild。
- 不同 idempotency key 并发修改同一 truth / marker / relay / projection 后覆盖已提交版本。
- consumer redelivery、job retry、relay publish retry、handoff retry 和 reaper 扫描重复处理同一 target。
- query 通过“刷新 / 修复 / 重建 / release”绕过 no-write 规则。
- duplicate missing result 被错误实现为从 current truth 重算结果。
- fake repository 通过私有 map、自动提交、忽略 version 或扫描 storage 得到与 durable adapter 不一致的语义。

本步不处理:

- Step 14 的 retry/backoff/dead-letter/lease/reaper/projection cadence 具体配置 key 和数值。
- Step 15 的完整 observability / audit field catalog。
- Step 16 的测试用例全集或真实执行结果。
- Step 17 / Step 19 / `07-实施计划.md` 的 implementation boundary 和 commit 切分。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `project_execution_ledger.md` | 已读取 | 确认当前恢复点、用户门禁和 downstream gap。 |
| `03_ddd_calibration_flow.md` | 已读取 | 确认 Step 1~12 已完成,正式 `03` 仍不得修改。 |
| `03_ddd_step_06_object_contracts.md` | 已读取 | 提供 `SandboxServiceCallContext`、`SandboxOperationChannel`、`SandboxIdempotencyRecord`、`SandboxStoredOperationResult`、entry envelope 和 job helper。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已读取 | 提供 idempotency repository、stored result repository、truth repository、relay repository、projection / derived repository 和 fake parity。 |
| `03_ddd_step_08_protocol_contracts.md` | 已读取 | 提供 command metadata、query no-write surface、consumer envelope / receipt、job input / report、stored replay 和 public error kind。 |
| `03_ddd_step_09_function_flows.md` | 已读取 | 提供 command reserve / duplicate / save / complete 顺序、query read-only、consumer receipt、relay no-rollback 和 job report replay 模板。 |
| `03_ddd_step_10_state_matrix.md` | 已读取 | 提供 idempotency / stored replay 状态矩阵、consumer receipt / job report 状态和非法迁移口径。 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已读取 | 提供 logical store unique key、expected version、cursor、rollback visibility、query index current boundary 和 fake / durable parity。 |
| `03_ddd_step_12_error_recovery.md` | 已读取 | 提供 `VersionConflict`、`IdempotencyConflict`、`DuplicateMissingResult`、`NoWriteViolation`、retryable / non-retryable / manual-intervention 分类。 |
| 正式 `00/01/02` | 已读取过并在前序 Step 承接 | 提供 sandbox truth ownership、coherent boundary、policy fail-closed、capture / handoff 分层、cleanup / redline、query no-write、job no-repair 和 security redlines。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 恢复项目级台账、文档级 flow 和 Step 12 当前文件。 | done | 确认用户已允许进入 Step 13。 |
| 2 | 读取 Step 13 SOP、详细设计书写规范 §5.12 和真相源闭环标准 idempotency / stored replay / operation context 条目。 | done | 明确三张表和重复 event / job 处理结果为必出。 |
| 3 | 从 Step 8/9/11/12 抽取 command / consumer / job / relay / projection / cleanup 的并发修改点。 | done | 形成并发场景输入池。 |
| 4 | 定义幂等 owner、key source、digest canonicalization、same-key duplicate / conflict / in-flight / failed record 规则。 | done | 防止 service / fake 自造 key 或重算结果。 |
| 5 | 输出并发场景表、幂等键表和重入保护表。 | done | 实现者可按表写 repository、service 和 fake parity。 |
| 6 | 输出 retry / duplicate / conflict 恢复口径、测试 handoff、回填草稿和 Step 14 handoff。 | done | Step 14 只需承接数值和外部 binding,不重写语义。 |
| 7 | 更新 `03_ddd_calibration_flow.md` 和项目级台账。 | done | 当前恢复点停在 Step 13 审查点,不跨到 Step 14。 |

---

## 5. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 哪些处理流可能并发修改同一资源 | API / worker command 之间可能并发修改 context、identity、boundary、policy decision、run、capture / handoff、安全组、cleanup guard、redline;consumer 与 job 可能并发修改 reference state、handoff fact、relay record、safety group;job 之间可能并发修改 projection、derived state、reconciliation latest index、lease / orphan / cleanup marker。 |
| 哪些接口、事件或 job 可能被重复调用 | 所有 Command、所有 Inbound Event Consumer、所有 Operations Job 都必须视为可重复;Query 可重复但只读,不创建 idempotency record;Outbound relay publish 是 job target 级可重复,不按 public API 幂等键直接暴露。 |
| 幂等键来自请求、事件、job 参数还是数据库唯一约束 | Command 来自 command metadata `idempotency_key`;Consumer 来自 inbound envelope `dedup_key`;Job 来自 `SandboxJobInputDto.idempotency_key_ref`;repository unique key 为 `(operation_name, channel, idempotency_key)`。业务 unique key / expected version 只保护目标资源,不能替代 idempotency key。 |
| 重复请求应该返回既有结果、跳过、覆盖还是报错 | Completed + same digest 返回 stored command result / consumer receipt / job report;same key + different digest 返回 `IdempotencyConflict`;same key while existing record still `Reserved` 返回 retryable `VersionConflict` / in-flight surface,不重入;completed 但 stored result missing 返回 `DuplicateMissingResult`;failed record 不可复用,需要新 key 或人工恢复。 |
| 并发冲突如何测试 | fake / durable contract tests 必须覆盖 atomic reserve race、same-key digest mismatch、expected version conflict、rollback hidden staged writes、duplicate stored replay、duplicate missing result no recompute、consumer redelivery no duplicate write、job duplicate no rerun、relay publish no source rollback、query no-write。 |

---

## 6. 当前文档问题诊断

| 问题来源 | 风险 | 本步处理 |
|---|---|---|
| Step 6 `SandboxIdempotencyRecord` 字段未显式包含 channel | 若 repository 只按 operation + key 唯一,API / worker / job / consumer 可能互相污染 duplicate 空间。 | 本步固定 repository unique key 为 `(operation_name, channel, idempotency_key)`;record / storage schema 必须承接 `SandboxServiceCallContext.channel`。 |
| Step 7 `get_record(operation_name,idempotency_key)` 未带 channel | 若实现照旧签名,无法按 operation context/channel 查询 exact record。 | 本步要求 Step 19 回填时修正为 channel-aware get/reserve 语义;fake 不得硬编码 channel。 |
| Step 8 job 有 `job_run_ref` | 若实现把 `job_run_ref` 当幂等 key,同一 job 重试会产生第二 report。 | 本步明确 `job_run_ref` 只用于一次运行标识 / trace,不得替代 `idempotency_key_ref`;digest 必须包含 job kind + scope + spec + page cursor。 |
| Step 8 consumer envelope 有 `source_event_ref` 和 `dedup_key` | 若实现用 source event ref 替代 dedup key,跨 producer 或 replay batch 会出现 key 空间漂移。 | 本步固定 consumer idempotency key 来自 `dedup_key`;`source_event_ref` 只进入 digest / trace / receipt,不能单独替代 key。 |
| Step 11 query logical index current boundary | 若 query 缺 finder 时扫描 storage 或反推 ref,会形成 fake-only 并发语义。 | 本步重申 query no-write / no-scan;缺 callable surface 返回 validation / missing / degraded,不维护 idempotency。 |
| Step 12 retryable 口径未给 retry identity | 若 retry 用 trace id / delivery count / retry counter 当 key,会破坏 duplicate replay。 | 本步定义 retry identity 必须仍是原 operation/channel/key + digest;retry counter 只可作为 report / scheduler metadata,不进入 truth key。 |

---

## 7. 通用并发与幂等规则

| 规则 | 正式口径 | 禁止替代 |
|---|---|---|
| idempotency owner | `application` 通过 `SandboxIdempotencyRepository.reserve(&uow, ctx)` 统一占位;Command / Consumer / Job 必须 reserve;Query 不 reserve。 | API / worker / job entry 私自写 idempotency record;domain object 保存幂等状态;query 写 record。 |
| operation key space | 唯一键为 `(operation_name, channel, idempotency_key)`;`channel` 必须从 `SandboxServiceCallContext` 复制。 | fake 根据 operation name 前缀猜 channel;只用 `idempotency_key` 全局唯一。 |
| request digest | entry canonicalization 生成 body-free deterministic digest;同一 key 重试必须 digest 相同。 | trace id、result id、clock、retry count、delivery count、raw body、adapter response、repository version 临时拼 digest。 |
| duplicate replay | completed + same digest 只能读取 `SandboxStoredOperationResult` 并映射 stored command result / receipt / report。 | 重新执行 resolver、backend、domain transition、publish、handoff、cleanup、job selection 或从 current truth 重算 result。 |
| duplicate conflict | same key + different digest 或 same key after terminal failed record 不能覆盖原 record。 | “最后一次请求为准”、自动 merge、删除原 record 后重试。 |
| in-flight duplicate | existing `Reserved` + same digest 表示首个请求仍拥有执行权;第二请求返回 retryable `VersionConflict` / in-flight surface,不得执行 mutation。 | 等待持锁线程并在 service 内重入;第二请求也开始执行。 |
| failed record | 如果 failure rollback 后 reservation 不可见,同 key 可重新 reserve;如果 failure record 已 durable visible 且无 replayable result,同 key 不可复用,调用方必须使用新 key或人工确认。 | `Failed -> Completed` same record;failed record 被 duplicate 当 success replay。 |
| expected version | 更新 existing truth / marker / projection / relay 必须使用 `Versioned<T>.version`;`expected_version=None` 只用于 create。 | page cursor、timestamp、trace id、stored result ref、truth cursor、source event version。 |
| version conflict | 当前 UoW rollback;返回 `VersionConflict`;caller / job 可 fresh-read 后用同一 idempotency key 重试同一 digest。 | overwrite committed version;fake auto-merge;job 修 core truth。 |
| query repeat | repeated query 是 read-only;可看到 commit 前或 commit 后一致快照,不保证幂等 result ref。 | query 创建 idempotency record、refresh reference、rebuild projection、retry relay、release cleanup。 |
| retry identity | retry / redelivery / rerun 仍使用原 operation/channel/key + digest;retry metadata 只进入 scheduler / report。 | retry counter、transport redelivery count、job run id、trace id 作为新 truth key。 |
| side-effect replay | stored duplicate 不产生新的 business audit / relay / handoff / report item;可有安全 replay log 但不得作为业务 truth。 | duplicate replay append 新 audit、publish event、mark stale、写 projection 或触发 cleanup。 |
| fake / durable parity | fake 必须模拟 UoW staging、rollback、unique key、expected version conflict、cursor、stored result、page order 和 no-scan。 | fake 私有 map 扫描、自动创建、忽略 version、rollback 后 staged writes 可见。 |

---

## 8. 并发场景表

| 场景 | 冲突资源 | 控制方式 | 失败错误 | 测试切口 |
|---|---|---|---|---|
| Same idempotency key command race | `sandbox_idempotency_records(operation_name,channel,key)` | atomic `reserve(&uow, ctx)` unique key;first gets `Reserved`,later same digest sees `Reserved` / `Completed`,different digest conflict。 | in-flight same digest -> retryable `VersionConflict`;different digest -> `IdempotencyConflict`;completed missing result -> `DuplicateMissingResult`。 | 并发两个相同 command:只一次调用 resolver / backend / truth save;第二次不能产生 side effect。 |
| Open context duplicate by same caller request with different idempotency key | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;unique active `(caller_request_ref, operation_context_ref)` / `(context_ref)` | create path unique constraint + `expected_version=None`;若 existing active 与 request 语义冲突,rollback。 | `VersionConflict` 或 `Validation` with safe reason;不得合并成第二 context。 | 两个 key 同时 open 同一 caller request,最终只有一个 active context / identity。 |
| Context / identity close vs later intake update | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity` | update 必须先 `get_*_with_version`;closed / terminal 状态由 domain guard 拒绝 reopen。 | `VersionConflict` 或 `DomainError::TerminalStateReopen` -> public `Validation` / `Internal`。 | close 后再 accepted update 必须失败,不能 reopen。 |
| Establish boundary concurrent with backend capability refresh | `BoundaryRequirementSet`;`BoundaryEstablishmentDecision`;`CoherentBoundary`;capability snapshot marker | boundary command 保存 group 时用 expected boundary version;capability refresh 只能写 reference marker / stale projection,不能改 established boundary。 | boundary save `VersionConflict`;capability stale 不会 silent degrade。 | refresh 与 establish 并发后 boundary 要么按旧 snapshot 成立 / 拒绝,要么 fresh-read 重试。 |
| Two boundary establish commands on same context | `sandbox_boundary_groups` unique active `(context_ref,boundary_kind)` | first create / update wins;second must load versioned boundary or hit unique conflict。 | `VersionConflict`;same key duplicate replay stored result。 | 并发建立 resource/fs/network/process boundary,不得出现两套 coherent boundary。 |
| Policy evaluation race with policy summary consumer | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision`;policy reference state | policy command保存 policy group with expected version;consumer只更新 reference marker/stale projection。 | command `VersionConflict` or `PolicyFailClosed`;consumer conflict item delayed/retryable。 | summary 更新不允许把已 fail-closed decision 静默改成 accepted。 |
| Start run vs control / failure classification | `ControlledExecutionRun`;`ControlFact`;`FailureClassification`;safety group | run start loads boundary/policy/handle/run version;control/failure uses safety group expected versions and domain transitions。 | `VersionConflict`;illegal terminal transition -> `Validation` / `Internal`。 | run `Running` 与 cancel / kill 并发,最终状态单调,不得 running after terminal control。 |
| Record capture vs failure / terminate | `ControlledExecutionRun`;`CaptureFact`;`HandoffFact` | capture uses versioned run / capture group;failure path uses safety group;terminal run guard blocks inconsistent capture。 | `VersionConflict`;`InvalidStateTransition`;capture result `Failed` / rejected。 | run failed 后 capture complete 不能把 run 改回 completed。 |
| Open handoff vs handoff feedback / retry job | `HandoffFact`;`CaptureFact`;handoff status index | open handoff saves capture/handoff group;feedback/retry loads `Versioned<HandoffFact>` and terminal guard。 | target mismatch -> `Quarantined`;version conflict -> retryable;terminal delivered -> no-op/skipped。 | retry job 与 feedback delivered 同时发生,只保留一个 delivered/failed/retryable final transition。 |
| Submit control command vs control requested event | `ControlFact`;`ControlledExecutionRun`;`FailureClassification` | event consumer first reserves dedup receipt,then invokes command path or equivalent command service preserving command idempotency and expected version。 | consumer duplicate -> stored receipt;command conflict -> receipt conflict;target mismatch -> quarantine。 | 同一 `control_signal_ref` 从 API 和 event 来,不得形成两条 control fact。 |
| Failure classification vs lifecycle signal / reaper | `FailureClassification`;`LeaseRecord`;`OrphanRecoveryRecord`;safety group | all safety updates use versioned safety group;consumer lifecycle marker may create failure input,not success overwrite。 | `VersionConflict`;invalid transition;job item failed/skipped。 | backend lifecycle lost 与 failure command 并发,不能把 unknown/orphan 改成 success。 |
| Cleanup guard evaluation vs reaper release | `CleanupGuard`;`LeaseRecord`;`IsolationEnvironmentHandle`;`RedlineContainment` | cleanup/reaper loads guard/lease/handle versions;release only if guard allows and redline/investigation closed。 | guard rejected -> skipped;version conflict -> retry;redline pending -> blocked。 | reaper 不能在 handoff / investigation 未完成时释放或删除材料。 |
| Redline containment command vs investigation feedback | `RedlineContainment`;`CleanupGuard`;investigation handoff marker | containment truth uses expected version;feedback only updates formal marker after target match;release needs guard。 | target mismatch -> `Quarantined`;version conflict;manual security review。 | investigation feedback 不得直接 release containment 或 cleanup。 |
| Relay publish job vs relay feedback consumer | `SandboxEventRelayRecord`;`EventRelayStatus` | publish job lists `Versioned<RelayRecord>`;feedback loads same relay version;terminal status guard。 | `VersionConflict`;terminal transition invalid;dead-letter manual。 | delivered feedback 与 publish retry 并发,source truth 不变,relay 只一次 terminal。 |
| Reference event consumer vs reference refresh job | `ReferenceResolutionState`;reference snapshot;projection stale marker | both use versioned reference state;reference marker cursor from UoW after staged marker,not source version/dedup。 | `VersionConflict`;untrusted / forbidden body -> `Quarantined`;refresh failure -> delayed/report item。 | redelivery + refresh 并发不得创建重复 reference state 或 cursor from event key。 |
| Projection stale marker vs projection rebuild job | `SandboxReadProjection`;projection dependency / context index | stale marking only existing projection refs;rebuild loads snapshot and saves with expected projection version。 | rebuild `VersionConflict`;missing snapshot -> degraded item;query `MissingProjection`。 | rebuild 与 stale 同时发生,query 不能看到半提交 projection。 |
| Derived maintenance job duplicate or concurrent run | `DerivedInspectPreviewTrendState`;derived report item | job idempotency for same input;different keys update derived state with expected version;failure report-only。 | duplicate -> stored report;version conflict -> retryable item;builder failure -> degraded。 | 两个 derived jobs 不得用 old derived body 修 core truth。 |
| Reconciliation job duplicate or concurrent run | `SandboxReconciliationReport`;latest index `(scope_ref,report_kind)` | duplicate job replay stored report;different job updates latest index with expected version / unique latest update。 | duplicate missing report -> `DuplicateMissingResult`;index conflict -> retryable report failure。 | 同一 scope 对账重复运行不修改 core truth,latest index 不半更新。 |
| Query racing with mutation commit | committed truth/projection snapshot | query no write UoW;repository gives commit-before or commit-after view,not half group。 | degraded/missing/not visible surface;no `VersionConflict` retry write。 | query 期间 command commit,query 不应写 stale marker 或 repair。 |

---

## 9. 幂等键表

| 接口 / Job / Event | 幂等键 | 幂等窗口 | 重复请求处理 |
|---|---|---|---|
| All Command shared rule | `(operation_name, channel, metadata.idempotency_key)`;channel from `SandboxServiceCallContext` (`ApiCommand` or `Worker`) | replay record retention window;具体保存期限 / 过期策略由 Step 14 / 04 配置承接 | same digest completed -> stored command result;same digest reserved -> retryable in-flight;different digest -> `IdempotencyConflict`;failed visible record -> same key不可复用。 |
| `OpenControlledExecutionContext` | command metadata key;digest includes operation name, actor/scope refs, caller request refs, context resolution refs, expected version hints if present | same as command shared | duplicate replay returns original context / identity result;不重跑 resolver。 |
| `EstablishExecutionBoundary` | command metadata key;digest includes context ref, boundary requirement refs, backend / capability snapshot refs, requested boundary dimensions | same as command shared | duplicate replay returns boundary decision / coherent boundary result;不重新调用 backend establish。 |
| `EvaluatePolicyExecution` | command metadata key;digest includes context ref, policy scope refs, applicability / authorization summary refs, high-risk action refs | same as command shared | duplicate replay returns policy decision;不同 policy summary refs with same key conflict。 |
| `StartControlledExecutionRun` | command metadata key;digest includes context/boundary/policy/handle refs, launch policy refs and expected run version | same as command shared | duplicate replay returns original run result;不重新启动 runtime/backend。 |
| `RecordCaptureResult` | worker command metadata key;digest includes run ref, capture kind, material refs, observability material refs, safe capture status | same as command shared | duplicate replay returns capture result;不重复保存 material/handoff marker。 |
| `OpenMaterialHandoff` | command metadata key;digest includes capture ref, handoff target refs, material / observability refs and target kind | same as command shared | duplicate replay returns handoff refs;handoff delivery failure不触发 capture rollback。 |
| `SubmitSandboxControl` | command metadata key;digest includes context ref, control signal ref, control kind, expected context/run version and source context | same as command shared | duplicate replay returns control result;different control kind with same key conflict。 |
| `ClassifySandboxFailure` | command metadata key;digest includes context/run/control/source refs, failure kind and safe reason marker | same as command shared | duplicate replay returns classification result;不重新 inspect backend。 |
| `EvaluateCleanupReadiness` | command/job metadata key;digest includes cleanup guard ref/context/handle refs, handoff/redline/investigation markers | same as command shared | duplicate replay returns guard decision;不执行 release。 |
| `RecordRedlineContainment` | command metadata key;digest includes context/run/capture/source refs, redline kind, investigation target refs | same as command shared | duplicate replay returns containment result;不重复打开 investigation handoff。 |
| All Query | no idempotency record;query digest may exist only for trace / cache-neutral validation | not applicable | repeated query re-reads committed snapshot/projection/page;不得 stored replay、refresh、repair、mark stale 或 release。 |
| All Inbound Consumer shared rule | `(operation_name, Consumer, envelope.dedup_key)`;digest includes source event ref, source ref, schema version, payload digest, payload target refs and forbidden-body marker summary | event dedup retention window;具体保存期限由 Step 14 / 04 承接 | same digest completed -> stored receipt;same digest reserved -> retryable in-flight / delayed ack;different digest -> `IdempotencyConflict` or quarantined receipt;missing stored receipt -> `DuplicateMissingResult`。 |
| `ConsumeCallerContextReferenceChanged` | envelope `dedup_key` normalized;source event ref is not key | consumer shared | duplicate returns stored receipt;不重复写 reference state / stale projection。 |
| `ConsumePolicySummaryChanged` | envelope `dedup_key` normalized | consumer shared | duplicate returns stored receipt;不把 policy decision 改成 accepted。 |
| `ConsumeBackendCapabilitySummaryChanged` | envelope `dedup_key` normalized | consumer shared | duplicate returns stored receipt;不重新建立 boundary。 |
| `ConsumeIsolationBackendLifecycleSignal` | envelope `dedup_key` normalized | consumer shared | duplicate returns stored receipt;不重复创建 orphan/failure marker。 |
| `ConsumeMaterialHandoffStatusChanged` / `ConsumeObservabilityHandoffStatusChanged` | envelope `dedup_key` normalized;digest includes handoff/material target refs and status | consumer shared | duplicate returns stored receipt;target mismatch quarantines,不回滚 capture truth。 |
| `ConsumeSandboxControlRequested` | envelope `dedup_key` for receipt;inner command idempotency derived from `context_ref + control_signal_ref + control_kind` or provided command key by entry factory | consumer shared + command shared | duplicate event returns stored receipt;accepted first delivery must still pass command idempotency / version guard。 |
| `ConsumeInvestigationHandoffStatusChanged` | envelope `dedup_key` normalized;digest includes redline / cleanup relation refs and investigation summary marker | consumer shared | duplicate returns stored receipt;不直接 release cleanup/redline。 |
| `ConsumeSandboxTruthRelayFeedback` | envelope `dedup_key` normalized;digest includes relay record ref, publisher outcome status, feedback marker | consumer shared | duplicate returns stored receipt;relay terminal guard prevents reopen。 |
| All Operations Job shared rule | `(operation_name, Job, input.idempotency_key_ref)`;digest includes job kind, scope ref, typed spec, page request cursor and page request limit if part of input | job report retention window;具体保存期限 / expiry 由 Step 14 / 04 承接 | same digest completed -> stored job report;same digest reserved -> retryable in-flight;different digest -> `IdempotencyConflict`;job_run_ref 不作为 key。 |
| `PublishSandboxEventRelay` | job shared key;digest includes relay scope and status filter + page cursor | job shared | duplicate returns stored report;不重新 publish。 |
| `RefreshSandboxReferenceStates` / `RefreshBackendCapabilitySummaries` | job shared key;digest includes refresh scope/filter + page cursor | job shared | duplicate returns stored report;不重复 mark stale。 |
| `RetryPendingMaterialHandoffs` | job shared key;digest includes handoff scope/target filter + page cursor | job shared | duplicate returns stored report;不重复 delivery。 |
| `RunLeaseOrphanReaper` / `EvaluatePendingCleanupGuards` | job shared key;digest includes lease/cleanup scope, include flags, page cursor | job shared | duplicate returns stored report;不绕过 cleanup guard。 |
| `MaintainRedlineContainmentHandoffs` | job shared key;digest includes redline scope/status filter + page cursor | job shared | duplicate returns stored report;不重复 release/close redline。 |
| `RebuildSandboxReadProjections` / `MaintainDerivedInspectPreviewTrend` | job shared key;digest includes projection/derived scope, explicit refs/filter, page cursor | job shared | duplicate returns stored report;不重建 target。 |
| `RunSandboxReconciliation` | job shared key;digest includes reconciliation scope, target kinds and page cursor | job shared | duplicate returns stored report;不修 core truth。 |

---

## 10. 重入保护表

| 场景 | 重入来源 | 保护方式 | 恢复方式 |
|---|---|---|---|
| Command service 正在执行时同 key 再次进入 | API retry、worker retry、client timeout 后重试 | idempotency record `Reserved` 是执行权;第二次 same digest 不进入 flow;不同 digest conflict。 | same digest 返回 retryable in-flight surface;调用方稍后用同 key 重试;不同 digest 用新 key。 |
| Command completed 后同 key 进入 | API retry、transport duplicate | completed record + stored result replay;rollback/no-op 当前 UoW。 | 返回 stored command result overlay duplicate marker;stored missing 则 `DuplicateMissingResult` manual blocker。 |
| Command failed before replayable result | adapter unavailable、transaction rollback、validation after reserve | 如果 rollback 隐藏 reservation,可同 key 重试;如果 durable `Failed` visible,同 key不可复用。 | new idempotency key after caller confirms semantics;manual review for uncertain side effect。 |
| Same target truth with different idempotency keys | parallel API calls、worker duplicate scheduling | target repository expected version and unique active keys;domain terminal guard。 | loser rollback and returns `VersionConflict`;fresh-read retry only if requested state still legal。 |
| Consumer redelivery after receipt stored | event bus redelivery、worker crash after ack uncertainty | consumer idempotency key from `dedup_key`;stored receipt is replay source。 | return stored receipt;no new reference / handoff / relay / control write。 |
| Consumer duplicate while first delivery in-flight | event bus parallel delivery | atomic reserve prevents second mutation;same digest sees `Reserved`。 | delayed / retryable ack according worker policy;no duplicate write。 |
| Consumer same dedup key with different payload | producer bug、malicious replay、schema mismatch | digest mismatch on same `(operation,Consumer,dedup_key)`。 | `IdempotencyConflict` or quarantined receipt;do not merge payloads。 |
| Control requested event invokes command path | trusted runtime/operator redelivery plus API control | event receipt reserve first;inner control command still uses command idempotency and expected version / unique control signal。 | duplicate event returns receipt;inner command conflict returns conflict receipt;no bypass of command guard。 |
| Relay publish retry | publisher retry,job rerun,feedback redelivery | relay record version + terminal transition guard;publisher outcome enum only。 | retryable updates relay/report;dead-letter manual;source truth unchanged。 |
| Handoff retry | handoff target unavailable,job rerun,feedback redelivery | handoff fact version + target match + terminal guard。 | retryable remains pending/retryable;delivered/failure terminal prevents duplicate delivery;capture truth unchanged。 |
| Projection rebuild re-entry | rebuild job rerun,stale marker during rebuild | job idempotency + projection expected version;rebuild from snapshot,not current projection body。 | version conflict item retry;query returns stale/degraded until committed rebuild。 |
| Derived maintenance re-entry | repeated maintenance job | job idempotency + derived expected version;derived failure report-only。 | duplicate report replay;conflict retry item;no core truth repair。 |
| Reconciliation re-entry | same scheduled reconciliation rerun | job idempotency + latest index version;report immutable / latest marker update。 | duplicate report replay;index conflict retry;never writes core truth。 |
| Cleanup / reaper re-entry | repeated maintenance scan、lease expiry race | guard / lease / handle version + cleanup guard domain check;redline/investigation gate first。 | skipped/blocked report item;retry after guard changes;never delete evidence before allowed。 |
| Redline containment re-entry | repeated redline detection、investigation feedback race | containment version + terminal guard + investigation target match。 | duplicate report/receipt replay or conflict;manual security review for mismatch。 |
| Query repeated or racing writes | UI refresh、polling、client retry | no idempotency record, no write UoW, no refresh/rebuild/release。 | return committed view / page / degraded surface;caller can query again。 |

---

## 11. Request digest canonicalization 规则

| 输入族 | digest 必须包含 | digest 必须排除 | 冲突口径 |
|---|---|---|---|
| Command | operation name、channel、actor / scope safe refs、typed command request fields、target refs、expected version hints、body-free summary refs。 | trace id、request arrival time、retry count、result ref、stored result ref、adapter response、raw external body。 | same key + changed typed request or target refs -> `IdempotencyConflict`。 |
| Query | query name、selector、page request、visibility scope可用于 trace / cache-neutral validation。 | idempotency key、write cursor、truth cursor、stored result ref。 | query digest 不创建 idempotency conflict;invalid selector返回 validation / degraded。 |
| Inbound Consumer | operation name、channel `Consumer`、source event ref、source ref、schema version、dedup key、payload digest、typed target refs、forbidden body marker summary。 | raw event body、transport delivery count、worker batch id、trace id、ack status。 | same dedup key + different payload digest -> `IdempotencyConflict` / quarantine。 |
| Operations Job | operation name、channel `Job`、job kind、scope ref、typed spec、page request cursor、page request limit when part of input、idempotency key ref。 | job run ref、started_at、scheduler retry count、previous report ref unless explicit input、trace id。 | same key + different spec/scope/page cursor -> `IdempotencyConflict`。 |

Digest canonicalization 由 entry mapper / context factory 完成,service、domain、repository 和 fake 不得重新解释 DTO body 或从 route string / topic / job runner private state 拼接 digest。若 canonicalization 发现外部正文、unsupported schema 或无法稳定排序的 payload field,必须在 reserve 前 rejected / quarantined;不得创建半可信 idempotency record。

---

## 12. Duplicate / conflict / retry 恢复口径

| 情况 | 处理 | 禁止行为 |
|---|---|---|
| `reserve -> Reserved` | 当前调用拥有执行权,继续唯一一次 mutation / consumer / job。 | 同 key 第二调用也进入 flow。 |
| existing `Reserved` same digest | 返回 retryable in-flight surface,不执行 mutation;worker 可延迟 ack / retry。 | service 阻塞等待并复用同一个 UoW;创建第二 stored result。 |
| existing `Completed` same digest + stored result exists | rollback/no-op 当前 UoW,返回 stored command result / receipt / report。 | 重新执行 resolver / backend / domain / publisher / handoff / job。 |
| existing `Completed` same digest + stored result missing / wrong kind | 返回 `DuplicateMissingResult`;标记 manual integrity blocker。 | 从 current truth 重算 result;伪造 stored result;补发 relay。 |
| existing any status same key different digest | 返回 `IdempotencyConflict`;不执行 mutation。 | 覆盖 request digest;把新请求合并到旧 key。 |
| existing `Failed` visible | same key 不再进入 mutation;调用方必须用新 key或人工确认。 | `Failed -> Completed` same record;把 failed 当 duplicate success。 |
| expected version conflict | rollback current UoW;返回 `VersionConflict`;允许 fresh-read 后按同 key same digest 重试。 | overwrite committed row;fake 忽略 version;job 修 core truth。 |
| adapter unavailable before side effect | rollback or durable failed marker according Step 12;retry identity 不变。 | 换 key 自动重试并隐藏失败;把 unavailable 当 allow。 |
| adapter side effect uncertain | 不自动 replay;需要 safe report/manual review 或 adapter-defined idempotent target key。 | 重复 launch / publish / handoff without target idempotency proof。 |
| query degraded / missing | 返回 read surface;不写 audit / stored result / projection。 | query 修复、refresh、rebuild、handoff、cleanup。 |
| job partial failure | 保存 report and stored job result;后续 retry 根据 original job key / new key and failed target scope执行。 | 隐藏 failed refs;job 修 core truth。 |

---

## 13. Fake / durable parity 与测试承接

| 能力 | fake 必须模拟 | durable adapter 必须保证 | Step 16 测试切口 |
|---|---|---|---|
| idempotency reserve | atomic unique `(operation_name,channel,key)`;Reserved / Completed / Failed / Conflict;digest mismatch。 | transactional reservation inside UoW;unique violation deterministic mapping。 | parallel reserve race;same key same digest;same key different digest。 |
| stored result replay | typed `SandboxStoredOperationResult` save/get;wrong kind / missing result maps `DuplicateMissingResult`。 | save result before complete;get result by stored ref;immutable replay surface。 | completed duplicate returns stored result;missing result does not recompute。 |
| UoW staging / rollback | staged truth/idempotency/stored/cursor hidden until commit;rollback clears all staged writes。 | transaction atomic visibility;no half group committed。 | rollback after reserve / after stored save / before complete leaves no visible half-state。 |
| expected version | `Versioned<T>.version` required for update;conflict on stale version。 | optimistic write check for every update existing truth / marker / relay / projection。 | stale version update conflict;create with existing key conflict。 |
| cursor | truth/reference cursor assigned only after staged writes;rollback hides cursor。 | cursor stable and copied to audit/relay/stale/stored result from same UoW。 | cursor not equal page cursor / version / timestamp;rollback cursor invisible。 |
| page order / job selection | deterministic page order and cursor;no private map scan beyond Step 7 callable surface。 | repository index-backed selection;cursor opaque list position only。 | duplicate job page replay;cursor not used as version/idempotency key。 |
| query no-write | query service cannot call write UoW or mutation repository;fake exposes violation for tests。 | read transaction or no transaction cannot persist side effects。 | query repeated under missing projection produces no writes。 |
| relay / handoff no-rollback | publish / handoff failure only updates relay/handoff/report,source/capture truth unchanged。 | source transaction and publish/retry transaction separated。 | publisher failure leaves source truth committed;handoff failure leaves capture committed。 |

---

## 14. Historical material / blocker 处理

| 项目 | 状态 | Step 13 处理 |
|---|---|---|
| 旧 `03-详细设计.md` 中旧 session / command / provider bridge replay 线索 | historical_material | 未继承旧 replay / provider bridge / audit evidence 语义;duplicate replay 只以 Step 8/11 typed stored result 为准。 |
| 旧 README 中 Docker/gVisor / backend retry 线索 | historical_material | 未继承具体后端或重试阈值;本步只定义 adapter outcome 与 retry identity,具体 binding 交 Step 14 / 04。 |
| Step 7 `get_record` 未显式 channel | contained_for_step_13 | 本步记录为回填修正点:正式 §12 和 Step 19 装配时必须写 channel-aware idempotency repository 语义。 |
| `SBX-DDD-FLOW-QUERY-001` | contained_current_boundary | query 缺 finder 的 selector 仍 validation / missing / degraded;不得以并发 / 幂等为由扫描 storage。 |
| 正式 `04-配置设计.md` 缺失 | open_downstream | 不阻塞 Step 13;Step 14 / 正式 04 承接 retry window、dedup retention、job cadence、dead-letter threshold、lease/reaper cadence。 |
| 正式 `07-实施计划.md` 缺失 | open_downstream | 不阻塞 Step 13;进入 07 时必须同步 implementation ledger 和 planned boundary skeleton。 |

---

## 15. 回填草稿

正式 `03-详细设计.md` Step 19 装配时,§12 可按以下结构回填。本步不直接修改正式 `03`。

```md
## 12. 并发、幂等与重入保护

> 校准来源:
> - `design-calibration/03_ddd_step_06_object_contracts.md`
> - `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
> - `design-calibration/03_ddd_step_08_protocol_contracts.md`
> - `design-calibration/03_ddd_step_09_function_flows.md`
> - `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md`
> - `design-calibration/03_ddd_step_12_error_recovery.md`
> - `design-calibration/03_ddd_step_13_concurrency_idempotency.md`

Command、Inbound Consumer 和 Operations Job 必须通过 `SandboxServiceCallContext` 进入 `SandboxIdempotencyRepository.reserve(&uow, ctx)`。Query 不创建 idempotency record,重复 query 只是 read-only 读取 committed snapshot / projection / page。idempotency repository 的唯一键为 `(operation_name, channel, idempotency_key)`,其中 `channel` 来自 `SandboxServiceCallContext`,fake / durable adapter 不得硬编码或从 operation name 推断。

Command 幂等键来自 command metadata `idempotency_key`;Consumer 幂等键来自 inbound envelope `dedup_key`;Job 幂等键来自 `SandboxJobInputDto.idempotency_key_ref`。`source_event_ref`、`job_run_ref`、`trace_id`、`result_ref`、retry counter、transport redelivery count 和 page cursor 不能单独替代幂等键。Job digest 可以包含 `page_request.cursor`,但该 cursor 只参与 job input digest,不得作为 truth cursor、repository version 或 source marker。

同一 operation/channel/key 且 digest 相同的 completed duplicate 只能返回 stored command result、stored consumer receipt 或 stored job report,不得重新执行 resolver、backend、domain transition、publisher、handoff、cleanup、projection rebuild 或 job selection。completed idempotency record 指向的 stored result 缺失或类型不匹配时返回 `DuplicateMissingResult`,这是 manual integrity blocker,不得从 current truth 重算结果。

更新 existing truth / marker / projection / relay 必须先读取 `Versioned<T>` 并使用 `expected_version`;`expected_version=None` 只用于 create。version conflict 必须 rollback 当前 UoW 并返回 `VersionConflict`,允许 caller / job fresh-read 后用同一 idempotency key 和同一 digest 重试。实现不得 overwrite、merge 或由 fake 忽略 version。

Consumer redelivery 返回 stored receipt,不重复写 reference / handoff / relay / control。Relay publish failure 只更新 relay record / job report,不回滚 source truth。Handoff failure 只更新 handoff status / report,不回滚 capture truth。Job duplicate 返回 stored report,不重跑 publish / refresh / rebuild / retry / reaper / reconciliation;job partial failure 进入 report,不得修 core truth。Cleanup / reaper / redline 必须服从 guard、version 和 terminal transition,不得在 evidence / investigation 未放行前 release 或删除材料。

fake repository 是并发和幂等 contract test 的目标,必须模拟 UoW staging、rollback、unique key、expected version conflict、cursor、stored result、page ordering 和 query no-write。fake 不得通过私有 map scan、自动创建、忽略 version 或 rollback 后保留 staged writes 来通过测试。
```

---

## 16. Step 14 handoff items

| 后续 Step | 承接项 | 约束 |
|---|---|---|
| Step 14 config / external binding | dedup / stored result retention window、retry / backoff / dead-letter thresholds、job cadence、lease / reaper cadence、adapter idempotent target binding、runtime config summary binding。 | 配置只能影响窗口、节奏、adapter binding 和 degraded surface,不得改变 idempotency unique key、duplicate replay、expected version、query no-write、cleanup guard 或 redline semantics。 |
| Step 15 observability / audit | duplicate replay safe log、in-flight retry marker、idempotency conflict marker、version conflict marker、manual integrity blocker、dead-letter / redline report surface。 | 不伪造 evidence alias;不保存 raw external body / raw adapter diagnostics。 |
| Step 16 test cuts | atomic reserve race、digest mismatch、stored result replay / missing、expected version conflict、query no-write、consumer duplicate no rewrite、job duplicate no rerun、relay no-rollback、fake/durable parity。 | 只定义测试切口;不写真实测试结果。 |
| Step 17 implementation handoff | idempotency repository channel-aware contract、stored result typed save/get、fake parity boundary、no-scan query boundary、retry identity rules。 | 07 才能形成 commit boundary;当前不写实施计划。 |

---

## 17. 待确认事项

| 待确认 | 当前处理 | 是否阻塞 Step 13 |
|---|---|---|
| idempotency / stored result retention 具体时长 | 本步只定义 retention window 存在和语义;数值交 Step 14 / 04。 | 否 |
| retry/backoff/dead-letter 阈值 | 本步定义 retry identity 和可重试类别;具体阈值交 Step 14。 | 否 |
| in-flight duplicate 的 transport 表达 | 本步映射为 retryable `VersionConflict` / delayed ack 语义;具体 HTTP/RPC status 或 worker ack 策略后续承接。 | 否 |
| Step 7 repository `get_record` 是否修改签名 | 本步已要求 channel-aware get/reserve;Step 19 正式装配时回填,不阻塞当前 Step。 | 否 |
| adapter target 是否自身支持 idempotent launch / publish / handoff | 本步禁止 uncertain side effect 自动 replay;具体 adapter binding / capability 交 Step 14。 | 否 |

---

## 18. 自检

| 检查项 | 结论 |
|---|---|
| 是否创建 Step 13 中间产物 | 通过。本文为 `03_ddd_step_13_concurrency_idempotency.md`。 |
| 是否修改正式 `03-详细设计.md` | 未修改。正式文档仍等 Step 19 装配。 |
| 是否提前创建 Step 14 | 未创建。 |
| 是否输出并发场景表 | 通过。见 §8。 |
| 是否输出幂等键表 | 通过。见 §9。 |
| 是否输出重入保护表 | 通过。见 §10。 |
| 是否说明重复事件处理结果 | 通过。consumer duplicate 返回 stored receipt;digest mismatch conflict/quarantine;不重复写 reference / handoff / relay / control。 |
| 是否说明重复 job 处理结果 | 通过。job duplicate 返回 stored report;不重跑 publish / refresh / rebuild / retry / reaper / reconciliation。 |
| 是否说明幂等键来源 | 通过。Command metadata key、Consumer envelope dedup_key、Job input idempotency_key_ref;Query none。 |
| 是否保留 duplicate missing result 不重算 | 通过。`DuplicateMissingResult` 为 manual integrity blocker。 |
| 是否保留 query no-write | 通过。Query 不 reserve、不写 UoW、不 refresh / rebuild / handoff / cleanup / release。 |
| 是否保留 relay / handoff no-rollback | 通过。publish / delivery failure 只更新 relay/handoff/report surface,不回滚 source/capture truth。 |
| 是否保留 job no core repair | 通过。job partial failure只进 report/read side,不得修 core truth。 |
| 是否覆盖 fake / durable parity | 通过。见 §13。 |
| 是否混入禁止范围 | 未混入。未把 tools semantic execution、runtime agent loop、member lifecycle、artifact truth、observability store、policy definition / approval / allowlist / capability truth 写入 sandbox 并发/幂等规则。 |
| 是否发现上游 blocker | 未发现阻塞 Step 13 的上游 blocker。 |
| 是否需要提交 commit | 否。用户未要求提交。 |

---

## 19. 进入下一步条件

```text
当前 Step 13 已完成并停在用户审查点。

用户确认后,才能进入 Step 14 `定义配置引用与外部依赖绑定`。
进入 Step 14 前必须读取:

1. `project_execution_ledger.md`
2. `03_ddd_calibration_flow.md`
3. `03_ddd_step_13_concurrency_idempotency.md`
4. `03_ddd_step_11_persistence_transaction_consistency.md`
5. `03_ddd_step_12_error_recovery.md`
6. 正式 `00/01/02`
7. `standards/document/详细设计讨论流程_SOP.md` Step 14
8. `standards/document/详细设计书写规范.md` §5.13
9. `standards/document/设计真相源闭环与可落码性标准.md` configuration owner、external binding、adapter binding、retry threshold 不得改写 truth semantics 相关条目
```
