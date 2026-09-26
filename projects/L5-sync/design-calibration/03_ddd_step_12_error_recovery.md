# Step 12. 错误模型、异常分支与恢复口径

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 12
>
> 本步把 Step 6 的 domain error、Step 7 的 port/UoW error、Step 8 的 protocol surface、Step 9 的 29 条 flow、Step 10 的 forbidden transition 与 Step 11 的 consistency contract 收束成 L5-sync 可实现的错误边界。错误文本、CLI exit code、具体重试次数和真实 DLQ 产品仍未锁定。

## 1. Step 状态与 Step 内计划

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12：错误模型、异常分支与恢复口径 |
| 当前状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 回填位置 | 正式 `03-详细设计.md` §11 错误模型、异常分支与恢复口径；并回填 §7/§8/§9/§10/§12 |
| 本步禁止 | 不写具体 HTTP/RPC code、CLI exit code、实际 retry/backoff、DLQ topic、实现/运行/测试结果 |

### 1.1 分批计划

| 批次 | 范围 | 状态 | 产物 |
|---|---|---|---|
| 12.1 | 错误层级、稳定 code family、redaction 规则 | completed | §5～§7 |
| 12.2 | 10 Command、13 Query、3 Consumer、3 Job 映射 | completed | §8～§9 |
| 12.3 | 异常分支、恢复、unknown/commit ambiguity | completed | §10～§12 |
| 12.4 | quarantine/dead-letter、consistency defects、反例 | completed | §13～§15 |
| 12.5 | 前序闭环、回填草稿、停审 | completed | §16～§19 |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `03_ddd_step_06_object_contracts.md` | `SyncDomainError`、状态 helper、safe summary、unknown 和 forbidden transition。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | `ApplicationPortError`、UoW、repository、SDK/Git/filesystem/probe/handoff adapter 返回边界。 |
| `03_ddd_step_08_protocol_contracts.md` | Command result、Query disposition、Consumer receipt/disposition、Job result。 |
| `03_ddd_step_09_function_flows.md` | 每条 flow 的 pre-effect、post-effect、known/unknown、recovery 分支。 |
| `03_ddd_step_10_state_matrix.md` | 22 条 forbidden transition、terminal/degraded 状态与跨对象传播。 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | version conflict、UoW rollback、stored replay、commit ambiguity、metadata/provenance retention。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 错误、metadata、idempotency、query no-write 与 evidence boundary 的统一审计口径。 |
| `projects/L1-governance/design-calibration/03_ddd_step_12_error_recovery.md` | 仅参考错误层级、映射表、异常分支和恢复表的粒度；不引入 Governance 业务 truth。 |

## 3. SOP 问题回答

| 问题 | L5-sync 回答 |
|---|---|
| 错误分几层？ | `domain` 只返回可判定的 `SyncDomainError`；`application` 将 domain/port/UoW/idempotency 映射为稳定 `SyncApplicationError`；protocol/CLI 将其映射为 result/disposition；adapter raw exception 不得穿透。 |
| 哪些可重试？ | 本地依赖暂时不可用、optimistic version conflict（reload 后）、锁暂不可得可按后续 policy 重试；外部 effect unknown 不可盲重试，只能 probe/reload。 |
| 哪些不可重试？ | invalid input、context mismatch、forbidden body、unsupported capability/schema、terminal/非法 transition、same key 不同 digest、权限明确拒绝。 |
| 哪些需人工？ | completed idempotency 缺 result、commit status unknown 且无法 reload、provenance parent/digest 缺失、`.qs-sync` integrity defect、未知外部 effect 且无正式 probe。 |
| Query 如何报错？ | Query 的 missing/not-visible/blocked/unavailable/degraded 是 read surface，不转成 mutation error，不写 UoW、idempotency、repair 或 probe。 |
| Consumer/Job 如何失败？ | Consumer 返回 typed receipt/disposition；invalid/unsupported/quarantine 不保存 raw payload。Job 返回完整 typed item/report，单项失败不得被 batch success 隐藏。 |

## 4. 当前文档问题诊断与改动前后

| 问题 | 改动前 | 本步收口 |
|---|---|---|
| domain 与 adapter 混层 | `reason: string` 可被误当公开错误 | stable error family + safe code/ref；raw body 永不公开。 |
| unknown | timeout/rejected promise 可能被当成未发生 | effect boundary 由 `OutcomeUnknown`、checkpoint、attempt、probe 显式承接。 |
| duplicate | 只写“幂等”没有缺 result 分支 | same key+digest exact replay；missing/wrong carrier 为 consistency defect。 |
| Query | missing 可能被压成空成功 | `QueryReadDisposition` 与 slice marker 保留 missing/not-visible/degraded。 |
| Consumer/Job | 可能重放 payload 或隐式修复 | envelope 先验证；job per-item；无 auto pull/repair/submit。 |
| provenance | 失败可能删除/重建 metadata | append/protect/IntegrityUnknown，保留历史。 |

## 5. 错误设计原则

1. 预期业务分支使用 discriminated union，不用 exception message 做控制流。
2. domain 不知道 repository、HTTP、Git exit code、SDK body 或 CLI；application 才做层间映射。
3. `invalid_transition`、`context_mismatch`、`invariant_violation`、`blocked`、`unsupported`、`unknown` 是稳定 family；其具体 safe reason 必须是受控 code/ref 集合。
4. 发生或可能发生 external/local effect 后，不得用 rollback 叙事掩盖不确定性；必须保留 attempt/checkpoint/run。
5. 同 key 同 digest duplicate 只回放 stored carrier；不得重新读取 current truth 拼结果、重新调用 SDK/Git/fs/probe 或重新扫描 job。
6. 外部正文、credential、raw stdout/stderr、diff、Artifact/Workspace/Archive body、Review decision body 不进入 error、log、metadata、receipt 或 report。
7. Query、diagnostic read、reconciliation report、integrity scan 不能借错误分支获得隐藏写权限。
8. unknown、blocked、unsupported、not-visible 不等于 accepted、clean、synchronized、review accepted 或 readiness。

## 6. 错误层级与稳定类型

### 6.1 Domain layer

```ts
export type SyncDomainError =
  | { readonly kind: "invalid_input"; readonly field: SyncFieldPath; readonly reasonCode: SyncDomainReasonCode }
  | { readonly kind: "invalid_transition"; readonly subjectRef: OpaqueRef<string>; readonly from: string; readonly to: string }
  | { readonly kind: "context_mismatch"; readonly expectedRef: OpaqueRef<string>; readonly actualRef: OpaqueRef<string> }
  | { readonly kind: "invariant_violation"; readonly ruleCode: SyncInvariantCode; readonly safeSummary: SafeFailureSummary }
  | { readonly kind: "blocked"; readonly blocker: SyncBlockerKind }
  | { readonly kind: "unsupported"; readonly capability: SyncAdapterCapability }
  | { readonly kind: "unknown"; readonly reason: UnknownOutcomeReason };
```

| family | 触发 | recovery class | 禁止 |
|---|---|---|---|
| `invalid_input` | factory 缺 typed ref、空 scope 未获全量语义、路径不 canonical | caller 修正 | 从目录/Git/default latest 补值。 |
| `invalid_transition` | 不在 Step 10 矩阵、terminal reopen、forbidden shortcut | new identity 或显式 recovery | silent no-op、强制改状态。 |
| `context_mismatch` | selection/binding/generation/attempt/ref 不同族 | reload/explicit rebind | 字符串比较或隐式替换。 |
| `invariant_violation` | proof/result/provenance/metadata closure 不成立 | manual/design repair | 继续提交不完整对象。 |
| `blocked` | 上游合同、dirty worktree、archive posture、hard gate 阻塞 | needs-action | local allow cache/default allow。 |
| `unsupported` | adapter/schema/comparator/tool capability 缺失 | configure/upgrade/new operation | 把 unsupported 当 empty/success。 |
| `unknown` | effect 或正式 source outcome 无法判断 | checkpoint + probe/manual | blind retry 或 ACK elevation。 |

### 6.2 Application / port layer

```ts
export type SyncApplicationError =
  | { readonly kind: "validation"; readonly safeCode: SyncValidationCode }
  | { readonly kind: "not_found"; readonly subjectRef: OpaqueRef<string> }
  | { readonly kind: "not_visible"; readonly subjectRef: OpaqueRef<string> }
  | { readonly kind: "domain_rejected"; readonly cause: SyncDomainError }
  | { readonly kind: "version_conflict"; readonly subjectRef: OpaqueRef<string> }
  | { readonly kind: "idempotency_conflict"; readonly identity: SyncIdempotencyIdentity }
  | { readonly kind: "already_in_progress"; readonly identity: SyncIdempotencyIdentity }
  | { readonly kind: "dependency_unavailable"; readonly capability: string; readonly retryability: "unknown" | "temporary" }
  | { readonly kind: "outcome_unknown"; readonly attemptRef: Optional<ExternalAttemptRef>; readonly checkpointRef: RecoveryCheckpointRef }
  | { readonly kind: "duplicate_result_missing"; readonly identity: SyncIdempotencyIdentity }
  | { readonly kind: "commit_status_unknown"; readonly identity: SyncIdempotencyIdentity }
  | { readonly kind: "consistency_defect"; readonly defectCode: SyncConsistencyDefectCode };
```

Port errors map as follows: `not_found→not_found`; `already_exists→domain_rejected` or duplicate branch; `concurrency_conflict→version_conflict`; `generation_mismatch→domain_rejected/context_mismatch`; `integrity_failure→consistency_defect`; `known_denied→domain_rejected`; `unavailable→dependency_unavailable`; `unsupported→blocked/unsupported`; `invalid_external_response→dependency_unavailable` only when no effect occurred, otherwise `outcome_unknown`; `outcome_unknown→outcome_unknown`; `local_io_failure→dependency_unavailable` or `consistency_defect` according to effect boundary.

### 6.3 Stable public dispositions

| surface | allowed values | meaning |
|---|---|---|
| Command | `completed_known`, `no_op_known`, `needs_action`, `conflict`, `blocked`, `cancelled`, `failed_known`, `outcome_unknown` | owning local operation result；不表示 external accepted。 |
| Query | `complete`, `partial`, `missing`, `not_visible`, `blocked`, `unavailable` | read completeness；不推进状态。 |
| Consumer | `processed`, `duplicate`, `no_op`, `quarantined`, `unsupported_version`, `blocked`, `failed_known` | delivery handling；不表示 source event truth。 |
| Job | `completed`, `completed_with_blockers`, `partial`, `duplicate`, `blocked`, `failed_known` | bounded batch result；不表示全局 readiness。 |

## 7. Redaction 与错误 carrier 规则

| carrier | 可包含 | 禁止包含 |
|---|---|---|
| `SafeFailureSummary` | stable code、typed refs、capability、redaction marker | raw exception、path正文、credential、provider response、diff。 |
| `SyncCommandResult` | operation/checkpoint/conflict/provenance refs、next action、safe blockers | success bool、Review accepted、Artifact/Baseline ref fabricated from Git。 |
| Query degraded slice | subject kind/ref、disposition、safe reason | hidden object body、owner private reason、repair result。 |
| Consumer receipt | event id、key、digest、disposition、safe quarantine ref | raw inbound payload/body。 |
| Job item/report | bounded target refs、item disposition、safe failure code、counts | external body、evidence/report verdict、readiness。 |
| diagnostics | correlation、safe code、adapter capability、provenance refs | log/stdout/stderr rehydration、secret、stack trace。 |

## 8. Command 错误映射与恢复矩阵

| Command flow | validation/domain | dependency/concurrency | effect unknown | recovery / 禁止 |
|---|---|---|---|---|
| `CloneWorkingCopyFlow` | missing explicit selection、dirty target、gap/path conflict→`blocked/conflict` | source/fs/Git unavailable→`dependency_unavailable`; stale version→`version_conflict` | apply ambiguous→`outcome_unknown` + run/checkpoint | explicit Resume/Replan/Manual；不 overwrite/merge/rebase/push。 |
| `MigrateSyncMetadataFlow` | unsupported/corrupt manifest→`blocked/needs_action` | generation/version conflict→`version_conflict` | local commit unknown→`commit_status_unknown` | reload generation；不 in-place rewrite/delete old metadata。 |
| `RebindWorkingCopyFlow` | implicit rebind、scope mismatch→`validation/context_mismatch` | owner/path/metadata unavailable→`blocked/dependency_unavailable` | local commit unknown→`commit_status_unknown` | explicit new binding；不静默替换 source/selection。 |
| `PullWorkingCopyFlow` | cursor gap、dirty path、mapping conflict→`conflict/blocked` | source comparator/tool unavailable→`dependency_unavailable` | partial/ambiguous apply→`outcome_unknown` | checkpoint + manual/probe；不 advance cursor、不 blind retry。 |
| `RecordConflictResolutionFlow` | actor/scope/state invalid→`domain_rejected` | version conflict→`version_conflict` | not applicable（intent only） | 只记录 intent；必须另行 Resume。 |
| `ResumeSyncOperationFlow` | stale fingerprint/generation→`needs_action`/`conflict` | reload/version conflict→`version_conflict` | owning branch inherits run/handoff unknown | explicit revalidate/replan/probe/manual；不 NeedsAction→Running shortcut。 |
| `ProbeUnknownOutcomeFlow` | no prior attempt/formal probe→`validation/unsupported` | probe unavailable→`dependency_unavailable` | probe still unknown→`outcome_unknown` | new formal probe/manual；不重放原 submit。 |
| `CancelSyncOperationFlow` | terminal/invalid cancel→`domain_rejected` | local store conflict→`version_conflict` | possible external effect remains explicit | local cancel only；不 remote cancel/rollback claim。 |
| `PushReviewCandidateFlow` | drift/conflict/permission→`blocked/conflict` | handoff adapter unavailable→`dependency_unavailable` | timeout/lost response→`outcome_unknown` | Probe/Refresh；ACK 不等 accepted，不 push Git。 |
| `RefreshReviewHandoffStatusFlow` | missing attempt/external ref→`not_found/blocked` | read/probe unavailable→`dependency_unavailable` | read remains unknown→`outcome_unknown` | later explicit refresh/probe；不写 Gate/Decision。 |

Protocol mapping: `validation/not_found/not_visible→SyncProtocolError`; domain `blocked/conflict/needs_action` stays in typed command result when an operation exists; pre-operation envelope/authority errors return protocol rejection. `outcome_unknown` always carries durable attempt/checkpoint refs. No command branch returns `accepted=true`.

## 9. Query、Consumer、Job 映射

### 9.1 Query no-write matrix

| Query group | missing / denied | unavailable / corrupt | recovery |
|---|---|---|---|
| CP1 access/operation | `missing` or `not_visible` slice | `partial/unavailable` safe slice | caller re-query or explicit command；no owner refresh。 |
| CP2 binding/metadata/observation | binding/manifest missing explicit；dirty observation is a view | tool/schema unavailable marker | explicit migrate/rebind/inspect; no persist repair。 |
| CP3 materialization | plan/run/cursor missing or partial | pending-finalize/unknown visible as such | Resume command only；query no apply。 |
| CP4 conflict/recovery | conflict/checkpoint absent/not-visible | probe/read unavailable marker | RecordResolution/Resume/Probe command。 |
| CP5 handoff/provenance/diagnostic | missing external snapshot/parent is visible degraded | `IntegrityUnknown`/unavailable slice | explicit probe/repair design; no synthesis/delete。 |

### 9.2 Conditional Consumer matrix

| Consumer | invalid/unsupported | duplicate | accepted branch | forbidden |
|---|---|---|---|---|
| access/posture invalidated | reject/quarantine before payload trust | exact `StoredConsumerReceipt` replay | conservative snapshot/evaluation/plan/candidate transitions + provenance | cancel running effect、pull、handoff、raw body。 |
| material source invalidated | reject/quarantine/ambiguous blocked | receipt replay | cursor→Unknown、plan/candidate→Invalidated | auto pull/rollback/delete/overwrite。 |
| review decision changed | source/schema/ref mismatch quarantine | receipt replay | body-free owner snapshot + exact handoff attempt relation | create Gate/Decision、elevate ACK、new handoff。 |

### 9.3 Job matrix

| Job | fatal input | item failure | duplicate | recovery |
|---|---|---|---|---|
| `ScanMetadataIntegrity` | invalid scope/page→`blocked` | item integrity/concurrency failure stored | replay full typed report | later explicit scan; no auto repair/migrate/rebind。 |
| `ProbePendingHandoffAttempts` | invalid scope or missing formal probe→`blocked` | known/unknown/unsupported item preserved | replay report; no probe | new authorized probe run; no submit。 |
| `MarkStaleOwnerSnapshots` | invalid filter/scope→`blocked` | version/unavailable item partial | replay report | later re-evaluate; no owner refresh/non-fresh→Fresh。 |

## 10. 异常分支处理表

| 场景 | 检测点 | 必须做 | 禁止做 |
|---|---|---|---|
| validation before reserve | entry validator | return stable rejection；不 begin UoW | 从 path/default/cache 猜值。 |
| idempotency duplicate same digest | reserve | rollback transient UoW，load exact carrier，replay | rerun domain/effect。 |
| same key different digest | reserve | `idempotency_conflict` | 覆盖原 reservation。 |
| in-flight reservation | reserve | delayed/already-in-progress | 第二 writer。 |
| domain rejection | domain helper | rollback；safe result if policy requires | success trace/provenance/ACK。 |
| version conflict | repository save | rollback；reload only under explicit retry policy | stale overwrite。 |
| UoW begin/rollback failure | UoW port | dependency/consistency defect；preserve correlation | hidden compensation。 |
| commit known failure | commit | no external claim；return known failure | mark applied/finalized。 |
| commit status unknown | commit | original key/digest reload idempotency/result/subject | new key blind retry。 |
| external call rejected before effect known | adapter result | known failure only when adapter proves no effect | infer no effect from timeout/error text。 |
| external call ambiguous | adapter result | attempt/checkpoint unknown + probe required | retry submit/push/apply。 |
| missing proof/transition/result/provenance | repository read | consistency defect; block dependent mutation | fabricate temp ref。 |
| missing payload/body boundary violation | decoder | reject/quarantine; safe marker only | persist body for diagnosis。 |
| Query read failure | read port | degraded/unavailable surface | repair/write/probe in query。 |
| Job item failure | item UoW | preserve item failure in stored report | hide behind batch success。 |

## 11. 恢复口径

| 分类 | 可重试条件 | 恢复动作 | 不能做 |
|---|---|---|---|
| temporary local dependency | no external effect started; same digest | retry same key after availability | switch key to bypass dedup。 |
| version conflict | fresh reload and policy still valid | reload Versioned<T>, re-evaluate, retry bounded write | overwrite without version。 |
| dirty/path/source conflict | explicit user/manual decision | record/validate resolution then new Resume | stash/merge/rebase/overwrite。 |
| local partial/unknown | checkpoint and run retained | inspect/probe/replan; new run where required | mark old run Finalized。 |
| external handoff unknown | formal probe capability exists | ProbeRecord prepare→probe→finalize | resubmit original candidate。 |
| unsupported capability/schema | contract/config can be upgraded | new operation after capability confirmed | treat as empty/known failure. |
| stored result missing | never auto | manual consistency repair / design rollback | reconstruct from current truth。 |
| provenance integrity unknown | never auto | expose degraded, block dependent mutation | synthesize parent/digest or delete。 |
| commit unknown | same key only | reload reservation/result/attempt/checkpoint | new key or compensating push。 |

## 12. Quarantine / delayed / dead-letter semantics

| surface | meaning | persisted content | retry |
|---|---|---|---|
| `quarantined` | source/ref/order/body cannot be trusted | event id, digest, safe reason/ref only | explicit operator/source correction；不解析 raw body。 |
| `unsupported_version` | schema not supported | version, event id, safe capability | after handler upgrade；不 parse payload。 |
| `delayed` | temporary dependency or in-flight reservation | safe key/ref/status | retry same key under Step 13 policy。 |
| `failed_known` | effect boundary known and failed | safe failure + actual local state | new explicit operation if appropriate。 |
| `outcome_unknown` | effect may have happened | attempt/checkpoint/probe refs | formal probe/manual only。 |
| dead-letter (technical) | terminal transport handling for event/attempt, not business truth | body-free marker | manual/source/config recovery；never imply accepted/rejected owner truth。 |

## 13. Consistency defect catalog

| defect | required response |
|---|---|
| idempotency completed but stored result/receipt/job result missing | `duplicate_result_missing` + manual intervention；no recompute。 |
| transition/proof/result/invocation ref missing or wrong union family | `consistency_defect`；block dependent mutation。 |
| `.qs-sync` generation/manifest/cursor/mapping ref dangling | metadata health degraded/blocked；preserve old records。 |
| provenance parent/digest missing | mark `IntegrityUnknown` if owning flow allows; never fabricate/delete。 |
| commit unknown with no replay carrier | manual reconciliation; no new key/effect。 |
| external attempt has no invocation identity | consistency defect; cannot call/probe from guessed ref。 |
| consumer receipt points to raw payload | boundary defect; quarantine/redaction remediation。 |
| query can invoke write port | composition defect; fail build/design audit。 |
| job report omits failed/unknown item | report consistency defect; batch not complete。 |

## 14. Error anti-patterns

| anti-pattern | why invalid | correct rule |
|---|---|---|
| catch-all `Error`→`failed` | hides effect boundary and recovery | typed mapping with known/unknown split。 |
| timeout→not happened | timeout cannot prove absence | attempt unknown + probe required。 |
| ACK/HTTP 2xx→accepted | transport is not Review Decision | layered handoff result。 |
| duplicate→rerun | repeats side effects | exact stored replay。 |
| Query missing→empty clean | hides incomplete read | explicit missing/degraded marker。 |
| error log contains body/secret | provenance/security breach | safe code/ref/redaction marker。 |
| consumer parses unsupported event | violates version gate | reject before payload parse。 |
| job repairs corrupt metadata automatically | crosses command boundary | report conservative state, explicit migration command。 |
| missing provenance→new fake parent | falsifies lineage | IntegrityUnknown + block。 |
| retry with new key after commit unknown | can duplicate external effect | original key/digest reload first。 |

## 15. 前序契约回填与跨步审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| Step 6 domain error 已有 application 映射 | pass | `SyncDomainError` family 全部进入 §6/§8。 |
| Step 7 port/UoW errors 有 retryability | pass_with_blockers | version conflict/unavailable/unknown/consistency 已分类；exact adapter contracts仍受上游 blocker。 |
| Step 8 public result/disposition 被使用 | pass | 10 Command、13 Query、3 Consumer、3 Job 分别有 surface。 |
| Step 9 每条 flow 异常分支有归属 | pass | pre-effect、post-effect、unknown、query no-write均列出。 |
| Step 10 forbidden transitions 有稳定 error | pass | invalid transition/context/invariant/blocked/unsupported 映射闭合。 |
| Step 11 commit/replay consistency 有恢复 | pass | original key reload、missing carrier manual、no blind replay。 |
| raw body/provenance boundary | pass | error、receipt、report、diagnostic均 body-free。 |
| implementation/test evidence | not applicable | 本步未实现、未运行、未产生证据。 |

## 16. 回填草稿

> 校准来源：
> - `projects/L5-sync/design-calibration/03_ddd_step_12_error_recovery.md`
>
> 延伸阅读：
> - §6 “错误层级与稳定类型”、§8 “Command 映射”、§9 “Query/Consumer/Job 映射”、§10 “异常分支”、§11 “恢复口径”、§13 “Consistency defect catalog”。

### 正式 §11 摘录草稿

L5-sync 采用 domain → application/port → protocol/disposition 的分层错误模型。非法状态、上下文不匹配、完整性破坏、hard blocker、unsupported 与 unknown 均为 typed family；adapter raw exception、provider body、Git stdout/stderr 和 credential 不得穿透。Command 的 known local outcome、needs-action、conflict、blocked 与 outcome-unknown 必须回指 operation/run/attempt/checkpoint；Query 以 missing/not-visible/degraded/unavailable surface 表达读取不完整，永不隐式修复。

External/local effect 均遵循“已知失败才可 failed-known；无法证明是否发生则 outcome-unknown”。后者必须持久化 attempt/checkpoint 并走正式 probe 或人工决策，不能换新 idempotency key 盲重放。Consumer 在 envelope/schema/source/digest 验证前不信任 payload，invalid/unsupported/ambiguous 只产生 body-free quarantine/rejection；Job 保存完整 per-item report，不能把 partial/unknown 隐藏为 completed。

## 17. 待确认事项

| ID | 事项 | 影响 | 未确认前 |
|---|---|---|---|
| `SYNC-UP-001/003` | owner SDK、权限/archive posture | positive eligibility/decision mapping | blocked/unknown fail-closed。 |
| `SYNC-UP-002/008` | source authority、cursor/comparator/gap | clone/pull positive recovery | no safe advance；needs-action。 |
| `SYNC-UP-004/005` | handoff/Decision/probe/idempotency equivalence | unknown closure | probe-required；no resubmit。 |
| `SYNC-UP-006` | metadata physical schema/integrity/retention | persistence error mapping detail | logical defect only；no DDL claim。 |
| `SYNC-UP-007/009/010` | Git mapping/LFS/shallow/GUI/dirty path | adapter error/unsupported details | local bounded seam；historical choices pending。 |
| `SYNC-LOCAL-001~005` | Node/package/parser/validator/test/tool/SDK choices | runtime error wiring | planned/not_created。 |

## 18. 进入 Step 13 条件与停审记录

- [x] Domain/application/port/protocol/consumer/job 错误层级已明确。
- [x] 10 Command、13 Query、3 Consumer、3 Job 的错误与恢复映射已覆盖。
- [x] known failure、unknown effect、duplicate、version conflict、commit ambiguity 已区分。
- [x] quarantine/delayed/dead-letter 不被解释为 owner truth 或 readiness。
- [x] raw body/secret/provenance fabrication、auto Git/merge/rebase/push/overwrite 均被禁止。
- [x] 没有写入实现、测试运行结果、artifact/report/evidence/verdict/signoff/readiness。

结论：Step 12 `completed / stop_review`，`gate_status=pass_with_upstream_blockers`。允许进入 Step 13；正式 03 仍不可写。
