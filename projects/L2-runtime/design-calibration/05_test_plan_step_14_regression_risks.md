# L2-runtime 05 测试方案 Step 14：回归策略与残余风险

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 14
> 回填位置：正式 `05-测试方案.md` §14
> 输入：Step 5~13、正式 `00~04`、持续 blocker 台账
> 状态：`completed_continuous_authorized`
> 事实边界：所有 regression selector、run、risk record 和 disposition 均为 planned；没有测试执行、结果、artifact、report、risk acceptance、verdict、signoff 或 readiness

## 1. 本步目标、问题诊断与取舍

本步把“什么变化必须重跑什么”和“哪些未验证风险必须交给谁决定”固定成可执行合同。回归不按文件名或修改者直觉选择，而按 changed authority、受影响 design object、canonical TC ownership、相邻 phase 风险和 mandatory check 的并集选择。

| SOP 问题 | 当前结论 |
|---|---|
| 哪些变更触发最小回归？ | §4 的 18 类变更均给出 exact minimum case family、owning suite 和 checks；实际 selector 必须展开成逐 `case_id`。 |
| 哪些变更触发全量回归？ | §5 的 public semantics、跨层一致性、S/A 修复、evidence truth 等条件触发完整 172 raw + 5 aggregate。 |
| 哪些风险暂不覆盖？ | §9 的外部 owner contract/implementation/qualification、toolchain/product selection、数值阈值和 retention authority。 |
| 谁接受残余风险？ | 05 不接受风险；只登记 required future owner role。正式 06 的授权角色才可决定 accept/defer/reject/block。 |
| 哪些风险必须转入 06？ | 全部 `L2R-RR-*`、11 个持续 blocker、`L2R-LANG-001`、所有 S/A 缺陷和 `VF-L2R-001~008`。 |

旧 Step 14 使用旧 suite 名、18-state denominator 和混合 integration/qualification 口径，已作为 `historical_material` 删除重建。当前唯一分母是 172 owning raw + 5 same-run aggregate，31 states 和 Step 9 的 8 个 suite。

## 2. 回归选择算法与身份规则

```text
[changed source refs / owner fact / defect]
                 |
                 v
      [resolve affected design objects]
                 |
                 v
 [registry: CUT -> TC -> owning suite -> EV]
                 |
                 +--> [same-family negative/boundary/replay/unknown]
                 +--> [adjacent phase + write/call journal cases]
                 +--> [mandatory source/truth/security checks]
                 |
                 v
       [minimum selector as explicit TC set]
                 |
       full-trigger? -- yes --> [all 177 identities]
                 | no
                 v
          [new fixed regression run]
```

关键规则：

1. 输入是 current formal source ref、owner closure fact 或 defect impact，不是 changed filename alone。
2. `05_test_plan_step_13_evidence_registry.md` 决定 TC/EV/owning suite；EV 前缀不能反推 suite。
3. 最小集合是原始失败/变更 case、同 family 的 valid/negative/boundary/replay/unknown variants、直接相邻 phase case、owning suite 必要 checks 的并集。
4. 多个变更类取集合并集；任何 unresolved impact 自动升级 full 177，禁止猜测缩小。
5. `local_e2e` 只在全部 child raw 结果来自同一新 run 后派生，不能代替 raw case。
6. G2 integration candidate 与 G3 positive qualification 使用独立 manifest/run；不得并入 G1 177 或以 G1 fake 结果替代。

## 3. Mandatory check vocabulary

下表缩写只用于 §4 的设计表；future selector/plan 必须展开成完整脚本 ID。

| Short name | Planned check | Change risk |
|---|---|---|
| `SRC` | `scripts/checks/check_source_manifest.sh` | source/ref/historical alias |
| `DEN` | `scripts/checks/check_test_denominators.sh` | missing/extra/duplicate TC/EV/variant/suite owner |
| `DEP` | `scripts/checks/check_dependency_boundaries.sh` | compile/runtime/event/ref/adapter/fake direction |
| `MAT` | `scripts/checks/check_forbidden_material.sh` | body/secret/route/cost/hidden reasoning/owner truth |
| `FAKE` | `scripts/checks/check_fake_profile_leak.sh` | TestFake leaking into non-test/positive lane |
| `TRUTH` | `scripts/checks/check_status_truth.sh` | planned/blocked/ACK/report promoted to pass/readiness |
| `REDACT` | `scripts/checks/check_redaction.sh` | raw artifact/log/report material leakage |
| `PAIR` | `scripts/checks/check_artifact_report_pairing.sh` | cross-run/missing raw-report pair |
| `NOSTATIC` | `scripts/checks/check_no_static_evidence.sh` | manifest/table/handwritten report fabricating EV |

Every formal regression run executes `SRC` and `DEN`. The matrix adds the minimum adjacent checks; §5 full regression executes all nine.

## 4. Change class -> exact minimum regression

Ranges below are declarative expansions over current Step 6 identities, not runner globs. A future manifest builder must materialize every individual ID and validate it against the 177-row registry.

| Change ID / authority | Exact minimum canonical cases | Owning suite set | Additional checks | Full escalation |
|---|---|---|---|---|
| `RG-01` shared ID/ref/digest/metadata/envelope/public error | `TC-CAP01-001`,`TC-ERR-001~007` + every changed C/Q/E/O/J carrier | unit_state; fault_replay_consistency; affected protocol suite | MAT; REDACT; PAIR | public field/enum/version/digest rule changes |
| `RG-02` run admission/control/plan/loop | `TC-CAP02-001~002`,`TC-CAP03-001`,`TC-C01~03-001`,`TC-Q01~03-001`,`TC-LOOP-001~006`,`TC-SM01~03-001`,`TC-SM19~21-001`,`TC-SM25~30-001`,`TC-E2E-001` | unit_state; service_semantics; contract_protocol; fault_replay_consistency; local_e2e | TRUTH; PAIR | lifecycle/terminal/history/loop phase changes |
| `RG-03` context/source composition | `TC-CAP04-001`,`TC-C04-001`,`TC-C17-001`,`TC-Q04-001`,`TC-E04-001`,`TC-J02-001`,`TC-SM04-001`,`TC-SM15-001`,`TC-SLOT02~03-001`,`TC-BOUND-002`,`TC-SEC-001~002`,`TC-E2E-002` | unit_state; contract_protocol; service_semantics; entry_worker_job; security_source_boundary; local_e2e | MAT; REDACT; TRUTH | owner/freshness/body/digest/ordering semantics change |
| `RG-04` working/durable memory boundary | `TC-CAP05-001`,`TC-C05-001`,`TC-Q05-001`,`TC-J03-001`,`TC-SM05-001`,`TC-SLOT04-001`,`TC-BOUND-001~002`,`TC-E2E-002` | unit_state; contract_protocol; service_semantics; entry_worker_job; security_source_boundary; local_e2e | MAT; DEP; TRUTH | durable owner/lifecycle/write boundary changes |
| `RG-05` model binding/materialization/decision | `TC-CAP06-001`,`TC-C06~07-001`,`TC-Q06-001`,`TC-E01-001`,`TC-SM06-001`,`TC-SM22~23-001`,`TC-SLOT07~08-001`,`TC-BOUND-003`,`TC-OBS-002`,`TC-SEC-002`,`TC-E2E-003` | unit_state; contract_protocol; service_semantics; entry_worker_job; security_source_boundary; local_e2e | MAT; REDACT; DEP; TRUTH | semantic schema/outcome/unknown fence/provider boundary changes |
| `RG-06` action choice/guards/submission | `TC-CAP07-001~002`,`TC-C08~09-001`,`TC-Q07-001`,`TC-O03-001`,`TC-J05-001`,`TC-SM07~08-001`,`TC-SM31-001`,`TC-SLOT01-001`,`TC-SLOT05~06-001`,`TC-BOUND-004`,`TC-BOUND-006`,`TC-UOW-002~004`,`TC-E2E-004` | unit_state; contract_protocol; service_semantics; entry_worker_job; fault_replay_consistency; security_source_boundary; local_e2e | DEP; MAT; FAKE; TRUTH | five-owner guard, call ordering, identity or unknown behavior changes |
| `RG-07` delegation/sub-agent context | `TC-CAP08-001`,`TC-C10-001`,`TC-Q08-001`,`TC-E03-001`,`TC-SM09-001`,`TC-SLOT09-001`,`TC-BOUND-005`,`TC-E2E-004` | unit_state; contract_protocol; service_semantics; entry_worker_job; security_source_boundary; local_e2e | MAT; DEP; TRUTH | scope/budget/authority/isolation contract changes |
| `RG-08` feedback/reflection/order | `TC-CAP09-001~002`,`TC-C11-001`,`TC-E02-001`,`TC-SM10-001`,`TC-SM21-001`,`TC-SM24-001`,`TC-UOW-005`,`TC-REPLAY-002`,`TC-E2E-004` | unit_state; service_semantics; entry_worker_job; fault_replay_consistency; local_e2e | MAT; TRUTH; PAIR | ACK/commit, immutable history or once-only rule changes |
| `RG-09` checkpoint/recovery/effect fence | `TC-CAP10-001`,`TC-C12~14-001`,`TC-Q09-001`,`TC-J04~05-001`,`TC-SM11~12-001`,`TC-SM28-001`,`TC-SLOT10-001`,`TC-UOW-002~004`,`TC-ERR-003`,`TC-E2E-005` | unit_state; contract_protocol; service_semantics; entry_worker_job; fault_replay_consistency; local_e2e | TRUTH; PAIR | stable proof, physical receipt, fence or retry changes |
| `RG-10` outcome/handoff/projection | `TC-CAP11~12-001`,`TC-C15~16-001`,`TC-Q10~12-001`,`TC-E06-001`,`TC-O04~06-001`,`TC-J01-001`,`TC-J06~07-001`,`TC-SM13~14-001`,`TC-SM16-001`,`TC-SLOT11~13-001`,`TC-BOUND-007`,`TC-UOW-006`,`TC-REPLAY-005`,`TC-OBS-003`,`TC-E2E-005` | unit_state; contract_protocol; service_semantics; entry_worker_job; fault_replay_consistency; security_source_boundary; local_e2e | MAT; TRUTH; REDACT; PAIR | local/external truth phase, ACK/delivery/observed semantics change |
| `RG-11` Command/Query/Event/Job protocol | affected `TC-Cxx/Qxx/Exx/Oxx/Jxx-001` + owning CAP/SM/UOW/replay/error companions | affected raw suites | MAT; REDACT; PAIR | shared envelope, version, ACK, cursor, lease or result semantics change |
| `RG-12` state/disposition/posture transition | affected `TC-SMnn-001` + every Flow named in Step 6 D2 companion column + owning CAP | unit_state + companion owning suites | TRUTH; PAIR | variant added/removed/renamed, terminal/Unknown/legal-edge changes |
| `RG-13` repository/UoW/CAS/idempotency | `TC-LPORT-002~003`,`TC-UOW-001~007`,`TC-REPLAY-001~006`,`TC-SM30-001` + every affected mutation case | fault_replay_consistency; unit_state; affected mutation suites | TRUTH; PAIR; NOSTATIC | shared UoW/order/uniqueness/fence implementation changes |
| `RG-14` config schema/source/profile/slot/job/build | `TC-CFG01~15-001`,`TC-ENTRY-003~004`,`TC-SLOT01~13-001` + cases consuming changed leaf/derived field | config_builder; contract_protocol; entry_worker_job; security_source_boundary; affected suite | DEP; MAT; FAKE; TRUTH | any of 12 roots/153 leaves/39 derived/13x5/7x6/V0~V12 changes |
| `RG-15` entry/facade/authority/worker dispatch | `TC-ENTRY-001~004`,`TC-E01~06-001`,`TC-J01~07-001`,`TC-DEP-001` + affected protocol | entry_worker_job; security_source_boundary; affected suite | DEP; MAT; FAKE | authority ordering/profile/ACK/dispatch boundary changes |
| `RG-16` dependency graph, Port or owner seam | `TC-DEP-001`,`TC-BOUND-001~008`,`TC-SLOT01~13-001`,`TC-SEC-003`,`TC-SOURCE-001` + owning CAP/C/E/J | security_source_boundary; contract_protocol; affected suites | DEP; SRC; MAT; FAKE; TRUTH | dependency type/public Port/schema/owner direction changes |
| `RG-17` observation/redaction/security/status truth | `TC-OBS-001~003`,`TC-SEC-001~003`,`TC-TRUTH-001`,`TC-SOURCE-001`,`TC-CFG09-001` + every changed output surface | unit_state; security_source_boundary; config_builder; affected suites | MAT; REDACT; TRUTH; NOSTATIC | redaction/status/evidence/owner field or sink scope changes |
| `RG-18` test data/runner/selector/artifact/report/evidence tooling | affected case + one canonical case from each 7 raw suite + all 5 aggregates; failed/blocked/infra/invalid synthetic corpus | all 8 suites | all nine | selector/schema/digest/path/status/aggregation/generator changes |

## 5. Full 177 regression triggers

A new full G1 run with all 172 raw and 5 same-run aggregates is mandatory when any condition holds:

| Trigger | Why minimum selection is insufficient |
|---|---|
| public protocol/envelope/shared ID/ref/digest/error vocabulary changes | every layer serializes or compares the shared contract |
| any state variant、legal transition、terminal/Unknown rule changes | Flow and recovery assumptions cross multiple state subjects |
| shared repository/UoW/CAS/idempotency/lease/cursor/fence rule changes | mutation, event and job atomicity share the same failure surface |
| dependency/owner/secret/redaction/VF boundary changes | a local sample cannot prove absence across all outputs and call sites |
| any 04 root/leaf/derived/profile/slot/job/V-stage activation semantics change | every operation captures and consumes one immutable config snapshot |
| crate/module/facade/Port/repository boundary moves with unbounded impact | compile and runtime direction may change across all suites |
| selector、case manifest、artifact schema、digest/status precedence、evidence derivation or report generator changes | the mechanism deciding completeness/truth itself changed |
| an `S` or `A` P0 defect is fixed | Step 11 requires full closure for cross-cutting P0 confidence |
| source fingerprints or formal `00~05` semantics invalidate provenance | prior manifests and evidence candidates no longer bind current truth |
| impact analysis cannot enumerate a closed affected set | uncertainty is not a reason to shrink the denominator |

Full means all 177 identities, every declared variant for that manifest, all nine checks, complete raw/report generation and no filter/skip. It does not mean G2/G3 pass: those lanes remain separately blocked or qualified by their own prerequisites.

## 6. Regression run, evidence and comparison rules

| Rule | Exact contract |
|---|---|
| immutable run | every regression/retest allocates a new fixed `<run_id>` and links `prior_run_id`; prior failure is retained |
| selector | explicit manifest set; zero, extra, implicit filter, skip, ignore or missing case makes the run invalid/incomplete |
| source/config/data | store exact source manifest、implementation revision/workspace status、fixture/seed/fault digest and config snapshot ref/digest |
| status | failed/blocked/infra/invalid/cancelled is retained; no best-of-run merge or rerun-inside-run promotion |
| case evidence | each EV candidate derives only from same-run canonical case artifact + owning suite report + passed required checks |
| aggregate | rebuild from same-run child refs only; any missing/non-pass child prevents aggregate pass |
| comparison | compare only like manifest/workload/profile/variant sets; mismatched inputs are separate characterization, not regression proof |
| performance | record stage measurements and provenance; no numeric regression verdict until workload/threshold authority exists |
| redaction | scan raw JSON/logs, generated Markdown and acceptance drafts before evidence eligibility |
| defect closure | Step 11 targeted + impacted scope and required full trigger apply; a green exit code alone is insufficient |
| blocked seam | local negative regression can pass while positive lane remains `blocked_dependency`; report both without promotion |
| acceptance | regression report is M1~M4 candidate material only; 05 never creates verdict, signoff or risk acceptance |

## 7. Upstream contract closure and rebaseline

An upstream file, directory, ping, fake, Candidate/Bound tuple or implementation claim does not trigger automatic positive enablement. Only an authority-bearing owner fact starts this sequence:

```text
[owner contract / implementation / environment fact]
                    |
                    v
[verify provenance + blocker applicability]
                    |
                    v
[classify compile/runtime/event/ref/adapter/fake]
                    |
                    v
[impact current 00~05 + 13-slot/config/protocol registries]
                    |
          +---------+---------+
          |                   |
     no semantic change   semantic/schema change
          |                   |
          v                   v
 [G2 candidate plan]   [reopen affected formal Steps]
          |                   |
          +---------+---------+
                    v
[add dedicated G2/G3 case, data, suite, EV through formal rebaseline]
                    |
                    v
[independent non-TestFake run; old G1 run remains immutable]
```

Required sequence:

1. Record owner/source/version/status fact and which `L2R-UP/CP/ENTRY/IMPL/LANG` item it may affect; absence of immutable provenance keeps the blocker open.
2. Re-audit responsibility and dependency type. Runtime cannot turn an event/runtime/adapter seam into a package dependency or adopt owner truth.
3. Diff exact request/result/error/status/receipt/config/profile semantics against current 00~04. Any semantic drift reopens the affected upstream design Steps before testing.
4. Re-run Step 5/6/7/8/9/10/11/12/13/14 impact analysis. Adding a positive identity requires explicit TC、EV、dataset、environment、suite、checks、entry/exit and registry rows; it never reuses `TC-SLOTnn-001` local EV.
5. Preserve the current 177 G1 denominator unless formal Runtime local semantics changed. G2/G3 cases belong to independent manifests and runs.
6. Run affected local negative/boundary regression first, then G2 candidate, then per-slot G3 qualification. Failure at any stage preserves actual blocker/candidate posture.
7. Hand candidate evidence to future 06. Only authorized acceptance roles can update blocker/risk/qualification disposition.

## 8. Blocker-specific re-entry and regression boundary

| Blocker | Closure fact required before re-entry | Required design/test rebaseline | Minimum local regression before G2/G3 | Still forbidden after local pass |
|---|---|---|---|---|
| `L2R-UP-001` | formal Tools/Sandbox action、receipt、feedback、cleanup contracts and identifiable implementations | C09/CAP07/SLOT06/J05/feedback/error/config slot + dedicated qualification identity | RG-06 + RG-08 + RG-13 + RG-16 affected union | executed/isolated/cleaned/ready inference from normalized/local result |
| `L2R-UP-002` | formal producer/route/ACK/status/observation handoff contract | CAP12/C16/E06/J06/SLOT11/OBS03/handoff config + dedicated qualification | RG-10 + RG-16 + RG-17 | ACK -> delivered/observed/accepted; gap self-close |
| `L2R-UP-003` | owner-versioned shared Tools schema and compatible SDK/client boundary | shared type decision、InvocationCaller Port/schema/config/source manifest | RG-01 + RG-06 + RG-16 | Runtime-local shadow schema or SDK reverse dependency |
| `L2R-UP-004` | model materializer/semantic decision contracts plus real adapter/profile/environment | CAP06/C06~07/SLOT07~08/config/security + two dedicated qualifications | RG-05 + RG-14 + RG-17 | provider route/secret/quota/cost/body ownership or provider readiness |
| `L2R-UP-005` | durable memory ref/retrieval/candidate/lifecycle owner contract and implementation | CAP04~05/C04~05/Q05/J03/SLOT04/config + dedicated qualification | RG-03 + RG-04 + RG-14 + RG-16 | durable body/index/retention/delete/write truth in Runtime |
| `L2R-UP-006` | exact Core/Bus/Observability Runtime schema/version/route authorities | shared/event/source/projection/observation Ports、O/E/J/config/evidence source | RG-01 + RG-03 + RG-10 + RG-11 + RG-16 + RG-17 | publication receipt -> delivery/Observed; sibling package dependency |
| `L2R-UP-007` | real Sandbox/Observability implementations and authorized isolated qualification environment | affected adapters/profiles/G2/G3 datasets/oracles; fake lane remains separate | RG-06 + RG-10 + RG-16 + RG-17 | design/file/ping/fake as implementation or evidence proof |
| `L2R-UP-008` | Method Library owner selects an immutable formal baseline with source/version provenance | definition/source refs、plan/context/source manifest and SLOT02/03 | RG-02 + RG-03 + RG-16 | dirty workspace treated as immutable commit/baseline |
| `L2R-CP-001` | physical checkpoint commit、atomicity、receipt、status and reconcile contract/implementation | CAP10/C12~14/Q09/J04~05/SLOT10/config/fault + qualification | RG-09 + RG-13 + RG-14 + RG-16 | Prepared/local save -> physically Committed/resumable |
| `L2R-ENTRY-001` | typed actor/scope/product entry mapping and child-runtime composition authority | entry facade/profile/delegation/child slot; no member/container ownership | RG-07 + RG-14 + RG-15 + RG-16 | Runtime owns member-service/container/image/product lifecycle |
| `L2R-IMPL-001` | authorized, locatable target implementation repository and actual revision/build surfaces | all planned module/script/path assumptions checked against implementation without weakening formal design | RG-18 then full 177 | directory/compile/run exit alone -> evidence/readiness |
| `L2R-LANG-001` | Rust edition/toolchain compatibility verified and async/store/broker/scheduler products formally selected where needed | architecture/implementation/config/environment references re-reviewed; dependency licenses/versions recorded | RG-01 + RG-13~18 affected union; full 177 if shared runtime changes | planned Rust 1.93 or product name written as verified fact |

Closing one row does not close another. For example, a real `InvocationCallerPort` adapter cannot close Sandbox isolation or Observability backend qualification unless their respective owner facts and independent evidence also exist.

## 9. Residual risk register

`Current disposition` is a design-time posture, not an accepted risk. `Required future decision role` names an authority role only; no person, approval or signature is asserted.

| Risk ID | Open exposure / source | Impact if unresolved | Current control / test boundary | Reopen or closure trigger | Required future decision role | Current disposition |
|---|---|---|---|---|---|---|
| `L2R-RR-001` | Tools/Sandbox action, receipt, feedback and cleanup positive path; `UP-001/003/007` | tool action and unknown-effect recovery cannot be positively qualified | finite normalized fake, record-before-call, zero bypass, unknown fence; SLOT06/CAP07/BOUND04 | owner contracts + real adapters/environment + independent G2/G3 evidence | Tools owner + Sandbox owner + Runtime acceptance authority | `blocked_dependency` |
| `L2R-RR-002` | handoff producer/route/ACK/Observed path; `UP-002/006/007` | external delivery/observation cannot be proven | local outcome/material/attempt/gap first; ACK limited; SLOT11~13/BOUND07 | exact schemas/routes + real owners + per-seam evidence | Bus/Handoff/Observability owners + acceptance authority | `blocked_dependency` |
| `L2R-RR-003` | exact Core/Bus shared Runtime type/event authority; `UP-003/006` | compile/event compatibility may change | no shadow authority; typed candidates and schema refs only; DEP/SOURCE checks | formal versioned Core/Bus contracts and rebaseline | Core/Bus contract owners + Runtime architecture role | `pending_owner_contract` |
| `L2R-RR-004` | model materialization/semantic adapter/provider binding; `UP-004` | real model turn unavailable or mismatched | provider-neutral intent/result, no route/secret, pending/unknown fail closed | formal two-port contracts + real non-TestFake qualifications | model boundary owner + security + acceptance authority | `blocked_dependency` |
| `L2R-RR-005` | durable episodic/semantic memory owner; `UP-005` | retrieval and durable candidate lifecycle not positively verified | Runtime owns working use only; ref/candidate/gap, zero durable write/delete | durable owner lifecycle contract + adapter/environment evidence | memory owner + data governance + acceptance authority | `blocked_dependency` |
| `L2R-RR-006` | immutable Method Library source baseline; `UP-008` | definition/source provenance can drift | current workspace recorded as dirty; no commit/hash claim; SOURCE check | owner-selected immutable formal baseline | Method Library owner + Runtime architecture role | `pending_source_baseline` |
| `L2R-RR-007` | physical checkpoint atomicity/status/reconcile; `CP-001` | checkpoint resume may duplicate/lose effects | Prepared/Committed/CommitUnknown split; closed fence required; status-only reconcile | physical contract/implementation + fault qualification | checkpoint persistence owner + Runtime acceptance authority | `blocked_dependency` |
| `L2R-RR-008` | typed actor/scope/product/member entry binding; `ENTRY-001` | production/API/child entry composition cannot be qualified | authority-before-existence, strict subset, no member/container ownership | owning entry contract + composition qualification | entry/product identity owner + Runtime acceptance authority | `blocked_dependency` |
| `L2R-RR-009` | implementation repository/scripts/runtime absent; `IMPL-001` | no suite can execute and no evidence can exist | all code/scripts/paths explicitly planned_not_created; G1 not entered | authorized implementation repo + actual revision + G0 handoff | implementation owner + test owner | `not_implemented` |
| `L2R-RR-010` | Rust toolchain and async/store/broker/scheduler selection unverified; `LANG-001` | build/runtime semantics and test harness feasibility unknown | Rust 2024 / 1.93 only planned; product-specific assertions excluded | verified toolchain and formal product decisions | implementation architecture + build/release owner | `preflight_pending` |
| `L2R-RR-011` | NFR-001~003 workload and numeric threshold authority absent | no SLA/capacity/performance regression verdict | deterministic stage characterization, configured hard bounds, provenance; no number invented | formal workload/profile/threshold and measurement environment | performance owner + product acceptance authority | `characterization_only` |
| `L2R-RR-012` | artifact/report retention and authorized deletion duration absent | evidence may be deleted too early or retained without policy | retain candidate and referenced failure runs through acceptance/defect closure; deletion blocked while referenced | formal retention/deletion/audit policy and storage owner | test operations + security/privacy + acceptance authority | `policy_pending` |
| `L2R-RR-013` | all 13 external positive qualifications lack dedicated runnable identity/environment | local fail-closed result may be mistaken for interoperability | QUAL identities excluded from 177; 13/13 explicitly blocked; status truth check | per-slot §7 rebaseline and real independent run | each seam owner + integration test + acceptance authority | `blocked_dependency_13_of_13` |
| `L2R-RR-014` | current 06 is historical and full-restart 06 has not begun | no authority exists yet for verdict, risk acceptance or signoff | M4 acceptance draft only; all RR rows carried forward; 05 stops after completion | user authorizes 06 full-restart and acceptance authority is defined there | future formal 06 acceptance roles | `blocked_by_serial_order` |

No row is `accepted`, `closed`, `waived` or `ready`. A future decision must bind one fixed evidence set, scope, authority, rationale, expiry/reopen trigger and disposition; otherwise the risk remains open.

## 10. Non-risk-acceptable conditions

The following cannot be converted into a B/C residual, waived for schedule, or accepted by 05:

| Condition | Authority | Required posture |
|---|---|---|
| external owner truth created/rewritten by Runtime | `VF-L2R-001` | S defect; stop and correct ownership |
| missing/unknown governed or sandbox-required precondition defaults allow or host fallback | `VF-L2R-002` | S defect; zero call and fail closed |
| secret/token/raw external body/capture/Artifact/Evidence body/hidden reasoning retained or handed off | `VF-L2R-003` | S security stop; quarantine affected output |
| commit/effect unknown retried, repeated or declared successful | `VF-L2R-004` | S consistency stop; fence/reconcile/manual |
| delivery/Observed/receipt/downstream acceptance becomes local outcome/checkpoint truth | `VF-L2R-005` | S truth stop; restore phase separation |
| fake/planned/blocked/not_run/pending promoted to positive evidence/readiness/pass | `VF-L2R-006` | S evidence stop; preserve actual status |
| non-Core sibling added as package dependency or seam type falsified | `VF-L2R-007` | S architecture stop; restore dependency direction |
| formal state/source/field/error/test/implementation boundary cannot be traced | `VF-L2R-008` | S source stop; no formal result |
| any open S/A P0 product or tooling defect | Step 11 | G1 exit blocked until valid new-run closure |
| missing/filtered/skipped raw case, invalid artifact, redaction failure or cross-run evidence | Steps 9/12/13 | invalid/incomplete; cannot be risk-accepted into pass |

## 11. Future 06 handoff contract

| Handoff object | 05 supplies | Future 06 must decide | Current fact |
|---|---|---|---|
| local functional denominator | 37 CUT; 172 raw + 5 aggregate; explicit TC/EV/AC/VF registry | which valid fixed G1 run, if any, satisfies each AC | planned only; no run |
| protocol/state/config identity | 17 C、12 Q、6 E、6 O、7 J、31 states、13 slots、15 config slices | hard acceptance/blocked treatment without shrinking denominator | design complete; unexecuted |
| evidence eligibility | exact M0~M5, DTO, digest, paths, writer/reader and derivation rules | whether reviewed real M3/M4 records are admissible | no evidence instance |
| veto | 8 VF detection sources and S-class handling | final veto determination against one candidate | no determination |
| defects | S/A/B/C lifecycle and targeted/full retest rules | closure validity and release/acceptance impact | no actual defect record |
| blockers | `UP-001~008`,`CP-001`,`ENTRY-001`,`IMPL-001`,`LANG-001` with re-entry rules | blocked/conditional/deferred disposition under authority | all open as documented |
| residual risks | `RR-001~014` with impact/control/owner role/trigger | accept/defer/reject/block, scope and expiry; or keep open | none accepted |
| NFR | 19 mapped methods; structural/bound checks; performance characterization only | authoritative workload/threshold and verdict | no measurement |
| G2/G3 | independent candidate/qualification entry/exit and 13 blocked slots | per-seam qualification; no whole-product inference | 13/13 not runnable |
| signoff/readiness | explicit prohibition in 05 | authorized roles, final verdict and signoff | unavailable |

Future 06 must not consume the registry table as proof. It consumes only reviewed, valid fixed-run evidence items that mechanically derive from the registered raw case/report pairs and retain actual status.

## 12. Step 14 stop-review and cross-audit

| Audit | Result |
|---|---|
| change coverage | 18 change classes map exact case families, current owning suites, mandatory checks and full escalation |
| full denominator | exact 172 raw + 5 same-run aggregate; all 9 mandatory checks |
| selection truth | source/design/registry-driven; unresolved impact escalates rather than shrinks |
| G1/G2/G3 separation | local 177 remains independent from integration and 13 positive qualifications |
| upstream closure | 12 blocker/preflight rows have authority fact, rebaseline and regression requirements |
| evidence | new fixed run, no overwrite/cherry-pick/static EV/moving alias; failures retained |
| residual register | 14/14 name impact, current control, trigger, future role and non-accepted status |
| non-acceptable | VF001~008 and open S/A/invalid evidence cannot be risk-accepted |
| 06 handoff | evidence candidate, blocker, risk and verdict ownership remain separated |
| actual execution/risk/verdict | none; no fabricated fact |

```text
step_status = completed_continuous_authorized
canonical_regression_denominator = 172_raw + 5_same_run_aggregate
mandatory_check_count = 9
positive_qualification = blocked_dependency_not_runnable_13_of_13
residual_risk_count = 14_open_not_accepted
actual_run_artifact_report_evidence = 0
actual_risk_acceptance_verdict_signoff_readiness = 0
next_step = Step 15
formal_05_write_allowed = false_until_step_15_gate_open
```

## 13. 正式 §14 回填草稿

回归选择从变更的 formal source / owner fact / defect 出发，经 design object 和 177-row registry 展开为逐 TC 集合，并追加同 family negative/replay/unknown、相邻 phase 和 mandatory checks。18 类变更均有最小集合；public protocol/state/UoW/config/VF/evidence tooling、S/A 修复或影响无法闭合时必须执行完整 172 raw + 5 aggregate 的新 fixed run 和全部 9 个 checks。

G1 local regression 与 G2/G3 独立。上游 contract/implementation 闭口只能触发 provenance、依赖类型、设计影响和 dedicated TC/EV/data/suite/evidence rebaseline，不能复用 local slot EV 或修改旧 run。14 项残余风险均保持 open/pending/blocked；05 不接受风险，未来正式 06 才能依据真实 evidence、授权角色和明确 scope/expiry 作 disposition。
