# L2-runtime 05 测试方案 Step 8：测试环境与配置矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 8
> 回填位置：正式 `05-测试方案.md` §8
> 输入：正式 `01` 依赖裁剪、正式 `03` entry/Port/dependency、正式 `04` profile/config、Step 6/7 cases/data
> 状态：`completed_continuous_authorized`
> 事实边界：所有环境、toolchain、实现仓、runner、script、service 和 topology 均为 planned；没有已部署或可运行环境

## 1. 环境命名与 SOP 回答

正式 04 的环境枚举是唯一名称：`local_contract`、`ci_contract`、`integration_candidate`、`production_candidate`。不得改写为 ready/staging/production-ready，也不得用目录、设计文档、ping、fake 或 `BuildDisposition::Bound` 证明环境资格。

| 问题 | 结论 |
|---|---|
| local 测什么 | pure/domain/contract/service、logical store、blocked-aware、config parser/builder 和 static checks。 |
| CI 测什么 | 全部 deterministic P0、fault/concurrency、entry/worker/job、same-run local E2E、security/source denominator。 |
| integration 测什么 | 仅 owner contract 已冻结且 adapter/profile 可识别的 controlled candidate；开放 seam 保持 blocked。 |
| production candidate 测什么 | 未来真实 qualification/release candidate；当前整体不进入可执行分母。 |
| 环境不可用 | local prerequisites 缺失为 fail-fast/infra_error；external positive prerequisite 缺失为 blocked_dependency/not_runnable；不得 fallback 到 fake 后计 positive pass。 |

## 2. Planned environment matrix

| Environment / lane | 用途 | Allowed entry | Local dependencies | External collaboration | Config/data | 当前风险/状态 |
|---|---|---|---|---|---|---|
| `static_source` | source/dependency/schema/denominator/redaction scans | none | source tree + planned manifest | refs only; zero owner calls | DS-SOURCE-GRAPH/SEC-CANARY | planned after implementation; toolchain-independent subset |
| `local_contract` | unit/contract/service/logical integration | Api/Worker/Jobs separately | fixed clock/ID/digest、logical UoW/repos/inbox/outbox/lease/config | Disabled/Blocked + finite spy when case explicitly requires | strict local documents + case namespace | planned; no external positive claim |
| `ci_contract/TestFake` | deterministic P0/fault/concurrency/entry/local E2E | TestFake test surface plus isolated facade harnesses | complete fault-capable local graph | exact finite fake/replay only; no secret/endpoint | CI/TestFake strict document + full DS registry | planned; fake leak is hard failure |
| `ci_contract/fault` | UoW/crash/replay/CAS/lease/page/ACK faults | owning service/entry/job | ordered failpoints and two-actor harness | finite unknown/status-only scripts | one snapshot per operation/page | planned; nondeterminism/cleanup failure blocks |
| `local_contract/cold_sim` | full-document candidate validation and controller truth separation | process-composition harness only | V0~V12/builder/controller fake | no owner network call | prior/candidate reviewed fixture refs | design simulation only; no deployment claim |
| `integration_candidate` | controlled contract/adapter/entry compatibility | Api/Worker/Jobs; no TestFake fallback | implementation-selected logical/physical products after review | real-like only for individually qualified slots; other slots Blocked | isolated candidate profile/data | currently not runnable for affected positive paths |
| `production_candidate` | future release qualification | Api/Worker/Jobs; no fake | owner-qualified full implementation graph | real owner adapters/events/environment | future owner-approved data/profile | currently blocked; excluded from current execution denominator |

This design does not create or own a database, broker, scheduler, container, member-service, image, secret backend, provider endpoint, observability backend or deployment controller.

## 3. Environment topology：dependency-typed test collaboration

```text
                     [compile candidate]
                 +----------------------+
                 |       L0-core        |
                 +----------+-----------+
                            |
                            v
 +------------------+  +----+--------------------------------+
 | local_contract   |  |       L2-runtime test target         |
 | ci_contract      |->| domain/application/infra/entry       |
 | integration_cand |  | Api | Worker | Jobs | TestFake(CI)  |
 +------------------+  +----+----------+----------+------------+
                           |          |          |
                    [runtime/adapter] |   [runtime/adapter]
                           v          |          v
              Tools/Hub/Governance   |   Model/Memory/Checkpoint
                                      |          |
                               [runtime/ref]     +--> Child/Handoff
                                      v
                                 Method Library

        L0-bus <-------------[event]------------- Runtime outbox/inbox
            |
            +---------------[event]-------------> Observability seam

        L0-sdk <------------[downstream ref]------ public contract fixture
        Sandbox <-----------[runtime via Tools]--- no direct Runtime Port

        finite fakes --------[fake, CI only]------> injected Ports
```

关键说明：

- 只有 `L0-core` 是 compile candidate；未冻结 shared schema 时仍可由 local candidate type/fake 设计测试，但不得声称 package 已绑定。
- runtime/adapter、event、ref、fake 全部分开；这些关系不能写成 Cargo/path/package 依赖。
- Sandbox 只能经 Tools 的正式行动链被间接消费；Runtime 不拥有 direct Sandbox slot/Port。
- 图不表达真实 endpoint、route、secret、backend、deployment 或 positive qualification。

## 4. Dependency type and collaboration matrix

| Dependency/owner | Type | Test representation | Package rule | Positive status |
|---|---|---|---|---|
| `L0-core` | compile candidate | authority-aligned shared contract/source compatibility | only allowed compile candidate; no shadow once formal type freezes | runtime-specific schema part pending `L2R-UP-006` |
| `L0-bus` | event | inbox/outbox logical store + versioned replay/publisher spy | no Cargo dependency for event collaboration | route/delivery blocked |
| `L0-sdk` | downstream ref | public compatibility fixture only | Runtime cannot depend on SDK | not readiness input |
| `L2-tools` | runtime/adapter | canonical invocation/status finite spy | no sibling package import to simulate runtime seam | positive execution blocked `UP-001/003/007` |
| Capability Hub | runtime/ref | identity/exposure/descriptor safe view fake | no registry/model copy | positive owner qualification pending |
| Method Library | ref/runtime resolver | body-free definition ref/version fixture | no method body/source import | current workspace not immutable `UP-008` |
| Governance | runtime/ref | immutable effective decision/policy safe-view fake | no approval/policy owner model copy | positive binding/implementation pending |
| Sandbox | runtime via Tools | only legacy-direct forbidden/zero-call fixture | no direct Port/package/host fallback | isolation/cleanup positive blocked |
| Observability | event/runtime handoff | body-free observation spy/rejecting sink | no backend package/storage | observed/audit/evidence blocked |
| model/durable memory/checkpoint | adapter/runtime | finite semantic/candidate/receipt/status fakes | no SDK/body/route/secret/backend assumption | `UP-004/005`, `CP-001` blocked |
| child/handoff/projection | adapter/runtime | finite ref/status + logical projection store | no member lifecycle/delivery/backend ownership | ENTRY/UP/IMPL blockers |
| Artifact/member/product/marketplace | ref/out-of-scope | typed refs + forbidden-boundary fixtures | no body/container/image/listing dependency | never Runtime-owned |

## 5. Toolchain and implementation preflight

| Preflight | Planned requirement | Failure disposition | Current fact |
|---|---|---|---|
| language manifest | Rust, edition `2024`, planned `rust-version = 1.93` | mismatch blocks compile/test lanes | `L2R-LANG-001`; not measured |
| compiler/toolchain | selected toolchain can parse/build planned workspace | unavailable/mismatch -> infra/preflight blocked | not selected/verified |
| async runtime | implementation choice conforms to Port/cancellation/lease semantics | design impact review before suites | not selected |
| DB/transaction product | supports logical atomic sets/CAS/unique/append/fence contract | integration qualification blocked if absent | not selected |
| broker/event product | supports chosen Bus adapter contract; no exactly-once inference | event positive lane blocked | not selected |
| scheduler | can drive exact J01~J07 envelopes without owning retry truth | Jobs positive lane blocked | not selected |
| test/report tools | can emit machine manifest/raw/result with deterministic selector | missing tool blocks evidence qualification | not implemented |

Preflight success would only make a lane runnable; it would not prove semantic tests pass or close any external blocker.

## 6. Entry profile matrix

| Entry | Allowed surfaces | Required local graph | Config capture | Prohibited behavior | Primary cases |
|---|---|---|---|---|---|
| `Api` | C01~C17, Q01~Q12 | handlers/services/UoW/repos/visibility/config | once before reservation/read | event ACK/job/scheduler/direct repository I/O in facade | ENTRY-001,C/Q |
| `Worker` | E01~E06 + wakeup/continuation contract | consumer/inbox/UoW/target repos/history/config | after envelope validation before inbox/UoW | API route/scheduler/owner write/ACK before commit | ENTRY-002,E |
| `Jobs` | J01~J07 | job handler/lease/page stores/repos/config | once before lease/page read | unleased/unbounded work/container lifecycle/cursor skip | ENTRY-003,J |
| `TestFake` | explicit deterministic test subset | finite complete fake graph | CI/TestFake startup only | any non-CI binding, infinite success, positive qualification | ENTRY-004 |

## 7. Configuration matrix

| Root / inventory | Environment combinations | Required tests | Critical oracle |
|---|---|---|---|
| CFG-01 `profile` | all 4 environments x 4 entry profiles | CFG01/06/10 | exact compatibility; assertion equality only; no readiness |
| CFG-02 `scope` | local/CI/integration | CFG03/05 + C01/C10 | explicit authorities; child strict subset; input narrows only |
| CFG-03 `context` | local/CI | CFG03/05 + C04 | bounds/order/freshness/mandatory omission |
| CFG-04 `working_memory` | local/CI | CFG03/05 + C05/J03 | trigger/max/stale policy/capture; no durable truth |
| CFG-05 `model_decision` | CI + blocked integration | CFG03/05/07/14 | logical bounds/ref only; no route/secret/quota/cost |
| CFG-06 `action_guard` | CI + blocked integration | CFG03/05/07/14 + C08/C09 | five guards; unknown block/fence; no local allow |
| CFG-07 `delegation` | local/CI + blocked integration | CFG03/05/06/14 + C10 | disabled/finite parent bounds/slot compatibility |
| CFG-08 `checkpoint_recovery` | CI + blocked integration | CFG03/05/07/08/14 | committed+closed fence; no unknown retry |
| CFG-09 `handoff_projection` | CI + blocked integration | CFG03/05/07/08/14 | local outcome/body-free/page/freshness; no observed |
| CFG-10 `idempotency` | local/CI/fault | CFG03/05/11/14 + REPLAY | retentions/digest/permanent uniqueness/snapshot capture |
| CFG-11 `adapter_slots` | all | CFG07/10/14/15 + SLOT01~13 | exact 13x5 tuples; Disabled/Blocked/Candidate; no Ready |
| CFG-12 `jobs` | all entry profiles | CFG08/10/11/14 + J01~07 | exact 7x6; static retry; lease/page bounds; no cadence |

All 153 exposed leaves are required; all 39 derived semantics are assembly-owned and cannot appear externally. One process loads one complete document at startup, publishes at most one immutable snapshot/facade, and never performs in-process reload/hot/admin override.

## 8. Slot and job environment posture

| Family | local_contract | ci_contract/TestFake | integration_candidate | production_candidate |
|---|---|---|---|---|
| 13 external slots | Disabled/Blocked or contract-complete Candidate without qualification | exact finite fake/Blocked; every slot identity retained | per-slot controlled candidate only after contract/profile; otherwise Blocked | real adapter requires independent qualification; currently blocked |
| J01~J03 local/projection/source/memory | Disabled/Candidate where dependencies locally finite | deterministic page/lease/store fakes | controlled products after selection | future qualified products |
| J04~J06 recovery/status/handoff | negative/reconcile-only | finite status fakes, no new effect | blocked until CP/owner contracts close | future qualified status paths |
| J07 publisher | immutable payload spy | exact replay fake | Bus candidate or Blocked | future qualified Bus route |

For every slot, `Candidate` and builder `Bound` mean compatibility only. A required Blocked path exposes no facade; optional Blocked may expose only an existing negative-only path where formal 04 allows it.

## 9. Environment failure and positive entry gate

| Condition | Lane result | Still runnable | Forbidden handling |
|---|---|---|---|
| invalid local config/dependency/toolchain | fail_fast / infra_preflight | static subset if independent | pass, partial facade, default config |
| fixture/namespace/cleanup failure | infra_error | none for affected raw run | reinterpret product result |
| owner contract/schema open | blocked_dependency/not_runnable | local/negative/blocked-aware | skip/pass/fake fallback |
| adapter Candidate but implementation/profile absent | blocked_dependency/not_runnable | contract compatibility only | `Bound` -> ready |
| external call/commit unknown | semantic Unknown + fence | status-only/manual cases | rerun-to-green or ordinary retry |

Positive qualification for any slot requires all of: formal owner contract and schema、selected real adapter、compatible non-TestFake profile、implemented local target、owner implementation/environment、independent same-run raw evidence、no open relevant blocker. Current qualification entries for slots 01~13 are all blocked.

## 10. Step 8 audit and formal §8 draft

| Audit | Result |
|---|---|
| formal environment names | exact 4 from 04 |
| dependency types | compile/runtime/event/ref/adapter/fake explicit |
| illegal path/package dependency | none designed |
| entry profiles | 4/4 |
| config denominators | 12/153/39/13x5/7x6 represented |
| toolchain/products | planned, not verified/selected |
| positive environment | none runnable today |
| deployment/secret/backend facts invented | none |

正式 §8 应说明 local/CI deterministic lanes、fault/cold simulation lane、blocked integration lane 与 future production qualification 的区别。只有 Core 是 compile candidate；Bus 为 event；Tools/Hub/Method/Governance/Sandbox/Observability/model/memory/checkpoint 等通过 runtime/ref/adapter/fake seam 测试。当前没有任何真实集成环境或 readiness。

```text
environment_matrix = planned_complete
entry_profiles = 4/4
dependency_type_audit = pass
positive_qualification_environment = blocked_dependency
actual_environment_ready = false
step_status = completed_continuous_authorized
next_step = Step 9
formal_05_write_allowed = false_until_step_15
```
