# Step 13. 并发、幂等与重入保护

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 13
>
> 本步采用 `projects/L1-governance/design-calibration/03_ddd_step_13_concurrency_idempotency.md` 的“资源竞争→key/digest→重复处理→重入→测试切口”粒度，但只处理 L5-sync 的 local truth、working copy、Git/filesystem 与 handoff seam；不引入 Governance truth、outbox 或 projection ownership。

## 1. Step 状态与 Step 内计划

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13：并发、幂等与重入保护 |
| 当前状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 回填位置 | 正式 `03-详细设计.md` §12；并回填 §6/§7/§8/§10/§11/§15 |
| 本步禁止 | 不选择物理锁/数据库/TTL/retry 数值，不运行并发测试，不把本地机制写成外部 owner 幂等保证 |

### 1.1 分批计划

| 批次 | 内容 | 状态 | 审查产物 |
|---|---|---|---|
| 13.1 | 输入、SOP 问题、诊断、原则 | completed | §2～§6 |
| 13.2 | local version、metadata generation、Git/filesystem、consumer/job 并发矩阵 | completed | §7 |
| 13.3 | namespace identity、digest、10 Command / 3 Consumer / 3 Job key 表 | completed | §8～§11 |
| 13.4 | duplicate/in-flight/commit unknown、external unknown、per-item job 重入 | completed | §12～§15 |
| 13.5 | 测试切口、前序回填、自检与停审 | completed | §16～§20 |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| Step 6 | `StoredSyncOperationResult`、invocation identity、17 lifecycle object 与 typed state。 |
| Step 7 | `Versioned<T>`、`ExpectedLocalVersion`、UoW/idempotency/result repositories、metadata lock、Git/fs/probe/handoff ports。 |
| Step 8 | 10 Command、13 Query、3 conditional Consumer、3 Job 的 exact DTO/key 来源。 |
| Step 9 | prepare→call→finalize、Query no-write、Consumer conservative write、Job per-item UoW。 |
| Step 10 | 17 状态机、22 条 `FT-SYNC-*`、unknown/probe/new identity 与 forbidden automation。 |
| Step 11 | logical key/version、atomic visibility、commit ambiguity、retention。 |
| Step 12 | `version_conflict`、`idempotency_conflict`、`already_in_progress`、`duplicate_result_missing`、`commit_status_unknown`。 |
| 真相源闭环标准 | key/digest/result/version/UoW/metadata/phase boundary 的可落码性门禁。 |

## 3. SOP 问题回答

| 问题 | L5-sync 回答 |
|---|---|
| 哪些 flow 会并发修改同一资源？ | 同一 target/binding/generation 上的 Clone/Pull/Migrate/Rebind/Resume、同一 operation/conflict/checkpoint/candidate/attempt 上的恢复与 handoff Command、三个保守 Consumer、三个逐项 Job；另有用户/Git 工具进程在 `MetadataLockPort` 之外修改 working tree。 |
| 哪些入口会重复？ | 所有 10 Command 都可能因 CLI/client retry 重复；3 Consumer 可能 redelivery；3 Job 可能 scheduler/operator 重跑；Git/fs/SDK call 可能返回 unknown。13 Query 允许重复，但不得建幂等记录或产生写。 |
| key 从哪里来？ | Command=`SyncCommandRequest.idempotencyKey`；Consumer=`InboundSyncEventEnvelope.idempotencyKey` 且必须同时验证 event identity/source/digest；Job=`SyncJobRequest.idempotencyKey`。三者均与 channel+operation name 组成规范化 identity，裸 key 不能跨入口比较。 |
| duplicate 如何处理？ | 同 identity + 同 digest + completed 原样回放 typed stored carrier；异 digest 冲突；reserved/in-flight 延迟；outcome-unknown 返回原 checkpoint/attempt/probe-required 姿态；completed 缺 carrier 是 consistency defect。绝不覆盖或从 current truth 重建旧结果。 |
| 并发冲突如何验证？ | Step 16 必须设置 reserve/version/lock/prepare/finalize 屏障，验证单 writer、exact replay、generation race、dirty no-overwrite、unknown no-resubmit、per-item partial 与 Query zero-write；本步只定义入口，不运行测试。 |

## 4. 当前闭环诊断

| 发现 | 风险 | 本步处理 |
|---|---|---|
| Step 7 原 `SyncIdempotencyRepository.get(key)` 表面只接收裸 key | 不同 Command/Consumer/Job 可能交叉命中 | 已收敛为 `SyncIdempotencyIdentity(channel,operationName,key)` 并回补 Step 6/7/11/12。 |
| Step 11 已有 entity version，但 lock 与 generation race 未统一 | 进程内锁可能掩盖 stale metadata | lock 仅协调 cooperating Sync writer；durable 正确性仍靠 expected version + expected generation + fingerprint。 |
| Git/fs effect 不在 UoW | crash/timeout 后可能误重入 apply | run/checkpoint durable prepare、exclusive lease、precondition fingerprint、unknown 不复用 run。 |
| external handoff/probe 有 invocation identity | timeout 后仍可能被误当可 submit retry | 原 attempt/invocation 只允许正式 probe/read；same key replay unknown，不再次 submit。 |
| Job 每 item 独立提交但 final report 可能尚未保存 | crash 后旧 key 的 exact result 不完整 | old in-flight key 不续跑；新 key 逐项 reload current state，已提交项 no-op/version guard，不能重建旧 report。 |
| Consumer/Job carrier 完整但 raw body 边界敏感 | digest/replay 可能诱导保存正文 | digest 只保存 ref；receipt/report body-free；raw payload、file body、stdout/stderr 不持久化。 |

## 5. 设计取舍

| 议题 | 采用 | 不采用 |
|---|---|---|
| local mutation concurrency | repository optimistic version + typed unique key | last-write-wins、时间戳/Git commit 充当 version。 |
| working-copy exclusion | canonical target keyed `MetadataLockPort` lease + generation/fingerprint recheck | 仅进程内 mutex、全局仓锁、自动 stash。 |
| idempotency identity | channel + operation name + caller/source key | 全仓裸 key；correlation/request/job run 充当 key。 |
| duplicate result | immutable stored carrier exact replay | 从 current state、日志、cache、Git status、ACK 重建。 |
| unknown reentry | same identity/digest reload + formal probe/manual | new key、自动 retry submit/apply、timeout 推断未发生。 |
| job partial rerun | old key delayed/defect；new authorized key reload per item | 接管不明 in-flight reservation、把 partial 当 completed。 |
| Query | repeatable current authorized read, zero write | reserve、lock、refresh、repair、persist observation。 |

## 6. 不变量

1. `LocalEntityVersion` 只来自 owning repository 的 `Versioned<T>`；`MetadataGeneration`、source cursor、Git object、mtime 与 retry count 均不可替代。
2. create 使用 `ExpectedLocalVersion.absent`；update 使用刚读取的 exact version。unique conflict 不得自动加载后当成功，除非同 idempotency identity/digest 的 stored carrier 证明 duplicate。
3. `MetadataLockPort` 不构成对用户编辑器、Git client 或外部进程的排他保证；apply 前仍须重新观察 fingerprints，adapter 写入必须 non-overwrite。
4. 同一 canonical target 的 Sync mutation 统一锁序：canonicalize/validate target → acquire metadata lease → reload generation/version/fingerprint → local UoW；不得持有 local UoW 等待锁。
5. 单次 flow 不同时持有两个 target lease。未来跨 target 原子操作必须回退架构/详细设计，不按字符串排序私造多锁协议。
6. SDK/handoff/owner read 不在 local transaction 中，也不靠 target lease获得外部幂等；external call 前必须持久化 invocation identity，结果未知只能 probe/manual。
7. provenance、proof、transition、result 与 invocation identity append 使用唯一 ref；duplicate replay 不追加第二份记录。
8. hard boundary 不可由配置关闭：no auto merge/rebase/push/stash、no dirty overwrite、no Review Gate bypass、no provenance delete/fabrication。

## 7. 并发场景表

| 场景 | 冲突资源 | 控制方式 | 失败/姿态 | Step 16 测试入口 |
|---|---|---|---|---|
| 同 Command 并发 retry | idempotency identity | atomic reserve + digest compare | duplicate / already-in-progress / conflict | `TC-SYNC-IDEM-001~003` |
| 两个 Clone 指向同 target | target unique binding、manifest generation | target lease + create-absent unique index + fresh inspection | conflict/blocked；不覆盖 | `TC-SYNC-CONC-TARGET-001` |
| Pull 与 Migrate/Rebind 同 target | binding/manifest/cursor/mapping generation | same target lease；reload generation；versioned save | generation/version conflict；replan | `TC-SYNC-CONC-GEN-001` |
| Pull/Resume 双 apply 同 plan/run | plan consumed、run identity、working paths | validated plan unique consumption + lease + prepared run | one writer；loser invalidated/conflict | `TC-SYNC-CONC-APPLY-001` |
| 用户在 apply 前后修改 path | filesystem content/fingerprint | immediate pre-apply fingerprint + adapter non-overwrite check | conflict/partial/unknown；不覆盖 | `TC-SYNC-CONC-DIRTY-001` |
| apply 已发生而 finalize 竞争 | run/cursor/mapping/provenance | reload all versions；single finalize UoW | version conflict→NeedsAction；不重复 apply | `TC-SYNC-CONC-FINALIZE-001` |
| RecordResolution 与 Resume 并发 | conflict/checkpoint/resolution | versioned conflict/checkpoint；Resume 绑定 exact validated resolution | stale Resume conflict；no effect | `TC-SYNC-CONC-RECOVERY-001` |
| Cancel 与 running/unknown flow 并发 | operation/checkpoint/attempt | expected operation version；cancel local continuation only | one transition wins；external fact retained | `TC-SYNC-CONC-CANCEL-001` |
| Push candidate 与 local drift | candidate/binding/observation fingerprint | freeze/revalidate exact basis；candidate identity immutable after invalidation | candidate invalidated/blocked | `TC-SYNC-CONC-CANDIDATE-001` |
| Push/Probe/Refresh 竞争同 attempt | attempt/checkpoint/probe/invocation | expected versions + invocation unique + state matrix | version conflict/probe-required；no submit replay | `TC-SYNC-CONC-HANDOFF-001` |
| Consumer 与 Command 修改同 local state | snapshot/evaluation/plan/candidate/cursor | Consumer conservative transition with expected versions | item conflict/delayed；Command revalidates | `TC-SYNC-CONC-CONSUMER-001` |
| 两 Consumer redelivery | receipt/idempotency/local refs | namespaced reserve + event/digest unique + expected version | exact receipt replay/conflict | `TC-SYNC-EVENT-IDEM-001` |
| 两 Job 扫到同 item | manifest/snapshot/attempt | per-item reload + expected version/state guard | one change；other no-op/conflict in report | `TC-SYNC-JOB-CONC-001` |
| Job crash after some item commits | item states/provenance + incomplete reservation | committed items remain；old key not adopted；new key re-reads | delayed/manual for old key；new report distinct | `TC-SYNC-JOB-REENTRY-001` |
| provenance append race | provenance ref/parent graph | unique ref + parent existence/integrity + same UoW owner revision | conflict/integrity defect；never overwrite | `TC-SYNC-CONC-PROV-001` |
| repeated Query during writes | committed local snapshot | read committed/versioned slices；no write lock capability | old/new coherent slice or explicit partial | `TC-SYNC-QUERY-NOWRITE-001` |

## 8. 规范化幂等 identity 与 record state

```ts
export type SyncIdempotencyChannel = "command" | "consumer" | "job";

export type SyncIdempotencyIdentity =
  | { readonly channel: "command"; readonly operationName: SyncCommandName; readonly key: IdempotencyKey }
  | { readonly channel: "consumer"; readonly operationName: SyncInboundConsumerName; readonly key: IdempotencyKey }
  | { readonly channel: "job"; readonly operationName: SyncJobName; readonly key: IdempotencyKey };

export type SyncIdempotencyState =
  | "reserved"
  | "completed"
  | "outcome_unknown";

export interface SyncIdempotencyRecord {
  readonly identity: SyncIdempotencyIdentity;
  readonly requestDigestRef: RequestDigestRef;
  readonly state: SyncIdempotencyState;
  readonly completionKind: Optional<"command" | "consumer" | "job">;
  readonly externalAttemptRef: Optional<ExternalAttemptRef>;
  readonly checkpointRef: Optional<RecoveryCheckpointRef>;
}

export type IdempotencyReservation =
  | { readonly kind: "reserved"; readonly record: Versioned<SyncIdempotencyRecord> }
  | { readonly kind: "duplicate"; readonly completion: StoredIdempotencyCompletion }
  | { readonly kind: "already_in_progress"; readonly record: Versioned<SyncIdempotencyRecord> }
  | { readonly kind: "outcome_unknown"; readonly record: Versioned<SyncIdempotencyRecord>; readonly result: StoredSyncOperationResult }
  | { readonly kind: "conflict"; readonly existingDigestRef: RequestDigestRef };
```

约束：discriminated union 在类型层把 `operationName` 与 `channel` 对齐；repository unique key 为三字段 identity，不是裸 key。`completed` 必须有同一 UoW staged 的 typed completion；`outcome_unknown` 只对确有外部 effect identity 的 Command保存完整 `StoredSyncOperationResult` + attempt/checkpoint。local Git/fs unknown同样保存完整 command result + run/checkpoint，但不伪造 external attempt；其 reservation可使用completed carrier表达，不调用要求`ExternalAttemptRef`的 external-unknown method。

## 9. Canonical request digest

| Include | Exclude |
|---|---|
| channel、operation name、route-bound typed refs、全部会改变语义的 request/body 字段 | idempotency key 自身、correlation ref、client request ref、requestedAt、jobRunRef |
| principal/actor/system authority scope 中影响授权语义的 refs | credential ref/secret/token、transport header、delivery attempt、retry count |
| expected generation/version/fingerprint、path scope、target/source/handoff refs | 当前时间、随机生成的 operation/result/invocation refs、Step 14 runtime binding snapshot ref |

Runtime binding snapshot ref不进入caller request equivalence：首次execution把当时的body-free snapshot与operation原子关联；相同identity/digest的duplicate必须回放首次result和历史snapshot语境，不能因为当前composition产生新snapshot而冲突或重执行。
| Consumer event id/name/schema/source ref/source version/payload digest 与 validated semantic fields | raw event payload/body、provider response、private reason正文 |
| Job kind、scope/filter/page cursor/limit/evaluatedAt 等会改变 target/result 的字段 | worker identity、scheduler attempt、trace/span id |
| canonical relative path refs、sorted set、enum variant、body-free digest/version refs | file content、diff、Git stdout/stderr、log/cache/ACK |

`DigestPort.requestDigest` 必须使用有版本的 deterministic canonical codec；具体算法与 codec version 由 Step 14/04 绑定。在该绑定未确认前只能保持 `local_pending`，不得用 `JSON.stringify`、debug/display text、对象插入顺序或 path 原文作为稳定编码。optional、set 与 page cursor 必须显式编码，set 按正式 canonical key 排序并拒绝重复。

## 10. Command 幂等键表

所有 Command 的 raw key 来自 `SyncCommandRequest.idempotencyKey`；identity channel=`command`，operation name 使用下表 exact name。窗口在 Step 14/04 给出正式 retention 前是“不得自动过期、删除或复用”，并不承诺无限容量实现已存在。

| Command | Digest stable input | duplicate same digest | 并发/unknown 特例 |
|---|---|---|---|
| `CloneWorkingCopy` | actor effective scope、explicit project/version/source/target、initial path scope、empty-compatible assertion | replay `CloneWorkingCopyResult` 对应 stored command carrier | target unique/generation race conflict；apply unknown 不再 apply。 |
| `MigrateSyncMetadata` | actor scope、target、binding、expected generation、target schema ref | replay `MetadataMigrationResult` | generation/version mismatch；绝不覆盖旧 generation。 |
| `RebindWorkingCopy` | actor scope、prior binding、new explicit selection、expected prior generation、reason | replay `WorkingCopyRebindResult` | target/binding unique conflict；不静默换 selection。 |
| `PullWorkingCopy` | actor scope、explicit selection、binding、expected generation、canonical path scope | replay `PullWorkingCopyResult` | plan/run single-consumption；partial/unknown 不推进 cursor。 |
| `RecordConflictResolution` | actor scope、conflict、decision kind、bounded scope、revalidation set | replay `ConflictResolutionResult` | same conflict version protects competing intent；intent 不执行 effect。 |
| `ResumeSyncOperation` | actor scope、operation、checkpoint、optional resolution、expected input fingerprint | replay `ResumeSyncOperationResult` | stale fingerprint/generation blocks；old run unknown 不原地 Finalized。 |
| `ProbeUnknownOutcome` | actor scope、operation、checkpoint、prior attempt、probe kind | replay `ProbeUnknownOutcomeResult` | one invocation per probe identity；duplicate no probe。 |
| `CancelSyncOperation` | actor scope、operation、cancellation reason | replay `CancelSyncOperationResult` | cancellation only wins local version；possible effect ref retained。 |
| `PushReviewCandidate` | actor scope、explicit selection、binding、expected generation、path scope、Governance target | replay `PushReviewCandidateResult` | candidate/attempt unique; handoff unknown no resubmit。 |
| `RefreshReviewHandoffStatus` | actor scope、operation、attempt、optional exact external handoff ref | replay `ReviewHandoffRefreshResult` | external read/probe invocation unique；Decision snapshot remains owner-provided。 |

`StoredSyncOperationResult.completion` 必须以 exact `commandName` 判别 result variant；不得只按 `operationRef` 或结构相似字段猜 DTO kind。所有 stable set/path 输入先经 validation/canonicalization，再算 digest；validation fail 在 reserve 前返回时不得占用 key。

## 11. Consumer 与 Job 幂等键表

### 11.1 Conditional Consumer

| Consumer | Identity / digest stable input | duplicate | 特殊规则 |
|---|---|---|---|
| `ConsumeAccessOrPostureInvalidated` | channel+consumer name+envelope key；event id/name/schema/source owner/ref/version/payload digest、validated subject/invalidation/actions/owner version | replay exact `StoredConsumerReceipt.receipt` | same event/key different digest conflict/quarantine；不再 resolve targets。 |
| `ConsumeMaterialSourceInvalidated` | 同上；validated source/invalidation/optional cursor/owner version | exact receipt replay | 不改已应用 cursor、不 auto pull。 |
| `ConsumeReviewDecisionChanged` | 同上；exact external handoff/Decision ref/state/owner version | exact receipt replay | 不再 attach snapshot，不创建 Gate/Decision/handoff。 |

Consumer 在验证 envelope identity/source/schema/digest 前不得 reserve 或 parse/trust payload。unsupported schema 可返回 body-free unsupported receipt；如果该 receipt 被持久化，identity/digest 只能来自已可信 envelope 字段，不能依赖未解析 payload。三个 consumer 当前均为 `planned/blocked`；本表不声明 subscription/topic 已存在。

### 11.2 Operations Job

| Job | Identity / digest stable input | duplicate | per-item reentry |
|---|---|---|---|
| `ScanMetadataIntegrity` | channel+job name+request key；system authority scope、binding/target scope、page、batch limit | replay exact `StoredSyncJobResult.result`，不 list/scan | fresh run/new key reload item version；已收紧 state no-op，冲突进入 item result；不 repair。 |
| `ProbePendingHandoffAttempts` | system authority scope、explicit attempt scope xor persisted-all、page、batch limit | exact report+attempt results replay；zero probe calls | new run只处理仍 ProbeRequired；InFlight/unknown prior probe不重放 submit/probe，按 formal recovery。 |
| `MarkStaleOwnerSnapshots` | system authority scope、owner kind/subject scope、evaluatedAt、page、batch limit | exact report+snapshot results replay；no owner call | new run reload freshness/version；already non-fresh no-op，只允许更保守。 |

`jobRunRef`、correlation 与 scheduler attempt 不进入 digest，但 `(jobName,jobRunRef)` 仍是 `StoredSyncJobResult` 的唯一索引，禁止同一 run ref 配不同 key/body。Job 不建立全局“所有 items 完成”事实；report 只描述该次 bounded run。

## 12. Duplicate / reserve 处理矩阵

| Existing posture | Incoming digest | 必须行为 | 禁止 |
|---|---|---|---|
| no record | valid digest | atomic reserve；进入 owning flow | 先做 domain/effect 后 reserve。 |
| completed | same | 读取/验证 exact typed completion，原样 replay | 重跑 mutation、target resolve、scan、Git/fs、submit/probe。 |
| completed | different | `idempotency_conflict`；zero write/effect | 覆盖 record、返回 current result。 |
| reserved/in-flight | same | `already_in_progress`/delayed；zero second writer | 以超时或进程不在推断 reservation 可接管。 |
| reserved/in-flight | different | conflict；zero write/effect | 用新 body延续旧 reservation。 |
| outcome_unknown | same | replay original unknown surface/attempt/checkpoint；引导 explicit Probe/Resume/manual | 重放原 Git/fs/handoff call。 |
| outcome_unknown | different | conflict | 用 changed payload“修复”旧 attempt。 |
| completed but carrier missing/wrong kind | same | `duplicate_result_missing` / consistency defect | current truth、日志、cache、ACK 合成 result。 |
| identity store unavailable | any | dependency unavailable；zero business write | 绕过 idempotency。 |
| business unique conflict after fresh reserve | n/a | rollback reservation UoW或保存 typed known conflict（依 flow合同）；不冒充 duplicate | load winner并当本请求成功。 |
| Query repeat | n/a | current authorized read；zero idempotency/UoW/lock | 固定旧 snapshot、refresh/repair/probe。 |

若 `reserve` 与 prepared local state 在同一 UoW commit status unknown，重入只能按 §14 使用相同 identity/digest reload。不能先创建第二 operation/run/candidate identity再尝试“对账”。

## 13. Lock、generation 与 Git/filesystem 重入

| 阶段 | required guard | crash/reentry posture |
|---|---|---|
| target inspect | canonical target/root、visibility、dirty/path/symlink/tool capability | read-only observation不可作为后续无限期 token；mutation 必须重验。 |
| acquire | identity-bound `LocalLockLease`，target与operation/checkpoint匹配 | unavailable/unknown→blocked；不假定陈旧锁自动安全。 |
| reload | binding/manifest/cursor/mapping/plan/run `Versioned<T>` + generation + fingerprints | mismatch→invalidate/replan/conflict；不得继续旧 plan。 |
| durable prepare | run/checkpoint/path set/invocation/provenance relation与 reservation提交 | commit unknown→same identity reload；prepared不等 effect occurred。 |
| Git/fs apply | typed bounded request + same lease + non-overwrite precondition | partial/unknown→run/checkpoint outcome unknown；不得同 run重放。 |
| finalize | reload exact versions；run/cursor/mapping/provenance/result atomic set | conflict after effect→NeedsAction/manual reconciliation；不再次 apply。 |
| release | release best effort with typed failure reporting | release failure不改变 known finalized facts，也不授权下次跳过 fresh acquire/reload。 |

`MetadataLockPort`、`GitWorktreePort` 与 `FilesystemApplyPort` 的 concrete lease/lockfile/tool strategy留 Step 14/04；任何实现都必须把用户未提交修改视为外部并发源。不得自动 merge/rebase/push/stash，`abortPreparedLocalChange` 只撤销确定尚未发生的 staged intent，不能删除或覆盖用户修改。

## 14. Commit status unknown 与 external effect unknown

### 14.1 Local commit unknown

```text
retry input = exact SyncIdempotencyIdentity + original RequestDigestRef
  -> read idempotency record and exact stored carrier
  -> completed + correct carrier: replay
  -> reserved/in-flight: delayed/manual; no mutation
  -> outcome_unknown: return original attempt/checkpoint posture
  -> missing/mismatched carrier: consistency defect
  -> absent after prior unknown: adapter-specific durable audit must prove not committed;
     default is unavailable/manual, never blind execution
```

### 14.2 External / tool effect unknown

| effect family | durable identity before call | unknown recovery | 绝对禁止 |
|---|---|---|---|
| Git/filesystem apply | materialization run + checkpoint + bounded path/fingerprint basis | inspect current facts only as recovery input；explicit Resume creates/revalidates a new run when safe | same run apply retry、status/log推断完整成功。 |
| review handoff submit | handoff attempt + `HandoffInvocationIdentity` + checkpoint | formal `ProbeUnknownOutcome` / status refresh by prior attempt | submit again、ACK→accepted、Git push。 |
| handoff/Decision read | read/probe invocation where required | repeat only if formal read/probe contract says no mutation；otherwise unknown/manual | cache/fake/private endpoint closing owner truth。 |
| formal probe | new `ProbeRecord` + `ProbeInvocationIdentity.probedAttemptRef: ExternalAttemptRef` | still unknown remains ProbeRequired；new probe only under formal policy/new identity | original submit replay、telemetry/log as proof。 |

External owner idempotency token/equivalence/probe ability仍受 `SYNC-UP-004/005` 阻塞。本地 request key只能防 L5-sync 自己重入，不能宣称平台恰好一次。

## 15. Job per-item 重入规则

1. Job reserve 成功后按 bounded page列 target；每个 target 在自己的 local UoW中 reload version/state，再决定 changed/no-op/blocked/failed。
2. item 成功提交后即为真实 local transition，不等待 final `StoredSyncJobResult` 才生效；因此 batch crash 不得 rollback或隐藏已提交 item。
3. 同 job key处于 in-flight/commit-unknown 时，另一 worker不得从 next cursor接管，也不得拼接旧 report。
4. 新授权 run使用新 key/run ref，可以重新列当前 target；已由前 run提交的保守 state通过 state/version guard成为 no-op，未处理项可继续。新 report只描述新 run，不伪造旧 report。
5. `ProbePendingHandoffAttempts` 每 item必须先检查 prior attempt/checkpoint/probe state；已有 InFlight/StillUnknown 不自动再 probe，known terminal不再调用 adapter。
6. item result refs、unknown/blocked/failure必须完整进入 final typed report；counts不能替代 item list，`completed`不能解释为所有 handoff resolved或系统 ready。
7. 当前不新增独立 job-item idempotency store；并发正确性来自 owning object version/state、invocation uniqueness与final job exact replay。若实现证明这些不足，必须回到设计补 port/store，不能私加隐式 marker。

## 16. 并发与幂等测试切口

| Test cut | 覆盖点 | 建议层级 |
|---|---|---|
| `TC-SYNC-IDEM-001` | same channel/operation/key/digest replay exact command result；无二次 domain/port call | application + repository fake |
| `TC-SYNC-IDEM-002` | same identity different digest conflict；zero write/effect | application |
| `TC-SYNC-IDEM-003` | reserved/in-flight same digest delayed；no second writer | repository barrier |
| `TC-SYNC-IDEM-004` | same raw key across different operation/channel不交叉 replay | contract/repository |
| `TC-SYNC-IDEM-005` | digest deterministic；volatile fields/body excluded；semantic expected/path scope included | digest contract |
| `TC-SYNC-DUP-RESULT-001` | completed missing/wrong typed carrier→consistency defect；no recompute | result store fake |
| `TC-SYNC-COMMIT-UNKNOWN-001` | same identity/digest reload before any mutation | service + UoW fake |
| `TC-SYNC-CONC-TARGET-001` | dual clone target only one binding/generation；no overwrite | metadata adapter contract |
| `TC-SYNC-CONC-GEN-001` | Pull vs Migrate/Rebind generation race blocks stale writer | repository/flow |
| `TC-SYNC-CONC-APPLY-001` | dual run/apply consumes plan once；loser never calls Git/fs | flow + spies |
| `TC-SYNC-CONC-DIRTY-001` | user path changes after plan/pre-stage leads conflict/unknown, never overwrite/stash | filesystem adapter contract |
| `TC-SYNC-CONC-FINALIZE-001` | effect known but finalize version conflict does not reapply or advance cursor | flow/UoW |
| `TC-SYNC-CONC-RECOVERY-001` | resolution/resume race requires exact validated resolution/checkpoint version | application |
| `TC-SYNC-CONC-CANCEL-001` | cancel race preserves possible/known external effect refs | state/application |
| `TC-SYNC-CONC-CANDIDATE-001` | local drift invalidates frozen basis before handoff call | application + Git/fs read spies |
| `TC-SYNC-CONC-HANDOFF-001` | duplicate/unknown attempt performs zero second submit；probe invocation unique | handoff/probe fakes |
| `TC-SYNC-EVENT-IDEM-001` | Consumer duplicate exact receipt；different digest conflict/quarantine；no target resolve | consumer service |
| `TC-SYNC-JOB-IDEM-001` | duplicate job exact full report/item replay；no scan/probe | job service |
| `TC-SYNC-JOB-CONC-001` | dual job item uses expected version, one change/one no-op or conflict | job + repository fake |
| `TC-SYNC-JOB-REENTRY-001` | partial crash: old key not adopted；new key re-reads committed items and reports distinct run | job/UoW fake |
| `TC-SYNC-CONC-PROV-001` | append race never overwrites/fabricates/deletes provenance | repository |
| `TC-SYNC-QUERY-NOWRITE-001` | every repeated Query has zero UoW/idempotency/lock/write/probe calls | query composition |

这些只是 Step 16/05 的设计入口；没有创建测试文件、没有执行命令、没有测试结果或 evidence。

## 17. 前序契约回填审计

| 前序 Step | 发现 | 回填动作 |
|---|---|---|
| Step 6 | `SyncOperationContext` 原未显式携带 operation name/channel；`StoredSyncOperationResult` 原未显式区分 result variant | 已回补 `SyncIdempotencyIdentity` 与完整 `SyncCommandProtocolResult` carrier；未新增 domain truth。 |
| Step 7 | 原 `SyncIdempotencyRepository.get(key)` 与裸 key wording不足 | 已回补为 `get(identity)`；Consumer receipt与Job result均namespaced。 |
| Step 8 | Command/Consumer/Job均有 raw key与 exact operation name来源 | pass；Query无 key。 |
| Step 9 | shared mutation/consumer/job template 已 reserve-first、duplicate replay、prepare/finalize | pass；Job partial reentry与external unknown由本步细化。 |
| Step 10 | 17 状态机、`FT-SYNC-01~22` 可承接 race/unknown/new identity | pass；不新增 global state。 |
| Step 11 | 原 logical store未覆盖 channel namespace与完整 Command carrier | 已回补规范化 identity、full carrier、namespaced receipt与原子可见性；version/UoW规则保持。 |
| Step 12 | conflict/in-flight/missing carrier/commit unknown错误原使用operationKind/key | 已回补为 `SyncIdempotencyIdentity`；本步给 exact触发顺序。 |

### 17.1 前序回补的精确表面

```ts
export interface SyncIdempotencyRepository {
  get(identity: SyncIdempotencyIdentity): Promise<PortResult<Optional<Versioned<SyncIdempotencyRecord>>>>;
  reserve(record: SyncIdempotencyRecord, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<IdempotencyReservation>>;
  complete(write: VersionedWrite<SyncIdempotencyRecord>, result: StoredIdempotencyCompletion, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<void>>;
  markOutcomeUnknown(write: VersionedWrite<SyncIdempotencyRecord>, result: StoredSyncOperationResult, attemptRef: ExternalAttemptRef, checkpointRef: RecoveryCheckpointRef, unitOfWork: LocalStateUnitOfWork): Promise<PortResult<void>>;
}
```

`get` 的改动不是新增实现，而是修复 Step 7 callable semantic。Consumer receipt unique key是 `(consumerName,eventId)` 与 `(consumerName,idempotencyKey)`；Job result维持 `(jobName,jobRunRef)` 与 `(jobName,idempotencyKey)`。Command completion必须含 command operation name/result kind可验证关系；exact physical representation留 `SYNC-UP-006`。

## 18. 回填草稿

> 校准来源：
> - `projects/L5-sync/design-calibration/03_ddd_step_13_concurrency_idempotency.md`
>
> 延伸阅读：
> - §7 “并发场景表”、§8～§12 “identity/digest/key/duplicate”、§13～§15 “local/external/job重入”、§16 “测试切口”、§19 “待确认事项”。

### 正式 §12 摘录草稿

L5-sync 使用三层并发保护：repository `LocalEntityVersion`/unique key防止 local truth覆盖；canonical target lease、metadata generation与fresh fingerprint协调 working-copy mutation；channel+operation+key的幂等 identity与canonical digest保护 Command、Consumer、Job重复入口。Lock只协调 cooperating Sync writer，不替代 version/generation，也不证明用户或外部 Git client没有修改工作树。

Duplicate same digest只原样回放 `StoredSyncOperationResult`、`StoredConsumerReceipt` 或 `StoredSyncJobResult`；different digest冲突，in-flight延迟，missing carrier为一致性缺陷。Git/filesystem或review handoff effect unknown时保留run/attempt/checkpoint/invocation并走显式恢复或formal probe，禁止换 key、复用 run或再次 submit。Query始终zero-write；Job按item reload/version guard，新run可处理当前未完成项但不能重构旧report。

## 19. 待确认事项

| ID | 事项 | 影响 | 未确认前姿态 |
|---|---|---|---|
| `SYNC-UP-004/005` | external handoff/probe equivalence、idempotency token与unknown closure | 外部调用重入 | durable attempt + probe-required；no resubmit。 |
| `SYNC-UP-006` | `.qs-sync` physical transaction、unique index、lock lease、crash recovery与retention | local concurrency/durability | logical contract only；adapter未证明则 implementation blocked。 |
| `SYNC-UP-007/010` | Git/fs mapping、dirty/path/non-overwrite的exact tool semantics | apply race | fail-closed/needs-action；不自动处理用户修改。 |
| `SYNC-UP-008` | comparator/cursor continuity | concurrent pull/finalize | no safe cursor advance。 |
| `SYNC-UP-009` | LFS/shallow/GUI support | external worktree concurrency/capability | unsupported/blocked；不继承旧选择。 |
| `SYNC-LOCAL-001~005` | runtime/package/parser/validator/test/Git tool/SDK choices | lock/digest/adapter/test implementation | planned/not_created；不得写成已选或已验证。 |

## 20. 进入 Step 14 条件与停审记录

- [x] local entity、metadata generation、working tree、handoff、Consumer、Job 竞争资源与控制方式已列出。
- [x] 10 Command、3 Consumer、3 Job 的 key/digest/replay规则可计算；13 Query明确zero-write。
- [x] duplicate/in-flight/different digest/missing carrier/commit unknown均有明确处置。
- [x] Git/fs与external handoff/probe unknown不会被blind replay。
- [x] per-item job crash/reentry不伪造old report或global readiness。
- [x] 测试切口只是设计入口，未运行测试或生成 evidence。
- [x] 前序 bare-key、Command exact replay与Consumer namespace语义已回补 Step 6/7/8/11/12并完成机械审计。

结论：Step 13 `completed / stop_review`，`gate_status=pass_with_upstream_blockers`。允许按用户授权进入 Step 14；正式 03 仍不可写。
