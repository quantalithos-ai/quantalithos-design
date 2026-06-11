# Step 6. 设计测试场景与用例矩阵

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 6
> 回填章节: `05-测试方案.md` §6 测试场景与用例设计

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6 设计测试场景与用例矩阵 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 5 覆盖矩阵;Step 3 测试切口;Step 4 测试分层;`03` 接口 / 状态 / 错误 / flow;`04` 配置门禁 |
| 输出文件 | `projects/L1-governance/design-calibration/05_test_plan_step_06_cases.md` |
| 停审方式 | 按测试切口分批写入用例;完成后暂停,由用户审查后再进入 Step 7 |

## 2. 本步目标

把 Step 5 的覆盖矩阵落成可执行、可断言、可留证的测试场景和用例矩阵。

本 Step 只回答:

- 每个 P0 正向主线如何执行。
- 每个关键负向、边界、非法状态、事务回滚、并发、恢复、配置和 redaction 场景如何触发。
- 每个用例断言哪些正式字段、状态、错误 surface、事件、marker 或副作用。
- 每个用例是否有前置数据、自动化候选和候选证据 ID。
- 是否存在只测 happy path、断言重复、断言缺失、phase 越界或证据冲突。

本 Step 不定义 fixture 具体文件、数据生成器实现、CI suite 名称、artifact 路径、正式 evidence ID 或验收裁决。测试数据由 Step 7 固定,自动化 gate 由 Step 9 固定,正式 evidence ID 和归档路径由 Step 13 固定。本文中的 `EV-CAND-*` 是候选证据 ID,不是最终 `EV-*` 编号。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_05_traceability_coverage.md` | 已完成 | 提供需求 / 规则 / 设计契约到测试切口的追溯 |
| `05_test_plan_step_03_test_objects_cuts.md` | 已完成 | 提供 P0 测试对象、切口和负向风险入口 |
| `05_test_plan_step_04_strategy_layers.md` | 已完成 | 提供每个切口的主发现层级 |
| `03_ddd_step_08_protocol_contracts.md` | 正式输入 | 提供 23 Command、14 Query、9 Consumer、12 Outbound Event、7 Job DTO 和 result surface |
| `03_ddd_step_09_function_flows.md` | 正式输入 | 提供 accepted/rejected/duplicate/no-write/partial failure 编排 |
| `03_ddd_step_10_state_matrix.md` | 正式输入 | 提供正式 state enum、合法 / 非法转换和 terminal guard |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 正式输入 | 提供 UoW、version、stored result/report、outbox snapshot、projection/reference/handoff 一致性口径 |
| `03_ddd_step_12_error_recovery.md` | 正式输入 | 提供 `DomainError`、`ApplicationError`、protocol rejection、worker/job disposition 映射 |
| `03_ddd_step_13_concurrency_idempotency.md` | 正式输入 | 提供 duplicate replay、same-key conflict、commit unknown、race guard |
| `03_ddd_step_14_config_external_binding.md` / `04-配置设计.md` §12 | 正式输入 | 提供 config validation、profile、adapter、topic、external GRC 和 degraded/no-write 测试入口 |
| `03_ddd_step_15_observability_audit.md` | 正式输入 | 提供 logs / metrics / audit / trace / redaction 断言 |
| `03_ddd_step_16_test_cuts.md` | 直接输入 | 提供最小测试切口汇总 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 正向主线怎么执行? | 按 contracts/domain/application/entry 分层执行。Command 主线调用正式 command flow 并断言 truth、trace/audit、outbox、projection stale、stored result 同 UoW;Query 主线读取 view/report/trace 并断言 no-write;Consumer 主线消费外部 envelope 并写 snapshot/reference/stale/receipt;Outbound 主线发布 stored payload snapshot;Job 主线写 report/marker 且不修 core truth。 |
| 每个关键反向和边界场景如何触发? | 通过 missing metadata、unsupported schema version、forbidden body、invalid reference、non-ready context、terminal state、wrong actor、same key different digest、version conflict、source unavailable、publisher failure、target disabled、unsafe config、query degraded、dependency violation 等输入触发。 |
| 每个状态非法迁移如何断言? | 以 Step 10 正式 enum 为唯一来源。非法转换断言 `DomainError::InvalidStateTransition` 或对应 `ApplicationError` / protocol surface,并断言不写 success trace、history、outbox、stored accepted result 或 projection fresh marker。 |
| 每个事务回滚和副作用如何验证? | 通过 fake repository / fake UoW 注入 store unavailable、outbox append failure、stored result failure、idempotency complete failure、version conflict、rollback failure。断言 truth、history、trace、audit、outbox、projection、reference、stored result/report 的提交边界。 |
| 每个恢复场景如何复现? | 使用 duplicate same digest、duplicate result missing、commit status unknown、publisher retryable/permanent failure、reference unavailable、projection rebuild race、job partial failure 和 handoff failed marker 复现。恢复只读取 stored result/receipt/report 或 marker,不得从 current truth 重算。 |
| 每个用例预期结果引用了哪些正式字段、状态、错误或事件? | 用例矩阵的断言点列引用正式 DTO、state enum、error surface、outbox event、worker/job disposition、repository marker 或 config validation gate。 |
| 是否存在把后续 phase 状态或证据提前写入当前用例的问题? | 当前未发现。P1 real-like、P2 production/capacity、正式 EV 编号、artifact 路径和 release verdict 不在本 Step 固定。 |
| 每个测试切口下有哪些正向、负向、边界、并发、恢复或一致性用例? | 见 §8.2~§8.9。每个测试切口至少有正向主线和关键负向 / 边界用例。 |
| 每个用例是否有明确断言点、数据前置、自动化候选和证据 ID? | 是。当前证据列使用 `EV-CAND-*` 候选 ID,正式 evidence ID 留 Step 13。 |
| 当前测试切口的用例完成后是否通过停审? | 通过。见 §8.10 单测试切口用例停审记录。 |
| 所有用例完成后是否存在断言重复、断言缺失、phase 越界、证据冲突或只测 happy path? | 当前未发现 unresolved 冲突。见 §8.11 跨用例审计。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧用例围绕少量旧主线,无法覆盖 23 Command、14 Query、9 Consumer、12 Event、7 Job 和状态矩阵 | 不继承旧用例,按新版 Step 3~5 重建 |
| Step 5 | 已有覆盖矩阵和用例候选族,但没有可执行步骤和断言 | 本 Step 生成具体 TC 矩阵 |
| Step 3 / Step 16 | 已有测试切口,但不是正式用例矩阵 | 本 Step 按切口生成正向 / 负向 / 边界 / 并发 / 恢复用例 |
| Error / state 断言 | 容易使用口语状态或泛化错误 | 本 Step 明确引用 Step 10 / Step 12 正式名称 |
| Evidence | Step 13 尚未执行,不能固定最终 EV | 本 Step 使用 `EV-CAND-*` 候选证据,不生成正式 evidence index |

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
| contracts protocol / metadata / digest | 6.1 | DTO roundtrip、required metadata、schema version、digest conflict | P0 | protocol DTO builders | `EV-CAND-GOV-CONTRACT-*` | 通过 |
| domain object / policy / state | 6.1 | factory invariant、policy reject、legal/illegal transition | P0 | domain fixture builders | `EV-CAND-GOV-STATE-*` | 通过 |
| command orchestration | 6.2 | 23 Command accepted/rejected/duplicate/version/rollback | P0 | truth + reference fixtures | `EV-CAND-GOV-CMD-*` | 通过 |
| query no-write | 6.3 | 14 Query hit/missing/not-visible/degraded/no-write | P0 | projection/view fixtures | `EV-CAND-GOV-QUERY-*` | 通过 |
| inbound consumer | 6.3 | 9 Consumer accepted/duplicate/unsupported/delayed/body-free | P0 | event envelope fixtures | `EV-CAND-GOV-CONSUMER-*` | 通过 |
| outbound event / publish | 6.4 | 12 event payload snapshot、topic、publish failure、dead-letter | P0 | outbox payload fixtures | `EV-CAND-GOV-OUTBOX-*` | 通过 |
| operations job | 6.4 | 7 Job success/partial/duplicate/no truth repair | P0 | job input + store fixtures | `EV-CAND-GOV-JOB-*` | 通过 |
| consistency / idempotency / recovery | 6.5 | same-key replay/conflict、commit unknown、stored result missing、race | P0 | fake UoW/repository fault fixtures | `EV-CAND-GOV-IDEMP-*` | 通过 |
| config / redaction / dependency | 6.5 | strict config、profile isolation、redaction scan、dependency boundary | P0 | config/artifact fixtures | `EV-CAND-GOV-CONFIG-*` | 通过 |

### 8.2 测试场景表

| 场景组 | 需求 / 规则 | 主切口 | 场景类型 | 断言重点 |
|---|---|---|---|---|
| Governance core setup | C-GOV-1;FR-GOV-001~002 | command + domain + query | 正向 / 负向 | context/input 正式 state、refs-only、pending/degraded surface、no body |
| Gate and decision | C-GOV-2;FR-GOV-003~004 | command + state + policy | 正向 / 负向 / 状态 | gate/decision/approval state、责任链、终态不可改、相邻状态不替代 |
| Policy and control | C-GOV-3;FR-GOV-005~006 | command + state + consumer | 正向 / 负向 / 边界 | policy effective fact、shared rules、conflict、control applicability/review |
| Compliance and nonconformity | C-GOV-4;FR-GOV-007~008 | command + state + redaction | 正向 / 负向 | AIIA/SoA body-free、NC cause/action/verification formal closure |
| Consumption and maintenance | C-GOV-5;FR-GOV-009~010 | query + consumer + outbox + job | 正向 / 恢复 / 一致性 | no-write、stored payload、receipt/report replay、no truth repair |
| Cross-boundary veto | VF-GOV-002~010 | boundary + config + redaction + arch | 负向 / 门禁 | sibling truth not persisted、body absent、dependency scan、unsafe config reject |

### 8.3 Contract / domain / state 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 | 证据候选 ID |
|---|---|---|---|---|---|---|---|---|
| TC-GOV-CONTRACT-001 | public DTO roundtrip | P0 | Command / Query / Event / Job DTO builders 可构造 | serialize + deserialize 所有 public DTO family | DTO roundtrip 后 ref、state、reason、metadata、schema version 不丢失 | `GovernanceCommandRequest<T>`、query response、event payload、job request/report 字段稳定 | 是 | EV-CAND-GOV-CONTRACT-001 |
| TC-GOV-CONTRACT-002 | required metadata validation | P0 | handler validation fixture | 缺 command idempotency key、actor、trace context 或 event/job dedup key | 返回 `GovernanceProtocolRejection::InvalidRequest` 或 worker/job rejected | 不 begin UoW、不 reserve idempotency、不调用 domain transition | 是 | EV-CAND-GOV-CONTRACT-002 |
| TC-GOV-CONTRACT-003 | unsupported schema version | P0 | inbound event envelope fixture | event schema version 不在 allowlist | worker disposition `UnsupportedVersion` | 不 parse payload、不写 snapshot/reference/stale/receipt accepted success | 是 | EV-CAND-GOV-CONTRACT-003 |
| TC-GOV-CONTRACT-004 | operation digest conflict | P0 | same operation namespace + existing idempotency key | same key with different canonical digest | `ApplicationError::IdempotencyConflict` / protocol conflict | volatile metadata 不影响 digest;business field 差异触发 conflict | 是 | EV-CAND-GOV-CONTRACT-004 |
| TC-GOV-DOMAIN-001 | GovernanceContext factory invariant | P0 | valid actor/scope/subject refs | `GovernanceContext::from_subject(...)` with valid refs | new context state is `Draft` or accepted flow marks `Ready/PendingReference` by policy | context id/source/actor refs present;no external body field | 是 | EV-CAND-GOV-STATE-001 |
| TC-GOV-DOMAIN-002 | Decision finalization policy | P0 | gate `PendingDecision`;decision `Proposed`;chain satisfied | approve/reject/waive decision | decision enters `Approved` / `Rejected` / `Waived`;gate enters `Decided` | basis/reason required;trace/outbox/stale/result saved by accepted flow | 是 | EV-CAND-GOV-STATE-002 |
| TC-GOV-DOMAIN-003 | Shared rules low scope override rejected | P0 | active organization shared rule;lower scope policy fixture | attempt lower scope override without formal resolution | `DomainError::PolicyRejected` or conflict record required | shared rule still active;no silent overwrite | 是 | EV-CAND-GOV-STATE-003 |
| TC-GOV-DOMAIN-004 | Compliance conclusion body-free invariant | P0 | artifact/evidence refs available | submit AIIA / SoA conclusion with artifact body embedded | rejected as forbidden body / invalid request | Governance truth stores artifact/evidence refs only | 是 | EV-CAND-GOV-STATE-004 |
| TC-GOV-DOMAIN-005 | Nonconformity cannot close as alert/bug | P0 | nonconformity `Raised` or `CauseConfirmed` | try close using work blocker / observability alert only | `DomainError::PolicyRejected` | formal corrective action and verification result required | 是 | EV-CAND-GOV-STATE-005 |
| TC-GOV-STATE-001 | GovernanceContext illegal terminal transition | P0 | context `Invalid` or `Closed` | call `mark_ready` / mutate mainline | `DomainError::InvalidStateTransition` | no success trace/history/outbox/stored result | 是 | EV-CAND-GOV-STATE-006 |
| TC-GOV-STATE-002 | GovernanceInput pending evidence guard | P0 | input `PendingEvidence`;evidence unresolved | call `accept` | `DomainError::InvalidStateTransition` or reference unresolved surface | pending state preserved;no accepted result | 是 | EV-CAND-GOV-STATE-007 |
| TC-GOV-STATE-003 | Gate terminal guard | P0 | gate `Decided` / `Expired` / `Cancelled` | attach another decision | `DomainError::InvalidStateTransition` | existing decision ref unchanged | 是 | EV-CAND-GOV-STATE-008 |
| TC-GOV-STATE-004 | Decision supersede creates new fact | P0 | decision `Approved`;next decision fixture | supersede current decision | current becomes `Superseded`;next decision saved;no in-place rewrite | `superseded_by` present;history/trace/outbox use both refs | 是 | EV-CAND-GOV-STATE-009 |
| TC-GOV-STATE-005 | Policy / Control / Compliance illegal transition batch | P0 | terminal policy/control/conclusion states | call update/approve/review again | `DomainError::InvalidStateTransition` | terminal object unchanged;no success marker | 是 | EV-CAND-GOV-STATE-010 |
| TC-GOV-STATE-006 | Derived / reference / outbox / job state no truth repair | P0 | stale/failed projection, failed reference, pending outbox, failed job report | run query / job marker transitions | marker state changes only where flow allows | core Governance truth unchanged | 是 | EV-CAND-GOV-STATE-011 |

### 8.4 Command 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 | 证据候选 ID |
|---|---|---|---|---|---|---|---|---|
| TC-GOV-CMD-001 | CreateGovernanceContext accepted | P0 | actor/scope/subject/source refs valid;reference resolver returns resolved or pending state | call `CreateGovernanceContextFlow` | context saved;state `Ready` or `PendingReference`;stored command result returned | context refs body-free;trace/audit/outbox/stale/result same UoW | 是 | EV-CAND-GOV-CMD-001 |
| TC-GOV-CMD-002 | SubmitGovernanceInput received only | P0 | context exists and is not `Invalid` / `Closed`;input source ref valid | call `SubmitGovernanceInputFlow` | input saved as `Received`;no accept / pending evidence branch is executed | no external body saved;input result stored;affected views stale;duplicate replay returns same result | 是 | EV-CAND-GOV-CMD-002 |
| TC-GOV-CMD-003 | UpdateGovernanceInputState transition | P0 | input `Received` / `PendingEvidence`;expected version loaded | call `UpdateGovernanceInputStateFlow` to accept/wait/reject/supersede | state changes to requested formal variant or rejects invalid transition | reason/ref required;pending evidence ref only from request;accept resolves existing pending evidence when present;history/trace/outbox/result saved only on accepted transition | 是 | EV-CAND-GOV-CMD-003 |
| TC-GOV-CMD-004 | OpenGovernanceGate accepted | P0 | context `Ready`;optional approver requirement fixture | call `OpenGovernanceGateFlow` | no requirement => gate `Open` and no responsibility ref;with requirement => responsibility/chain saved, responsibility history appended, and gate `PendingDecision` | final gate state, responsibility, `ResponsibilityTraceRecord`, trace/outbox/stale/result in one UoW;requirement branch writes `required_responsibility_ref` from saved responsibility and change kind `responsibility-required` / `responsibility-assigned` | 是 | EV-CAND-GOV-CMD-004 |
| TC-GOV-CMD-005 | RecordGovernanceDecision finalizes gate | P0 | gate already `PendingDecision`;chain satisfied or policy permits | call `RecordGovernanceDecisionFlow` approve/reject/waive | decision finalized;gate `Decided`;stored result returned | decision basis/reason present;Open gate rejected instead of being transitioned in precheck;no process/work state writes Decision truth | 是 | EV-CAND-GOV-CMD-005 |
| TC-GOV-CMD-006 | SupersedeGovernanceDecision creates replacement fact | P0 | current decision `Approved` / `Rejected` / `Waived`;same gate available | call `SupersedeGovernanceDecisionFlow` | current decision `Superseded`;next decision created/finalized by intent | original final state not overwritten;history links current and next | 是 | EV-CAND-GOV-CMD-006 |
| TC-GOV-CMD-007 | AssignApprovalResponsibility accepted | P0 | context `Ready`;requirement exists;actor capability snapshot resolved | call `AssignApprovalResponsibilityFlow` | responsibility `Assigned`;chain updated | actor capability stored as snapshot/ref only;outbox/stale/result saved | 是 | EV-CAND-GOV-CMD-007 |
| TC-GOV-CMD-008 | RecordApprovalVote updates responsibility and chain | P0 | assigned/accepted responsibility;authorized actor | call `RecordApprovalVoteFlow` | vote recorded;chain may become `Satisfied` | wrong actor rejected;accepted vote emits trace/outbox/stale/result | 是 | EV-CAND-GOV-CMD-008 |
| TC-GOV-CMD-009 | DelegateApprovalResponsibility accepted | P0 | responsibility delegable;delegate capability snapshot resolved | call `DelegateApprovalResponsibilityFlow` | responsibility `Delegated`;delegate ref recorded | original actor history retained;no silent overwrite | 是 | EV-CAND-GOV-CMD-009 |
| TC-GOV-CMD-010 | ActivatePolicyEffectiveFact accepted | P0 | method policy snapshot resolved;request `subject_ref` and `scope_ref` present;`resolve_scope_subject_relation(subject_ref, scope_ref)` returns `Allowed`;`policy_snapshot.scope_ref` matches request scope | call `ActivatePolicyEffectiveFactFlow` | policy fact `Active` or conflict marker created by policy;relation `Mismatch` / `Unknown` or snapshot scope mismatch rejected before save | method body not stored;shared rules/priority guard applied;`matches_scope(...)` only compares stable scope identity;`PolicyScopePolicy` consumes body-free relation decision,not scope reverse lookup or self-equality | 是 | EV-CAND-GOV-CMD-010 |
| TC-GOV-CMD-011 | UpdatePolicyEffectiveFactState transition | P0 | policy fact existing with expected version | call `UpdatePolicyEffectiveFactStateFlow` active/suspend/supersede/retire | formal state updated or terminal guard rejects | reason required;affected policy views stale | 是 | EV-CAND-GOV-CMD-011 |
| TC-GOV-CMD-012 | UpdateSharedRuleSet accepted | P0 | rule refs valid;request `subject_ref` and `scope_ref` present;`resolve_scope_subject_relation(subject_ref, scope_ref)` returns `Allowed` | call `UpdateSharedRuleSetFlow` draft/activate/add/deprecate/retire | shared rule set state/rule refs updated;relation `Mismatch` / `Unknown` rejected before save | lower-scope override not allowed silently;conflict detection marker if needed;`PolicyScopePolicy` consumes body-free relation decision,not scope reverse lookup or self-equality | 是 | EV-CAND-GOV-CMD-012 |
| TC-GOV-CMD-013 | ResolvePolicyConflict accepted | P0 | conflict `Detected` / `PendingDecision`;decision ref if required | call `ResolvePolicyConflictFlow` resolve/waive/invalidate | conflict state changes to formal target | resolution reason/ref present;policy truth not rewritten ad hoc | 是 | EV-CAND-GOV-CMD-013 |
| TC-GOV-CMD-014 | AssessControlApplicability accepted | P0 | governance context ready;method control snapshot resolved | call `AssessControlApplicabilityFlow` | applicability assessed/applicable/not applicable/excluded | control definition body-free;coverage/projection stale | 是 | EV-CAND-GOV-CMD-014 |
| TC-GOV-CMD-015 | RecordControlReview accepted | P0 | applicability exists;review evidence refs valid | call `RecordControlReviewFlow` plan/start/pass/fail/waive/supersede | review state changes;nonconformity-required marker if failed | evidence body absent;history/trace/outbox/result saved | 是 | EV-CAND-GOV-CMD-015 |
| TC-GOV-CMD-016 | SubmitAIIAConclusion accepted | P0 | context ready;artifact/evidence refs available | call `SubmitAIIAConclusionFlow` | AIIA conclusion draft/submitted | artifact/evidence body not stored;approval branch creates required refs only | 是 | EV-CAND-GOV-CMD-016 |
| TC-GOV-CMD-017 | SubmitSoAConclusion accepted | P0 | control coverage refs available | call `SubmitSoAConclusionFlow` | SoA conclusion draft/submitted | coverage ref required;AIIA-only fields absent;body-free | 是 | EV-CAND-GOV-CMD-017 |
| TC-GOV-CMD-018 | ApproveComplianceConclusion accepted | P0 | conclusion submitted;decision guard satisfied | call `ApproveComplianceConclusionFlow` approve/reject/revoke | conclusion `Approved` / `Rejected` / `Revoked` by intent | terminal guard;archive-required marker refs only | 是 | EV-CAND-GOV-CMD-018 |
| TC-GOV-CMD-019 | RaiseNonconformity accepted | P0 | context/evidence/runtime signal ref valid | call `RaiseNonconformityFlow` | nonconformity `Raised`;trace handoff required flag if applicable | no work blocker/alert body stored;source ref captured | 是 | EV-CAND-GOV-CMD-019 |
| TC-GOV-CMD-020 | ConfirmNonconformityCause accepted | P0 | nonconformity `Raised`;cause ref/reason present | call `ConfirmNonconformityCauseFlow` | nonconformity `CauseConfirmed` | reason/ref stored;history/trace/outbox/result saved | 是 | EV-CAND-GOV-CMD-020 |
| TC-GOV-CMD-021 | PlanCorrectiveAction accepted | P0 | nonconformity ready for correction;owner valid | call `PlanCorrectiveActionFlow` | corrective action `Planned`;nonconformity enters correction path | owner/target refs valid;no work truth replacement | 是 | EV-CAND-GOV-CMD-021 |
| TC-GOV-CMD-022 | CompleteCorrectiveAction accepted | P0 | corrective action `Planned` / `InProgress`;evidence refs valid | call `CompleteCorrectiveActionFlow` complete/cancel/fail | action `Completed` / `Cancelled` / `Failed`;NC may become ready for verification | evidence body absent;version conflict guarded | 是 | EV-CAND-GOV-CMD-022 |
| TC-GOV-CMD-023 | VerifyNonconformity accepted | P0 | nonconformity ready for verification;verification basis refs valid | call `VerifyNonconformityFlow` passed/failed | verification result saved;passed may close NC by policy;failed keeps open | `VerificationState` and `NonconformityState` follow Step 10 | 是 | EV-CAND-GOV-CMD-023 |
| TC-GOV-CMD-024 | command invalid request no UoW | P0 | handler fixture | missing required DTO ref/reason/metadata | `GovernanceProtocolRejection::InvalidRequest` | no UoW begin;no id generated;no trace/outbox/stored result | 是 | EV-CAND-GOV-CMD-024 |
| TC-GOV-CMD-025 | command duplicate same key same digest | P0 | idempotency completed with stored result | repeat same command and digest | stored command result replayed | no new resolver call, truth write, trace, outbox or stale marker | 是 | EV-CAND-GOV-CMD-025 |
| TC-GOV-CMD-026 | command same key different digest | P0 | idempotency key reserved/completed for another digest | submit changed command with same key | `ApplicationError::IdempotencyConflict` / protocol conflict | no domain transition;no accepted trace/outbox | 是 | EV-CAND-GOV-CMD-026 |
| TC-GOV-CMD-027 | command optimistic version conflict | P0 | target truth version changed after read | save with stale expected version | `ApplicationError::VersionConflict` | transaction rollback;caller must reload | 是 | EV-CAND-GOV-CMD-027 |
| TC-GOV-CMD-028 | command outbox append failure rollback | P0 | fake outbox repo configured to fail append | accepted domain transition reaches outbox append | command returns dependency/consistency failure | truth/history/trace/stored result not committed | 是 | EV-CAND-GOV-CMD-028 |
| TC-GOV-CMD-029 | command stored result failure rollback | P0 | fake stored result repo fails before idempotency complete | accepted mutation reaches result save | command fails retryably | idempotency not completed;truth/outbox not visible after rollback | 是 | EV-CAND-GOV-CMD-029 |
| TC-GOV-CMD-030 | forbidden external body rejected in command | P0 | command fixture includes raw artifact/method/runtime body | submit body-bearing command | `DomainError::ExternalBodyRejected` mapped to rejection | no body in truth/outbox/audit/report/log candidate output | 是 | EV-CAND-GOV-CMD-030 |

### 8.5 Query / inbound consumer 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 | 证据候选 ID |
|---|---|---|---|---|---|---|---|---|
| TC-GOV-QUERY-001 | GetGovernanceContext hit | P0 | context view exists and visible | call `GetGovernanceContextFlow` | returns `GovernanceContextView` | body-free refs, freshness marker, no write UoW | 是 | EV-CAND-GOV-QUERY-001 |
| TC-GOV-QUERY-002 | GetGovernanceInput hit | P0 | input view exists | call `GetGovernanceInputFlow` | returns input view with pending/accepted surface | pending evidence marker visible, no resolver call | 是 | EV-CAND-GOV-QUERY-002 |
| TC-GOV-QUERY-003 | GetGateDecision hit | P0 | gate and decision summary projection exists | call `GetGateDecisionFlow` | returns `DecisionSummaryView` | gate/decision refs and states from projection/truth;no process waiting body | 是 | EV-CAND-GOV-QUERY-003 |
| TC-GOV-QUERY-004 | ListPendingGovernanceDecisions page | P0 | pending decision projection page seeded | call `ListPendingGovernanceDecisionsFlow` | returns page with visible items and cursor | invisible items filtered;empty page allowed;no write | 是 | EV-CAND-GOV-QUERY-004 |
| TC-GOV-QUERY-005 | GetApprovalResponsibility hit | P0 | responsibility and chain view exists | call `GetApprovalResponsibilityFlow` | returns responsibility view | actor snapshot summary/ref only;no actor profile body | 是 | EV-CAND-GOV-QUERY-005 |
| TC-GOV-QUERY-006 | GetPolicyEffectiveView hit/degraded | P0 | policy view index row exists or missing;method snapshot optional unavailable fixture | call `GetPolicyEffectiveViewFlow` | returns fresh or degraded policy view | missing index row returns missing projection surface;query does not create view ref or refresh | 是 | EV-CAND-GOV-QUERY-006 |
| TC-GOV-QUERY-007 | GetPolicyConflict hit | P0 | conflict truth/view exists | call `GetPolicyConflictFlow` | returns conflict view | resolved/waived/invalidated state surfaced;no policy rewrite | 是 | EV-CAND-GOV-QUERY-007 |
| TC-GOV-QUERY-008 | GetControlCoverage hit | P0 | control coverage index row exists or missing | call `GetControlCoverageFlow` | returns coverage complete/gap/pending view or missing projection surface | no view ref creation;no nonconformity auto-created for gap | 是 | EV-CAND-GOV-QUERY-008 |
| TC-GOV-QUERY-009 | GetComplianceConclusion hit | P0 | AIIA/SoA conclusion view exists | call `GetComplianceConclusionFlow` | returns compliance conclusion view | artifact/evidence refs only;no AIIA/SoA body | 是 | EV-CAND-GOV-QUERY-009 |
| TC-GOV-QUERY-010 | GetNonconformityStatus hit | P0 | nonconformity status index row exists or missing | call `GetNonconformityStatusFlow` | returns NC status view or missing projection surface | action/verification state surface follows Step 10;no view ref creation;no auto-close | 是 | EV-CAND-GOV-QUERY-010 |
| TC-GOV-QUERY-011 | SearchGovernanceFacts visibility filtered | P0 | search index has visible and invisible items | call `SearchGovernanceFactsFlow` | returns only visible result items | no raw body in result snippet;empty after filtering allowed | 是 | EV-CAND-GOV-QUERY-011 |
| TC-GOV-QUERY-012 | GetGovernanceTrace body-free | P0 | trace records exist | call `GetGovernanceTraceFlow` | returns trace page | trace contains refs/safe summaries only;no observability span body | 是 | EV-CAND-GOV-QUERY-012 |
| TC-GOV-QUERY-013 | GetGovernanceDashboard stale/degraded | P0 | dashboard index row exists or missing;projection stale or source degraded | call `GetGovernanceDashboardFlow` | returns stale/degraded marker or missing projection surface | query does not create view ref, rebuild projection, or refresh reference | 是 | EV-CAND-GOV-QUERY-013 |
| TC-GOV-QUERY-014 | GetGovernanceReconciliationReport hit/missing | P0 | report exists or missing fixture | call `GetGovernanceReconciliationReportFlow` | returns report or missing surface | missing report does not trigger reconciliation job | 是 | EV-CAND-GOV-QUERY-014 |
| TC-GOV-QUERY-015 | query visibility denied | P0 | target exists;actor lacks visibility | call representative query | returns not-visible query surface | no generic error leak;body absent/redacted;no write | 是 | EV-CAND-GOV-QUERY-015 |
| TC-GOV-QUERY-016 | query no-write audit | P0 | write-audit fake repository installed | run all 14 representative query flows | all query flows complete without writes | no begin write UoW, no resolver refresh, no projection repair, no audit append | 是 | EV-CAND-GOV-QUERY-016 |
| TC-GOV-CONSUMER-001 | identity actor capability changed accepted | P0 | event envelope valid;actor capability summary body-free | consume `IdentityActorCapabilityChangedPayload` | snapshot/reference state saved;receipt accepted | duplicate key stored;affected views from repository;no actor body | 是 | EV-CAND-GOV-CONSUMER-001 |
| TC-GOV-CONSUMER-002 | process governance context changed accepted | P0 | process context ref valid;resolver returns safe summary | consume `ProcessGovernanceContextChangedPayload` | process reference state saved;affected views stale | no ProcessInstance/Activity/waiting body persisted | 是 | EV-CAND-GOV-CONSUMER-002 |
| TC-GOV-CONSUMER-003 | work governance context changed accepted | P0 | work context ref valid | consume `WorkGovernanceContextChangedPayload` | work reference state saved;affected views stale | no Project/WorkItem/Iteration truth persisted | 是 | EV-CAND-GOV-CONSUMER-003 |
| TC-GOV-CONSUMER-004 | artifact evidence changed body rejected | P0 | event contains evidence body or digest mismatch | consume `ArtifactEvidenceChangedPayload` | worker disposition `Rejected` or failed reference marker by design | no artifact/evidence body saved;redacted issue ref only | 是 | EV-CAND-GOV-CONSUMER-004 |
| TC-GOV-CONSUMER-005 | method policy definition changed accepted | P0 | method policy safe snapshot available | consume `MethodPolicyDefinitionChangedPayload` | method policy snapshot saved;policy views stale | no AIPolicyDef/method body persisted | 是 | EV-CAND-GOV-CONSUMER-005 |
| TC-GOV-CONSUMER-006 | method control definition changed accepted | P0 | control definition safe snapshot available | consume `MethodControlDefinitionChangedPayload` | method control snapshot saved;control views stale | no standard/control text body persisted | 是 | EV-CAND-GOV-CONSUMER-006 |
| TC-GOV-CONSUMER-007 | runtime signal recorded accepted boundary | P0 | runtime signal summary ref valid | consume `RuntimeSignalRecordedPayload` | runtime signal reference saved or pending input marker created by flow | runtime execution body/tool result not stored | 是 | EV-CAND-GOV-CONSUMER-007 |
| TC-GOV-CONSUMER-008 | conversation context changed body-free | P0 | conversation context ref valid | consume `ConversationContextChangedPayload` | source reference/trace stale marker saved | no message body/UI card body stored | 是 | EV-CAND-GOV-CONSUMER-008 |
| TC-GOV-CONSUMER-009 | observability alert raised boundary | P0 | alert summary ref valid;no stack trace body | consume `ObservabilityAlertRaisedPayload` | alert summary maps to reference/runtime signal marker or pending NC marker | no log/store/stack trace body saved | 是 | EV-CAND-GOV-CONSUMER-009 |
| TC-GOV-CONSUMER-010 | consumer duplicate replays receipt | P0 | accepted receipt stored for event dedup key | consume same event again | worker disposition `Duplicate` with stored receipt | no snapshot/stale/trace rewrite | 是 | EV-CAND-GOV-CONSUMER-010 |
| TC-GOV-CONSUMER-011 | consumer source unavailable delayed | P0 | resolver configured temporary unavailable | consume representative external change | worker disposition `Delayed` | no failed accepted receipt;no external truth fabrication | 是 | EV-CAND-GOV-CONSUMER-011 |
| TC-GOV-CONSUMER-012 | consumer unsupported version no parse | P0 | event envelope schema unsupported | consume event | worker disposition `UnsupportedVersion` | payload not parsed;no snapshot/reference/stale marker | 是 | EV-CAND-GOV-CONSUMER-012 |

### 8.6 Outbound event / operations job 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 | 证据候选 ID |
|---|---|---|---|---|---|---|---|---|
| TC-GOV-OUTBOX-001 | GovernanceContextChanged payload snapshot | P0 | accepted context/input truth change outbox record exists | build/publish event from stored payload | `GovernanceContextChangedPayload` published | payload uses stored snapshot,not current truth rebuild;refs only | 是 | EV-CAND-GOV-OUTBOX-001 |
| TC-GOV-OUTBOX-002 | GateChanged payload snapshot | P0 | accepted gate truth change outbox record exists | publish pending gate event | `GateChangedPayload` published | gate/context/decision/responsibility refs only;no process waiting body | 是 | EV-CAND-GOV-OUTBOX-002 |
| TC-GOV-OUTBOX-003 | GovernanceDecisionChanged payload snapshot | P0 | decision accepted and outbox payload stored | publish decision event | `GovernanceDecisionChangedPayload` published | outcome/basis refs from committed decision snapshot;no evidence body | 是 | EV-CAND-GOV-OUTBOX-003 |
| TC-GOV-OUTBOX-004 | ApprovalResponsibilityChanged payload snapshot | P0 | responsibility accepted outbox record exists | publish responsibility event | `ApprovalResponsibilityChangedPayload` published | actor/vote/chain refs only;no identity profile body | 是 | EV-CAND-GOV-OUTBOX-004 |
| TC-GOV-OUTBOX-005 | PolicyEffectiveFactChanged payload snapshot | P0 | policy fact accepted outbox record exists | publish policy event | `PolicyEffectiveFactChangedPayload` published | policy scope/state/method snapshot refs only | 是 | EV-CAND-GOV-OUTBOX-005 |
| TC-GOV-OUTBOX-006 | SharedRuleSetChanged payload snapshot | P0 | shared rule change outbox exists | publish shared rule event | `SharedRuleSetChangedPayload` published | rule refs only;no rule expression/standard body | 是 | EV-CAND-GOV-OUTBOX-006 |
| TC-GOV-OUTBOX-007 | PolicyConflictChanged payload snapshot | P0 | conflict change outbox exists | publish conflict event | `PolicyConflictChangedPayload` published | conflict state/resolution refs only;no policy body | 是 | EV-CAND-GOV-OUTBOX-007 |
| TC-GOV-OUTBOX-008 | ControlApplicabilityChanged payload snapshot | P0 | control applicability outbox exists | publish control event | `ControlApplicabilityChangedPayload` published | control snapshot/evidence refs only | 是 | EV-CAND-GOV-OUTBOX-008 |
| TC-GOV-OUTBOX-009 | ComplianceConclusionChanged payload snapshot | P0 | conclusion outbox exists | publish compliance event | `ComplianceConclusionChangedPayload` published | artifact/coverage/decision refs only;no AIIA/SoA body | 是 | EV-CAND-GOV-OUTBOX-009 |
| TC-GOV-OUTBOX-010 | NonconformityChanged payload snapshot | P0 | NC/action/verification outbox exists | publish NC event | `NonconformityChangedPayload` published | NC/action/verification refs and states only;no work/evidence body | 是 | EV-CAND-GOV-OUTBOX-010 |
| TC-GOV-OUTBOX-011 | GovernanceTraceAvailable payload snapshot | P0 | trace available outbox exists | publish trace event | `GovernanceTraceAvailablePayload` published | trace refs and optional marker refs only;no observability body | 是 | EV-CAND-GOV-OUTBOX-011 |
| TC-GOV-OUTBOX-012 | DerivedGovernanceViewChanged payload snapshot | P0 | derived view state change outbox exists | publish view event | `DerivedGovernanceViewChangedPayload` published | view ref/freshness/source cursor only;no view body dump | 是 | EV-CAND-GOV-OUTBOX-012 |
| TC-GOV-OUTBOX-013 | publish retryable failure marker | P0 | pending outbox record with stored payload;publisher fails retryably | run `PublishGovernanceOutboxFlow` | outbox state `Failed`;job report partial/failed item | accepted truth unchanged;failure reason redacted;expected version used | 是 | EV-CAND-GOV-OUTBOX-013 |
| TC-GOV-OUTBOX-014 | publish permanent failure dead-letter | P0 | pending/failed record;publisher permanent error | run publisher until fatal classification | outbox state `DeadLettered` or terminal failed by Step 10/12 | duplicate publish does not republish terminal record;truth unchanged | 是 | EV-CAND-GOV-OUTBOX-014 |
| TC-GOV-OUTBOX-015 | parallel publisher single winner | P0 | same pending outbox record version visible to two runners | run two publish attempts | one succeeds;other gets version conflict/partial report | exactly one `Published` marker;no duplicate publication success | 是 | EV-CAND-GOV-OUTBOX-015 |
| TC-GOV-JOB-001 | PublishGovernanceOutbox completed | P0 | pending outbox records with stored payload snapshots | run `PublishGovernanceOutbox` job | all publishable records `Published`;job report `Completed` | report counts scanned/published;no truth write | 是 | EV-CAND-GOV-JOB-001 |
| TC-GOV-JOB-002 | RebuildGovernanceProjections completed | P0 | committed truth snapshot and projection target refs exist | run `RebuildGovernanceProjections` job | selected views replaced;freshness `Fresh`;job report completed | affected dependency index saved;core truth unchanged | 是 | EV-CAND-GOV-JOB-002 |
| TC-GOV-JOB-003 | RefreshExternalContextSnapshots completed/partial | P0 | tracked reference states by scope;resolver fake success/failure mix | run `RefreshExternalContextSnapshots` job | successful refs resolved;failed refs marked unavailable/stale;partial report if needed | last good snapshot preserved;affected views stale from repository | 是 | EV-CAND-GOV-JOB-003 |
| TC-GOV-JOB-004 | RunGovernanceReconciliation clean/finding | P0 | truth/projection/outbox stores seeded clean or drifted | run `RunGovernanceReconciliation` job | reconciliation report `Generated` with clean/finding state | no inline repair;report readable by query | 是 | EV-CAND-GOV-JOB-004 |
| TC-GOV-JOB-005 | PrepareGovernanceTraceHandoff marker | P0 | non-empty trace refs;target enabled | run `PrepareGovernanceTraceHandoff` job | handoff marker `Prepared` or `Failed`;report stored | trace refs non-empty;package/receipt/failure refs only | 是 | EV-CAND-GOV-JOB-005 |
| TC-GOV-JOB-006 | PrepareGovernanceArchiveHandoff body-free | P0 | archive scope expands to trace/report refs;target enabled | run `PrepareGovernanceArchiveHandoff` job | archive handoff marker/report stored | no archive package body;disabled target rejected/failed marker | 是 | EV-CAND-GOV-JOB-006 |
| TC-GOV-JOB-007 | PrepareExternalGrcExport disabled boundary | P0 | external GRC disabled profile | run `PrepareExternalGrcExport` job | job rejected or failed marker by config;core truth unaffected | disabled external GRC does not block core command chain | 是 | EV-CAND-GOV-JOB-007 |
| TC-GOV-JOB-008 | job duplicate replays stored report | P0 | completed job idempotency record points to stored report | rerun same job metadata/digest | `DuplicateReplayed` with stored report | no rescan, publish, rebuild, refresh, handoff or export side effect | 是 | EV-CAND-GOV-JOB-008 |
| TC-GOV-JOB-009 | job invalid input rejected before mutation | P0 | malformed job scope/page/target | run representative job | job disposition `Rejected` | no UoW mutation, marker, report completion or truth write | 是 | EV-CAND-GOV-JOB-009 |
| TC-GOV-JOB-010 | maintenance job no truth repair | P0 | drifted projection/reference/report scenario;truth store write audit enabled | run rebuild/refresh/reconcile/handoff/export jobs | reports/markers/projections update only as designed | no core Governance truth object changes | 是 | EV-CAND-GOV-JOB-010 |

### 8.7 Consistency / idempotency / recovery 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 | 证据候选 ID |
|---|---|---|---|---|---|---|---|---|
| TC-GOV-IDEMP-001 | operation namespace isolation | P0 | same raw idempotency key in command/event/job namespaces | reserve each operation | records do not conflict across namespaces | conflict only within same operation namespace and digest profile | 是 | EV-CAND-GOV-IDEMP-001 |
| TC-GOV-IDEMP-002 | duplicate result missing no recompute | P0 | completed idempotency record points to missing stored result | repeat command/consumer/job | duplicate path returns consistency/dependency error | does not rebuild result from current truth;no new mutation | 是 | EV-CAND-GOV-IDEMP-002 |
| TC-GOV-IDEMP-003 | consumer duplicate receipt replay | P0 | accepted consumer receipt stored | replay same event | duplicate receipt returned | snapshot/reference/stale not rewritten | 是 | EV-CAND-GOV-IDEMP-003 |
| TC-GOV-IDEMP-004 | commit unknown same key recovery | P0 | fake UoW commit returns unknown after possible durable write | retry same command key | service reads idempotency/result/truth state before action | no blind second truth write;unknown marker/dependency surface returned if unresolved | 是 | EV-CAND-GOV-IDEMP-004 |
| TC-GOV-IDEMP-005 | stored result saved before idempotency complete | P0 | result store fails or complete fails injected | run accepted command | rollback or dependency failure | completed idempotency never points to missing result | 是 | EV-CAND-GOV-IDEMP-005 |
| TC-GOV-IDEMP-006 | outbox enqueue failure rolls back truth | P0 | outbox append / payload snapshot save failure | run accepted command reaching outbox append | command fails;transaction rollback | truth/history/trace/stale/result absent after rollback | 是 | EV-CAND-GOV-IDEMP-006 |
| TC-GOV-IDEMP-007 | projection dependency/index only source | P0 | affected view repository and query lookup repository return known refs or missing | run command/consumer/job stale marking and projection-backed queries | stale markers and query view refs only use returned formal refs | no ad hoc `DerivedGovernanceViewRef` construction;missing lookup returns missing projection surface | 是 | EV-CAND-GOV-IDEMP-007 |
| TC-GOV-IDEMP-008 | projection rebuild race preserves newer cursor | P0 | existing view freshness has newer cursor;job holds older cursor | run rebuild replace | older replacement rejected/skipped | newer `Fresh` state not overwritten;failed marker does not clear newer state | 是 | EV-CAND-GOV-IDEMP-008 |
| TC-GOV-IDEMP-009 | reference scope list uses tracked state | P0 | tracked reference states exist;untracked sibling body exists in fake source | run refresh scope | only tracked references are listed/refreshed | no sibling full scan;no body read beyond resolver contract | 是 | EV-CAND-GOV-IDEMP-009 |
| TC-GOV-IDEMP-010 | reference refresh preserves last good snapshot | P0 | resolved snapshot exists;next resolver returns unavailable/digest mismatch | run refresh | state marked unavailable/stale/failed as designed | last good snapshot retained;affected views stale;no body persisted | 是 | EV-CAND-GOV-IDEMP-010 |
| TC-GOV-IDEMP-011 | handoff marker trace refs non-empty | P0 | handoff input with empty trace refs | run trace/archive/export handoff | `DomainError::HandoffMarkerRejected` or job rejected | no marker saved;report records rejected item | 是 | EV-CAND-GOV-IDEMP-011 |
| TC-GOV-IDEMP-012 | external GRC export marker trace first | P0 | external GRC enabled fake;trace ref available | run export job | marker trace appended before export marker/report | empty trace refs rejected;external document body absent | 是 | EV-CAND-GOV-IDEMP-012 |
| TC-GOV-IDEMP-013 | rollback failure surfaces manual intervention | P0 | fake UoW rollback fails | run mutation that must rollback | returns consistency/dependency surface with safe diagnostic ref | no hidden compensating write;redacted issue only | 是 | EV-CAND-GOV-IDEMP-013 |

### 8.8 Config / redaction / dependency 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 | 证据候选 ID |
|---|---|---|---|---|---|---|---|---|
| TC-GOV-CONFIG-001 | P0 profile matrix assembles | P0 | local-dev/ci-test/integration-like/operations-replay config fixtures | run runtime builder for each profile | runtime build `Ready` for valid P0 profiles | required stores/adapters/topics/redaction/clock/id injected;no raw config leak | 是 | EV-CAND-GOV-CONFIG-001 |
| TC-GOV-CONFIG-002 | strict JSON rejects unknown/loose syntax | P0 | config parser fixture | parse JSONC comment/trailing comma/unknown field | config validation fails | no silent fallback to defaults;redacted validation issue | 是 | EV-CAND-GOV-CONFIG-002 |
| TC-GOV-CONFIG-003 | source priority invalid high-priority no fallback | P0 | defaults/file valid;env override invalid | load config | fail-fast/reject current entry | invalid env/job override not ignored;lower priority not used silently | 是 | EV-CAND-GOV-CONFIG-003 |
| TC-GOV-CONFIG-004 | cross-field topic completeness | P0 | outbound event enabled;topic map missing event key | build runtime | runtime build fails | no publisher facade exposed with missing topic binding | 是 | EV-CAND-GOV-CONFIG-004 |
| TC-GOV-CONFIG-005 | profile isolation rejects fake production-like | P0 | future production-like profile fixture selects fake adapter | validate config | config rejected | fake/test fixture cannot enter production semantics | 是 | EV-CAND-GOV-CONFIG-005 |
| TC-GOV-CONFIG-006 | entry-local cannot override truth invariants | P0 | valid startup config;entry-local tries query-write or boundary override | run entry validation | entry rejected | metadata/idempotency/visibility/audit/outbox/query no-write/job no-truth-repair/redaction not configurable | 是 | EV-CAND-GOV-CONFIG-006 |
| TC-GOV-CONFIG-007 | external GRC disabled does not block core truth | P0 | external GRC disabled;core command fixtures valid | run core command chain and export job | core commands succeed;export rejected/disabled marker | external GRC not truth source and not core prerequisite | 是 | EV-CAND-GOV-CONFIG-007 |
| TC-GOV-CONFIG-008 | degraded query no-write with unavailable projection/reference | P0 | projection/reference unavailable;write audit enabled | run representative query | degraded surface returned | no projection rebuild/reference refresh/audit write | 是 | EV-CAND-GOV-CONFIG-008 |
| TC-GOV-REDACTION-001 | logs do not include forbidden body | P0 | run representative command/consumer/job with redaction scan | collect logs | scan passes | no raw request/event/adapter response/external body/secret/stack trace | 是 | EV-CAND-GOV-REDACTION-001 |
| TC-GOV-REDACTION-002 | metrics low-cardinality labels | P0 | metric output fixture | emit operation metrics | labels allowed only from low-cardinality set | no full ref,actor free text,trace id,outbox id,secret or body digest | 是 | EV-CAND-GOV-REDACTION-002 |
| TC-GOV-REDACTION-003 | audit/history/trace refs-only | P0 | accepted mutation + consumer + job fixtures | inspect audit/history/trace records | records contain refs/state/reason/cursor/count only | no sibling body,external response,archive package body | 是 | EV-CAND-GOV-REDACTION-003 |
| TC-GOV-REDACTION-004 | redaction scan blocks raw secret | P0 | artifacts/reports contain injected secret/body fixture | run redaction checker | checker fails with redacted issue ref | failure output does not echo secret/body | 是 | EV-CAND-GOV-REDACTION-004 |
| TC-GOV-ARCH-001 | no non-core sibling compile dependency | P0 | implementation dependency metadata available | run dependency boundary check | check passes only with `L0-core` compile-time upstream | process/work/artifact/etc. only via contracts/events/adapters,not package dependency | 是 | EV-CAND-GOV-ARCH-001 |

### 8.9 设计契约断言矩阵

| 测试用例 | 设计契约 | 字段 / 状态断言 | 负向条件 | 证据候选 ID |
|---|---|---|---|---|
| TC-GOV-CONTRACT-001~004 | `03` Step 8 / 13 protocol and digest | metadata、schema version、idempotency key、canonical digest | missing metadata、unsupported version、same key different digest | EV-CAND-GOV-CONTRACT-* |
| TC-GOV-DOMAIN-001~005 | `03` Step 6 object and policy | object refs、body-free fields、policy guards | invalid invariant、forbidden body、policy reject | EV-CAND-GOV-STATE-* |
| TC-GOV-STATE-001~006 | `03` Step 10 state matrix | formal enum variants and terminal guards | illegal transition, query/job truth repair | EV-CAND-GOV-STATE-* |
| TC-GOV-CMD-001~030 | `03` Step 9 command flows / Step 11 UoW | truth/history/trace/outbox/stale/result order | invalid request、duplicate conflict、version conflict、rollback | EV-CAND-GOV-CMD-* |
| TC-GOV-QUERY-001~016 | `03` Step 9 query template | missing/not-visible/degraded/stale/failed/no-write | query repair/write, visibility leak | EV-CAND-GOV-QUERY-* |
| TC-GOV-CONSUMER-001~012 | `03` Step 9 consumer template / Step 12 error | receipt, snapshot/reference state, worker disposition | unsupported version, forbidden body, source unavailable | EV-CAND-GOV-CONSUMER-* |
| TC-GOV-OUTBOX-001~015 | `03` Step 8 / 11 outbox snapshot | stored payload snapshot, publication state | current truth rebuild, publish failure rollback, duplicate publish | EV-CAND-GOV-OUTBOX-* |
| TC-GOV-JOB-001~010 | `03` Step 9 jobs / Step 13 job replay | job report state, marker refs, no truth repair | invalid input, duplicate rerun, partial failure | EV-CAND-GOV-JOB-* |
| TC-GOV-IDEMP-001~013 | `03` Step 11~13 consistency/idempotency | stored result/report, version, cursor, marker state | missing result recompute, commit unknown blind retry, race overwrite | EV-CAND-GOV-IDEMP-* |
| TC-GOV-CONFIG-001~008 | `04` §12 config gates | profile, strict JSON, source priority, topic completeness, runtime build state | silent fallback, fake production-like, boundary override | EV-CAND-GOV-CONFIG-* |
| TC-GOV-REDACTION-001~004 | `03` Step 15 / `04` no-output | safe logs, low-cardinality metrics, refs-only audit | raw body/secret/full ref leak | EV-CAND-GOV-REDACTION-* |
| TC-GOV-ARCH-001 | `01` dependency boundary / `03` module contract | only `L0-core` compile-time upstream | sibling repo package dependency | EV-CAND-GOV-ARCH-001 |

### 8.10 单测试切口用例停审记录

| 测试切口 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| contracts protocol / metadata / digest | DTO、metadata、schema version、digest 是否有正负用例 | 通过 | 正式 EV 留 Step 13 |
| domain object / policy / state | factory、不变量、policy reject、非法转换是否覆盖 | 通过 | 字段级 fixture 留 Step 7 |
| command orchestration | 23 Command 是否均有主线,共享负向是否覆盖事务/幂等/rollback | 通过 | 每个 Command 的更多边界可在实现侧按风险扩展 |
| query no-write | 14 Query 是否有 hit/no-write/visibility/degraded | 通过 | write audit helper 留 Step 9 |
| inbound consumer | 9 Consumer 是否有 accepted/body-free/duplicate/unsupported/delayed | 通过 | 具体 event fixture 留 Step 7 |
| outbound event / publish | 12 Event 是否有 payload snapshot and no body;publish failure 是否覆盖 | 通过 | topic suite 留 Step 9 |
| operations job | 7 Job 是否有 success/duplicate/partial/no truth repair | 通过 | partial report artifact 留 Step 13 |
| consistency / recovery | duplicate、stored result missing、commit unknown、race、marker guard 是否覆盖 | 通过 | fault injection fixture 留 Step 7 |
| config / redaction / dependency | `04` §12 gates、redaction、dependency boundary 是否覆盖 | 通过 | script names/paths 留 Step 9 |

### 8.11 跨用例断言 / phase 审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 用例是否都有断言点 | 通过 | 所有 TC 均有断言点列 |
| P0 用例是否都有前置条件 | 通过 | 具体 fixture 由 Step 7 细化 |
| 是否只测 happy path | 通过 | 每组均有负向、边界、一致性或恢复用例 |
| 状态 / 错误命名是否使用正式来源 | 通过 | 使用 Step 10 state enum 和 Step 12 error surface |
| 是否提前固定正式 EV / artifact 路径 | 通过 | 仅使用 `EV-CAND-*` |
| 是否把 P1/P2 写成 P0 pass | 通过 | real-like、production-like、capacity 不作为 P0 pass |
| 是否有 query/job 反写真相用例 | 通过 | TC-GOV-QUERY-016、TC-GOV-JOB-010、TC-GOV-IDEMP-* 覆盖 |
| 是否有 redaction / forbidden body 用例 | 通过 | TC-GOV-CMD-030、TC-GOV-CONSUMER-004、TC-GOV-REDACTION-* 覆盖 |
| 是否有 dependency boundary 用例 | 通过 | TC-GOV-ARCH-001 覆盖 |
| 是否有证据 ID 冲突 | 通过 | 当前为候选 ID,无正式冲突 |

## 9. 对上游设计的影响判定

| 用例结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| P0 用例可从 `00/03/04` 和 Step 3~5 推导 | 否 | 测试方案细化 | 无需回写 |
| 每个 P0 切口至少有正向和关键负向 / 边界用例 | 否 | 覆盖闭环 | 无需回写 |
| 用例使用 `EV-CAND-*` 候选证据 ID | 否 | SOP 分工 | Step 13 固定正式 EV |
| 具体 fixture / builder / seed 尚未定义 | 否 | 测试数据设计 | Step 7 承接 |
| write audit helper / redaction checker / dependency check 脚本尚未定义 | 否 | 自动化门禁设计 | Step 9 承接 |
| 若 Step 7 无法构造某用例数据 | 是 | DTO / fixture 可验证性缺口 | 回写 `03` 或记录阻塞 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_06_cases.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“用例批次表”“Contract / domain / state 用例矩阵”“Command 用例矩阵”“Query / inbound consumer 用例矩阵”“Outbound event / operations job 用例矩阵”“Consistency / idempotency / recovery 用例矩阵”和“跨用例断言 / phase 审计表”小节,了解测试场景与用例如何从覆盖矩阵落成可执行断言。

正式 `05-测试方案.md` §6 应回填:

- 测试用例按测试切口组织,不得写成无来源的大表。
- P0 用例覆盖 contracts、domain/state、23 Command、14 Query、9 Consumer、12 Outbound Event、7 Job、一致性 / 幂等 / 恢复、配置、redaction 和 dependency boundary。
- 每个用例必须有前置条件、输入 / 操作、预期结果、断言点、自动化候选和候选证据 ID。
- 用例预期必须引用正式 state enum、protocol surface、worker/job disposition、outbox payload snapshot、stored result/report 或 config gate。
- Query 用例必须覆盖 no-write;Job 用例必须覆盖 no truth repair;Duplicate 用例必须覆盖 stored result/receipt/report replay。
- 外部正文、raw secret、full sensitive ref、sibling truth 和 product-specific body 不得进入 truth、outbox、audit、trace、report、log 或 artifact。
- 本章只使用 `EV-CAND-*` 候选证据 ID。正式 evidence ID、artifact 路径和报告归档规则由 Step 13 固定。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 用例数量较大 | Step 7 数据设计需要按切口组织 fixture / builder | Step 7 分批设计数据 |
| Command 边界用例是否需要每个 Command 单独展开更多负向 | 影响实现侧测试数量 | 当前采用每 Command 主线 + 共享负向;实现侧可按风险扩展 |
| write audit helper 如何实现 | 影响 query no-write / job no truth repair 自动化 | Step 9 固定脚本或 fake repository capability |
| redaction checker 和 dependency boundary check 脚本名称 | 影响 Step 9 / Step 13 evidence | Step 9 固定 |
| 正式 evidence ID 命名 | 影响验收标准引用 | Step 13 固定,当前只保留候选 ID |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 用例可执行、可断言、可留证 | 通过 | 当前 TC 均有前置、操作、预期、断言和候选证据 |
| 每个 P0 测试切口用例已停审 | 通过 | 见 §8.10 |
| 跨用例审计没有 unresolved 冲突 | 通过 | 见 §8.11 |
| 未提前固定正式 evidence / artifact | 通过 | 只使用 `EV-CAND-*` |
| 可进入 Step 7 | 通过 | 下一步设计测试数据;进入前等待用户审查 |
