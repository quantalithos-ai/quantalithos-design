# Step 8. 配置、环境与外部依赖准备校准

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 8
> 回填目标：正式 `07-实施计划.md` §8
> 状态：`completed / pass-designed`
> 事实边界：本文件定义实施前检查与阶段激活合同；不创建实现仓、不绑定依赖、不运行测试、不产生 readiness。

## 1. 输入与裁剪结论

本步重新读取并以以下材料为准：

| 输入 | 影响本步的真相 |
|---|---|
| `projects/L2-runtime/03-详细设计.md` §3、§4、§6.8、§7、§9、§10、§13 | Rust workspace 候选、Port/Builder/EntryAuthority、snapshot capture、状态/事务边界、依赖类别 |
| `projects/L2-runtime/04-配置设计.md` §3~§14 | 单一 strict JSON、12 root、153 exposed leaf、39 derived semantics、4 environment、4 entry、13 slot、7 job、V0~V12、cold replacement |
| `projects/L2-runtime/05-测试方案.md` §8~§10、§13 | lane/profile、compile/runtime/event/ref/adapter/fake 协作、preflight、slot/job negative posture、fixed-run 证据上限 |
| `projects/L2-runtime/design-calibration/04_config_step_03_control_plane.md`、`04_config_step_05_sources_precedence.md` | config owner、source precedence、禁止 env merge/partial publication |
| `projects/L2-runtime/design-calibration/04_config_step_06_profiles_matrix.md`、`04_config_step_07_items_slots_jobs.md` | environment/entry 矩阵与 slot/job tuple |
| `projects/L2-runtime/design-calibration/04_config_step_08_sensitive_secrets.md`、`04_config_step_09_loading_validation_activation.md` | redaction、V0~V12、builder 和 snapshot publication |
| `projects/L2-runtime/design-calibration/04_config_step_10_change_audit_rollback.md`、`04_config_step_11_failure_degradation.md` | cold change、failure/degradation、恢复上限 |

旧 Step 8、旧正式 07 和旧 35-boundary 依赖表只作为 `historical_material`；不能继承 reload、LKG、default、Ready、旧分母或旧脚本别名。

## 2. 实施前置顺序

#### 环境准备图：从授权仓到当前 boundary

```text
[implementation authorization]
  -> [exact target worktree + user-change inventory]
  -> [immutable formal 00~07 baseline]
  -> [repo-local git identity]
  -> [Rust edition/MSRV/toolchain preflight]
  -> [exact L0-core compatibility]
  -> [workspace/member/name/dependency scan]
  -> [one strict config source]
  -> [whole-candidate V0~V12 validation]
  -> [13 slot + 7 job posture]
  -> [immutable RuntimeConfigSnapshot]
  -> [current boundary Design/Scope/Worktree gates]
```

该图表达实施激活顺序，不表达部署拓扑、启动命令、网络可达性或外部服务 readiness。任一步缺失时，只能停在对应 boundary，不得从后续事实反推前置通过。

## 3. Repository、baseline 与 toolchain preflight

| 检查项 | 必须记录的事实 | 当前设计期状态 | 失败处理 |
|---|---|---|---|
| target repository | 精确路径、git root、branch、HEAD、初始 status、用户文件 | `/home/aris/Projects/quantalithos-runtime` absent | `commit-01-a`=`blocked / wait_design`；不创建替代仓 |
| design baseline | 包含正式 00~07、台账和 boundary source 的 immutable ref | `not_bound` | 不以 dirty HEAD、日期或文件名代替；所有 boundary activation blocked |
| repo-local identity | `user.name`、`user.email` 的 readback | `not_run` | Commit Gate blocked；不得修改 global config |
| Rust manifest | edition、`rust-version`、workspace resolver、目标 crate/binary | `not_bound` | 回正式 03/Step 3；不得自行降级或新增 binary |
| compiler/toolchain | 实际 `rustc`/`cargo` 版本、可解析/构建候选 workspace | `not_run` | preflight blocked；不将本机版本写成 target readiness |
| L0-core | package/crate/API/schema/codec/features/source ref 与 baseline 兼容 | `pending` | `SP-L2R-001`；禁止复制或 shadow Core |
| workspace graph | 7 个正式 member/package/crate 候选、只有 Core compile candidate | `not_created` | naming/dependency gate blocked |

transport、async runtime、database、broker、scheduler、container、provider SDK 和 secret backend 均未由本步选型；实现者不得以“先让代码运行”为理由补选。

## 4. 配置控制面与严格分母

配置只允许一个 entry-selected project-local strict JSON document。`entry_profile` 只能由 allow-listed selector 做一致性断言；不存在任意环境变量 leaf 覆盖层、merge 层、last-key-wins 或代码默认层。

| Canonical 数量 | 实施义务 | 失败姿态 |
|---|---|---|
| 12 top-level roots | `profile`、`scope`、`context`、`working_memory`、`model_decision`、`action_guard`、`delegation`、`checkpoint_recovery`、`handoff_projection`、`idempotency`、`adapter_slots`、`jobs` 必须且只能出现 | unknown/missing/duplicate/alias/case variant -> reject whole candidate |
| 153 exposed leaves | 每一 leaf 有 exact type、required/null、source、sensitivity、typed target、validation | type/range/secret/path conflict -> no typed candidate |
| 39 derived semantics | 只能从 validated 12 roots 静态推导，不能作为外部 key | supplied/unknown derived key -> reject |
| 13 adapter slots | exact key set x 5 leaves；每项有 owner/contract/schema/blocker posture | missing/extra/tuple mismatch -> builder blocked |
| 7 jobs | exact key set x 6 leaves；bounds 即使 Disabled/Blocked 也 required | zero/overflow/retry conflict -> reject |

`RuntimeConfigSnapshot` 只在 V12 issues=0 且 Builder compatibility 成功后发布。配置不拥有 owner decision、route/endpoint、secret/token、quota/cost、状态不变量或 readiness。

## 5. Environment 与 entry profile 矩阵

Environment class 与 entry profile 是正交轴；二者都不是 deployment readiness。

| Environment class | 允许 entry | slot posture | fake posture | 证据上限 |
|---|---|---|---|---|
| `local_contract` | `api`/`worker`/`jobs` | `Disabled`/`Blocked`；`Candidate` 只作受控兼容检查 | 不自动绑定 fake | local semantics；无 positive owner claim |
| `ci_contract` | `test_fake` | exact finite fake 或 `Blocked` | 仅隔离 TestFake composition | deterministic contract/fault；fake 不可外泄 |
| `integration_candidate` | `api`/`worker`/`jobs` | individually admitted `Candidate`，其余显式 Blocked/Disabled | 禁止 TestFake fallback | candidate/mismatch/blocked；不计 readiness |
| `production_candidate` | `api`/`worker`/`jobs` | owner/profile/implementation/qualification 全闭合前仍 Candidate/Blocked | 禁止 fake | 设计输入；当前不可激活 |

| Entry profile | Authority ceiling | Jobs | 强制检查 |
|---|---|---|---|
| `api` | command/query/internal-loop | 7 个 job 全部 `Disabled` | 不得直接 repository/adapter I/O |
| `worker` | inbound-event/continuation/internal-loop | 7 个 job 全部 `Disabled` | receipt/inbox 成功后才 ACK |
| `jobs` | operations-job/internal-loop | 每个 job 显式 Disabled/Blocked/Candidate | lease/page/cursor bounded |
| `test_fake` | 显式非空的有限测试 authority 子集 | 由 fixture 显式声明 | 只能在 `ci_contract` |

任何 `ready`、`live`、`integration_ready`、`production_ready` literal 都拒绝。`Bound` 仅表示本地依赖图可构造，不等于 adapter availability 或 readiness。

## 6. Immutable snapshot、加载与变更

V0~V12 必须按正式 04 顺序执行：

| Stage | 检查 | 可见输出 | 失败时 |
|---|---|---|---|
| V0 | exactly one source/selector/fixture class | safe source identity | no discovery/default |
| V1 | bounded UTF-8 single document | transient bytes | no body/path log |
| V2 | duplicate-aware strict JSON | duplicate-checked tree | no tolerant parse |
| V3 | exact roots/closed shape/secret-forbidden scan | raw nodes | no extension retention |
| V4 | scalar/null/array/object/enum exactness | primitive candidates | no coercion/case-fold |
| V5 | typed refs/versions/blockers/counts/durations | typed leaves | no owner body/credential resolution |
| V6 | required/null/range/nonempty/unique | field-valid domains | no default/dedupe/clamp |
| V7 | domain cross-field relations | domain-valid candidate | reject whole candidate |
| V8 | environment/entry/authority/fake matrix | profile-valid candidate | no assertion override |
| V9 | exact 13 slot tuples | slot candidate | no adapter call/new slot |
| V10 | exact 7 job tuples and static retry | job candidate | no scheduler discovery |
| V11 | dependency/blocker/direction gates | coherent candidate | no blocker closure |
| V12 | 39 derivations, canonical fingerprint, issues=0 | immutable snapshot candidate | no publication |

Each operation, event, continuation, page and replay captures one `RuntimeConfigSnapshotRef` plus digest. A later reload may affect only future operations after a complete cold replacement; invalid replacement does not partially publish, silently merge or substitute current config during replay. Historical snapshot missing means `unavailable/invalid`, never current substitution.

## 7. Adapter slot and job activation contract

`AdapterBinding` is closed to `Disabled | Blocked | Candidate`:

| Posture | Required tuple | Allowed call |
|---|---|---|
| `Disabled` | optional requirement; contract/schema/blocker all null | zero call |
| `Blocked` | blocker non-null; contract/schema may be paired null or non-null | zero positive call; finite negative result |
| `Candidate` | contract_ref + expected_schema non-null; blocker null | compatibility/qualification lane only |

`TestFake` is an entry/profile assembly choice, never a binding variant. `Ready` is forbidden. A required Blocked slot blocks composition; an optional Blocked slot can expose only the formally allowed negative-only surface.

The seven jobs use bounded `partition_count`, `lease_ttl_seconds`, `page_limit`, and `max_page_attempts`; every page owns a lease epoch and commits item/report/cursor atomically. `resume` and `reconcile` jobs never create a new effect identity; Unknown remains status-only and fenced.

## 8. Dependency collaboration matrix

| Dependency | Category | Runtime collaboration | Positive activation prerequisite | Current posture / failure |
|---|---|---|---|---|
| `L0-core` | `compile` candidate | reviewed exact package/API/source | compatibility + immutable baseline | pending; no shadow type |
| `L0-bus` | `event` / `adapter` / `fake` | immutable outbox and publisher Port | route/schema/status/qualification | local outbox only |
| `L0-sdk` | `ref` / downstream | public contract consumer | downstream decision | Runtime does not depend on SDK |
| `L2-tools` | `runtime` / `adapter` / `fake` | typed invocation/action/receipt seam | owner contract + selected adapter + qualification | zero-call/blocked; `L2R-UP-001~003` |
| Capability Hub | `runtime` / `ref` | identity/exposure/descriptor read | formal exposure/source | guard non-Allowed on missing/stale |
| Method Library | `runtime` / `ref` | method/role/process ref/version | immutable source baseline | dirty source disclosed; `L2R-UP-008` |
| Governance | `runtime` / `event` / `ref` | effective decision/policy read | authority/freshness/source | deny/wait; never default allow |
| Sandbox | `runtime` / `adapter` / `fake` | only downstream action handoff | isolation/receipt/cleanup qualification | no direct call/host fallback |
| model provider | `runtime` / `adapter` / `fake` | provider-neutral semantic result | owner contract/profile/credential outside Runtime | no-model/blocked/Unknown |
| durable memory | `runtime` / `ref` / `adapter` | safe retrieval/ref/status | body/index/lifecycle owner | working/ref-only; `L2R-UP-005` |
| checkpoint backend | `runtime` / `adapter` | prepare/commit/receipt/status | exact tri-state contract | Prepared/Unknown; `L2R-CP-001` |
| Observability | `event` / `adapter` / `fake` | body-free candidate signal | route/backend qualification | local carrier/gap only |
| entry/product owner | `runtime` / `ref` | typed actor/scope mapping | owner contract/product qualification | facade-only; `L2R-ENTRY-001` |

No runtime/event/ref/adapter/fake seam may be represented as Cargo/package dependency. The only compile candidate is verified `L0-core`.

## 9. Secrets and forbidden material

Config source, snapshot, logs, errors, event envelopes, checkpoint records, reports and handoff material must remain free of raw token/secret/DSN/private key, provider route/quota/cost, prompt/response/tool/sandbox/artifact body, hidden reasoning and full sensitive refs. A resolver may expose only an opaque handle and use posture. Redaction failure blocks the current output and boundary; it is never repaired after publication.

## 10. Fake/mock boundary

| Fake use | Allowed | Forbidden |
|---|---|---|
| local domain/UoW/CAS/inbox/outbox/lease | `local_contract`/`ci_contract` deterministic tests | production dependency or readiness |
| owner safe-view / status seam | finite negative/candidate fake with call journal | owner truth, body, lifecycle, default success |
| model/action/checkpoint/handoff/publisher | semantic/receipt/status fault fake | provider/tool/sandbox execution or durability proof |
| TestFake composition | only explicit `ci_contract/test_fake` | integration/production binding or positive qualification |

Fake output is a test result or blocked posture, never an owner implementation, delivery receipt, Observed status, acceptance evidence or readiness.

## 11. Phase activation mapping

| Phase | Required preparation | Allowed while external blocker remains |
|---|---|---|
| PH-01 Foundation & Vocabulary | target repo, baseline, Rust/Core preflight | none until repo/baseline; design-only calibration remains |
| PH-02 Local Consistency Kernel | PH-01 local contracts, deterministic stores | local/fault fake only; product store selection is Spike |
| PH-03 Runtime Loop Kernel | PH-02 CAS/lease/reservation and loop state source | local loop tests; no external owner call |
| PH-04 Admission, Run & Plan | loop service + Governance/Method read seams | denied/blocked safe views; dirty Method stays disclosed |
| PH-05 Source, Context & Working Memory | source snapshot + working bounds | ref/working-only; durable positive blocked |
| PH-06 Provider-neutral Model | immutable context + model slot posture | blocked adapter/Unknown tests; no provider positive |
| PH-07 Governed Action | five-owner guard inputs + Tools slot | zero-call/record-before-call tests; no execution |
| PH-08 Delegation, Feedback & Reflection | strict subset/budget/receipt contracts | finite child seam; no member lifecycle |
| PH-09 Checkpoint & Recovery | prepared/fence/reconcile source | local status-only; physical positive blocked |
| PH-10 Local Outcome & Handoff | terminal proof + safe material | local outcome/attempt/gap; no delivery/Observed |
| PH-11 Projection, Events & Jobs | committed history/outbox + 7 job registry | local projection/publisher fake; route blocked |
| PH-12 Composition & Entry | all local contracts + 12/13/7 denominators | local/CI composition; production entry blocked |
| PH-13 Quality & Handoff Tooling | actual target repo/build/test runner | planned tooling only until implementation exists |

## 12. Step closure audit

| Check | Result |
|---|---|
| 12 roots / 153 leaves / 39 derived preserved | `pass-designed` |
| 4 environment classes x 4 entry profiles preserved | `pass-designed` |
| 13 slots and 7 jobs exact posture and bounds | `pass-designed` |
| immutable snapshot, V0~V12, cold replacement and replay by-ref | `pass-designed` |
| compile/runtime/event/ref/adapter/fake types explicit | `pass-designed` |
| secret/forbidden and fake leakage rules explicit | `pass-designed` |
| target repo, baseline, Core and positive seams not fabricated | `pass` |
| implementation/run/artifact/report/evidence/readiness | `none / not_started` |

```text
step_08 = completed
next_allowed_action = rebuild_step_09_spikes_risks_open_questions
formal_07_write_allowed = false
implementation_status = not_started
```
