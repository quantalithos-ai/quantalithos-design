# Step 16. 测试切口与最小验证清单

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 16
> 书写规范: `standards/document/详细设计书写规范.md` §5.15
> 粒度参考: `projects/L1-governance/design-calibration/03_ddd_step_16_test_cuts.md`；仅借鉴其按模块、协议族、状态与一致性分批的形式，不继承 Governance 的 truth、outbox、事件或测试结论。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 16 测试切口与最小验证清单 |
| 当前状态 | `completed / pass_with_upstream_and_design_blockers / stop_review` |
| 输入基线 | 正式 `00/01/02`、Step 1~15；其中 Step 15 已完成并停审 |
| 输出文件 | `projects/L2-member/design-calibration/03_ddd_step_16_test_cuts.md` |
| 写入范围 | module / protocol / state / transaction / error / config / observability 的**计划测试切口** |
| 明确非范围 | 完整测试方案、TC 编号、优先级、覆盖率、fixture、真实 sibling 联调、CI、测试命令、run_id、artifact、report、evidence、verdict、signoff 或 readiness |
| 停审方式 | 模块、协议、状态、一致性、错误/配置/观测、跨 Step 审计和回填草稿已完成后停止；未执行测试 |

## 2. 本步目标与边界

本 Step 为未来实现者及 `05-测试方案.md` 提供可回指的最小验证入口。它验证的是本仓已声明的 member-local 契约：对象不变量、有限协议、状态转移、事务顺序、typed replay、fail-closed seam、配置绑定和安全观测边界；不是对 host、Runtime、Bus、Tools、身份、治理、会话、镜像、容器、外部 adapter 或 observability backend 的真实验收。

每个切口均是 `planned`，并且只描述将来测试必须断言的属性。不得将测试切口名称、fake、内存 Store 或计划性断言解释为已有实现、已运行测试、集成成功或上游 blocker 已关闭。

| 主题 | 本 Step 必须给出的最小入口 | 本 Step 不得越过的边界 |
|---|---|---|
| 七个模块 | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 的 unit/service/fake 入口 | 不选择测试框架、repo、crate、CI 或物理基础设施 |
| 写协议 | 10 Command、14 Consumer、5 Job 的 fresh / non-positive / duplicate / conflict 或 partial 检查 | 不发送 IPC、HTTP、UDS、Bus message，不断言外部 ack / delivery |
| 读协议 | 16 Query 的 visible / unavailable 或 stale surface 与 no-write | 不由 Query 刷新、rebuild、reconcile、reserve 或写审计 |
| 语义候选 | 24 个 candidate 的 blocked-boundary 断言 | 不创建 event schema、publisher、outbox、route、topic、delivery 测试 |
| 状态与一致性 | 28 个状态主语、UoW、CAS、duplicate replay、commit-unknown、partial Job | 不把 fake 的行为升级为生产 Store 或外部 truth |
| 配置与观测 | raw-config 隔离、slot availability、redaction、低基数 metric、local audit ref | 不定义告警、SLO、backend、retention、运维报告 |

## 3. 本步输入

| 输入 | 状态 | 本 Step 的使用方式 |
|---|---|---|
| `03_ddd_step_05_module_contracts.md` | completed | 固定七模块及 CP01~CP07 的测试归属 |
| `03_ddd_step_06_object_contracts.md` | completed | 固定对象 factory、字段、不变量、状态 helper、local trace / result / report carrier |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | completed | 固定 Store、read Port、UoW、version、idempotency、resolver、handoff、fake parity 的可替换边界 |
| `03_ddd_step_08_protocol_contracts.md` | completed | 固定 10 / 16 / 14 / 24 / 5 协议分母与 typed result / receipt / report replay |
| `03_ddd_step_09_function_flows.md` | completed | 固定 fresh、duplicate、Query no-write、blocked、unknown、partial Job 的调用及写入顺序 |
| `03_ddd_step_10_state_matrix.md` | completed | 固定 28 个正式状态主语、合法/非法边和 reserved design gap |
| `03_ddd_step_11_persistence_transaction_consistency.md` | completed | 固定 local owner、append-only、UoW、Store version、stored carrier 和 external-side-effect fence |
| `03_ddd_step_12_error_recovery.md` | completed | 固定错误映射、rollback、commit unknown、unsupported / unavailable 的保守恢复 |
| `03_ddd_step_13_concurrency_idempotency.md` | completed | 固定 canonical digest、reservation、CAS、replay、re-entry 与 item partial 纪律 |
| `03_ddd_step_14_configuration_external_bindings.md` | completed | 固定 raw config 隔离、validated ref、builder slot 和 dependency 分类 |
| `03_ddd_step_15_observability_audit.md` | completed / stop_review | 固定 log / metric / local audit / span / redaction 的检查边界 |
| `L1-governance` Step 16 | reference only | 参考测试切口层次；不继承其 command、event、outbox、script 或测试结果 |

## 4. 分批写入计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 16.1 | 基线、SOP 回答、诊断、取舍、总图 | completed |
| 16.2 | 七模块与 10 Command 测试切口 | completed |
| 16.3 | 16 Query、14 Consumer、24 blocked candidate、5 Job 测试切口 | completed |
| 16.4 | 28 个状态机及事务 / 一致性 / 幂等 / 并发切口 | completed |
| 16.5 | 错误、配置、adapter、观测、redaction、审计、跨 Step 审计与回填草稿 | completed / stop_review |

## 5. SOP 问题回答

| SOP 问题 | 本项目回答 |
|---|---|
| 每个模块至少需要哪些单元测试？ | `contracts` 测有限 DTO、metadata、selector、canonical projection；`domain` 测 factory、不变量、状态 helper；`application` 测 named service 编排、UoW、result/replay；`infra` 测 version / UoW / builder / config / adapter fake；`api` 测 Command/Query boundary；`worker` 测 Consumer entry、receipt、body gate；`jobs` 测 logical continuation、item partial、report replay。 |
| 每个接口至少需要哪些正向和异常测试？ | 每个 Command 至少有 accepted/合法 non-positive 或 blocker、invalid / conflict、duplicate replay；每个 Query 至少有可服务或空面、不可见/不就绪/不可用或 stale、no-write；每个 Consumer 至少有 accepted（若其 source 前提可证明）或保守 disposition、duplicate、schema/body/source 异常；每个 Job 至少有合法 item continuation、invalid/blocked/partial、duplicate report replay。 |
| 状态机合法转换和非法转换如何测试？ | 只以 Step 10 的正式 enum 与矩阵为源。每个状态主语至少覆盖一个已定义合法边、一个前置条件拒绝或非法边；reserved helper 不伪造正向测试，必须断言 `ContractViolation` / blocker。 |
| 事务、一致性、幂等和并发如何验证？ | 以 planned fake / in-memory `Store`、`UoW`、resolver、handoff 和 adapter slot 注入 version conflict、unique conflict、unavailable、missing typed carrier、commit unknown、same-key concurrency 与 item-level partial；断言 local truth / successor / carrier 的顺序和 no-write / rollback fence。 |
| 哪些测试细节留给测试方案？ | TC 编号、优先级、覆盖率、fixture、property / fuzz 策略、真实 durable Store / Bus / sibling 合同测试、并发调度、CI 分层、脚本、报告、evidence 和验收映射均留给 `05/06/07`。 |

## 6. 当前材料诊断

| 位置 | 已有结论 / 缺口 | 本 Step 的处理 |
|---|---|---|
| Step 5~7 | 七模块和 Port 已闭合，但测试入口分散 | 按模块固定最小切口和 fake / adapter 边界 |
| Step 8 | 10/16/14/24/5 已列举，却未形成统一的正反向覆盖表 | 为每个命名协议给出 planned test cut；24 candidate 只验证 blocked boundary |
| Step 9 | flow 有局部测试提示，且部分 flow 暴露 design gap | 汇总为 transaction、replay、no-write、partial 和 gap refusal 切口；不以测试掩盖缺口 |
| Step 10 | 28 个状态主语的状态图已停审 | 逐机给出 legal / illegal 或 reserved-edge refusal 入口 |
| Step 11~13 | consistency / recovery / concurrency 规则多且容易被 fake 简化 | 对 ordering、missing carrier、CAS、commit unknown、external unknown 加独立断言 |
| Step 14~15 | 配置与观测已有边界但尚未给出验证入口 | 检查 config 不可绕过、adapter unavailable 无 fallback、日志/指标/audit 不泄漏 body |
| 上游 seam | `L2M-UP-001~008` 与 `L2M-UP-005` 仍未关闭 | 所有涉及它们的正向 physical activation 测试标为 blocked；不得造 stub route / fake acceptance |

## 7. 设计取舍

| 议题 | 采用的口径 | 原因 |
|---|---|---|
| 测试粒度 | 模块总表 + 每个命名协议 + 状态/一致性总表 | 同时保持实施可回指与不替代测试方案 |
| 正向断言 | 只断言 member-local committed result、safe read surface 或 local successor | 防止将本地 `Accepted` / `Ready` 误写为 host / Runtime / downstream 成功 |
| blocked candidate | 对 24 项逐项测试“不得物化” | `L2M-UP-005` 前不存在可发出的 event 契约 |
| fake 使用 | fake 仅用于验证 Port parity 与失败分支 | fake 不是 package dependency，也不是 upstream contract 或 readiness evidence |
| 观测验证 | 检查字段安全与状态语义 | 不引入 backend、告警、SLO 或 audit ledger |
| scripts | 本步不声明测试 gate / report / evidence 脚本 | 当前项目未定义脚本交付物；其需求须由未来 `05/06/07` 明确后再设计 |

## 8. 测试切口总图

```text
Step 5~7: module / object / Port contracts
        -> contracts, domain, application, infra, api, worker, jobs test cuts
Step 8~9: finite protocol schemas and flows
        -> 10 Command + 16 Query + 14 Consumer + 5 Job test cuts
L2M-UP-005: 24 semantic candidates
        -> blocked-boundary / non-materialization test cuts only
Step 10: 28 formal state subjects
        -> legal edge + illegal / reserved-edge test cuts
Step 11~13: local transaction and replay rules
        -> ordering / rollback / duplicate / CAS / commit-unknown / partial tests
Step 14~15: binding and observation rules
        -> config / adapter availability / redaction / low-cardinality / audit-ref tests
```

关键说明：

- 每个 planned cut 必须能反查至少一个 Step 5~15 的具体契约；没有“泛化 success test”。
- Query 与 `MemberProjectionUpdateConsumer` / Job 的测试面必须隔离：Query 永远不写，Consumer / Job 也只能按各自 owner 写既有 local relation。
- 任何具有 `Blocked`、`Waiting` 或 `Unknown` 结果的测试，断言的是 fail-closed local disposition；不得把它转换成 retry、delivery、accepted、observed、evidence 或 readiness 结论。

## 9. 七模块测试切口汇总表

所有条目均为 `planned`。`contract unit`、`domain unit`、`service test`、`fake parity test` 等仅指建议层级，不选择测试框架或执行命令。

| 测试切口 | 对应契约 | 必须验证的内容 | 建议测试类型 |
|---|---|---|---|
| `contracts_finite_protocol_schema` | Step 8 `Member*Name`、request/response、selector、page、issue | 10/16/14/5 的有限枚举、required field、channel/result-kind pairing、public DTO 不泄漏 UoW/Store/adapter error | contract unit |
| `contracts_metadata_and_subject_anchor` | `MemberSubjectAnchor`、Command/Query/Consumer/Job metadata | 写协议有双锚、trace 与适用 key；Query 不携带 idempotency key；name 与 typed body 静态匹配 | contract unit |
| `contracts_canonical_digest_profile` | Step 8 §11、Step 13 | include / exclude 字段稳定；body / secret / time / run-id / route 不进入 digest；缺字段 fail closed | contract unit |
| `contracts_typed_carrier_roundtrip` | `MemberCommandAccepted` / rejection、receipt、report、visibility surface | 完整 typed carrier 的 kind、operation、subject relation 保持；错误或 safe reason 不携带原 body | contract unit |
| `domain_factory_and_invariant` | Step 6 CP01~CP07 objects | 每个 factory 的必填 ref、ordered-unique collection、双锚、body-free 不变量和 immutable successor 规则 | domain unit |
| `domain_policy_and_owner_boundary` | screening、mirror、visibility、projection、attempt/gap policy | policy accept/reject；不得用 local policy 创造 Runtime/host/governance/tools 外部 truth | domain unit |
| `domain_state_transition_contract` | Step 10 28 state subjects | 已定义 helper 的合法边、非法边和无 helper 的 reserved edge 均映射至正式错误 | domain unit |
| `application_non_query_orchestration` | Step 9 fresh path | `validate -> begin -> digest -> reserve -> local fact/successor -> typed carrier -> complete -> commit`；每一失败点不跳序 | service test + fake UoW |
| `application_query_no_write` | Step 8 / 9 Query rule | 16 Query 都不 reserve、不开始 write UoW、不写 audit / result / projection、不调用 resolver / handoff | query service |
| `application_typed_replay_and_error_mapping` | Step 11~13 stored result、Step 12 errors | exact result/receipt/report replay、missing/wrong carrier fail closed、domain/Port/blocked error 到安全 public surface | service test |
| `infra_store_uow_version_parity` | Step 7 / 11 Store、UoW、`Versioned<T>` | get/save expected version、append-only、unique conflict、rollback、carrier-before-complete、no domain successor `store_version()` | repository fake |
| `infra_config_builder_availability` | Step 14、Step 10 technical states | raw config 只在 infra；validated binding order、required slot gate、disabled/degraded/unavailable 无 fallback、`Ready` 仅 local facade | config / builder test |
| `infra_adapter_failure_injection` | resolver / host / Runtime / publication / observation technical Port | unavailable、waiting、unknown、body rejection、mismatch 被映射为 local conservative state；fake 不产生 foreign success | adapter fake parity |
| `api_command_query_boundary` | Step 8 API surface、Step 10 `MemberApiHandlerDisposition` | invalid input 在 application 前拒绝；Command/Query result variant 不可互换；Query body 不泄露 | handler test |
| `worker_consumer_entry_and_receipt` | Step 8 Consumer envelope、Step 10 worker entry/result | source family、schema、dedup、inspection gate；accepted/blocked/rejected receipt；duplicate 不再次进入 application | worker test |
| `jobs_continuation_and_report` | Step 8 Job input/report、Step 9 Job flow | logical input、per-item UoW、partial report、exact duplicate report replay；不得修复 CP01~06 truth | job runner test |
| `observability_redaction_local_audit` | Step 15 | log/metric/span/local audit 只有安全 refs、有限 label、committed fact/successor/carrier relation；没有 raw body/credential/stack trace | observability check |

## 10. Command 接口测试切口表（10）

每行同时包含 local positive path 与异常 / blocker path；其中“accepted”仅为 member-local UoW 已提交，不声称外部 owner 已接受。

| 测试切口 | 对应契约 | 必须验证的内容 | 建议测试类型 |
|---|---|---|---|
| `admit_member_startup_command` | `AdmitMemberStartupFlow` / `StartupAdmissionDisposition` | 合法双锚和已验证 startup material 仅形成 local admission carrier；缺失 host registration / credential / runtime identity 时 `Blocked(L2M-UP-001/006)`，不伪造 admission 或 host acceptance；duplicate exact replay | API + application |
| `establish_member_presence_command` | `EstablishMemberPresenceFlow` / `MemberPresenceStatus` | 合法 admission gate 后 append `Starting` local presence；admission 缺失、双锚不匹配、active uniqueness 冲突或 duplicate 不重建 presence | API + application + Store fake |
| `transition_member_presence_command` | `TransitionMemberPresenceFlow` / `MemberPresenceStatus` | 每条 Step 10 已定义合法 successor 使用 loaded version；非法/terminal transition 与 version conflict 不写 successor；same key replay stored result | API + domain + Store fake |
| `prepare_host_collaboration_command` | `PrepareHostCollaborationFlow` / `HostCollaborationAttemptStatus` | 可证明 local material/attempt 仅记录 `Prepared` 或保守 attempt；host IPC / lifecycle / route 未闭合时保持 `Blocked(L2M-UP-001)`；不得断言 host accepted/session established | API + adapter fake |
| `establish_subscription_scope_command` | `EstablishSubscriptionScopeFlow` / `SubscriptionScopeStatus` | 合法 scope basis 形成 local scope decision；缺 policy/source proof 或扩大范围被 reject/blocked；duplicate 不重读 owner body或扩权 | API + domain + resolver fake |
| `replace_subscription_scope_command` | `ReplaceSubscriptionScopeFlow` / `SubscriptionScopeStatus` | 当前 scope 与 version 合法时 old successor `Superseded` 和新 decision 同 UoW；stale version、narrowing/owner guard 失败不覆盖较新 scope | API + service + Store fake |
| `submit_screened_fact_to_runtime_command` | `SubmitScreenedFactToRuntimeFlow` / Runtime decision & attempt | `Passed`/permitted `Degraded` screening 才能形成 local delivery decision；entry mapping 缺失为 `Blocked(L2M-UP-003)`；`Unknown` fence 不盲重投，不断言 Runtime loop/run/plan/outcome | API + application + Runtime adapter fake |
| `link_runtime_admission_result_command` | `LinkRuntimeAdmissionResultFlow` / `RuntimeResultLink` | 有正式 correlation/result ref 时只 append member-local link；feedback/source 不足为 `Waiting`/`Blocked(L2M-UP-004)`，late/wrong relation 不写 positive link；duplicate 不复读 Runtime | API + service + resolver fake |
| `resolve_external_context_command` | `ResolveExternalContextFlow` / `ExternalContextResolutionStatus` | owner-specific, body-free, purpose/scope matching proof 可 append snapshot + neutral resolution；wrong owner/scope, stale/missing evidence 或 resolver unavailable 保守返回，不生成 authorization/health/capability truth | API + mirror service + resolver fake |
| `request_external_context_refresh_command` | `RequestExternalContextRefreshFlow` / `ExternalContextGapStatus` | 仅登记已定义 refresh relation；无 query-trigger、无 generic resolver。因 `L2M-DDD-006` 的 factory/status 不闭合，当前必须测试其拒绝/blocked fence，而非伪造 `ResolutionPending` 正向创建；duplicate 不创建第二 gap | API + service + domain refusal |

### 10.1 Command 共用不变量切口

| 测试切口 | 对应契约 | 必须验证的内容 | 建议测试类型 |
|---|---|---|---|
| `command_invalid_context_pre_gate` | Step 8 metadata / subject validation | 缺 actor、双锚、name/body 配对、idempotency key、trace 或 required selector 时，不 begin UoW、不 reserve、不调用 domain / adapter | handler test |
| `command_duplicate_same_relation_replays_exact_carrier` | Step 11~13 replay | same `(channel, operation, key, digest, result_kind, result_ref)` 只读回完整 typed carrier；无新 fact/successor/trace/audit/attempt/resolver call | application + fake UoW |
| `command_same_key_different_relation_conflicts` | Step 13 canonical digest | channel/operation/digest/result kind 任一不匹配时，在 domain 前返回 `Conflict`；不得覆盖 reservation 或泄露旧结果 | application + idempotency fake |
| `command_non_positive_result_is_replayable` | Step 8 rejection / Step 12 recovery | 已提交 `Rejected`/`Blocked`/`Waiting`/`Unknown` typed carrier 仍只允许 exact replay；不借新尝试升级外部状态 | application |

## 11. Query 接口测试切口表（16）

每个 Query 必须同时验证一个可允许读取的 local surface 和一个不可服务 / 不可见 / stale / empty 分支，并重复断言 no-write。这里的“可服务”不证明任何 foreign truth current、healthy、authorized 或 executable。

| 测试切口 | 对应契约 | 必须验证的内容 | 建议测试类型 |
|---|---|---|---|
| `get_member_presence_query` | `GetMemberPresenceFlow` | 读取匹配双锚的 presence surface；不存在/不可见/consistency 不足映射安全 surface；不改变 presence、reservation、audit | query service |
| `get_host_collaboration_posture_query` | `GetHostCollaborationPostureFlow` | 以 selector/page 读取 local attempt posture；blocked/unknown attempt 不被渲染为 host session/health；不调用 host adapter | query service |
| `get_current_subscription_scope_query` | `GetCurrentSubscriptionScopeFlow` | 当前 local scope 和 Superseded/history 的选择符合 selector；无 visibility basis/无 scope 显式返回不服务面；不读取 policy body | query service |
| `get_screening_disposition_query` | `GetScreeningDispositionFlow` | 读取 matching inbound fact 的 screening classification；缺失/blocked/unknown 不推导 Runtime eligibility；不重跑 inspection | query service |
| `get_runtime_mediation_posture_query` | `GetRuntimeMediationPostureFlow` | 读取 local decision/attempt posture；`Submitted`/`Unknown` 不变成 Runtime accepted/run result；不访问 Runtime loop | query service |
| `get_runtime_material_reception_query` | `GetRuntimeMaterialReceptionFlow` | 已保存 safe reception 可读；未接收、rejected、blocked、unknown 显示精确 safe posture；不读取 Runtime context/plan/outcome body | query service |
| `get_outbound_decision_query` | `GetOutboundDecisionFlow` | 读取 local `OutboundDecision`；eligible/material 不表示 publication prepared/delivered；resolution 不足不触发 resolver | query service |
| `get_publication_posture_query` | `GetPublicationPostureFlow` | 分页读取 local attempt/gap；`Submitted`/gap 不等于 delivery ack；cursor/page invalid 只返回 read error，不写 repair | query service |
| `get_interaction_trace_query` | `GetInteractionTraceFlow` | 读取 append-only trace page 和允许的 redacted refs；missing predecessor/gap 保留 incomplete surface；不追加 trace/audit | query service |
| `list_interaction_gaps_query` | `ListInteractionGapsFlow` | 只列 local `InteractionGap` page；无结果是 `Empty`，不是修复触发器；不调用 observation adapter | query service |
| `get_observation_posture_query` | `GetObservationPostureFlow` | 读取 local observation attempts/gaps；不把 `Submitted`/`Unknown` 误称 observed/evidence；不发 observation material | query service |
| `get_external_context_resolution_query` | `GetExternalContextResolutionFlow` | 读取 body-free neutral resolution；`Resolved` 不升级为 identity/policy/runtime/tool/host truth；stale/unavailable 不启动 refresh | query service |
| `list_external_context_gaps_query` | `ListExternalContextGapsFlow` | 分页读取 gap local successor；`ResolutionPending`/`Unknown` 原样可见或不服务；不调用 resolver / Command | query service |
| `get_member_summary_query` | `GetMemberSummaryFlow` | 只从 CP07 projection 读取 summary；freshness 不满足时按 hint 返回 stale/not-ready/degraded，不 rebuild source truth | query service |
| `get_capability_outlet_query` | `GetCapabilityOutletFlow` | 返回 non-authorizing, body-free outlet surface；available/current 不调用 Tools/Method/provider，不生成 registry/capability grant | query service |
| `get_member_diagnostics_query` | `GetMemberDiagnosticsFlow` | 只返回低敏 safe diagnostic / local status；拒绝 raw body、credential、stack trace 和跨 owner body；不写 diagnostic/audit | query service |

### 11.1 Query 共用 no-write 切口

| 测试切口 | 对应契约 | 必须验证的内容 | 建议测试类型 |
|---|---|---|---|
| `all_queries_never_reserve_or_complete` | Step 8 / 9 Query rule | 对 16 个 `MemberQueryName` 枚举逐项注入 write-port spy；无 `begin_write`、reserve、stored-result、complete | parameterized query test |
| `all_queries_never_repair_or_handoff` | Step 9 / 11 / 14 | 对 16 项逐项断言无 projection rebuild、gap reconciliation、mirror refresh、resolver、host/Runtime/publication/observation handoff | parameterized query + adapter spy |
| `query_visibility_and_redaction_boundary` | `MemberVisibilitySurface`、Step 15 | `NotVisible` 无 body；stale/degraded 不伪装 current；所有 returned refs 受 visibility/redaction profile 约束 | query service |

## 12. Consumer 测试切口表（14）

每个 Consumer 都必须覆盖合法 source 的 local receipt / successor、duplicate receipt replay、source/schema/body/contract 异常。external Consumer 不断言 transport ack；committed-fact Consumer 不把 24 个 candidate 当作 source。

| 测试切口 | 对应契约 | 必须验证的内容 | 建议测试类型 |
|---|---|---|---|
| `host_feedback_consumer` | `HostFeedbackConsumerFlow` | matching local host attempt 可 append feedback link/late classification；unknown/wrong attempt、duplicate 不改 presence、不声称 host lifecycle/session | worker + Store fake |
| `inbound_fact_consumer` | `InboundFactConsumerFlow` | verified body-free descriptor 可 append inbound fact + screening；body gate/schema/source/scope failure 不保存 raw body、不进入 Runtime；duplicate receipt exact replay | worker + application |
| `runtime_material_consumer` | `RuntimeMaterialConsumerFlow` | formal safe material/correlation 可 append local reception；source proof 缺失或 unsupported contract 返回 non-positive receipt，不复制 Runtime context/plan/outcome/tool body | worker + Runtime fake |
| `delivery_feedback_consumer` | `DeliveryFeedbackConsumerFlow` | matching attempt 可 append feedback link/gap successor；late/unknown/mismatch 不声称 delivered/downstream accepted，duplicate 不重复 link | worker + Store fake |
| `observation_feedback_consumer` | `ObservationFeedbackConsumerFlow` | matching observation attempt 可 append feedback/gap successor；late/unknown/mismatch 不声称 observed/evidence；body is not retained | worker + Store fake |
| `subject_identity_context_update_consumer` | `SubjectIdentityContextUpdateConsumerFlow` | body-free source evidence 可 append neutral resolution/gap；owner/subject mismatch 不创建 third execution subject 或 Identity truth | worker + mirror fake |
| `policy_context_update_consumer` | `PolicyContextUpdateConsumerFlow` | matching policy source can create neutral resolution/gap; missing/stale source stays conservative; no governance rule/approval body persisted | worker + mirror fake |
| `runtime_boundary_context_update_consumer` | `RuntimeBoundaryContextUpdateConsumerFlow` | formal boundary/entry mapping can append neutral resolution; schema/source mismatch does not invent Runtime contract/run state | worker + mirror fake |
| `capability_context_update_consumer` | `CapabilityContextUpdateConsumerFlow` | safe tool/binding/method refs can update neutral mirror relation; no capability registry/provider route/invocation grant | worker + mirror fake |
| `host_route_context_update_consumer` | `HostRouteContextUpdateConsumerFlow` | safe host-boundary/route ref can append resolution/gap; no host health, IPC bind, Bus route or delivery truth | worker + mirror fake |
| `runtime_material_reception_consumer` | `RuntimeMaterialReceptionConsumerFlow` | only accepted committed CP03 reception can derive CP04 local decision/material relation; non-accepted/missing reception never prepares outbound success; duplicate receipt replay | worker + application |
| `member_committed_fact_consumer` | `MemberCommittedFactConsumerFlow` | formal committed local fact and valid predecessors append trace/gap; arbitrary Store scan/event candidate/raw body is rejected; no source fact write-back | worker + trace Store fake |
| `member_projection_update_consumer` | `MemberProjectionUpdateConsumerFlow` | committed fact/watermark marks CP07 state stale using versioned successor; it does not rebuild view or mutate CP01~06 truth; wrong version yields conservative error | worker + projection fake |
| `capability_outlet_source_update_consumer` | `CapabilityOutletSourceUpdateConsumerFlow` | committed CP06 resolution/gap updates outlet posture only; Tools/Method raw event or capability invocation input rejected; duplicate leaves one successor | worker + projection fake |

### 12.1 Consumer 共用边界切口

| 测试切口 | 对应契约 | 必须验证的内容 | 建议测试类型 |
|---|---|---|---|
| `consumer_pre_dispatch_refusal` | Step 8 envelope、Step 10 `MemberConsumerEntryState` | 14 个 Consumer 的 wrong source family、missing dual anchor/dedup/trace、unregistered name 在 application 前 `Rejected`/`Blocked`；不 reserve、不写 receipt | parameterized worker test |
| `consumer_unsupported_schema_no_parse` | Step 8 / 12 | unsupported schema 不解析/raw-body inspection 不升级、不保存 snapshot/trace/stale marker、不声称 ack/quarantine delivery result | worker boundary test |
| `consumer_duplicate_exact_receipt_replay` | Step 11~13 | same canonical source/dedup/digest/result kind 只读 `MemberConsumerReceipt`；不重写 fact/snapshot/feedback/trace/projection | worker + idempotency fake |
| `consumer_wrong_digest_or_missing_receipt_fails_closed` | Step 12 / 13 | mismatch -> conflict；completed relation missing/wrong receipt -> `StoredResultUnavailable` / consistency defect；不得从 current truth重建 | worker + Store fake |

## 13. 24 个 blocked outbound semantic candidate 测试切口

这些不是 event protocol test。每个条目均只能验证：对应 local fact 已在其 own flow 中按既有契约处理时，`L2M-UP-005` 前**不会**物化 member event envelope/payload/source/subject/schema/route/topic/publisher/outbox/delivery。不得为测试便利创造 generic event、fake topic 或假 ack。

| 测试切口 | 仅关联的 local semantic candidate | 必须验证的 blocked boundary | 建议测试类型 |
|---|---|---|---|
| `blocked_member_startup_admission_recorded_candidate` | `MemberStartupAdmissionRecorded` | local admission 不产生 event carrier / publisher / outbox | architecture boundary check |
| `blocked_member_presence_changed_candidate` | `MemberPresenceChanged` | presence successor 不产生 route/topic/delivery | architecture boundary check |
| `blocked_host_collaboration_attempt_recorded_candidate` | `HostCollaborationAttemptRecorded` | local attempt 不被测试为 host notification | architecture boundary check |
| `blocked_member_subscription_scope_changed_candidate` | `MemberSubscriptionScopeChanged` | scope successor 无 Bus event / schema | architecture boundary check |
| `blocked_member_inbound_fact_recorded_candidate` | `MemberInboundFactRecorded` | inbound fact 不转发 body/semantic event | architecture boundary check |
| `blocked_member_screening_decided_candidate` | `MemberScreeningDecided` | screening result 不发布或触发 Runtime | architecture boundary check |
| `blocked_member_runtime_delivery_decided_candidate` | `MemberRuntimeDeliveryDecided` | local Runtime decision 不成为 Runtime delivery event | architecture boundary check |
| `blocked_member_runtime_submission_attempt_recorded_candidate` | `MemberRuntimeSubmissionAttemptRecorded` | attempt 不创建 event/outbox/ack assertion | architecture boundary check |
| `blocked_member_runtime_result_linked_candidate` | `MemberRuntimeResultLinked` | local link 不发布 result or claim Runtime acceptance | architecture boundary check |
| `blocked_member_runtime_material_received_candidate` | `MemberRuntimeMaterialReceived` | reception 不广播 material body | architecture boundary check |
| `blocked_member_outbound_decided_candidate` | `MemberOutboundDecided` | outbound decision 不物化 publication event | architecture boundary check |
| `blocked_member_outbound_material_prepared_candidate` | `MemberOutboundMaterialPrepared` | material remains body-free local relation, no publisher | architecture boundary check |
| `blocked_member_publication_attempt_recorded_candidate` | `MemberPublicationAttemptRecorded` | attempt doesn't yield delivery event | architecture boundary check |
| `blocked_member_publication_gap_changed_candidate` | `MemberPublicationGapChanged` | gap successor doesn't form retry/outbox event | architecture boundary check |
| `blocked_member_interaction_trace_recorded_candidate` | `MemberInteractionTraceRecorded` | trace append doesn't emit observation/span event | architecture boundary check |
| `blocked_member_interaction_gap_changed_candidate` | `MemberInteractionGapChanged` | gap stays local, no external reconciliation event | architecture boundary check |
| `blocked_member_observation_material_prepared_candidate` | `MemberObservationMaterialPrepared` | material doesn't publish/claim observed/evidence | architecture boundary check |
| `blocked_member_observation_attempt_recorded_candidate` | `MemberObservationAttemptRecorded` | attempt doesn't emit observed/delivery result | architecture boundary check |
| `blocked_member_external_context_resolution_changed_candidate` | `MemberExternalContextResolutionChanged` | neutral resolution no external context event | architecture boundary check |
| `blocked_member_external_context_gap_changed_candidate` | `MemberExternalContextGapChanged` | gap doesn't request route/retry automatically | architecture boundary check |
| `blocked_member_summary_projection_changed_candidate` | `MemberSummaryProjectionChanged` | immutable view revision no projection event / body dump | architecture boundary check |
| `blocked_member_capability_outlet_changed_candidate` | `MemberCapabilityOutletChanged` | outlet revision no capability/registry event | architecture boundary check |
| `blocked_member_diagnostic_view_changed_candidate` | `MemberDiagnosticViewChanged` | diagnostic revision no observability/evidence event | architecture boundary check |
| `blocked_member_projection_state_changed_candidate` | `MemberProjectionStateChanged` | state successor no event/outbox/delivery assertion | architecture boundary check |

## 14. Operations Job 测试切口表（5）

| 测试切口 | 对应契约 | 必须验证的内容 | 建议测试类型 |
|---|---|---|---|
| `publication_relay_job` | `PublicationRelayFlow` / `PublicationAttemptStatus` | 只处理已存在 prepared attempt/gap 和 local continuation; successful local successor never means delivered/accepted; unavailable/unknown/partial item stays reportable local state; duplicate replays exact `MemberJobReport` | job runner + handoff fake |
| `observation_relay_job` | `ObservationRelayFlow` / `ObservationAttemptStatus` | 只处理已存在 observation relation；local submission/unknown 不表示 observed/evidence；因 `L2M-DDD-005` 未闭合的 attempt-gap relation 必须测试 refusal/fence，不假造 gap | job runner + handoff fake |
| `external_context_refresh_job` | `ExternalContextRefreshFlow` | only existing resolution/gap/request drives owner-specific resolver; valid body-free snapshot/resolution may append; unavailable/partial preserves last good local record and safe unresolved refs; no authorization/health claim | job runner + resolver fake |
| `member_projection_rebuild_job` | `MemberProjectionRebuildFlow` / `MemberProjectionStatus` | only committed local sources/resolutions, validated watermark, per-kind state can rebuild; partial/failure does not repair CP01~06; `L2M-DDD-007` reserved `Degraded`/`Unknown` paths remain refusal | job runner + projection fake |
| `gap_reconciliation_job` | `GapReconciliationFlow` | only existing projection gap/successor refs update read-side posture; clean/partial result is local report only; no source gap creation/closure, no Query-triggered repair | job runner + projection fake |

### 14.1 Job 共用边界切口

| 测试切口 | 对应契约 | 必须验证的内容 | 建议测试类型 |
|---|---|---|---|
| `job_invalid_input_no_reservation_or_scan` | Step 8 Job metadata / input | missing dual anchor, key, trace, finite ref, scope/page/watermark rejects before item scan, adapter call or result store write | job entry test |
| `job_duplicate_exact_report_replay` | Step 11~13 | same key/digest/kind replays complete stored `MemberJobReport`; no list, scan, resolver, handoff, rebuild or reconciliation rerun | job runner + idempotency fake |
| `job_item_partial_isolated` | Step 9 / 12 / 13 | one item version/conflict/unavailable produces typed unresolved item/report; committed other item successor remains local; no blanket rollback or foreign success | job runner + fake UoW |
| `job_never_repairs_source_truth` | Step 9 / 11 | all five Jobs must not mutate CP01~06 business fact outside their explicit owned continuation relation; report is not a scheduler run/evidence/readiness | job runner boundary test |

## 15. 状态机测试切口表（28）

测试仅以 Step 10 的正式状态名、factory 和 helper 为准。对 immutable disposition 和 entry/result shell，所谓“合法”是一次正确 factory 选择；不得将其当作可原地迁移的 workflow。`reserved` 代表当前详细设计缺少同层 helper，测试必须证明拒绝而非填补实现。

| 测试切口 | 对应状态主语 | 必须验证的合法 / 非法或 reserved 情形 | 建议测试类型 |
|---|---|---|---|
| `startup_admission_disposition_state` | `StartupAdmissionDisposition` | 正确 factory 选择 local admission/rejection/blocked classification；已形成 immutable record 不被原地升级，缺双锚/source proof 不产生 positive admission | domain unit |
| `member_presence_status_state` | `MemberPresenceStatus` | Step 10 已列合法 lifecycle successor 与 expected version；illegal/terminal edge、cross-subject transition 被拒绝且不覆盖 current | domain + Store fake |
| `host_collaboration_attempt_status_state` | `HostCollaborationAttemptStatus` | prepared/feedback/unknown 的 local attempt successor 按 helper；外部 result 缺失不变 host accepted，late feedback 不重开 terminal relation | domain + service |
| `subscription_scope_status_state` | `SubscriptionScopeStatus` | establish/replace 的 active/superseded/rejected/blocked local decision符合前置；无 source proof/非法替换不扩权或覆盖新版 | domain + service |
| `inbound_intake_disposition_state` | `InboundIntakeDisposition` | accepted intake factory 与 body-free gate；unsupported/blocked/rejected 是 boundary result，不能通过 mutation变 accepted或保存 raw body | domain + worker |
| `screening_disposition_state` | `ScreeningDisposition` | permitted `Passed`/`Degraded` 与 non-permitted classification按 policy；non-permitted 永不进入 CP03 delivery evaluation | domain + application |
| `runtime_delivery_disposition_state` | `RuntimeDeliveryDisposition` | only eligible basis constructs `Eligible`; missing formal entry contract yields local non-positive disposition; non-eligible cannot prepare/submission | domain + application |
| `runtime_submission_attempt_status_state` | `RuntimeSubmissionAttemptStatus` | local prepared/submitted/unknown successor respects side-effect fence; unknown no blind retry; no status means Runtime run/acceptance | domain + adapter fake |
| `runtime_material_reception_disposition_state` | `RuntimeMaterialReceptionDisposition` | accepted source may enter CP04 continuation; rejected/blocked/unknown is immutable local classification and cannot be reclassified by Query | domain + worker |
| `outbound_disposition_state` | `OutboundDisposition` | eligible local decision/material preconditions; ineligible/blocked cannot form publication success; `Eligible` alone not material/attempt/delivery | domain + consumer |
| `publication_attempt_status_state` | `PublicationAttemptStatus` | only existing closed creation path may progress attempt; submit/unknown maintains local fence; `L2M-DDD-004` incomplete prepared/gap path must be rejected, not simulated | domain refusal + job |
| `publication_gap_status_state` | `PublicationGapStatus` | `Open`/`ResolutionPending`/`Resolved`/`Superseded` formal edges only; nonexistent `Unknown` variant and direct field set rejected | domain unit |
| `interaction_gap_status_state` | `InteractionGapStatus` | trace relation gap opens/resolves/supersedes only with matching local refs; invalid predecessor/order must retain incomplete posture, not erase history | domain + trace Store fake |
| `observation_attempt_status_state` | `ObservationAttemptStatus` | local attempt transitions only through defined helper; `L2M-DDD-005` unknown-gap invocation mismatch is refused; no `Observed` / evidence conclusion | domain refusal + job |
| `external_context_resolution_status_state` | `ExternalContextResolutionStatus` | matching purpose/scope/body-free source creates immutable new resolution; a later result is a new record, not overwrite/foreign authorization transition | domain + mirror fake |
| `external_context_gap_status_state` | `ExternalContextGapStatus` | formal `Open/Blocked/ResolutionPending/Unknown -> Resolved/Superseded` helpers only; `L2M-DDD-006` initial `ResolutionPending` gap path rejected until repaired | domain + service refusal |
| `member_projection_status_state` | `MemberProjectionStatus` | initialize/current/disabled, stale, rebuilding/current, rebuilding/failed use covered helper; `Degraded`/`Unknown`/activation reserved edges and `store_version()` pseudo-version are rejected under `L2M-DDD-007` | domain + projection fake |
| `member_idempotency_state` | `MemberIdempotencyState` | validated non-Query `Reserved -> Completed/Conflict`; completed requires exact stored carrier; duplicate no rerun; Query cannot reserve | application + idempotency fake |
| `member_adapter_availability_state` | `MemberAdapterAvailabilityState` | validated enabled/disabled factory and enabled-to-degraded/unavailable; no timeout/probe/query recovery or fallback fake becomes enabled | infra + adapter fake |
| `member_runtime_build_state` | `MemberRuntimeBuildState` | `NotStarted -> ValidatingConfig -> Assembling -> Ready`, non-ready failure, unique slot record; ready exposes only local facade, no container/image/host readiness; no invented restart | builder test |
| `blocked_seam_disposition_state` | `BlockedSeamDisposition` | `Pending/Blocked/Waiting/Unknown` require blocker + safe reason and all block positive path; no implicit dispatch/retry/ready transition | infra boundary test |
| `member_api_handler_disposition_state` | `MemberApiHandlerDisposition` | Command accepted/duplicate and Query served/degraded/not-ready/not-visible pair with correct carrier; Query cannot build command result; result shell terminal | handler test |
| `member_consumer_entry_state` | `MemberConsumerEntryState` | ready only after source/schema/dedup/trace/body gate; blocked/rejected/unsupported/quarantined do not dispatch and cannot mutate to ready | worker entry test |
| `member_worker_registration_state` | `MemberWorkerRegistrationState` | finite logical Consumer registration state uses only named 14 consumers; unbound/blocked seam does not claim listener/route/subscription ready | worker assembly test |
| `member_consumer_item_disposition_state` | `MemberConsumerItemDisposition` | typed receipt maps accepted/duplicate/blocked/waiting/unknown/conflict correctly; no item result means Bus ack/delivery or source success | worker result test |
| `member_job_entry_state` | `MemberJobEntryState` | finite input permits ready dispatch only after metadata/body-free input validation; invalid/blocked entry cannot scan or reserve | jobs entry test |
| `member_job_run_disposition_state` | `MemberJobRunDisposition` | completed/partial/failed/duplicate report factory pairing; no run result means scheduler/process completion/evidence/readiness | jobs result test |
| `member_job_registration_state` | `MemberJobRegistrationState` | finite five Job declarations only; registration state does not start a scheduler/worker or claim host lifecycle | jobs assembly test |

### 15.1 跨状态机边界切口

| 测试切口 | 对应契约 | 必须验证的内容 | 建议测试类型 |
|---|---|---|---|
| `state_trigger_is_owner_helper_not_repository_write` | Step 6 / 9 / 10 | 任何 domain transition 都经 factory/member helper，repository only persists successor；直接写 status / using fake private map fails test | domain + Store fake |
| `state_names_are_consistent_across_protocol_flow_test` | Step 8~10 | protocol disposition、flow branch、state matrix、test assertion使用正式 enum 名；拒绝旧名、口语 alias 和不存在 variant | architecture / contract check |
| `state_non_positive_does_not_cross_owner` | CP01~CP07 boundary | `Blocked/Waiting/Unknown` local state never creates host/Runtime/Bus/Governance/Tools/observability positive state | service boundary test |
| `state_reserved_design_gap_is_visible` | `L2M-DDD-003~007` | receipt source construction、CP04/05/06/07未闭合 edge 均保持 failing-safe refusal；任何未来正向测试需先修订相应 Step 6~10 source | design-gap regression test |

## 16. 事务、一致性、幂等、并发与恢复测试切口

以下 tests 是 planned fake / in-memory boundary contracts，不选择真实物理 Store、DB、broker、scheduler 或 sibling integration。测试断言 member-local relation；不把 in-memory atomicity 当成 production proof。

| 测试切口 | 对应契约 | 必须验证的内容 | 建议测试类型 |
|---|---|---|---|
| `non_query_fresh_path_ordering` | Step 9 / 11 | valid Command/Consumer/Job 次序严格为 validate、begin、digest、reserve、local writes、stored carrier、complete、commit；不得 complete 在 carrier 之前 | service + fake UoW |
| `pre_gate_validation_starts_no_write_uow` | Step 8 / 12 | invalid metadata/name/body/anchor/schema 在任何 write UoW、reservation、adapter、audit 前停止 | handler / worker / jobs entry |
| `stored_carrier_before_idempotency_complete` | Step 11 | carrier save fails -> rollback and no visible completed idempotency; complete fails -> no committed local truth/result | repository fake |
| `same_uow_committed_fact_successor_and_carrier` | Step 11 | accepted local fact/successor、required trace/projection marker、typed result/receipt/report 与 idempotency completion受同一 UoW 约束；不能只提交一部分 positive path | service + fake UoW |
| `versioned_successor_uses_loaded_version` | Step 7 / 11 / 13 | every mutable relation uses `Versioned<T>.version`; external source version/revision/watermark/result ref not used as CAS token | Store fake |
| `append_only_identity_conflict` | Step 11 / 13 | immutable fact/snapshot/trace/material/result same identity append twice is consistency error, not business duplicate replay | Store fake |
| `duplicate_command_exact_replay` | Step 8 / 13 | same command relation returns same stored accepted/rejection carrier; no domain helper, resolver, handoff, trace or local audit write | application + fake ports |
| `duplicate_consumer_exact_receipt_replay` | Step 8 / 13 | same Consumer relation returns exact receipt; no body reinspection, snapshot/feedback/trace/projection write or source read | worker + fake ports |
| `duplicate_job_exact_report_replay` | Step 8 / 13 | same Job relation returns exact report; no listing, scan, item processing, resolver/handoff/rebuild/reconcile repeat | jobs + fake ports |
| `same_key_different_digest_conflict` | Step 13 | change channel/operation/subject/semantic input/digest with same key -> `Conflict`, without mutate or prior-result leak | idempotency fake |
| `operation_namespace_isolation` | Step 13 | equal raw key across distinct finite operation/channel does not incorrectly replay another operation; their canonical relations stay isolated | idempotency fake |
| `completed_relation_missing_or_wrong_carrier` | Step 11 / 12 / 13 | missing/wrong kind/wrong operation/result ref fails `StoredResultUnavailable` / consistency defect; never recompute from current Store, projection, fake map or adapter | application / worker / jobs |
| `in_flight_relation_no_second_writer` | Step 13 | matching `Reserved` relation returns `InFlight`; second invocation does not enter body, create new attempt or use a new internal relation | concurrency fake |
| `concurrent_cas_single_winner` | Step 13 scenario table | presence, scope, host/runtime/publication/observation attempt, gap, mirror and projection competitors yield one expected-version winner; loser returns conflict/partial and no overwrite | Store fake + deterministic scheduler |
| `projection_cursor_monotonicity` | Step 11 / 13 | older rebuild/successor cannot overwrite a newer cursor/watermark; it remains stale/conflict/partial without source repair | projection fake |
| `consumer_source_dedup_and_digest_gate` | Step 8 / 13 | external source identity/schema/inspection and committed fact identity determine dedup; mismatch is conflict before local successor; candidate/event isn't source proof | worker + idempotency fake |
| `commit_status_unknown_same_relation_recovery` | Step 12 / 13 | after ambiguous commit, continuation first inspects same idempotency/result relation; branches only to replay/in-flight/manual consistency defect, never blind re-execution or changed key | service + fake UoW |
| `rollback_failure_is_not_hidden_compensation` | Step 12 | rollback failure surfaces safe temporary/diagnostic error; no compensating write, fake success, external retry or positive audit | service + fake UoW |
| `external_side_effect_unknown_fence` | Step 11~13 | Runtime/host/publication/observation handoff unknown persists only permitted local attempt/gap fence; no automatic resend, delivery/observed/accepted claim | adapter fake + service |
| `partial_job_keeps_committed_item_isolation` | Step 9 / 12 / 13 | individual item success stays committed only if its UoW committed; failed/unresolved item is typed in report; duplicate job replays report rather than repairing all | jobs + fake UoW |
| `query_concurrent_with_writers_remains_read_only` | Step 9 / 13 | concurrent Query may choose stale/not-ready/not-available surface but never reserve/refresh/rebuild/reconcile or wait for writer mutation | query + Store fake |

## 17. 错误、配置、adapter 与观测测试切口表

### 17.1 错误与恢复

| 测试切口 | 对应契约 | 必须验证的内容 | 建议测试类型 |
|---|---|---|---|
| `invalid_request_maps_before_application` | Step 8 / 12 | 缺 metadata、双锚、required ref、idempotency、trace、schema 或 name/body mismatch 映射安全 `InvalidContext`/`ContractViolation`；不 begin UoW | API / worker / jobs |
| `domain_illegal_transition_is_non_positive` | Step 10 / 12 | 任何非法 state edge 返回 `DomainError::IllegalTransition(SafeReasonCategory)` 或所属层映射；不写 success result、trace、audit、projection、handoff | domain + service |
| `application_contract_violation_preserves_fence` | Step 7~12 | source/result/Port/object relation 不一致返回 `ApplicationError::ContractViolation`；不降级为 accepted、retry 或 fake success | application |
| `dependency_unavailable_mapping` | Step 12 / 14 | Command -> blocked/unavailable safe result；Consumer -> blocked/waiting receipt；Job -> partial/failed report；Query -> not-available surface | service + fake adapter |
| `unsupported_version_is_boundary_only` | Step 8 / 12 | unsupported Consumer version不解析、不保存、不 reserve、不调用 service；API/Job version mismatch 同样 pre-gate reject | worker / handler |
| `unknown_side_effect_does_not_retry_blindly` | Step 12 / 13 | Runtime/host/publication/observation unknown 只保留 local attempt/gap fence，禁止自动重发、terminal success 或外部 accepted claim | service + handoff fake |
| `stored_result_unavailable_is_conservative` | Step 11 / 12 | completed relation 缺 carrier 或 kind 错误映射 `StoredResultUnavailable` / consistency defect；不从 current truth 重算 | application + Store fake |
| `version_conflict_rolls_back_current_uow` | Step 11 / 13 | expected-version conflict rollback当前写；返回 conflict/partial；不 merge、静默 reload、覆盖或重用旧 UoW | Store + service |
| `commit_unknown_recovery_is_same_key_only` | Step 12 / 13 | commit outcome unknown 后只能 inspect same relation 并分 replay/in-flight/defect；改变 key 不绕过保护 | service + fake UoW |
| `rollback_failure_surfaces_manual_safe_issue` | Step 12 | rollback 本身失败时返回临时不可用/diagnostic ref；不隐藏补偿写、不声称已回滚或已成功 | service + fake UoW |
| `body_or_digest_rejection_has_no_resolved_success` | Step 8 / 12 / 15 | forbidden raw body、digest mismatch 或 inspection rejected 不创建 resolution/receipt/accepted trace；diagnostic/log 不含 body | worker + observability |

### 17.2 配置与依赖分类

| 测试切口 | 对应契约 | 必须验证的内容 | 建议测试类型 |
|---|---|---|---|
| `raw_config_isolated_to_infra` | Step 14 | raw config 仅由 `infra::config` 读取；domain/contracts/application/api/worker/jobs 不接受 raw secret/map；validated ref 才能跨边界 | architecture + config |
| `config_validation_fail_fast_and_redacted` | Step 14 / 15 | 缺 required binding、非法 enum/ref、重复 slot、incompatible profile 在 builder 前失败；issue 只含 safe ref/category，不含 credential | config test |
| `required_slot_unavailable_blocks_builder` | Step 10 / 14 | mandatory host/Runtime/store/observation slot unavailable 时 `MemberRuntimeBuildState` 不进入 Ready；没有 default/fake fallback | builder + availability fake |
| `optional_slot_disabled_is_explicit` | Step 10 / 14 | optional disabled 只产生 `DisabledByConfig`/safe read posture；不被当作 current/healthy/authorized | config + builder |
| `forbidden_boundary_not_configurable` | Step 14 | config 不能关闭 metadata/double anchor、idempotency、visibility、Query no-write、job no-truth-repair、redaction 或 unknown fence | config invariant |
| `adapter_availability_never_claims_foreign_health` | Step 10 / 14 | Enabled/Degraded/Unavailable 只表示 local slot marker；不映射 host/Runtime/Bus/downstream/source health；recovery by timeout/probe rejected | infra + adapter fake |
| `dependency_classification_is_static` | Step 3 / 14 | only planned Cargo path dependency is `core-contracts`; runtime/event/ref/adapter/fake sibling relation never appears as package dependency | architecture check |
| `ready_means_local_facade_only` | Step 10 / 14 | builder Ready permits local facade construction only; no container/image/member-service/IPC/sandbox readiness or external adapter acceptance claim | builder boundary |

### 17.3 日志、指标、trace、audit 与 redaction

| 测试切口 | 对应契约 | 必须验证的内容 | 建议测试类型 |
|---|---|---|---|
| `trace_id_propagates_from_trusted_entry` | Step 15 | Command/Query metadata、Consumer envelope、Job metadata 的 trace 被 application/worker/jobs/instrumentation 继承；domain/adapter/fake 不生成替代 trace | service + instrumentation |
| `structured_log_fields_are_safe` | Step 15 §7 | logs 仅含 operation/channel/state/disposition/error kind 与安全 refs/fingerprints；不含 request body、event body、prompt/plan/tool data、credential、stack trace | observability check |
| `idempotency_and_dedup_keys_are_one_way` | Step 15 | 原 key 不出现在 log/metric/audit/view/diagnostic；只允许 one-way hash/fingerprint 且无 metric label | observability check |
| `metric_labels_are_low_cardinality` | Step 15 §8 | label 只来自有限 enum（channel、operation、consumer、job、state、disposition、reason）；不含 trace/ref/actor/subject/free text/secret | observability check |
| `local_audit_uses_committed_refs_only` | Step 15 | audit proof 只能关联已提交 fact/successor/receipt/result/report/trace/gap/projection ref；Query、pre-gate、duplicate conflict 不写 accepted audit | application + Store fake |
| `audit_does_not_become_new_event_or_ledger` | Step 15 | no generic audit object/outbox/publisher/event candidate由观测测试创建；telemetry不伪造 external accepted/delivered/evidence/readiness | architecture check |
| `query_observation_is_no_write` | Step 15 | Query 可有 log/metric/span，但不有业务 audit、reservation、stored result、freshness repair 或 resolver side effect | query + instrumentation |
| `redaction_forbidden_body_scan` | Step 15 | planned checker 将 raw request/event body、external response、secret/token/credential、archive/package body、adapter stack trace 视为失败字段 | redaction check |
| `unknown_and_blocked_are_not_success_logs` | Step 15 | `Blocked/Waiting/Unknown` 日志/metric/audit 的 outcome 保持本地保守语义；不使用 accepted/delivered/observed/ready label | observability check |
| `member_job_report_is_not_evidence` | Step 15 | report 日志/metric/audit 只写 item refs/count/disposition；不写 scheduler run、artifact、test result、evidence、verdict 或 signoff | job + observability |

## 18. 前序 Step 5~15 闭环审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 七模块都有最小测试入口 | planned / covered | §9 为 `contracts/domain/application/infra/api/worker/jobs` 各提供入口；不声明实现或执行结果 |
| 10 Command 正向与异常入口 | planned / covered | §10 逐项覆盖；受 `L2M-UP-001/003/004/006/007/008` 或设计 gap 影响的路径保留 blocked/refusal |
| 16 Query 正向与异常入口 | planned / covered | §11 逐项覆盖 visible/empty/not-visible/not-ready/degraded/not-available/stale 与 no-write |
| 14 Consumer 入口 | planned / covered | §12 覆盖 10 external + 4 committed-fact 的 accepted/non-positive、duplicate、unsupported/body/source error |
| 24 outbound semantic candidates | planned / blocked | §13 逐项只验证 `L2M-UP-005` 前不得物化；没有 event/publisher/outbox/route 测试 |
| 5 Job 入口 | planned / covered | §14 覆盖合法 continuation、invalid/partial、duplicate report、no source-truth repair |
| 28 状态主语 | planned / covered | §15 逐项列正式状态名、合法 helper、非法/reserved edge；不伪造 `L2M-DDD-003~007` 缺失 helper |
| 字段 / DTO 构造闭环 | pending targeted repair | Step 8 typed carriers 与 Step 16 tests 可回指；完整 Consumer source/context 与部分 flow helper 仍受 `L2M-DDD-003~007` 约束 |
| metadata / idempotency / digest / result_ref | planned / covered | §16 明确六元 relation、exact replay、missing carrier、same-key conflict、commit unknown；物理 retention 不在本步 |
| projection / mirror rebuild boundary | planned / covered_with_gap | Query no-write、committed-only Job、cursor CAS 已覆盖；CP07 `Degraded/Unknown` helper 缺口保留 `L2M-DDD-007` |
| phase / owner / dependency classification | planned / covered | tests 不越过 CP owner、Runtime/host/Bus boundary；唯一 planned compile dependency 仍为 Core contracts |
| observability / audit security | planned / covered | §17 只检查安全字段和本地 ref；无 backend、告警、SLO 或 external evidence |

### 18.1 开放 blocker（不得因本 Step 关闭）

| blocker | 本 Step 处理方式 | 实现影响 |
|---|---|---|
| `L2M-UP-001` | host registration / IPC / credential / lifecycle 测试只保留 blocked adapter seam | host 正向联调与物理绑定 |
| `L2M-UP-002` | image release / manifest / pinned entry 只保留 supply boundary | image compatibility / release |
| `L2M-UP-003` | Runtime entry / trigger mapping 只测 missing contract fence | Runtime positive handoff |
| `L2M-UP-004` | Runtime handoff / feedback 只测 local attempt/result-link fence | feedback / admission link |
| `L2M-UP-005` | 24 candidates 均不得物化 | Core event carrier / route / publisher |
| `L2M-UP-006` | startup credential / identity anchor 缺失走 blocked | admission positive path |
| `L2M-UP-007` | screening source / taxonomy 缺失走 blocked | inbound positive path |
| `L2M-UP-008` | execution-subject scope 未定不扩张 | future execution identity |
| `L2M-DDD-001` | implementation repo/crate 未定，不做 compile/test claim | code implementation handoff |
| `L2M-DDD-002` | physical persistence/transport 不定，不做 integration claim | durable Store / transport |
| `L2M-DDD-003` | Consumer source/context/receipt 构造闭口前测试 refusal | full receipt replay |
| `L2M-DDD-004` | CP04 prepared attempt/gap creation链未闭合，测试拒绝 | publication relay positive path |
| `L2M-DDD-005` | CP05 attempt-gap unknown helper未闭合，测试 fence | observation relay positive path |
| `L2M-DDD-006` | CP06 refresh initial gap helper/status 未闭合，测试 refusal | refresh positive path |
| `L2M-DDD-007` | CP07 degraded/unknown/activation helper缺失，测试 reserved edge | projection state completion |
| `scope_supersede_gap` | scope supersede field/helper relation remains pending | subscription replacement implementation |

## 19. 回填草稿

正式 `03-详细设计.md` §5.15 仅可在 Step 19 装配时回填以下结论，不能将本文件的过程问答原样带入正式正文：

1. §9 的七模块测试切口汇总表。
2. §10 的 10 Command 接口测试切口及共用 idempotency 断言。
3. §11 的 16 Query 接口切口及 no-write 断言。
4. §12 的 14 Consumer（10 external + 4 committed-fact）切口。
5. §13 的 24 blocked semantic candidate boundary 切口，保留 `L2M-UP-005` blocker。
6. §14 的 5 Job、partial item 与 exact report replay 切口。
7. §15 的 28 状态主语合法 / 非法 / reserved-edge 切口。
8. §16 的事务、一致性、幂等、并发、duplicate、commit-unknown、unknown fence 与 partial Job 切口。
9. §17 的错误、配置、adapter availability、日志、指标、trace、audit、redaction 切口。

回填约束：

- 本 Step 不替代 `05-测试方案.md`；不写测试排期、覆盖率、fixture、CI 或真实外部联调方案。
- 正向结果只指 member-local committed fact/successor/typed carrier/read surface；不得写成 external accepted/delivered/observed/evidence/readiness。
- Query 测试必须保留 no-write；Job 测试必须保留 no source-truth repair；duplicate 必须是 stored typed replay。
- 24 candidate 只能以 blocked boundary 形式回填，不能凭“有测试切口”解除 `L2M-UP-005`。
- 所有 `L2M-UP-001~008`、`L2M-DDD-001~007` 与 `scope_supersede_gap` 仍须在 §17 风险 / 待确认中保留。

## 20. Step 16 门禁与停审

| 条件 | 结果 | 依据 |
|---|---|---|
| 七模块测试入口明确 | planned / covered | §9 |
| 10 Command 各有正向与异常切口 | planned / covered | §10 |
| 16 Query 各有读取与 no-write 切口 | planned / covered | §11 |
| 14 Consumer 各有 source/body/schema/dedup 切口 | planned / covered | §12 |
| 24 blocked candidate 未被物化 | planned / blocked | §13；`L2M-UP-005` 保持开放 |
| 5 Job 各有 success/partial/duplicate/no-repair 切口 | planned / covered | §14 |
| 28 状态机覆盖合法与非法 / reserved 边 | planned / covered_with_gaps | §15；`L2M-DDD-003~007` 保持开放 |
| 事务、一致性、幂等、并发、commit unknown 有入口 | planned / covered | §16 |
| 错误、配置、adapter、观测和 redaction 有入口 | planned / covered | §17 |
| 未写执行结果或 evidence | 通过 | 本文件没有 run_id、artifact、report、evidence、verdict 或 readiness |
| 未替代测试方案 / 实施计划 | 通过 | 仅保留最小验证入口，后续由 `05/06/07` 承接 |

**Step 16 结论：** `completed / pass_with_upstream_and_design_blockers / stop_review`。本文件只提供 planned test cuts，不代表测试已执行，不关闭任何 upstream / design blocker。完成本 Step 后，按 full-03 授权可读取 Step 17 输入并创建 `03_ddd_step_17_implementation_handoff.md`；正式 `03-详细设计.md` 仍只能在 Step 19 装配。
