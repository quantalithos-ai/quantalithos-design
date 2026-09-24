# Step 16. 测试切口与最小验证清单

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 16  
> 书写规范：`standards/document/详细设计书写规范.md` §5.15  
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`  
> 参考框架：`projects/L1-governance/design-calibration/03_ddd_step_16_test_cuts.md`  
> 回填位置：未来正式 `projects/L5-runner/03-详细设计.md` §15  
> 状态：`completed_with_upstream_blockers`

## 1. Step 状态与开工确认

| 项 | 当前值 |
|---|---|
| current_document | `03-详细设计.md` |
| current_step | Step 16 |
| current_module | `test_slices:minimal_verification_matrix` |
| gate_status | `pass_for_step_17` |
| gate_reason | 七个逻辑模块、11 Command、12 Query、4 planned Consumer、0 outbound event、5 Job、21 个状态主语与持久化/幂等/错误/配置/观测切口均已形成最小验证入口；不执行测试，不伪造结果。 |
| formal_03_write_allowed | `false_until_step_19` |
| implementation_write_allowed | `false` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 创建并完成 Step 17 实施承接清单 |

本 Step 只定义测试入口、测试替身能力、断言边界和后续测试方案的承接点。它不创建测试文件、测试仓、fixture、CI job 或脚本实现，也不声明任何测试已执行或通过。

## 2. 本步目标、输入与非目标

### 2.1 本步目标

把 Step 5～15 已收敛的实现契约转换为可由实现者和后续 `05-测试方案.md` 继续展开的最小验证入口，至少回答：

1. 每个逻辑模块最少需要验证哪些不变量和边界。
2. 每个 Command、Query、planned Consumer 和 Job 的正向、拒绝、重复、冲突和 no-write 入口是什么。
3. Step 10 的每个正式状态主语如何覆盖合法转换、非法转换、终态冻结和保留路径。
4. Step 11～13 的版本、UoW、幂等、并发、commit-unknown、generation guard 和恢复规则如何被观察。
5. Step 14～15 的配置、依赖就绪、redaction、低基数指标、审计分层和禁止字段如何被自动检查。

### 2.2 输入基线

| 输入 | 本 Step 使用方式 |
|---|---|
| `03_ddd_step_05_module_contracts_axis.md` | 固定 `contracts`、`domain`、`application`、`infra`、`entry`、`worker`、`operations` 七个测试主轴。 |
| `03_ddd_step_06_object_contracts.md` | 固定对象 factory、字段来源、状态 carrier、report/view、id/ref nominal mapping 和 body-free 边界。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 固定 repository、UoW、14 个 required semantic port、fake failure injection 和 adapter marker 入口。 |
| `03_ddd_step_08_protocol_contracts.md` | 固定 11 Command、12 Query、4 planned Consumer、0 outbound Event、5 Job 的 public surface。 |
| `03_ddd_step_09_function_flows.md` | 固定 `FLOW-C01~C11`、`FLOW-Q01~Q12`、`FLOW-E01~E04`、`FLOW-J01~J05` 的顺序和副作用边界。 |
| `03_ddd_step_10_state_matrix.md` | 固定 21 个状态主语及 projection generation conditional-write guard。 |
| `03_ddd_step_11_persistence_consistency.md` | 固定 logical store、expected version、UoW、projection identity、stored result 和 no-replay 断言。 |
| `03_ddd_step_12_error_recovery.md` | 固定 public issue taxonomy、Unknown/Blocked/Conflict 映射和恢复禁止动作。 |
| `03_ddd_step_13_concurrency_idempotency.md` | 固定 key、canonical digest、duplicate/in-flight/conflict、claim/checkpoint 和 commit-unknown 入口。 |
| `03_ddd_step_14_config_dependencies.md` | 固定 config read location、configured/enabled/ready 分层和依赖不可用处理。 |
| `03_ddd_step_15_observability_audit.md` | 固定日志、指标、trace、local audit、handoff、redaction 和 forbidden-field 断言。 |

### 2.3 明确非目标

- 不给出完整测试计划、TC 编号体系、优先级、覆盖率阈值、fixture 目录、CI 分层或执行排期；这些留给后续正式 `05-测试方案.md`。
- 不绑定真实 durable store、broker、HTTP/RPC/IPC、GUI shell、平台资源 API、SDK package/crate、Sandbox backend 或观测后端。
- 不生成测试 artifact、report、evidence、verdict、signoff、baseline、run_id 或 readiness 结论。
- 不为 planned Consumer 的 positive apply、owner cursor、ACK、payload parser 或 outbound event 追加实现路径。
- 不把 fake/in-memory 契约误写成 production adapter 已可用；所有 fake 只用于验证语义边界。

## 3. SOP 问题回答

| 问题 | Runner 答案 |
|---|---|
| 每个模块至少需要哪些单元测试？ | `contracts` 测 typed ref/DTO/enum/marker/schema；`domain` 测 factory、不变量、纯转换和终态；`application` 测编排、UoW、幂等和错误映射；`infra` 测 repository/version/page、builder 和 fake adapter；`entry` 测 envelope/actor/metadata/handler mapping；`worker` 测 header-first、dedup、negative receipt；`operations` 测 claim/checkpoint/report、bounded iteration 和 no truth repair。 |
| 每个协议至少覆盖哪些正反路径？ | Command 覆盖 accepted local posture、typed rejection、duplicate replay、digest conflict、version/basis conflict 和 unknown；Query 覆盖 visible hit、empty、not visible、stale/degraded/failed 与 no-write；Consumer 覆盖 blocked、unsupported、malformed、strict stored duplicate；Job 覆盖 completed/partial/blocked/failed/unknown/replay/rejected。 |
| 状态机如何测试？ | 以 Step 10 的正式 enum 和矩阵为唯一名称来源，每个状态机至少一条主线合法转换、一条边界合法转换、一条非法转换和终态/Unknown 冻结断言；reserved 路径必须断言不可达或 positive-call=0。 |
| 一致性、幂等和并发如何验证？ | 使用可计数 fake repository/UoW/port/clock/id/digest，注入 expected-version conflict、generation conflict、duplicate result missing、commit unknown、claim ambiguity、adapter unavailable 和 redaction failure；断言写入顺序、调用次数、rollback/no-write 和 RecoveryCase 关联。 |
| 哪些细节留给 `05`？ | 具体用例编号、数据集、fixture 结构、真实依赖联调、性能/容量/SLO、CI job、报告模板、evidence 编号和执行顺序。 |

## 4. 分批写入与停审记录

| 批次 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 16.0 | 骨架、输入、目标、SOP 回答和诊断 | completed | `pass` |
| 16.1 | 七模块测试切口 | completed | 每模块均有单元/服务/替身边界 |
| 16.2 | Command / Query / Consumer / Job 测试切口 | completed | 32 条 flow 均有独立入口；outbound=0 做 no-residue 断言 |
| 16.3 | 21 状态主语与 projection guard 测试切口 | completed | 合法/非法/终态/reserved 口径一致 |
| 16.4 | 持久化、事务、幂等、并发、错误与恢复切口 | completed | 版本、UoW、duplicate、Unknown/no-replay 可观测 |
| 16.5 | 配置、观测、redaction、脚本契约、跨 Step 审计 | completed | 不执行、不伪造结果；可进入 Step 17 |

## 5. 当前文档问题诊断与改动前后对比

| 位置 | 诊断 | 本 Step 修正 |
|---|---|---|
| Step 5 | 模块职责已稳定，但测试入口仍是预告 | 按七模块固定最低验证边界和替身要求。 |
| Step 8 | 协议 schema 完整，但正/负路径分散在各协议小节 | 为每个 protocol family 建立独立 test-cut 表，并固定 zero-side-effect 断言。 |
| Step 9 | flow 已有局部测试提示，缺少全局覆盖清单 | 将 32 条 flow 映射为独立测试入口，不用通用 happy-path 代替。 |
| Step 10 | 状态矩阵有单机停审，但下游容易引用旧口语名 | 建立正式状态名、合法/非法/reserved/no-op 反查矩阵。 |
| Step 11～13 | 事务、错误、幂等、并发分别记录，易漏交叉窗口 | 汇总 UoW、commit-unknown、duplicate result missing、generation/claim/checkpoint race。 |
| Step 14 | 配置与依赖状态分层已定义，缺验证入口 | 增加 config validation、marker propagation、missing-core-store fail-closed。 |
| Step 15 | 安全字段边界已定义，缺机器可断言的 forbidden-field 入口 | 增加 raw body/secret/path、metric cardinality、accepted-vs-rejected audit 分离检查。 |
| 旧正式 `03` / README / draft | 旧主线含 `RunnerRun`、Tauri/Rust、queue 等历史假设 | 仅作为冲突扫描输入；新版测试入口只引用 Step 5～15 的 Runner semantic contract。 |

## 6. 测试替身与通用断言基线

### 6.1 最小替身能力

| 替身 | 必须可注入的结果 | 必须记录的调用 |
|---|---|---|
| `FakeRunnerRepository` | hit/missing、stale version、generation conflict、storage unavailable、corrupt marker | get/list/save/append/replace 次数、参数 identity、expected version、UoW ref |
| `FakeUnitOfWorkManager` | begin/commit/rollback success、commit unknown、rollback failure | phase 顺序、commit/rollback 次数、关联 operation/key |
| `FakeIdempotencyRepository` | absent/reserved/completed/conflict、missing stored result、store unavailable | reserve/read/complete/mark-conflict 次数和 key/digest fingerprint |
| `FakeStoredResultRepository` | exact variant、missing/wrong-kind、body-forbidden rejection | save/load 次数、result ref 与 operation kind |
| `FakeClock` / `FakeIdGenerator` / `FakeDigest` | deterministic timestamp/id/digest、digest mismatch | 生成次数、输入 stable profile；不得把 volatile metadata 纳入 digest |
| `FakeSemanticPort` | Current/Stale/Blocked/Unavailable/Rejected/Unknown、receipt/ref mismatch | owner/platform/redaction call 次数、safe input refs、是否发生外部 effect |
| `FakePlatformResourcePort` | available/conflict/unknown/permission denied | probe 次数；Query/negative path 不得调用 |
| `FakeRedactionPort` | safe bounded result、unsupported、blocked | raw body 不得进入返回对象或日志 |
| `FakeTelemetrySink` | accept structured record、reject forbidden field | log/metric/trace/audit 字段和标签 cardinality |

### 6.2 全局断言不变量

1. exact `ReleaseRef + ArtifactVersionRef + RunnerScopeRef + SelectionGenerationNumber` 缺一不可；任何 `latest/default/newest/tag/branch` 输入必须在 boundary rejected。
2. `Accepted != Running`、`Complete != Verified != Qualified`、`Confirmed != Cleaned`、`Delivered != evidence/report/verdict/signoff` 的跨轴断言必须在协议、flow 和 view 测试中重复验证。
3. Query `FLOW-Q01~Q12` 的 reserve/save/refresh/reconcile/probe/cleanup/dispatch/handoff 调用次数必须为 0。
4. Unknown 必须关联 `RecoveryCaseId` 或等价安全 issue surface；不得转译成 Failed、Rejected 或 Success，也不得自动 replay/resend/reclaim/resume。
5. local log/trace/receipt/report 不得被测试断言为 Release/Artifact/Governance/Sandbox/Runtime/Observability truth、formal audit 或 evidence。
6. 所有 public result、receipt、report、view 的 body 必须满足 body-free/redacted/bounded 约束；raw payload、secret、credential、URL、host path、PID、port、socket、stack trace 永不进入持久对象或 telemetry。

## 7. 七个逻辑模块测试切口

| 测试切口 | 对应模块/契约 | 验证内容 | 建议类型 |
|---|---|---|---|
| `contracts_ref_and_binding_roundtrip` | `contracts` / Step 6 | local Id ↔ public Ref nominal conversion、exact binding、successor generation、empty/forbidden selector rejected | contract unit |
| `contracts_protocol_secondary_types` | `contracts` / Step 8 | actor/metadata/page/view/error/result/receipt/report 所有二级类型有完整字段、enum variant 和 body-free serialization | contract unit |
| `contracts_digest_profile` | `contracts` / Step 13 | operation namespace、stable field canonicalization、volatile fields excluded、same/different digest | contract unit |
| `domain_selection_material_invariants` | `domain` / Step 6、10 | Selection/Acquisition/Integrity/Cache binding、generation、cross-axis non-escalation、terminal no-reopen | domain unit |
| `domain_lifecycle_recovery_guards` | `domain` / Step 6、10 | RunIntent、ControlIntent、ProtectionGuard、RecoveryCase、HandoffPosture 的 guard、Unknown freeze、safe transition | domain unit |
| `domain_presentation_projection_contract` | `domain` / Step 6、10 | ConnectivityView、read section candidate、visibility/freshness/degraded mapping、Online 不清业务 stale | domain unit |
| `application_command_ordering` | `application` / Step 9、11 | validate → reserve → load → domain → local save → stored result → complete → commit 顺序及外部 I/O 在 UoW 外 | service test |
| `application_query_no_write` | `application` / Step 9 | 12 Query 只读 committed surface，所有 write/refresh/reconcile spies=0 | service test |
| `application_consumer_negative_path` | `application` / Step 8、9 | readiness/header-first、blocked/unsupported/rejected/strict duplicate 映射，不调用 positive apply | service test |
| `application_job_bounded_orchestration` | `application` / Step 9、10、13 | claim/checkpoint/report、per-item transaction、partial/blocked/unknown、duplicate report replay | service test |
| `infra_repository_version_page` | `infra` / Step 7、11 | exact identity lookup、bounded page、expected-version save、append unique、generation-guarded replace、missing projection identity no-upsert | repository fake |
| `infra_uow_commit_unknown` | `infra` / Step 11、13 | commit unknown/rollback failure freezes operation and opens recovery; no fallback store or blind retry | infrastructure test |
| `infra_adapter_marker_builder` | `infra` / Step 14、10 | configured/enabled/ready distinction、Blocked/Unavailable propagation、new builder on reload、missing core store not Ready | builder test |
| `entry_envelope_actor_mapping` | `entry` / Step 8、9、10 | finite union/name/body match、actor scope、metadata/idempotency rule、handler disposition and body-free rejection | handler test |
| `entry_query_surface_composition` | `entry` / Step 8、9 | empty/not-visible/degraded/stale/failed surface、page cursor mapping、no domain/store direct bypass | query/handler test |
| `worker_header_first_consumer` | `worker` / Step 8、9、10 | trusted header validation、missing/conflicting header、blocked/unsupported/duplicate, no payload decode/hash/store/ACK | worker test |
| `worker_loop_state_safety` | `worker` / Step 10 | Registered/Delayed/Stopped/Failed and reserved Running guard; item disposition does not mutate owner truth | worker unit |
| `operations_claim_checkpoint_report` | `operations` / Step 8、9、10、13 | claim conflict, checkpoint stale/unknown, report variant mapping, no auto reclaim/replay/truth repair | job service test |
| `operations_generation_refresh` | `operations` / J05、Step 11 | existing projection identity, subject/scope/generation/version checks, replacement conflict and bounded report | job service test |

## 8. Command 测试切口（11/11）

每个 Command 均至少覆盖：valid exact request、boundary invalid/forbidden selector、same-key same-digest duplicate replay、same-key different-digest conflict、expected basis/version conflict；含 external effect 的 Command 另覆盖 timeout/unknown/readback。所有切口都断言无 outbound event/outbox。

| Command / flow | 正向或可接受局部结果 | 必测异常/禁止副作用 |
|---|---|---|
| `SelectRelease` / `FLOW-C01` | exact release/version/scope 创建 successor selection，authority posture 显式返回 | `latest/default` rejected；authority unavailable→Blocked；Current 不等 Qualified；duplicate 不重复 resolver/save。 |
| `InvalidateSelection` / `FLOW-C02` | successor generation fence 提交，受影响 local refs 有界冻结 | non-successor generation/version conflict；partial propagation→RecoveryCase；不写 owner truth、不无界扫描。 |
| `RequestMaterialAcquisition` / `FLOW-C03` | exact current selection 建立 `AcquisitionTask::Absent`，不隐式下载 | binding/authority drift、store conflict、adapter blocked；locator remains `None`；source/cache/verifier call=0。 |
| `PauseAcquisition` / `FLOW-C04` | `Resolving/Transferring -> Paused`，原因和 bounded progress 保留 | terminal/invalid state、version conflict；不释放 cache、不生成 transfer ACK/checkpoint。 |
| `ResumeAcquisition` / `FLOW-C05` | Paused 在重新证明 basis 后转 `Transferring` | stale authority/source、ambiguous transfer→RecoveryCase；不直接调用 transfer、不自动 replay。 |
| `CancelAcquisition` / `FLOW-C06` | local task `Cancelled` 或显式 recovery posture | terminal/version conflict；ambiguous effect 不压成 Failed；不删除 material、不调用 owner。 |
| `RequestRun` / `FLOW-C07` | qualified binding + safe resource + Sandbox semantic result 形成 local intent/receipt posture | missing Current/Verified/Qualified、resource conflict、Sandbox timeout→Unknown；Accepted response 不含 Running/terminal truth。 |
| `RequestRunControl` / `FLOW-C08` | control intent 按 `Start/Stop/Cancel` 独立记录并映射 owner receipt | Cleanup discriminator 被拒；ACK 不等 Confirmed；unknown 不重发；不写 Runtime truth。 |
| `RequestCleanup` / `FLOW-C09` | protection/owner basis current 时记录 cleanup/release posture | active/missing/stale guard→SafetyBlocked；Accepted 不等 Cleaned；不把 candidate 直接 Evicted。 |
| `OpenManualReview` / `FLOW-C10` | eligible RecoveryCase `Frozen/Querying/Conflict`→ManualReview | missing/not-visible/terminal/既有 ManualReview；不改变 selection/material/run/control，不关闭 case。 |
| `RequestDiagnosticHandoff` / `FLOW-C11` | all safe refs redacted 后记录 Handoff `Draft/Pending` 或 typed receipt | one unsafe item causes all-or-nothing block；redaction blocked、unknown delivery→RecoveryCase；Delivered 不等 evidence/report/signoff。 |

### 8.1 Command 共同断言

- Entry validation 失败时 reserve、repository、port、UoW 次数全部为 0。
- Duplicate replay 只读取 exact `RunnerStoredCommandResult`；domain transition、owner call、cache mutation、cleanup、handoff call 次数为 0。
- `RunnerCommandResponse.replay=DuplicateReplayed` 保留原 `result_ref`、operation kind 和 typed outcome，不从 current truth 重算。
- local accepted transition 必须与 required trace/history/result/marker 在 Step 11 规定的 terminal UoW 内完成；rejected/blocked/duplicate 不写 accepted trace。

## 9. Query 测试切口（12/12）

每个 Query 均覆盖 visible/current hit、合法 empty/missing、not-visible body-free、stale/partial/degraded、dependency failed/unsupported，并统一断言 no-write。Query 不 reserve idempotency、不开始写 UoW、不刷新 projection、不 reconcile、不 probe resource、不 dispatch Job。

| Query / flow | response/view 断言 | 必测 no-write / degraded 断言 |
|---|---|---|
| `ResolveRunnerContext` / `FLOW-Q01` | canonical subject、scope、visibility/freshness marker | resolver denied 不探测隐藏对象；write spies=0。 |
| `ListSelectableReleases` / `FLOW-Q02` | bounded page、opaque cursor、authority source attribution | unavailable→degraded/blocked page；不使用 latest/default、不触发 selection。 |
| `GetSelectionPosture` / `FLOW-Q03` | Selection state、binding、authority marker、generation | stale/blocked body posture显式；不 recheck/repair。 |
| `GetMaterialPreparation` / `FLOW-Q04` | task/cache/integrity 分轴，`Complete/Verified/Qualified` 不合并 | missing source/cache 不补历史 current；不 verify/download/promote。 |
| `GetCacheProtection` / `FLOW-Q05` | candidate 与 ProtectionState 独立、resource observation bounded | unknown guard→conservative surface；不 evict/delete/probe。 |
| `GetRunLifecycle` / `FLOW-Q06` | RunIntent/ControlIntent/OwnerRunProjection 分轴 | Accepted 不显示 Running；不调用 Sandbox/Runtime mutation。 |
| `GetResourceCleanupView` / `FLOW-Q07` | resource/guard/recovery section source attribution | Online/reconnect 不清 stale/unknown；不 reconcile/cleanup。 |
| `GetRecoveryCase` / `FLOW-Q08` | case state、subjects、expected basis、safe issue refs | not visible body-free；不 close/replay/resend/reclaim。 |
| `GetOutputPreview` / `FLOW-Q09` | bounded/redacted preview、visibility/freshness/degraded | raw output fallback=0；不读取未经 redaction 的 body。 |
| `GetFailureDiagnosis` / `FLOW-Q10` | diagnosis certainty、safe failure refs、next-step posture | redaction blocked→Unavailable/Blocked；不生成 evidence/report。 |
| `GetHandoffPosture` / `FLOW-Q11` | Handoff state/receipt/target posture | Delivered 不升级 evidence；不重发或写 owner。 |
| `GetRunnerReadModel` / `FLOW-Q12` | committed sections、composition generation、per-section marker | missing projection identity 只读呈现；不调用 J05 replace/upsert/rebuild。 |

## 10. Planned Consumer 与 outbound event 测试切口

### 10.1 Consumer（4/4）

| Consumer / flow | 当前可验证路径 | 必测断言 |
|---|---|---|
| `ConsumeReleaseAuthorityChange` / `FLOW-E01` | header-first `Blocked`/`UnsupportedVersion`/`Rejected`/strict stored `Duplicate` | source family、schema version、event ref、dedup key 缺失或冲突时不读 body；positive apply、owner cursor、ACK、payload hash/store=0。 |
| `ConsumeSandboxLifecycleChange` / `FLOW-E02` | 同上 | accepted 不映射 Running；blocked readiness 不解析 Sandbox payload；不修改 owner projection。 |
| `ConsumeRuntimeStatusChange` / `FLOW-E03` | 同上 | runtime status body 不进入 local truth；duplicate 只读完整 receipt；不把 online/ACK当 outcome。 |
| `ConsumeHandoffChange` / `FLOW-E04` | 同上 | handoff receipt 不生成 evidence/report/signoff；unsupported/blocked 保留 safe issue。 |

严格 stored duplicate 只在 trusted header 字段完整、同 operation/source/schema/dedup identity、同 safe digest、完整 stored receipt 可读时成立；否则为 Blocked/Unknown，不猜 payload。

### 10.2 Runner outbound event（0）

没有 Runner-owned outbound event family，因此测试入口是负向 no-residue 检查：扫描所有 11 Command、12 Query、4 Consumer、5 Job 的 fake call log，断言 publisher/outbox/topic/emit 次数为 0。Trace、history、receipt、report、projection、handoff marker 不能被当作 outbound event。

## 11. Operations Job 测试切口（5/5）

| Job / flow | 正向/终端 surface | 必测异常、恢复与 no-truth-repair |
|---|---|---|
| `AcquireAndVerifyMaterialJob` / `FLOW-J01` | bounded task stages、`Completed/Partial/Blocked/Failed/Unknown/Duplicate` 报告逐 variant 映射 | source/verifier/cache unavailable、digest mismatch、checkpoint stale/unknown、commit unknown；不改 Artifact/Governance truth、不自动重跑。 |
| `EvaluateCacheEvictionJob` / `FLOW-J02` | candidate page、guard evaluation、report | candidate≠delete；active/stale/unknown guard→Blocked/Partial；不直接 release/evict、不绕过 C09。 |
| `ReconcileRunnerStateJob` / `FLOW-J03` | safe readback、RecoveryCase posture、bounded local reconciliation report | owner read unavailable/ambiguous→Unknown/ManualReview；不 resend/reclaim/owner mutate/close without basis。 |
| `RefreshSafeDiagnosisJob` / `FLOW-J04` | redacted preview/diagnosis refresh、bounded report | one unsafe source blocks content; no raw log/stdout; no evidence/handoff submission。 |
| `RefreshVisibleSourcesJob` / `FLOW-J05` | existing projection identity + generation/version guarded section replacement | missing identity→Blocked/no-upsert；generation/version conflict→Conflict/Partial；Query/Online 不触发 refresh。 |

所有 Job 必测：同 key/digest duplicate 在 claim/scan/adapter 前 replay exact stored report；claim conflict 不 takeover；checkpoint unknown 不 reclaim/resume；`Blocked` 不压成 `Partial/Failed`，`Unknown` 必有 RecoveryCase。

## 12. 状态机测试切口（Step 10 正式名称）

| 状态主语 | 合法转换至少覆盖 | 非法/冻结/保留断言 |
|---|---|---|
| `SelectionState` | factory→Selected→Checking→Current/Blocked/Stale；explicit invalidate→Invalidated | Invalidated 不 reopen；latest/default、隐式 recheck、Current→Qualified 推导拒绝。 |
| `AcquisitionState` | factory→Absent→Resolving→Transferring→Complete；pause/resume/cancel/fail | terminal 不 reopen；ambiguous transfer 不直接 Failed；Complete 不等 Verified。 |
| `IntegrityState` | Pending→Verifying→Verified/Invalid/Blocked；basis drift→Stale | partial checks 不 Verified；terminal posture 不原地 reverify；本地 hash 不补 formal result。 |
| `MaterialCacheState` | Quarantined→Qualified；各非终态→Stale/Invalid→Evicted（safe release） | Candidate 不授权 Evicted；Stale/Invalid 不 promote；Evicted 不复用。 |
| `ProtectionState` | Protected↔（新 observation）Releasable；缺失/冲突→Unknown/Blocked | Unknown 不 release；Releasable 不等 Confirmed/Released/Evicted。 |
| `RunIntentState` | Draft→Submitting→Accepted/Rejected/Unknown/Invalidated | Accepted 不 Running；Unknown 不 resend；invalid binding 不提交。 |
| `ControlIntentState` | Pending→Accepted→Confirmed/Rejected/Unknown/Conflict | ACK 不 Confirmed；Confirmed 不 Cleaned；Unknown 不重复 control。 |
| `RecoveryState` | Open→Querying→Reconciled/ManualReview/Frozen/Closed（按正式 guard） | 未有 readback 不 Closed；Frozen/ManualReview 不自动 replay。 |
| `HandoffState` | Draft→Pending→Accepted/Delivered/Failed/Blocked/Unknown | Delivered 不 evidence/signoff；Unknown 不 resend；terminal 不 reopen。 |
| `ConnectivityState` | observation→Online/Degraded/Offline/Reconnecting；显式 recovery→Reconciling/ManualReview | reconnect 不 Online；Online 不清其他 section stale/unknown；Query 不迁移。 |
| `RunnerIdempotencyState` | Absent→Reserved→Completed/Conflict | Completed 缺 result→Unknown/recovery；不覆盖、expire、重算。 |
| `RunnerEntryState` | Received→Validating→Dispatching→Completed/Rejected | invalid entry 不 dispatch；exactly-one dispatch；Completed 不再变更。 |
| `RunnerHandlerDisposition` | typed Accepted/Rejected/NotVisible/Degraded/Unknown mapping | Unknown 不压 Failed；NotVisible 不 Missing success；body forbidden。 |
| `RunnerConsumerLoopState` | Registered→Delayed/Stopped/Failed；Running 仅 future fully-authorized path | 当前 blocker 下 Running 不可达；不自动 restart/ACK/replay。 |
| `RunnerConsumerItemDisposition` | header→Blocked/Unsupported/Rejected；strict stored duplicate→Duplicate | 缺 header 不查 receipt；不 parse/hash/store body；positive Accepted/Gap/Delayed 保留 reserved。 |
| `RunnerJobEntryState` | Registered→Running/Delayed/Rejected/Failed；Running→Completed/Failed/Unknown | Unknown 不转正常 Failed；不自动 rerun；terminal 不 reopen。 |
| `RunnerJobClaimState` | Unclaimed→Claimed→Released；ambiguity→Unknown | Unknown 不 reclaim；claim 不等 Sandbox lease。 |
| `RunnerCheckpointState` | Usable→Stale/Unknown/Closed | Unknown 不 resume/close；Closed 不 reopen；basis/sequence 不混 cursor。 |
| `RunnerJobDisposition` | report→Completed/Partial/Blocked/Failed/Unknown；stored replay→DuplicateReplayed | Blocked 不压 Partial/Failed；Duplicate 不新建 report；Unknown case 必填。 |
| `RunnerAdapterAvailabilityState` | factory→Enabled/Blocked；Enabled→Degraded/Unavailable/Blocked | config reload 新 marker；不原地恢复；Configured/Connected 不等 Enabled。 |
| `RunnerRuntimeBuildState` | NotStarted→ValidatingConfig→Assembling→Ready/Failed | missing core store 不 Ready；Ready/Failed 不原地重配；半装配 facade 不暴露。 |

`RunnerReadSection` 不建立独立状态机；另设 `projection_generation_guard` 测试：existing identity/version + same generation 可替换，缺 identity、generation mismatch、version conflict 均 no-write。

## 13. 持久化、事务、一致性与幂等测试切口

| 切口 | 设计依据 | 必测断言 |
|---|---|---|
| `persistence_expected_version` | Step 11 §7、§9 | stale `RunnerVersion` 不能覆盖；Conflict 保留 current；不得 last-write-wins。 |
| `persistence_append_unique` | Step 11 | trace/history/receipt/marker append unique；duplicate 不产生第二条 accepted record。 |
| `uow_local_write_set` | Step 9/11 | accepted local transition、result、idempotency complete、required marker 同 terminal boundary；external I/O 不在 UoW。 |
| `uow_commit_unknown_freeze` | Step 11/13 | commit unknown→RecoveryCase/Unknown；不 resend、reclaim、rerun 或 fallback store。 |
| `projection_identity_generation_guard` | Step 10/11 | J05 只能替换 existing identity；generation/version mismatch no-write；Query replace spy=0。 |
| `idempotency_same_digest_replay` | Step 13 | exact stored result/report/receipt replay，domain/port/job call=0。 |
| `idempotency_different_digest_conflict` | Step 13 | same operation/key different stable digest→Conflict；原记录和 result 不被覆盖。 |
| `idempotency_in_flight` | Step 13 | Reserved/in-flight 第二调用为 InProgress/Unknown；不执行第二 owner effect。 |
| `idempotency_missing_result` | Step 11/13 | Completed marker + missing/wrong-kind result→ConsistencyUnknown + RecoveryCase；绝不重算。 |
| `consumer_strict_duplicate` | Step 8/13 | 仅 trusted header 完整且 stored receipt 同族时 Duplicate；否则 Blocked/Unknown。 |
| `job_claim_checkpoint_race` | Step 10/13 | claim/checkpoint version race→Conflict/Unknown；不得自动 reclaim/resume。 |
| `query_zero_write` | Step 9/11/15 | 12 Query 对 reservation/save/refresh/reconcile/probe/dispatch/cleanup/handoff 全部为 0。 |

## 14. 错误、恢复、配置与外部依赖测试切口

### 14.1 错误与恢复

| 切口 | 必测映射 |
|---|---|
| `error_public_issue_mapping` | InvalidInput/MissingRequiredField/VisibilityDenied/StaleBasis/AuthorityBlocked/UnsupportedContract/DependencyUnavailable/IdempotencyConflict/VersionConflict/SafetyBlocked/ConsistencyUnknown 映射到正确 Command/Query/Consumer/Job surface。 |
| `error_invalid_transition_no_accept_trace` | domain illegal transition 返回 typed error；不写 accepted trace/history/outbox/projection/stored success。 |
| `error_unknown_recovery_pairing` | external timeout、terminal commit unknown、owner read unavailable、checkpoint ambiguity 必有 RecoveryCase/ref；不转 Failed/Success。 |
| `error_redaction_blocked` | redaction failure 返回 bounded Blocked/Unavailable；不落 raw stdout/stderr/adapter response。 |
| `error_visibility_no_existence_leak` | denied/not-visible 只返回 marker/body=None/items=[]；不通过 fallback 查询证明存在。 |
| `error_job_disposition_mapping` | `Completed/Partial/Blocked/Failed/Unknown/DuplicateReplayed/Rejected` 逐 variant 保持，不升级或压缩。 |

### 14.2 配置与依赖

| 切口 | 必测断言 |
|---|---|
| `config_required_refs_validation` | profile/store/adapter refs、finite limits、feature marker 缺失/冲突被拒；raw secret/body 不进入 issue。 |
| `config_configured_enabled_ready_split` | configured ≠ enabled ≠ ready；owner/SDK/physical blocker 产生 Blocked/Unavailable，不伪造 Enabled。 |
| `config_missing_core_store_not_ready` | local transaction/version/durability/corruption guarantee 不可证明时 builder 不暴露 facade。 |
| `config_reload_new_builder` | reload 创建新 builder/marker；不原地修复已有 marker、改变 truth invariant 或中断旧 basis。 |
| `dependency_sdk_first` | adapter 只能调用 semantic port；不存在的 SDK method/private Sandbox implementation 不可通过编译或 test double 旁路。 |
| `dependency_runtime_event_classification` | owner/SDK/bus 运行期或事件协作不被误写为 package/path dependency；planned Consumer positive path仍 blocked。 |

## 15. 可观测性、审计与禁止字段测试切口

| 切口 | 必测断言 |
|---|---|
| `observability_required_log_fields` | command/query/consumer/job/repository/adapter/config 入口带 safe kind/ref/outcome/duration/diagnostic ref；缺字段拒绝或标 issue。 |
| `observability_low_cardinality_metrics` | metric labels 仅 command/query/operation/job/disposition 等有限类别；不得含 actor/subject/request/result/projection/trace ID、自由文本、URL/topic/SQL/body/secret。 |
| `observability_accept_reject_audit_split` | accepted local transition 才有 accepted trace/history；rejected/blocked/duplicate/failed 只有 operational log/metric/report，不写 accepted audit。 |
| `observability_unknown_recovery_correlation` | Unknown log/trace/marker 与 RecoveryCase/issue ref 相关联；不写 success/evidence。 |
| `observability_handoff_boundary` | handoff marker/receipt 只保存 target/package/receipt refs；不保存 L4/L6 body，不升级 evidence/report/verdict/signoff。 |
| `redaction_forbidden_field_scan` | logs、metrics、local trace、stored result、receipt、report、config issue 均拒绝 raw body、secret、credential、token、URL、host path、PID/port/socket、stack trace。 |
| `observability_trace_context_propagation` | trace context 来自 trusted command/query/consumer/job metadata；domain 不生成替代 trace。 |

## 16. 脚本契约（仅定义边界，不创建脚本）

当前目标实现仓不存在，语言、测试 runner、artifact/report root 和命令路径尚未获 authority；因此本节只登记后续 `05/07` 可展开的 semantic script contracts，不声明路径或脚本已存在。

| 逻辑脚本契约 | 类型 | 输入 | 输出 | 失败语义 | 当前状态 |
|---|---|---|---|---|---|
| `runner_contract_gate` | gate | source、selected profile、fake/fixture capability set | structured gate result、safe failure refs | 任一 contract/no-write/redaction/state assertion 失败即非 0；不得生成伪造 evidence | planned/blocked |
| `runner_redaction_check` | check | structured logs、metrics、trace、local records | forbidden-field findings | 发现 raw body/secret/path/high-cardinality label 即失败 | planned/blocked |
| `runner_consistency_check` | check | repository/UoW/idempotency/projection call traces | consistency diagnostic | version/order/generation/no-replay 断言失败即失败 | planned/blocked |
| `runner_protocol_schema_check` | contract | DTO/schema fixtures | schema/variant report | missing secondary type、unknown enum mapping 或 body leak 即失败 | planned/blocked |

不在本 Step 固定 `scripts/` 路径、命令行参数、artifact root、report root 或 run identifier；待 `04/05/07` 与真实实现仓/测试工具确认后再落正式契约。

## 17. 跨 Step 闭环审计

| 审计项 | 结论 | 依据/待确认 |
|---|---|---|
| 七模块均有测试入口 | pass for semantic contract | §7；物理 test target 受 `RUN-DDD-001~003` 阻塞。 |
| 11 Command 独立正/负/重复/冲突入口 | pass | §8、Step 8/9/10/13。 |
| 12 Query response/no-write 入口 | pass | §9；不声明执行结果。 |
| 4 Consumer header-first negative path | pass for reserved path | §10；positive payload/transport 受 `RUN-UP-001~008` 阻塞。 |
| 0 outbound event residue | pass | §10.2；publisher/outbox/topic 调用应为 0。 |
| 5 Job terminal/report/replay 入口 | pass | §11；physical scheduler/store 未定。 |
| 21 state subject legal/illegal coverage | pass | §12；projection guard separately covered。 |
| persistence/UoW/version/generation | pass for logical contract | backend/locking/migration/corruption implementation `RUN-DDD-003`。 |
| error/recovery/no-replay | pass | Step 12/13；exact SDK code mapping `RUN-UP-008`。 |
| config/dependency readiness | pass for semantic binding | full config schema/product in later `04`。 |
| observability/redaction | pass for field boundary | backend/retention/SLO/runbook pending。 |
| scripts/CI/evidence | planned only | no script/test/evidence exists or was run. |

## 18. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 详细设计是否写完整测试计划 | 写完整计划 / 只写最小切口 | 采用后者；避免替代 `05`。 |
| 协议测试粒度 | 只测模块 / 每个 public protocol 独立切口 | 采用每协议独立；32 条 flow 不被通用 happy path 隐藏。 |
| Consumer positive path | 先写假 payload / 只验证 header-first negative | 采用后者；未闭合上游不得伪造 schema、ACK 或 owner apply。 |
| duplicate replay | 重算 current truth / replay immutable stored surface | 采用后者；与 Step 11/13 一致。 |
| fake adapter | 只模拟 success / 可注入 blocked、unknown、conflict、redaction failure | 采用可注入失败；才能验证 fail-closed。 |
| script path | 预写标准目录 / 保持 semantic contract blocked | 采用后者；目标仓和 runner 未定。 |

## 19. 回填草稿（未来正式 §15）

正式 `03-详细设计.md` §15 应：

1. 以七模块表、32 条 protocol/job 表、21 状态主语表和 consistency/error/observability 表作为实现入口。
2. 明确本节是最小验证切口，不替代后续 `05-测试方案.md`、`06-验收标准.md` 或 `07-实施计划.md`。
3. 明确所有测试状态为 `planned/blocked`，不声称 test runner、fixture、artifact、report、evidence、verdict 或 readiness 存在。
4. 把 Query no-write、Consumer no-parse、Job no-truth-repair、Unknown no-replay、redaction forbidden-field 作为不可省略的负向断言。
5. 将脚本契约标为 planned/blocked，待真实实现仓和下游文档确认后再固定路径与参数。

## 20. 待确认事项与进入下一步条件

| 待确认事项 | 影响 | 未确认前处理 |
|---|---|---|
| 目标实现仓、语言/runtime、测试 runner | 无法创建真实 test target/fixture/script | 只保留 semantic test cuts；`RUN-DDD-001/002`。 |
| local store/cache/backend/locking | 无法执行 durable consistency test | fake/in-memory 只作为设计替身；`RUN-DDD-003`。 |
| SDK exact error/trace/redaction surface | 无法做真实 adapter integration test | semantic fake + blocked mapping；`RUN-UP-008`。 |
| Artifact/Governance/Sandbox/Runtime/Observability/Archive exact contracts | positive integration/consumer tests | header-first/blocked/unknown only；`RUN-UP-001~007`。 |
| test/report/evidence script roots | 无法固定命令和 artifact path | 后续 `05/07` 再定，不创建脚本。 |

进入 Step 17 的条件：

- [x] 七模块测试切口完整。
- [x] 每个 Command/Query/Consumer/Job 有独立正/负或保留路径。
- [x] 状态、持久化、幂等、错误、配置、观测和禁止字段均有切口。
- [x] no-write/no-replay/no-parse/no-truth-repair 边界可断言。
- [x] 无任何测试结果、artifact、evidence、baseline、run_id 或 readiness 声明。
- [x] 上游和物理 blockers 保持显式记录。

Step 16 完成；下一步为 Step 17 实施承接清单。
