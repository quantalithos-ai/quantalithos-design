# Step 12. 定义实施完成判定

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 12；回填位置：正式 `07-实施计划.md` §12。\
> 日期：2026-09-14；模式：`full-restart / single-agent-serial / continuous_authorization`。\
> 本产物定义未来“实施完成并可送验”的门禁；它不执行验收，也不填写正式 06 的三值 verdict、risk acceptance、signoff 或 readiness。

## 1. Step 状态与开工确认

| 项 | 结论 |
|---|---|
| 当前 Step | Step 12：实施完成判定 |
| 输入 | Step 2 范围；Step 4 交付物；Step 6 boundary；Step 7 门禁；Step 9 风险；Step 11 纪律；正式 `06` §4～§14 |
| 输出 | completion gate、闭环审计、证据交付、未完成项处理、当前事实判定 |
| 当前状态 | `completed / future_criteria_closed_current_implementation_not_entered / continue_authorized` |
| 当前实施结论 | `not_entered / blocked / not_ready_for_acceptance`；不是正式验收“不通过” verdict |
| 当前实例 | 实现/commit/run/artifact/report/EV/review/verdict/signoff/readiness 均为 0 |
| formal 07 | Step 13 前仍不存在；本 Step 不创建 |
| 下一动作 | `create_and_complete_step_13_formal_document_assembly` |

## 2. SOP 问题回答

| 问题 | 回答与取舍 |
|---|---|
| P0 需求覆盖如何判定 | 以正式 `00` 的 A1～A9/F/BR/NFR、Step 2 P0 范围和正式 `06` 的 9 FUNC、12 RL、34 protocol-sync、27 state-consistency、8 NFR、10 EVID、10 VETO 为分母；16 boundary 必须逐项实现和验证。 |
| 交付物是否全部完成 | 以 Step 4 的六 role、26 objects、8 services、7 port families、30 logical/32 method surfaces、18 states、8 source classes、12 config domains/55 keys、13 suites/14 scripts/19 EV 为清单；planned skeleton 不计交付。 |
| 测试/验收门禁如何处理 | 102 unique TC、13 suites、5 gates 的 required P0 必须在 fixed run qualified；19 EV 和 acceptance package 完整并经 review。P0 blocked/not_run/infra/failed 均不能被风险接受。 |
| Spike/风险/待确认如何关闭 | 12 Spike 必须产生指定输出并正式采纳或有明确取消依据；18 blocker/pending 必须按 owner 关闭；9 个 open question 在各自 Gate 前形成正式决定。 |
| VETO 如何处理 | `VETO-AR-001～010` 必须全部有证据 `not_triggered`；任一 `triggered` 或 `undetermined` 都不允许实施完成/送验。 |
| 未完成项如何分类 | required P0、VETO/S、设计闭环、evidence authenticity 缺口只能 blocker；真正非范围 P1/P2/future 可延期；eligible residual 才可能由正式 06 风险接受，Archive 不自批。 |
| report 如何生成 | `reports/runs/<run_id>` 只能从同一 `artifacts/test/<run_id>` raw 只读生成；raw 不能替人读报告，`latest` 和跨 run 拼接禁止。 |
| acceptance 四件套如何处理 | `handoff/veto-checklist/risk-acceptance/open-issues` 必须来自 fixed package 并具名审查；脚本草稿不等 review/verdict/signoff。 |
| redaction/link 如何处理 | redaction、dependency、report-audit、link/digest/pairing 均为 required evidence gate；任一不满足即不可送验。 |
| 设计闭环冲突如何处理 | 字段、DTO、状态、support type、port、UoW、idempotency、source/material、effect、phase/boundary 任一未闭合即 wait_design，不能宣称实施完成。 |
| 交付前可落码审计如何处理 | 对 8 Phase/16 boundary 逐项复核正式 03/05/06/07；结论只允许 pass/not_applicable/blocker，修复必须有新 design baseline。 |

## 3. “实施完成”与“正式验收”边界

```text
all 16 boundary handoff gates complete
        + fixed-run test/evidence package complete
        + no design/blocker/VETO gap
                         |
                         v
implementation_complete / ready_for_acceptance_review
                         |
                         v
formal 06 acceptance process and authorized signoff
                         |
                         v
通过 | 有条件通过 | 不通过
```

实施计划只能判定“实施是否完整、是否具备送验输入”。它不能替验收负责人填写 `通过/有条件通过/不通过`，也不能从 `Accepted`、`Sealed`、`Verified`、`Committed`、`HandoffComplete` 或 item `Succeeded` 推导 project restored、release 或 production readiness。

## 4. Future implementation completion gate

| 判定项 | 必要标准 | 未来证据 | 当前结论 |
|---|---|---|---|
| immutable baseline | design/source/config/target/build baseline 完整、未漂移，正式 07 与 16 ledger 一致 | project/boundary ledgers、真实 design/implementation commits | absent / blocked |
| P0 scope coverage | A1～A9 与 P0 F/BR/NFR 均映射到实际 boundary，无未授权 scope | trace matrix、diff/review、delivery index | not_implemented |
| six-role delivery | 6 crates、26 objects、8 services、7 port families、30/32 surfaces、18 states 已按正式 03 实现 | build/doc/review/contract reports | absent |
| source authority | 8 source class 逐 owner contract/version/fence/coverage/material 通过；workspace=`Auxiliary` | conformance manifest + AUTHORITY EV | blocked by upstream |
| Archive-owned truth | request/job/bundle/manifest/assessment/storage/local lifecycle/restore plan/handoff records 守边界 | object/state/UoW/review evidence | absent |
| owner zero-write | Archive 不反写 L1/workspace/artifact/observability truth，不决定 governance/project state | spy/dependency/formal seam evidence | untested |
| Query no-write | Q01～Q05 telemetry on/off 均不写、不 effect、不 repair/cache/probe | QUERY/OBSERVE/SECURITY same-run EV | untested |
| consistency/effects | UoW/CAS/read-set/fence/idempotency/intent-before-effect/unknown/probe/compensation 完整 | UOW/IDEMP/EFFECT/RESTORE EV | blocked / absent |
| config/dependency | 12 domains/55 P0 keys strict；actual graph 只含经核验 Core compile edge；无 fake/outbound 偷渡 | CONFIG/DEPENDENCY EV、binding manifest | blocked |
| boundary delivery | 16/16 boundary 的 Design→Handoff Gate 全有真实证据和 commit record | boundary ledgers、git/review records | 0/16 |
| test gates | 102 unique TC、13 suites、5 gates required P0 qualified，failure history保留 | `artifacts/test/<run_id>` + run reports | no run |
| evidence integrity | 19 EV、same-run digest/link/redaction/dependency/report audits 全通过 | `reports/runs/<run_id>` | absent |
| VETO | 10/10 有 qualified source 且 `not_triggered` | reviewed veto checklist | undetermined / no instance |
| blockers/defects | 18 blocker/pending 全关闭；S=0；A disposition 合规 | closure refs、defect/open-issues reports | blockers open |
| reviewed handoff | acceptance 四件套与 review notes 完整，不反写 raw | `reports/acceptance/*`、`reports/review/*` | absent |
| authorization | 用户/正式角色允许提交、handoff 和进入验收 | project ledger/decision ref | implementation not authorized |

全部 required 行满足，方可标 `implementation_complete / ready_for_acceptance_review`。不能通过平均、百分比或“核心完成”绕过任一 required 行。

## 5. 交付实现前可落码闭环审计

以下是每个 boundary activation 与最终交付前必须实际复核的清单。当前“设计层映射完成”不等于执行期 `pass`，修复 baseline 均为 `pending`。

| Phase / boundary | 复核正式范围 `03/05/06/07` | 适用闭环重点 | 当前设计判定 | blocker / future repair baseline |
|---|---|---|---|---|
| PH-01 / 01-a | crate/path/dependency + DEPENDENCY + RL/VETO | package/symbol/path baseline、依赖分类 | mapped / blocked | repo/Core/`AR-ARCH-001`; baseline pending |
| PH-01 / 01-b | config/runtime/evidence shell + CONFIG/REPORT | 55-key schema、slot、writer/reader/path | mapped / blocked | LOCAL-004/005、repo；baseline pending |
| PH-02 / 02-a | C01/C02 DTO/domain/state + CONTRACT/OBJECT/COMMAND | 字段/DTO/factory/initial state/ref source | mapped / blocked | LOCAL-001/006；baseline pending |
| PH-02 / 02-b | UoW/CAS/result/replay/fence + UOW/IDEMP | repository surface、atomicity、unknown、parity | mapped / blocked | LOCAL-001/003/006；baseline pending |
| PH-03 / 03-a | five Query/view/visibility + QUERY/OBSERVE | view construction、visibility、zero-write | mapped / blocked | LOCAL-002/005、owner visibility；baseline pending |
| PH-03 / 03-b | cursor/continuation/redaction + SECURITY | mapping key、tamper/restart、no disclosure | mapped / blocked | LOCAL-002、key/authority；baseline pending |
| PH-04 / 04-a | 8 source bindings/capture + AUTHORITY/CONSUMER/JOB | source/material/fence/coverage、Auxiliary | mapped / blocked | UP-001/006/007/008；baseline pending |
| PH-04 / 04-b | manifest exact closure/seal + STATE/UOW | immutable revision、declared=actual、read-set | mapped / blocked | UP-001/006/008、durable；baseline pending |
| PH-05 / 05-a | assessment DTO/target/finding/Q03 schema | target exhaustive、support carrier、failure posture | mapped / blocked | UP-004；baseline pending |
| PH-05 / 05-b | assessment capability/UoW/replay/Q03 | fixed input、typed outcome、immutable save/get | mapped / blocked | UP-004、LOCAL-003/004；baseline pending |
| PH-06 / 06-a | placement/retrieval/effect/probe | intent/key/outcome/finality/reconcile | mapped / blocked | UP-005、LOCAL-003；baseline pending |
| PH-06 / 06-b | decision/hold/lifecycle effect | executable decision/currentness/zero effect | mapped / blocked | UP-002/003/005；baseline pending |
| PH-07 / 07-a | restore owner set/plan/item/eligibility | exact owner set、mapping drift、immutable revision | mapped / blocked | UP-004/006/009；baseline pending |
| PH-07 / 07-b | material/receiver/handoff/outcome/compensation | authority、intent-first、partial/unknown/isolation | mapped / blocked | UP-006/007/009；baseline pending |
| PH-08 / 08-a | artifact/report/schema/scripts | raw-first、canonical digest、redaction/link/no-static | mapped / blocked | LOCAL-005、repo/schema；baseline pending |
| PH-08 / 08-b | all TC/EV/VETO/acceptance handoff | denominator、same-run、review、no new business | mapped / correctly blocked | all blockers + no run/reviewer；baseline pending |

实施时每行必须改为基于真实 baseline 的 `pass/not_applicable/blocker` 并附 evidence；任何 `blocker` 行禁止 Handoff Gate。

## 6. 交付证据完成表

| 交付证据项 | 固定路径 / 标识 | 完成标准 | 当前 |
|---|---|---|---|
| raw artifacts | `artifacts/test/<run_id>/` | context、index、13 suite raw/report、stdout/stderr/cases/artifacts 完整；失败历史保留 | absent |
| run reports | `reports/runs/<run_id>/` | summary、gate-results、evidence-index、redaction、dependency、report-audit、blocked-lanes、suite pages | absent |
| EV registry | 19 `EV-AR-*` family instances | exact TC/AC/VETO/raw/report/digest/proof/limitation，同 run、无 orphan/duplicate | absent |
| acceptance handoff | `reports/acceptance/handoff.md` | fixed package、scope、baseline、limitations/open issues 且具名 review | absent |
| veto checklist | `reports/acceptance/veto-checklist.md` | 10 项均有 qualified source 和非默认 posture，具名 review | absent |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 仅 eligible residual；owner/acceptor/basis/action/deadline/re-entry 完整 | absent；0 instance |
| open issues | `reports/acceptance/open-issues.md` | defect/blocker 分级、failed/fixed run、closure/residual 明确 | absent |
| reviewer notes | `reports/review/{reviewer-notes.md,agent-review.md}` | identity/role/time/baseline/run/scope，且不改 raw/status | absent |
| boundary handoff | 16 boundary ledgers | actual hash/message/checks/blockers/next/user changes protected | absent |

## 7. 完成结果值域

| 实施结果 | 条件 | 是否可送验 | 与正式 06 的关系 |
|---|---|---|---|
| `not_entered` | 无实施授权/目标仓/baseline/current boundary activation | 否 | 不制造一次“不通过”验收 |
| `in_progress` | 已激活且至少一 boundary 在实现/门禁中 | 否 | 不产生三值 verdict |
| `blocked` | 任一 required design/dependency/P0/evidence blocker 未关闭 | 否 | 验收保持 not_entered 或 paused |
| `implementation_complete` | 表 4/5/6 全部 required 条件满足、16 Handoff Gate 完成 | 是，可提交验收 review | 只是送验输入，不等于“通过” |
| `superseded` | baseline/scope 已被新正式版本取代 | 否 | 旧 run/report/signoff 不支撑新范围 |

禁止值：`basically_complete`、`mostly_done`、`ready_enough`、`local_pass_means_ready`。正式 06 的 `通过/有条件通过/不通过` 不能写入 implementation ledger 的完成值域。

## 8. 未完成项处理矩阵

| 未完成类型 | 处置 | 是否允许 `implementation_complete` |
|---|---|---|
| 任一 P0 contract/object/service/entry/state/config 缺失 | blocker；补实现与所有相关 Gate | 否 |
| owner source/material/governance/storage/integrity/receiver formal seam 缺失 | blocker；回 owning project，formal positive 不降级 | 否 |
| required P0 TC/suite/gate failed/blocked/infra/not_run | 保留姿态；修复/解阻后新 run | 否 |
| VETO triggered 或 undetermined | triggered 建 S；undetermined 补 source；都不可接受 | 否 |
| S 级或涉及 owner truth/security/finality/evidence 的 A 级 | 修复与全量回归；禁止风险接受 | 否 |
| 设计字段/DTO/state/port/phase conflict | `wait_design`，新 baseline 后重审 | 否 |
| raw/report/EV 缺失、泄漏、静态、跨 run、digest/link不符 | 整包无效；从真实 raw 新建/重建 | 否 |
| eligible B/R 或严格界定 A residual | 由正式验收 authority 单项处理；实施端只记录 | 只有表4其他条件全满足且 06允许时才可能进入送验，不由07自判 |
| P1 selected provider/SDK/product 未纳入本轮 | future/deferred，明确 owner/trigger，不计 P0 pass | 是，但不得声称该 P1 通过 |
| P2 workload/long-run/DR 无 authority | `blocked/not_run` measured lane，保持无数值结论 | 仅当正式 P0 scope明确排除；不得声称性能/readiness |
| 文案或非语义 follow-up | documented deferred item；证明不改 contract/gate | 可，但须明确依据 |

当前 18 个持续 blocker/pending 均影响 required P0 或其正式证明，全部“不可接受”；不能被归类为普通 residual 来宣称完成。

## 9. 最终交付清单

| 交付族 | 完成内容 | 未来验收证据 |
|---|---|---|
| implementation baseline | target repo、六 role workspace、Core graph、16 commits/ledgers | dependency/build + commit/handoff records |
| Archive local truth | request/job/bundle/manifest/assessment/placement/lifecycle/restore plan/handoff records | CONTRACT/OBJECT/STATE/UOW/IDEMP EV |
| application surfaces | 8 services、3C/5Q/5E/17J、7 port families | COMMAND/QUERY/CONSUMER/JOB/EFFECT/RESTORE EV |
| authority and boundaries | 8 sources、owner zero-write、workspace Auxiliary、no outbound | AUTHORITY/DEPENDENCY/SECURITY EV |
| config/runtime | 12 domains/55 P0 keys、6 profiles、required slots/fakes boundaries | CONFIG EV |
| tests/scripts | 18 CUT、102 TC、26 DS、13 suites、5 gates、14 scripts | same-run raw + suite/gate reports |
| evidence/handoff | 19 EV、run reports、acceptance four files、review notes | EVID-001～010 package |
| design closure | 16-row pre-coding/final audit，无 blocker | reviewed closure report/ledger refs |

## 10. 当前事实判定

| 项 | 当前值 | 依据 |
|---|---|---|
| formal 00～06 | `formal / stop_review` | 设计文档已完成；不代表实现 |
| formal 07 | absent until Step 13 | 本 Step 尚未装配 |
| implementation process | `not_entered` | 用户只授权设计；目标仓未创建/核验 |
| current implementation boundary | none active | skeleton 尚待 Step 13 创建且只 planned/blocked/waiting |
| completed boundaries | 0/16 | 无 code、Gate 或 commit evidence |
| actual tests / evidence | 0 | 无 run/artifact/report/EV |
| blockers | 18 open + repo/baseline/authorization absent | Step 9 截止矩阵 |
| acceptance | `not_entered`; verdict absent | 无 delivery/env/data/run/package/review |
| risk acceptance / signoff / readiness | 0 / 0 / 0 | 禁止预填 |
| implementation completion | `not_entered / blocked / not_ready_for_acceptance` | 表 4 required 条件均未满足 |

## 11. 回填草稿、自检与进入 Step 13 条件

正式 `07` §12 应保留：实施/验收边界、future completion gate、16 boundary 闭环审计、固定证据表、结果值域、未完成处理、最终清单和当前事实。不得把表中 future 标准写成已通过，不得预填三值 verdict。

| 审计项 | 结论 |
|---|---|
| P0范围、交付物、测试、风险和交付纪律是否全部进入判定 | 通过（计划层） |
| 16 boundary 是否都有交付前闭环审计入口 | 通过；执行结论仍 blocked/pending |
| raw/report/EV/review 是否分层且 fixed-run | 通过（规则层）；实例为 0 |
| VETO/S/P0 blocker 是否不可风险接受 | 通过 |
| `implementation_complete` 是否与正式 06 verdict 分离 | 通过 |
| 当前状态是否如实为 not_entered/blocked | 是 |
| 是否可以进入 Step 13 正式装配 | 是；仅装配设计、ledger/skeleton，不实施 |

- [x] 完成判定可审查，不使用“基本完成”。
- [x] 未完成项均有 blocker/deferred/residual 规则，18 个当前 blocker 未被接受。
- [x] 交付证据必须从真实 raw 生成并具名 review，静态材料不能替代。
- [x] 当前不生成 implementation/acceptance 成功事实。

`gate_status = pass_at_design_level_current_implementation_not_entered`；`next_allowed_action = create_and_complete_step_13_formal_document_assembly`。
