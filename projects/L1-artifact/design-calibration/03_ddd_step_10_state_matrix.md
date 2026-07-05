# Step 10. 状态机与转换矩阵

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 10
> 回填章节: `03-详细设计.md` §9 状态机与转换矩阵
> 生成日期: 2026-07-04
> 状态: 已完成

---

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 状态机与转换矩阵 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | 需求、架构、概要、Step 1~9 详细设计校准文档 |
| 输出文件 | `projects/L1-artifact/design-calibration/03_ddd_step_10_state_matrix.md` |
| 停审方式 | 每个状态机写状态集合、ASCII 图、转换矩阵和停审记录;全部完成后做跨状态机审计 |

---

## 2. 本步目标

本 Step 把 Step 6 的 state enum、Step 6 domain method、Step 8 protocol intent 和 Step 9 function flow 串成可落码的状态矩阵。实现侧只能按本矩阵写状态校验和 transition method;如果 Step 6 / Step 9 与本 Step 冲突,必须先回设计修正,不得由实现侧选边。

本步不定义最终错误 enum 变体名、DDL、optimistic lock SQL、retry 数字、topic 名称、transport route 或实施 commit boundary。非法转换统一先标记为 `ArtifactDomainErrorCode::InvalidStateTransition` 或 `ArtifactApplicationErrorCode::InvariantViolation`;精确错误 taxonomy、API 映射、retry / dead-letter 恢复策略由 Step 12 / Step 13 闭合。

---

## 3. 输入材料

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `02_hld_step_09_state_machine.md` | 已完成 | 提供概要层状态集合和主迁移方向 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供 state enum、object 字段、factory 和 transition method |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供读取面、version source、projection / reference / relay / handoff repository |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 command / query / event / job DTO intent |
| `03_ddd_step_09_function_flows.md` | 已完成 | 提供触发 flow、transaction 边界和副作用 |
| `projects/L1-governance/design-calibration/03_ddd_step_10_state_matrix.md` | 已读取 | 作为状态矩阵粒度、批次和停审组织方式参考 |
| `设计真相源闭环与可落码性标准.md` | 已生效 | 检查状态、字段、DTO、port、flow 是否闭合到可落码 |

---

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前仓有哪些正式状态机? | truth core、boundary / context support、derived / reference / report / handoff / trace、application replay / entry disposition 技术状态。 |
| 每个状态机归属于哪个模块和哪个 Step 6 enum? | §6 批次表逐项列出;状态 enum 必须与 Step 6 §8.2 同名。 |
| 每个状态机的状态集合是什么? | 每个状态机小节的状态集合表逐项给出,不使用全局混表替代。 |
| 哪些函数会触发状态转换? | 每条矩阵行的触发函数必须回指 Step 6 object method、Step 9 flow 或 Step 7 repository marker update。 |
| 每个转换的前置条件、副作用和错误是什么? | 每条矩阵行给出可落码前置条件、状态副作用、flow 副作用和非法错误分类入口。 |
| 非法转换是否写审计? | domain object 不写审计;application accepted path 在状态转换成功后写 record / trace / relay / stored result。非法转换是否写 rejected trace / audit 由 Step 12 闭合。 |
| 每个状态机完成后如何停审? | 每个小节以停审表结束: enum、状态名、触发函数、前置条件、非法转换、副作用、测试切口。 |
| 全部状态机完成后如何审计? | 最终批次做跨状态机命名、触发、错误、测试、reserved 状态和跨状态机副作用审计。 |

---

## 5. 通用状态矩阵规则

| 规则 | 正式口径 |
|---|---|
| 状态名来源 | 必须使用 Step 6 已定义 enum variant;不得在实现中新增同义状态。 |
| trigger 来源 | 必须是 Step 6 object factory / method、Step 9 flow 中已列的 application service 或 Step 7 repository marker update。 |
| 前置条件来源 | 只能引用 loaded truth/support/view、DTO 字段、repository versioned read、resolver outcome、policy guard、stored snapshot 或 job input。 |
| 副作用边界 | domain method 只更新 object 字段;record、trace、relay、derived stale、stored result 由 Step 9 application flow 同事务编排。 |
| 非法转换错误 | domain method 返回 `ArtifactDomainErrorCode::InvalidStateTransition`;application / job 层映射由 Step 12 精确闭合。 |
| terminal 状态 | 标为终态的状态不得再迁移;需要重新处理时必须创建新 truth、new marker 或正式 replacement transition。 |
| query 状态 | query 只能读取并暴露状态;不得在 query path 修复 stale、刷新 snapshot、append trace 或写 projection。 |
| maintenance 状态 | derived/reference/relay/handoff/job report 状态不得反写 Artifact core truth。 |
| version 来源 | 任何 update existing state 的写路径必须使用 Step 7 / Step 11 正式 versioned read/list 来源。 |
| reserved 转换 | 若状态或迁移仅为后续阶段预留,必须写 `reserved` 且当前 flow 不调用。 |

---

## 6. 状态矩阵批次表

| 批次 | 状态机 | 所属模块 | 状态 enum | 主要触发 flow / 函数 | 停审状态 |
|---|---|---|---|---|---|
| 10.1 | ArtifactFact | domain truth | `ArtifactFactState` | `EstablishArtifactFactFlow`;future suspend/close flow | 已完成 |
| 10.1 | ArtifactContentFactContext | domain truth support | `ArtifactContentFactContextState` | `EstablishArtifactFactFlow`;consumer/reference refresh | 已完成 |
| 10.1 | ArtifactVersion | domain truth | `ArtifactVersionState` | `PublishArtifactVersionFlow`;`SupersedeArtifactVersionFlow`;future freeze/retire | 已完成 |
| 10.1 | ArtifactVersionCandidate | domain truth support | `ArtifactVersionCandidateState` | `CreateArtifactVersionCandidateFlow`;`PublishArtifactVersionFlow`;future reject/supersede | 已完成 |
| 10.1 | ArtifactLineageLink | domain truth | `ArtifactLineageState` | `EstablishArtifactLineageLinkFlow`;`RejectArtifactLineageLinkFlow`;future retire | 已完成 |
| 10.1 | ArtifactBaseline | domain truth | `ArtifactBaselineState` | `CreateArtifactBaselineCandidateFlow`;`FreezeArtifactBaselineFlow`;`SupersedeArtifactBaselineFlow`;future retire | 已完成 |
| 10.1 | ArtifactBaselineMembership | domain truth support | `ArtifactBaselineMembershipState` | `CreateArtifactBaselineCandidateFlow`;`FreezeArtifactBaselineFlow`;future remove | 已完成 |
| 10.2 | ArtifactIntakeContext | domain boundary | `ArtifactIntakeState` | `RegisterArtifactIntakeFlow`;`EstablishArtifactFactFlow` | 已完成 |
| 10.2 | ArtifactSubmissionRecord | domain boundary | `ArtifactSubmissionState` | `RegisterArtifactIntakeFlow`;candidate flow precheck | 已完成 |
| 10.2 | ArtifactReviewAnchor | domain boundary | `ArtifactReviewState` | `OpenArtifactReviewAnchorFlow`;`AssignArtifactResponsibilityFlow`;future close/invalidate | 已完成 |
| 10.2 | ArtifactResponsibilityAssignment | domain boundary | `ArtifactResponsibilityAssignmentState` | `AssignArtifactResponsibilityFlow`;future accept/release/invalidate | 已完成 |
| 10.2 | AutomationArtifactInput | domain boundary | `AutomationArtifactInputState` | `RegisterAutomationArtifactInputFlow`;`AcceptAutomationArtifactInputFlow`;future review/reject/supersede | 已完成 |
| 10.2 | ConsumableArtifactReference | domain consumption | `ConsumableArtifactReferenceState` | `IssueConsumableArtifactReferenceFlow`;future restrict/stale/unavailable | 已完成 |
| 10.2 | ArtifactConsumptionBackref | domain consumption | `ArtifactConsumptionBackrefState` | `RecordArtifactConsumptionBackrefFlow`;future stale/retire | 已完成 |
| 10.3 | summary / read / preview / report views | contracts view | `ArtifactSummaryViewState` / `ArtifactReadSurfaceState` / `ArtifactPreviewState` / `ArtifactReportState` | rebuild job / query exposure | 已完成 |
| 10.3 | ArtifactDerivedViewState | domain derived | `ArtifactDerivedFreshnessState` / `ArtifactDerivedJobOutcome` | rebuild / refresh / reconciliation / handoff jobs | 已完成 |
| 10.3 | ExternalReferenceResolutionState | domain reference | `ArtifactExternalResolutionState` | inbound consumers / refresh job | 已完成 |
| 10.3 | ArtifactReconciliationReport | contracts report | `ArtifactReconciliationState` | reconciliation job | 已完成 |
| 10.3 | trace / handoff / mirror records | domain record | `ArtifactTraceState` / `ArtifactHandoffState` / `ArtifactMirrorRefreshState` | backref / handoff / refresh flows | 已完成 |
| 10.4 | application replay / entry disposition | application / api / worker / jobs | `ArtifactInboundDisposition` / `ArtifactJobOutcome` / idempotency reservation states | command / consumer / job shared templates | 已完成 |
| 10.5 | final audit | cross-step | all states | naming / trigger / test audit | 已完成 |

---

## 7. 状态机写法模板

```text
[StateMachineName]
  StateA -> StateB -> StateC
  StateA -> TerminalX
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|

---

## 8. domain truth core 状态矩阵

### 8.1 `ArtifactFactState`

```text
[ArtifactFact]
  PendingIntake -> Established
  Established -> Suspended
  Established -> Closed
  Suspended -> Closed
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `PendingIntake` | fact skeleton 已创建但尚未正式成立 | 否 | `establish` |
| `Established` | formal artifact fact 已成立 | 否 | `bind_current_version`, `suspend`, `close` |
| `Suspended` | fact 暂停演化但追溯保留 | 否 | `close`;future resume 需设计回开 |
| `Closed` | fact 不再继续演化 | 是 | query / trace read only |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `PendingIntake` | `ArtifactFact::new_pending(...)` | `EstablishArtifactFactFlow` | intake transferred-ready, content context formal, definition ref formal | set `fact_state = PendingIntake`, `current_version_ref = None` | staged before same-flow establish | `MissingRequiredReference` |
| `PendingIntake` | `Established` | `ArtifactFact::establish()` | `EstablishArtifactFactFlow` | fact policy accepted;no duplicate truth anchor | set `fact_state = Established` | fact save, fact change record, relay, stored result | `InvalidStateTransition` |
| `Established` | `Established` | `bind_current_version(version_ref)` | `PublishArtifactVersionFlow`;`SupersedeArtifactVersionFlow` | loaded formal version belongs to same fact | update `current_version_ref` | version save/change, fact save, relay | `InvalidStateTransition` / `MissingRequiredReference` |
| `Established` | `Suspended` | `suspend(reason)` | reserved future command | formal suspend reason | set `fact_state = Suspended` | fact change record / relay when future flow exists | `InvalidStateTransition` |
| `Established` | `Closed` | `close(reason)` | reserved future command | formal close reason | set `fact_state = Closed` | fact change record / relay when future flow exists | `InvalidStateTransition` |
| `Suspended` | `Closed` | `close(reason)` | reserved future command | formal close reason | set `fact_state = Closed` | fact change record / relay when future flow exists | `InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 与 Step 6 一致 | 通过 | 无 |
| Step 9 触发闭口 | 通过 | establish / bind current 已闭口; suspend / close reserved |
| terminal 规则 | 通过 | `Closed` 终态 |
| query no-write | 通过 | query 只能读取 fact state |

### 8.2 `ArtifactContentFactContextState`

```text
[ArtifactContentFactContext]
  Linked -> Verified
  Linked -> PendingCheck
  PendingCheck -> Verified
  Linked -> Unavailable
  PendingCheck -> Unavailable
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Linked` | 已有 body-free content source link | 否 | `verify_source`, `mark_pending_check`, `mark_unavailable` |
| `PendingCheck` | 来源需要进一步校验 | 否 | `verify_source`, `mark_unavailable` |
| `Verified` | 来源 digest / summary 已验证 | 否 | query/read;future stale check may reopen Step 10 |
| `Unavailable` | 来源不可用 | 是 | query degraded / write rejection only |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Linked` | `ArtifactContentFactContext::from_source(...)` | `EstablishArtifactFactFlow` | accepted source ref | set linked state | content context save | `MissingRequiredReference` |
| `Linked` | `Verified` | `verify_source(source_digest)` | reserved resolver-backed command/job | formal digest available | set digest, state verified | refresh / audit per future flow | `InvalidStateTransition` |
| `Linked` | `PendingCheck` | `mark_pending_check(reason)` | reserved reference check flow | check reason formal | state pending check | no truth mutation | `InvalidStateTransition` |
| `PendingCheck` | `Verified` | `verify_source(source_digest)` | reserved resolver-backed command/job | digest available | set digest, state verified | refresh record | `InvalidStateTransition` |
| `Linked` / `PendingCheck` | `Unavailable` | `mark_unavailable(reason)` | consumer / refresh-derived future flow | unavailable reason formal | state unavailable | degraded query surface;no fact mutation | `InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| external body boundary | 通过 | 状态只保存 ref/digest |
| terminal 规则 | 通过 | `Unavailable` 终态 for current context |
| write guard | 通过 | unavailable content cannot enter truth write |

### 8.3 `ArtifactVersionState`

```text
[ArtifactVersion]
  Candidate -> Published
  Published -> Superseded
  Published -> Frozen
  Published -> Retired
  Frozen -> Retired
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Candidate` | formal version object 已从 candidate 创建但未发布 | 否 | `publish` |
| `Published` | formal version 可作为 current / lineage / baseline member | 否 | `supersede`, `freeze`, `retire` |
| `Superseded` | 被后续 formal version 显式替代 | 是 | read / trace only |
| `Frozen` | 已进入 baseline / release-like 受控语境 | 否 | `retire` |
| `Retired` | 退出主链 | 是 | read / trace only |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Candidate` | `ArtifactVersion::from_candidate(...)` | `PublishArtifactVersionFlow` | loaded candidate ready and same fact | set candidate state | version staged before publish | `MissingRequiredReference` |
| `Candidate` | `Published` | `publish()` | `PublishArtifactVersionFlow` | version policy accepted | set published | version save, version change record, fact current bind, relay | `InvalidStateTransition` |
| `Published` | `Superseded` | `supersede(prior_version_ref)` on next version or reserved current marker update | `SupersedeArtifactVersionFlow` | current and next same fact;prior not self | write `supersedes_version_ref` on next;current preservation per Step 9 | version/fact save, change record, relay | `InvalidStateTransition` |
| `Published` | `Frozen` | `freeze()` | reserved baseline freeze integration | version selected into frozen baseline | set frozen | baseline flow may call in future only if Step 9 is updated | `InvalidStateTransition` |
| `Published` / `Frozen` | `Retired` | `retire(reason)` | reserved future command | formal retire reason | set retired | version change record / relay in future flow | `InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| candidate vs formal version | 通过 | `ArtifactVersionCandidate` 与 `ArtifactVersion` 分离 |
| current binding | 通过 | fact owner controls `current_version_ref` |
| terminal 规则 | 通过 | `Superseded` / `Retired` 终态 |
| reserved 转换 | 通过 | freeze / retire 后续 flow 才能调用 |

### 8.4 `ArtifactVersionCandidateState`

```text
[ArtifactVersionCandidate]
  Open -> ReadyToPublish
  Open -> Rejected
  Open -> Superseded
  ReadyToPublish -> Rejected
  ReadyToPublish -> Superseded
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Open` | 候选修订已记录 | 否 | `mark_ready`, `reject`, `supersede_by` |
| `ReadyToPublish` | 可被 publish flow 消费 | 否 | publish precondition, `reject`, `supersede_by` |
| `Rejected` | 候选被拒绝 | 是 | read only |
| `Superseded` | 被新候选替代 | 是 | read only |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Open` | `ArtifactVersionCandidate::from_submission(...)` | `CreateArtifactVersionCandidateFlow` | accepted submission ref and formal fact/content | set open | candidate save, stored result | `MissingRequiredReference` |
| `Open` | `ReadyToPublish` | `mark_ready()` | `CreateArtifactVersionCandidateFlow` optional branch | publish evidence already complete | set ready | candidate save | `InvalidStateTransition` |
| `Open` / `ReadyToPublish` | `Rejected` | `reject(reason)` | reserved future command | formal reject reason | set rejected | stored rejection / audit in future flow | `InvalidStateTransition` |
| `Open` / `ReadyToPublish` | `Superseded` | `supersede_by(next_candidate_ref)` | reserved future command | next candidate exists and not self | set superseded | candidate save in future flow | `InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| `submission_ref` 来源 | 通过 | Step 9 已回补 Step 7/8 |
| publish precondition | 通过 | publish requires `ReadyToPublish` |
| terminal 规则 | 通过 | rejected/superseded 终态 |

### 8.5 `ArtifactLineageState`

```text
[ArtifactLineageLink]
  PendingBasis -> Established
  PendingBasis -> Rejected
  Established -> Retired
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `PendingBasis` | lineage skeleton 已创建但 basis 未成立 | 否 | `establish`, `reject` |
| `Established` | formal lineage relation 有效 | 否 | `retire` |
| `Rejected` | lineage 被拒绝 | 是 | read only |
| `Retired` | relation 退出当前有效视图 | 是 | read only |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `PendingBasis` | `ArtifactLineageLink::connect(...)` | `EstablishArtifactLineageLinkFlow` | source/target formal versions and basis ref | set pending | staged before establish | `MissingRequiredReference` |
| `PendingBasis` | `Established` | `establish()` | `EstablishArtifactLineageLinkFlow` | lineage policy accepted | set established | lineage save, change record, relay | `InvalidStateTransition` |
| `PendingBasis` | `Rejected` | `reject(reason)` | `RejectArtifactLineageLinkFlow` | formal reject reason | set rejected | lineage save, change record, relay | `InvalidStateTransition` |
| `Established` | `Retired` | `retire(reason)` | reserved future command | formal retire reason | set retired | lineage change / relay in future flow | `InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| formal version-only | 通过 | policy forbids candidate / content shortcut |
| reject path | 通过 | current flow rejects pending relation; established retire reserved |
| terminal 规则 | 通过 | rejected/retired 终态 |

### 8.6 `ArtifactBaselineState`

```text
[ArtifactBaseline]
  Candidate -> Frozen
  Frozen -> Superseded
  Candidate -> Retired
  Frozen -> Retired
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Candidate` | baseline candidate 和 membership refs 已显式保存 | 否 | `freeze`, `retire` |
| `Frozen` | controlled frozen set 正式生效 | 否 | `supersede`, `retire` |
| `Superseded` | 被后续 baseline 替代 | 是 | read only |
| `Retired` | 退出主链 | 是 | read only |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Candidate` | `ArtifactBaseline::from_members(...)` | `CreateArtifactBaselineCandidateFlow` | non-empty ordered unique formal memberships | `freeze_context_ref = None` | baseline/membership save, stored result | `MissingRequiredReference` |
| `Candidate` | `Frozen` | `freeze(freeze_context_ref)` | `FreezeArtifactBaselineFlow` | review anchor ready;all memberships formal and selected | set state frozen and `freeze_context_ref = Some(...)` | membership freeze, change record, relay | `InvalidStateTransition` |
| `Frozen` | `Superseded` | `supersede()` | `SupersedeArtifactBaselineFlow` | next baseline same scope and suitable | set superseded | baseline save, change record, relay | `InvalidStateTransition` |
| `Candidate` / `Frozen` | `Retired` | `retire(reason)` | reserved future command | formal retire reason | set retired | baseline change / relay in future flow | `InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| freeze context lifecycle | 通过 | candidate None, frozen Some |
| dynamic current version forbidden | 通过 | membership refs explicit |
| terminal 规则 | 通过 | superseded/retired 终态 |

### 8.7 `ArtifactBaselineMembershipState`

```text
[ArtifactBaselineMembership]
  Selected -> Frozen
  Selected -> Removed
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Selected` | formal version 被选入 candidate baseline | 否 | `freeze_member`, `remove` |
| `Frozen` | member 已随 baseline 冻结 | 是 | read only |
| `Removed` | 冻结前移出 | 是 | read only |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Selected` | `ArtifactBaselineMembership::select(...)` | `CreateArtifactBaselineCandidateFlow` | member version is formal;baseline candidate ref exists in same transaction | set selected | membership save | `MissingRequiredReference` |
| `Selected` | `Frozen` | `freeze_member()` | `FreezeArtifactBaselineFlow` | owning baseline freezes in same transaction | set frozen | membership save with expected version | `InvalidStateTransition` |
| `Selected` | `Removed` | `remove(reason)` | reserved future command | baseline still candidate | set removed | membership save in future flow | `InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| member formal version-only | 通过 | policy enforces formal version |
| frozen immutability | 通过 | frozen terminal |
| removed restore | 通过 | restore requires new membership |

### 8.8 10.1 stop-review

| 检查项 | 结论 |
|---|---|
| truth core 7 个状态机是否覆盖 | 是 |
| 状态名是否全部来自 Step 6 | 是 |
| Step 9 已实现 flow 是否均有矩阵行 | 是 |
| reserved transition 是否标明 | 是 |
| terminal 状态是否明确 | 是 |
| baseline Step 9 修正是否进入矩阵 | 是,candidate `freeze_context_ref = None`,freeze 绑定 review anchor |

---

## 9. domain boundary / context support 状态矩阵

### 9.1 `ArtifactIntakeState`

```text
[ArtifactIntakeContext]
  Received -> Resolved -> Transferred
  Received -> PendingReference -> Resolved
  Received -> Rejected
  PendingReference -> Rejected
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Received` | intake context 已从 source 建立 | 否 | `resolve_source`, `mark_pending_reference`, `reject` |
| `Resolved` | source 已达到可进入 truth write 的最小门槛 | 否 | `transfer_to_truth_write`, `reject` |
| `PendingReference` | 依赖外部引用解析 | 否 | `resolve_source`, `reject` |
| `Rejected` | intake 越界或不可用 | 是 | read / audit only |
| `Transferred` | 已交给 truth write path | 是 | read / audit only |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Received` | `ArtifactIntakeContext::from_source(...)` | `RegisterArtifactIntakeFlow` | source ref and intake kind valid | set received | intake save, submission record | `MissingRequiredReference` |
| `Received` / `PendingReference` | `Resolved` | `resolve_source(source_ref)` | `RegisterArtifactIntakeFlow`;consumer refresh continuation | resolver outcome resolved | update source ref and state | resolution record / receipt | `InvalidStateTransition` |
| `Received` | `PendingReference` | `mark_pending_reference(resolution_ref)` | `RegisterArtifactIntakeFlow` | resolver unresolved or delayed | set pending reference | resolution state/record, stored result | `InvalidStateTransition` |
| `Received` / `PendingReference` | `Rejected` | `reject(reason)` | reserved future rejection branch | formal reject reason | set rejected | input resolution record | `InvalidStateTransition` |
| `Resolved` | `Transferred` | `transfer_to_truth_write()` | `EstablishArtifactFactFlow` | fact policy accepted and submission acceptable | set transferred | fact/content save, fact change, relay | `InvalidStateTransition` |

### 9.2 `ArtifactSubmissionState`

```text
[ArtifactSubmissionRecord]
  Received -> Accepted
  Received -> Rejected
  Received -> Superseded
  Accepted -> Superseded
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Received` | submission 已记录 | 否 | `accept`, `reject`, `supersede` |
| `Accepted` | submission 可作为 candidate 来源 | 否 | `supersede` only when replacement is formal |
| `Rejected` | submission 被拒绝 | 是 | read only |
| `Superseded` | submission 被后续提交替代 | 是 | read only |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Received` | `ArtifactSubmissionRecord::record(...)` | `RegisterArtifactIntakeFlow` | intake context ref and source ref valid | set received | submission save | `MissingRequiredReference` |
| `Received` | `Accepted` | `accept()` | `RegisterArtifactIntakeFlow` | intake resolved or minimally acceptable | set accepted | result carries submission ref | `InvalidStateTransition` |
| `Received` | `Rejected` | `reject(reason)` | reserved future branch | formal reject reason | set rejected | resolution/audit record | `InvalidStateTransition` |
| `Received` / `Accepted` | `Superseded` | `supersede(next_submission_ref)` | reserved future branch | next submission exists and not self | set superseded | submission save | `InvalidStateTransition` |

### 9.3 `ArtifactReviewState`

```text
[ArtifactReviewAnchor]
  Draft -> Ready
  Ready -> PendingResponsibility
  Ready -> Closed
  PendingResponsibility -> Closed
  Draft -> Invalid
  Ready -> Invalid
  PendingResponsibility -> Invalid
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Draft` | review anchor 已创建但未 ready | 否 | `mark_ready`, `invalidate` |
| `Ready` | review 可用于 freeze / responsibility / query | 否 | `wait_responsibility`, `close`, `invalidate` |
| `PendingResponsibility` | review 已绑定责任语境 | 否 | `close`, `invalidate` |
| `Closed` | review closed | 是 | read only |
| `Invalid` | review 不再有效 | 是 | read only |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Draft` | `ArtifactReviewAnchor::from_truth_anchor(...)` | `OpenArtifactReviewAnchorFlow` | formal truth anchor and reason | set draft | review staged before ready | `MissingRequiredReference` |
| `Draft` | `Ready` | `mark_ready()` | `OpenArtifactReviewAnchorFlow` | review anchor formal | set ready | review trace, relay, stored result | `InvalidStateTransition` |
| `Ready` | `PendingResponsibility` | `wait_responsibility(assignment_ref)` | `AssignArtifactResponsibilityFlow` | assignment saved in same transaction | set assignment ref and pending responsibility | assignment save, review trace, relay | `InvalidStateTransition` |
| `Ready` / `PendingResponsibility` | `Closed` | `close(reason)` | reserved future command | close reason formal | set closed | review trace / relay in future flow | `InvalidStateTransition` |
| `Draft` / `Ready` / `PendingResponsibility` | `Invalid` | `invalidate(reason)` | reserved future command | invalid reason formal | set invalid | review trace / relay in future flow | `InvalidStateTransition` |

### 9.4 `ArtifactResponsibilityAssignmentState`

```text
[ArtifactResponsibilityAssignment]
  Pending -> Assigned -> Accepted
  Pending -> Invalid
  Assigned -> Released
  Assigned -> Invalid
  Accepted -> Released
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Pending` | responsibility skeleton 已创建 | 否 | `assign`, `invalidate` |
| `Assigned` | 已正式指派责任方 | 否 | `accept`, `release`, `invalidate` |
| `Accepted` | 责任方已接受 | 否 | `release` |
| `Released` | 责任释放 | 是 | read only |
| `Invalid` | 责任语境无效 | 是 | read only |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Pending` | `from_review_anchor(...)` | `AssignArtifactResponsibilityFlow` | review ready and actor/basis formal | set pending | assignment staged before assign | `MissingRequiredReference` |
| `Pending` | `Assigned` | `assign()` | `AssignArtifactResponsibilityFlow` | actor formal | set assigned | assignment save, review wait responsibility | `InvalidStateTransition` |
| `Assigned` | `Accepted` | `accept()` | reserved future command | responsible party acceptance | set accepted | review trace in future flow | `InvalidStateTransition` |
| `Assigned` / `Accepted` | `Released` | `release(reason)` | reserved future command | release reason formal | set released | assignment trace in future flow | `InvalidStateTransition` |
| `Pending` / `Assigned` | `Invalid` | `invalidate(reason)` | reserved future command | invalid reason formal | set invalid | assignment trace in future flow | `InvalidStateTransition` |

### 9.5 `AutomationArtifactInputState`

```text
[AutomationArtifactInput]
  Received -> Accepted
  Received -> PendingReview
  Received -> Rejected
  Received -> Superseded
  PendingReview -> Accepted
  PendingReview -> Rejected
  Accepted -> Superseded
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Received` | automation candidate input 已登记 | 否 | `accept`, `send_to_review`, `reject`, `supersede` |
| `Accepted` | 已进入正式收束链 | 否 | `supersede` only |
| `PendingReview` | 需要 review | 否 | `accept`, `reject` |
| `Rejected` | 自动化输入拒绝 | 是 | read only |
| `Superseded` | 被新 automation input 替代 | 是 | read only |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Received` | `AutomationArtifactInput::from_source(...)` | `RegisterAutomationArtifactInputFlow` | automation source resolved and formal truth anchor exists | set received | automation save, audit record | `MissingRequiredReference` |
| `Received` / `PendingReview` | `Accepted` | `accept()` | `AcceptAutomationArtifactInputFlow` | intake context valid and candidate-only policy accepted | set accepted | automation save, audit record | `InvalidStateTransition` |
| `Received` | `PendingReview` | `send_to_review()` | reserved future flow | review required | set pending review | audit record | `InvalidStateTransition` |
| `Received` / `PendingReview` | `Rejected` | `reject(reason)` | reserved future flow | reject reason formal | set rejected | audit record | `InvalidStateTransition` |
| `Received` / `Accepted` | `Superseded` | `supersede(next_input_ref)` | reserved future flow | next input exists and not self | set superseded | audit record | `InvalidStateTransition` |

### 9.6 `ConsumableArtifactReferenceState`

```text
[ConsumableArtifactReference]
  Ready -> Restricted
  Ready -> Stale
  Ready -> Unavailable
  Stale -> Ready
  Stale -> Unavailable
  Restricted -> Ready
  Restricted -> Unavailable
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Ready` | 可被授权 read / handoff 使用 | 否 | `restrict`, `mark_stale`, `mark_unavailable` |
| `Restricted` | 当前不可直接输出 | 否 | future release-to-ready, `mark_unavailable` |
| `Stale` | 需要刷新 read surface / traceability | 否 | future refresh-to-ready, `mark_unavailable` |
| `Unavailable` | 暂不可用 | 是 | read degraded only |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Ready` | `from_anchor(...)` | `IssueConsumableArtifactReferenceFlow` | formal truth anchor and consumer scope | set ready | consumable save, relay | `MissingRequiredReference` |
| `Ready` | `Restricted` | `restrict(reason)` | reserved future command/job | restriction reason formal | set restricted | relay in future flow | `InvalidStateTransition` |
| `Ready` | `Stale` | `mark_stale(reason)` | reserved stale marker flow | stale reason formal | set stale | degraded query surface | `InvalidStateTransition` |
| `Ready` / `Stale` / `Restricted` | `Unavailable` | `mark_unavailable(reason)` | reserved future command/job | unavailable reason formal | set unavailable | relay in future flow | `InvalidStateTransition` |
| `Stale` / `Restricted` | `Ready` | reserved release/refresh helper | reserved future flow | formal refreshed / release proof | set ready | relay in future flow | `InvalidStateTransition` |

### 9.7 `ArtifactConsumptionBackrefState`

```text
[ArtifactConsumptionBackref]
  Recorded -> Explained
  Recorded -> Stale
  Explained -> Stale
  Recorded -> Retired
  Explained -> Retired
  Stale -> Retired
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Recorded` | backref 已记录但 trace 可能尚未解释 | 否 | `mark_explained`, `mark_stale`, `retire` |
| `Explained` | 已关联正式 trace | 否 | `mark_stale`, `retire` |
| `Stale` | 依赖 truth 过期 | 否 | `retire` |
| `Retired` | 退出当前消费视图 | 是 | read only |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Recorded` | `ArtifactConsumptionBackref::record(...)` | `RecordArtifactConsumptionBackrefFlow` | consumable ready/visible and reason formal | set recorded | backref staged | `MissingRequiredReference` |
| `Recorded` | `Explained` | `mark_explained(trace_ref)` | `RecordArtifactConsumptionBackrefFlow` | trace appended in same transaction | set trace ref and explained | trace append, relay | `InvalidStateTransition` |
| `Recorded` / `Explained` | `Stale` | `mark_stale(reason)` | reserved stale marker flow | stale reason formal | set stale | degraded query / handoff report | `InvalidStateTransition` |
| `Recorded` / `Explained` / `Stale` | `Retired` | `retire(reason)` | reserved future command | retire reason formal | set retired | trace / report in future flow | `InvalidStateTransition` |

### 9.8 10.2 stop-review

| 检查项 | 结论 |
|---|---|
| boundary / support 7 个状态机是否覆盖 | 是 |
| support state 是否不替代 truth state | 是 |
| automation candidate-only 是否保持 | 是 |
| query 是否能写 backref/consumable | 否 |
| terminal 状态是否明确 | 是 |
| reserved 转换是否标明 | 是 |

---

## 10. derived / reference / report / handoff 状态矩阵

### 10.1 View surface states

本节覆盖 `ArtifactSummaryViewState`、`ArtifactReadSurfaceState`、`ArtifactPreviewState` 和 `ArtifactReportState`。这些状态归 read/projection surface,只由 rebuild / refresh / handoff preparation flow 更新,query 只能读取。

| Enum | 状态 | 作用 | 是否终态 | 允许更新方 |
|---|---|---|---|---|
| `ArtifactSummaryViewState` | `Ready` | summary 可读 | 否 | rebuild job |
| `ArtifactSummaryViewState` | `Stale` | summary 落后 truth cursor | 否 | accepted command stale marker / rebuild job |
| `ArtifactSummaryViewState` | `Unavailable` | summary 当前不可用 | 否 | rebuild job failure path |
| `ArtifactReadSurfaceState` | `Ready` | read surface 可授权读取 | 否 | rebuild / sync job |
| `ArtifactReadSurfaceState` | `Restricted` | read surface 不可直接输出 | 否 | visibility / policy maintenance |
| `ArtifactReadSurfaceState` | `Stale` | read surface 需刷新 | 否 | accepted truth/reference change |
| `ArtifactReadSurfaceState` | `Unavailable` | read surface 不可用 | 否 | rebuild failure |
| `ArtifactPreviewState` | `Ready` | preview 可读 | 否 | rebuild job |
| `ArtifactPreviewState` | `Stale` | preview 需刷新 | 否 | accepted truth/reference change |
| `ArtifactPreviewState` | `Rebuilding` | preview 正在重建 | 否 | rebuild job |
| `ArtifactPreviewState` | `Unavailable` | preview 不可用 | 否 | rebuild failure |
| `ArtifactReportState` | `Ready` | report 可读 | 否 | report/rebuild job |
| `ArtifactReportState` | `Stale` | report 需刷新 | 否 | accepted truth/reference change |
| `ArtifactReportState` | `Generating` | report 正在生成 | 否 | job |
| `ArtifactReportState` | `Unavailable` | report 不可用 | 否 | job failure |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Ready` | `from_fields(..., state = Ready)` | `RebuildArtifactDerivedViewsFlow` | body-free snapshot available | view state ready | view save, job report | `InvariantViolation` |
| `Ready` | `Stale` | `from_fields(..., state = Stale)` or view rebuild stale save | accepted command/job stale marker | truth/reference cursor newer than view cursor | state stale | query freshness degraded | `InvariantViolation` |
| `Stale` / `Unavailable` / `Rebuilding` / `Generating` | `Ready` | `from_fields(..., state = Ready)` | `RebuildArtifactDerivedViewsFlow` | rebuild successful | state ready | view save, derived state fresh | `InvariantViolation` |
| `Ready` / `Stale` | `Rebuilding` / `Generating` | view-specific rebuild start | `RebuildArtifactDerivedViewsFlow` | job accepted | state rebuilding/generating | job report in progress | `InvariantViolation` |
| any non-terminal | `Unavailable` | view-specific failure mapping | rebuild/report failure | failure reason formal | state unavailable | degraded query surface | `InvariantViolation` |
| `Ready` / `Stale` | `Restricted` | read surface restriction helper | reserved policy maintenance | restriction reason formal | surface restricted | query not-visible / restricted | `InvariantViolation` |

View surface red lines:

- View state never changes `ArtifactFactState` or `ArtifactVersionState`.
- Query never performs the transitions above.
- `Ready` / `Fresh` means read surface availability,not command success.

### 10.2 `ArtifactDerivedFreshnessState` and `ArtifactDerivedJobOutcome`

```text
[ArtifactDerivedViewState]
  Fresh -> Stale -> Rebuilding -> Fresh
  Fresh -> Rebuilding -> Fresh
  Rebuilding -> Failed
  Stale -> Failed
  Fresh -> Unavailable
  Failed -> Rebuilding
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Fresh` | derived state covers source cursor | 否 | `mark_stale`, `start_rebuild`, `mark_failed` |
| `Stale` | needs rebuild | 否 | `start_rebuild`, `mark_failed` |
| `Rebuilding` | rebuild active | 否 | `mark_rebuilt`, `mark_failed` |
| `Unavailable` | derived view unavailable | 否 | future `start_rebuild` |
| `Failed` | last maintenance failed | 否 | `start_rebuild` |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Fresh` | `ArtifactDerivedViewState::for_view(...)` | `RebuildArtifactDerivedViewsFlow` first materialization | derived kind and source cursor formal | `last_job_outcome = Succeeded` by successful rebuild | state save, job report | `MissingRequiredReference` |
| `Fresh` / `Stale` / `Failed` / `Unavailable` | `Rebuilding` | `start_rebuild()` | `RebuildArtifactDerivedViewsFlow` | job accepted | freshness rebuilding | state save when implementation persists in-progress state | `InvalidStateTransition` |
| `Fresh` / `Rebuilding` | `Stale` | `mark_stale(reason)` | accepted command / consumer / refresh stale marker | reason formal;new cursor not covered | freshness stale | `ArtifactDerivedViewStateChanged` relay when persisted | `InvalidStateTransition` |
| `Rebuilding` | `Fresh` | `mark_rebuilt(source_cursor)` | `RebuildArtifactDerivedViewsFlow` | rebuild success and cursor assigned | freshness fresh, source cursor updated, outcome succeeded | view save, state save, job report | `InvalidStateTransition` |
| `Rebuilding` / `Stale` / `Fresh` | `Failed` | `mark_failed(reason)` | rebuild / refresh / reconciliation failure | failure reason formal | freshness failed, outcome failed | job report failed/partial | `InvalidStateTransition` |

`ArtifactDerivedJobOutcome` mapping:

| Outcome | Meaning | Set by |
|---|---|---|
| `Succeeded` | last maintenance completed for target item | successful rebuild / refresh / report job |
| `Skipped` | target was valid but no mutation was needed | job item skip branch |
| `Failed` | item failed terminally for this run | job failure branch |
| `Retryable` | item failed but can be retried | Step 12 / 13 retry classification |

### 10.3 `ArtifactExternalResolutionState`

```text
[ExternalReferenceResolutionState]
  Pending -> Resolved
  Pending -> Unresolved
  Pending -> Waiting
  Pending -> Failed
  Resolved -> Stale -> Resolved
  Stale -> Unresolved
  Stale -> Failed
  Unresolved -> Waiting
  Waiting -> Resolved
  Failed -> Resolved
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Pending` | reference state created but unresolved | 否 | `mark_resolved`, `mark_unresolved`, `mark_failed` |
| `Resolved` | has captured snapshot | 否 | `mark_stale`, `mark_failed` |
| `Stale` | snapshot needs refresh | 否 | `mark_resolved`, `mark_unresolved`, `mark_failed` |
| `Unresolved` | resolver business outcome says no resolution currently | 否 | `mark_resolved`, waiting path |
| `Waiting` | delayed/pending upstream availability | 否 | `mark_resolved`, `mark_failed` |
| `Failed` | refresh failed | 否 | `mark_resolved`, `mark_stale` |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Pending` | `from_reference(...)` | consumer / refresh first sighting | external ref and kind formal | state pending | state save | `MissingRequiredReference` |
| `Pending` / `Stale` / `Unresolved` / `Waiting` / `Failed` | `Resolved` | `mark_resolved(snapshot_ref)` | inbound consumer / refresh job | resolver outcome `Resolved`, snapshot ref formal | set captured snapshot | mirror snapshot save, refresh record | `InvalidStateTransition` |
| `Resolved` | `Stale` | `mark_stale(reason)` | consumer/source changed event | stale reason formal | set stale | degraded query / job report | `InvalidStateTransition` |
| `Pending` / `Stale` | `Unresolved` | `mark_unresolved(reason)` | inbound consumer / refresh job | resolver outcome `Unresolved` | set unresolved | refresh record, receipt delayed/accepted | `InvalidStateTransition` |
| `Pending` / `Unresolved` | `Waiting` | `mark_unresolved(reason)` waiting branch | consumer delayed branch | upstream delay reason formal | set waiting | receipt delayed | `InvalidStateTransition` |
| `Pending` / `Stale` / `Resolved` / `Waiting` | `Failed` | `mark_failed(reason)` | inbound consumer / refresh job | resolver outcome `Failed` | set failed | refresh record, job failed ref | `InvalidStateTransition` |

Red line: resolver `ApplicationError` does not trigger these business states;it is handled by Step 12 as orchestration failure.

### 10.4 `ArtifactReconciliationState`

```text
[ArtifactReconciliationReport]
  Clean -> Stale
  Clean -> GapDetected
  GapDetected -> Clean
  GapDetected -> Stale
  Stale -> Clean
  Stale -> GapDetected
  any -> Failed
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Clean` | no current gap | 否 | stale / rerun |
| `GapDetected` | report has findings | 否 | rerun / follow-up outside auto repair |
| `Stale` | report no longer covers current truth cursor | 否 | rerun |
| `Failed` | reconciliation job failed | 否 | rerun |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory / any | `Clean` | `ArtifactReconciliationReport::from_fields(..., Clean, 0, cursor)` | `RunArtifactReconciliationFlow` | snapshot checked and no findings | state clean, finding count zero | report save, job report | `InvariantViolation` |
| factory / any | `GapDetected` | `from_fields(..., GapDetected, count, cursor)` | `RunArtifactReconciliationFlow` | findings derived from body-free snapshot | state gap detected | report save;no truth repair | `InvariantViolation` |
| `Clean` / `GapDetected` | `Stale` | `from_fields(..., Stale, prior_count, cursor)` | accepted change stale marker | source cursor newer than report | state stale | query freshness degraded | `InvariantViolation` |
| any | `Failed` | `from_fields(..., Failed, count, cursor)` | reconciliation failure branch | failure reason formal in job report | state failed | job failed refs | `InvariantViolation` |

### 10.5 `ArtifactTraceState`, `ArtifactHandoffState`, `ArtifactMirrorRefreshState`

Append-only records do not mutate in place. A new record is appended for each event/outcome;state variant describes that record's outcome.

| Record | State enum | State | Meaning | Produced by |
|---|---|---|---|---|
| `ArtifactTraceRecord` | `ArtifactTraceState` | `Recorded` | trace event recorded | `RecordArtifactConsumptionBackrefFlow`;handoff jobs |
| `ArtifactTraceRecord` | `ArtifactTraceState` | `Explained` | trace fully linked to backref/handoff | trace append branch with formal linkage |
| `ArtifactTraceRecord` | `ArtifactTraceState` | `Failed` | trace/handoff operation failed | handoff failure branch |
| `ArtifactHandoffRecord` | `ArtifactHandoffState` | `Prepared` | handoff material prepared | prepare handoff jobs |
| `ArtifactHandoffRecord` | `ArtifactHandoffState` | `Delivered` | delivery succeeded | handoff delivery outcome |
| `ArtifactHandoffRecord` | `ArtifactHandoffState` | `Failed` | delivery failed terminally for run | handoff delivery outcome |
| `ArtifactHandoffRecord` | `ArtifactHandoffState` | `Retryable` | delivery retryable | handoff delivery outcome |
| `ExternalMirrorRefreshRecord` | `ArtifactMirrorRefreshState` | `Recorded` | refresh attempt recorded | consumer / refresh job |
| `ExternalMirrorRefreshRecord` | `ArtifactMirrorRefreshState` | `Refreshed` | snapshot captured/refreshed | consumer / refresh job |
| `ExternalMirrorRefreshRecord` | `ArtifactMirrorRefreshState` | `Stale` | source change marks mirror stale | consumer / refresh job |
| `ExternalMirrorRefreshRecord` | `ArtifactMirrorRefreshState` | `Failed` | refresh failed | consumer / refresh job |

Append-only red lines:

- No transition updates an existing record state in place.
- Query reads existing records only.
- Handoff / refresh failure never rolls back accepted truth.

### 10.6 10.3 stop-review

| 检查项 | 结论 |
|---|---|
| derived / reference / report / record states 是否覆盖 | 是 |
| query 是否能触发 rebuild / refresh | 否 |
| resolver outcome 与 application error 是否分离 | 是 |
| append-only record 是否禁止 in-place mutate | 是 |
| reconciliation 是否能自动修 truth | 否 |

---

## 11. application / entry 技术状态矩阵

### 11.1 Idempotency reservation state

Step 6 没有定义持久化 `ArtifactIdempotencyState` enum,但 Step 7 `ArtifactIdempotencyReservation` 已闭口 reserve result。实现可用内部持久化状态,但 public/application 语义必须只暴露以下三分:

| Reservation | Meaning | Produced by | Allowed next action |
|---|---|---|---|
| `Reserved { idempotency_ref }` | 当前 request 可执行 | `ArtifactIdempotencyRepository.reserve(...)` | run body, save stored result, `complete(...)` |
| `Duplicate { result_ref }` | same key + same digest 已完成 | `reserve(...)` | rollback current UoW, load stored result/receipt/report, replay |
| `Conflict { idempotency_ref, reason }` | same key + different digest or unsafe replay | `reserve(...)` | `mark_conflict(...)`, save rejection/receipt/report according to channel |

```text
[Idempotency]
  Empty -> Reserved -> Completed
  Empty -> Conflict
  Completed -> Duplicate
  Reserved -> Conflict
```

| From | To | Trigger | Step 9 flow | 前置条件 | State side effect | Flow side effect | 非法时错误 |
|---|---|---|---|---|---|---|---|
| empty | reserved | `reserve(context, digest, uow)` | command / consumer / job templates | key unused | create reservation | body may run | `IdempotencyConflict` |
| reserved | completed | `complete(idempotency_ref, result_ref, uow)` | accepted command / receipt / job | stored result already saved | bind result ref | commit UoW | `InvariantViolation` |
| completed | duplicate | `reserve(...)` | duplicate branch | same digest | no mutation | replay stored result | `InvariantViolation` if result missing |
| any | conflict | `mark_conflict(...)` | conflict branch | same key different digest | conflict marker | command rejection or quarantine | `IdempotencyConflict` |

Red line: query never enters idempotency state machine.

### 11.2 `ArtifactInboundDisposition`

| Disposition | Meaning | Terminal for one event? | Produced by |
|---|---|---|---|
| `Accepted` | payload accepted and local reference / stale marker updated | 是 | consumer accepted branch |
| `Duplicate` | same dedup key replayed | 是 | consumer duplicate branch |
| `Delayed` | required upstream ref not resolvable yet | 是 | consumer unresolved/waiting branch |
| `Rejected` | valid schema but policy/selector rejected | 是 | consumer validation branch |
| `UnsupportedSchema` | schema unsupported | 是 | worker pre-parse branch |
| `Quarantined` | dedup conflict or unsafe relation | 是 | conflict branch |

Inbound disposition rule:

- Disposition is stored receipt outcome,not a mutable domain state.
- `UnsupportedSchema` must be created without parsing payload.
- `Duplicate` must replay stored receipt;it cannot rerun resolver.

### 11.3 `ArtifactJobOutcome`

| Outcome | Meaning | Produced by | Stored report behavior |
|---|---|---|---|
| `Completed` | all requested items completed | maintenance / handoff job success | save `JobReport`, complete idempotency |
| `PartiallyCompleted` | some items succeeded and some failed/skipped according to Step 13 | job partial branch | save changed and failed refs |
| `Failed` | job failed for this request | job failure branch | save failed refs when available |

Job outcome red lines:

- Job outcome is stored report state,not truth lifecycle.
- Duplicate job must replay `StoredArtifactResultRepository.get_job_report(...)`.
- Partial commit semantics are deferred to Step 13;until then implementation must not silently commit partial writes without report coverage.

### 11.4 Command rejection state

`ArtifactCommandRejectionCode` is a stored result classification,not a domain state. Step 10 fixes where it may be produced:

| Rejection code | Produced by | Example flow |
|---|---|---|
| `PolicyRejected` | policy guard failure | fact establish duplicate truth, baseline non-formal member |
| `InvalidState` | object transition illegal | publish rejected candidate, freeze terminal baseline |
| `MissingRequiredReference` | required ref absent | missing intake, missing version, missing review anchor |
| `VisibilityDenied` | command path needs visibility/authorization and fails | future restricted write/handoff commands |
| `DuplicateConflict` | idempotency same key different digest | shared command template |

Red line: Rejection code does not replace `ArtifactDomainErrorCode`;Step 12 maps domain/application errors to protocol rejection.

### 11.5 API / worker / job entry disposition

These entry states are not persisted domain objects. They are handler outcomes that must be testable:

| Entry family | Disposition | Meaning | Forbidden |
|---|---|---|---|
| command API | accepted | command result persisted and returned | return in-memory-only result |
| command API | rejected | stored rejection persisted when idempotency channel was reserved | mutate truth after rejection |
| command API | duplicate replay | stored command result/rejection returned | rerun domain transition |
| query API | visible | body returned with query surface | write repository |
| query API | not visible | body-free not-visible surface | append trace or backref |
| query API | degraded | body or partial body with degraded/freshness marker | repair projection |
| worker consumer | receipt accepted/delayed/rejected/etc. | stored receipt returned to worker ack mapping | create core truth |
| operations job | completed/partial/failed/duplicate | stored job report returned | repair core truth |
| relay worker | published/retryable/failed | relay marker update only | rebuild payload from current truth |

### 11.6 10.4 stop-review

| 检查项 | 结论 |
|---|---|
| idempotency semantic state 是否闭口 | 是 |
| inbound disposition 是否不变成 domain truth | 是 |
| job outcome 是否不修 truth | 是 |
| command rejection 是否只做 stored classification | 是 |
| entry dispositions 是否可测试 | 是 |

---

## 12. 跨状态机副作用一致性

| Source state change | Required application side effect | Forbidden side effect |
|---|---|---|
| fact established | fact save, fact change record, relay, stored command result | create version implicitly |
| version published | version save, fact current bind, version change record, relay | overwrite current without explicit request |
| lineage established/rejected | lineage save, lineage change record, relay | accept candidate/view as endpoint |
| baseline frozen/superseded | baseline save, membership freeze when needed, baseline change record, relay | dynamic current latest membership |
| review ready / pending responsibility | review/assignment save, review trace, relay | mutate artifact truth |
| automation accepted | automation save, audit record | direct fact/version/lineage/baseline creation |
| consumable issued | consumable save, relay | read surface generation as side effect |
| backref explained | backref save, trace append, trace relay | query-triggered backref write |
| derived state fresh/stale/failed | derived state save, optional derived relay, job report | truth repair |
| reference resolved/stale/failed | state save, mirror snapshot/refresh record, receipt/job report | write fact/version |
| handoff delivered/retryable/failed | append handoff record/material/report | rollback accepted truth |

---

## 13. Forbidden transition summary

| State machine | Forbidden transition | Reason |
|---|---|---|
| `ArtifactFactState` | `Closed -> Established` | closed is terminal |
| `ArtifactVersionState` | `Retired -> Published` | retired is terminal |
| `ArtifactVersionCandidateState` | `Rejected -> ReadyToPublish` | rejected candidate cannot be revived |
| `ArtifactLineageState` | `Rejected -> Established` | rejected lineage needs new link |
| `ArtifactBaselineState` | `Superseded -> Frozen` | superseded baseline cannot regain current position |
| `ArtifactBaselineMembershipState` | `Frozen -> Removed` | frozen membership immutable |
| `ArtifactIntakeState` | `PendingReference -> Transferred` without `Resolved` | unresolved input cannot enter truth write |
| `ArtifactReviewState` | `Closed -> Ready` | closed review cannot reopen |
| `AutomationArtifactInputState` | `Accepted -> fact/version truth` | automation remains candidate/convergence input |
| `ConsumableArtifactReferenceState` | `Unavailable -> Ready` without formal refresh flow | unavailable cannot silently recover |
| `ArtifactConsumptionBackrefState` | `Retired -> Explained` | retired backref terminal |
| `ArtifactExternalResolutionState` | `Failed -> Resolved` without resolver resolved outcome | application error cannot be treated as resolved |
| Query view states | `Stale -> Ready` inside query | query no-write |
| Relay publication | `Failed -> Published` without pending scan expected version | relay state must use repository version |

---

## 14. Step 10 对 Step 9 待决项的闭口

| Step 9 item | Step 10 closure |
|---|---|
| baseline candidate / freeze context 分离 | `ArtifactBaselineState` 正式规定 candidate `freeze_context_ref = None`, `freeze(freeze_context_ref)` 后 Frozen 必须 `Some` |
| membership page completeness | Step 10 标明 freeze 需要完整 membership set;具体 page completeness / batching 留 Step 11 / Step 13 |
| job partial commit | Step 10 标明 `PartiallyCompleted`;是否允许 partial commit 和 replay 细节留 Step 13 |
| relay missing snapshot recovery | Step 10 标明 marker outcome;恢复策略留 Step 12 / Step 13 |
| query missing projection | Step 10 标明 query 不迁移 projection state;只返回 degraded/freshness surface |

---

## 15. Step 11~16 handoff items

| 后续 Step | Handoff |
|---|---|
| Step 11 persistence / transaction | versioned save order、membership completeness、partial job commit boundary、append-only record persistence |
| Step 12 error / recovery | exact error taxonomy and protocol mapping for invalid transitions, conflicts, missing refs and relay/handoff failures |
| Step 13 concurrency / idempotency | duplicate replay, optimistic conflict, relay expected version retry, job partial replay |
| Step 14 config / external binding | topic mapping, handoff delivery mode, resolver config, job page limits |
| Step 15 observability / audit | transition metrics, rejected transition audit policy, job/relay counters |
| Step 16 tests | per-state transition positive/negative tests and no-write query assertions |

---

## 16. 跨状态机命名 / 触发 / 测试审计表

| 审计项 | 结论 |
|---|---|
| 状态名是否全部来自 Step 6 | 是 |
| Step 9 flow 是否都有对应状态触发或 no-state 说明 | 是 |
| terminal 状态是否明确 | 是 |
| reserved transition 是否未被当前 flow 调用 | 是 |
| query no-write 是否保持 | 是 |
| consumer no-core-truth-write 是否保持 | 是 |
| job no-truth-repair 是否保持 | 是 |
| relay stored snapshot / expected version 规则是否保持 | 是 |
| Step 11~16 handoff 是否明确 | 是 |

---

## 17. 回填草稿

正式 `03-详细设计.md` Step 19 装配时,§9 可采用以下结构:

```markdown
## 9. 状态机与转换矩阵

### 9.1 通用状态规则
### 9.2 Truth core 状态矩阵
### 9.3 Boundary / support 状态矩阵
### 9.4 Derived / reference / report / handoff 状态矩阵
### 9.5 Application / entry 技术状态
### 9.6 禁止迁移与跨状态机副作用一致性
```

---

## 18. 进入下一步条件

Step 10 已完成。进入 Step 11 前必须:

1. 用户确认进入 Step 11。
2. 读取本文件和 Step 6 / 7 / 8 / 9。
3. Step 11 以本文件的 version 来源、append-only record、membership completeness、partial job commit 和 relay marker 规则为输入,正式产出持久化、事务与一致性契约。
