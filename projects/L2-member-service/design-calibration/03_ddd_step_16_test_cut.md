# Step 16：测试切口与最小验证清单

> 项目：`L2-member-service`
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 16
> 书写规范：`standards/document/详细设计书写规范.md` §5.15
> 参考粒度：`projects/L1-governance/design-calibration/03_ddd_step_16_test_cuts.md`
> 目标正式文档：`projects/L2-member-service/03-详细设计.md`
> 校准日期：2026-09-02

## 1. Step 状态、目标与边界

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 16 测试切口与最小验证清单 |
| 当前状态 | completed / pass_with_upstream_blockers |
| 输入 | Step 5~15 模块、对象、Port、协议、函数流、状态、事务、错误、并发、配置和观测契约 |
| 输出 | 本仓实现者可直接交给 `05-测试方案.md` 和 `07-实施计划.md` 的最小测试入口；本文件自身不包含执行结果 |
| 正式正文 | 仍禁止写入；正式 `03` 只在 Step 19 装配 |
| 本步不锁定 | 测试用例编号、覆盖率阈值、fixture 全集、真实 durable store / broker / sibling 联调、CI 排期、报告结论、evidence、signoff 或 readiness |

本步固定“代码应在哪些切口被验证”，不声称任何测试已经执行。Fake、in-memory、stub 只能验证本地契约和失败语义，不能证明 Runtime、Member、Images、Sandbox、Core、Bus、SDK 或观测后端已可用。

## 2. 本步目标

本 Step 必须使后续实现者能够判断：

- 七个实现模块各自至少需要哪些单元、service、adapter 或 entry 测试。
- 每个 Command、Query、Consumer、material append helper 和 Job 至少有一条正向切口与一组异常切口。
- Step 10 的每个正式状态轴都有合法和非法转换验证。
- UoW、expected revision、append-only sidecar、幂等、duplicate replay、并发竞争和 commit unknown 如何被验证。
- 错误、配置、依赖可用性、观测字段和 redaction 如何被自动检查。
- 哪些具体测试计划仍由后续 `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 承接。

本步不重新定义对象、状态、协议或测试策略，不把测试切口写成测试结果，也不把 fake parity 写成真实产品 readiness。

## 3. 本步输入与 SOP 问题回答

### 3.1 输入基线

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_05_module_contracts.md` | completed | 固定 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个测试主轴 |
| `03_ddd_step_06_object_contracts.md` | completed / pass_with_upstream_blockers | 固定 Host Truth 对象、local record、safe view、marker、report 和 entry carrier 的不变量切口 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | completed / pass_with_upstream_blockers | 固定 repository、resolver、publisher、handoff、UoW、Clock、IdGenerator、fake failure injection 切口 |
| `03_ddd_step_08_protocol_contracts.md` | completed / pass_with_upstream_blockers | 固定 10 个 Command、6 个 Query、5 个 Consumer、1 个 material append helper、7 个 Job 的实际 inventory |
| `03_ddd_step_09_function_flows.md` | completed / pass_with_upstream_blockers | 固定 validate、reserve、load、domain、save、materialize、result、commit 的顺序以及 no-write / no-authorization 规则 |
| `03_ddd_step_10_state_machine.md` | completed / pass_with_upstream_blockers | 固定正式状态名、合法迁移、非法迁移与禁止跨轴推导 |
| `03_ddd_step_11_persistence_tx_consistency.md` | completed / pass_with_upstream_blockers | 固定 UoW 写集、revision、cursor 分离、history/material/outbox/projection 一致性切口 |
| `03_ddd_step_12_errors_recovery.md` | completed / pass_with_upstream_blockers | 固定错误分层、retry、hold、unknown、gap、rollback、manual recovery 切口 |
| `03_ddd_step_13_concurrency_idempotency.md` | completed / pass_with_upstream_blockers | 固定 key/digest、duplicate、in-flight、conflict、commit unknown、generation/effect/handoff race 切口 |
| `03_ddd_step_14_config_dependencies.md` | completed / pass_with_upstream_blockers | 固定 config validation、adapter availability、disabled/degraded/unavailable 与依赖边界切口 |
| `03_ddd_step_15_observability_audit.md` | completed / pass_with_upstream_blockers | 固定 structured log、低基数 metric、audit refs-only、trace propagation、forbidden-body/redaction 切口 |

### 3.2 SOP 问题回答

| 问题 | 本仓结论 |
|---|---|
| 每个模块至少需要哪些单元测试？ | `contracts` 测 DTO/ref/metadata/reason/marker/view/receipt/job roundtrip；`domain` 测对象 factory、不变量、policy 和状态矩阵；`application` 测 command/query/consumer/job 编排、UoW、幂等和错误映射；`infra` 测 repository version/page/unique/transaction、fake adapter、builder/config；`api` 测 metadata/body validation 与 protocol mapping；`worker` 测 envelope/dedup/outbox/projection entry；`jobs` 测 selector、partial failure、report replay 和 no-truth-repair。 |
| 每个接口至少需要哪些正向和异常测试？ | 每个 Command 至少覆盖 accepted 或明确 blocked/waiting positive ceiling、invalid/domain reject、duplicate replay、digest conflict、version conflict；每个 Query 覆盖 hit、missing、not-visible、stale/degraded/unavailable 和 no-write；每个 Consumer 覆盖 accepted local marker、duplicate、unsupported、late/gap、rejected/delayed；material helper 覆盖 immutable snapshot 与 append failure；每个 Job 覆盖 completed/partial/failed、duplicate report、invalid selector 和 no business truth repair。 |
| 状态机合法转换和非法转换如何测试？ | 以 Step 10 的正式 enum 和转换表为唯一真相源；每个状态轴覆盖主线合法迁移、边界迁移、非法迁移及 terminal guard。非法迁移必须断言指定的 domain/application/worker/job error，并断言不写 accepted history、material、outbox、projection 或 stored success result。 |
| 事务、一致性、幂等和并发如何验证？ | 用 fake/in-memory repository、UoW、resolver、publisher、handoff、Clock 和 IdGenerator 注入 expected-version、unique、unavailable、result-missing、commit-unknown、rollback failure、same/different digest、dual publisher、projection cursor、generation fence、late feedback 和 job partial failure。断言写入顺序、原 key 保留、rollback/no-write 与 marker 层级。 |
| 哪些测试细节应留给后续测试方案？ | TC 编号、优先级、覆盖率目标、fixture/seed、真实 store/broker/adapter 联调、CI job、报告格式、evidence 编号、验收 veto 和执行排期留给 `05/06/07`。 |

## 4. 当前材料问题诊断与设计取舍

### 4.1 当前材料问题诊断

| 材料位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 5 | 七模块 owner 已固定，但测试入口没有按 crate 组织 | 建立七模块测试切口总表，避免把 domain test 与 adapter test 混写 |
| Step 6 | 对象、safe view、marker、report 的字段和不变量分散在对象卡 | 将 factory、rehydrate、forbidden body、状态和唯一集合验证映射为测试入口 |
| Step 7 | Port 失败语义已有定义，但 fake parity、version conflict 和 side-effect ordering 需要可验证入口 | 为每类 Port 增加 fake failure injection 和实现侧契约检查 |
| Step 8 | 旧材料曾混用 Command / Event 数量，本仓实际 inventory 需要重新计算 | 本 Step 只使用 10 Command、6 Query、5 Consumer、1 helper、7 Job，不引入旧数量 |
| Step 9 | flow 已固定顺序，但测试需要逐接口反查 accepted/rejected/duplicate/no-write | 按协议逐项列正向与异常切口，保留 placeholder/fail-closed 上限 |
| Step 10~13 | 状态、事务、错误、幂等和并发跨文件分散 | 统一形成状态、一致性、replay、race、unknown 交叉矩阵 |
| Step 14~15 | 配置和观测有安全边界，但缺自动检查入口 | 增加 config fail-fast、metric label、redaction、audit refs-only 检查 |
| 旧正式 `03`、旧 `05/06` | 可能带入 `MemberRuntimeSession`、`WorkerSlot`、直接 runtime callback、外部 body 或实现证据 | 仅作污染审计；本 Step 不沿用旧测试名、旧状态或旧产品事实 |

### 4.2 设计取舍

| 议题 | 采用方案 | 未采用方案与原因 |
|---|---|---|
| 详细设计中的测试粒度 | 只定义最小 test cut | 不写完整测试计划，避免替代 `05-测试方案.md` |
| 协议清单 | 逐个列出 10 Command、6 Query、5 Consumer、1 helper、7 Job | 不继承兄弟项目的 23/14/9/12 数量，避免污染本仓 inventory |
| 上游 placeholder | positive ceiling 写为 blocked/waiting/unknown 时仍可测试 | 不伪造 Member/Runtime/Images/Sandbox 的 accepted 或 healthy 结果 |
| duplicate replay | 回放 stored command outcome、consumer receipt 或 job report | 不从 current truth 重算，不触发第二次 resolver、publisher 或 handoff |
| 状态测试 | 合法与非法转换同时覆盖 | 不只测 happy path，因为非法转换和 no-side-effect 是可落码门禁 |
| fake adapter | 必须支持 failure injection 与 revision/unique parity | 不把 fake success 当成真实外部系统可用 |
| 观测测试 | 检查字段安全、低基数和 refs-only | 不以“有日志”替代 forbidden body、secret 和 trace 边界检查 |

## 5. 测试切口总图

```text
Step 5 module contracts
  -> seven module / crate test cuts
Step 6 object contracts + Step 7 ports
  -> invariant / repository / adapter fake tests
Step 8 protocol inventory + Step 9 function flows
  -> 10 Command / 6 Query / 5 Consumer / 1 helper / 7 Job cuts
Step 10 state machine
  -> legal / illegal transition cuts
Step 11~13 persistence / error / idempotency / concurrency
  -> UoW / rollback / replay / conflict / race / commit-unknown cuts
Step 14~15 config / observability
  -> fail-fast / availability / redaction / low-cardinality checks
```

该图只表达测试来源与覆盖关系，不表达测试执行顺序、CI 拓扑或真实外部依赖已就绪。

## 6. 七模块测试切口汇总

| 测试切口 | 对应模块 / 契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `contracts_protocol_roundtrip` | `contracts` / Step 8 | 10 Command、6 Query、5 Consumer、material carrier、7 Job、metadata、result、receipt、error 和 schema/version 的 roundtrip；required field、enum、新类型稳定性 | contract unit |
| `contracts_metadata_and_digest_validation` | `contracts` / Step 8、13 | Command/Consumer/Job 必须有 idempotency key；Query 禁止 key；correlation/trace 必填；canonical digest 排除 volatile metadata；same/different digest 判定稳定 | contract unit |
| `contracts_safe_view_redaction` | `contracts/src/views.rs` / Step 6、15 | `HostSafeSlice` visible field 非空且有序唯一；summary 与 field selection 一致；host/generation 配对；禁止 raw endpoint、credential、external body | contract unit |
| `domain_object_invariants` | `domain` / Step 6 | 29 个业务对象及 local record 的 factory、rehydrate、typed ref、dual-anchor、generation、same-subject、reason 和 immutable/append-only 不变量 | domain unit |
| `domain_policy_and_state_matrix` | `domain` / Step 6、10 | policy guard、no-fallback、single-active、generation fence；所有正式状态轴合法/非法转换和 terminal guard | domain unit |
| `domain_material_history_outbox_projection` | `domain/src/material.rs` 等 / Step 6、11 | committed change anchor、body-free material、history relation、outbox snapshot、projection freshness 和 feedback layer 不互推 | domain unit |
| `application_command_query_consumer_job_orchestration` | `application` / Step 9、11、13 | validate→reserve→load→domain→save sidecars→stored result→complete→commit；Query no-write；Consumer safe write ceiling；Job no-authorization | service test |
| `application_error_and_disposition_mapping` | `application` / Step 12 | domain/repository/resolver/publisher/handoff/UoW/idempotency error 映射为 accepted/rejected/blocked/unknown/unavailable/delayed/partial/failed，不提升 positive ceiling | service test |
| `infra_repository_uow_semantics` | `infra/persistence` / Step 7、11、13 | version/unique/page/index、UoW atomicity、rollback、不泄漏 cursor/result/outbox、stored result save-before-complete、commit unknown 查询 | repository fake |
| `infra_adapter_failure_injection_and_parity` | `infra/adapters` / Step 7、12、14 | resolver、Member/Runtime/Images/Sandbox/carrier/publication seam 的 success ceiling、unavailable、retryable、permanent、body rejected、digest mismatch；fake 与 planned adapter error class 一致 | adapter fake |
| `infra_runtime_builder_config_validation` | `infra/runtime_builder.rs`、`config.rs` / Step 14 | typed config、dependency binding、availability、disabled/degraded/unavailable、forbidden configurable boundary 和 builder 顺序；不写死产品 | config / assembly test |
| `api_entry_validation_mapping` | `api` / Step 8、9、12 | actor/scope/metadata/body validation；Command/Query handler mapping；invalid input 不开启 mutation UoW；Query 只读 | handler test |
| `worker_consumer_outbox_projection_entry` | `worker` / Step 8、9、11、13 | envelope identity/version、dedup、late/gap、receipt、outbox submission marker、projection trigger、unsupported no-parse 和 re-entry | worker test |
| `jobs_runner_selection_report` | `jobs` / Step 8、9、12、13 | selector/page validation、per-item UoW、partial report、stored report replay、unknown key 保留、no business truth repair | job runner test |
| `observability_redaction_contract` | Step 15 | runtime log 安全字段、metric 低基数、audit/history/marker refs-only、trace/correlation propagation、禁止 request/event/external/secret body | observability check |

## 7. Command 测试切口（10 个）

每个 Command 必须至少覆盖一条成功或明确正向上限路径、一条输入/域错误路径、一条 duplicate/conflict 路径。`Placeholder` 的正向上限只能是本地 accepted shell、blocked、waiting 或 unknown，具体取决于上游合同状态。

| 测试切口 | Command | 正向切口 | 异常 / 边界切口 | 建议测试类型 |
|---|---|---|---|---|
| `accept_host_intent_command` | `AcceptHostIntentCommand` | 双锚、source、scope、requested action 合法；intent accepted；history/material/outbox/projection/result 与 truth 同一 UoW | subject/scope/source 缺失；domain reject；same key replay；different digest conflict；version conflict；不创建 generation/action | API + application |
| `decide_host_orchestration_command` | `DecideHostOrchestrationCommand` | accepted intent + current selector 形成 committed decision | intent 未 accepted；current revision conflict；policy blocked；duplicate replay；不宣称 host/action success | API + application |
| `resolve_host_qualification_command` | `ResolveHostQualificationCommand` | 所有可用 source 形成 qualification record；same-generation source/item/gap canonical set | 任一 source unavailable/stale/unknown；placeholder seam 只得 blocked/waiting；缺 required source 不得 Ready；duplicate 不重跑 resolver | service + adapter fake |
| `coordinate_host_assembly_command` | `CoordinateHostAssemblyCommand` | required item set 完整记录；assembly `Complete` 与 readiness 独立评估 | duplicate item/乱序/缺项；assembly complete 但 readiness not ready；generation mismatch；version conflict | service + domain |
| `establish_host_generation_internal` | `EstablishHostGenerationCommand` | committed decision + current pointer guard 建立一个 local generation | current pointer race；generation duplicate；无 formal decision；不创建 container/process/Runtime/Sandbox resource | application + repository fake |
| `prepare_host_action_internal` | `PrepareHostActionCommand` | committed action decision 形成 immutable `ExternalEffectKey` 与 `Prepared` attempt | decision 未 committed；target/generation mismatch；effect key conflict；prepare 前不调用 external port；重复调用回放同 attempt | application + domain |
| `accept_host_registration_placeholder` | `AcceptHostRegistrationCommandPlaceholder` | safe registration ref/fingerprint 在上游允许时形成 local accepted shell；未闭合时 blocked/waiting | Member/credential contract pending；raw body/secret rejected；generation mismatch；duplicate replay；不得声明 reachable/ready | service + fake seam |
| `maintain_host_session_placeholder` | `MaintainHostSessionCommandPlaceholder` | accepted registration + safe endpoint 在 formal Runtime association 可用时形成 local session shell | association unavailable/unknown -> blocked；endpoint stale/invalidated；duplicate；不创建 Runtime run/turn/checkpoint/outcome | service + fake seam |
| `decide_host_recovery_command` | `DecideHostRecoveryCommand` | current host/generation + assessment/failure + formal control source 形成 recovery decision | basis stale/missing；formal control pending；invalid action/state；same key replay；不执行 Runtime recovery、不创建 closure | API + application |
| `close_host_command` | `CloseHostCommand` | local closure、registration/session invalidation 和 cleanup attempt 在同一 UoW 提交 | no current host；closure causality missing；cleanup key conflict；commit unknown；不声明 external cleanup complete | API + application |

Command accepted path 的共同断言：`HostChangeCursor` / `CommittedChangeCursor` 不互换；accepted local sidecar 只有在 truth / marker 实际提交后才可被引用；任何上游 positive contract 未闭合时返回 fail-closed disposition。

## 8. Query 测试切口（6 个）

Query 必须验证 resolver-first visibility、safe mapper、freshness/disposition 和绝对 no-write。Query 不 reserve idempotency、不开始写 UoW、不 refresh source、不 rebuild projection、不 append history/material/outbox、不创建 stored result。

| 测试切口 | Query | 正向切口 | 异常 / 边界切口 | 建议测试类型 |
|---|---|---|---|---|
| `query_current_host_decision` | `QueryCurrentHostDecision` | 可见 subject 读取 current decision safe slice 和 freshness | missing、not-visible、stale/degraded、repository unavailable；无 decision 创建或 refresh | query service |
| `query_host_assembly_readiness` | `QueryHostAssemblyReadiness` | 读取 qualification/assembly/readiness per-axis safe summary | source/item gap、unknown、not-visible、stale；不调用 resolver、不把 Complete 改成 Ready | query service |
| `query_host_access_session` | `QueryHostAccessSession` | registration/endpoint/session redacted slice | missing registration、endpoint stale/invalidated、association blocked/unknown；不接受注册或建立 Runtime association | query service |
| `query_host_health_failure` | `QueryHostHealthFailure` | signal/assessment/failure/recovery four-axis summary | no signal、late/stale、failure unknown、not-visible、repository unavailable；不重评估、不创建 recovery | query service |
| `query_safe_host_facts` | `QuerySafeHostFacts` | projection/material safe view/page，freshness 与 gap refs | projection stale/rebuilding/degraded/unavailable、empty、not-visible；不 rebuild、不反写 source | query service |
| `query_host_history` | `QueryHostHistory` | append-only history page 与 opaque public cursor | empty、not-visible、invalid cursor、repository unavailable；page cursor 不作为 optimistic version，不追加 history | query service |

## 9. Inbound Consumer 测试切口（5 个）

Consumer 只写允许的 snapshot、feedback、stale/gap、marker 和 receipt。Consumer arrival 不得直接迁移 Ready、Healthy、Recovery、Closure 或创建新的 intent/decision/generation/effect key。

| 测试切口 | Consumer | 正向切口 | 异常 / 边界切口 | 建议测试类型 |
|---|---|---|---|---|
| `qualification_source_changed_consumer` | `QualificationSourceChangedConsumerPlaceholder` | envelope 合法；写 safe source snapshot、qualification stale marker、receipt | unsupported version 不解析 body；source unavailable -> delayed；duplicate receipt replay；不写 decision/ready | consumer |
| `host_action_outcome_consumer` | `HostActionOutcomeConsumerPlaceholder` | effect key + attempt + generation matching；写 safe outcome/association marker、receipt | unknown/late/old generation；effect digest conflict；duplicate；不生成新 attempt、不覆盖 current | consumer |
| `host_health_signal_consumer` | `HostHealthSignalConsumerPlaceholder` | capture ordered signal snapshot、assessment-due marker、receipt | unsupported/invalid/late/stale/duplicate；不把 signal accepted 写成 healthy/recovery | consumer |
| `host_cleanup_feedback_consumer` | `HostCleanupFeedbackConsumerPlaceholder` | matching cleanup key/target/generation 写 safe release outcome 或 residual marker | timeout/ack unknown；target mismatch；duplicate；不声明 external cleanup complete、不换 cleanup key | consumer |
| `host_handoff_feedback_consumer` | `HostHandoffFeedbackConsumerPlaceholder` | 只更新一个 target-specific feedback layer 和 receipt | layer skip/reorder、unknown/gap、target mismatch、duplicate；不从 submitted 推导 delivered/observed/accepted | consumer |

## 10. Material append helper 与 Operations Job 测试切口

### 10.1 `HostFactMaterialEventCandidate` material append helper

| 测试切口 | 对应契约 | 正向切口 | 异常 / 边界切口 | 建议测试类型 |
|---|---|---|---|---|
| `material_append_uses_committed_change` | `HostFactMaterialEventCandidate` / Step 9、11 | 从已提交 local change 构造 body-free `HostFactMaterial`，生成 immutable outbox snapshot，追加 history/material/outbox 并 mark stale | 缺 committed change；raw body 或 cursor 类型错误；outbox/payload append failure 整体 rollback；publisher 不在 helper 内调用 | application + repository fake |

### 10.2 Operations Job（7 个）

| 测试切口 | Job | 正向切口 | 异常 / 边界切口 | 建议测试类型 |
|---|---|---|---|---|
| `dispatch_pending_host_actions_job` | `DispatchPendingHostActionsJob` | 扫描 prepared attempts；每 item 以原 effect key dispatch；记录 item report | 双 worker version race；carrier unavailable/retryable/permanent；unknown 保留 key；duplicate report replay；不创建 decision/generation | job + repository fake |
| `evaluate_due_host_health_job` | `EvaluateDueHostHealthJob` | 读取 accepted signal/current facts，写 assessment/failure report | signal gap/late/stale；partial item failure；duplicate report；不隐式创建 recovery decision | job + domain |
| `progress_pending_host_cleanup_job` | `ProgressPendingHostCleanupJob` | 处理 prepared cleanup attempts，写 safe result/unknown/gap | release unavailable/timeout；same-key race；unknown 进入 reconciliation；不声明 external cleanup complete | job + fake seam |
| `reconcile_host_residuals_job` | `ReconcileHostResidualsJob` | 比较 local facts 与 safe external summary，追加 finding/case/report | external summary unavailable/body rejected；case version conflict；partial report；不修改 sibling/backend truth | job + application |
| `publish_host_fact_outbox_job` | `PublishHostFactOutboxJob` | 读取 stored payload，提交 publication marker/handoff record | dual publisher single-winner；payload missing；publication unknown/dead-letter；不回查 current truth 组包 | worker/job + repository fake |
| `rebuild_safe_host_projection_job` | `RebuildSafeHostProjectionJob` | 从 committed source cursor 重建 projection/view，更新 freshness | old cursor 不覆盖 newer state；missing material；rebuild failed/degraded/unavailable；不反写 source truth | job + projection fake |
| `reconcile_host_handoff_gaps_job` | `ReconcileHostHandoffGapsJob` | 以同一 HandoffKey/target 建立 bounded retry 或 waiting feedback link | key/target mismatch；feedback unknown；duplicate report；不换 key 盲重放、不声明 accepted | job + handoff fake |

Job 共同断言：scheduler/run id 不是业务幂等 key；Job 只推进已提交 work，不产生 authorization、intent、decision、新 generation 或 external completion。

## 11. 状态机测试切口

以下测试只使用 Step 10 的正式状态名；`HostRevision`、repository expected version、cursor、query disposition、receipt、adapter availability 和 timestamp 不是状态机变体。

| 测试切口 | 状态轴 | 合法转换覆盖 | 非法 / terminal 覆盖 | 建议测试类型 |
|---|---|---|---|---|
| `host_intent_acceptance_transitions` | `HostIntentAcceptanceStatus` | `Received -> Accepted/Rejected/Conflicted`；`Accepted -> Superseded` | terminal/重复 superset、缺双锚、跨 subject | domain unit |
| `host_decision_transitions` | `HostDecisionStatus` | `Proposed -> Committed/Voided`；`Committed -> Superseded/Voided` | 未满足 intent、二次 commit、void terminal | domain unit |
| `qualification_transitions` | `QualificationStatus` | `Pending -> Resolving -> Resolved/Partial/Blocked/Unknown` | 缺 source 却 Resolved；stale/unknown 被改成 positive | domain unit |
| `assembly_readiness_transitions` | `HostAssemblyStatus` / `HostReadinessStatus` | assembly `Building -> Complete/Blocked`；readiness `Unevaluated -> Ready/NotReady/Blocked/Unknown` | `Complete -> Ready` 直接跳跃；generation mismatch；Superseded terminal | domain unit |
| `host_generation_transitions` | `HostLifecycleStatus` / generation currentness | `Established -> Current/Closing`；`Current -> Closing/Superseded`；`Closing -> Closed`；candidate -> current/historical | 双 current、旧 generation 覆盖 current、Closed 回活 | domain unit |
| `action_attempt_transitions` | `HostActionAttemptStatus` | `Prepared -> Dispatched/Held`；`Dispatched -> Succeeded/Failed/Unknown`；`Unknown -> Held` | 未 Prepared 先 dispatch；Unknown 换 key；Succeeded 直接推导 Ready | domain unit |
| `association_transitions` | `HostExternalAssociationStatus` | `Pending -> Associated/Unknown/Invalid`；`Associated -> Stale/Released` | old generation 覆盖 current；Released 回 Associated | domain unit |
| `registration_endpoint_session_transitions` | registration / endpoint / Host Session | registration Proposed -> Accepted/Blocked/Rejected；endpoint Pending -> Active；session Pending -> Associated -> Active/Stale | registration Accepted 直接推 session Active；Runtime contract 缺失仍 positive；terminal invalidation 回活 | domain + application |
| `health_and_recovery_transitions` | signal / assessment / failure / recovery | Captured -> Accepted/Rejected/Duplicate/Late/Stale；assessment Pending -> Evaluated/Stale；failure Unclassified -> Classified/Uncertain；recovery Proposed -> Committed/Blocked/Voided | signal -> Healthy；assessment -> Recovery；旧 signal 覆盖新 basis | domain + job |
| `closure_cleanup_transitions` | closure / cleanup attempt | closure Proposed -> LocallyClosed/PendingCleanup/Blocked；cleanup Prepared -> Dispatched/Held -> Succeeded/Failed/Unknown | cleanup success -> external closed；Unknown 换 key；LocallyClosed 直接 external complete | domain + job |
| `residual_reconciliation_transitions` | finding / case | finding Open -> Observed/Resolved/Invalidated；case Open -> Investigating/Held/Escalated -> Resolved/Held | query/job 隐式修复 source；Resolved 推 external repaired | domain + job |
| `material_handoff_outbox_transitions` | handoff / outbox / projection | handoff per-layer `Prepared -> Submitted -> Delivered -> Observed -> Accepted` with owner feedback；outbox Pending -> Submitted/Unknown/Gap；projection Unbuilt -> Rebuilding -> Fresh/Degraded/Unavailable | submitted 推 delivered/accepted；projection Fresh 反写 source；cursor 混用 | domain + worker |
| `history_and_idempotency_transitions` | append-only history / idempotency / job report | immutable append；reservation -> completed；completed duplicate replay；job report completed/partial/failed | duplicate append；missing stored result 重新计算；completed 覆盖 conflict | repository + application |

## 12. 一致性、幂等、并发与未知结果测试切口

| 测试切口 | 对应契约 | 必须断言 | 建议测试类型 |
|---|---|---|---|
| `command_duplicate_same_digest_replays_result` | Step 8、13 | 同 key 同 digest 只回放 stored command outcome；无第二次 domain transition、history/material/outbox、resolver 或 external call | application |
| `same_key_different_digest_is_conflict` | Step 13 | 返回 `IdempotencyConflict` 或等价 stable surface；不覆盖第一次 reservation，不写 accepted sidecar | application |
| `in_flight_reservation_blocks_second_writer` | Step 13 | 第二 writer 得到 delayed/unavailable/held；不穿过 domain，不生成第二 generation/effect | application + fake |
| `operation_namespace_isolated` | Step 13 | 同一 raw key 在不同 Command/Consumer/Job namespace 不互相 duplicate | idempotency fake |
| `stored_result_missing_is_consistency_defect` | Step 11~13 | completed reservation 指向缺失或类型错误 result 时返回 consistency error；不得从 current truth 重建 | repository + application |
| `stored_result_saved_before_complete` | Step 11 | result 保存失败或 idempotency complete 失败时 truth/history/material/outbox/result 不可见 | UoW fake |
| `commit_unknown_requires_same_key_lookup` | Step 12、13 | commit unknown 后先查原 reservation/result；不盲重试、不换 effect/publication/handoff key | service + UoW fake |
| `rollback_failure_surfaces_manual_recovery` | Step 12 | rollback failure 返回 unavailable/diagnostic/manual-recovery marker；不返回 accepted | service + UoW fake |
| `generation_fence_rejects_late_feedback` | Step 10、13 | old generation feedback 只写 late/unknown/gap/history，不覆盖 current association/session/health | consumer |
| `dual_dispatchers_have_single_winner` | Step 13 | 同 attempt 同 revision 只有一个 worker 可推进；另一方 reload/skip，不重复 carrier call | job + repository fake |
| `outbox_publishers_are_version_guarded` | Step 11、13 | 双 publisher 只有一个提交 submission marker；version conflict 不等于 delivery failure，必须 reload/reconcile | worker + repository fake |
| `projection_old_cursor_cannot_overwrite_new_state` | Step 11、13 | older source cursor no-op；newer fresh/degraded state 不被旧 rebuild 覆盖；失败不清 source | projection fake |
| `handoff_layers_do_not_infer_each_other` | Step 10、13 | submitted/delivered/observed/accepted 各自独立；unknown/gap 只重试未确认层 | handoff fake |
| `query_has_no_write_side_effects` | Step 9、16 | Query 不 reserve、不 begin write UoW、不调用 resolver、refresh、rebuild、audit、outbox 或 repair | query service |
| `job_does_not_create_authorization` | Step 9、10 | maintenance Job 只能推进已提交 work，不创建 intent/decision/recovery/new generation | job runner |
| `material_payload_is_immutable` | Step 6、11 | outbox 使用 stored material snapshot；current truth 后续变化不改已排队 payload；payload 缺失不回查组包 | repository + worker |
| `cursor_types_remain_separate` | Step 6、10、11 | `HostChangeCursor`、`CommittedChangeCursor`、page cursor、broker offset、revision、generation 不可互换；exact type 未闭合时保持 compile seam pending | contract / architecture check |

## 13. 错误、配置与可观测性测试切口

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `invalid_metadata_rejected_before_uow` | Step 8、12 | actor、scope、correlation、idempotency、schema/version 缺失或非法时不开始 mutation UoW、不调用 domain/adapter | API/worker handler |
| `domain_reject_has_no_accepted_side_effect` | Step 10、12 | 非法状态、policy reject、scope/generation mismatch 不写 accepted history/material/outbox/projection/stored success | domain + application |
| `unsupported_consumer_version_is_body_free` | Step 8、12 | unsupported version 不解析 payload、不保存 snapshot、不 mark stale；只返回 safe receipt/disposition | worker |
| `source_unavailable_maps_by_entry_kind` | Step 12、14 | Command -> blocked/unavailable；Consumer -> delayed/held；Job -> partial/failed；不把 timeout 当 positive | service + fake adapter |
| `body_and_digest_mismatch_are_rejected` | Step 6、8、12、15 | external/raw body、credential、manifest、Runtime outcome、Sandbox response 或 digest mismatch 不进入 local truth、log、metric、report | contract + redaction |
| `publisher_retryable_and_terminal_failure` | Step 12、13 | retryable -> failed/unknown marker；exhausted/permanent -> Gap/dead-letter surface；truth unchanged；terminal record 不重复 publish | worker + fake |
| `projection_rebuild_failure_preserves_source` | Step 11、12 | rebuild failed/degraded/unavailable 只影响 projection surface，不修改 Host Truth，不把 Query 变 repair | job |
| `config_validation_fail_fast` | Step 14 | store/publisher/handoff/topic/adapter binding invalid 时返回 redacted config error；不启动半配置 runtime | config test |
| `forbidden_boundaries_are_not_configurable` | Step 14 | config 不能关闭 project-member subject、idempotency、visibility、audit/outbox、Query no-write、Job no-authorization、redaction 或 fail-closed | config test |
| `sibling_runtime_dependencies_are_seams` | Step 3、5、14 | 除已确认 `core-contracts` compile seam 外，Runtime/Member/Images/Sandbox/Bus/SDK 不能变成源码依赖；运行期仅 port/adapter/event/ref/fake | architecture check |
| `logs_use_safe_structured_fields` | Step 15 | log 只有 typed ref、kind、disposition、diagnostic ref、duration；无 raw request/event/adapter body、secret、stack trace、SQL、broker body | observability check |
| `metrics_are_low_cardinality` | Step 15 | label 不含 host/member/actor/request/idempotency/effect/publication ref、URL、free text、error body 或 trace id | observability check |
| `audit_and_trace_are_refs_only` | Step 15 | accepted audit 指向已提交 local record；trace/correlation 继承但不生成业务 key；history/material/handoff/report 不含正文 | observability check |
| `redaction_scan_blocks_forbidden_content` | Step 15 | 发现 raw credential、token、external response、image manifest/digest body、Runtime/Sandbox body、tool/LLM content 时 gate 失败 | script check |

## 14. Planned scripts 契约

以下只定义未来实现仓脚本的接口，不创建脚本、不运行命令、不生成 artifact/report/evidence。

| 脚本 | 类型 | 参数 | 输入 | 输出 | 失败语义 |
|---|---|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | gate | `--run-id` / `--artifact-root` / `--config-profile` | 源码、配置 profile、unit/service/contract fake suites | `artifacts/test/<run_id>/` 下的真实 suite artifacts | 任一 required suite 失败返回非 0；保留 failure summary，不伪造通过 |
| `scripts/reports/generate_reports.sh` | report | `--run-id` / `--artifact-root` / `--report-root` | 已存在的 suite artifacts | `reports/runs/<run_id>/` 下的报告 | artifact 缺失、输入不一致或生成失败返回非 0；不自行制造测试结论 |
| `scripts/checks/check_redaction.sh` | check | `--artifact-root` / `--report-root` | artifacts、reports、日志/metric/audit fixture | `reports/runs/<run_id>/redaction-check.md` | 发现 raw body、secret、credential、URL、stack trace、forbidden external content 返回非 0 |

脚本规则：

- 参数名、artifact root 和 report root 必须服从 `standards/document/实施计划书写规范.md` 与实现仓目录规范。
- 脚本必须从真实 suite artifact 或显式输入生成报告，不得读取静态 JSON 伪造 evidence、verdict、signoff 或 readiness。
- `check_redaction.sh` 只检查泄露和禁入字段，不替代功能测试、验收或运维告警。
- 真实 durable store、broker、DLQ、observability backend 和 sibling integration 的命令由后续 `05/07` 在依赖确认后补充；当前不写产品名或数值。

## 15. 前序闭环审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 七个实现模块都有测试入口 | pass | §6 覆盖 `contracts/domain/application/infra/api/worker/jobs` |
| 10 个 Command 都有正向和异常切口 | pass | §7 逐项覆盖 8 public + 2 internal；placeholder 保持 blocked/waiting ceiling |
| 6 个 Query 都有 hit/missing/not-visible/degraded/no-write 切口 | pass | §8 逐项覆盖，并明确 Query 不写入 |
| 5 个 Consumer 都有 accepted/duplicate/unsupported/late/gap/rejected 切口 | pass | §9 逐项覆盖 safe write ceiling |
| material append helper 有 immutability/rollback 切口 | pass | §10.1 覆盖 committed change、snapshot、append failure |
| 7 个 Job 都有 completed/duplicate/invalid/partial/no-truth-repair 切口 | pass | §10.2 逐项覆盖 |
| 状态机合法/非法转换都有入口 | pass | §11 覆盖所有 Step 10 状态轴及跨轴禁止推导 |
| 一致性/幂等/并发/commit unknown 有入口 | pass | §12 覆盖 UoW、stored result、outbox、projection、handoff、generation 和 Query no-write |
| 错误/配置/观测有入口 | pass | §13 覆盖 stable disposition、fail-fast、redaction、低基数和 refs-only |
| 不越界替代 `05/06/07` | pass | 未写 TC 编号、覆盖率、fixture 全集、验收 evidence、phase、commit 或执行结果 |
| 上游 blocker 未被伪造成 ready | pass_with_upstream_blockers | `MSVC-UP-001~008`、cursor exact type、Core/Bus route/envelope/receipt、产品与后端均保持 pending/blocked |

## 16. 回填草稿

> 校准来源：
> - `design-calibration/03_ddd_step_16_test_cut.md`
>
> 延伸阅读：
> - 先阅读本文件 §6~§13 的测试切口，再阅读 `03_ddd_step_09_function_flows.md`、`03_ddd_step_10_state_machine.md` 和 `03_ddd_step_11_persistence_tx_consistency.md`，以确认测试应断言的顺序、状态和写集。

正式 `03-详细设计.md` §15 只装配：

1. 七模块测试主轴和切口索引。
2. 10 Command、6 Query、5 Consumer、1 material append helper、7 Job 的实际 inventory 与最小正反向测试入口。
3. 状态机合法/非法迁移、UoW/一致性/幂等/并发/commit unknown 的交叉切口。
4. 错误、配置、观测、redaction 和 planned script contract 的摘要。

正式正文不得复制本文件全部测试表，也不得把 planned script、fake parity 或切口存在写成测试已通过、artifact、report、evidence、verdict、signoff 或 readiness。

## 17. Gate 与下一步

| 条件 | 状态 | 说明 |
|---|---|---|
| 模块测试切口明确 | pass | 七模块均有可反查的最小入口 |
| 协议测试切口明确 | pass | 实际分母为 10 Command、6 Query、5 Consumer、1 helper、7 Job |
| 状态机合法/非法测试明确 | pass | 每个正式状态轴均有迁移与 terminal guard 切口 |
| 一致性、错误、幂等、并发测试明确 | pass | 包含 rollback、duplicate、stored result、outbox、projection、handoff、unknown |
| 配置与观测测试明确 | pass | config fail-fast、availability、redaction、metric labels、audit refs-only |
| 可进入 Step 17 | pass | Step 17 收口实施承接清单、前置阅读和跨文档预复核 |

```text
step_16_status = completed
step_16_gate = pass_with_upstream_blockers
next_allowed_step = Step 17 implementation_handoff
formal_03_write_allowed = false_until_step_19
```
