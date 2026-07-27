# L3-capability-hub 05 测试方案 Step 15: 正式文档装配

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 15
> 书写规范: `standards/document/测试方案书写规范.md`
> 输出: `projects/L3-capability-hub/05-测试方案.md`
> Step 状态: `completed / formal-05-rebuilt-and-audited`
> 日期: 2026-07-25

---

## 1. 目标与装配边界

本 Step 只把已完成的 Steps 1~14 收口结论重写为固定15章正式测试方案。它不新增requirement、design/config contract、TC/DS/EV、suite/check/gate、threshold、risk decision或execution fact。

旧formal 05整体属于historical material：其12章结构、`MCPServer/A2ANode/ProviderContract/CapabilityDecision/CostRecord`主体、KMS/Vault/local PG/bus拓扑、`TC-001..012`和无provenance结果全部不得进入新版正文。装配采用replace，不做旧段落patch或ID alias。

## 2. SOP 七问装配答案

| # | 装配问题 | 决策 |
|---:|---|---|
| 1 | 是否按15章主链？ | 是，章名逐字采用规范§3，另有文档元信息/修订记录但不增加业务章节。 |
| 2 | 是否保留全部P0对象/场景/数据/环境/门禁/证据？ | 是；保留171 DDD + 18 CFG-F、189 TC/DS/EV、83 flows、638 pairs、10 suites、9 checks、20 NFR、37 AC/13 VF consumers。 |
| 3 | 是否删除SOP问题和讨论语气？ | 是；问题答案、旧文档诊断、取舍和stop-review仅留本中间产物。 |
| 4 | 未确认项是否进入风险？ | 是；16项risk/prerequisite均进入§14，状态只允许`not_eligible|pending_not_accepted`。 |
| 5 | P0用例能否回指设计？ | 是；正式§3/5/6保留exact cut/range/source规则，逐行前置/操作/oracle权威链接Step 6。 |
| 6 | 是否存在旧名或phase越界？ | 装配后机械+语义扫描；历史词不得出现在active正文。 |
| 7 | 能否被06直接消费？ | 是；§5/13提供37 AC、13 VF、189 EV、raw/report paths和status边界，06仍独立裁决。 |

## 3. 正式章节唯一来源图

| Formal chapter | Canonical calibration source | Required formal content | Must remain outside formal text |
|---|---|---|---|
| §1 | Step 1 | authority chain、historical disposition、truthfulness/reopen | SOP five questions、diagnostic process |
| §2 | Step 2 | goals、P0/P1/P2、scope/non-scope、veto direction | option tradeoffs |
| §3 | Step 3 | 171+18 cuts、inventory、oracle precedence | extraction diagnostics |
| §4 | Step 4 | L0~L6、primary/secondary/earliest discovery | framework speculation |
| §5 | Step 5 | FR/BR/NFR/AC/VF and reverse coverage counts | candidate-stage discussion |
| §6 | Step 6 | 189 identities、case schema、families、shared branches、638 registry | batch stop reviews |
| §7 | Step 7 | 189 DS、12 primitives、recipes/isolation/cleanup/substitutes | future file guesses |
| §8 | Step 8 | seven environments、profile/entry/topology/config placement | product readiness claim |
| §9 | Step 9 | 10 suites、5 gates、9 checks、4 builders、raw/report contract | CI existence/result |
| §10 | Step 10 | 20 NFR、structural/sample split、fault/redline/observer rules | historical threshold values except explicit deny rule |
| §11 | Step 11 | classification、S/A/B、VF severity、retest/closure | actual defect state |
| §12 | Step 12 | future entry/exit criteria、P0/selected/release split | checked completion boxes |
| §13 | Step 13 | 189 EV、schemas、paths、generation/review/retention | evidence instance/result/signoff |
| §14 | Step 14 | R0~R4、13 triggers、12 full triggers、16 risks | accepted person/signature |
| §15 | Steps 1~14 + standards | active sources and exact calibration artifacts | historical documents as authority |

## 4. Canonical inventory lock

| Axis | Locked formal value | Source |
|---|---:|---|
| exact testing obligations | `189 = 171 DDD CUT + 18 CFG-F` | Steps 3/5 |
| canonical case/data/evidence contracts | `189 / 189 / 189` | Steps 6/7/13 |
| case families | `18 FOUNDATION + 26 CMD + 33 QUERY + 6 INBOUND + 10 OUTBOUND + 8 JOB + 24 STATE + 22 TX + 12 BIND + 12 OBS + 18 CONFIG` | Step 6 |
| exact flows | `83 = 26 C + 33 Q + 6 I + 10 O + 8 J` | formal 03 / Steps 3/6 |
| states | `24 families / 111 variants / 638 pairs = 239+98+301` | Steps 3/6/7 |
| code inventory cuts | `7 modules / 43 HLD objects + 7 helpers / 250 protocols / 36 Ports / 22 repository traits + 110 methods` | formal 03 / Steps 3/6 |
| TX/BIND/OBS/CONFIG | `22/12/12/18` | Steps 3/6 |
| environments/profiles/entries | `7 / 3 / 3` | Step 8 |
| suites/gates/checks/report builders | `10/5/9/4` | Step 9 |
| NFR/AC/VF | `20/37/13` | Steps 5/10/13 |
| config inventory | `18 modules / 27 rows / 21 env leaves / 9 slots + 14 callables / 6 sources / 10 routes / 3 profiles` | formal 04 / Steps 8~10 |
| observation | `60 logs / 48 metrics / 27 spans + 3 events / 20 durable profiles` | formal 03 / Step 10 |
| regression/risk | `R0~R4 / 13 change surfaces / 12 full triggers / 16 risk rows` | Step 14 |

Any assembly discrepancy stops formal write and reopens the exact owning Step; it cannot be fixed by changing the count in formal prose.

## 5. Three-batch write plan

| Batch | Formal range | Mandatory closure | Batch gate |
|---|---|---|---|
| `A` | metadata + §§1~5 | source priority、scope/redlines、cut inventory、layers、FR/BR/NFR/AC/VF traceability | 5 chapter headings/source blocks；171+18 and 16/37/20/37/13 intact |
| `B` | §§6~10 | 189 case/data contracts、638 pairs、seven envs、ten suites/five gates/nine checks/four builders、20 NFR | no compressed generic case claim；all exact family ranges and failure branches locatable |
| `C` | §§11~15 | severity/retest、future entry/exit、189 EV/provenance、R0~R4/risk、references | no checked execution state；no accepted risk/signature；15 chapters complete |

Each batch is written with `apply_patch`, then checked for heading order、source blocks、fence pairing、historical leakage and execution-language contamination.

## 6. Formal writing rules

1. 每章开头包含exact calibration source和延伸阅读，不只引用目录。
2. 正文只写稳定合同；逐条189 case/DS recipe的canonical detail仍由Step 6/7唯一维护，正式章必须保留closed identity range和直接入口。
3. `covered-designed`、`planned`和`not_evaluated`只描述设计/未来状态；不得写实际`passed/failed`结果。
4. 所有future command/path均标为contract，不声称文件、CI、repo或environment存在。
5. Formal 05只定义测试与证据，不作formal 06 acceptance decision，不排formal 07 implementation order。
6. Raw/report固定为`artifacts/test/<run_id>`和`reports/runs/<run_id>`；禁止project nesting和`latest`。
7. Rustdoc gate逐项覆盖declaration、struct及field、enum variant及payload field、trait、method、callable的英文`///`；enum struct-variant field无field-level`pub`。
8. Responsibility redlines保持runtime/tools、approval、method body/source、marketplace listing、provider route/cost和SDK client/cache外置。

## 7. Planned final audits

| Audit | Method / expected invariant |
|---|---|
| chapter structure | exactly one `## 1.` through `## 15.` in ascending order |
| calibration sources | at least one exact `05_test_plan_step_NN` link per chapter；§15 may aggregate |
| identity inventory | source sets TC/EVC/DS=189；formal family arithmetic and EV rule present |
| state inventory | only `638=239+98+301` current baseline；old304 illegal absent |
| automation | ten suite names、five gates、nine checks、four builders remain exact |
| evidence | fixed roots、same-run digest、pairing/no-static/redaction、no implicit run |
| failure branches | nonpass statuses、failed suite retention、old/new retest runs、no retry overwrite |
| acceptance | 37 AC/13 VF consumer contract；no decision/signature/result |
| Rustdoc | nested field/variant/payload requirement and enum-field visibility rule present |
| historical leakage | old object/TC/topology/threshold active references=0 |
| responsibility | forbidden ownership positive assertion=0 |
| Markdown | code fences paired；tables structurally reviewable |

## 8. Current assembly gate

| Criterion | Status |
|---|---|
| Steps 1~14 files exist | pass-designed `14/14` |
| flow authorizes Step 15 | yes |
| canonical inventory locked | yes |
| historical formal 05 disposition recorded | replace-only |
| unresolved upstream blocker | 0 |
| formal write authorized | completed；Batches A~C written |
| implementation/test/evidence/acceptance fact authorized | no |

## 9. Batch write and final audit results

### 9.1 Controlled write batches

| Batch | Formal range | Result | Truthfulness boundary |
|---|---|---|---|
| A | metadata + §§1~5 | completed；authority/scope/cuts/layers/traceability assembled | no execution or acceptance claim |
| B | §§6~10 | completed；189 case/data contracts、638 pairs、seven environments、10/5/9/4 automation and 20 NFR assembled | paths/scripts/environments remain future contracts |
| C1 | §§11~12 | completed；classification/severity/retest and future entry/exit assembled | no defect、run、fix or exit result |
| C2 | §13 | completed；189 EV contracts、raw/report schema、37 AC/13 VF consumers and retention assembled | contract identity does not create evidence instance |
| C3 | §§14~15 | completed；R0~R4、13 surfaces、12 full triggers、16 risks and references assembled | accepted risk/person/signature count remains 0 |

### 9.2 Final static design audit

| Audit | Result |
|---|---|
| chapter structure | pass-designed；exactly 15 numbered chapters in writing-standard order |
| calibration source blocks | pass-designed；15/15 chapters have exact Step source；§15 uses this assembly Step |
| canonical identity sources | pass-designed；Step 6 TC/EVC unique sets=`189/189`;Step 7 DS unique set=`189`；Step 13 uses 11 closed EV family ranges whose arithmetic=`189` |
| case/oracle branches | pass-designed；Command eight shared branches、Query no-write、Inbound header/receipt、Outbound A/B/C、Job frozen-plan/reentry and owner exact-row links retained |
| state and data | pass-designed；only active `638=239+98+301` baseline；old304 absent；12 deterministic primitives and isolation/cleanup retained |
| automation/evidence | pass-designed；10 suites、5 gates、9 checks、4 builders、fixed roots、same-run digest、redaction/pairing/no-static and failed-run retention retained |
| acceptance handoff | pass-designed；37/37 AC and 13/13 VF consumer directions；all remain `not_evaluated` |
| regression/risk | pass-designed；R0~R4、13 change surfaces、12 full triggers、16/16 risk rows；accepted=0 |
| Rustdoc | pass-designed；declaration、every struct field、enum variant/payload field、trait/method/callable English `///` and enum-field visibility rule locatable |
| historical/responsibility | pass-designed；old objects/topology/TC/threshold only in explicit historical/deny context；forbidden positive ownership=0 |
| truthfulness | pass-designed；implementation/run/artifact/report/digest/evidence alias/result/reviewer/signature/release fabrication=0 |
| Markdown | pass-designed；fences paired and tables reviewable |

这些`pass-designed`只描述文档静态闭合，不是测试通过、验收通过或实现完成。Mechanical grep不能展开Step 13的range notation，因此EV count以11个closed family range的算术与TC/EVC/DS一一转换规则审计，不以literal token count误判。

## 10. Step completion and downstream handoff

```text
document = 05-测试方案.md
step = 15
status = 05_completed_continuous_execution
formal_05_authority = active_design_baseline
canonical_tc_ds_ev = 189/189/189
state_pair_baseline = 638:239/98/301
test_execution_claimed = false
real_evidence_created = false
acceptance_decision_claimed = false
unresolved_upstream_blocker = none
next_allowed_action = initialize_06_acceptance_full_restart_flow
commit_required = no
```
