# Step 13. 并发、幂等与重入保护

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 13
> 回填章节: `03-详细设计.md` §12 并发、幂等与重入保护
> 生成日期: 2026-07-04
> 状态: 已完成

---

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 并发、幂等与重入保护 |
| 当前状态 | 已完成 |
| 输入基线 | 需求、架构、概要、Step 1~12 详细设计校准文档 |
| 输出文件 | `projects/L1-artifact/design-calibration/03_ddd_step_13_concurrency_idempotency.md` |
| 停审方式 | 按 SOP 问题回答、并发资源、幂等键 / digest、重复处理、重入恢复和测试切口分批写入;完成后做跨 Step 7~12 闭环审计 |

---

## 2. 本步目标

本 Step 把 L1-artifact 写路径、事件消费、后台 job、relay 发布、projection / reference 维护和 handoff 任务中的并发、重复调用和重入恢复规则收束为可落码矩阵。

实现侧必须能从本 Step 直接判断:

- 哪些入口必须 reserve idempotency,哪些入口必须保持 read-only。
- 哪些 mutable truth / support / projection / reference / relay marker 需要 `ArtifactRepositoryVersion`。
- 幂等键和 `ArtifactRequestDigest` 应包含哪些稳定输入,排除哪些 volatile metadata。
- duplicate same digest 如何返回 stored accepted command result / stored command rejection / inbound receipt / job report。
- same key different digest、in-flight reservation、commit unknown 和 missing stored result 如何处理。
- dual relay publisher、projection rebuild、reference refresh、handoff job 重入如何防止重复副作用。
- Step 16 应如何拆出并发和幂等测试切口。

本步不定义幂等记录保留期、具体 hash crate、HTTP/RPC status code、terminal relay retry threshold、worker backoff、scheduler 配置、日志字段、告警规则或实施 commit boundary。这些由 Step 14、Step 15、Step 16 和具体 adapter 实现承接。

---

## 3. 输入材料

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供 truth/support state、`ArtifactIdempotentOperationContext`、stored result envelope、application error carrier |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 `Versioned<T>`、`ArtifactRepositoryVersion`、UoW、idempotency repository、stored result repository、relay/reference/handoff repositories |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 16 个 Command、13 个 Query、6 个 Inbound Consumer、8 个 Outbound Event、6 个 Operations Job 的 public DTO 和 metadata |
| `03_ddd_step_09_function_flows.md` | 已完成 | 提供 command / query / consumer / relay / job / handoff 的函数级处理顺序 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 提供 domain 状态迁移、technical state、terminal state 和 duplicate / retry / failed disposition |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 提供 UoW 边界、atomic save / complete 顺序、payload snapshot、projection/reference/relay version 来源和恢复规则 |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 提供 duplicate、version conflict、commit unknown、missing stored result、missing relay payload 和 consistency defect 映射 |
| `projects/L1-governance/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | 已读取 | 作为并发场景表、幂等矩阵、重入恢复和测试切口粒度参考 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已生效 | 检查幂等 key / digest / result ref / expected version / query no-write / stored replay 是否闭合 |

---

## 4. 分批写入计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 13.1 | 文件骨架、SOP 问题回答、设计原则、当前闭环诊断 | [x] 已写入 |
| 13.2 | 并发场景表、冲突资源、控制方式、失败错误、测试切口 | [x] 已写入 |
| 13.3 | 幂等键、digest 规则、16 command / 6 consumer / 6 job key matrix | [x] 已写入 |
| 13.4 | 重复处理矩阵、重入保护、commit unknown、relay / projection / reference / handoff job 细化规则 | [x] 已写入 |
| 13.5 | 测试切口、前序契约回填、正式文档草稿、Step 14 handoff | [x] 已写入 |

---

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些处理流可能并发修改同一资源? | 16 个 Command 写路径都可能并发修改 artifact-owned mutable truth/support。6 个 Inbound Consumer 可能并发修改 reference state、mirror snapshot、refresh record、stale marker 和 stored receipt。6 个 Operations Job 可能并发修改 projection state/body、reference state、reconciliation report、handoff material/record 和 stored job report。Relay publication facade 可能由多个 worker 同时更新同一 relay item publication state。Query 只读,不得参与写并发。 |
| 哪些接口、事件或 job 可能被重复调用? | 所有 Command 可能因客户端超时 / retry 重复。所有 Inbound Event 可能因 event bus redelivery / upstream ack 丢失重复。所有 Operations Job 可能因 scheduler rerun、worker crash、operator retry 重复。Relay publisher 可能由多个 worker 同时处理同一 pending relay item。 |
| 幂等键来自请求、事件、job 参数还是数据库唯一约束? | Command 幂等键来自 `CommandMetadata` 并通过 `ArtifactOperationContextFactory.for_command(...)` 归一化。Inbound Event 幂等键来自 `ArtifactInboundEventEnvelope.dedup_key` 并通过 `for_inbound_event(...)` 归一化。Job 幂等键来自 `ArtifactJobMetadata.idempotency_key` 并通过 `for_job(...)` 归一化。数据库唯一键只保护 business uniqueness 或 storage uniqueness,不能替代 stored result replay。Relay per-record publication 使用 `ArtifactRelayItemRef + ArtifactRepositoryVersion`,不使用 application idempotency store。 |
| 重复请求应该返回既有结果、跳过、覆盖还是报错? | same operation + same key + same digest + completed 时必须读取 stored accepted command result / stored command rejection / inbound receipt envelope / job report 并返回既有 surface。same key + different digest 必须返回 duplicate conflict / quarantined / rejected。same key still reserved / in-flight 必须返回 retryable unavailable / delayed,不得并发执行第二次 mutation。Query 重复读取只返回当前 authorized read surface,不写幂等记录。 |
| 并发冲突如何测试? | Step 16 必须覆盖 optimistic version conflict、business unique conflict、duplicate same digest replay、same key different digest conflict、in-flight reservation、stored result missing、commit unknown retry、event redelivery、dual relay publisher、projection stale vs rebuild、reference refresh race、handoff retry 和 job partial rerun。 |

---

## 6. 设计原则

| 原则 | 说明 |
|---|---|
| idempotency first | Command / Consumer / Job 的写路径必须先 reserve idempotency,再进入 domain transition、resolver、job scan 或 handoff delivery。 |
| operation namespace | 幂等唯一键为 `channel_kind + operation_name + actor_ref + idempotency_key`;不同 operation 可以复用同一 raw key 字符串,不得互相判 duplicate。 |
| stable digest | `ArtifactRequestDigest` 只覆盖稳定业务输入。volatile metadata 被排除,避免 retry 被误判为 different digest。 |
| volatile metadata exclusion | digest 不包含 request id、requested_at、trace id、job run id、transport header、delivery attempt、retry counter、随机 id 或当前时间。 |
| stored replay | duplicate same digest 必须读取 `StoredArtifactResultRepository.get_command_result/get_command_rejection/get_inbound_receipt/get_job_report`,不得从 current truth / current projection / pending relay 重算。 |
| in-flight no second writer | 同 operation/key 处于 reserved 或 already-in-progress 时,第二个调用不得进入 domain transition / resolver / publisher / job body。 |
| versioned mutation | mutable truth/support/projection/reference/relay marker 的并发保护只使用 `ArtifactRepositoryVersion`。 |
| append-only side effects | change/audit/trace/handoff/refresh record、relay append 是 accepted transaction 的 append-only side effect,不得通过覆盖旧 record 实现并发保护。 |
| query no-write | Query 不 reserve idempotency、不 append trace、不 mark stale、不 refresh snapshot、不 rebuild projection、不 repair report。 |
| job no truth repair | Operations Job 只能维护 derived / reference / report / handoff / relay publication state,不得修复 core Artifact truth。 |
| missing side effect no recompute | completed idempotency missing stored result、relay payload snapshot missing、prepared handoff material missing 等是一致性缺陷,不得临时回查 current truth 重建。 |

---

## 7. 当前闭环诊断

| 闭口项 | 结论 | 依据 |
|---|---|---|
| idempotency reserve surface | 通过 | Step 7 `ArtifactIdempotencyRepository.reserve(...)` 返回 `Reserved` / `Duplicate(result_ref)` / `Conflict` |
| stored result replay surface | 通过 | Step 7 `StoredArtifactResultRepository.get_command_result/get_command_rejection/get_inbound_receipt/get_job_report` |
| result save before complete | 通过 | Step 9 / Step 11 要求 same UoW 内先保存 stored result,再 `complete` idempotency |
| command operation context source | 通过 | Step 7 `ArtifactOperationContextFactory.for_command(...)` 是唯一归一化来源 |
| consumer operation context source | 通过 | Step 7 `for_inbound_event(...)` 接收 trusted actor and inbound context |
| job operation context source | 通过 | Step 7 `for_job(...)` 接收 `ArtifactJobCallContext` |
| mutable truth version | 通过 | Step 7 truth/support repositories 均提供 versioned read 和 `save(... expected_version ...)` |
| reference refresh version | 通过 | Step 7 reference state repository 提供 versioned get/list 和 expected version save |
| relay publish version | 通过 | Step 7 `list_pending_with_payload(...)` 返回 `Versioned<ArtifactPendingRelayItem>` |
| projection affected state identity | 通过 | Accepted path 只能使用 Step 9 明名的 affected derived view kind + Step 7 `ArtifactDerivedViewStateRepository.find_by_kind(...)`;不得拼接 derived state ref |
| handoff material duplicate replay | 通过 | Step 7 handoff material repository + stored job report 支撑 replay |
| commit unknown recovery | 有口径 | Step 12 要求 same key idempotency/result lookup;本 Step 细化 retry 顺序 |

---

## 8. 并发场景表

| 场景 | 冲突资源 | 控制方式 | 失败映射 | Test cut |
|---|---|---|---|---|
| 同一 Command 被客户端并发重试 | `artifact_idempotency_store(channel, operation, actor, key)` | atomic reserve + digest compare | duplicate replay / in-flight / duplicate conflict | `TC-ART-IDEM-001` |
| `RegisterArtifactIntakeFlow` 并发注册同 source | `ArtifactIntakeContext` source index, `ArtifactSubmissionRecord` | idempotency first;source uniqueness rejects non-idempotent duplicate | duplicate replay / policy rejected / unique conflict | `TC-ART-CONC-INTAKE-001` |
| `EstablishArtifactFactFlow` 并发转移同 intake | `ArtifactIntakeContext.version`, `ArtifactContentFactContext` source index, `ArtifactFact` anchor | intake expected version + content/fact uniqueness | `VersionConflict` / duplicate truth anchor | `TC-ART-CONC-FACT-001` |
| `CreateArtifactVersionCandidateFlow` 并发为同 fact/submission 建 candidate | `ArtifactFact.version`, `ArtifactSubmissionRecord.version`, candidate identity | versioned fact/submission read + candidate create uniqueness | `VersionConflict` / policy rejected | `TC-ART-CONC-CAND-001` |
| `PublishArtifactVersionFlow` 并发 publish 同 candidate | `ArtifactVersionCandidate.version`, `ArtifactFact.version`, `ArtifactVersion` identity | candidate expected version + fact expected version | `VersionConflict` / invalid transition | `TC-ART-CONC-VERSION-001` |
| `SupersedeArtifactVersionFlow` 并发 rebind fact current | `ArtifactVersion.version`, `ArtifactFact.version` | current/next versioned read + fact expected version | `VersionConflict` / invalid transition | `TC-ART-CONC-VERSION-002` |
| `EstablishArtifactLineageLinkFlow` 并发建立同 endpoints/relation | `ArtifactLineageLink` endpoint unique index, source/target versions | endpoint uniqueness + version existence checks | unique conflict / policy rejected | `TC-ART-CONC-LINEAGE-001` |
| `RejectArtifactLineageLinkFlow` 并发 reject/establish 同 link | `ArtifactLineageLink.version` | `get_with_version` + expected version save | `VersionConflict` / invalid transition | `TC-ART-CONC-LINEAGE-002` |
| `CreateArtifactBaselineCandidateFlow` 并发为同 scope 建 candidate | `ArtifactBaseline` scope/current index, membership unique rows | scope uniqueness + member version validation | unique conflict / policy rejected | `TC-ART-CONC-BASELINE-001` |
| `FreezeArtifactBaselineFlow` 并发冻结/修改同 baseline | `ArtifactBaseline.version`, membership versions, review anchor state | baseline expected version + membership expected versions | `VersionConflict` / invalid transition | `TC-ART-CONC-BASELINE-002` |
| `SupersedeArtifactBaselineFlow` 并发 supersede same current | current/next `ArtifactBaseline.version` | expected version on current and next baseline | `VersionConflict` / invalid transition | `TC-ART-CONC-BASELINE-003` |
| `OpenArtifactReviewAnchorFlow` 并发为同 truth anchor 开 review | `ArtifactReviewAnchor` open-by-truth index | open review uniqueness + idempotency | unique conflict / duplicate replay | `TC-ART-CONC-REVIEW-001` |
| `AssignArtifactResponsibilityFlow` 并发 assign same review | `ArtifactReviewAnchor.version`, `ArtifactResponsibilityAssignment` identity | review expected version + assignment create uniqueness | `VersionConflict` / policy rejected | `TC-ART-CONC-RESP-001` |
| `RegisterAutomationArtifactInputFlow` 并发注册同 automation source | `AutomationArtifactInput` source index | source uniqueness + idempotency | unique conflict / duplicate replay | `TC-ART-CONC-AUTO-001` |
| `AcceptAutomationArtifactInputFlow` 并发 accept/reject same input | `AutomationArtifactInput.version`, optional `ArtifactIntakeContext.version` | input expected version + intake expected version when linked | `VersionConflict` / invalid transition | `TC-ART-CONC-AUTO-002` |
| `IssueConsumableArtifactReferenceFlow` 并发 issue same truth/scope | `ConsumableArtifactReference` `(truth_anchor_ref, consumer_scope_ref)` index | unique index + idempotency | unique conflict / duplicate replay | `TC-ART-CONC-CONSUME-001` |
| `RecordArtifactConsumptionBackrefFlow` 并发 record same consumer/consumable | `ArtifactConsumptionBackref` consumer+consumable index, trace record append | backref uniqueness + append-only trace | unique conflict / duplicate replay | `TC-ART-CONC-BACKREF-001` |
| inbound event redelivery | idempotency record, reference state | event dedup + digest;reference expected version | duplicate replay / duplicate conflict | `TC-ART-EVENT-DEDUP-001` |
| two consumers refresh same external ref | `ExternalReferenceResolutionState.version`, mirror snapshot latest index | versioned state list/get + expected version save | version conflict / delayed item | `TC-ART-REF-CONC-001` |
| command reads stale external reference while consumer refreshes | reference state, mirror snapshot, command guard | command guard uses loaded state;consumer writes state in own UoW | dependency unavailable / version conflict | `TC-ART-REF-CONC-002` |
| accepted command stale marker vs projection rebuild | `ArtifactDerivedViewState.version`, source cursor | stale marker expected version + cursor monotonicity | version conflict / older cursor ignored | `TC-ART-PROJ-CONC-001` |
| two rebuild jobs update same view/state | projection view version, derived state version | job idempotency + view/state expected version | duplicate report / version conflict | `TC-ART-PROJ-CONC-002` |
| dual relay publisher | relay item publication state/version | pending item version passed to `mark_published/mark_retryable/mark_failed` | version conflict treated as item skipped/failed | `TC-ART-RELAY-CONC-001` |
| relay publisher sees missing payload snapshot | relay item + payload snapshot sidecar | do not rebuild payload;mark failed/retryable by item version when allowed | consistency defect item failure | `TC-ART-RELAY-CONC-002` |
| reference refresh job races consumer update | reference state / mirror snapshot version | versioned reference list + expected version save | item version conflict, partial report | `TC-ART-JOB-REF-001` |
| reconciliation runs while truth changes | reconciliation report only | report captures scope/cursor;does not write truth | stale report / partial | `TC-ART-RECON-CONC-001` |
| archive / observability / sync handoff retried | handoff record/material identity, stored job report | job idempotency + generated handoff refs + delivery outcome | duplicate report / failed record | `TC-ART-HANDOFF-CONC-001` |

---

## 9. 幂等键与 digest 总规则

### 9.1 统一 key 规则

| 入口类型 | operation source | raw key source | normalized key owner | duplicate result source |
|---|---|---|---|---|
| Command | Step 8 command route-neutral name | `CommandMetadata` idempotency key | `ArtifactOperationContextFactory.for_command(...)` | `StoredArtifactResultRepository.get_command_result(result_ref)` or `get_command_rejection(result_ref)` |
| Inbound Consumer | consumer operation name | `ArtifactInboundEventEnvelope.dedup_key` | `ArtifactOperationContextFactory.for_inbound_event(...)` | `StoredArtifactResultRepository.get_inbound_receipt(result_ref)` |
| Operations Job | job operation name | `ArtifactJobMetadata.idempotency_key` | `ArtifactOperationContextFactory.for_job(...)` | `StoredArtifactResultRepository.get_job_report(result_ref)` |
| Relay per-record publish | relay item identity | `ArtifactRelayItemRef` + pending item version | not idempotency store | relay item publication state/version check |
| Query | query name | none | none | no stored replay;normal authorized read |

Key rules:

- The same raw key string may be reused across different operations without collision.
- `actor_ref` is part of the normalized operation context,so two actors using the same raw key do not share replay unless a future protocol explicitly defines shared replay.
- Entry, worker and job runner must not construct `ArtifactIdempotentOperationContext` manually.
- Repository business unique keys still matter, but they return uniqueness/domain conflict rather than duplicate replay.

### 9.2 `ArtifactRequestDigest` canonical input

| Include | Exclude |
|---|---|
| channel kind and operation name | idempotency key value |
| actor effective scope / actor ref as normalized by context factory | request id / transport message id |
| stable command body fields: typed refs, reason refs, marker refs, state intent, ordered member refs, target refs | requested_at / occurred_at / received_at |
| inbound source event ref, source ref, schema version, source version ref, payload typed refs, body-free digest fields | bus offset / delivery attempt / ack id |
| job kind, job input scope, page request, explicit refs, target refs, derived view kinds, refresh scope | job run id / scheduler attempt / retry counter |
| expected version when the DTO / flow uses it as semantic guard | generated truth ids created after reservation |
| body-free summary refs and safe markers that affect output | trace id / core trace id when it does not affect output |

Digest rules:

- Command digest 字段必须逐项复制 Step 8 request DTO 的 exact field name 和 option/list 语义;不得使用别名、自然语言 summary 或未在 DTO 闭口的 inferred field。
- Ordered lists that affect output must be canonicalized exactly as Step 8 says. For baseline member refs, request order after validation is part of the digest.
- Optional fields must be represented explicitly as absent/present;omitting a field and providing an empty collection are not interchangeable unless Step 8 says so.
- Forbidden body payload must not be hashed into a valid digest;it is rejected before business processing.
- Public page cursor in job input is included because it affects selected items and report output.

---

## 10. Command 幂等键表

| Command | Key source | Stable digest fields | Duplicate replay surface |
|---|---|---|---|
| `RegisterArtifactIntake` | `CommandMetadata` key | actor scope、`source_ref`、`intake_kind`、optional `definition_ref`、optional `work_context_ref`、optional `process_context_ref`、optional `governance_context_ref` | stored `ArtifactIntakeCommandResult` or stored rejection |
| `EstablishArtifactFact` | `CommandMetadata` key | actor scope、`intake_context_ref`、`definition_ref`、optional `review_anchor_ref` | stored `ArtifactTruthCommandResult` or rejection |
| `CreateArtifactVersionCandidate` | `CommandMetadata` key | actor scope、`artifact_fact_ref`、`proposed_content_context_ref`、`candidate_source_ref`、`submission_ref` | stored `ArtifactTruthCommandResult` or rejection |
| `PublishArtifactVersion` | `CommandMetadata` key | actor scope、`artifact_version_candidate_ref`、`publish_reason` | stored `ArtifactTruthCommandResult` or rejection |
| `SupersedeArtifactVersion` | `CommandMetadata` key | actor scope、`current_version_ref`、`next_version_ref`、`supersede_reason` | stored `ArtifactTruthCommandResult` or rejection |
| `EstablishArtifactLineageLink` | `CommandMetadata` key | actor scope、`source_version_ref`、`target_version_ref`、`relation_kind`、`basis_ref` | stored `ArtifactLineageCommandResult` or rejection |
| `RejectArtifactLineageLink` | `CommandMetadata` key | actor scope、`artifact_lineage_link_ref`、`reject_reason` | stored `ArtifactLineageCommandResult` or rejection |
| `CreateArtifactBaselineCandidate` | `CommandMetadata` key | actor scope、`baseline_scope_ref`、ordered `member_version_refs`、`membership_reason` | stored `ArtifactBaselineCommandResult` or rejection |
| `FreezeArtifactBaseline` | `CommandMetadata` key | actor scope、`artifact_baseline_ref`、`freeze_context_ref` | stored `ArtifactBaselineCommandResult` or rejection |
| `SupersedeArtifactBaseline` | `CommandMetadata` key | actor scope、`current_baseline_ref`、`next_baseline_ref` | stored `ArtifactBaselineCommandResult` or rejection |
| `OpenArtifactReviewAnchor` | `CommandMetadata` key | actor scope、`truth_anchor_ref`、`review_reason` | stored `ArtifactReviewCommandResult` or rejection |
| `AssignArtifactResponsibility` | `CommandMetadata` key | actor scope、`review_anchor_ref`、`responsible_party_ref`、`basis_ref` | stored `ArtifactReviewCommandResult` or rejection |
| `RegisterAutomationArtifactInput` | `CommandMetadata` key | actor scope、`automation_source_ref`、`candidate_kind`、`derived_from_ref` | stored `ArtifactAutomationCommandResult` or rejection |
| `AcceptAutomationArtifactInput` | `CommandMetadata` key | actor scope、`automation_input_ref`、`intake_context_ref` | stored `ArtifactAutomationCommandResult` or rejection |
| `IssueConsumableArtifactReference` | `CommandMetadata` key | actor scope、`truth_anchor_ref`、`consumer_scope_ref` | stored `ArtifactConsumptionCommandResult` or rejection |
| `RecordArtifactConsumptionBackref` | `CommandMetadata` key | actor scope、`consumer_ref`、`consumable_ref`、`consumption_reason` | stored `ArtifactConsumptionCommandResult` or rejection |

Command duplicate rules:

- Duplicate accepted command replays the stored accepted command response including the original `result_ref` and effect summary.
- Duplicate rejected command replays the stored rejection surface when the rejection happened after idempotency reserve.
- Same key different digest returns `DuplicateConflict` and does not call domain service.
- A command that fails before idempotency reserve may be retried as a fresh attempt with the same key.

---

## 11. Inbound Event Consumer 幂等键表

| Consumer flow | Key source | Stable digest fields | Duplicate replay surface |
|---|---|---|---|
| `ConsumeWorkArtifactContextChanged` | `ArtifactInboundEventEnvelope.dedup_key` | source family、source event id、source ref、schema version、source version ref、`work_context_ref` | stored `ArtifactInboundReceiptEnvelope` |
| `ConsumeProcessArtifactContextChanged` | envelope dedup key | source family、source event id、source ref、schema version、source version ref、`process_context_ref` | stored receipt |
| `ConsumeGovernanceArtifactContextChanged` | envelope dedup key | source family、source event id、source ref、schema version、source version ref、`governance_context_ref` | stored receipt |
| `ConsumeMethodArtifactDefinitionChanged` | envelope dedup key | source family、source event id、source ref、schema version、source version ref、`definition_ref` | stored receipt |
| `ConsumeRuntimeArtifactSignalRecorded` | envelope dedup key | source family、source event id、source ref、schema version、source version ref、`automation_source_ref`、optional `derived_truth_anchor_ref` | stored receipt |
| `ConsumeExternalContentSourceChanged` | envelope dedup key | source family、source event id、source ref、schema version、source version ref、`source_ref` and body-free source digest / summary refs when present | stored receipt |

Inbound duplicate rules:

- Unsupported schema version returns `UnsupportedSchema` receipt without parsing payload fields. Its digest may only use envelope fields available before body parse.
- Same dedup key + same digest replays stored receipt and does not call resolver.
- Same dedup key + different digest returns `Quarantined` or `Rejected` according to Step 12 and does not save reference/mirror state.
- Event bus delivery id, offset and attempt count are excluded from digest.

---

## 12. Operations Job 幂等键表

| Job flow | Key source | Stable digest fields | Duplicate replay surface |
|---|---|---|---|
| `RebuildArtifactDerivedViews` | `ArtifactJobMetadata.idempotency_key` | actor scope、job kind、ordered `derived_view_kinds`、`snapshot_scope`、page request | stored `ArtifactJobReport`,including changed view/state refs and failed refs |
| `RefreshExternalReferenceStates` | job metadata key | actor scope、job kind、refresh scope variant, explicit refs after dedup, reference kind, unhealthy-only marker, page request | stored job report,including refreshed / failed state refs |
| `RunArtifactReconciliation` | job metadata key | actor scope、job kind、`reconciliation_scope_ref`、`snapshot_scope`、page request | stored job report,including reconciliation report refs / failed refs |
| `PrepareArtifactArchiveHandoff` | job metadata key | actor scope、job kind、`target_ref`、`snapshot_scope`、page request, delivery mode if present | stored job report,including handoff record refs |
| `PrepareArtifactObservabilityHandoff` | job metadata key | actor scope、job kind、`target_ref`、ordered `truth_anchor_refs`、page request, delivery mode if present | stored job report |
| `PrepareArtifactSyncHandoff` | job metadata key | actor scope、job kind、`target_ref`、`consumer_scope_ref`、page request, delivery mode if present | stored job report |

Job duplicate rules:

- Duplicate same key/digest must not enter job body.
- Duplicate rebuild does not rebuild views;duplicate refresh does not call resolver;duplicate handoff does not redeliver.
- Duplicate missing stored report is a consistency defect and must not rerun job body to recreate report.
- Operator rerun that intentionally recomputes current state must use a new idempotency key and accept current truth/reference/projection state.

---

## 13. 重复处理矩阵

| Existing idempotency state | Incoming digest | Required behavior | Output |
|---|---|---|---|
| no existing record | valid digest | `reserve` -> `Reserved`;continue normal flow | success, stored rejection, delayed/failed receipt, or retryable failure |
| completed same operation/key | same digest | `reserve` -> `Duplicate(result_ref)`;rollback current UoW;read stored surface by operation kind and stored kind | replay stored command result / command rejection / inbound receipt / job report |
| completed same operation/key | different digest | `reserve` -> `Conflict`;no domain/job body | duplicate conflict / quarantined / rejected |
| reserved / in-flight same operation/key | same digest | `reserve` maps already-in-progress / unavailable;no mutation | retry later / delayed |
| reserved / in-flight same operation/key | different digest | no mutation;mark conflict only when repository returned formal idempotency ref and Step 12 permits | duplicate conflict |
| completed record points to missing result | same digest | do not recompute from current truth;raise consistency defect | duplicate result missing / manual repair |
| completed record points to wrong result kind | same digest | do not cast, reinterpret or rebuild stored result;raise consistency defect | duplicate result missing / manual repair |
| idempotency store unavailable | any | no business write | dependency unavailable / retry later |
| query repeated | n/a | no idempotency record;perform normal authorized read | current read surface |
| relay publish second worker | n/a | item version conflict or already terminal;do not alter truth | item skipped/failed in batch |

---

## 14. 重入保护表

| 场景 | 重入来源 | 保护方式 | 恢复方式 |
|---|---|---|---|
| Command handler timeout after accepted commit | client retry with same key | completed idempotency points to stored command result | replay stored accepted result;do not append new change/trace/relay |
| Command handler timeout after save-before rejected commit | client retry with same key | completed idempotency points to stored command rejection | replay stored rejected outcome;do not rerun resolver/policy |
| Command retry while first execution in-flight | parallel client retry | reserved same key / already-in-progress | return retryable unavailable;caller retries same key later |
| Command UoW commit status unknown | connection drop / store unknown | same-key reserve outcome and stored result decide | duplicate -> replay;in-flight -> unavailable;manual if no result visibility |
| Stored result save fails before idempotency complete | repository failure | same UoW rollback | retry same key after rollback;no completed record without result |
| Idempotency complete fails after result save within UoW | repository failure | same UoW rollback or commit unknown handling | retry same key;inspect reserve outcome |
| Inbound event redelivery | event bus at-least-once | dedup key + digest + stored receipt | duplicate receipt replay;no resolver/snapshot/stale rewrite |
| Inbound event same dedup key different payload | upstream defect | digest conflict | quarantined/rejected;no snapshot overwrite |
| Unsupported event schema redelivered | unsupported schema | version checked before payload parse | return unsupported receipt;no mutation |
| Relay worker crash after publish before marker update | worker crash | relay item version + downstream idempotency by relay item/payload ref | later scan may retry;truth unchanged;operator reviews duplicates if downstream lacks idempotency |
| Relay duplicate same pending item | dual worker | expected version on marker update | one marker wins;second reports conflict/skipped |
| Projection rebuild crash | worker crash | job key + projection state/version | duplicate key returns old report;new key rebuilds from committed truth |
| Projection stale marker races rebuild | command accepted while rebuild running | cursor monotonicity + state version | newer stale cursor wins;older rebuild cannot mark fresh over newer cursor |
| Reference refresh partial failure | resolver / worker failure | per reference state version and failed refs | new job retries failed refs;successful snapshots preserved |
| Reconciliation job rerun | scheduler/operator | job idempotency for duplicate;report is read-only output | duplicate returns stored report;new key recomputes report without truth repair |
| Archive / observability / sync handoff retry | adapter failure / operator retry | job idempotency + handoff record/material identity | duplicate returns stored report;new key may create new formal handoff attempt |
| Handoff delivery duplicate same key | scheduler duplicate | stored job report replay | no redelivery |

---

## 15. `CommitStatusUnknown` 重入口径

`CommitStatusUnknown` 表示 `ArtifactUnitOfWork` adapter 无法确认 durable commit 是否已应用。任何 handler / runner 都不得用新 idempotency key 盲重试,也不得在返回前执行补偿发布或补偿 truth mutation。

Required sequence:

```text
Input: operation_name, channel_kind, actor_ref, idempotency_key, original stable ArtifactRequestDigest

1. Retry with the same operation context and stable digest.
2. Rebuild the original ArtifactIdempotentOperationContext through ArtifactOperationContextFactory.
3. Call ArtifactIdempotencyRepository.reserve(context, digest, fresh_uow).
4. If Duplicate(result_ref):
     load stored accepted command result / command rejection / inbound receipt / job report by operation kind and stored kind;
     return replay.
5. If Reserved:
     rerun only when formal flow refs prove no accepted truth, relay item, handoff material, projection/reference state change or stored result from the previous attempt is visible;
     otherwise stop and return manual consistency repair rather than mutating.
6. If Conflict:
     return duplicate conflict;do not mutate.
7. If store unavailable:
     return retryable unavailable;do not mutate.
8. If completed idempotency exists but result is missing or wrong kind:
     consistency defect;manual repair.
```

Commit unknown red lines:

- No compensation relay publish, handoff delivery or projection repair may run before idempotency/result inspection.
- A retry with a new idempotency key is a new operation and may duplicate side effects;it is forbidden as commit-unknown recovery.
- If the operation has no formal way to verify prior side effects, recovery must stop at manual consistency repair.

---

## 16. Relay / projection / reference / handoff 细化规则

### 16.1 Relay publication

| Topic | Rule |
|---|---|
| idempotency owner | relay publication does not use `ArtifactIdempotencyRepository`;relay item state/version controls duplicate publication |
| scan | `ArtifactCommittedChangeRelayRepository.list_pending_with_payload(page)` is the only scan surface |
| payload | publisher consumes stored `ArtifactRelayPayloadSnapshot`;no current truth rebuild |
| success marker | `mark_published(relay_item_ref, publication_ref, expected_version, uow)` uses pending item version |
| retryable marker | `mark_retryable(relay_item_ref, reason, expected_version, uow)` uses pending item version |
| failed marker | `mark_failed(relay_item_ref, reason, expected_version, uow)` uses pending item version |
| dual worker | second worker expected_version mismatch affects only item report;it does not create a new event or mutate truth |
| missing snapshot | consistency defect;do not rebuild payload;mark failed/retryable only by formal Step 12/13 policy |

`ArtifactRelayPublisherPort.publish(...)` must return `ArtifactRelayOutcome`. Service can only map outcome variants to `mark_published` / `mark_retryable` / `mark_failed`. Retryable vs terminal classification belongs to publisher adapter / configured publisher policy,not to parsing exception strings.

Current relay port intentionally has no separate `mark_dead_lettered(...)`. A terminal publication failure is represented through `ArtifactRelayOutcome::Failed` and `mark_failed(...)` in this boundary;retry threshold, dead-letter target and operator escalation binding are Step 14 / adapter policy responsibilities,not service-side inference.

### 16.2 Projection stale / rebuild

| Topic | Rule |
|---|---|
| stale source | accepted command / consumer uses formal affected derived state identity only |
| stale cursor | stale marker uses truth/reference cursor from the committing UoW |
| rebuild source | rebuild job only reads committed artifact truth snapshot / reference state / body-free refs |
| concurrency | rebuild save uses view/state expected version |
| cursor monotonicity | a rebuild with older source cursor must not mark fresh over a newer stale cursor |
| duplicate job | duplicate key returns stored report;does not rebuild |
| query | query never rebuilds or marks stale |

### 16.3 Reference snapshot refresh

| Topic | Rule |
|---|---|
| candidate state selection | refresh job uses `ExternalReferenceResolutionStateRepository.list_by_refresh_scope(...)` |
| version source | each item uses `Versioned<ExternalReferenceResolutionState>.version` |
| resolver outcome | only `ArtifactReferenceRefreshResolution<T>` drives resolved/unresolved/failed state transitions |
| application failure | resolver `ApplicationError` becomes item failure/delayed report;it does not mutate business state from error text |
| save rule | refresh success/failure uses expected version;conflict becomes item-level failure/delayed |
| body boundary | resolver returns only refs/summaries/source version/digest/snapshot state |
| duplicate job | stored job report replay;does not resolve refs again |

### 16.4 Handoff

| Topic | Rule |
|---|---|
| job idempotency | every archive/observability/sync handoff job uses job idempotency and stored report |
| material identity | prepared material is keyed by formal `ArtifactHandoffRecordRef` |
| delivery source | delivery adapter consumes prepared material only |
| state update | delivered/retryable/failed record/report are formal handoff outcomes,not artifact truth states |
| retry | duplicate same job key returns stored report;operator retry with new key creates or updates only through formal handoff flow |
| no duplicate delivery | delivered handoff record cannot be delivered again by same state transition;adapter should also use handoff record ref as external idempotency token |
| missing material | consistency defect;do not rebuild material from truth outside handoff job |

---

## 17. 并发与幂等测试切口

| Test cut | Purpose | Layer |
|---|---|---|
| `TC-ART-IDEM-001` | same command key/digest duplicate replays stored accepted result | application service + idempotency fake |
| `TC-ART-IDEM-002` | same command key/different digest returns duplicate conflict, no mutation | application service |
| `TC-ART-IDEM-003` | in-flight same key maps to temporarily unavailable / delayed, no second mutation | idempotency fake |
| `TC-ART-IDEM-004` | digest excludes request id、trace id、requested_at、job run id | contract unit |
| `TC-ART-DUP-RESULT-001` | completed idempotency with missing/wrong result returns consistency defect, no recompute | result store fake |
| `TC-ART-COMMIT-UNKNOWN-001` | retry after commit unknown uses same key and reserve/result replay before mutation | service + fake UoW |
| `TC-ART-CONC-TRUTH-001` | stale `ArtifactRepositoryVersion` on mutable truth returns version conflict | repository fake |
| `TC-ART-CONC-UNIQUE-001` | business unique conflict is not duplicate replay | repository fake + service |
| `TC-ART-EVENT-DEDUP-001` | inbound same dedup key/digest replays stored receipt, no resolver call | consumer service |
| `TC-ART-EVENT-DEDUP-002` | inbound same dedup key/different digest rejected/quarantined | consumer service |
| `TC-ART-EVENT-UNSUPPORTED-001` | unsupported schema does not parse payload and does not mark stale | worker contract |
| `TC-ART-RELAY-CONC-001` | dual relay publisher only one versioned publication marker succeeds | relay fake + service |
| `TC-ART-RELAY-SNAPSHOT-001` | missing relay payload snapshot fails item, no current truth rebuild | relay service |
| `TC-ART-PROJ-CONC-001` | stale marker with newer cursor wins over older rebuild | projection service fake |
| `TC-ART-PROJ-IDEM-001` | duplicate rebuild job returns stored report;does not rebuild | job service |
| `TC-ART-REF-CONC-001` | reference refresh conflict becomes item failure/delayed, no overwrite | reference fake |
| `TC-ART-REF-IDEM-001` | duplicate refresh job returns stored report;does not call resolver | job service |
| `TC-ART-RECON-IDEM-001` | duplicate reconciliation returns stored report;new key recomputes without truth repair | job service |
| `TC-ART-HANDOFF-CONC-001` | delivered handoff cannot be delivered twice under same job key | handoff fake |
| `TC-ART-HANDOFF-IDEM-001` | duplicate handoff job returns stored report;does not redeliver | job service |
| `TC-ART-QUERY-NOWRITE-001` | repeated query performs no idempotency,trace,stale,refresh or rebuild write | query service |

---

## 18. 前序契约回填审计

| Source | Step 13 conclusion | Reopen needed |
|---|---|---|
| Step 7 ports | idempotency reserve/complete/conflict、stored result get/save、versioned truth/projection/reference/relay 读取面已闭合 | no |
| Step 8 protocol | Command/Consumer/Job metadata 均提供幂等键来源;Query 明确 no-write;Job duplicate 有 stored report surface | no |
| Step 9 flows | shared command / consumer / job templates 已按 reserve -> duplicate replay -> mutation -> stored result -> complete 排序 | no |
| Step 10 state matrix | illegal transition、technical states、handoff states、duplicate/retry disposition 已能承接本 Step | no |
| Step 11 persistence | UoW 顺序、version 来源、relay payload snapshot、projection/reference consistency 已闭合 | no |
| Step 12 error recovery | in-flight、missing stored result、commit unknown、duplicate conflict 已有错误映射;本 Step 细化重入顺序 | no |

---

## 19. 回填草稿

以下内容供 Step 19 装配正式 `03-详细设计.md` 时使用,不得在 Step 19 前直接改正式文档。

```markdown
## 12. 并发、幂等与重入保护

### 12.1 幂等入口
- Command、Inbound Consumer 和 Operations Job 必须通过 `ArtifactOperationContextFactory` 构造 `ArtifactIdempotentOperationContext`,然后调用 `ArtifactIdempotencyRepository.reserve(...)`。
- Query 不写 idempotency,不保存 stored result。
- Relay publication 不使用 application idempotency store;它通过 relay item version 控制并发。

### 12.2 Digest
- `ArtifactRequestDigest` 只包含稳定业务输入:operation name、channel、actor scope、command body refs/markers、event source refs/schema/source version、job scope/page/target refs 和影响输出的 expected version。
- Digest 不包含 idempotency key、request id、trace id、job run id、transport delivery attempt、retry counter、随机 id 或当前时间。

### 12.3 Duplicate handling
- same operation + same key + same digest + completed: replay stored command result / command rejection / inbound receipt / job report。
- same operation + same key + different digest: duplicate conflict / quarantined / rejected;no mutation。
- in-flight same key: retryable unavailable / delayed;no second writer。
- completed idempotency missing stored result: consistency defect;no recompute from current truth。

### 12.4 Concurrency
- Mutable truth/support/projection/reference/relay marker writes use `ArtifactRepositoryVersion` from versioned read/list.
- Append-only change/audit/trace/handoff/refresh records are never overwritten.
- Projection rebuild, reference refresh, reconciliation and handoff jobs are reentrant through job idempotency and stored job report,not by rescanning on duplicate.
```

---

## 20. Step 14 handoff

| Step 14 topic | Handoff detail |
|---|---|
| idempotency retention / expiry | define config for retention windows without changing duplicate semantics |
| digest algorithm binding | choose canonical hash/serialization implementation and cross-version compatibility |
| relay retry policy | configure retryable vs terminal thresholds and publisher target binding |
| scheduler/job config | configure page size, retry cadence and disabled job registry |
| handoff target binding | configure archive / observability / sync target idempotency tokens |
| resolver availability | configure resolver endpoints and degraded/unavailable classification |

---

## 21. Stop-review checklist

| Checklist item | 结论 | Evidence |
|---|---|---|
| 并发场景是否覆盖 mutable truth、consumer、relay、projection、reference、handoff | pass | §8 |
| 幂等 key / digest 来源是否闭合 | pass | §9~§12 |
| 16 个 Command 是否有 key/digest matrix | pass | §10 |
| 6 个 Consumer 是否有 key/digest matrix | pass | §11 |
| 6 个 Job 是否有 key/digest matrix | pass | §12 |
| Duplicate same digest / different digest / in-flight / missing result 是否分开 | pass | §13 |
| Commit unknown 重入口径是否闭合 | pass | §15 |
| Relay / projection / reference / handoff reentry 是否闭合 | pass | §16 |
| 并发和幂等是否映射到测试切口 | pass | §17 |

---

## 22. Step 完成记录

| 项目 | 结论 |
|---|---|
| 是否修改正式 `03-详细设计.md` | 否 |
| 是否新增未闭口 enum / port / DTO | 否 |
| 是否沿用 L1-governance 粒度 | 是,按 L1-artifact 自身对象、协议和 relay 命名重写 |
| 是否发现新的标准经验 | 暂无;当前标准已覆盖幂等键、stored result replay、query no-write、payload snapshot 和 consistency defect 的同类经验 |
| 下一步 | Step 14 `03_ddd_step_14_config_external_binding.md`:配置引用与外部依赖绑定 |

---

## 23. 进入下一步条件

Step 13 已完成。进入 Step 14 前需要用户确认:

```text
Step 14 定义配置引用与外部依赖绑定
```
