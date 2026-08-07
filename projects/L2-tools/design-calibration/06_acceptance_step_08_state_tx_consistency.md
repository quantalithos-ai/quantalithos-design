# 06 验收标准校准 · Step 8 状态机、事务与一致性

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 8
- 回填章节：正式 `06-验收标准.md` §8

### 1.1 Step 内计划

- [x] 读取 Step 7、03 §9~§12/§15.7、05 §6.6/§11/§14
- [x] 固定六状态族、正式状态名、owning flow 与非法迁移
- [x] 固定 UoW、outcome/audit pair、CAS、append、watermark 与 fake parity
- [x] 固定 idempotency、duplicate/replay、phase/re-entry 和 unknown fence
- [x] 逐门禁写 pass/fail、TC、candidate slot、suite/report、裁决影响并停审
- [x] 完成跨状态一致性审计、回填草稿和下一步门禁

## 2. 本步输入

| 输入 | 固定事实 |
|---|---|
| `03-详细设计.md` §9 | 六个按主语隔离的状态族；BindingMode、requirement、ref、cursor、retry hint 和外部 lifecycle 不构成全局状态 |
| `03` §10 | 8 个 logical Store、明确 UoW 类型、12 项 cross-store invariant；不固定物理数据库/表/隔离级别 |
| `03` §11~§12 | typed error/recovery、namespace/digest、CAS、duplicate、phase/re-entry、watermark/status race |
| `05-测试方案.md` §6.6 | concrete `STATE-001~012`、`TX-001~010`、`CONC-001~023`、`ERR-001~012` |
| `05` §9/§13 | owning suite 为 `contract-domain` 与 `transaction-concurrency`；candidate slot 不是实际 evidence |
| Step 5~7 | `AC-L2T-024~026/038` 和相关功能/协议 gate 已固定，状态门禁不得产生第二需求分母 |

## 3. SOP 问题回答

1. **哪些合法迁移必须通过？**

   六状态族表中由 owning callable/flow 明确定义的迁移全部必须成立，包括 contract adoption/retirement、binding replace/invalidate、invocation admission/no-execution、precondition/handoff local phase、terminal outcome/audit pair、gap/projection lifecycle。每次迁移还必须满足所列原子副作用。

2. **哪些非法迁移必须拒绝？**

   terminal 回退/复活、Awaiting 原地改 Admitted、AcceptedDeny 等同 admission state、Prepared/unknown 自动重调、SubmittedLocally 升级 Delivered/Observed、late material 覆盖历史、Query/Job 修 core truth、older watermark 覆盖 newer 均必须 typed reject/blocked/manual 且无禁止副作用。

3. **哪些事务必须原子提交？**

   accepted Command truth/fact/gap/stored surface、contract/binding 单赢家切换、no-execution pair、outcome/audit pair、consumer receipt/claim completion、Job report/committed refs、CF-13 decision 均按命名 UoW 原子。CF-10 与 OF 只有 phase-1 marker 和 phase-2 disposition 分事务，外部 Port 永不进入本地事务。

4. **幂等和并发如何成立？**

   namespace 包含 entry kind、operation、actor/source scope 与 key；canonical digest 排除 transport/arrival/raw body。same key/digest 只能 exact replay/in-flight；different digest 必须 conflict；CAS 单赢家；equal append 复用、divergent append conflict；stored surface 缺失不能从 current truth 重构。

5. **失败如何判定？**

   任一非法转换成功、half write、half pair、第二 current/terminal、blind replay、unknown 自动重试、late overwrite、Query write、Job repair、older overwrite 或 fake/durable 语义漂移均为 P0 failure；命中对应 `VF-L2T-*` 时升级 VETO，不可风险接受。

6. **后续 phase 状态能否作为当前通过条件？**

   不能。L2 local phase 只裁决到正式 local disposition；Sandbox accepted/run、Bus delivered、Observability observed 等 owner 状态既不属于本地状态机，也不能作为本步 pass 条件。

## 4. 当前文档问题诊断

| 旧 06 问题 | 影响 | 本步修正 |
|---|---|---|
| 没有状态机章节，只写“structured result 分流” | 无法识别合法/非法迁移 | 按六状态族逐项验收正式 state variant |
| “retryable/denied/blocked/fatal” 历史大类 | 与正式 domain/application/phase 状态漂移 | 使用 `03` state/error/attempt 正式名称 |
| 没有 UoW、副作用、CAS 和 replay 断言 | 可能功能值正确但留下 half write/第二副作用 | 每个门禁固定事务和 effect oracle |
| 100% replay 等无来源百分比 | 伪阈值且不说明 duplicate/unknown | 使用全分母 exact replay 与 typed unknown，不造数字性能结论 |
| audit/metrics 补偿“恢复” | 可能让派生面修 truth | Query zero-write、Job no-repair、unknown manual/resolve |

## 5. 改动前后与裁决取舍

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 状态模型 | 通用成功/失败 | 六族 owner-specific variant | 避免跨主语误转换 |
| 一致性 | 结果可读取 | truth/fact/pair/replay/CAS/effect 一起裁决 | 防半写和重复副作用 |
| unknown | 可重试错误 | commit resolve 或 manual；side effect 不二次 call | 无法证明未越界 |
| downstream state | 当成本地完成 | 独立 ref/snapshot，不升级 local state | owner isolation |
| 验收项 | 每个 TC 另造 AC | subordinate `SG/TG/CG/PG` 回指稳定 AC | 不形成第二需求分母 |

## 6. 结构化中间产物

### 6.1 公共状态与一致性 oracle

```text
state_consistency_pass :=
  exact formal state variant and owning flow are used
  AND legal transition commits every named local side effect atomically
  AND illegal/terminal/late transition leaves forbidden effects at zero
  AND duplicate/CAS/append/watermark winner is deterministic
  AND unknown remains unknown until formal resolution or manual action
  AND same-run concrete TC, raw/report pair and final release eligibility exist
```

所有表中 raw 根为 `artifacts/test/<run_id>/suites/<suite>/`。实际通过只能从 matching release final seal 消费；`EV-CAND-*` 仅表示 planned candidate slot。

### 6.2 六状态族门禁

| Gate / state family | Required legal variants/transitions | Failure / forbidden effect | Flow / concrete TC | Candidate / fixed report | AC / impact |
|---|---|---|---|---|---|
| `SG-L2T-001` contract evolution | `none -> Active`; `Active -> RetirementPending -> Retired`; `Candidate -> Current -> Superseded`; `Candidate/Current -> Withdrawn`; source `Resolved/Stale/Conflicting/Unverifiable` 分型 | Retired/Superseded 复活；不兼容/closure/CAS 失败仍切 pointer；contract/current/fact/result 半写 | `CF-01~04`; `TC-L2T-STATE-001~002/009~012`,`TC-L2T-CONTRACT-001~005/008` | `EV-CAND-L2T-STATE-001`,`EV-CAND-L2T-CONTRACT-001`; `reports/runs/<run_id>/suites/contract-domain.md`,`reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-006~008/024/026/038`; P0 |
| `SG-L2T-002` binding/source | binding `Active -> ReplacementPending -> Replaced` 或 `Active/ReplacementPending -> Invalidated`; assessment `AcceptedBound/AcceptedExplicitUnbound/Missing/Stale/Conflicting/Unverifiable` | ExplicitUnbound 从 null 推断；two-current；blocked source 改 relation；terminal relation 复活；old anchor rewrite | `CF-05~07`,`IF-01`,`JF-01`; `TC-L2T-STATE-003/009/011`,`TC-L2T-BIND-001~008` | `EV-CAND-L2T-STATE-001`,`EV-CAND-L2T-BIND-001`; `reports/runs/<run_id>/suites/contract-domain.md`,`reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-009~011/024~026/038`; P0 local/negative |
| `SG-L2T-003` invocation/admission | context `Sufficient/Degraded/Insufficient`; admission `Admitted/AwaitingPrecondition/Rejected/Unavailable`; rejection/unavailable 写正式 no-execution pair | Awaiting 原地改 Admitted；second admission；terminal re-admission；缺 context default；Rejected/Unavailable 写 executed | `CF-08~09`,`QF-04~05`; `TC-L2T-STATE-004/009~012`,`TC-L2T-INV-001~008` | `EV-CAND-L2T-STATE-001`,`EV-CAND-L2T-INV-001`; `reports/runs/<run_id>/suites/contract-domain.md`,`reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-012~017/024/026/038`; P0 |
| `SG-L2T-004` precondition/handoff | requirement closed union；auth `AcceptedAllow/AcceptedConstrained/AcceptedDeny/Missing/Stale/Conflicting/Unverifiable`; handoff `Preparing/Eligible/Blocked/Invalidated`; attempt `Prepared/AttemptedLocally/LocallyFailed/CarrierUnavailable/MappingBlocked/CallOutcomeUnknown` | requirement=decision；deny/default/late overwrite；Eligible=Sandbox accepted；terminal回Prepared；unknown自动重调/host fallback | `CF-09~10`,`IF-02`; `TC-L2T-STATE-005/009/011~012`,`TC-L2T-PRE-001~010` | `EV-CAND-L2T-STATE-001`,`EV-CAND-L2T-PRE-001`; `reports/runs/<run_id>/suites/contract-domain.md`,`reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-015~018/024~026/038`; P0 local/negative |
| `SG-L2T-005` outcome/safe handoff | source `Accepted/Rejected/Missing/Conflicting/MappingBlocked/Unverifiable`; outcome serialized class `succeeded/tool_failed/execution_failed/capture_failed/no_execution_rejected/no_execution_unavailable`; eligibility `Eligible/Ineligible/Unverifiable`; submission `Prepared/SubmittedLocally/LocallyFailed/RouteBlocked/Degraded/SubmissionOutcomeUnknown` | result/error 非 XOR、second/half pair、late overwrite；Ineligible 有 material；local attempt 升 delivery/Observed；unknown 重调 | `CF-11~12`,`IF-03~05`,`OF-01~04`,`JF-04`; `TC-L2T-STATE-006/009/011~012`,`TC-L2T-OUTCOME-001~010`,`TC-L2T-HANDOFF-001~008` | `EV-CAND-L2T-STATE-001`,`EV-CAND-L2T-OUTCOME-001`,`EV-CAND-L2T-HANDOFF-001`; `reports/runs/<run_id>/suites/contract-domain.md`,`reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-019~022/024~026/038`; P0 |
| `SG-L2T-006` integrity/derived | validity `Valid/Stale/Conflicting/Missing/Unverifiable`; gap `Open -> ResolutionPending -> Resolved` 或 `Superseded`; report `Current/Partial/Stale/Failed`; projection `Fresh/Stale/Rebuilding/Unavailable/Failed`; authority `Resolved/CandidateOnly/Missing/Conflicting/Unverifiable` | 无 owner reread resolve；Query/Job repair；older watermark 覆盖；CandidateOnly 变 authority；derived state 变 health/readiness | `CF-13`,`QF-02/07~11`,`JF-01~03`; `TC-L2T-STATE-007~012`,`TC-L2T-JOB-001~003`,`TC-L2T-CONC-016~017` | `EV-CAND-L2T-STATE-001`,`EV-CAND-L2T-JOB-001`,`EV-CAND-L2T-CONC-001`; fixed `contract-domain`,`entry-worker-job`,`transaction-concurrency` reports | `AC-L2T-023~026/031/038`; P0 isolation, peripheral optional |

### 6.3 UoW、原子性与持久一致性门禁

| Gate | Contract / required side effects | Failure condition | Concrete TC / slot | Suite / report | Impact |
|---|---|---|---|---|---|
| `TG-L2T-001` accepted Command UoW | owner truth、fact/assessment/ref、bounded stale/gap、immutable stored result/error 同 confirmed commit | 任一 named write 缺失、external Port 入事务、rollback 后可见 | `TC-L2T-TX-001/005`; `EV-CAND-L2T-TX-001` | `transaction-concurrency`; `reports/runs/<run_id>/suites/transaction-concurrency.md` | `AC-L2T-024/026/038`; P0 |
| `TG-L2T-002` outcome/audit atomic pair | `OutcomeAuditStore.insert_outcome_audit_pair` 是唯一终端写口；result/error XOR | half pair、单写 API、pair 与 invocation/source 不对称 | `TC-L2T-TX-002`,`TC-L2T-OUTCOME-001/007`; `EV-CAND-L2T-TX-001`,`EV-CAND-L2T-OUTCOME-001` | `reports/runs/<run_id>/suites/transaction-concurrency.md`,`reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-019~021/024/038`; hard P0 |
| `TG-L2T-003` prepared side-effect fence | CF-10/OF phase-1 marker confirmed commit 后才允许一次 Port；phase-2 只写 local disposition/gap/replay | Port 在 marker 前、一次以上 call、phase-2 覆盖 terminal | `TC-L2T-TX-003~004`,`TC-L2T-CONC-010~012/019`; `EV-CAND-L2T-TX-001`,`EV-CAND-L2T-CONC-001` | `reports/runs/<run_id>/suites/transaction-concurrency.md` | `AC-L2T-017~018/022/024/038`; hard P0 |
| `TG-L2T-004` Consumer claim/effect | claim confirmed 后才 observational Port/CF-11；receipt 与 effect/claim completion 对称 | Port-before-claim、ack 代 receipt、除 IF-03 外直写 core、unknown 写 committed receipt | `TC-L2T-CONC-006~009`; `EV-CAND-L2T-CONC-001` | `reports/runs/<run_id>/suites/transaction-concurrency.md` | `AC-L2T-018/021~022/024/038`; P0 |
| `TG-L2T-005` maintenance slice | bounded per-target committed refs/gaps/projection + final `JobReport`; Partial 保留成功 refs | unbounded/全扫、内存假 report、target failure 擦除成功、core repair | `TC-L2T-TX-008`,`TC-L2T-CONC-013~015`; `EV-CAND-L2T-TX-001`,`EV-CAND-L2T-CONC-001` | `reports/runs/<run_id>/suites/transaction-concurrency.md` | `AC-L2T-023~025/031/038`; P0 isolation |
| `TG-L2T-006` append/semantic uniqueness | `Inserted/ExistingEqual/Conflict` 闭集；equal 完整相等且零新 effect | divergent 被当 equal、equal 更新版本/时间或再发 fact/event/audit | `TC-L2T-TX-009`,`TC-L2T-CONC-005/018`; `EV-CAND-L2T-TX-001`,`EV-CAND-L2T-CONC-001` | `reports/runs/<run_id>/suites/transaction-concurrency.md` | `AC-L2T-024/026/038`; P0 |
| `TG-L2T-007` commit outcome resolution | `CommitOutcomeUnknown` 先由同 authority `resolve_commit`；Committed 读 durable surface，RolledBack 才按明确 flow 处理 | blind rerun、换 key/authority、unknown 当 rollback/pass | `TC-L2T-TX-006`,`TC-L2T-CONC-020`,`TC-L2T-ERR-006`; `EV-CAND-L2T-TX-001`,`EV-CAND-L2T-CONC-001`,`EV-CAND-L2T-ERR-001` | `reports/runs/<run_id>/suites/transaction-concurrency.md` | `AC-L2T-024/026/038`; hard P0 |
| `TG-L2T-008` stored replay completeness | completed claim 必须指向 kind/scope/digest 匹配的 immutable result/receipt/report/attempt view | surface 缺失仍从 current truth 重构或重跑业务 | `TC-L2T-TX-010`,`TC-L2T-CONC-021`,`TC-L2T-ERR-010`; `EV-CAND-L2T-TX-001`,`EV-CAND-L2T-CONC-001`,`EV-CAND-L2T-ERR-001` | `reports/runs/<run_id>/suites/transaction-concurrency.md` | `AC-L2T-024/026/038`; hard P0 |
| `TG-L2T-009` projection/watermark | source/schema/watermark compare；newest compatible winner，older=`Stale`; Query 仅 degraded read | timestamp 当 CAS、older overwrite、Query rebuild | `TC-L2T-CONC-016~017`; `EV-CAND-L2T-CONC-001` | `reports/runs/<run_id>/suites/transaction-concurrency.md` | `AC-L2T-025/031/038`; P0 |
| `TG-L2T-010` fake/durable parity | CAS、uniqueness、rollback、commit unknown、watermark race、pair atomicity 同序列同结果 | fake 放宽/跳过 conflict、unknown、pair 或 order | `TC-L2T-INV-003`,`TC-L2T-FOUNDATION-012~014`; `EV-CAND-L2T-INV-001`,`EV-CAND-L2T-FOUNDATION-001` | `reports/runs/<run_id>/suites/application-core.md`,`reports/runs/<run_id>/suites/contract-domain.md`,`reports/runs/<run_id>/suites/controlled-seam.md` | `AC-L2T-014/024/027/038`; P0 local seam |

### 6.4 幂等、并发与重入门禁

| Gate | Through condition | Failure condition | Concrete TC / candidate | Fixed report | Impact |
|---|---|---|---|---|---|
| `CG-L2T-001` namespace/digest | namespace=`entry_kind+operation+actor_or_source_scope+key`；digest 只含 typed semantic frame | scope 混用；transport/arrival/raw body/retry metadata 进入 digest 或正文泄漏 | `TC-L2T-CONC-002~003/023`; `EV-CAND-L2T-CONC-001` | `reports/runs/<run_id>/suites/transaction-concurrency.md` | `AC-L2T-024/026/033/038`; P0 |
| `CG-L2T-002` same key replay | same digest 一位 winner，其他 exact stored replay/in-flight；不重跑 transition/fact/audit/Port | duplicate 产生第二 identity/fact/admission/pair/call/report | `TC-L2T-CONC-001/006/009~011/013`; `EV-CAND-L2T-CONC-001` | `reports/runs/<run_id>/suites/transaction-concurrency.md` | `AC-L2T-024/026/038`; hard P0 |
| `CG-L2T-003` divergent digest | same key/different digest=`IdempotencyConflict` 或 quarantine，原事实不变、effect=0 | 覆盖旧 record、另建第二 truth、用新 key 隐藏同一 side effect | `TC-L2T-CONC-002/007`; `EV-CAND-L2T-CONC-001` | `reports/runs/<run_id>/suites/transaction-concurrency.md` | `AC-L2T-024/026/038`; hard P0 |
| `CG-L2T-004` mutable CAS single winner | contract/binding/admission/handoff/gap 的 concurrent update 仅一 winner；loser typed conflict/reload | second current/successor/terminal；stale phase-2 overwrite | `TC-L2T-CONC-004/012/019`; `EV-CAND-L2T-CONC-001` | `reports/runs/<run_id>/suites/transaction-concurrency.md` | `AC-L2T-024/026/038`; hard P0 |
| `CG-L2T-005` terminal/late immutability | late source/status/material 只 append assessment/ref/gap；terminal/history/anchor/attempt 不变 | 原地覆盖、重开、让 status drive recovery | `TC-L2T-CONC-018/022`,`TC-L2T-STATE-011`; `EV-CAND-L2T-CONC-001`,`EV-CAND-L2T-STATE-001` | `reports/runs/<run_id>/suites/transaction-concurrency.md`,`reports/runs/<run_id>/suites/contract-domain.md` | `AC-L2T-021~022/024/026/038`; hard P0 |
| `CG-L2T-006` bounded continuation | next page 使用新 key + exact previous watermark/cursor；Partial count/ref conservation | 同 key 隐式扫下一页、cursor 漂移、partial 丢 committed output | `TC-L2T-CONC-014~015`; `EV-CAND-L2T-CONC-001` | `reports/runs/<run_id>/suites/transaction-concurrency.md` | `AC-L2T-023~025/031/038`; P0 |

### 6.5 Phase、re-entry 与 unknown fence

| Gate / flow | Phase-1 marker | Allowed continuation | Failure condition | TC / candidate / report | Impact |
|---|---|---|---|---|---|
| `PG-L2T-PH-001` `CF-10` | handoff + `ExecutionHandoffAttempt.Prepared` confirmed | one `SandboxExecutionPort` call + phase-2 CAS | generic resubmit、host fallback、Prepared=run/accepted | `TC-L2T-TX-003~004`,`TC-L2T-PRE-006~009`; `EV-CAND-L2T-TX-001`,`EV-CAND-L2T-PRE-001`; `reports/runs/<run_id>/suites/transaction-concurrency.md`,`reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-017~018/024/038`; hard |
| `PG-L2T-PH-002` `CF-12 -> OF` | eligibility/material + Command claim | delegate exact target-specific OF flow | CF-12 自写 delivery/重建 current truth、Ineligible 仍 continuation | `TC-L2T-HANDOFF-001~002/007`; `EV-CAND-L2T-HANDOFF-001`; `reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-022/024/038`; hard |
| `PG-L2T-PH-003` `OF-01~04` | material/event identity + `ExternalSubmissionAttempt.Prepared` | one collaboration call + local disposition | Prepared/`SubmissionOutcomeUnknown` 二次 call、Delivered/Observed inference | `TC-L2T-CONC-010~012`,`TC-L2T-CONT-001~004`; `EV-CAND-L2T-CONC-001`,`EV-CAND-L2T-CONT-001`; `reports/runs/<run_id>/suites/transaction-concurrency.md`,`reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-L2T-022/024/038`; hard |
| `PG-L2T-PH-004` `IF-01/02/04/05` | committed ConsumerClaim | one source observation + refs/gap/receipt | Port-before-claim、direct core mutation、broker ack 代 receipt | `TC-L2T-CONC-006~008`,`TC-L2T-CONSUMER-001~002/004~005`; `EV-CAND-L2T-CONC-001`,`EV-CAND-L2T-CONSUMER-001`; `reports/runs/<run_id>/suites/transaction-concurrency.md`,`reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-L2T-016/021~022/024/038`; hard |
| `PG-L2T-PH-005` `IF-03` | ConsumerClaim + deterministic derived `CF-11` key | replay/commit CF-11 then receipt | alternate key/direct pair write/second source effect | `TC-L2T-CONC-009`,`TC-L2T-CONSUMER-003`; `EV-CAND-L2T-CONC-001`,`EV-CAND-L2T-CONSUMER-001`; `reports/runs/<run_id>/suites/transaction-concurrency.md`,`reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-L2T-018~021/024/038`; hard |
| `PG-L2T-PH-006` `JF-01~04` | Job claim + bounded cursor/watermark | deterministic page + exact final `JobReport` | unbounded scan、duplicate rescan、scheduler run/evidence 创建、core repair | `TC-L2T-CONC-013~015`,`TC-L2T-JOB-001~004`; `EV-CAND-L2T-CONC-001`,`EV-CAND-L2T-JOB-001`; `reports/runs/<run_id>/suites/transaction-concurrency.md`,`reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-L2T-023~025/031/038`; P0 isolation |
| `PG-L2T-PH-007` unknown resolution | `CommitOutcomeUnknown`,`CallOutcomeUnknown`,`SubmissionOutcomeUnknown` 保持原类型 | commit 只同 authority resolve；side effect manual same marker | unknown 自动变 success/failure、换 key、第二 call、删 marker | `TC-L2T-TX-006`,`TC-L2T-CONC-011/020`,`TC-L2T-ERR-006~007`; `EV-CAND-L2T-TX-001`,`EV-CAND-L2T-CONC-001`,`EV-CAND-L2T-ERR-001`; `reports/runs/<run_id>/suites/transaction-concurrency.md` | `AC-L2T-024/026/038`; hard |

### 6.6 状态 / 事务验收项停审

| Gate set | 正式状态/契约 | Trigger flow | TC / slot / report | 副作用断言 | phase/P1 边界 | 停审 |
|---|---|---|---|---|---|---|
| `SG-L2T-001~006`（逐项） | 6/6 pass | 6/6 pass | 6/6 pass | 6/6 pass | 6/6 pass | 6/6 pass |
| `TG-L2T-001~010`（逐项） | 10/10 pass | 10/10 pass | 10/10 pass | 10/10 pass | 10/10 pass | 10/10 pass |
| `CG-L2T-001~006`（逐项） | 6/6 pass | 6/6 pass | 6/6 pass | 6/6 pass | 6/6 pass | 6/6 pass |
| `PG-L2T-PH-001~007`（逐项） | 7/7 pass | 7/7 pass | 7/7 pass | 7/7 pass | 7/7 pass | 7/7 pass |

以上为每行已具备全部字段后的逐项停审计数，合计 29/29；`pass` 只表示设计停审，不是执行结果。

### 6.7 跨状态一致性门禁审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 六状态族与 owner | pass | 无全局 Completed/Success 枚举；BindingMode/requirement/ref 不被误作 lifecycle |
| 正式 state label | pass | 使用 `03` variant；serialized outcome class 明确且不代替 domain type |
| Legal / illegal transition | pass | 每族有 owning flow、from/to、前置、非法行为和零副作用 |
| UoW / pair | pass | accepted truth/replay、no-execution、outcome/audit、receipt/report 边界闭合 |
| CAS / semantic uniqueness | pass | single winner、equal/conflict、loaded version、terminal immutability 无冲突 |
| Idempotency / stored replay | pass | namespace/digest、same/different、missing surface/manual 全覆盖 |
| Phase / re-entry | pass | CF-10/12、OF、IF、JF marker 与唯一 continuation 无断裂 |
| Unknown | pass | commit resolve 与 side-effect manual 分离；没有 blind retry 或第二 call |
| Query / Job effect | pass | Query zero-write；Job bounded/no-repair；外围状态不驱动 core transition |
| Watermark / external status | pass | older 不覆盖，status ref 不升级 local attempt/outcome |
| Fake / durable parity | pass | 语义 parity 是 P0；real owner positive 仍 conditional/blocked |
| Evidence / naming | pass | concrete TC 和 candidate slot 分离；fixed report 可定位；无旧状态名 |
| Cross-step conflict | pass | 与 Step 6 owner/redline 和 Step 7 protocol/依赖裁决一致，无 unresolved conflict |

## 7. 回填草稿

正式 §8 应包含：公共 state consistency oracle；六状态族门禁；UoW/atomic pair/CAS/watermark 门禁；幂等/并发/late material；phase/re-entry/unknown fence。每行展开完整 TC、candidate slot、suite 和 fixed report，不使用 `same`/`mapped` 简写。必须声明后续 owner 状态不是本地通过条件、candidate 不是 evidence、停审 pass 不是测试结论。

## 8. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 物理数据库、表、隔离级别 | implementation binding | 非 06 truth；不得为验收补造 |
| Core/Hub/Auth/Sandbox positive source | source-backed transition qualification | `L2T-UP-001~004/008`；本地/负向门禁可完成，positive blocked/conditional |
| Bus/Obs delivery/observed | external state | 不进入本地 transition；只验 ref/status independence |

无新增上游 blocker。

## 9. 进入下一步条件

- [x] 六状态族全部使用正式 variant、owning flow、合法/非法迁移和副作用断言。
- [x] UoW、pair、CAS、append、watermark、fake parity 可裁决。
- [x] idempotency、duplicate/replay、phase/re-entry 和三类 unknown 均有零副作用/恢复边界。
- [x] 29/29 subordinate gate 已逐项停审，跨状态审计无状态漂移、phase 越界或证据断裂。
- [x] 允许进入 Step 9：非功能验收门禁。
