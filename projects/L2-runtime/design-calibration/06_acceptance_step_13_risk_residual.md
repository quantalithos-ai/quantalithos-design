# L2-runtime 06 验收标准 Step 13：风险接受与遗留项

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 13
> 回填位置：正式 `06-验收标准.md` §13
> 状态：`completed_continuous_authorized`
> 输入：formal 05 Step 14 residual risk register/re-entry、Step 11/12 VETO/defect rules、项目 ledger blockers、Step 10 evidence contract
> 事实边界：本 Step 只定义 future risk/residual decision contract；当前没有 actual risk record、acceptance authority、deadline、verdict 或 signoff

## 1. 风险与 blocker 的决策边界

```text
open blocker / residual
        |
        +--> provenance + impact + control + re-open trigger
        |
        +--> future authorized review
                 |
       +---------+----------+
       v                    v
    accept/defer         reject/block
```

风险接受不是“当前没有测试结果”的替代品，也不能把 VETO、S/A P0、invalid evidence、owner truth leak 或 positive qualification blocker 改写成通过。每一条未来可接受风险必须绑定一个固定 evidence set、scope、授权角色、理由、后续动作、截止/expiry 和 reopen trigger；缺任一字段保持 `open`。

## 2. 14 个残余风险登记

| Risk ID | 开放暴露 / 来源 | 未解决影响 | 当前控制 / 验收边界 | 关闭或 reopen trigger | 未来决策角色 | 当前状态 |
|---|---|---|---|---|---|---|
| `L2R-RR-001` | Tools/Sandbox action、receipt、feedback、cleanup positive path；UP-001/003/007 | action 与 unknown-effect recovery 无法正向资格 | finite fake、record-before-call、zero bypass、unknown fence；SLOT06/BOUND04 | formal owner contract + real adapter/profile/env + G2/G3 evidence | Tools/Sandbox owner + Runtime acceptance | `blocked_dependency` |
| `L2R-RR-002` | handoff producer/route/ACK/Observed；UP-002/006/007 | delivery/observation 无法证明 | local outcome/material/attempt/gap first；ACK phase limited；SLOT11~13 | exact schema/route + owner evidence | Bus/Handoff/Obs owner + acceptance | `blocked_dependency` |
| `L2R-RR-003` | Core/Bus shared runtime type/event authority；UP-003/006 | compile/event compatibility 可能变化 | no shadow authority；typed refs；DEP/SOURCE checks | versioned owner contract + rebaseline | Core/Bus contract owner + architecture | `pending_owner_contract` |
| `L2R-RR-004` | model materialization/semantic adapter/provider binding；UP-004 | real model turn unavailable/mismatch | provider-neutral intent/result；no route/secret；pending/unknown fail closed | two-port contract + non-TestFake qualification | model boundary + security + acceptance | `blocked_dependency` |
| `L2R-RR-005` | durable episodic/semantic memory owner；UP-005 | retrieval/lifecycle 无正向验证 | Runtime owns working use only；candidate/ref/gap；zero durable write | durable owner contract + adapter/env evidence | memory owner + data governance + acceptance | `blocked_dependency` |
| `L2R-RR-006` | Method Library immutable source baseline；UP-008 | definition/source provenance drift | current workspace dirty visible；no commit/hash claim；SOURCE check | owner-selected immutable baseline | Method owner + Runtime architecture | `pending_source_baseline` |
| `L2R-RR-007` | physical checkpoint atomicity/status/reconcile；CP-001 | resume 可能 duplicate/lose effects | Prepared/Committed/CommitUnknown split；closed fence；status-only reconcile | physical contract/implementation + fault qualification | checkpoint persistence + acceptance | `blocked_dependency` |
| `L2R-RR-008` | actor/scope/product/member entry binding；ENTRY-001 | production/API/child composition 无法资格 | authority-before-existence；strict subset；no member/container ownership | owner entry contract + composition qualification | entry/product identity + acceptance | `blocked_dependency` |
| `L2R-RR-009` | target implementation/scripts/runtime absent；IMPL-001 | no suite/evidence can execute | all paths planned_not_created；G1 not entered | authorized repo + actual revision + G0 handoff | implementation + test owner | `not_implemented` |
| `L2R-RR-010` | Rust/toolchain/async/store/broker/scheduler selection unverified；LANG-001 | build/runtime/test harness feasibility unknown | Rust 2024/planned 1.93 only；product assertions excluded | verified toolchain + formal product decision | implementation architecture + build/release | `preflight_pending` |
| `L2R-RR-011` | NFR001~003 workload/numeric threshold authority absent | no SLA/capacity/performance verdict | deterministic stage characterization；configured hard bounds；no invented number | formal workload/profile/threshold/env | performance + product acceptance | `characterization_only` |
| `L2R-RR-012` | artifact/report retention/deletion authority absent | evidence may delete early or retain without policy | referenced runs retained through acceptance/defect closure；deletion blocked while referenced | retention/deletion/audit policy + storage owner | test ops + security/privacy + acceptance | `policy_pending` |
| `L2R-RR-013` | all 13 external positive qualifications lack runnable identity/env | local fail-closed may be mistaken interoperability | QUAL excluded from 177；13/13 blocked；status check | per-slot rebaseline + independent run | seam owner + integration test + acceptance | `blocked_dependency_13_of_13` |
| `L2R-RR-014` | current formal 06 was historical; full restart only now being rebuilt | no verdict/risk/signoff authority exists yet | M4 draft boundary; all risks carried forward; no actual package | Step 15 assembly + future authorized acceptance | future formal 06 roles | `blocked_by_serial_order` |

当前全部 14 行均为 design-time posture，不是 actual accepted risk。`accept/defer/reject/block` 只有未来授权裁决可写入，且不得修改原始 evidence/status。

### Step 15 post-assembly reconciliation

正式 06 已在 Step 15 按 full-restart 完成装配，因此 `L2R-RR-014` 的“历史正式 06 尚未启动”这一设计阻塞条件已在设计层关闭，后续状态为 `design_closed_by_step_15_not_acceptance`。这不是实际验收、风险接受、verdict 或 signoff；其余 13 行状态不变，accepted count 仍为 0。

## 3. 不可风险接受条件

以下条件不能转换成 B/C residual、不能按排期豁免、不能支持 `有条件通过`：

| Condition | Authority | Required posture |
|---|---|---|
| Runtime 写 owner truth | VF001 | S stop；修复 ownership |
| missing/unknown guard default allow/host fallback | VF002 | S stop；zero call/fail closed |
| secret/raw body/hidden reasoning/capture leak | VF003 | S security stop；quarantine |
| commit/effect unknown retry/repeated/success | VF004 | S consistency stop；fence/reconcile/manual |
| delivery/Observed/receipt rewrites local truth | VF005 | S truth stop；restore phase separation |
| fake/planned/blocked/not-run/pending -> evidence/pass/ready | VF006 | S evidence stop；preserve status |
| non-Core sibling package dependency | VF007 | S architecture stop；restore seam |
| untraceable formal state/source/field/error/test boundary | VF008 | S source stop；no result |
| open S/A P0 or invalid/cross-run evidence | Step 11/12 | gate blocked；new valid run required |

## 4. 风险接受字段合同

Future `risk-acceptance.md` 每一行必须包含：

```text
risk_id
fixed_run_id / evidence_refs (or explicit no-evidence rationale)
scope_and_non_scope
impact
current_control
accept_or_defer_reason
required_action
owner_role
accepting_authority_role
deadline / expiry
reopen_trigger
review_status
```

缺 evidence 不能用“已知风险”替代；缺 accepting authority、deadline/expiry 或 reopen trigger 的行保持 `open`。VETO/S/A/P0 条件不允许填 `accept`。

## 5. Blocker 到风险的同步

| Blocker family | 影响风险 | 风险状态更新规则 | 禁止的 closure |
|---|---|---|---|
| UP-001~003 Tools/Hub/Bus | RR001~003 | owner contract/provenance 改变后重新审计 dependency type、protocol、G2/G3 case | fake/SDK/package/ping |
| UP-004~005 model/memory | RR004~005 | real owner contract + adapter/profile/env + independent evidence 才可 candidate/qualified | provider route/secret、durable body |
| UP-006~007 schema/Obs/Sandbox | RR002~003/007/013 | exact schema/route/implementation fact 触发 affected Step 5~14 rebaseline | ACK/receipt/Observed |
| UP-008 source baseline | RR006 | immutable owner-selected source/version 才可 rebaseline | dirty workspace/filename/hash guess |
| CP/ENTRY/IMPL/LANG | RR007~010/014 | closure fact + formal impact + new preflight/run | local design/compile exit/ping |
| NFR/retention/slot | RR011~013 | authority + workload/policy/slot run independently | invented thresholds/whole-product inference |

## 6. 风险、VETO、缺陷和总体结论交互

```text
VETO triggered / S / invalid evidence  -> 不通过，禁止 accept
A P0 unresolved                         -> G1 exit blocked
B/future residual                      -> only future authorized conditional review
all applicable gates + explicit risks  -> future 06 may decide three-value verdict
```

风险表本身不是 acceptance verdict。`blocked_dependency` 说明正向能力尚未可评估；`characterization_only` 说明无 numeric verdict；`pending_source_baseline` 说明 provenance 未闭合。任何状态都不能自动变成 `有条件通过`。

## 7. 风险停审与跨项审计

| Audit | Result |
|---|---|
| residual denominator | 14/14 carried from formal 05; no hidden extra/omitted row |
| blocker linkage | UP/CP/ENTRY/IMPL/LANG rows map to affected RR and re-entry contract |
| non-acceptable boundary | VF001~008 + S/A/invalid conditions prohibited from acceptance |
| authority | only future named role may accept; no person/signature asserted |
| evidence | fixed run/evidence refs required; current none |
| expiry/reopen | required for every future accepted/deferred risk; current none |
| status truth | all rows open/pending/blocked/characterization; none accepted/closed/waived/ready |
| G1/G2/G3 | local candidate cannot close 13 positive risk rows |

## 8. 回填草稿与 Step stop-review

Formal §13 应承载 14 行风险表、不可接受条件、risk-acceptance 字段合同、blocker synchronization 和与 VETO/defect/verdict 的边界。正文不得编造接受人、日期、证据或期限；当前状态全部保留为开放/阻塞/待定。

```text
step_status = completed_continuous_authorized
residual_risk_count = 14
accepted_risk_count = 0
veto_or_s_a_acceptance = prohibited
actual_risk_record_or_acceptance = none
next_step = Step 14
formal_06_write_allowed = false_until_step_15
```
