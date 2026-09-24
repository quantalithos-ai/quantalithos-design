# Step 13. 并发、幂等与重入保护

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 13
> 书写规范：`standards/document/详细设计书写规范.md` §5.12
> 参考框架：`projects/L1-governance/design-calibration/03_ddd_step_13_concurrency_idempotency.md`
> 回填位置：未来正式 `03-详细设计.md` §12
> 状态：`completed_with_upstream_blockers`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| current_step | Step 13 |
| current_module | `concurrency_idempotency:race_duplicate_reentry` |
| gate_status | `pass_for_step_14` |
| input_baseline | Step 7～12 contracts/flows/state/persistence/error |
| formal_03_write_allowed | `false_until_step_19` |
| implementation_write_allowed | `false` |
| next_allowed_action | 创建 Step 14 配置引用与外部依赖绑定中间产物 |

本步只定义语义并发、幂等键、digest、duplicate replay 与重入保护；不定义 retention、hash crate、retry/backoff、scheduler、DLQ 或 transport 产品。

## 2. SOP 问题回答

| 问题 | Runner 答案 |
|---|---|
| 哪些资源会并发修改？ | selection/material/integrity/cache、run/control/recovery/handoff、projection/read-section、idempotency/result、job entry/claim/checkpoint/report、consumer receipt 和 adapter markers。Query 不参与写并发。 |
| 哪些入口可重复？ | 11 Command、4 planned Consumer、5 Operations Job；Query 可重复读取但不创建幂等记录。 |
| 幂等键来源？ | Command metadata key；Consumer trusted header dedup key（当前仅 negative path）；Job metadata key；per-item projection/outbox 使用 formal identity + expected version，不伪造 application key。 |
| 重复请求如何处理？ | same operation/key/digest 完成后读完整 stored result；in-flight 返回 InProgress/Unknown；digest 不同返回 Conflict；缺 result 是 consistency Unknown，绝不重跑。 |
| 并发如何测试？ | 覆盖 version/generation conflict、duplicate/no-side-effect、external effect unknown、claim/checkpoint ambiguity、projection replacement race、consumer header duplicate 和 Query no-write。 |

## 3. 统一幂等与 digest 规则

### 3.1 Key matrix

| 入口 | normalized key | 保护对象 | duplicate surface |
|---|---|---|---|
| Command | `RunnerOperationIdempotencyKey(operation_name, metadata.idempotency_key)` | local transition / external intent | exact `RunnerStoredCommandResult` |
| planned Consumer | `RunnerOperationIdempotencyKey(consumer_name, trusted_header.dedup_key)` | receipt / future apply marker | exact stored receipt；当前只允许 negative path |
| Operations Job | `RunnerOperationIdempotencyKey(job_kind, metadata.idempotency_key)` | entry/claim/checkpoint/report | exact `RunnerJobReport` |
| Query | none | none | current authorized read only |
| J05 section replacement | formal `projection_ref + composition_generation + expected_version` | existing section | conflict/no-write; not application duplicate |

Same raw key under different operation names is not a duplicate. Key normalization comes from typed metadata; no prefix parsing or local counter.

### 3.2 Canonical digest

Digest includes only stable result-affecting input: operation name, explicit route refs, trusted actor/scope when semantic, command DTO stable fields, consumer source/schema/dedup/header fields, job kind/scope/page/target refs, and expected version when it is a semantic guard. It excludes idempotency key, request/entry/run ids generated after reservation, trace id, timestamps, transport headers, delivery/retry counters, random values, PID/port/socket, raw payload/body and current wall-clock.

`None` and omitted fields are normalized by DTO validation before digest; field ordering and enum variant names are deterministic. Exact hash algorithm remains pending `RUN-UP-008`/runtime authority.

## 4. 并发场景表

| 场景 | 冲突资源 | 控制方式 | 失败错误 | 测试切口 |
|---|---|---|---|---|
| concurrent same Command | idempotency record + target object | atomic reserve + exact digest + expected version | `AlreadyInProgress` / `IdempotencyConflict` | same-key same/different digest |
| selection reselect/invalidate race | selection generation/version | successor generation and versioned save | `Conflict` | stale generation no overwrite |
| acquisition/progress vs cancel | task version | expected-version transition | `VersionConflict`/invalid transition | cancel wins deterministically |
| integrity verify vs invalidation | posture/cache binding | posture version + binding guard | `Conflict`/`Blocked` | no stale Verified |
| cache eviction vs run/cleanup | cache metadata + protection guard | guard reread + versioned metadata | `SafetyBlocked`/`Conflict` | candidate never direct Evicted |
| run/control concurrent basis | intent/control/projection | explicit basis and per-axis version | `Conflict` | no Accepted→Running/Confirmed shortcut |
| recovery reconcile vs new command | recovery case + intent | case basis/version; new intent only after closure | `Conflict`/`Unknown` | no resend/reclaim |
| J05 refresh vs Query | read section generation/version | guarded replace only in explicit Job | generation `Conflict` | Query calls zero writes |
| duplicate result missing | idempotency + stored result | consistency check | `Unknown` + RecoveryCase | no recompute/rerun |
| two Job workers | claim/entry/checkpoint | local claim expected version | `ClaimConflict`/`Unknown` | no automatic reclaim |
| checkpoint update race | checkpoint version/basis | exact version and basis | `CheckpointUnknown` | stale checkpoint cannot resume |
| Consumer redelivery | trusted header receipt | exact header/dedup lookup | `Duplicate`/`Blocked` | no payload parse/hash |
| adapter marker/build reload | marker/builder identity | new marker/new builder | `NotReady`/conflict | no in-place Ready recovery |

## 5. 重复处理矩阵

| Existing record | Incoming digest | 行为 | 对外结果 |
|---|---|---|---|
| absent | valid | reserve then execute allowed flow | normal typed outcome |
| completed same key/digest | same | rollback current candidate; load stored surface | `DuplicateReplayed` / exact stored result |
| completed same key/digest | different | no domain/port/job call | `Conflict(IdempotencyConflict)` |
| reserved/in-flight | same or different | no second writer; preserve reservation | `InProgress`/`Unknown` or conflict |
| completed but result missing/wrong kind | same | consistency failure; no reconstruction | `Unknown` + recovery |
| idempotency store unavailable | any | no business write or external effect | blocked/application error |
| repeated Query | n/a | committed read only | current view/surface |

## 6. 重入保护表

| 场景 | 重入来源 | 保护方式 | 恢复方式 |
|---|---|---|---|
| command timeout after external call | client retry | same key reserve/result read | replay or read-only reconcile |
| terminal local commit unknown | connection/store failure | same key first; inspect result/reservation | Unknown/recovery; no blind retry |
| external call outcome unknown | timeout/disconnect | intent already durable | owner readback only; no resend |
| Job crash after claim | worker restart | claim/checkpoint basis | freeze/RecoveryCase; no auto reclaim |
| duplicate Job same key | scheduler/operator | stored report lookup before claim/scan | report replay |
| Consumer redelivery | at-least-once delivery | header-first exact receipt | strict Duplicate or body-free Blocked |
| projection rebuild race | stale marker/rebuild overlap | cursor/generation monotonicity | current generation wins; older result rejected |
| handoff retry | adapter/operator retry | handoff marker identity/version | new explicit attempt only; delivered not redelivered |

## 7. Commit-unknown 重入口径

```text
[same operation + same key + same digest]
              |
              v
    reserve/read idempotency first
       | Duplicate       | InProgress/Unknown
       v                 v
 load exact stored      no mutation; open/read RecoveryCase
 surface by kind       and await formal reconciliation
```

A commit-unknown retry may not use a new key, regenerate a result from current truth, resend an owner request, reclaim a claim, or create a new projection identity. If the adapter can prove the prior transaction did not commit, only then may the same key continue under its explicit contract; default Runner posture is read-only recovery.

## 8. Outbox/projection/reference/handoff rules

- Runner has no outbound event/outbox flow; no publisher dedup is introduced.
- J05 section replacement uses existing projection identity, expected local version and exact composition generation; older result becomes Conflict.
- Reference/owner projection refresh is versioned local derived state; it never repairs Release/Governance/Sandbox/Runtime truth.
- Handoff marker/receipt is local and body-free; duplicate handoff does not create evidence/report/verdict/signoff.
- Job duplicate replay returns stored report and does not rescan, refresh, reconcile, transfer, cleanup or redeliver.

## 9. 测试切口（设计输入，不代表已执行）

| 测试切口 | 验证内容 | 类型 |
|---|---|---|
| `RUN-TC-IDEM-001` | same key + same digest replays exact stored Command result with zero mutation/port calls | application |
| `RUN-TC-IDEM-002` | same key + different digest returns conflict | application |
| `RUN-TC-IDEM-003` | in-flight reservation does not admit second writer | repository/application |
| `RUN-TC-IDEM-004` | digest excludes time/request/trace/retry/PID/raw body | contract |
| `RUN-TC-IDEM-005` | Completed + missing stored result becomes Unknown/recovery, never rerun | consistency |
| `RUN-TC-CONC-001` | stale object version cannot overwrite current object | repository |
| `RUN-TC-CONC-002` | generation mismatch rejects section replacement | projection |
| `RUN-TC-CONC-003` | Job claim/checkpoint ambiguity freezes and does not reclaim | operations |
| `RUN-TC-CONS-001` | Consumer strict stored duplicate requires exact trusted header fields | worker |
| `RUN-TC-QUERY-001` | repeated Query performs zero reservation/save/refresh/reconcile calls | query |

## 10. Cross-step closure audit

| 审计项 | 结论 |
|---|---|
| key source is typed and computable | pass for semantic contract |
| digest include/exclude explicit | pass; exact hash implementation pending |
| duplicate replay surface complete | pass for Command/Consumer/Job shapes |
| Query no-write | pass |
| version/generation race guards | pass |
| external effect unknown no-replay | pass |
| positive Consumer ordering/dedup | blocked/reserved (`RUN-UP-001~008`) |
| durable reservation/claim implementation | blocked (`RUN-DDD-001~003`) |

## 11. Step 14 handoff

Step 14 must bind configuration for key scopes, page bounds, readiness slots, profile identity and adapter dependencies without changing these invariants. It must not turn configured/connected into Ready or use configuration to bypass exact version, safety guard, or no-replay rules.

## 12. Step 13 完成条件

| 条件 | 结论 |
|---|---|
| 并发资源表 | completed |
| 幂等 key/digest | completed as semantic contract |
| duplicate/in-flight/conflict matrix | completed |
| commit unknown/re-entry | completed |
| test cuts | completed as future design inputs |
| exact backend/hash/retry policy | blocked and not selected |
| next gate | `pass_for_step_14` |

Step 13 完成。本文不证明实现、测试、adapter、baseline、run、report、evidence、verdict、signoff 或 readiness 存在。
