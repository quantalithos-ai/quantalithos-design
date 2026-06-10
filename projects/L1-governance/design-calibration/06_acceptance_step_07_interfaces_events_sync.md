# Step 7. 定义接口、事件与跨仓同步验收

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 7
> 回填章节: `06-验收标准.md` §7 接口、事件与跨仓同步验收

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 定义接口、事件与跨仓同步验收 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 5 功能门禁;Step 6 数据边界与红线;`01-架构设计.md` §8;`03-详细设计.md` §7 / §8;`04-配置设计.md` §6 / §12;`05-测试方案.md` §6 / §9 / §13 |
| 输出文件 | `projects/L1-governance/design-calibration/06_acceptance_step_07_interfaces_events_sync.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 8 |

## 2. 本步目标

定义 public protocol、事件协作、operations job 和跨仓接缝的验收门禁。

本 Step 只回答:

- 23 个 P0 Command 和 14 个 P0 Query 如何验收。
- 9 个 Inbound Event Consumer 如何证明可消费、可拒绝 unsupported version、可重复回放且不保存外部正文。
- 12 个 Outbound Event 如何证明 stored payload snapshot、topic-neutral key、publisher marker 和 topic completeness。
- 7 个 Operations Job 如何证明 input / report / duplicate replay / partial failure 和 no truth repair。
- 跨仓依赖分别属于编译期依赖、运行期依赖、事件协作 / 追溯交接依赖,还是下游消费 / 运行期提供。
- 下游未就绪时如何以 fake / controlled / disabled seam 判定 P0 接缝通过 / 失败 / residual。

本 Step 不重复字段级 DTO schema,不裁决状态事务细节,不裁决 evidence index 真实性。这些分别由 `03` Step 8 / 9、验收 Step 8 和 Step 10 收口。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_05_function_gate.md` | 已完成 | 提供 AC-GOV-001~015 的功能门禁和接口覆盖范围 |
| `06_acceptance_step_06_data_arch_redlines.md` | 已完成 | 提供数据边界、依赖裁剪和 P1/P2 防污染口径 |
| `01-架构设计.md` §8 | 已完成 | 提供编译期 / 运行期 / 事件协作 / 下游消费依赖类型 |
| `03-详细设计.md` §7 | 已完成 | 提供 Command / Query / Consumer / Event / Job public protocol inventory |
| `03-详细设计.md` §8 | 已完成 | 提供 Command / Query / Consumer / Job / Outbox 函数级处理模板 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 protocol route mapping、topic key、consumer envelope、job request/response 字段级来源 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供 topic-neutral key 到 runtime config binding 的责任边界 |
| `04-配置设计.md` §6 / §12 | 已完成 | 提供 inbound consumer、outbox topic binding、publisher、handoff、external GRC 配置门禁 |
| `05-测试方案.md` §6 / §9 / §13 | 已完成 | 提供 TC-GOV 用例族、P0 suite 和正式 EV-GOV 证据路径 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 Command / Query 如何验收? | Command 按 7 组覆盖 23 个正式协议,必须验证 envelope metadata、idempotency、accepted transaction side effects、stored result 和负向 reject。Query 按 3 组覆盖 14 个正式协议,必须验证 visibility / missing / degraded / stale / failed / empty page 和 no-write。 |
| 每个 P0 Event 如何证明可消费 / 可重放? | 9 个 inbound consumer 必须使用 `GovernanceInboundEventEnvelope<T>`、`GovernanceEventSchemaVersion("v1")`、consumer receipt 和 duplicate replay;unsupported version 不解析 payload、不写 snapshot/stale。12 个 outbound event 必须从 accepted transaction 存储的 outbox payload snapshot 发布,topic-neutral key 必须完整映射。 |
| 每个 P0 Job 如何证明幂等和恢复? | 7 个 job 使用 `GovernanceJobRequest<T>` / `GovernanceJobResponse` / stored job report;duplicate replay 返回 stored report,partial failure 写 report/marker,不得重跑 mutation 或修复业务 truth。 |
| 跨仓同步成功标准是什么? | P0 不要求相邻仓完整实现。成功标准是本仓按正式 ref / snapshot / event / adapter / handoff seam 处理输入输出,保存 receipt/report/marker,并在下游 unavailable / disabled 时给出 delayed/rejected/failed/residual surface。 |
| 下游未就绪时如何验接缝? | 使用 fake / controlled / disabled adapter 证明 P0 语义。运行期来源 unavailable 时进入 degraded / delayed / failed marker;external GRC disabled 时 job rejected 或 skipped with report,不得阻断核心 Governance truth。 |
| 跨仓验收项分别属于编译期依赖、运行期依赖,还是事件协作依赖? | `L0-core` 是唯一编译期依赖;identity/method/process/work/artifact/conversation/runtime/capability/archive 是运行期或事件协作依赖;bus/observability/archive/workspace 是事件协作、handoff 或下游消费依赖;SDK/workspace/console 是下游消费 / 运行期提供。 |
| 每类依赖应使用什么验收证据,而不是误要求源码直接依赖? | 编译期依赖用 dependency-boundary / `EV-GOV-ARCH-001`;运行期依赖用 fake / controlled adapter 和 service/entry suite;事件协作用 consumer/outbox/operations suite;handoff/export 用 job report;下游消费用 query/outbound/read model evidence。 |
| 每个验收项能否回指正式协议字段、状态名和测试证据? | 可以。见 §8.2 接口 / 事件 / 同步验收表和 §8.3 协议闭环矩阵。 |
| 每个接口 / event / job 验收项是否有固定 topic / route / job surface、测试用例、证据 ID 和 report path? | 有。Command/Query 使用 route-neutral protocol names;Outbound 使用 topic-neutral key;Job 使用 job route;transport topic / endpoint 不在 `06` 固定。 |
| 下游未就绪时,接缝验收如何裁决通过 / 失败 / 有条件通过? | P0 fake / controlled / disabled seam 通过即可满足 P0;若 seam 本身不可用则失败;真实下游 unavailable 只进入 residual / risk acceptance,不得计为 P0 passed 或 failed。 |
| 每个接口 / 事件验收项完成后是否通过停审? | 已按协议名、依赖类型、证据、下游未就绪裁决和 P1/P2 防污染停审。见 §8.6。 |
| 所有接口同步验收项完成后是否存在依赖类型误判、下游完整实现误要求、证据缺失或协议名漂移? | 未发现 unresolved 冲突。唯一诊断项是协议校准文件中一处旧描述写 22 Command,正式 `03` 和 protocol inventory 均按 23 Command 执行。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 接口验收未覆盖 Consumer / Outbound / Job / cross-repo dependency type | 重建为 Command / Query / Consumer / Outbound / Job / dependency seam 门禁 |
| `03_ddd_step_08_protocol_contracts.md` §5 | 一处文字写 HLD Step 7 的 22 个 Command | 正式 `03` §7.1 和协议 inventory 均列 23 个 Command;本 Step 按 23 个验收 |
| `03` / `04` | topic-neutral key 与 transport topic binding 分属协议和配置 | 本 Step 只验 topic-neutral key 完整性和 config binding 门禁,不写真实 transport topic |
| Step 6 | 已约束非 core sibling 不可编译期依赖 | 本 Step 把依赖类型映射到验收证据,避免要求下游源码依赖 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 接口范围 | 旧同步 API / 泛化事件 | 23 Command、14 Query、9 Consumer、12 Outbound、7 Job | 承接正式 `03` protocol surface |
| topic 口径 | 容易写成 raw bus topic | 只使用 topic-neutral key,transport binding 由 config evidence 验 | 防止 secret / route 写进验收正文 |
| 跨仓依赖 | 容易误要求源码依赖 | 按 compile/runtime/event/handoff/downstream 类型验接缝 | 执行依赖裁剪 |
| 下游未就绪 | 容易判 P0 不通过或伪通过 | P0 使用 fake/controlled/disabled seam;真实不可用进 residual | 防止 P1/P2 污染 P0 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否为 23+14+9+12+7 每个协议写独立验收项 | A. 每个一项;B. 按协议族分组并列正式清单 | 采用 B。正式清单保证不漏项,分组门禁保证 `06` 可读和可裁决 |
| 是否在验收标准中写 transport topic / HTTP path | A. 写真实 route;B. 只写 protocol name / topic-neutral key / job route | 采用 B。真实 route 属配置 / 部署,且可能敏感 |
| 是否要求下游仓真实实现通过 | A. 要求;B. 只验正式接缝 | 采用 B。仓级 P0 验收不验相邻仓内部 truth |
| 是否把 external GRC export 当 P0 集成成功 | A. 是;B. 否 | 采用 B。P0 只验 disabled/fake/controlled export 不反写真相 |

## 8. 结构化中间产物

### 8.1 跨仓依赖类型与验收方式映射表

| 关联对象 | 全局依赖类型 | 协作方式 | P0 验收方式 | 禁止误判 |
|---|---|---|---|---|
| `L0-core` / core-contracts | 编译期依赖 | shared ID、ActorRef、TraceContext、Error、CloudEvents、metadata | contract compile / dependency-boundary / `EV-GOV-ARCH-001` | 不得复制 core 类型或绕过 shared metadata |
| `L0-bus` | 事件协作依赖 | outbound publish / inbound delivery seam | fake publisher topic map、outbox marker、consumer receipt | 不得把 bus business implementation 写成 compile dependency |
| `L1-identity` | 运行期 + event | actor capability snapshot / consumer | fake resolver / `ConsumeIdentityActorCapabilityChanged` | 不验 identity lifecycle |
| `L1-process` | 运行期 + event | process governance context ref / decision consumption | process context consumer / safe summary / outbox decision event | 不验 ProcessInstance / Activity 内部状态 |
| `L1-work` | 运行期 + event | work governance context ref / policy/control consumption | work context consumer / safe summary / outbox policy/control event | 不验 Project / WorkItem lifecycle |
| `L1-artifact` / `L4-archive` | 运行期 + handoff | artifact/evidence refs、archive handoff | evidence consumer、archive handoff job report | 不保存 artifact/archive body |
| `L1-conversation` / workspace / console | event + downstream consumption | display context、decision view consumption | conversation consumer、query/view surface、outbound event | 不让 UI 状态替代 truth |
| `L3-method-library` | 运行期 + event | method policy/control definition safe summary | method policy/control consumer | 不保存 method/control/standard body |
| `L2-runtime` / capability | runtime feedback + event | runtime signal / capability summary | runtime signal consumer;policy boundary evidence | 不让 runtime cache/tool result 定义 Policy truth |
| `L4-observability` | event + handoff | alert summary input;trace/audit output handoff | alert consumer、trace handoff job | 不拥有 log/metric/trace store body |
| external GRC | outbound export adapter | disabled/fake/controlled export job | external GRC export report / disabled behavior | 不让 external GRC status 定义 Governance truth |

### 8.2 接口 / 事件 / 同步验收表

| 验收项 ID | 接口 / 事件 / 下游 | 全局依赖类型 | 协作方式 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|---|
| AC-GOV-SYNC-001 | 23 Command public protocol | 本仓 public API | `GovernanceCommandRequest<T>` / `GovernanceCommandResponse<T>` | 23 个 Command route-neutral name、metadata、idempotency、accepted side effect、stored result 和 shared negative suite 全部成立 | 缺任一 Command、metadata/digest 缺失、accepted 漏 truth/trace/outbox/result、duplicate 重跑 mutation | `TC-GOV-CMD-001~030`;`EV-GOV-CMD-001`;`reports/runs/<run_id>/suites/service-flow-fast.md` |
| AC-GOV-SYNC-002 | 14 Query public protocol | 本仓 read API | `GovernanceQueryRequest<T>` / query response/page response | 14 个 Query 均返回正式 view surface,覆盖 hit/missing/not-visible/degraded/stale/failed/empty page/no-write | query 写 truth/projection/reference/outbox/report;visibility denied 返回普通 error 或泄露 body | `TC-GOV-QUERY-001~016`;`EV-GOV-QUERY-001`;`reports/runs/<run_id>/suites/service-flow-fast.md` |
| AC-GOV-SYNC-003 | 9 Inbound Event Consumer | event/runtime seam | `GovernanceInboundEventEnvelope<T>` + receipt | 9 个 consumer 支持 v1、accepted snapshot/reference/stale/receipt、duplicate replay、unsupported no-parse/no-write | unsupported version 解析 payload;duplicate 重写;consumer 写 core truth 或保存外部正文 | `TC-GOV-CONSUMER-001~012`;`EV-GOV-CONSUMER-001`;`reports/runs/<run_id>/suites/entry-worker-job.md` |
| AC-GOV-SYNC-004 | 12 Outbound Event | event collaboration | stored outbox payload snapshot + topic-neutral key | 12 个 event kind / payload / topic-neutral key 完整;publisher 只读 stored snapshot;failure 只标 publication state | 事件缺 payload/key;publish 时从 current truth 重算;publisher failure 回滚 accepted truth | `TC-GOV-OUTBOX-001~015`;`EV-GOV-OUTBOX-001`;`reports/runs/<run_id>/suites/operations-replay-core.md` |
| AC-GOV-SYNC-005 | 7 Operations Job | job/handoff/export seam | `GovernanceJobRequest<T>` / `GovernanceJobResponse` | 7 个 job input / report / duplicate replay / partial failure surface 成立;no truth repair | duplicate 重跑;job 修复 business truth;disabled target 仍改 truth;failed item 无 report | `TC-GOV-JOB-001~010`;`EV-GOV-JOB-001`;`reports/runs/<run_id>/suites/operations-replay-core.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` |
| AC-GOV-SYNC-006 | topic / config binding completeness | config + event seam | topic-neutral key -> config transport binding | enabled outbound event keys 均有 binding;optional trace/derived event feature disabled 时不要求 binding | enabled key 缺 binding 仍启动;config 把 transport route 改成 event schema truth | `TC-GOV-CONFIG-001~004`;`EV-GOV-CONFIG-001`;`reports/runs/<run_id>/suites/config-redline.md` |
| AC-GOV-SYNC-007 | cross-repo dependency seam | compile/runtime/event/handoff/downstream | ref / snapshot / adapter / event / handoff | 依赖类型正确;除 `L0-core` 外无 sibling compile dependency;下游未就绪有 delayed/failed/residual surface | 要求直接源码依赖下游;把下游 unavailable 标为 P0 passed;external GRC 定义 truth | `TC-GOV-ARCH-001`;`EV-GOV-ARCH-001`;`reports/runs/<run_id>/dependency-boundary.md`;`EV-GOV-CONSUMER-001`;`EV-GOV-JOB-001` |

### 8.3 协议闭环矩阵

| 验收项 ID | 正式协议 / topic / job | 测试用例 | 证据 ID | report path | 裁决影响 |
|---|---|---|---|---|---|
| AC-GOV-SYNC-001 | `CreateGovernanceContext`;`SubmitGovernanceInput`;`UpdateGovernanceInputState`;`OpenGovernanceGate`;`RecordGovernanceDecision`;`SupersedeGovernanceDecision`;`AssignApprovalResponsibility`;`RecordApprovalVote`;`DelegateApprovalResponsibility`;`ActivatePolicyEffectiveFact`;`UpdatePolicyEffectiveFactState`;`UpdateSharedRuleSet`;`ResolvePolicyConflict`;`AssessControlApplicability`;`RecordControlReview`;`SubmitAIIAConclusion`;`SubmitSoAConclusion`;`ApproveComplianceConclusion`;`RaiseNonconformity`;`ConfirmNonconformityCause`;`PlanCorrectiveAction`;`CompleteCorrectiveAction`;`VerifyNonconformity` | `TC-GOV-CMD-001~030` | `EV-GOV-CMD-001` | `reports/runs/<run_id>/suites/service-flow-fast.md` | 任一 P0 Command 缺失或行为不闭合则不通过 |
| AC-GOV-SYNC-002 | `GetGovernanceContext`;`GetGovernanceInput`;`GetGateDecision`;`ListPendingGovernanceDecisions`;`GetApprovalResponsibility`;`GetPolicyEffectiveView`;`GetPolicyConflict`;`GetControlCoverage`;`GetComplianceConclusion`;`GetNonconformityStatus`;`SearchGovernanceFacts`;`GetGovernanceTrace`;`GetGovernanceDashboard`;`GetGovernanceReconciliationReport` | `TC-GOV-QUERY-001~016` | `EV-GOV-QUERY-001` | `reports/runs/<run_id>/suites/service-flow-fast.md` | query no-write 失败触发不通过,可能触发 VF-GOV-009 |
| AC-GOV-SYNC-003 | `ConsumeIdentityActorCapabilityChanged`;`ConsumeProcessGovernanceContextChanged`;`ConsumeWorkGovernanceContextChanged`;`ConsumeArtifactEvidenceChanged`;`ConsumeMethodPolicyDefinitionChanged`;`ConsumeMethodControlDefinitionChanged`;`ConsumeRuntimeSignalRecorded`;`ConsumeConversationContextChanged`;`ConsumeObservabilityAlertRaised` | `TC-GOV-CONSUMER-001~012` | `EV-GOV-CONSUMER-001` | `reports/runs/<run_id>/suites/entry-worker-job.md` | consumer 写 core truth 或保存正文则不通过,可能触发 VF-GOV-002~004 |
| AC-GOV-SYNC-004 | `governance.context.changed.v1`;`governance.gate.changed.v1`;`governance.decision.changed.v1`;`governance.approval.changed.v1`;`governance.policy.effective.changed.v1`;`governance.shared-rule-set.changed.v1`;`governance.policy-conflict.changed.v1`;`governance.control-applicability.changed.v1`;`governance.compliance-conclusion.changed.v1`;`governance.nonconformity.changed.v1`;`governance.trace.available.v1`;`governance.derived-view.changed.v1` | `TC-GOV-OUTBOX-001~015` | `EV-GOV-OUTBOX-001` | `reports/runs/<run_id>/suites/operations-replay-core.md` | stored payload / topic key / marker 失败则不通过 |
| AC-GOV-SYNC-005 | `PublishGovernanceOutbox`;`RebuildGovernanceProjections`;`RefreshExternalContextSnapshots`;`RunGovernanceReconciliation`;`PrepareGovernanceTraceHandoff`;`PrepareGovernanceArchiveHandoff`;`PrepareExternalGrcExport` | `TC-GOV-JOB-001~010`;`TC-GOV-IDEMP-011~013` | `EV-GOV-JOB-001`;`EV-GOV-IDEMP-001` | `reports/runs/<run_id>/suites/operations-replay-core.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | job 反写真相或 duplicate 失效则不通过,可能触发 VF-GOV-009 |
| AC-GOV-SYNC-006 | enabled event topic-neutral key binding;optional `GovernanceTraceAvailable` / `DerivedGovernanceViewChanged` feature topic binding | `TC-GOV-CONFIG-001~004`;`TC-GOV-OUTBOX-*` | `EV-GOV-CONFIG-001`;`EV-GOV-OUTBOX-001` | `reports/runs/<run_id>/suites/config-redline.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | enabled key 缺 binding 则不进入正式验收 |
| AC-GOV-SYNC-007 | compile/runtime/event/handoff/downstream dependency seam | `TC-GOV-ARCH-001`;`TC-GOV-CONSUMER-*`;`TC-GOV-JOB-*` | `EV-GOV-ARCH-001`;`EV-GOV-CONSUMER-001`;`EV-GOV-JOB-001` | `reports/runs/<run_id>/dependency-boundary.md`;suite reports | 非 core sibling compile dependency 可能触发 VF-GOV-010 |

### 8.4 下游未就绪裁决表

| 场景 | P0 裁决 | 证据要求 | 不允许 |
|---|---|---|---|
| 运行期来源仓不可用 | 通过 degraded / delayed / failed marker 裁决 | fake / controlled adapter failure evidence、consumer receipt/report | 伪造外部 truth 或复制正文 |
| inbound event unsupported version | rejected / dead-letter / no-write 裁决 | `TC-GOV-CONSUMER-010~012`;`EV-GOV-CONSUMER-001` | 解析 payload 后再拒绝 |
| outbound publisher unavailable | accepted truth 不回滚;publication failed/retry/dead-letter marker | `TC-GOV-OUTBOX-013~015`;`EV-GOV-OUTBOX-001` | publisher failure 回滚 truth |
| external GRC disabled | job rejected/skipped/failed with report;core truth unaffected | `TC-GOV-JOB-005~007`;`EV-GOV-JOB-001` | external GRC status 反写 truth |
| real-like / staging-like 未运行 | P0 不受影响;进入 residual | `reports/acceptance/risk-acceptance.md` when relevant | 标成 P0 passed 或 P0 failed |

### 8.5 接口 / 事件验收项停审记录

| 验收项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| AC-GOV-SYNC-001 | Command 协议名是否正式且覆盖 23 个 | 通过 | `03_ddd_step_08_protocol_contracts.md` 一处 22 Command 文字残留不作为正式验收口径 |
| AC-GOV-SYNC-002 | Query no-write / visibility surface 是否固定 | 通过 | Step 8 继续加严状态 / 事务无写审计 |
| AC-GOV-SYNC-003 | Consumer 是否不写 core truth、不保存正文、unsupported no-parse | 通过 | Step 10 继续审计 receipt evidence 和 raw artifact |
| AC-GOV-SYNC-004 | Outbound event 是否有 stored snapshot 和 topic-neutral key | 通过 | transport binding 由 config-redline / Step 9~10 证明 |
| AC-GOV-SYNC-005 | Job input/report/duplicate replay/no truth repair 是否固定 | 通过 | 幂等与事务细节由 Step 8 加严 |
| AC-GOV-SYNC-006 | topic completeness 是否有 config evidence | 通过 | 不写真实 transport topic 或 route secret |
| AC-GOV-SYNC-007 | 跨仓依赖类型是否正确 | 通过 | 不要求下游仓完整实现 |

### 8.6 跨接口同步门禁审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在 P0 public protocol 缺门禁 | 未发现 | 23 Command、14 Query、9 Consumer、12 Event、7 Job 均覆盖 |
| 是否存在依赖类型误判 | 未发现 | 编译期依赖仅 `L0-core`;其余均为 runtime/event/handoff/downstream |
| 是否误要求下游完整实现 | 未发现 | 只验 ref / snapshot / adapter / event / handoff seam |
| 是否存在 topic / route 误写 | 未发现 | 使用 topic-neutral key;transport binding 留配置证据 |
| 是否存在 P1/P2 污染 P0 | 未发现 | real-like/staging-like/external deep integration 留 residual |
| 是否存在证据路径断裂 | 未发现设计层断裂 | 正式验收仍需固定 `<run_id>` 和 evidence index |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_07_interfaces_events_sync.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“跨仓依赖类型与验收方式映射表”“接口 / 事件 / 同步验收表”“协议闭环矩阵”“下游未就绪裁决表”和“跨接口同步门禁审计表”小节,了解接口、事件和跨仓同步验收如何从详细协议、配置、测试证据和依赖裁剪收敛。

正式 `06-验收标准.md` §7 应回填:

- P0 接口验收覆盖 23 个 Command、14 个 Query、9 个 Inbound Event Consumer、12 个 Outbound Event 和 7 个 Operations Job。
- Command 必须证明 metadata、idempotency、accepted transaction side effects、stored result 和负向 reject;Query 必须证明 no-write 和 visibility/degraded surface。
- Consumer 必须证明 v1 envelope、duplicate receipt replay、unsupported version no-parse/no-write、snapshot/reference/stale marker 和 body-free。
- Outbound Event 必须证明 stored payload snapshot、topic-neutral key、topic completeness 和 publisher failure marker;不得发布时从 current truth 重算。
- Job 必须证明 public input、stored report duplicate replay、partial failure、marker/report 写入和 no truth repair。
- 跨仓验收必须区分 compile/runtime/event/handoff/downstream 依赖类型;除 `L0-core` 外不得要求或引入 sibling compile dependency。
- 下游未就绪时 P0 只验 fake / controlled / disabled seam;真实 selected-run 不作为 P0 通过前置。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| `03_ddd_step_08_protocol_contracts.md` 中 “22 个 Command” 文字残留是否后续修正 | 影响文档一致性 | Step 7 按正式 `03` 和 protocol inventory 的 23 个 Command 执行;建议后续校准文档修 typo |
| 是否为每个 outbound topic-neutral key 在正式 `06` 展开全表 | 影响正文长度 | 当前在中间产物展开;正式 `06` 可摘要并引用本文件 |
| P1 real-like selected-run 是否升级为某 release 的强制项 | 影响下游未就绪裁决 | 当前不作为 P0 前置;Step 13 / Step 14 处理 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 接口、事件和同步都有裁决口径 | 通过 | 见 §8.2 / §8.3 |
| 依赖类型已区分 | 通过 | 见 §8.1 |
| 下游未就绪裁决清楚 | 通过 | 见 §8.4 |
| 接口 / 事件验收项已停审 | 通过 | 见 §8.5 |
| 跨接口同步门禁审计无 unresolved 冲突 | 通过 | 见 §8.6 |
| 可进入 Step 8 | 通过 | 下一步定义状态机、事务与一致性验收;进入前等待用户审查 |
