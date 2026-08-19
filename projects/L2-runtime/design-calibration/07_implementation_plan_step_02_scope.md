# L2-runtime 07 实施计划 Step 2：实施目标、范围与非范围

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 2
> 回填位置：正式 `07-实施计划.md` §2
> 状态：`completed_continuous_authorized`
> 输入：Step 1 `pass_to_step_02`、current formal 00~06

## 1. SOP 问题回答

1. **最小可交付结果**：在 `ci_contract/TestFake` 与 blocked-aware seams 下，能够以 bounded loop activation 驱动 admission/plan/context/model/action/delegation/recovery/outcome/handoff local truth，并以 exact state/UoW/replay/config/test contract 可验证。
2. **必须覆盖的需求**：20 个 core FR、44 BR、19 NFR 的结构性实现面；4 个 peripheral future FR 只保留正式 facade/handoff seam，不纳入 local P0 completion。
3. **必须落地的详细设计**：7 crates、12 CAP、loop kernel、48 protocol/job surfaces、31 states、Port/UoW/CAS/inbox/outbox/lease/cursor/fence、15 config slices、13 slots 和 7 job controls。
4. **必须可判定的验收项**：G1 local 范围内 36 AC、8 VF、19 NFR；需由 177 TC/EV、8 suites 和 9 checks 支撑。Blocked external lane 只能为 `not_evaluable/blocked_dependency`，不能缩 G1 分母或伪 pass。
5. **明确不实施什么**：所有相邻 owner truth、具体 infrastructure/provider/product choice 与实际验收裁决。
6. **P1/P2 膨胀风险**：production adapter、physical DB/broker/scheduler、hot reload、numeric SLO、member/product/marketplace lifecycle 不得自然进入 P0。

## 2. Implementation objectives

| ID | Objective | Formal source | Planned completion direction |
|---|---|---|---|
| `OBJ-L2R-01` | deterministic shared vocabulary and operation identity | CAP-01；C/Q/E/J envelope；SM-30 | typed body-free carriers、canonical digest、exact replay/conflict |
| `OBJ-L2R-02` | bounded runtime loop and wakeup/continuation control | loop kernel；SM-25~29；C03/J04 | one live activation、one operation per step、T1/T2/T3、hard yield no spin |
| `OBJ-L2R-03` | admission、run、goal/plan local truth | CAP-02/03；C01~03；Q01~03；SM-01~03/19~21 | accepted-only run、immutable revisions、CAS progress、zero-write queries |
| `OBJ-L2R-04` | context composition and working/durable memory mediation | CAP-04/05；C04/05/17；Q04/05；E04；J02/03；SM-04/05/15/22/23 | ordered budget/freshness、working use/compaction、durable ref/candidate/gap only |
| `OBJ-L2R-05` | provider-neutral model decision | CAP-06；C06/07；Q06；E01；SM-06/17/22~24 | binding/materialization/turn/result/decision separation、record-before-call、Unknown fence |
| `OBJ-L2R-06` | governed action、delegation and feedback/reflection | CAP-07~09；C08~11；Q07/08；E02/03；O03；SM-07~10/21/24/31 | five guards、zero bypass、subset child context、once-only incorporation |
| `OBJ-L2R-07` | checkpoint、recovery、outcome and handoff | CAP-10~12；C12~16；Q09~11；E06；O04/05；J04~06；SM-11~14/28/29 | Prepared/Committed split、matching receipt、local outcome immutable、gap no self-close |
| `OBJ-L2R-08` | event/projection/job operational seam | Q12；E05；O01/02/06；J01/J07；SM-16/18 | immutable outbox、inbox receipt before ACK、contiguous rebuild、lease/page/cursor |
| `OBJ-L2R-09` | strict configuration、composition and entry | 04 CFG-01~12；13 slots；7 jobs；V0~V12；03 EntryAuthority | whole-candidate validate、no Ready/fake leak、facade-only API/worker/jobs |
| `OBJ-L2R-10` | executable test/evidence handoff tooling | 37 CUT；177 registry；8 suites；9 checks；M0~M5 | fixed-run raw/report/index/drafts with status truth；no verdict/signoff |

## 3. Scope tiers

| Tier | Included implementation | Required proof | Completion ceiling |
|---|---|---|---|
| `P0-local-core` | 7 crates、12 CAP、loop kernel、48 surfaces、31 states、7 UoW、6 replay、strict config、local repositories/fakes/blocked adapters | exact boundary tests + future full 177/9 checks | local Runtime contract candidate |
| `P0-integrity` | only-Core graph、body-free/redaction、fake isolation、status truth、same-run pairing/no-static evidence | 9 mandatory checks + 8 VF review inputs | G1 decision input only |
| `conditional-G2` | one named real adapter/profile seam | owner contract/revision/env + independent fixed run | named candidate compatibility |
| `conditional-G3` | one real external slot positive qualification | dedicated `TC-QUAL-SLOTnn`/QUAL EV after rebaseline | that slot qualification only |
| `future-product` | transport/deployment/member/product/marketplace/readiness | separate owning design/release authority | outside Runtime implementation completion |

## 4. In-scope implementation surfaces

| Surface | Included | Excluded or conditional |
|---|---|---|
| language/workspace | planned Rust 2024/1.93, exact 7 crate topology, English identifiers and current coding standard | actual toolchain pass until real repo preflight |
| domain/application | all Runtime-owned objects, factories, transitions, service flows, loop T1/T2/T3 | generic state manager、recursive unbounded loop、owner truth |
| persistence kernel | local repository contracts/fakes/deterministic implementation seam, UoW/CAS/idempotency/inbox/outbox/lease/cursor | concrete DB/isolation/migration product selection |
| adapters | blocked/disabled/candidate finite posture, TestFake parity, exact Port | production qualification, route/secret/quota/cost, hidden fallback |
| entries | transport-neutral API/worker/jobs facade mapping and EntryAuthority | server/runtime/scheduler/member/container lifecycle |
| configuration | exact 12 roots, 153 leaves, 39 derived, 13 slots, 7 jobs, cold whole-candidate activation | hot reload/admin UI/deployment controller/private defaults |
| testing/tooling | canonical manifest, 8 suites, 9 checks, fixed-run writers/generators and negative status tests | actual run/evidence/verdict in this design task |

## 5. Explicit non-scope

Runtime implementation must not absorb:

- Tools execution、Capability registry/exposure、external MCP/A2A/API adapter truth。
- Governance approval/policy truth、Sandbox isolation/cleanup、Observability backend/audit/Observed truth。
- Method/role/process body/source/lifecycle。
- Provider secret/route/endpoint/quota/cost/billing/raw request/response/hidden reasoning。
- Durable episodic/semantic memory body/index/retention/deletion/rebuild truth。
- Bus delivery/retry/DLQ truth、Artifact/evidence body or acceptance authority。
- Member-service/container lifecycle、member-images packaging、marketplace listing、product entry/readiness。
- Concrete async runtime、HTTP/RPC framework、DB、broker、scheduler、provider SDK、deployment manifests or numeric SLO without owning formal design.
- Actual commit、run、artifact、report、EV、defect、risk acceptance、verdict、signoff or release approval during this design task.

## 6. Scope-to-acceptance trace

| Scope group | Primary AC/VF direction | Required canonical verification |
|---|---|---|
| loop/run/plan | AC001/006~008/019/031/034/035；VF004/008 | LOOP/C01~03/Q01~03/SM01~03/19~21/25~30 rows |
| context/memory | AC002/009/010/021/028~030/033；VF001/003 | C04/05/17/Q04/05/E04/J02/03/SM04/05/15/22/23 rows |
| model | AC003/011~013/025/029/033/035；VF003/004 | C06/07/Q06/E01/SM06/17/22~24/UoW/replay rows |
| action/delegation/feedback | AC004/014~016/023/025/027/033/035；VF001~005 | C08~11/Q07/08/E02/03/O03/SM07~10/21/24/31 rows |
| recovery/outcome/handoff | AC005/017/018/020/024/029/034~036；VF003~005 | C12~16/Q09~11/E06/O04/05/J04~06/SM11~14/28/29 rows |
| projection/event/jobs/config/entry | AC022/025/026/030/032~036；VF001/003/005~008 | Q12/E05/O01/02/06/J01/07/SM16~18/CFG/ENTRY/DEP/SOURCE/TRUTH rows |

## 7. Scope stop review

| Audit | Result |
|---|---|
| objective trace | 10 objectives map to current formal CAP/protocol/state/config/test/AC/VF |
| P0/conditional/future split | explicit; positive seam not folded into local completion |
| owner redlines | all forbidden ownership retained |
| denominator | 31 state / 177 TC-EV / 8 suite / 9 checks, no old identity |
| implementation authorization | none; repo/baseline blockers unchanged |

```text
step_status = completed_continuous_authorized
gate_status = pass_to_step_03
scope_growth_allowed = false_without_formal_change_control
formal_07_write_allowed = false_until_step_13
next_allowed_action = rebuild_step_03_prerequisites_reading
commit_required = false
```
