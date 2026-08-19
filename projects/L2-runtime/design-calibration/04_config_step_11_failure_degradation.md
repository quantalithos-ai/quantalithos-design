# L2-runtime 04 配置设计 Step 11：失效模式与 fail-fast / fail-closed / degraded

> 创建日期：2026-08-17
> 状态：`done`
> 当前模块：`invalid_config / build_failure / valid_config_runtime_failure / drift / safe_signal`
> 回填位置：正式 `04-配置设计.md` 第 11 章

## 1. Step 开工确认与两层故障模型

| 层 | 判定时机 | 典型问题 | 允许 posture | 禁止 |
|---|---|---|---|---|
| A. candidate configuration | V0~V12 与 builder、facade publication 前 | source/JSON/type/range/ref/cross-field/slot/job/local dependency | `fail-fast`、`Invalid`、`Blocked`、no publication | degraded startup、partial snapshot、silent default/fallback |
| B. runtime dependency under valid snapshot | operation/page 使用已发布 snapshot 时 | owner pending/stale/unavailable、external call unknown、lease loss、projection stale | `fail-closed`、`Waiting`、`Blocked`、`Unavailable`、explicit `Degraded`、`Unknown` | 修改 snapshot、绕过 guard、fake fallback、positive inference |

配置错误不允许降级成“带病启动”。Conversely，运行期 external owner failure 不一定使整个进程配置无效：只要 `03` 已定义安全子集与负向结果，受影响 path 可以 fail closed，未受影响 local/read-only path 可按 profile 继续。

## 2. 失效 posture 词表

| Posture | 精确定义 | 适用位置 | 不适用/禁止误解 |
|---|---|---|---|
| `fail-fast` | 在任何 entry facade 暴露前终止当前 candidate composition | source/schema/value/security/local required dependency | 不等于具体 process crash/restart policy |
| `fail-closed` | 无法证明 authority/safety/owner fact/effect status 时拒绝正向操作 | action/model/delegation/recovery/handoff/job/external seam | 不得转为 permissive default 或直连 owner |
| `Blocked` | 存在已知 blocker/unconfigured required path | slot/job/capability/entry | 不是 Degraded success 或 readiness |
| `Waiting` | 缺少可能到达且无 unknown-effect 风险的明确 fact | source/definition/governance/result | 不能用来隐藏 conflict/Unknown |
| `Unavailable` | dependency 已知当前不可用且未形成可能已发生的 effect | external read/call before accepted submission | 不能宣称永久失败或自动改配置 |
| `Degraded` | 仅返回 `03` 明确定义、显式标记且不冒充 Current/complete 的安全子集 | stale projection、optional source omission、local query | 不能用于 mutation authority、guard bypass、checkpoint proof |
| `Unknown` | publication/commit/external effect/ack disposition 不可判定 | effect/replacement/commit/reconcile | status-only/manual；禁止 ordinary retry/成功推断 |
| cold retain/rollback | candidate process fails before replacement so old owner-known process remains，或重新验证 prior document 冷替换 | Step 10 deployment lifecycle | 不是 in-process `last-known-good`/reload pointer |

P0 不支持 `reject-new-value`、online `last-known-good` 或 hot/reload failure recovery；这些词只可作为 future design trigger，不能出现在当前正向状态机。

## 3. 配置候选失效模式总表

| ID | 失效模式 | 影响 | 系统行为 | 是否生成 signal candidate | 05 测试切口 |
|---|---|---|---|---|---|
| CF-A01 | zero/multiple/unknown source selector | whole candidate | `SourceUnavailable`/`UnknownEnvironmentVariable`; fail-fast; no load fallback | yes, source class/code only | selector cardinality/allow-list |
| CF-A02 | source unreadable/empty/truncated/non-UTF-8 | whole candidate | `SourceUnavailable`/`MalformedJson`; no snapshot/facade | yes, locator excluded | bounded source reader |
| CF-A03 | malformed JSON/comment/trailing data | whole candidate | `MalformedJson`; reject document | yes, stage/code only | strict syntax corpus |
| CF-A04 | duplicate key at any depth | whole candidate | `DuplicateKey`; never last-write-wins | yes, safe path | duplicate-aware parser |
| CF-A05 | missing/unknown/case/legacy/static-derived key | root/domain/slot/job | `MissingRequired`/`UnknownKey`/`ForbiddenKey`; reject whole candidate | yes, canonical path/category | closed shape/alias corpus |
| CF-A06 | raw secret/provider endpoint/route/quota/cost or secret-shaped ref | security boundary | `SecretMaterialDetected`/`ForbiddenKey`; minimize diagnostics | yes, no value/excerpt | no-leak security corpus |
| CF-A07 | exact JSON type/enum/nullability/array uniqueness error | affected leaf/domain | `TypeMismatch`/`MissingRequired`; reject whole candidate | yes, expected/actual category | 153-leaf type partition |
| CF-A08 | integer overflow/zero/negative/fraction/range relation | bounds/retention/page/lease | `RangeViolation`/`CrossFieldConflict`; no clamp/default | yes, range category | boundary/property tests |
| CF-A09 | schema/version/ref owner-kind malformed/incompatible | policy/slot/security | `SchemaMismatch`/type/security error; no owner resolution fallback | yes, ref fingerprint/category only | typed-ref/schema tests |
| CF-A10 | domain/profile/environment/authority conflict | snapshot/profile | `CrossFieldConflict`; no facade | yes, domain/path set | X-01~X-10 matrix |
| CF-A11 | 13-slot shape/tuple/owner/dependency conflict | builder binding | config reject or `SlotMismatch`/`DependencyDirectionViolation`; zero call | yes, slot/blocker category | S-01~S-10 matrix |
| CF-A12 | 7-job shape/tuple/profile/slot/retry conflict | job exposure | config reject/Blocked; no lease/page start | yes, job/blocker category | J-01~J-10 matrix |
| CF-A13 | TestFake source/binding outside `ci_contract + test_fake` | authority/integration | `FakeBindingForbidden`; no production-like facade | yes, slot/profile only | fake isolation |
| CF-A14 | required local UoW/repository/ID/digest/clock/config reader missing | selected entry | `MissingLocalDependency`; fail-fast | yes, dependency kind only | builder composition |
| CF-A15 | fingerprint/snapshot identity/publication conflict | candidate assembly | `PublicationConflict`; publish nothing | yes, safe candidate ref/fingerprint | deterministic assembly/injected conflict |
| CF-A16 | operation/job supplied snapshot ref absent/mismatched | current operation/page | `SnapshotNotFound`; reject before reservation/UoW/lease | yes, ref fingerprint/correlation | capture/by-ref negative |
| CF-A17 | hot/reload/config-center/admin override request | unsupported source/lifecycle | reject source/key/request; do not emulate | yes, unsupported category | forbidden lifecycle |
| CF-A18 | candidate validation/build/replacement fails during cold change | new process only | old process unchanged only when deployment owner knows it remains; otherwise Unknown/manual | yes, distinct validation/build/replacement disposition | cold replacement fault injection |

## 4. 配置有效后的运行依赖失效总表

| ID | Runtime failure under valid snapshot | 影响 | Required behavior | Signal boundary | 05 测试切口 |
|---|---|---|---|---|---|
| CF-B01 | configured Blocked slot or still-open upstream blocker | affected path/entry/job | deterministic Blocked/Waiting；zero positive external call | slot + blocker safe ID/category | blocked adapter zero-call |
| CF-B02 | Candidate adapter reports PendingContract/Unconfigured | affected operation | fail-closed；do not promote Candidate/Bound to availability | slot/posture | adapter status matrix |
| CF-B03 | adapter unavailable before submission acceptance | current operation | Unavailable/Blocked according to port contract；new decision/fact required for retry | slot/safe reason | pre-submit unavailable |
| CF-B04 | external call may have happened / timeout after submission | effect/model/handoff/checkpoint | Unknown + fence/status-only reconcile/manual；no ordinary retry | same attempt/submission/fence refs | unknown-after-submit |
| CF-B05 | source/governance/definition/capability view stale/pending/unknown | admission/progress/context/action | Waiting/Blocked or explicit degraded read only；never guess owner truth | owner class/version/freshness | stale/pending views |
| CF-B06 | durable-memory owner unavailable | context/retrieval | working-memory/local safe path only if requirements allow；otherwise Blocked | memory slot/source refs | optional vs mandatory retrieval |
| CF-B07 | model materializer/redaction unavailable | model turn/material exposure | Blocked/Degraded without raw prompt；no model submit | materializer/redaction category | no-body/no-submit |
| CF-B08 | model semantic adapter schema/result incompatible | turn/decision | reject/quarantine/Blocked；same submission reconcile if Unknown | turn/submission/schema ref | schema/result mismatch |
| CF-B09 | action governance/capability/tools/isolation/source guard missing/unknown | action | deny/wait/block and fence；no invocation call | guard kinds/source refs | five-guard fail-closed |
| CF-B10 | child runtime unavailable/unknown | delegation | parent records Blocked/Unknown；no member/container lifecycle action | delegation/child attempt refs | child seam negative |
| CF-B11 | checkpoint commit absent/rejected/unknown | recovery/resume | Prepared/Rejected/CommitUnknown distinct；no Resume until matching committed proof + closed fence | checkpoint/fence/receipt refs | checkpoint matrix |
| CF-B12 | handoff submit/ack status absent/unknown | handoff/gap | local candidate/gap remains open；no delivered/accepted/observed claim | attempt/gap/ack refs | handoff unknown/gap |
| CF-B13 | event publisher unavailable/rejected/unknown | outbox | preserve exact outbox snapshot；pending/unknown；same ID/payload only | event/outbox/receipt refs | exact republish/no observed |
| CF-B14 | projection stale/gap/store unavailable | query/rebuild | explicit Stale/Degraded/Unknown；rebuild from committed history only；no domain writeback | projection/cursor/gap refs | stale/gap/rebuild |
| CF-B15 | lease lost/cursor conflict/page commit unknown | job page | stop page；do not advance/reuse stale epoch；preserve cursor/fence | job/partition/lease/cursor | lease/fencing faults |
| CF-B16 | local commit result Unknown | mutation/consumer/job | preserve reservation/inbox/page/effect fence；reconcile/manual；no second effect/ACK | operation/fence/ref | commit-unknown |
| CF-B17 | required local audit/history append fails | transaction | local UoW fails/Unknown according to flow；do not claim committed | operation/history disposition | atomic audit failure |
| CF-B18 | optional diagnostic/observation delivery fails | observation only | domain truth stays；candidate pending/gap；no observed/evidence claim | observation candidate/gap | optional sink failure |

## 5. 十二域 failure/degradation matrix

| CFG / root | Invalid config | Valid config + runtime dependency failure | Safe residual behavior | Never fallback to |
|---|---|---|---|---|
| CFG-01 profile | fail-fast; no entry facade | entry owner/deployment mismatch -> entry blocked/Unknown externally | none unless owner confirms old process | alternate profile/auto-detected mode |
| CFG-02 scope | fail-fast; no authority exposure | actor/source scope mismatch -> NotVisible/Blocked | properly scoped read only | wildcard/parent/child scope expansion |
| CFG-03 context | fail-fast on bounds/policy | optional source stale may yield explicitly degraded context; mandatory unknown blocks | existing committed context query with freshness label | silent truncation/mandatory omission |
| CFG-04 working_memory | fail-fast on max/trigger | compaction conflict/unknown keeps old committed window authoritative | read prior window/status | durable memory body/delete fallback |
| CFG-05 model_decision | fail-fast on selection/schema | materializer/model Pending/Unavailable/Unknown -> blocked/unavailable/fenced | local plan/context status | provider route/model substitution/raw result |
| CFG-06 action_guard | fail-fast on effect/freshness | any required guard missing/stale/unknown -> deny/wait/block/fence | action decision status only | local approval/direct Tools/Sandbox call |
| CFG-07 delegation | fail-fast on enabled tuple | child seam unavailable/unknown -> parent blocked/unknown | parent may continue only through a new allowed local decision | member/container creation/cancel truth |
| CFG-08 checkpoint_recovery | fail-fast on mode relation | commit/reconcile unknown -> manual/reconcile only | Prepared/Unknown status query | current state as checkpoint/automatic resume |
| CFG-09 handoff_projection | fail-fast on page/ref | redaction/submission/projection failure -> no emission, gap, stale/degraded view | local outcome/body-free material status | delivery/observed/acceptance inference |
| CFG-10 idempotency | fail-fast on retention/schema | reservation/result corrupt/commit unknown -> Unknown/manual; read paths independent if safe | exact stored replay when present | re-execute with same/different digest |
| CFG-11 adapter_slots | reject tuple or builder Invalid/Blocked | finite adapter posture maps to affected path only | unrelated local path if profile explicitly permits | fake/direct owner/readiness inference |
| CFG-12 jobs | reject tuple or job not exposed | blocked dependency/lease/cursor/unknown stops before/within page | previous committed cursor/report | scheduler retry, cursor skip, new effect key |

## 6. Slot runtime failure matrix

| Slot | Pending/Blocked/Unavailable | Unknown after possible effect | Allowed degraded/local surface |
|---|---|---|---|
| governance | admission/action Waiting/Blocked | not normally effecting; owner view Unknown blocks | local status only |
| definition_resolver | progress Waiting/Blocked | source/version uncertainty remains Unknown | existing refs/status; no body |
| source_resolver | source pending/stale/unknown | refresh result Unknown keeps marker negative | optional explicitly degraded context/view |
| durable_memory | retrieval Blocked/Unavailable | candidate/source uncertainty blocks incorporation | Runtime working memory only if requirements allow |
| capability_exposure | guard Waiting/Blocked | exposure view Unknown blocks | action candidate/status only |
| invocation_caller | no submit when pending/unavailable | same attempt status reconcile; effect fenced | no positive degraded action |
| model_context_materializer | model turn Blocked/Degraded | materialization Unknown means no submit | safe refs/status only |
| model_decision | turn Blocked/Unavailable | same submission/result reconcile | no provider/raw fallback |
| child_runtime | delegation Blocked/Unavailable | same child attempt/result reconcile | parent local path via new decision only |
| checkpoint_commit | Prepared/Blocked/Rejected | same checkpoint commit/status reconcile | manual/reconcile; never Resume |
| handoff_submission | local candidate/gap | same attempt ack/status reconcile | local outcome/material status |
| event_publisher | outbox pending/rejected | same stored event publish/status posture | local fact/outbox remains |
| projection_store | stale/degraded/unavailable query | cursor/store Unknown preserves gap | committed truth query where available; no projection authority |

## 7. Job failure matrix

| Job | Before claim failure | During page failure | Unknown rule | Recovery boundary |
|---|---|---|---|---|
| rebuild safe views | Disabled/Blocked/no projection seam -> no claim | history gap/CAS/lease loss -> stop, no invalid cursor | store/commit unknown preserves gap/cursor | later rebuild from contiguous committed history |
| refresh source snapshots | source seam Blocked -> no claim | per-source pending/stale/unavailable explicit | refresh unknown cannot mark Available | later same source/version refresh/status |
| compact working memory | invalid control/local dependency -> no claim | version/commit conflict keeps old window | commit unknown blocks new window authority | local reconcile; no durable delete |
| resume eligible runs | CP blocker/open fence -> no claim/resume | candidate becomes manual/blocked on re-read | any checkpoint/effect Unknown forbids resume | status-only/manual; attempts=1 |
| reconcile unknown effects | missing status seam -> Blocked | absence/unknown keeps marker fenced | never submit effect | later status-only same identity |
| reconcile handoff gaps | missing ack/status seam -> Blocked | pending/mismatch/unknown keeps gap | no resend/self-close | same attempt ack/status |
| publish runtime outbox | publisher Blocked -> no claim | rejected/unknown does not advance as success | same event ID/payload; no rebuild | bounded same-payload publish per policy |

## 8. Secret/config-center unavailable 与漂移

### 8.1 Secret/KMS/Vault

Runtime schema has zero secret leaf and does not call a secret backend. Therefore “Runtime secret/KMS/Vault unavailable” is not a config-loader mode：

- raw secret/backend key in document -> CF-A06 fail-fast；
- external owning adapter cannot resolve its credential -> adapter reports Unconfigured/Unavailable/Unknown under CF-B02~B04；
- Runtime never loads secret from alternate env/file、logs it、or changes route；
- a revoked typed ref remains an identity but no longer authorizes positive use；affected path fails closed。

### 8.2 Config center

P0 has no config center source. A config-center selector/push/admin override is unsupported and rejected (CF-A17)。Config-center network unavailability therefore cannot trigger LKG/default behavior because Runtime never attempts that network call。

### 8.3 Drift/expiry categories

| Drift/expiry | Detection authority | Runtime handling | Not claimed |
|---|---|---|---|
| selected document differs from reviewed fingerprint before startup | release/config validation comparison | block candidate/review again | no polling implementation |
| source locator target changes while process runs | none in P0; snapshot immutable | current process unchanged; next startup revalidates | no live drift detector |
| contract/schema/blocker ref owner reports changed/revoked | formal owner event/view/status seam | affected new operation Blocked/Unavailable/Unknown | no owner truth invention |
| source/view freshness exceeds configured max age | Runtime clock + formal timestamp/version | stale/degraded/blocked per domain | no refreshed fact invention |
| external credential expires | owning adapter/security | adapter negative posture; Runtime fail closed | no credential/backend observation |
| config snapshot by-ref unavailable after process replacement | snapshot store/Port | `SnapshotNotFound`; manual/fail closed | no current substitution |

## 9. Signal 与告警边界

| Failure class | Body-free local signal fields | 是否要求运维关注 | External truth boundary |
|---|---|---|---|
| startup source/schema/security | stage、ConfigError variant、safe path、profile candidate、source fingerprint | yes for selected deployment attempt | signal candidate != alert delivered |
| builder Invalid/Blocked | entry profile、dependency/slot、blocker safe refs、disposition | yes when intended entry unavailable | Bound/Blocked != readiness |
| adapter runtime failure | operation、slot、finite posture、attempt/fence refs、safe reason | yes by operations policy | no endpoint/secret/provider body |
| stale/degraded read | query/view kind、freshness class、source/version refs | policy-dependent | degraded != current/accepted |
| Unknown effect/commit/replacement | operation/attempt/fence/config ref、Unknown | always manual/reconcile candidate | no success/failure inference |
| lease/job failure | job、partition class、lease/cursor refs、disposition counts | yes for blocked/unknown/backlog policy | report != evidence/readiness |
| observation delivery gap | candidate/event/gap refs、pending/unknown | operations-owned | no observed/audit truth |

This document defines when a safe signal candidate is required, not an alert backend、route、dashboard、retention、on-call action、report file or evidence qualification。

## 10. Recovery decision table

| Condition | Allowed recovery | Required new fact | Forbidden recovery |
|---|---|---|---|
| invalid startup document | correct/review full document and restart | new validated candidate | patch leaf/default fallback |
| cold replacement candidate failed before replacement | keep owner-known old process; prepare corrected candidate | deployment owner fact + valid candidate | infer old process from absence |
| prior reviewed config requested for rollback | full revalidation/build + cold replacement | current compatible refs/reviews | online pointer switch/bypass |
| owner fact pending/stale | `WaitForFact` or explicit degraded read | newer formal source/version | promote stale/current |
| policy/contract/authority missing | `BlockFailClosed` | formal owner closure/new config | local invention/fake |
| external call possibly occurred | `ReconcileStatusOnly`/`ManualReview` | matching status/feedback/receipt | ordinary retry/new key |
| local conflict before effect | bounded `RetryLocalBeforeEffect` | current versions/lease | retry after possible effect |
| projection stale/gap | `RebuildProjection` | contiguous committed history/cursor | projection writes domain truth |
| exact stored result exists | `ReturnReplay` | matching identity + digest | rebuild from current snapshot |

## 11. Per-failure stop review

| Group | Missing/error | Runtime dependency | Safe residual | Test cut | Result |
|---|---|---|---|---|---|
| source/syntax/shape/security | CF-A01~A06 | n/a | none | exact negative corpus | pass |
| type/ref/range/domain | CF-A07~A10 | n/a | none | 153-leaf/property/cross matrix | pass |
| slots/jobs/fake/local build | CF-A11~A15 | B01~B18 | path-specific only | tuple/builder/fault injection | pass |
| snapshot capture/replacement | CF-A16~A18 | commit/effect Unknown | manual/by-ref only | restart/by-ref/unknown | pass |
| policy domains | CFG-01~12 | exact domain matrix | explicit only | domain combination matrix | pass |
| external slots | 13 exact slots | finite posture matrix | no owner creep | adapter contract/fake | pass |
| jobs | 7 exact jobs | lease/cursor/effect matrix | previous committed state | job runner faults | pass |
| secret/config-center/drift | unsupported/owner-separated | adapter/source freshness | no raw fallback | forbidden/drift corpus | pass |

## 12. 跨失效策略审计

| Audit | Result | Notes |
|---|---|---|
| config invalid vs runtime dependency failure distinct | pass | no degraded startup |
| all P0 required/malformed/type/range/cross failures | pass | CF-A01~A18 |
| secret/KMS/Vault question closed | pass | zero Runtime secret fields; adapter owner handles credential failure |
| config center question closed | pass | unsupported source; no network/LKG behavior |
| drift/expiry explicit | pass | startup fingerprint/owner fact/freshness/by-ref categories |
| 12 domains covered | pass | exact CFG-01~12 matrix |
| 13 slots / 7 jobs covered | pass | finite negative/unknown/recovery behavior |
| no silent fallback | pass | no defaults, coercion, fake, current substitution, effect retry |
| Unknown preserved | pass | status-only/manual/fence |
| body-free signaling | pass | no raw config/ref/path/secret/body |
| observation/evidence boundary | pass | local signal candidate only |
| current blocker preservation | pass | open seam remains Blocked/negative; no readiness |

## 13. 当前问题诊断、改动前后与取舍

| Dimension | Historical Step 11 | Rebuilt Step 11 |
|---|---|---|
| lifecycle posture | reload reject-new + online LKG | P0 cold candidate failure/old process isolation only |
| errors | invented ConfigSource/Parse/Secret families | exact existing `ConfigError`/`BuildError` + runtime error postures |
| failure count | 18 mixed cases | 18 candidate failures + 18 valid-config runtime failures |
| domain coverage | stale fields/aliases | exact CFG-01~12, 13 slots, 7 jobs |
| secret/config center | generic backend outage | Runtime zero-secret/no-config-center; owning adapter negative posture |
| degradation | broad residual behavior | only `03`-defined explicit safe subsets; mutation/authority never degraded |

## 14. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| candidate failure uses existing ConfigError/BuildError | 否 | deterministic mapping only | 03 §11.1 | 无回写 |
| runtime dependency failure uses finite existing postures/recovery | 否 | configuration-to-runtime mapping | 03 §11.2~11.3 | 无回写 |
| slot/job failure behavior | 否 | existing adapter/job flow/state/fence rules | 03 §6.8/§8~§13 | 无回写 |
| zero-secret/no-config-center failure interpretation | 否 | ownership and unsupported-source clarification | 03 §1/§13 compatible | 无回写 |
| cold replacement failure/rollback | 否 | external deployment lifecycle; no Runtime state | 04 Step 10 only | 无回写 |
| future online LKG/reload/drift poller | 是（future trigger only） | would require loader/store/Port/state/error/concurrency design | reopen 03 before admission | 无当前回写；P0 禁止 |

## 15. 回填草稿与下一门禁

正式 §11 写入：two-layer model -> posture vocabulary -> CF-A01~A18 -> CF-B01~B18 -> 12-domain matrix -> 13-slot/7-job matrices -> secret/config-center/drift -> signal boundary -> recovery table。不得出现 degraded startup、online LKG/reload、invented error type、raw diagnostic、fake/readiness/evidence claim。

```text
step_11 = done
gate_status = pass
gate_reason = candidate_and_runtime_failure_matrices_closed_without_silent_fallback
next_allowed_action = delete_and_rebuild_step_12_downstream_handoff
formal_04_write_allowed = false
step_12_write_allowed = true_after_flow_and_ledger_advance
commit_required = false
```
