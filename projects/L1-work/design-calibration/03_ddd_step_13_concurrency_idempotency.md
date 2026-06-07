# Step 13. 定义并发、幂等与重入保护

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 13
- 回填章节:`03-详细设计.md` §5.12 并发、幂等与重入保护 / §8 事务与一致性 / §11 错误恢复

### 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_08_protocol_contracts.md` | Command / Query / Event / Job metadata、dedup、result schema | 固定幂等键来源和对外重复处理 |
| `03_ddd_step_09_function_flows.md` | 写路径 UoW、reserve / complete、duplicate flow | 固定幂等检查和事务顺序 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | optimistic version、唯一键、outbox / projection / reference 恢复 | 固定并发冲突资源和控制方式 |
| `03_ddd_step_12_error_recovery.md` | `VersionConflict`、`IdempotencyConflict`、`CommitStatusUnknown` | 固定错误映射和恢复口径 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 幂等 key / digest / result_ref / UoW 门禁 | 检查实现者是否仍需自行猜规则 |

### 3. 分批写入记录

本 Step 按 `设计文档讨论中间产物规范.md` §3.4 分批写入:

| 批次 | 内容 | 状态 |
|---|---|---|
| 13.1 | 文件骨架、SOP 问题回答、当前问题诊断 | [x] |
| 13.2 | 并发场景表、幂等键表、重复处理表 | [x] |
| 13.3 | 重入保护、commit unknown 审计和测试切口 | [x] |
| 13.4 | 前序回填、回填草稿、待确认事项和进入下一步条件 | [x] |

### 4. SOP 问题回答

1. 哪些处理流可能并发修改同一资源?

   回答:所有 Command 写路径、Inbound Event Consumer 写本地 snapshot / reference state、Operations Job 写 outbox / projection / reference / handoff marker 都可能并发。冲突资源包括 Work truth record version、active unique key、outbox record version、projection freshness cursor、reference state version、idempotency `(operation, key)` 记录。

2. 哪些接口、事件或 job 可能被重复调用?

   回答:所有 Command 可能因客户端重试重复;Inbound Event 可能因 source ack 丢失或 bus redelivery 重复;Operations Job 可能因调度器重跑、worker crash 或人工重试重复。Query 是只读入口,不要求幂等记录。

3. 幂等键来自请求、事件、job 参数还是数据库唯一约束?

   回答:Command 和 Job 的幂等键来自 core `CommandMetadata.request.idempotency_key`;Inbound Event dedup key 来自 `topic + source_event_id + source_ref`;outbox 单条发布以 `WorkOutboxId + expected_version` 控制并发,`expected_version` 来自 `list_pending(page)` / `get(outbox_id)` 返回的 `Versioned<WorkOutboxRecord>`,不使用 public idempotency key;数据库唯一键只防止同一 business key 被并发创建,不能替代 idempotency result replay。

4. 重复请求应该返回既有结果、跳过、覆盖还是报错?

   回答:same key + same digest + completed 返回既有 `ApplicationResultRef` 对应 result / report surface;in-flight same key 返回 temporarily unavailable / retry later;same key + different digest 返回 `IdempotencyConflict`;duplicate inbound event same digest 返回 `AckDuplicate`;outbox publish version conflict 视为另一 worker 已处理,不覆盖。

5. 并发冲突如何测试?

   回答:Step 16 必须为 idempotency duplicate / conflict / in-flight、optimistic version conflict、unique key conflict、event redelivery、outbox dual publisher、projection stale vs rebuild、reference refresh race 和 commit unknown retry 建立独立测试切口。

### 5. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 7 `IdempotencyRepository` | Step 12 要求 commit unknown 先查幂等结果,但原 trait 只有 reserve / complete / mark_conflict | 回填只读 `get(key, operation)` |
| Step 9 digest 示例 | 旧示例把 `metadata` 整体传入 digest,容易把 `request_id`、`requested_at`、trace 算进去 | 回填为 stable business input / stable job input |
| Step 11 commit unknown open item | 只写需要 idempotency audit,未给 retry 前读取规则 | 本 Step 固定 `get` 审计和 reserved unknown 处理 |
| Step 8 / 9 duplicate 口径 | 已说明 duplicate 返回 stored result / report,但未区分 in-flight / completed / conflict,也未定义 `ApplicationResultRef` 如何读回 command result 或 job report surface | 本 Step 增加重复处理矩阵,并回填 `CommandResultRepository` / `JobResultRepository` 读取面 |
| outbox / projection / reference job | 已有 failed marker,但未说明双 worker / crash 重入保护 | 本 Step 增加重入保护表 |

### 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 幂等 port | 只能 reserve / complete / conflict | 增加只读 `get` | 支撑 duplicate recovery 和 commit-status audit |
| duplicate result replay | `IdempotencyRepository` 只保存 `ApplicationResultRef`,但没有 result / report surface loader | 新增 `CommandResultRepository.save_result/get_result` 和 `JobResultRepository.save_report/get_report` | 支撑 same digest duplicate 返回既有 DTO / report,避免从当前 truth / projection / outbox 重算 |
| RequestDigest | 只说 canonical payload | 明确 stable input,排除易变 metadata | 防止同一业务请求重试误判 conflict |
| 重复请求 | 分散在 Step 8 / 9 / 12 | 按 completed / in-flight / conflict 统一 | 支撑 service tests |
| 并发冲突 | Step 11 有 version / unique key | 本 Step 映射到具体场景和测试切口 | 支撑 Step 16 |
| job 重跑 | 只有 job idempotency key 必填 | 增加 job duplicate / partial failure / crash replay 行为 | 支撑 runner 和 fake adapter |

### 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只靠数据库唯一键防重复 | adapter 简单 | 无法返回既有 result,也无法区分 same digest / different digest | 不采用 |
| 所有重复都重放 domain transition | 代码直观 | 破坏 outbox / trace / version,可能重复创建 truth | 不采用 |
| `(operation, key)` + canonical digest + result_ref | 可返回既有结果,冲突可判定 | 需要 idempotency store | 采用 |
| `ApplicationResultRef` 指向独立 result store | duplicate 可按原 DTO / report 返回,不受当前 truth / projection / outbox 漂移影响 | 需要同 UoW 保存 result surface | 采用 |
| duplicate 时从当前 truth repository 重构 result | 不需要额外存储 | state 可能已变化,也无法保证 trace / outbox refs 与原返回一致 | 不采用 |
| digest 包含全部 metadata | 实现省事 | 重试时 request_id / trace / timestamp 变化会误判 conflict | 不采用 |
| digest 只包含稳定业务输入 | 符合重试语义 | 需要明确排除字段 | 采用 |
| commit unknown 自动修复 idempotency | 用户体验好 | 需要额外 durable repair API 和更复杂审计 | P0 不采用;只读审计 + reconciliation report |

### 8. 结构化中间产物

#### 8.1 并发与幂等总原则

| 规则 | 正式口径 |
|---|---|
| 幂等作用域 | `operation + idempotency_key` 唯一。不同 operation 可以使用同一 key 字符串,但不能共享 result。 |
| digest 作用 | `RequestDigest` 只用于判定同一 key 下是否同一业务输入,不能作为 authorization 或 visibility truth。 |
| digest 输入 | Command digest 包含 operation、route-bound resource ids、actor principal / effective scope、command body 中影响结果的字段。Job digest 包含 operation、job scope、page / batch input 和影响结果的参数。Inbound event digest 包含 topic、source envelope stable refs、schema version 和 payload digest。 |
| digest 排除 | 不包含 `idempotency_key`、`request_id`、`requested_at`、`trace_id`、`job_run_id`、transport headers、runtime retry counter。 |
| duplicate 成功 | completed same digest:Command 通过 `CommandResultRepository.get_result(ApplicationResultRef)` 返回 stored result surface;Job 通过 `JobResultRepository.get_report(ApplicationResultRef)` 返回 stored report surface;不重放 domain transition 或 job side effect。 |
| duplicate in-flight | same key 正在处理或处于 reserved unknown 时,返回 `TemporarilyUnavailable` / retry later,不执行业务写。 |
| conflict | same key + different digest 返回 `IdempotencyConflict`,不得写 business truth、trace 或 outbox。 |
| Query | Query 只读,不写 idempotency record,重复读取不改变状态。 |
| version conflict | optimistic version mismatch 返回 `VersionConflict`,调用方 reload 后用同一业务意图和同一 idempotency key 重试。 |
| unique key conflict | create path business key 冲突不是 duplicate result replay;除非 idempotency duplicate 命中,否则映射为 conflict / domain reject。 |

#### 8.2 并发场景表

| 场景 | 冲突资源 | 控制方式 | 失败错误 | 测试切口 |
|---|---|---|---|---|
| 同一 Command 被客户端并发重试 | `idempotency_records(operation,key)` | atomic reserve + digest compare | `AlreadyReserved` -> `TemporarilyUnavailable`;different digest -> `IdempotencyConflict` | `TC-WORK-IDEM-001/002/003` |
| `CreateProjectFlow` 并发创建同一 project id | `projects.project_id`、`backlogs.project_id` | create uniqueness + same UoW | `RepositoryError::Conflict` -> `DomainRejected` or `VersionConflict` by adapter | `TC-WORK-CONC-PROJECT-001` |
| `CreateProjectFlow` 并发使用同一 owner ref | optional `projects.owner_ref` unique policy | 若启用唯一约束,adapter 返回 conflict;若未启用,不作为并发冲突 | `DomainRejected` / open policy | `TC-WORK-CONC-PROJECT-002` |
| Project lifecycle 并发更新 | `Project.version`、archive path `Backlog.version` | optimistic version,同 UoW 保存 Project + Backlog | `VersionConflict` | `TC-WORK-CONC-PROJECT-003` |
| Backlog availability 与 Work create 并发 | `Backlog.version`、`backlog_formal_work` membership | Backlog expected version + membership uniqueness | `VersionConflict` / `DomainRejected` | `TC-WORK-CONC-BACKLOG-001` |
| 同一成员并发 assign / responsibility update | `project_members(project_id,member_ref)`、`ProjectMember.version` | active unique key + optimistic version | conflict / `VersionConflict` | `TC-WORK-CONC-MEMBER-001` |
| Work lifecycle 并发更新 | `WorkItem.version` or `ChildWorkItem.version` | expected version | `VersionConflict` | `TC-WORK-CONC-WORK-001` |
| Promote review 并发 accept / reject | `PromoteResult.version`、optional created Work id / membership | expected version;accept path同 UoW 创建 Work | `VersionConflict` | `TC-WORK-CONC-PROMOTE-001` |
| dependency edge 并发 link | active edge unique `(upstream,downstream)`、graph snapshot | unique key + graph policy + expected version | conflict / `DomainRejected` | `TC-WORK-CONC-DEP-001` |
| dependency / blocker 并发状态更新 | relation version、change record id | expected version + append-only change id | `VersionConflict` | `TC-WORK-CONC-DEP-002` |
| iteration commit 与 lifecycle update 并发 | `Iteration.version`、`IterationCommitment.version`、work versions | same UoW + expected versions | `VersionConflict` | `TC-WORK-CONC-ITER-001` |
| 同一 inbound event 重投递 | `idempotency_records(operation,dedup_key)` | dedup key `topic + source_event_id + source_ref` | duplicate -> `AckDuplicate`;different digest -> `DeadLetter` | `TC-WORK-EVENT-DEDUP-001` |
| 两个 publisher 发布同一 outbox record | `Versioned<WorkOutboxRecord>.version`、`publication_state` | `list_pending(page)` / `get(outbox_id)` 提供 current version;`mark_published/mark_failed` 使用同一 item version | version conflict treated as already handled / report item conflict | `TC-WORK-OUTBOX-CONC-001` |
| projection rebuild 与 command stale marker 并发 | `DerivedWorkViewState.version`、`source_cursor` | cursor monotonicity + optimistic marker update | older cursor no-op or `VersionConflict` retry | `TC-WORK-PROJ-CONC-001` |
| 两个 rebuild job 同一 projection_set | `idempotency_records`、projection batch key、freshness version | job key dedup + replace batch atomic by project/projection_set | duplicate report / `VersionConflict` | `TC-WORK-PROJ-CONC-002` |
| reference refresh 同一 external ref | `ReferenceResolutionState.version`、snapshot key | expected version 来自 `ReferenceSnapshotRepository.get_reference_state_with_version(...)`;snapshot 更新使用对应 `*_snapshot_with_version`;last successful snapshot preserved | `VersionConflict` / failed marker | `TC-WORK-REF-CONC-001` |
| handoff job 并发处理同一 marker | handoff marker key/version | job idempotency + marker version | duplicate report / `VersionConflict` | `TC-WORK-HANDOFF-CONC-001` |

#### 8.3 幂等键表

| 接口 / Job / Event | 幂等键 | 幂等窗口 | 重复请求处理 |
|---|---|---|---|
| 所有 Command: Project / Backlog / Member / Work / Promote / Dependency / Blocker / Iteration | `CommandMetadata.request.idempotency_key`,作用域为 operation | 至少覆盖客户端 retry 和服务端超时恢复窗口;具体保留期 Step 14 配置化 | completed same digest 通过 `CommandResultRepository` 返回既有 result;in-flight retry later;different digest `IdempotencyConflict` |
| `ConsumeIdentityMemberChanged` | `identity.member.changed.v1 + source_event_id + source_ref` | event dedup 保留期 | same digest `AckDuplicate`;different digest `DeadLetter` |
| `ConsumeMethodDefinitionChanged` | `method.definition.changed.v1 + source_event_id + source_ref` | event dedup 保留期 | same digest `AckDuplicate`;different digest `DeadLetter` |
| `ConsumeConversationWorkContextChanged` | `conversation.work_context.changed.v1 + source_event_id + source_ref` | event dedup 保留期 | same digest `AckDuplicate`;different digest `DeadLetter` |
| `ConsumeRuntimePromoteRequested` | `runtime.promote.requested.v1 + source_event_id + source_ref` | event dedup 保留期 | same digest skip;different digest dead-letter |
| `ConsumeGovernanceEvidenceChanged` | `governance.evidence.changed.v1 + source_event_id + source_ref` | event dedup 保留期 | same digest skip;different digest dead-letter |
| `ConsumeArchiveHandoffChanged` | `archive.handoff.changed.v1 + source_event_id + source_ref` | event dedup 保留期 | same digest skip;different digest dead-letter |
| `ConsumeArtifactEvidenceChanged` | `artifact.evidence.changed.v1 + source_event_id + source_ref` | event dedup 保留期 | same digest skip;different digest dead-letter |
| `PublishWorkOutbox` job | `WorkJobMetadata.command_metadata.request.idempotency_key`,operation `PublishWorkOutbox` | job retry window | duplicate returns stored `WorkJobReport` via `JobResultRepository.get_report`;per-record publish still protected by outbox version |
| `RebuildWorkProjections` job | job metadata key + operation | job retry window | duplicate returns stored report via `JobResultRepository.get_report`;new key may rerun from committed truth |
| `RefreshExternalReferenceSnapshots` job | job metadata key + operation | job retry window | duplicate returns stored report via `JobResultRepository.get_report`;new key may retry failed refs |
| `RunWorkReconciliation` job | job metadata key + operation | job retry window | duplicate returns stored `ReconciliationReport` via `JobResultRepository.get_report`;does not repair truth |
| `PrepareWorkTraceHandoff` job | job metadata key + operation | job retry window | duplicate returns stored report / marker ref via `JobResultRepository.get_report` |
| `PrepareArchiveHandoff` job | job metadata key + operation | job retry window | duplicate returns stored report / marker ref via `JobResultRepository.get_report` |
| Outbound event publication per record | `WorkOutboxId` + expected `Version`,not `IdempotencyRepository` key | outbox record lifetime | second publisher observes version conflict or already published;no new truth write |
| Query | none | none | repeated read returns current authorized surface;no idempotency record |

#### 8.4 幂等记录状态与重复处理矩阵

| Existing record state | Incoming digest | Service 行为 | 对外结果 |
|---|---|---|---|
| none | any | `reserve` -> `Reserved`,继续执行业务写 | success or normal error |
| `Reserved` same operation/key | same digest | 不执行业务写;视为 in-flight / unknown | `TemporarilyUnavailable`,调用方稍后用同 key retry |
| `Reserved` same operation/key | different digest | 不执行业务写;`mark_conflict` when possible | `IdempotencyConflict` |
| `Completed` with `result_ref` | same digest | Command: `CommandResultRepository.get_result(result_ref)` and match expected result kind;Job: `JobResultRepository.get_report(result_ref)` and match expected report kind | 返回既有 result / report surface,receipt 标记 duplicate when present |
| `Completed` with `result_ref` but stored surface missing / wrong kind | same digest | 不执行业务写 / 不重跑 job;进入 duplicate result missing | `TemporarilyUnavailable` + reconciliation required |
| `Completed` without `result_ref` | same digest | 不执行业务写;进入 duplicate result missing | `TemporarilyUnavailable` + reconciliation required |
| `Completed` | different digest | 不执行业务写 | `IdempotencyConflict` |
| `Conflict` | any | 不执行业务写 | `IdempotencyConflict` |
| store unavailable | any | 不执行业务写 | `TemporarilyUnavailable` / retry same key |

#### 8.5 重入保护表

| 场景 | 重入来源 | 保护方式 | 恢复方式 |
|---|---|---|---|
| Command handler 超时后客户端重试 | HTTP/RPC timeout | same idempotency key + digest;completed 后通过 `CommandResultRepository` 读取 stored result | 客户端使用同 key retry;不同输入必须换 key |
| Command UoW commit unknown 后重试 | adapter commit 返回 unknown | retry 前调用 `IdempotencyRepository.get(key, operation)`;completed 后再读 `CommandResultRepository` | completed 返回 stored result;reserved unknown 返回 `TemporarilyUnavailable` 并交 reconciliation |
| Event ack 丢失后 redelivery | bus / source redelivery | event dedup key + digest | same digest `AckDuplicate`;different digest dead-letter |
| Job worker crash 后 scheduler 重跑 | job runner retry | job idempotency key + stable job digest;completed 后通过 `JobResultRepository` 读取 stored report | same key duplicate report;new key按 item-level marker / version 继续 |
| Outbox publish 成功但 mark_published 失败 | worker crash or repo failure | outbox remains Pending or Failed;next publish reloads `Versioned<WorkOutboxRecord>` by pending page or `get(outbox_id)` | at-least-once publish;downstream需按 event id / outbox id 去重;本仓版本化 mark |
| Projection rebuild crash after `Rebuilding` | worker crash | freshness marker + source_cursor + job key | rerun rebuild from committed truth;query surfaces `Rebuilding` / `Stale` |
| Projection rebuild with older cursor | delayed job | cursor monotonicity | older cursor no-op or version conflict retry;不得覆盖 fresh newer view |
| Reference refresh partial success | resolver or worker failure | per-reference version and failed marker | rerun refresh;successful snapshots preserved |
| Handoff marker write after port failure | handoff adapter retry | marker version + job idempotency | failed report;retry same or new job key by operator policy |
| Reconciliation rerun | scheduled job / operator | read-only report + job idempotency | duplicate returns report;new run recomputes current drift |

#### 8.6 `CommitStatusUnknown` 审计口径

`CommitStatusUnknown` 只表示本地 durable adapter 无法确认 commit 是否已应用。handler / runner 不得在返回前发布外部事件,也不得直接重放 domain transition。

重试或人工排查必须按以下顺序执行:

```text
Input: operation, idempotency_key, original stable RequestDigest

1. IdempotencyRepository.get(idempotency_key, operation)
2. if record == None:
     reserve normally and retry only if adapter confirms previous UoW did not commit
3. if record.status == Completed and digest matches and result_ref exists:
     result = if operation is Command:
         CommandResultRepository.get_result(result_ref)
       else if operation is Job:
         JobResultRepository.get_report(result_ref)
     if result exists and matches operation result/report kind:
         return result/report with duplicate receipt overlay when present
     else:
         return TemporarilyUnavailable; raise DuplicateResultMissing
4. if record.status == Completed and digest matches but result_ref missing:
     return TemporarilyUnavailable; raise DuplicateResultMissing
5. if record.status == Reserved and digest matches:
     do not execute business write; return TemporarilyUnavailable; reconciliation required
6. if digest differs or status == Conflict:
     return IdempotencyConflict
```

P0 只要求只读审计和拒绝盲重试。自动将 `Reserved` unknown 修复为 `Completed` 或清理为可重试状态需要额外 durable repair contract,不在本 Step 自行补出。

#### 8.7 并发与幂等测试切口

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `TC-WORK-IDEM-001` | duplicate same digest | second request 通过 `CommandResultRepository.get_result` 返回同 result_ref,无新 truth / trace / outbox | application service |
| `TC-WORK-IDEM-002` | same key different digest | 返回 `IdempotencyConflict`,无业务写 | application service |
| `TC-WORK-IDEM-003` | in-flight reserved | 返回 `TemporarilyUnavailable`,不重放 domain | idempotency fake |
| `TC-WORK-IDEM-004` | digest excludes volatile metadata | same body with different request_id / trace / timestamp 仍 same digest | contract unit |
| `TC-WORK-CONC-001` | optimistic version | stale expected version 返回 `VersionConflict` | repository fake + service |
| `TC-WORK-CONC-002` | unique create conflict | duplicate business key 不覆盖 existing truth | repository fake |
| `TC-WORK-EVENT-DEDUP-001` | inbound redelivery | same event key + digest -> `AckDuplicate` | worker service |
| `TC-WORK-EVENT-DEDUP-002` | inbound digest conflict | same event key + different payload -> dead-letter / conflict | worker service |
| `TC-WORK-JOB-IDEM-001` | job duplicate | duplicate job key returns stored report through `JobResultRepository.get_report`;does not rerun scan / publish / handoff | jobs service |
| `TC-WORK-OUTBOX-CONC-001` | dual publisher | one mark succeeds, other version conflict does not republish truth | infra fake |
| `TC-WORK-PROJ-CONC-001` | stale vs rebuild | older cursor cannot overwrite newer projection freshness | projection fake |
| `TC-WORK-REF-CONC-001` | reference refresh race | version conflict preserves last good snapshot | reference fake |
| `TC-WORK-COMMIT-UNKNOWN-001` | commit unknown retry | retry calls `IdempotencyRepository.get` before reserve / domain write | service + fake UoW |
| `TC-WORK-DUP-RESULT-MISSING-001` | completed idempotency missing stored result | duplicate returns `TemporarilyUnavailable` / `DuplicateResultMissing`,无业务写 | service + result store fake |

### 9. 前序契约回填记录

| 回填文件 | 回填内容 | 原因 |
|---|---|---|
| `03_ddd_step_07_trait_port_adapter_contracts.md` | `IdempotencyRepository.get(key, operation) -> Result<Option<IdempotencyRecord>, IdempotencyError>` | Step 12 的 commit unknown / duplicate recovery 需要只读幂等审计入口 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | `CommandResultRepository.save_result/get_result`、`StoredCommandResult`、`JobResultRepository.save_report/get_report`、`StoredJobResult`、`IdGeneratorPort.next_result_id()` | `ApplicationResultRef` 必须有正式 result / report surface 读取面 |
| `03_ddd_step_09_function_flows.md` | Command / Job digest 改为 stable business / job input,排除易变 metadata | 防止同一业务请求重试误判 digest conflict |
| `03_ddd_step_11_persistence_transaction_consistency.md` | Repository 函数表补 `IdempotencyRepository.get`、`CommandResultRepository` 和 `JobResultRepository`;更新 DDD11-OPEN-005 | 事务一致性与 Step 13 幂等审计对齐 |
| `03_ddd_step_12_error_recovery.md` | 更新 DDD12-OPEN-002 状态 | commit unknown 已有只读审计口径,测试仍留 Step 16 |

### 10. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_13_concurrency_idempotency.md`
>
> 延伸阅读:
> - 建议继续阅读本中间产物的“并发场景表”“幂等键表”“重入保护表”和“CommitStatusUnknown 审计口径”小节。

#### 5.12 并发、幂等与重入保护

L1-work 写路径使用三层保护:第一层是 `IdempotencyRepository` 对 `(operation, idempotency_key)` 的 atomic reserve;第二层是 `RequestDigest` 区分 same request 与 key reuse conflict;第三层是 repository optimistic `Version`、唯一键和 cursor monotonicity 防止并发覆盖。

Command 和 Operations Job 的幂等键来自 core `CommandMetadata.request.idempotency_key`。Inbound Event 的 dedup key 来自 `topic + source_event_id + source_ref`。Query 不写幂等记录。Outbound publish 不使用 public idempotency key,而以 `WorkOutboxId + expected_version` 保护单条 publication state;`expected_version` 必须来自 `list_pending(page)` 或 `get(outbox_id)` 返回的 `Versioned<WorkOutboxRecord>`。

`RequestDigest` 只包含稳定业务输入:operation、route scope、actor effective scope、command body / job body / event payload digest 等会改变结果的字段。它不得包含 `idempotency_key`、`request_id`、`requested_at`、`trace_id`、`job_run_id` 或 retry counter。

重复处理规则:

| 情况 | 结果 |
|---|---|
| same key + same digest + completed | Command 通过 `CommandResultRepository.get_result(ApplicationResultRef)` 返回 stored result;Job 通过 `JobResultRepository.get_report(ApplicationResultRef)` 返回 stored report;不重放 domain transition / job side effect |
| same key + same digest + reserved / unknown | 返回 temporarily unavailable,稍后重试或 reconciliation |
| same key + different digest | `IdempotencyConflict` |
| duplicate inbound event same digest | `AckDuplicate` |
| duplicate outbox publish worker | 使用同一 pending item version 标记 publication state;version conflict treated as already handled / item failure,不改 truth |

`CommitStatusUnknown` 不允许盲重试。重试前必须调用 `IdempotencyRepository.get(key, operation)`。若记录已 completed 且 digest 匹配,Command 通过 `CommandResultRepository.get_result(result_ref)` 读取既有 result,Job 通过 `JobResultRepository.get_report(result_ref)` 读取既有 report;若 stored surface 缺失或仍是 reserved unknown,不得再次执行 domain 写入或 job side effect,返回 temporarily unavailable 并交 reconciliation / operator review。

### 11. 待确认事项

| 编号 | 待确认项 | 当前口径 | 影响 |
|---|---|---|---|
| DDD13-OPEN-001 | idempotency / event dedup 记录保留期 | Step 14 固定进入 `WorkIdempotencyConfig`,详细默认值留给 `04-配置设计.md` | 配置设计需给保留期和清理策略 |
| DDD13-OPEN-002 | durable adapter 是否需要 row lock beyond compare-and-swap | Step 14 固定详细设计只要求 atomic reserve、unique key、expected version;row lock 产品留给 durable adapter config / implementation | 不阻塞 P0 fake adapter |
| DDD13-OPEN-003 | `projects.owner_ref` 是否唯一 | Step 14 固定为 `WorkStoreConfig.project_owner_uniqueness`,默认不启用全局唯一;启用时按 repository conflict 处理 | 配置设计需给正式默认值 |
| DDD13-OPEN-004 | `CommitStatusUnknown` reserved record 自动修复 API | P0 只读审计,不自动修复 | 后续 durable recovery 设计 |
| DDD13-OPEN-005 | job report 是否区分 retryable / terminal failed refs | 沿用 Step 12 open item | Step 16 / Step 19 |

### 12. 进入下一步条件

- [x] 并发场景表覆盖 Command、Event、Job、outbox、projection、reference 和 handoff。
- [x] 幂等键表明确 key 来源、窗口和 duplicate 结果。
- [x] 重入保护表覆盖 retry、redelivery、job rerun 和 crash replay。
- [x] `RequestDigest` 的稳定输入和排除字段已定义。
- [x] `CommitStatusUnknown` 已有只读 idempotency audit 口径。
- [x] 前序 Step 7 / 9 / 11 / 12 的最小实现缺口已回填。
