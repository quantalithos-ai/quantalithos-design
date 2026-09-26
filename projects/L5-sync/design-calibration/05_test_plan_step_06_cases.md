# Step 6. 设计测试场景与用例矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 6。
> 回填章节：未来正式 `05-测试方案.md` §6。
> 下表是测试设计和用例候选，不代表 case 文件、runner、fixture、run 或结果已存在。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 6 / cases |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 直接下一步 | Step 7：设计测试数据 |
| 持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |

## 2. 本步输入与用例纪律

- 使用 Step 5 的双向覆盖矩阵和 Step 3 的 exact protocol/object/state names。
- 每个用例必须有：前置状态、显式输入、执行边界、期望 disposition/state/write-set、禁止调用、证据计划 ID 和阻塞姿态。
- “成功”只允许写成 typed local disposition（如 `completed_known`、`no_op_known`）；不得写 accepted/approved/ready。
- unknown/partial/blocked 分支必须保留 checkpoint/attempt/history，并阻止 cursor/mapping/provenance 的错误推进。

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 用例如何覆盖 10 Command？ | 每个 Command 至少有 valid local path、invalid/missing、duplicate/digest conflict、version/generation drift、partial/unknown 和 forbidden-effect 组合。 |
| 13 Query 如何覆盖？ | 每个 Query 具备 selector/hit、missing/not-visible/degraded 或 stale 分支，并以 spy 断言 zero UoW/write/lock/probe/handoff/diagnostic emit。 |
| 3 Consumer 与 3 Job 如何覆盖？ | Consumer 覆盖 envelope validation、accepted/duplicate/unsupported/quarantine 和 conservative invalidation；Job 覆盖 bounded input、per-item result、partial、exact replay、no truth repair。 |
| 状态机如何避免漏测？ | `TC-SYNC-STATE-001~017` 对每个主语至少覆盖合法主线、表外迁移、terminal reopen、context/generation mismatch。 |
| 如何处理外部 positive？ | 以 controlled unavailable/unknown/failure 作为 local case；真实 positive case 记录 `blocked/waiting`，不伪造 owner response。 |

## 3A. 旧材料诊断与改动前后对比

| 维度 | 旧材料 | 当前用例矩阵 |
|---|---|---|
| 场景主语 | 模糊 sync task/体验状态 | exact Command/Query/Consumer/Job、object、state |
| 异常覆盖 | 少量失败分支 | invalid、duplicate、version/generation、partial、unknown、forbidden effect 成对设计 |
| 成功语义 | success/accepted 混用 | local typed disposition 与 owner Decision 分层 |
| 恢复 | retry/repair 叙事 | checkpoint、probe、manual、no blind replay |

## 3B. 测试设计取舍

1. Command 先写安全负向，再写 local known path；Query 先写 zero-write spy，再写 hit view。
2. Consumer/Job 不要求真实 topic/scheduler；先锁 envelope、receipt、report、保守 transition 和 no-truth-repair。
3. 任何用例若需要新增 field/state/port/error，标记 `design-change-required`，不在本步临时扩展。

## 4. Shared protocol / boundary 用例

| 用例 ID | 场景 | 期望断言 | 姿态 |
|---|---|---|---|
| `TC-SYNC-PROTO-001` | Command/Query/Consumer/Job 缺 actor、correlation、schema/source/key | trusted boundary 前拒绝；不 begin UoW、不 parse raw body | planned |
| `TC-SYNC-PROTO-002` | Project/Version/Source/Target/Artifact/Workspace/Governance/local ref 互换 | typed validation 拒绝；不从 opaque string 猜型 | planned |
| `TC-SYNC-PROTO-003` | local/commit/effect/transport/probe/Decision layer 混用 | typed result 保持分层；无 top-level success/accepted/ready | planned |
| `TC-SYNC-PROTO-004` | provider body、file content/diff/path、Git stdout/stderr、secret 注入 carrier | result/view/receipt/report/log/audit 均无 forbidden value | planned |
| `TC-SYNC-PROTO-005` | missing/not-visible/restricted/unavailable/stale/partial page | 不折叠为空/clean；freshness/completeness 显式 | planned |
| `TC-SYNC-PROTO-006` | replay carrier kind 错配或缺失 | consistency error；不重算 current truth | planned |

## 5. 10 Command 用例矩阵

| Command / cuts | Valid local path | 必测异常与恢复 | 禁止效果/断言 | 姿态 |
|---|---|---|---|---|
| `CloneWorkingCopy` / `TC-SYNC-CMD-001` | explicit selection、empty/compatible target、Fresh+Eligible、safe path；Finalized 与 binding/cursor/mapping/provenance 同 UoW | missing selection、existing incompatible、owner/source blocked、gap、dirty/untracked/symlink、partial/unknown、finalize conflict | no fetch/push/merge/rebase/stash/overwrite；local finalize 不代表 Artifact/Baseline | local planned；positive blocked |
| `MigrateSyncMetadata` / `TC-SYNC-CMD-002` | expected generation、supported target schema、old chain protected；new generation | generation conflict、unsupported/corrupt/dangling、commit unknown、duplicate | query/scan 不触发；无 in-place rewrite/delete provenance | logical planned；physical blocked |
| `RebindWorkingCopy` / `TC-SYNC-CMD-003` | explicit new selection/reason、safety/provenance guard、new identity/generation | same-context no-op、dirty/unknown、owner/path/schema blocked、race/selection mismatch | 不由目录/Git/default 推断；不 materialize/overwrite/删除 old history | planned；owner/store blocked |
| `PullWorkingCopy` / `TC-SYNC-CMD-004` | formal full/incremental/no-op proof、same generation、安全 plan/run、known apply→finalize | gap/out-of-order/comparator unsupported、rename/delete collision、dirty/drift、partial/unknown、version conflict | cursor 只在 Finalized 推进；无 remote Git/auto merge/rebase/stash | local planned；source/tool blocked |
| `RecordConflictResolution` / `TC-SYNC-CMD-005` | human actor、active conflict、bounded scope；Recorded→Validated 与 conflict ResolutionRecorded 同 UoW | system actor、scope escape、stale/closed conflict、invalid decision、version conflict | KeepLocal/ApplySource 只记录 intent；zero file/cursor/source/handoff calls | planned |
| `ResumeSyncOperation` / `TC-SYNC-CMD-006` | exact checkpoint/fingerprint/generation/resolution；按 typed next action | drift、invalidated/terminal checkpoint、unvalidated resolution、possible effect、duplicate | 不 force retry/继续 PC；按需新 plan/run/checkpoint identity | planned；effect branches blocked |
| `ProbeUnknownOutcome` / `TC-SYNC-CMD-007` | durable prior attempt + ProbeRequired；new probe identity先落盘后调用 | no prior attempt、wrong context、capability absent、timeout/malformed、duplicate | zero original submit；ResolvedKnown 不自动 accepted/terminal；telemetry 不作 probe | local fake planned；formal probe blocked |
| `CancelSyncOperation` / `TC-SYNC-CMD-008` | non-terminal local operation、reason、local result/provenance retained | terminal reopen、missing op、version conflict、attempt/checkpoint mismatch | 无 remote cancel、file cleanup/rollback claim、history delete | planned |
| `PushReviewCandidate` / `TC-SYNC-CMD-009` | access/source/binding/cursor/observation/conflict gates；Frozen candidate、Prepared attempt；pre-call revalidate | archived/denied/stale/dirty/open conflict、pre-call drift、known reject、ACK、timeout/lost response、finalize conflict | 无 Git push；commit 不升格 Artifact/Baseline；ACK 不升格 Decision/accepted；unknown 不 resubmit | local planned；handoff blocked |
| `RefreshReviewHandoffStatus` / `TC-SYNC-CMD-010` | known ref→Decision read；unknown→formal probe；body-free snapshot/attempt layers | invisible/missing/stale/unmatched ref、probe unknown/unsupported、read ambiguity、duplicate | 不创建/改变 Gate/Decision；不把 missing 默认 pending/accepted；不同时盲调 read+probe | fake planned；owner blocked |

## 6. 13 Query 用例矩阵（全部 zero-write）

| Query | 必测读取面 | 必测 no-write/异常 | 姿态 |
|---|---|---|---|
| `GetAccessEvaluation` / `TC-SYNC-QRY-001` | by-ref/by-context exact selector、persisted outcome/freshness | selector xor、missing/not-visible/stale；0 owner refresh/写入 | planned |
| `GetSyncOperation` / `TC-SYNC-QRY-002` | planned/needs-action/terminal local view | missing checkpoint/result unavailable；0 transition/create | planned |
| `GetWorkingCopyBinding` / `TC-SYNC-QRY-003` | by-ref/by-target、Bound/Restricted/NeedsMigration/NeedsRebind/Invalidated | selector mismatch/not-visible；0 repair/migrate/rebind | planned |
| `GetMetadataHealth` / `TC-SYNC-QRY-004` | persisted integrity/generation/chain | corrupt/missing/unknown；0 auto repair/migration/delete | planned |
| `InspectWorkingCopy` / `TC-SYNC-QRY-005` | read-only Git/fs observation、dirty/path/symlink summary | unsupported/permission/tool failure；0 persist/lock/fetch/apply | tool positive blocked |
| `GetMaterializationStatus` / `TC-SYNC-QRY-006` | delta/plan/run/cursor layered view | pending-finalize/partial/unknown explicit；0 cursor advance | planned |
| `GetConflict` / `TC-SYNC-QRY-007` | conflict fact、impact/path/source refs | missing/not-visible/closed; 0 decision generation | planned |
| `ListConflicts` / `TC-SYNC-QRY-008` | typed index/public opaque cursor/page | invalid cursor, partial index, restricted items；0 full-store guess scan/write | planned |
| `GetRecoveryStatus` / `TC-SYNC-QRY-009` | persisted checkpoint/resolution/probe/next action | missing/invalidated/unknown；0 resume/probe/submit | planned |
| `GetSyncStatus` / `TC-SYNC-QRY-010` | CP1~CP5 safe layered view | degraded/partial/unknown visible；0 refresh/repair/lock | planned |
| `GetReviewHandoffStatus` / `TC-SYNC-QRY-011` | stored attempt/transport/probe/Decision snapshot | 0 Decision read/probe/handoff call；no ACK=accepted | planned |
| `GetProvenance` / `TC-SYNC-QRY-012` | append-only chain/page/integrity state | missing parent/integrity unknown explicit；0补 parent/delete | planned |
| `GetSyncDiagnosticSummary` / `TC-SYNC-QRY-013` | persisted safe slice/correlation | 0 telemetry sink readback/emit；sink failure不变业务结果 | planned |

## 7. Consumer / Job 用例矩阵

| 入口 | 正向/重复 | unsupported/partial | 禁止效果 | 姿态 |
|---|---|---|---|---|
| `ConsumeAccessOrPostureInvalidated` / `TC-SYNC-CONS-001` | valid envelope→snapshot/evaluation stale，unconsumed plan/candidate invalidated；duplicate exact receipt | missing source/schema/order/digest→quarantine；partial affected refs保守失效 | 不 cancel/pull/handoff，不修改 owner truth | planned handler；source blocked |
| `ConsumeMaterialSourceInvalidated` / `TC-SYNC-CONS-002` | valid source ref→cursor unknown、plan/candidate invalidated；duplicate no rewrite | unsupported/delayed/rejected→receipt/quarantine | 不 auto pull/full/rollback，不推 applied cursor | planned handler；source blocked |
| `ConsumeReviewDecisionChanged` / `TC-SYNC-CONS-003` | exact attempt→body-free Decision snapshot；duplicate no rewrite | invisible/mismatch/unsupported→safe marker/quarantine | 不创建/解释 Decision，不改变 Gate | planned handler；Governance blocked |
| `ScanMetadataIntegrity` / `TC-SYNC-JOB-001` | bounded target→per-item integrity classification/report，exact replay | corrupt/missing/partial/commit unknown | 不 repair/migrate/rebind/delete；report 不是 evidence | planned |
| `ProbePendingHandoffAttempts` / `TC-SYNC-JOB-002` | each ProbeRequired gets formal probe identity/result；batch report preserves unknown | unsupported/timeout/partial | 不 submit/resubmit；batch complete ≠ all resolved | local fake planned；probe blocked |
| `MarkStaleOwnerSnapshots` / `TC-SYNC-JOB-003` | formal freshness rule→snapshot/evaluation/plan/candidate conservative state | unavailable/clock ambiguity/duplicate | 不 owner refresh，不 non-Fresh→Fresh | planned; owner read blocked |

## 8. 状态与横切用例

| 用例族 | 覆盖 | 统一断言 |
|---|---|---|
| `TC-SYNC-STATE-001~017` | 17 主语各合法主线、表外 transition、terminal reopen、context/generation mismatch | typed error；无静默 no-op；无副作用；history retained |
| `TC-SYNC-CONSISTENCY-001` | prepare-before-effect、atomic finalize、commit unknown reload | expected version/identity 唯一来源；unknown 不猜 commit |
| `TC-SYNC-IDEMP-001` | same key+digest exact replay、different digest conflict、in-flight second writer | 不重算/重放 effect；stored carrier 先于 replay |
| `TC-SYNC-REDACT-001` | secret/body/path/stdout/stderr/provider response canary | log/audit/trace/result/report/fixture 均无 forbidden value |
| `TC-SYNC-CONFIG-001` | strict JSON、duplicate/alias/unknown/forbidden/high-risk values | fail-fast；不 fallback；profile snapshot immutable |
| `TC-SYNC-ARCH-001` | import/dependency/shell/publisher graph | domain不依赖adapter；无 remote/outbound event truth；CLI不直连 store |

## 9. 关键场景模板

每个后续实现 case 应至少实例化以下字段：

```text
case_id / source_refs / priority / layer / status
precondition_state / explicit_request / controlled_capabilities
expected_disposition / expected_state_delta / expected_write_set
forbidden_calls / forbidden_output / replay_or_fault_variant
planned_artifact_path / planned_report_path / blocker_refs
```

## 10. 回填草稿（未来正式 §6）

正式 §6 将使用上述 protocol、Command、Query、Consumer、Job、state 和横切矩阵组织场景与用例。用例要求同时覆盖本地正常闭环、输入/权限/版本错误、重复与并发、partial/unknown、恢复/探测、敏感输出和禁止副作用；任何 `blocked/waiting` 依赖都必须在 case 状态中保留，不以 fake 或静态报告关闭。

## 11. 待确认事项

| 事项 | 处理 |
|---|---|
| case 文件和 suite 名 | 仅保留语义 ID；runner/package 由 LOCAL-002/004 决定。 |
| 真实 path/content fixture | 只定义类和 redaction 规则；不写真实用户正文。 |
| external provider response | 只使用 typed unavailable/unknown contract 计划；不手写成功 body。 |

## 12. Step 自检与进入下一步门禁

| 检查项 | 结果 |
|---|---|
| 10 Command、13 Query、3 Consumer、3 Job 全部有用例入口 | pass |
| Query zero-write、unknown、idempotency、redaction、VETO 断言明确 | pass |
| 用例没有伪造 runner/run/result/evidence | pass |
| 允许进入 Step 7 | pass |

## 13. 下一步门禁

Step 7 必须为这些用例定义最小安全测试数据/fixture 类别，数据不得含 raw secret、业务正文、真实 credential 或未批准的 provider payload。
