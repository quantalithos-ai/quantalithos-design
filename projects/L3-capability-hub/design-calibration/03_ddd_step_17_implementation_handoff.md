# L3-capability-hub 03 详细设计 Step 17：实施计划承接清单

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 17
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md` §5.10
> 回填章节：`projects/L3-capability-hub/03-详细设计.md` §16
> 创建日期：2026-07-25
> 当前模式：full-restart / continuous execution
> 状态：`03_step_17_completed_continuous_execution`

---

## 1. 开工边界与读取闭包

| Input | Status | Step 17 use |
|---|---|---|
| formal `00/01/02` | active baseline | requirement, architecture, ownership and HLD boundary |
| DDD Step 1~3 | completed | upstream, scope, language/repository/security constraints |
| DDD Step 4~7 | completed | seven-member layout, module/object/Port/repository implementation contracts |
| DDD Step 8~10 | completed | 250 public types, 83 protocols/flows, 24 state-like families and exact matrices |
| DDD Step 11~13 | completed | persistence authority, transaction/error/recovery/idempotency/concurrency |
| DDD Step 14~16 | completed | configuration/external binding, 155+3 observation contract and minimum test cuts |
| implementation-plan writing standard/SOP | read for boundary | Step 17 hands off sources; it does not define phases, tasks or commit boundaries |
| code implementation ledger standard | read | ledger and all planned boundary skeletons are mandatory only when formal 07 completes |
| `standards/coding/rust.md` | read through Step 3 and rechecked | English identifiers/comments/rustdoc/tests; public declaration documentation gate |
| project/subproject organization standards | rechecked | target repository and workspace/package/crate/binary naming |
| `projects/README.md` commit rules | rechecked | implementation-repo English commits and project-level git identity precheck |

No old formal `03/05/06`, README shorthand or L1 reference domain semantic is accepted as an implementation source. References to `ProviderContract`, `CapabilityDecision`, `CostRecord`, provider route/secret, runtime/tools execution, governance approval, method body, marketplace listing or old outbox delivery lifecycle remain historical-material diagnostics only.

## 2. Step goal and non-goals

This Step determines whether detailed-design contracts are sufficiently closed for later implementation planning, identifies exactly which source an implementation planner and implementation agent must read, and pre-audits field/DTO/state/name/phase consistency.

This Step deliberately does not:

- create implementation phases, code batches, task estimates or commit boundaries;
- create `implementation_execution_ledger.md` or any `implementation-boundaries/*.md` file;
- select an observability backend, persistence product, API framework, transport, endpoint or secret platform;
- claim the target implementation repository exists or has a particular Cargo/git configuration;
- claim implementation, tests, run ids, evidence, acceptance or commits.

## 3. SOP twelve-question decision table

| Question | Decision |
|---|---|
| Which contracts are ready for 07? | Step 4~16 sources close layout, modules, objects, fields, Ports, protocols, flows, states, persistence, errors, concurrency, bindings, observability and test cuts. Formal 03 assembly and downstream 04/05/06 remain required before final implementation handoff. |
| What must the implementer read? | §7 defines common mandatory reading and §8 defines source-family reading. Formal docs are the entry baseline; calibration sections are mandatory where formal summaries point to exact schemas/matrices. |
| Are commit/git/Rust/comment standards included? | Yes. The target repo must be checked for actual project-level git identity; no current target-repo fact is claimed. Rust source, tests, comments and rustdoc are English. |
| Can every required domain field be sourced? | Pre-audit pass: caller DTO/metadata, typed resolver/read, loaded object, policy, deterministic ID/clock, canonical codec/digest and existing carrier cover every required source. Missing source is a design stop, not an implementation default. |
| Can every Command/Event/Job construct its target? | Pre-audit pass for 26/6/10/8. Step 8 schemas and Step 9 per-flow construction/effect tables are exact sources; duplicate and failure branches have typed outcomes. |
| Are Query response/page/marker/cursor contracts closed? | Pre-audit pass for 33/33. Resolver-first visibility, contracts-owned response types, stable repository key/order/cursor and explicit freshness/degraded surfaces are fixed; all writes remain zero. |
| Are state names consistent? | Pass across Step 6/10/16: 24 state-like enums, 111 active variants and 638 classified pairs use exact Rust names. Formal 05/06/07 must not use lowercase/HLD aliases. |
| Does a phase consume future-only facts? | No current mismatch: entry/invocation, local UoW/post-commit, Outbound A/B/C and Job plan/target/final are separated. Evidence and acceptance facts are never phase inputs. |
| Are old names or aliases still active? | No active implementation name is sourced from old formal 03/05/06. Formal Step 19 must preserve exact names and counts from Steps 6~16. |
| What cannot enter implementation yet? | Concrete config keys/defaults and backend bindings await formal 04; complete tests/evidence await 05; release gates await 06; phases/boundaries await 07; target repo existence/git/Cargo must be checked at implementation start. |
| How should 07 use this Step? | Build phase/commit-boundary reading and gates by reference. Do not copy field/DTO/state tables into 07 as a second authority. |
| Is there enough input for 07 boundary closure audits? | Yes: §6/§8/§9 expose exact object, protocol, flow, state, persistence, test and downstream-owner sources. Formal 07 still must audit each planned boundary against formal 03/05/06/07. |

## 4. Implementation handoff architecture

```text
formal 00 / 01 / 02
          |
          v
DDD Step 4..16 exact sources
          |
          v
Step 19 -> formal 03
          |
          +---------> formal 04 (configuration bindings)
          +---------> formal 05 (test cases and evidence contracts)
          +---------> formal 06 (acceptance gates and vetoes)
          |
          v
formal 07 (phases and commit boundaries)
          |
          v
implementation ledger + all planned boundary skeletons
          |
          v
/home/aris/Projects/quantalithos-capability-hub
(must be confirmed or created; currently not found)
```

The arrow into the implementation repository is blocked until formal 07 and its ledgers exist. The missing target directory is an implementation prerequisite, not an unresolved upstream design blocker.

## 5. Canonical implementation source matrix

| Source | Contract handed to implementation planning | Consumer | Must not infer |
|---|---|---|---|
| Step 1 | active upstream truth and historical-material exclusion | 07 scope/read gate | old formal 03 remains temporarily authoritative |
| Step 2 | P0 implementation scope and explicit non-scope | 07 scope/deliverables | runtime/tools/marketplace/governance/method body may be added for convenience |
| Step 3 | Rust, repo, dependency, documentation, commit and security constraints | 07 prerequisites/discipline | target repo Cargo/git facts already verified |
| Step 4 | seven-member workspace and file ownership | 07 deliverables/write order | a business capability must become a new crate |
| Step 5 | module capability and dependency direction | 07 phase graph | entry or infra may own application truth |
| Step 6 | 43 HLD objects + 7 helpers, fields/factories/members/invariants/Rustdoc | code boundaries | implementation may add observer-only field/accessor or generic body |
| Step 7 | 36 Ports; 22 repository traits / 110 methods; UoW and fake parity | code and contract-test boundaries | private finder, hidden Port, second authority or `?Send` |
| Step 8 | 250 public types; 26 C/33 Q/6 I/10 O/8 J protocols | contract/API/worker/job boundaries | generic execute/query/event/job DTO or domain-only public type |
| Step 9 | 83 exact per-interface flows and phase/effect order | vertical slices and service tests | shared helper replaces a flow or reconstructs hidden source |
| Step 10 | 24/111 states and 638 current/reserved/illegal pairs | domain/persistence/test boundaries | shorthand states or external status as local state |
| Step 11 | one persistence authority, exact store/method/index/UoW/crash semantics | infra/persistence boundaries | row absence proves commit or eventual repair fills sidecar |
| Step 12 | 17 `ApplicationError`, 51 issue codes, precedence and recovery | error/entry/test gates | text parsing or generic error fallback |
| Step 13 | closed operation/key/digest, atomic reserve, stored replay, reentry and concurrency | application/infra/test gates | TTL, blind retry, current-truth replay or recursive Job entry |
| Step 14 | 27 local + 9 external bindings, 14 external callables, 6 sources, 10 routes, 8 dispatches, Stage 0~7 | configuration/runtime/dependency boundaries | concrete products/keys/defaults selected without formal 04/reopen |
| Step 15 | 60 logs, 48 metrics, 27 spans, 3 events, 20 durable profiles and redaction | private instrumentation boundaries | observer Port/ledger/business state or backend selected freely |
| Step 16 | 83 flow, 24 state, persistence/binding/observation cuts and planned script contracts | 05/06/07 test gates | cuts are already implemented or passed |

## 6. Implementation-unit handoff table

### 6.1 Workspace and module units

| Unit | Canonical files | Exact handoff | Required gate before code |
|---|---|---|---|
| workspace | `Cargo.toml` | 7 members, Rust 2024 / rust-version preference, allowed dependency edges, one sibling path | target repo exists; actual baseline and sibling path checked |
| contracts | `crates/contracts/src/{refs,metadata,commands,queries,events,jobs,views,errors}.rs` | public DTO/ref/metadata/codec/canonical bytes | Step 6/8 exact declarations and English `///` available |
| domain | `crates/domain/src/{identity,registry,descriptor,governance_method,exposure,trace_impact,derived_material,reference_resolution,event_candidate,policies,errors}.rs` | objects, policies, states and immutable facts | state/invariant/field source closure rechecked |
| application | `crates/application/src/{services,*_service,ports,unit_of_work,idempotency,errors}.rs` | 83 flows, Ports, UoW, digest, replay and phase ownership | no missing callable/private finder; one authority rule accepted |
| infra | `crates/infra/src/{config,runtime_builder,repositories,projection_stores,reference_stores,read_visibility,source_resolvers,publishers,handoff_adapters,fakes}.rs` | adapters/stores/builder/fakes and body-free projection | formal 04 and concrete product/backend reopen completed where needed |
| api | `crates/api/src/{command_handlers,query_handlers,routes}.rs` | 59 synchronous protocol entries and non-cancelling ownership | concrete API framework binding controlled if introduced |
| worker | `crates/worker/src/{consumers,event_publisher,projection_worker}.rs` | six source slots, exact-ref continuation, activation/drain | transport binding and six-source configuration available |
| jobs | `crates/jobs/src/*.rs` | eight closed dispatches and plan/target/final UoWs | host trigger/config and runner binding available |
| tests | `tests/{contract,domain,service,integration,support}/*.rs` | Step 16 cut registry and deterministic fakes | formal 05 case/data/environment map available |
| scripts/reports | `scripts/{checks,gates,reports}` + `artifacts/test/<run_id>` + `reports/` | planned command contracts only | formal 05/07 assign concrete scripts and boundaries |

### 6.2 Domain capability implementation cuts

| Capability cut | Objects and state source | Protocol/flow source | Persistence/phase source | Owner redline |
|---|---|---|---|---|
| capability identity/access review | Step 6 identity/review; Step 10 states 01~02 | C01~C04; Q01~Q03 | identity/change/trace/capture/result same UoW | no external identity or governance approval truth |
| capability registry | registry object/state | C05~C08; Q04~Q06; J01 report only | registry/change/trace/material/capture/result | no marketplace listing or reconciliation repair |
| adapter descriptor/safe summary | descriptor/risk/secret-safe objects/states | C09~C12; Q07~Q10 | body-free ref/summaries and exact histories | no provider request/response or secret value |
| governance/method relation | seam and body-free relation states | C13~C17; Q11~Q14; I01~I02 | relation/change/trace/capture; inbound ref only | no approval, policy/shared-rules or method body |
| formal exposure/controlled view | exposure/visibility/view states | C18~C21; Q15~Q19; J02 | formal truth + source-symmetric visibility; view material | no runtime decision, tools execution or SDK client/cache |
| trace/impact | trace, impact and downstream summary states | C22~C23; Q20~Q23; I03 | append/revision and post-commit handoff | no audit/evidence body or acceptance fact |
| derived/read-only material | directory/export/ecosystem/report | Q24~Q28; J03~J06 | target UoW and immutable reports | no core truth repair, ranking/listing owner |
| external reference support | typed refs/canonical resolution | C24~C26; Q29~Q33; I04~I06; J07 | exact kind/source/state and body-free resolver | no external body or downstream truth |
| event continuity | snapshot/capture/stable intent | O01~O10; J08 | Outbound Phase A/B/C and exact-ref continuation | no local delivery lifecycle, queue, DLQ or retry truth |

## 7. Mandatory implementation preread

### 7.1 Common read gate

| Document | Purpose | Gate result required before implementation |
|---|---|---|
| formal `00-需求文档.md` | scope, requirements and non-goals | no planned boundary expands responsibility |
| formal `01-架构设计.md` | context, dependency direction, ownership and consistency | no reverse/dependency-owner merge |
| formal `02-概要设计.md` | components, object/interface/flow/state summary | no new HLD subject |
| formal `03-详细设计.md` after Step 19 | direct coding contract and calibration source index | target boundary finds exact source for every type/flow/state |
| formal `04-配置设计.md` | concrete keys/profiles/validation/activation/failure | every config-reading boundary has exact catalog rows |
| formal `05-测试方案.md` | cases/data/environment/automation/evidence contracts | required tests and commands mapped |
| formal `06-验收标准.md` | gates/veto/release evidence contract | boundary does not violate acceptance redline |
| formal `07-实施计划.md` | phases, commit boundaries, gates and discipline | current boundary is planned/current and all skeletons exist |
| `设计真相源闭环与可落码性标准.md` | design closure and experience review | applicable checks are pass/not_applicable, not deferred to agent choice |
| `代码实施台账与门禁规范.md` | project/boundary ledger state machine | ledger current boundary matches work |
| `子项目目录与代码文件组织规范.md` | repository/member/package/crate/binary naming | actual repository layout matches or design is reopened |
| `standards/coding/rust.md` | Rust naming/comments/rustdoc/error/tests | implementation follows English source/docs and Rust rules |
| `projects/README.md` commit section | implementation repository commit/footer/body rules | actual target repo policy and git config checked |

### 7.2 Target repository and git gate

| Check | Current design-time fact | Required implementation-time action |
|---|---|---|
| implementation repo | `/home/aris/Projects/quantalithos-capability-hub` not found on 2026-07-25 | formal 07 prerequisite must confirm/create exact path before any code boundary |
| repository initialization | unknown | verify `.git`, branch/worktree policy and no unrelated user changes |
| project `user.name` | unknown in target repo | verify/set project-level `quantalithos-labs` per project policy |
| project `user.email` | unknown in target repo | verify/set project-level `quantalithos.ai@gmail.com` per project policy |
| commit language | implementation repo uses English | enforce `type(scope): subject`, body grouping and required footer only when real commit is authorized |
| commit authorization | none for this design task | no commit is created by Step 17 |

The design repository's configured identity is not evidence of the target repository configuration.

### 7.3 Boundary-specific calibration reading rule

Formal 07 must list exact calibration sections for each boundary. A boundary that changes contracts must read Steps 4/6/8; domain state reads Steps 6/9/10/12; repository/UoW reads Steps 7/9/11/13/14; entry/runtime binding reads Steps 4/5/7/8/9/12/14/15; tests read Step 16 plus formal 05/06. “Read all DDD” is not sufficient as the only boundary instruction.

## 8. Cross-document closure pre-audit

| Review item | Design source | Downstream owner | Result | Open issue |
|---|---|---|---|---|
| requirement/scope | formal 00, Steps 1~2 | 07 scope/deliverables | pass | none |
| architecture/data ownership | formal 01, Steps 5/11/14 | 06 redlines; 07 phases | pass | none |
| field source | Steps 6/8/9/11/13 | formal 03; 05 data; 07 boundary gate | pass | none; implementation cannot default missing source |
| DTO construction | Steps 6/8/9 | formal 03; 05 cases | pass for 83/83 | none |
| Query response/page/marker/cursor | Steps 7/8/9/11/12 | formal 03/05/06 | pass for 33/33 | none |
| state names/transitions | Steps 6/10/16 | formal 03/05/06/07 | pass for 24/111 and 638 | none |
| metadata/idempotency | Steps 8/9/11/13 | formal 03/05/06/07 | pass | two L0-core design-sync debts remain non-blocking watchpoints |
| projection rebuild/materialization | Steps 6/9/10/11/13 | formal 03/05/06/07 | pass | no core truth repair |
| event capture/collaboration | Steps 6~15 | formal 03/04/05/06/07 | pass | concrete transport deferred to controlled binding |
| configuration | Steps 14~15 | formal 04/05/06/07 | design handoff pass | concrete catalog/backend intentionally pending formal 04 |
| test cuts/evidence contract | Step 16 | formal 05/06/07 | minimum cuts pass | no actual evidence exists |
| phase boundary | Steps 9/11/13~16 | formal 07 | pre-audit pass | per-boundary audit still mandatory in 07 |
| implementation ledger | implementation-ledger standard | formal 07 completion | intentionally absent | must be created with all skeletons at T068/T069 |

## 9. Field, protocol and state closure gates for 07

### 9.1 Field/source closure

| Source category | Allowed field source | Missing behavior | Forbidden inference |
|---|---|---|---|
| caller input | exact request/payload field after contracts validation | typed invalid request/event/job | parse arbitrary JSON/map or use alias |
| metadata | exact Command/Query/Event/Job metadata accessor | reject before dispatch | generate actor/trace/idempotency inside service |
| lookup/resolver | exact Step 7 callable and typed outcome | missing/not-visible/degraded/unavailable per Step 12 | query another owner or import body |
| system-derived | ID/clock/policy/canonical encoder/digest with named owner | stop/reopen if owner absent | random/default/Display/Debug derivation |
| persisted source | `Loaded<T>`/exact carrier/index with version | typed missing/conflict/consistency | scan/reconstruct from current truth |
| post-Durable projection | exact carrier + UoW `Durable` + symmetry | no projection before proof | log/metric/repository-return as durability proof |

### 9.2 Protocol construction closure

| Family | Exact baseline | Construction gate | Negative owner gate |
|---|---:|---|---|
| Command | 26 | body + metadata + lookup/system-derived fields can construct exact application input/object/effects | no external approval/runtime execution/provider body |
| Query | 33 | request maps to resolver-first reads and contracts response/page/marker | all writes/collaboration/repair calls=0 |
| Inbound | 6 | envelope/header + selected payload map to body-free ref/summary and typed receipt | no relation/core truth owner merge |
| Outbound | 10 | committed source maps to immutable snapshot/capture and typed collaboration request | no payload rebuild/local delivery state |
| Job | 8 | metadata/input -> frozen plan -> target effects -> typed report | no scope rescan/whole-run UoW/core repair |

### 9.3 State/name closure

The only state vocabulary is the exact Step 10 Rust vocabulary. Formal 05/06/07 must reference exact type and variant, not generic `active`, `ready`, `failed`, `delivered`, `approved` or `allowed`. `EventCollaborationStatus` remains external; `ReconciliationReportState` remains immutable formation; idempotency remains `Reserved/Completed`; capture remains `Captured/IntentBound`.

## 10. Phase boundary pre-audit

| Phase boundary | Input available at phase start | Output owned by phase | Future-only value forbidden as input |
|---|---|---|---|
| entry admission | raw bounded metadata/header + validated selected DTO | typed dispatch/rejection and observation terminal | application result before future terminal |
| application preflight | context/input/current typed reads | policy/result plan or typed rejection | transaction/Durable/evidence |
| reserve/winner | normalized key + digest + operation | fresh/replay/conflict/in-progress classification | fresh effect before winner classification |
| local UoW | loaded versions + deterministic plan | staged exact truth/sidecars/result | external collaboration outcome |
| commit resolution | stable tx ref and authority | Durable/NotDurable/Unknown resolution | row absence/elapsed time as proof |
| post-commit handoff | official Durable carrier/capture | request-local typed outcome | rollback or local delivery state |
| Outbound A | committed semantic source | snapshot + Captured in same UoW | external status/intent |
| Outbound B | official capture/snapshot | typed collaboration return | local Delivered/Failed state |
| Outbound C | stable intent and source symmetry | IntentBound revision in short UoW | transport receipt/evidence |
| Job plan | input/scope reads and reserve winner | frozen plan + Planned journal | target/final results |
| Job target | exact first-Planned target | effect + terminal target revision | aggregate final report before all terminal |
| Job final | all exact terminal targets | immutable report + Finalized + Completed | current material rescan |
| test/evidence | implemented code/config/environment | future artifact/report/evidence | design-time placeholders as passed evidence |

## 11. Controlled reopen and blocker ownership

| Trigger | Must reopen | Implementation agent action |
|---|---|---|
| required field has no formal source | Steps 6/8/9 and dependents | stop boundary, record blocker, wait design |
| public type/field/variant/Port/method needed | originating Step 6/7/8 plus flow/state/error/test | do not add convenience surface |
| state/transition differs | Steps 6/9/10/12/16 | do not map to nearest variant |
| repository/index/UoW cannot satisfy design | Steps 7/9/11/13/14 | do not add hidden finder/second authority/eventual repair |
| concrete backend/crate/config required | Steps 14/15 and formal 04 | execute controlled binding decision before code |
| acceptance/test evidence cannot be produced | formal 05/06/07 | fix design/gate; do not fabricate alias/result |
| target repo path or git/Cargo baseline differs | Steps 3/4 and formal 07 | record prerequisite blocker/delta before scaffolding |
| L0-core accessor/wire contract changes | Step 13 plus dependent codec/flows/tests | reopen non-blocking debt as active blocker |

## 12. Items not entering implementation from Step 17

| Item | Classification | Downstream owner |
|---|---|---|
| concrete config keys/defaults/env names/endpoints/TLS/credentials | intentionally deferred | formal 04 |
| persistence/API/event/observer product selection not already fixed | controlled binding | formal 04 + affected detailed-design reopen |
| complete TC catalog/data/environment/automation/report/evidence aliases | intentionally deferred | formal 05 |
| acceptance decision, signoff and release evidence | future execution fact | formal 06 contract; future authorized acceptance |
| phases, code batches, commit boundaries and completion order | intentionally deferred | formal 07 |
| implementation ledger and all boundary skeletons | prohibited until formal 07 completion | created concurrently with completed 07 |
| implementation code/commit/run/test result/evidence | not a design artifact | future implementation/verification agents |
| runtime/tools execution, governance approval, method body, marketplace listing | out of Hub responsibility | respective owner projects |

## 13. Formal §16 canonical assembly source

Formal `03-详细设计.md` §16 must be assembled from the following blocks. Process history and “completed” batch narration do not enter formal text.

| Formal block | Canonical source | Required content |
|---|---|---|
| `16.1 Handoff principle` | §§2~5 | formal docs vs calibration source, no second truth source, no premature implementation authority |
| `16.2 Implementation source matrix` | §5 | Step 1~16 exact responsibility and forbidden inference |
| `16.3 Implementation units` | §6 | workspace/files/capability cuts and owner redlines |
| `16.4 Mandatory reading and repo gate` | §7 | common/boundary reads, target repo/git/commit/Rustdoc prerequisites |
| `16.5 Cross-document closure` | §§8~9 | field/DTO/Query/state/metadata/materialization closure |
| `16.6 Phase and reopen gate` | §§10~11 | exact phase inputs/outputs/future-only prohibition and blocker return |
| `16.7 Deferred items` | §12 | 04/05/06/07 and implementation-artifact ownership |

Formal §16 must state that Step 17 is a pre-audit, while formal 07 owns the final phase/commit-boundary closure audit across formal 03/05/06/07.

## 14. Completion gate and Step 18 handoff

| Gate | Result |
|---|---|
| implementation source families | 16/16 Step sources mapped |
| workspace/file/capability unit ownership | mapped; no new crate/file authority invented |
| mandatory git/commit/Rust/comment reading | included; target repo facts remain unclaimed |
| field/DTO/Command/Event/Job construction closure | pre-audit pass |
| Query response/page/marker/cursor closure | 33/33 pre-audit pass |
| state naming and test handoff | 24/111, 638 and Step 16 exact names aligned |
| phase boundary | pre-audit pass; per-boundary 07 audit mandatory |
| historical material/alias reintroduced | 0 |
| unresolved upstream design blocker | 0 |
| implementation prerequisite | target repo path/git/Cargo check pending formal 07/start gate |
| implementation ledger/boundary skeleton created | no, correctly deferred |
| implementation/test/evidence/signoff/commit claimed | none |
| new Rust declaration/struct/field/comment | `0/0/0/0` |

Step 18 must classify the target-repository prerequisite, two L0-core design-sync debts, concrete backend/config bindings and downstream document work without upgrading them to false blockers or false resolved facts. Step 19 may assemble formal §16 only after Step 18 closes classifications.

```text
document = 03-详细设计.md
step = 17
status = 03_step_17_completed_continuous_execution
next_allowed_action = enter_03_step_18_risks_open_questions
unresolved_upstream_blocker = none
implementation_repo_prerequisite = pending_target_repo_confirmation
implementation_artifacts_created = false
commit_required = no
```
