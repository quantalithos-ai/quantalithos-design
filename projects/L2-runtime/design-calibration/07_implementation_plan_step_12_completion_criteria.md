# Step 12. 实施完成判定校准

> 对应 SOP：standards/document/实施计划讨论流程_SOP.md Step 12
> 回填目标：正式 07-实施计划.md §12
> 状态：completed / pass-designed
> 事实边界：定义未来实现期完成谓词；当前实现仓不存在，所有执行、测试、artifact、report、evidence、verdict、signoff 和 readiness 均为 none/not_started。

## 1. 输入与判断原则

本步承接 Step 5 的 13 Phase、Step 6 的 39 boundary/117 IMPL/117 BATCH、Step 7 的 39 Gate/177 TC-EV/8 suites/9 checks、Step 8 的 13 slots/7 jobs/config snapshot、Step 9~11 的 blocker、回退、Commit/Handoff 纪律。完成判定必须区分 design handoff inventory、真实 implementation 和 formal 06 acceptance 三层。设计期只能得出 pass-designed，不能把它写成 implementation pass 或 acceptance verdict。

## 2. Canonical denominator

| 类别 | 当前固定值 | 完成时必须证明 |
|---|---:|---|
| Phase / boundary | 13 / 39 | 顺序、predecessor、successor、唯一 current |
| IMPL / BATCH / GATE | 117 / 117 / 39 | 连续、一一对应、无 orphan |
| CAP | 12 | owning service/flow/test mapping |
| Command / Query | 17 / 12 | DTO、service、facade、zero-write mapping |
| inbound / outbound Event | 6 / 6 | inbox/order/receipt 与 immutable outbox |
| Job | 7 | bounded lease/page/cursor/Unknown |
| State / UoW / replay | 31 / 7 / 6 | legal/illegal/stale/replay/Unknown |
| config / external slots | 15 slices / 13 slots | whole-candidate validation 与 snapshot |
| CUT / TC-EV | 37 / 172 raw + 5 aggregate = 177 | exact owner、selector、source、same-run status |
| suites / checks | 8 / 9 | identity、非空 selector、mandatory checks |
| AC / VF / NFR / EG | 36 / 8 / 19 / 18 | traceability；authority 仍在 formal 06 |

旧 12/35/105/4-check/109/12-suite 只作 historical_material。

## 3. Boundary 与 Phase 完成谓词

每个 boundary B 必须同时满足：

    B_complete =
      Activation ∧ Design ∧ Scope ∧ Worktree ∧ Build
      ∧ Test ∧ Evidence ∧ Commit ∧ Handoff

| 子项 | 实际条件 |
|---|---|
| Activation | 唯一 current、前驱 handoff、repo/worktree/baseline 已绑定 |
| Design | formal 03/04/05/06 与 Step 6/7 source 无 schema/state/flow gap |
| Scope | touched/staged 是 Allowed Scope 子集，无 successor 或用户改动 |
| Worktree | branch/HEAD/status/ownership 有真实记录 |
| Build | fmt/check/build/Rustdoc 有实际非空输出或 exact N/A |
| Test | owning selector 非空，negative/replay/Unknown/zero-write 切口闭合 |
| Evidence | raw/report/index/digest 同一 run 成对或 formal exact N/A |
| Commit | message、staged diff、local identity、record 完整 |
| Handoff | hash/message/post-status、baseline、blocker、next boundary、ledger 完整 |

### Phase exit

| Phase | Exit Gate | 特定闭合 |
|---|---|---|
| PH-01 Foundation & Vocabulary | GATE-03 | workspace/Core/language/name |
| PH-02 Local Consistency Kernel | GATE-06 | UoW/CAS/idempotency/inbox/outbox/lease/Unknown |
| PH-03 Runtime Loop Kernel | GATE-09 | activation、T1/T2/T3、wakeup/yield/reservation |
| PH-04 Admission, Run & Plan | GATE-12 | rejected zero-run、accepted-only、query zero-write |
| PH-05 Source, Context & Working Memory | GATE-15 | working-only、freshness、durable owner separation |
| PH-06 Provider-neutral Model | GATE-18 | two-UoW、stable identity、no retry、no provider secret |
| PH-07 Governed Action | GATE-21 | five-owner guard、record-before-call、zero-call |
| PH-08 Delegation, Feedback & Reflection | GATE-24 | subset/budget/depth、receipt-before-ACK、once-only |
| PH-09 Checkpoint & Recovery | GATE-27 | Prepared/Committed/Unknown、matching receipt、bounded resume |
| PH-10 Local Outcome & Handoff | GATE-30 | local-first、body-free、ACK/gap separation |
| PH-11 Projection, Events & Jobs | GATE-33 | history-only projection、immutable events/outbox |
| PH-12 Composition & Entry | GATE-36 | 15 slices、13 slots、7 jobs、facade-only |
| PH-13 Quality & Handoff Tooling | GATE-39 | fixed-run raw/report/index、9 checks、draft-only |

任一 boundary 未完成，Phase exit 不得通过；PH-11 只能消费 PH-04~10 committed truth。

## 4. Test、evidence 与 lane 条件

| Lane | 完成条件 | 不得写成 |
|---|---|---|
| local contract/domain/application | owning suites 非空，negative/fault matrix 闭合 | external positive readiness |
| ci_contract | 8 suites、9 checks、177 分母完整且失败保留 | static pass、空 selector |
| integration_candidate | 独立 fixed run 与 namespace | 与 local 或其他 run 拼接 |
| positive_qualification | owner contract、selected adapter/profile、真实 qualification、新 baseline | Candidate/BlockedAdapter/目录存在 |
| acceptance draft | 四份 draft/review_required | verdict/signoff/release/readiness |

177 项 disposition 只能由 raw/report/check 机械导出为 eligible、ineligible、unavailable 或 invalid。not_evaluable 不等于 not_triggered；blocked dependency 不计 pass。

## 5. 实施完成谓词

### 5.1 implementation_complete_handoff_ready

必须全部满足：

1. 39 boundary 均有真实 Commit Gate 和 Handoff Gate；
2. 13 Phase exit Gate 无 pending、blocked 或 not_run；
3. 37 CUT、177 TC-EV、8 suites、9 checks 分母完整；
4. raw/report/index/EV 同一 fixed run 且 digest 匹配；
5. forbidden material、owner takeover、fail-open、Unknown retry、non-Core compile dependency、fake leak 均为零；
6. 15 config slices、13 slots、7 jobs whole-candidate 通过，snapshot immutable；
7. project ledger、39 boundary ledger、commit/handoff record 可恢复；
8. acceptance outputs 仅 review_required，无 verdict/signoff/readiness；
9. external positive lane 有真实 qualification，或显式 blocked_dependency 且不隐藏；
10. 无 implementation agent 自行接受的 residual。

### 5.2 implementation_complete_with_accepted_residual

只有 formal 06 authority 产生真实、matching、可追溯 residual authorization，且 hard/P0/evidence/redline 全满足时才可使用。当前没有此 authorization。

### 5.3 implementation_incomplete

以下任一项即 incomplete：

- repo、immutable baseline、Core compatibility 或 git identity 未绑定；
- 任一 boundary 未有真实 handoff；
- selector 空/过滤，raw/report/index 缺失、跨 run 或静态；
- mandatory check 缺失/失败；
- P0/VF/secret/body/owner/fail-open/Unknown/non-Core/fake 红线触发；
- external positive pending 却写成 ready；
- acceptance draft 未 review，或 verdict/signoff 未由 authority 产生；
- numeric SLO authority 未绑定却声称 numeric pass；
- formal design drift 没有新 baseline 和 affected rerun。

当前实施层结论固定为 implementation_incomplete / not_started。

## 6. 不可伪造的完成证据

| 证据 | 来源 | 当前 |
|---|---|---|
| boundary commit record | implementation ledger + git | none |
| build/test raw | target repo commands | none |
| run manifest | fixed-run runner | not_generated |
| suite report | same-run generator | not_generated |
| evidence index | mechanical derivation | not_generated |
| acceptance drafts | handoff generator | not_generated |
| verdict/signoff | formal 06 authority | not_entered |

文件存在、设计文本、计划路径、TestFake、ACK、health ping、用户口头确认都不是证据。

## 7. 失败与再判定

失败时保留失败 run/raw/report/journal；按 Step 10 选择 current 和 earliest affected boundary；设计变化回 owning formal doc 并生成新 baseline；实现缺陷只在 current boundary fix-forward 或新 fix boundary；新 run 覆盖完整适用分母且不得跨 run 取优；重新执行 Phase exit、Commit/Handoff 和 ledger 迁移，不修改旧失败事实。

## 8. 设计期审计结果

| 检查 | 结果 |
|---|---|
| 13/39/117/117/39 identity | pass-designed |
| 31 state、7 UoW、6 replay、15 config、13 slots、7 jobs | pass-designed |
| 37 CUT、177 TC-EV、8 suites、9 checks | pass-designed |
| 13 Phase exit Gate | pass-designed |
| design/implementation/acceptance 分层 | pass-designed |
| external blocker、fake、Unknown、evidence ceiling | pass-designed |
| actual implementation/run/artifact/report/evidence/verdict/signoff/readiness | none / not_started |

## 9. 回填草稿与 Step 13 进入条件

正式 §12 只回填 denominator、boundary/phase predicate、lane distinction、incomplete rules 和 evidence ceiling。进入 Step 13 前必须：Step 12 completed / pass-designed；flow/project ledger 原子推进到 Step 13；Step 13 只删除并重建正式 07、implementation_execution_ledger 和 39 skeleton；commit-01-a 保持 blocked（target repo absent、baseline not_bound、Core unverified、binary identities unresolved）；不创建实现仓、不写代码、不运行实现测试、不提交。
