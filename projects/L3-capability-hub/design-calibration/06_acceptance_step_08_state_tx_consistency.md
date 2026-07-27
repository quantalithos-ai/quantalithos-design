# L3-capability-hub 06 验收标准 Step 8: 定义状态机、事务与一致性验收

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 8
> 书写规范: `standards/document/验收标准书写规范.md` §5.8
> 回填章节: `06-验收标准.md` §8
> Step 状态: `completed-designed / not-evaluated`
> 日期: 2026-07-26

本 Step 把 formal `03` 的状态、持久化、事务、错误恢复、幂等和并发契约转成验收门禁。所有状态/事务结果仍是 future raw-derived contract；本文不声称实现、数据库、UoW、run 或 evidence instance 存在。

## 1. Step 状态、目标与边界

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 8 状态机、事务与一致性验收 |
| 状态库存 | 24 state families、111 variants、`638 = 239 current + 98 reserved + 301 illegal` pairs |
| 一致性库存 | `TX-CH-001..022`；identity/registry/descriptor/seam/relation/exposure/material/reference/capture/idempotency/job/report覆盖 |
| 直接来源 | `03-详细设计.md` §§9~13、`03_ddd_step_10_state_matrix.md`、`03_ddd_step_11_persistence_transaction_consistency.md`、`03_ddd_step_12_error_recovery.md`、`03_ddd_step_13_concurrency_idempotency.md` |
| 测试来源 | `TC/DS/EV-CH-STATE-001..024`、`TC/DS/EV-CH-TX-001..022`，以及 638 个 `SP-CH-*` parameter identities |
| 本步 primary output | state legality/terminality、UoW atomicity、no-write、idempotency、version/race、commit-unknown/recovery gates |
| 不在本步 | NFR numeric gates（Step 9）、evidence integrity（Step 10）、VETO final list（Step 11）、defect/risk/signoff |
| 当前事实 | all criteria `not_evaluated`; no implementation/test/run/artifact/report/verdict claimed |

状态门禁必须使用 formal enum variant 的精确拼写。`pass-designed` 仅表示本文件的 source/coverage/oracle 静态闭合，不表示任何状态转换或事务已执行通过。

## 2. 输入与 authority precedence

| 输入 | 本步承接 | 不得推断 |
|---|---|---|
| `00` §§10~14 | explicit change、truth/data ownership、AC/VF方向 | state execution |
| `03` §9 | 24 state families、variant、allowed/forbidden matrix | enum implementation exists |
| `03` §10 | persistence/repository/UoW/atomicity/read authority | physical store selected |
| `03` §11~12 | typed error, recovery, stored replay, report/capture semantics | failure has occurred |
| `03` §13 | digest/key/version/race/idempotency/commit resolution | concurrency test ran |
| `05` Step 6/7/9/13 | exact state/TX case, pair registry, suite and evidence contract | raw evidence exists |
| Step 5~7 | functional, redline and protocol boundaries | cross-gate already passed |

Formal 03 and its calibration artifacts override old state names, old `304 illegal` arithmetic, old outbox/decision terminology, and L1 reference names. The active state arithmetic is always `239/98/301`; any other count is historical discrepancy and cannot be used as an acceptance denominator.

## 3. SOP 九问回答

| # | 问题 | 收口答案 |
|---:|---|---|
| 1 | 哪些合法状态迁移必须通过？ | Every `current` pair in the 638 registry, plus each allowed formation and same-state reason/value delta, must produce the exact owner transition, version/history/source/capture/material effect prescribed by 03. |
| 2 | 哪些非法迁移必须拒绝？ | Every `illegal` pair must yield the owner’s closed typed rejection/`InvalidStateTransition` or boundary error with zero field/version/time/history/UoW/external effect; terminal variants cannot be repaired in place. |
| 3 | 哪些事务必须原子提交？ | Declared Command truth + history/trace/change + required stale/material/capture + stored result/idempotency completion must share the specified UoW; inbound, outbound phase A, and Job initial/target/final UoWs obey their own exact boundaries. |
| 4 | 哪些幂等/并发必须成立？ | Same digest/key replays the immutable stored result/receipt/report; different digest is typed conflict/rejection; expected-version CAS has one winner; loser reads the authoritative winner; no duplicate mutation or hidden retry. |
| 5 | 失败如何判定？ | Any missing pair, illegal acceptance, wrong state name, partial UoW, duplicate effect, version overwrite, unsafe terminalization, or fabricated commit-unknown result fails or is not decidable. |
| 6 | 是否有旧/口语/后续状态？ | No active row may use old `CapabilityDecision`, `Running`, `Completed` aliases or unintroduced phase state; only formal 03 variants and the `current/reserved/illegal` registry are valid. |
| 7 | 是否能回指完整闭环？ | Yes: each family has `TC/DS/EV`, `SP-CH-*`, formal state source, triggering C/Q/I/O/J flow, fixed raw/report path and verdict impact. |
| 8 | 是否逐项停审？ | Yes; 24 state families, 22 TX cuts and seven cross-state invariants each have a design stop-review. |
| 9 | 是否有冲突？ | Static audit target is state name drift=0, unclassified pair=0, duplicate denominator=0, phase leakage=0 and missing side-effect oracle=0; real execution must rerun the audit. |

## 4. Shared state-pair and evidence contract

### 4.1 Exact pair registry

Each applicable family consumes all ordered `from != to` pairs from the formal ordered variant list. A pair record is:

```text
pair_id = SP-CH-<FAMILY>-<FROM>-<TO>
classification = current | reserved | illegal
owner_callable_or_external_edge
current_flow_refs
typed_error_or_terminal
zero_effect_profile
formal_source_anchor
```

For `ReferenceResolutionValue`, `kind` is included: `SP-CH-REFERENCE-<KIND>-<FROM>-<TO>`. No sampling, family-level count, generic status mapper, or implementation branch may infer classification.

### 4.2 Denominator lock

| Group | Families | current | reserved | illegal | pair count |
|---|---:|---:|---:|---:|---:|
| identity/review/registry | 3 | 25 | 8 | 41 | 74 |
| descriptor/summary/seam | 5 | 17 | 44 | 43 | 104 |
| exposure/visibility/trace/impact | 6 | 27 | 34 | 53 | 114 |
| material/report | 4 mutable + report formation | 42 | 12 | 2 | 56 mutable |
| reference kinds | 8 kind matrices | 116 | 0 | 136 | 252 |
| capture/external collaboration | 2 local + 1 external boundary | 7 | 0 | 15 | 22 |
| idempotency/job | idempotency + job execution/target | 5 | 0 | 11 | 16 |
| **total** | **24 families** | **239** | **98** | **301** | **638** |

```text
638 = 74 + 104 + 114 + 56 + 252 + 22 + 16
239 + 98 + 301 = 638
```

`ReconciliationReportState` is immutable formation coverage and is not incorrectly added to mutable pair arithmetic. Its five outcomes still require exact formation/no-update evidence.

### 4.3 Common branch oracle

| Branch | Required result | Required zero-effect |
|---|---|---|
| formation accepted | exact initial variant, owner/ref/policy/source and first version/time symmetry | no transaction-local intermediate save or undeclared owner call |
| formation rejected | exact contract/domain/policy/application error | no ID/Clock/object/repository/history/trace/capture/material/external call |
| current pair | exact target variant and owner-specific delta/history/capture/UoW | no generic status or unregistered flow |
| reserved pair | owner-level guard where declared; integration/flow route stays disabled | no truth/history/trace/capture/material/result/external effect |
| illegal pair | closed typed rejection or terminal guard | no field/version/time/history/UoW commit/external call |
| same-state delta | version +1 only when formal compared reason/value/source changes | unrelated owner mutation/capture/material may not occur |
| same-state no-op/duplicate | exact no-op or stored replay | no save/clock/id/history/trace/capture/resolver/collaboration |
| terminal/payload | exact rejection or new fact/object path | no in-place reopen/overwrite/current-index resurrection |

Every state/TX evidence row uses:

```text
case raw   = artifacts/test/<run_id>/suites/<primary-suite>/cases/<tc-id>.json
suite raw  = artifacts/test/<run_id>/suites/<primary-suite>/suite-result.json
report     = reports/runs/<run_id>/suites/<primary-suite>.md
index      = reports/runs/<run_id>/evidence-index.md
```

## 5. State-family acceptance gates

| Gate | Exact families / members | TC / DS / EV selector | Pass condition | Failure condition | Verdict impact |
|---|---|---|---|---|---|
| `AC-CH-STATE-CORE` | S01 `CapabilityIdentityState`; S02 `CapabilityAccessReviewFactState`; S03 `RegistryLifecycleState` | `STATE-001..003`; supporting CMD `001..008`, QUERY `001..006`, TX `001..010` | all 74 pairs and formations use formal states; identity/registry ownership, current/history/index, terminality and visibility prerequisites are exact; correction/review/registry changes are explicit | any illegal pair accepted, identity/registry state inferred from URL/listing/cache/review, Draft intermediate persisted/exposed, terminal overwrite, missing pair | blocks AC001/002/006..011 and relevant VF candidate; no waiver |
| `AC-CH-STATE-DESCRIPTOR-SEAM` | S04~S08: descriptor, risk summary, secret safe summary, governance seam, method relation | `STATE-004..008`; CMD `009..017`, QUERY `007..14`, INBOUND `001..002`, TX `011..016`, BIND/OBS | 104 pairs, body-free ref/safe-summary/source symmetry, seam/relation terminal guards and explicit replacement/removal pass | provider/secret/approval/method body or lifecycle leaks; reserved/illegal pair mutation; relation/ref/source mismatch; terminal in-place recovery | blocks AC003/004/012..017 and AC031/032; VETO candidate |
| `AC-CH-STATE-EXPOSURE` | S09~S14: exposure, visibility, trace, impact, downstream summary, consumer view | `STATE-009..014`; CMD `018..023`, QUERY `015..23`, INBOUND `003`, OUTBOUND `006..008`, TX `017..20` | 114 pairs preserve prerequisite, source/version, scope, gap/supersession, freshness and no reverse-write semantics; formal visible only from complete prerequisites | draft/unresolved/not-governed becomes visible; view/feedback/report repairs truth; gap/superseded contradiction; stale/no-op mishandled | blocks AC005/018..020/029..030 and may trigger VF008/009/010 |
| `AC-CH-STATE-MATERIAL` | S15~S17/S24: directory projection, audit export, ecosystem discovery, reconciliation report | `STATE-015..017,024`; QUERY `024..028`, JOB `001..006`, OUTBOUND `009`, TX `013,014,20,21` | all material pairs/formation outcomes retain source/scope/version/reason; report outcomes immutable; maintenance never creates core truth | report/summary treated source; listing/audit body enters material; unsafe target terminalization; duplicate append/rescan or core repair | blocks AC011/022/028/030; relevant VETO candidate |
| `AC-CH-STATE-REFERENCE` | S18 `ReferenceResolutionValue` across 8 kinds | `STATE-018`; CMD `024..26`, QUERY `029..33`, INBOUND `001,002,004..06`, OUTBOUND `010`, JOB `007`, TX `017..20` | all 252 kind-aware pairs and all applicable values preserve subject/kind/digest/reason/version; Invalid/Forbidden/Expired semantics exact; terminal replay/no-op distinct | wrong kind/body, generic state, terminal resolver reopens, reference state auto-repairs dependent truth, 252 denominator sampled or incomplete | blocks AC013/017/019/031/032 and may trigger VF004/006/011 |
| `AC-CH-STATE-CAPTURE-JOB` | S19~S23: capture, idempotency, job execution/target, external collaboration | `STATE-019..023`; OUTBOUND `001..10`, JOB `001..08`, TX `017..22` | capture/intent, Reserved/Completed, Planned/Finalized, target payload and external status follow exact owner; crash/race/reentry produce one winner and no local delivery lifecycle | capture incomplete, idempotency result replaced, job finalizes nonterminal target, unsafe failure terminalized, external status becomes local truth, duplicate effect | blocks AC005/021 and Step 7 Job/event gates; possible VETO |

## 6. Transaction, consistency and idempotency gates

| Gate | Formal contract | Exact TC / DS / EV selector | Pass condition | Failure condition | Verdict impact |
|---|---|---|---|---|---|
| `AC-CH-TX-001` | 22 transaction cuts; accepted Command UoW | `TX-001..022`; supporting CMD/QUERY/I/O/J selectors | truth, required history/trace/change, stale/material/capture, stored result and idempotency completion commit/rollback as exact flow declares; one authoritative UoW/transaction reference | truth visible without required sidecar; adapter opens hidden UoW; partial cross-store write; rollback/commit result guessed | P0 failure; cannot risk-accept |
| `AC-CH-TX-002` | Query no-write and derived no-repair | TX `013,014,17,20,21`; QUERY/JOB/OUTBOUND | every Query and derived maintenance has zero UoW/save/capture/core repair; typed stale/partial/unavailable returned | read path writes/refreshed/rebuilds, report repairs truth, missing sidecar downgraded to success | blocks P0 and feeds VF007 |
| `AC-CH-TX-003` | source/capture/intent and event phase boundary | TX `017..020`; OUTBOUND `001..10`; STATE `019,023` | Phase A local Durable/capture is independent of Phase B external collaboration; stable intent binding has exact source/snapshot symmetry; external failure cannot rollback local truth | external collaboration before durability, incomplete capture, local delivery state/outbox/attempt lifecycle, source rollback on external failure | blocks AC021; VETO candidate |
| `AC-CH-TX-004` | Job initial/target/final UoW and journal | TX `020..022`; JOB `001..08`; STATE `021,022,024` | frozen plan, initial reservation/journal, per-target outcome, final report/journal/idempotency are exact; crash/reentry reads durable journal and does not rescan | target result not durable, final report mismatches journal, reentry changes plan/ordinal, commit-unknown fabricated, partial target dropped | blocks AC011/021 and P0 release |
| `AC-CH-IDEM-001` | two-state idempotency and same/different digest | TX `001,002,008..010,15,22`; STATE `020`; CMD/INBOUND/JOB | same normalized key+digest returns immutable stored shell/surface/receipt/report; different digest is closed conflict/rejection; only Reserved->Completed; no persisted fake Conflict state | duplicate reruns mutation/clock/id/capture; different digest overwrites winner; Completed reopens or result replaced; missing result recomputed from current state | P0 failure; non-waivable for current P0 |
| `AC-CH-IDEM-002` | CAS/version/race winner | TX `003..007,11,12,15,16,21`; all mutable owners | expected version/key/index is loaded from authoritative source; one winner; loser reads exact winner; no `None` upsert or cursor-as-version | stale writer overwrites, unique race creates two current rows, private finder chooses first row, loser synthesizes result | P0 failure; possible VF010 |
| `AC-CH-IDEM-003` | commit outcome resolution | 03 §11/12; TX `018,20,22` | `Durable|NotDurable|Unknown`/equivalent formal resolution maps to exact retry/read/stop action; Unknown never silently becomes success or safe retry | blind retry after commit unknown, rollback failure swallowed, winner read not authoritative/linearizable, side-effect duplication | P0 failure; no risk acceptance |

## 7. Consistency failure classification

| Failure | Required classification | Forbidden downgrade |
|---|---|---|
| loaded owner/version/index/sidecar contradiction | `ApplicationError::ConsistencyDefect` or exact formal consistency mapping | `Degraded`, missing row, partial prefix or silent repair |
| malformed/forbidden state transition input | contract/domain/policy typed error | generic status text or accepted no-op with hidden mutation |
| commit cannot be resolved | `CommitOutcomeUnknown` | success, retryable duplicate mutation, or inferred rollback |
| rollback cannot be proven | exact rollback/unknown technical error and safe diagnostic | fabricated terminal business report |
| duplicate same key/digest | immutable stored replay | rerun, current-state reconstruction or new ID/capture |
| duplicate different digest | closed conflict/rejection | persisted generic `Conflict` state or winner overwrite |
| Query/Job/report side effect | exact zero-effect finding / application error | expected degraded result or report-only pass |
| state pair absent from registry | design/test completeness blocker | assume illegal, sample, or omit denominator |

## 8. State/TX stop-review registry

| Review axis | Coverage | Source/flow fixed | Side-effect oracle fixed | Design result |
|---|---:|---|---|---|
| state family names/variants | 24/24, 111/111 | yes | yes | `pass-designed` |
| pair registry | 638/638; 239/98/301 | yes | yes | `pass-designed` |
| legal/illegal/reserved | all classifications | yes | yes | `pass-designed` |
| terminal/no-op/same-value reason | all applicable families | yes | yes | `pass-designed` |
| TX cuts | 22/22 | yes | yes | `pass-designed` |
| duplicate/CAS/race | exact idempotency/TX selectors | yes | yes | `pass-designed` |
| commit unknown/rollback | formal error/recovery owner | yes | yes | `pass-designed` |
| Query/derived no-write | 33 Query + 8 Job + derived event surfaces | yes | yes | `pass-designed` |
| phase/P1 leakage | no selected/production/numeric claim in predicate | yes | yes | `pass-designed` |

## 9. Cross-state consistency audit

| Audit item | Result | Follow-up owner |
|---|---|---|
| state name drift | `0` in active design registry | Step 10 source scan and Step 15 audit |
| pair denominator gap/duplicate | `0` design gap; 638 exact required | Step 5 test runner/Step 10 evidence |
| current/reserved/illegal misclassification | `0` known; active counts fixed | controlled reopen of 03 Step 10 if drift |
| phase boundary violation | `0` planned; external collaboration and Job phases separated | Step 7/10 |
| missing side-effect assertion | `0` in canonical case contracts | Step 10 raw oracle audit |
| Query write / Job repair | forbidden | Step 6/11 |
| terminal unsafe recovery | forbidden | Step 11 VETO |
| old state/topology/threshold leakage | active rows `0` | VF013 / final audit |
| unresolved upstream blocker | `0` | none |

## 10. 回填草稿：formal `06-验收标准.md` §8

正式章节只保留：

1. 24 state families、111 variants、638 pair denominator and `239/98/301` classification;
2. legal/illegal/reserved/terminal/no-op and exact enum naming rules;
3. `AC-CH-STATE-*` family gates and `AC-CH-TX-*`/`AC-CH-IDEM-*` transaction gates;
4. UoW atomicity, Query no-write, derived no-repair, capture phase, Job journal/reentry, CAS/winner and commit-unknown conditions;
5. fixed TC/DS/EV and raw/report path templates;
6. consistency failures cannot be downgraded to degraded/success and no current risk acceptance is allowed for P0 truth/idempotency/evidence failures.

## 11. 待确认事项与受控重开

| 事项 | 当前状态 | 处理 |
|---|---|---|
| physical store/UoW implementation | not selected | 07 boundary contract must implement the formal authority; no product assumption in 06 |
| pair parameter fixture generation | not executed | 07/05 runner consumes exact `SP-CH-*` registry; no sampling |
| commit resolution backend | not selected | only formal three-way resolution and authoritative read are acceptance requirements |
| numeric concurrency/latency thresholds | none | not evaluated; do not restore historical values |
| state arithmetic discrepancy in historical material | resolved in favor of `301 illegal` | any new count reopens owning 03/05 source step |

## 12. Step 8 完成门禁与下一步

| 条件 | 结果 |
|---|---|
| 24/24 state families and 111 variants | `closed; pass-designed` |
| 638/638 pairs with 239/98/301 classification | `closed; pass-designed` |
| 22/22 TX cuts | `closed; pass-designed` |
| legal/illegal/terminal/no-op and side-effect rules | `closed` |
| idempotency/CAS/race/commit-unknown/rollback | `closed` |
| Query no-write and Job no-repair cross-check | `closed` |
| implementation/run/artifact/report/evidence/verdict/signoff facts | none claimed |
| unresolved upstream blocker | `0` |
| formal `06-验收标准.md` modified | `no; Step 15 only` |
| 下一步 | `enter_06_step_09_nonfunctional` |

Step 8 的 `pass-designed` 仅表示状态、事务和一致性验收设计静态闭合，不表示真实状态机、事务或并发结果已通过。
