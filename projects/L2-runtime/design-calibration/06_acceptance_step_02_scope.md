# L2-runtime 06 验收标准 Step 2：验收目标与范围

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 2
> 回填位置：正式 `06-验收标准.md` §2
> 状态：`completed_continuous_authorized`
> 输入：Step 1、formal 00 scope/AC/VF、formal 05 G0~G3 and P0/P1/P2
> 事实边界：只定义 scope and future decision effect；没有 actual candidate 或 verdict

## 1. 验收目标

1. 对一个不可变送验 tuple 裁决 Runtime local semantics、owner/data boundary、protocol/state/UoW/config/evidence truth 是否满足 formal `AC-L2R-001~036`。
2. 对 `VF-L2R-001~008` 逐项形成 `not_triggered/triggered/not_evaluable`，并确保 triggered 或适用项 not_evaluable 不能被风险接受掩盖。
3. 将 G1 local closure、G2 named integration candidate、G3 per-slot real qualification 和 product/release readiness 分层，不以 fake/local result 推导真实 owner 能力。
4. 固定 evidence eligibility、defect closure、risk acceptance、condition expiry、verdict/signoff 的机器与角色边界，使未来授权 reviewer 可以复查同一 decision package。

## 2. Scope axes

| Axis | In-scope decision | Current priority | Required future evidence | Conclusion ceiling |
|---|---|---:|---|---|
| `G0 design handoff` | formal 00~06 contract completeness and source consistency | P0 design | current documents/calibration audit | design-complete only; no runtime verdict |
| `G1 local deterministic` | 37 CUT, 172 raw + 5 aggregates, fail-closed owner seams, strict config, no boundary leak | P0 candidate | one valid fixed local run, 177 derived items, all 9 checks, reviewed handoff | local contract verdict only |
| `G2 integration candidate` | one named real adapter/profile seam's contract parity | P1/P2 conditional by candidate scope | independent non-TestFake manifest/run/artifacts/reports | named candidate compatibility only |
| `G3 positive qualification` | one of 13 slots against actual owner/version/profile/environment | P1/P2 blocked unless explicitly in delivery scope | dedicated QUAL identity + independent real evidence | that slot's qualification only |
| product/release readiness | all mandatory local + included positive dependencies + operational/release authority | future release decision | complete G1 plus every mandatory G2/G3 and release package | cannot pass while required qualifications/blockers open |
| peripheral `FR-L2R-E01~E04` | read-only experiment, replay preview, trend, reflection candidate handoff | P2 future | separately rebaselined cases/evidence | excluded from current P0; no readiness inference |

## 3. Acceptance scope registry

| Scope ID | Acceptance subject | Type / priority | Decision target | Explicit non-scope / limitation |
|---|---|---|---|---|
| `SCP-L2R-01` | C1 admission/run/goal/plan/loop | local P0 | AC001/006~008, bounded progress and terminal truth | Work/Process/ImplementationPlan ownership |
| `SCP-L2R-02` | C2 context/source/working-memory/durable mediation | local P0 + positive blocked | AC002/009/010/021/027/028 | source/durable body/index/retention/delete truth |
| `SCP-L2R-03` | C3 model intent/binding/turn/summary | local P0 + positive blocked | AC003/011~013, provider-neutral finite postures | provider registry/route/secret/quota/cost/quality/readiness |
| `SCP-L2R-04` | C4 action choice/guards/invocation/delegation/feedback | local P0 + positive blocked | AC004/014~016/023/025 | Tools execution, Governance approval, Sandbox isolation, member lifecycle truth |
| `SCP-L2R-05` | C5 checkpoint/recovery/reflection/outcome/handoff | local P0 + positive blocked | AC005/017~020/024/030/036 | physical durability, external delivery/Observed/downstream acceptance |
| `SCP-L2R-06` | owner/data/dependency boundary | local P0 redline | AC021~030, only Runtime-owned truth, six dependency types | external body/source/backend/container/image/listing ownership |
| `SCP-L2R-07` | protocols and entry surfaces | local P0 | exact 17 C, 12 Q, 6 E in, 6 O out, 7 J, Api/Worker/Jobs/TestFake boundaries | transport deployment/product endpoint readiness |
| `SCP-L2R-08` | state/UoW/replay/concurrency/error | local P0 | exact SM01~31, UoW1/2, inbox/outbox, lease/cursor/CAS/fence | selected DB/broker/scheduler product readiness |
| `SCP-L2R-09` | strict config and builder | local P0 | 12/153/39, 13x5, 7x6, V0~V12, immutable capture/cold semantics | hot reload/default/admin override/deployment controller |
| `SCP-L2R-10` | NFR/security/observation | P0 behavior + P1 characterization | AC031~036, 19 NFR structural/redline outcomes | unsourced numeric SLA/QPS/P99/capacity; Obs backend readiness |
| `SCP-L2R-11` | evidence/defect/risk/verdict package | P0 acceptance governance | M3~M5 eligibility, zero S/A, VF closure, authorized risk/signoff | runtime business truth or automated acceptance |
| `SCP-L2R-12` | G2/G3 real seams | conditional P1/P2 | named per-seam parity/qualification only when formally included | whole-product inference; reuse local SLOT EV |

## 4. AC/VF scope posture

| Requirement set | Local G1 obligation | Positive obligation | Overall effect |
|---|---|---|---|
| `AC-L2R-001~020` | all local semantics and fail-closed branches are P0; no AC removed because positive seam blocked | real execution/materialization/durability/delivery claims require relevant G2/G3 | any applicable local AC failed prevents `通过`; positive part stays not_evaluable unless included evidence exists |
| `AC-L2R-021~030` | all owner/data/phase/no-write/no-body boundaries are P0 hard | owner implementation is not required to prove local no-ownership, but required for positive capability claims | boundary violation may trigger VF and forces `不通过` |
| `AC-L2R-031~036` | structural bounds, posture, redaction, traceability, idempotency and safe carrier are P0 | numeric performance/real backend qualification is separate | no unsourced numeric gate; missing mandatory structural evidence blocks local verdict |
| `VF-L2R-001~008` | every applicable VF must be evaluable and `not_triggered` for pass/conditional pass | included real lanes must also evaluate applicable VF | `triggered` always `不通过`; `not_evaluable` cannot be accepted when VF is in candidate scope |

## 5. Priority and conclusion boundaries

| Priority | Required disposition | Can support `通过` | Can support `有条件通过` | Can be excluded/deferred |
|---|---|---|---|---|
| P0 local | exact eligible evidence and pass | yes, only all applicable pass | no failed/missing P0; accepted eligible residual may coexist only outside P0 truth | no |
| P0 VETO | `not_triggered` with eligible evidence | yes | yes only if all applicable not_triggered | no; not_evaluable blocks decision |
| P1 characterization | valid recorded structural characterization; no invented threshold | yes for local contract if no threshold authority | may carry named B residual under strict risk record | only if formally outside candidate scope |
| P1/P2 real seam | per-seam `qualified/failed/not_evaluable` | only when all delivery-mandatory seams qualified | optional seam may remain blocked only with formal exclusion and authorized residual; never called qualified | yes if not mandatory and scope explicitly excludes it |
| P2 peripheral | trace retained, no current P0 evidence denominator | yes | yes | yes; no implicit product capability claim |

## 6. Non-scope and forbidden conclusion table

| Non-scope | Why | Required disclosure | Forbidden conclusion |
|---|---|---|---|
| provider routing/secret/quota/cost/billing | external owner, not Runtime | model positive qualification status | provider ready or economically qualified |
| Tools execution/Sandbox isolation/cleanup | owner seams open | local finite/fail-closed vs G3 separate | local fake proves executed/isolated/cleaned |
| durable memory body/index/lifecycle | owner pending | working/candidate/ref/gap only | durable write/delete ready |
| Obs backend/delivery/audit truth | event/runtime owner seam open | local candidate/attempt/gap and blocked positive status | carrier/receipt means Observed/audited |
| member-service/container/image/product/marketplace | out of Runtime bounded context | entry ref/scope boundary only | Runtime product/deployment readiness |
| implementation scheduling/commit plan | belongs to 07/implementation | blocker and required future action only | design acceptance means implementation complete |
| numeric performance/capacity | no authority/workload baseline | characterization-only risk | SLA/capacity pass/fail |

## 7. SOP questions, decisions and historical correction

| Question | Decision |
|---|---|
| 核心裁决目标 | one immutable candidate against 36 AC, 8 VF, evidence/defect/risk/signoff contracts |
| P0/P1/P2 | G1 local + boundaries/VF/evidence are P0; characterization P1; real seam conditional P1/P2; peripherals P2 |
| downstream only seam | Bus/Obs/SDK/Artifact/member/product are seam/ref only; owner implementation outside local scope |
| non-scope effect | cannot create positive claim; mandatory release seam missing caps readiness or makes scope not_evaluable |
| one-vote veto surfaces | all VF, owner/data/phase/secret/dependency/evidence truth violations |
| formal names | use current CAP/C/Q/E/O/J/SM/slot/config/TC/EV only |

Old 06 collapsed local contract acceptance into release readiness and used stale 18-state/109-EV denominators. Current scope explicitly separates them and retains all 31 states/177 local cases without claiming positive owner qualification.

## 8. 回填草稿与 stop-review

Formal §2 should present the four decision layers, 12 scope subjects, AC/VF posture and explicit non-scope. It must state that current process is `not_entered`; this chapter defines conclusion ceilings but records no conclusion.

| Audit | Result |
|---|---|
| all 36 AC retained | yes; no blocked seam shrinks local obligation |
| all 8 VF retained | yes; not_evaluable is not not_triggered |
| G1/G2/G3/readiness split | explicit |
| P0/P1/P2 | decision/evidence implications explicit |
| peripheral scope | four FR-E items future/excluded without loss of trace |
| actual verdict | none |

```text
step_status = completed_continuous_authorized
scope_registry = 12
current_process_state = not_entered
actual_verdict = none
next_step = Step 3
formal_06_write_allowed = false_until_step_15
```
