# Step 11. 提交、评审与交付纪律校准

> 对应 SOP：standards/document/实施计划讨论流程_SOP.md Step 11
> 回填目标：正式 07-实施计划.md §11
> 状态：completed / pass-designed
> 事实边界：本文件定义未来实现仓的 commit/review/handoff 合同；当前没有目标仓、提交、hash、run、artifact、report、evidence、verdict、signoff 或 readiness。

## 1. 本步输入、诊断与取舍

本步读取 Step 5~10、实施计划 SOP/书写规范、代码实施台账与门禁规范、正式 03/04/05/06。旧 35 boundary 版本只作 historical_material。当前唯一集合为 13 Phase、39 canonical boundary、117 IMPL、117 BATCH、39 GATE。采用“一 boundary 一 commit、三 batch 编写切片、九子门禁、停审后推进”的粒度；不按 crate、文件或 agent 拆提交。

## 2. 稳定身份与提交不变量

| 规则 | 当前合同 |
|---|---|
| boundary identity | commit-01-a 至 commit-13-c，按 Phase 顺序唯一且连续 |
| task/batch | 每 boundary 恰好 3 个 IMPL 与 3 个同号 BATCH，共 117/117 |
| gate | 每 boundary 恰好一个 GATE-01~39，共 39；Gate 是 lookup，不是设计期 pass |
| commit unit | 一个实际 commit 只覆盖一个 boundary；三个 batch 最终属于同一可审查增量 |
| scope | staged/touched set 必须是 current skeleton Allowed Scope 子集；不得含 successor、用户改动或无关文件 |
| size | 单 batch 目标不超过 300 行；core source+test 超过 500 行必须暂停并重切 |
| successor | 只有 Commit Gate 与 Handoff Gate 实际闭合且项目 ledger 显式推进，才可把 successor 置为 current |
| fact ceiling | planned、pass-designed、blocked、not_run、not_generated 不得写成 actual pass/readiness |

## 3. Canonical boundary -> IMPL/BATCH/GATE/message 映射

| Boundary | Phase | IMPL | BATCH | Gate | Planned title | Body groups | Increment |
|---|---|---|---|---|---|---|---|
| commit-01-a | PH-01 Foundation & Vocabulary | IMPL-01-01~03 | BATCH-01-01~03 | GATE-01 | chore(workspace): add runtime workspace skeleton | Workspace and member layout; Dependency and naming boundary | workspace skeleton |
| commit-01-b | PH-01 Foundation & Vocabulary | IMPL-01-04~06 | BATCH-01-04~06 | GATE-02 | feat(contracts): add runtime vocabulary contracts | Typed runtime references; Metadata and digest contracts | shared vocabulary |
| commit-01-c | PH-01 Foundation & Vocabulary | IMPL-01-07~09 | BATCH-01-07~09 | GATE-03 | feat(contracts): add runtime reason and operation context | Reason and error carriers; Deterministic operation context | reason and operation context |
| commit-02-a | PH-02 Local Consistency Kernel | IMPL-02-01~03 | BATCH-02-01~03 | GATE-04 | feat(application): define runtime port contracts | Repository and external Ports; Version, cursor and visibility contracts | method-level Ports |
| commit-02-b | PH-02 Local Consistency Kernel | IMPL-02-04~06 | BATCH-02-04~06 | GATE-05 | feat(infra): add deterministic consistency stores | Atomic local stores; Idempotency and replay parity | local stores and UoW |
| commit-02-c | PH-02 Local Consistency Kernel | IMPL-02-07~09 | BATCH-02-07~09 | GATE-06 | test(consistency): add runtime fault and lease kernel | Unknown and lease fault parity; Transaction and projection journals | Unknown, lease and page kernel |
| commit-03-a | PH-03 Runtime Loop Kernel | IMPL-03-01~03 | BATCH-03-01~03 | GATE-07 | feat(domain): add runtime loop kernel state | Loop cursor and activation contracts; Snapshot and step reservation | loop cursor, snapshot and activation |
| commit-03-b | PH-03 Runtime Loop Kernel | IMPL-03-04~06 | BATCH-03-04~06 | GATE-08 | feat(application): coordinate runtime loop wakeups | Continuation and yield state; Wakeup and reservation fencing | wakeup, continuation and yield |
| commit-03-c | PH-03 Runtime Loop Kernel | IMPL-03-07~09 | BATCH-03-07~09 | GATE-09 | feat(application): run the closed runtime loop | Next-operation planner; T1/T2/T3 execution protocol | closed planner and T1/T2/T3 |
| commit-04-a | PH-04 Admission, Run & Plan | IMPL-04-01~03 | BATCH-04-01~03 | GATE-10 | feat(domain): add admission run and plan state | Admission and run contracts; Plan history and state guards | admission, run and plan domain |
| commit-04-b | PH-04 Admission, Run & Plan | IMPL-04-04~06 | BATCH-04-04~06 | GATE-11 | feat(application): orchestrate accepted runtime admission | Accepted admission flow; Controlled run mutation | accepted-only admission and control |
| commit-04-c | PH-04 Admission, Run & Plan | IMPL-04-07~09 | BATCH-04-07~09 | GATE-12 | feat(api): expose runtime progress and plan queries | Progress evaluation service; Visible run and plan entries | progress, history and queries |
| commit-05-a | PH-05 Source, Context & Working Memory | IMPL-05-01~03 | BATCH-05-01~03 | GATE-13 | feat(domain): add source and context composition state | Source snapshot contracts; Context composition state | source and context state |
| commit-05-b | PH-05 Source, Context & Working Memory | IMPL-05-04~06 | BATCH-05-04~06 | GATE-14 | feat(application): compose working memory | Working memory mediation; Composition and use recording | working memory mediation |
| commit-05-c | PH-05 Source, Context & Working Memory | IMPL-05-07~09 | BATCH-05-07~09 | GATE-15 | feat(worker): maintain source and working memory | Source change consumption; Bounded refresh and compaction jobs | source consumers and maintenance |
| commit-06-a | PH-06 Provider-neutral Model | IMPL-06-01~03 | BATCH-06-01~03 | GATE-16 | feat(domain): add provider-neutral model state | Model turn contracts; Semantic decision state | model intent, turn and result state |
| commit-06-b | PH-06 Provider-neutral Model | IMPL-06-04~06 | BATCH-06-04~06 | GATE-17 | feat(application): orchestrate model turn submission | Record-before-call flow; Blocked and Unknown adapter posture | two-UoW model submission |
| commit-06-c | PH-06 Provider-neutral Model | IMPL-06-07~09 | BATCH-06-07~09 | GATE-18 | feat(worker): classify model results safely | Result classification service; Model event and query mapping | result classification and safe summary |
| commit-07-a | PH-07 Governed Action | IMPL-07-01~03 | BATCH-07-01~03 | GATE-19 | feat(domain): add governed action state | Action and guard contracts; Submission and effect state | action choice, guard and attempt state |
| commit-07-b | PH-07 Governed Action | IMPL-07-04~06 | BATCH-07-04~06 | GATE-20 | feat(application): evaluate governed action guards | Five-owner preconditions; Fail-closed action evaluation | five-owner guard evaluation |
| commit-07-c | PH-07 Governed Action | IMPL-07-07~09 | BATCH-07-07~09 | GATE-21 | feat(application): record action submission attempts | Stable submission attempts; Unknown fencing and safe projection | record-before-call submission |
| commit-08-a | PH-08 Delegation, Feedback & Reflection | IMPL-08-01~03 | BATCH-08-01~03 | GATE-22 | feat(domain): add bounded delegation state | Child context boundaries; Delegation request state | child boundary, budget and request |
| commit-08-b | PH-08 Delegation, Feedback & Reflection | IMPL-08-04~06 | BATCH-08-04~06 | GATE-23 | feat(application): orchestrate bounded delegation | Delegation proposal and receipt; Once-only result incorporation | result receipt and once-only incorporation |
| commit-08-c | PH-08 Delegation, Feedback & Reflection | IMPL-08-07~09 | BATCH-08-07~09 | GATE-24 | feat(worker): incorporate feedback safely | Feedback ordering and receipts; Reflection and recovery triggers | feedback ordering and reflection |
| commit-09-a | PH-09 Checkpoint & Recovery | IMPL-09-01~03 | BATCH-09-01~03 | GATE-25 | feat(domain): add checkpoint preparation state | Stable checkpoint candidates; Preparation guards and fences | checkpoint candidate and Prepared state |
| commit-09-b | PH-09 Checkpoint & Recovery | IMPL-09-04~06 | BATCH-09-04~06 | GATE-26 | feat(application): coordinate checkpoint recovery | Commit receipt posture; Recovery decision fencing | matching receipt and recovery decision |
| commit-09-c | PH-09 Checkpoint & Recovery | IMPL-09-07~09 | BATCH-09-07~09 | GATE-27 | feat(jobs): resume and reconcile runtime recovery | Recovery continuation entry; Bounded resume and reconcile jobs | bounded resume and reconcile jobs |
| commit-10-a | PH-10 Local Outcome & Handoff | IMPL-10-01~03 | BATCH-10-01~03 | GATE-28 | feat(application): finalize local runtime outcomes | Terminal proof and outcome; Local-first query and event | terminal proof and local outcome |
| commit-10-b | PH-10 Local Outcome & Handoff | IMPL-10-04~06 | BATCH-10-04~06 | GATE-29 | feat(application): create safe handoff candidates | Body-free handoff material; Attempt, gap and query state | safe handoff material and gap |
| commit-10-c | PH-10 Local Outcome & Handoff | IMPL-10-07~09 | BATCH-10-07~09 | GATE-30 | feat(worker): reconcile handoff acknowledgements | Verified acknowledgement receipts; Bounded gap reconciliation | acknowledgement and gap reconciliation |
| commit-11-a | PH-11 Projection, Events & Jobs | IMPL-11-01~03 | BATCH-11-01~03 | GATE-31 | feat(application): rebuild safe runtime projections | Projection state and query; Bounded history rebuild | history-only projection and rebuild |
| commit-11-b | PH-11 Projection, Events & Jobs | IMPL-11-04~06 | BATCH-11-04~06 | GATE-32 | feat(worker): materialize runtime change events | Owner change consumption; Immutable fact and decision events | invalidation and immutable events |
| commit-11-c | PH-11 Projection, Events & Jobs | IMPL-11-07~09 | BATCH-11-07~09 | GATE-33 | feat(jobs): publish immutable runtime outbox | Exact outbox publication; Publisher cursor and Unknown posture | immutable outbox publisher |
| commit-12-a | PH-12 Composition & Entry | IMPL-12-01~03 | BATCH-12-01~03 | GATE-34 | feat(config): add strict runtime configuration | Typed configuration candidates; Slot, job and snapshot validation | strict configuration snapshot |
| commit-12-b | PH-12 Composition & Entry | IMPL-12-04~06 | BATCH-12-04~06 | GATE-35 | feat(infra): assemble runtime component graph | Runtime composition root; Controlled adapter posture | composition root and adapter posture |
| commit-12-c | PH-12 Composition & Entry | IMPL-12-07~09 | BATCH-12-07~09 | GATE-36 | feat(entry): expose runtime facade boundaries | API and worker entries; Job runners and denominator checks | facade-only entries |
| commit-13-a | PH-13 Quality & Handoff Tooling | IMPL-13-01~03 | BATCH-13-01~03 | GATE-37 | test(gates): add runtime suite manifests and runners | Case and suite manifests; Run-scoped raw artifacts | manifests and raw runners |
| commit-13-b | PH-13 Quality & Handoff Tooling | IMPL-13-04~06 | BATCH-13-04~06 | GATE-38 | feat(reports): derive runtime evidence candidates | Mandatory integrity checks; Reports and evidence derivation | nine checks and evidence derivation |
| commit-13-c | PH-13 Quality & Handoff Tooling | IMPL-13-07~09 | BATCH-13-07~09 | GATE-39 | chore(handoff): add runtime acceptance review drafts | Full local gate aggregation; Review-required acceptance drafts | local aggregation and review drafts |

标题和 body 只是 planned intent。真实提交前必须根据 staged diff 收窄文件名和 delta，不能扩大 boundary。

## 4. Message、语言与 Git 纪律

| 项目 | 要求 |
|---|---|
| local identity | 只在目标实现仓使用 repo-local user.name/user.email；禁止改 global |
| title | English type(scope): subject；scope 与 current capability 相符 |
| body | 第一段一句英文 boundary summary；只使用本表两组 body heading，列 basename 和 approximate delta |
| footer | 实际使用 AI 时，真实空行后写 Co-Authored-By: Codex <noreply@openai.com> |
| execution | message 写入文件后使用 git commit -F；未获授权不得 amend、reset、history rewrite |
| source language | implementation Rust identifier/Rustdoc/comment/test name 默认 English；formal 03 与 coding/rust.md 冲突期间受 L2R-LANG-002 影响的 boundary blocked |
| design-repo exception | 若未来明确授权提交设计仓，遵循设计仓既有 message 规则；本轮不提交 |

禁止 wip、update、stuff、只写 boundary ID、无 scope、混合多个 boundary、pending/blocked Gate 下提交。

## 5. 九个实现子门禁

| 子门禁 | 实际通过条件 | 失败动作 |
|---|---|---|
| Activation | project ledger 唯一 current、前驱 Handoff pass、target repo/worktree/baseline 已绑定 | blocked / wait_design |
| Design | Required Reads 完成；正式 03/04/05/06 与 07 boundary 闭合；无 schema/state/flow gap | 回 owning formal doc，new baseline |
| Scope | staged/touched 是 Allowed Scope 子集；无 successor、无用户改动；一 boundary 一句增量 | blocked / fix_gate_failure |
| Worktree | branch/HEAD/status/ownership 初始和当前真实记录 | 停止并交接重叠改动 |
| Build | applicable fmt/check/build/Rustdoc 实际非空输出，或 formal exact N/A | blocked / fix_gate_failure |
| Test | owning selector 非空，负向/Unknown/replay/zero-write 切口覆盖；不以空筛选通过 | blocked / fix_gate_failure |
| Evidence | applicable raw/report/status/digest 同 run 成对；PH-01~12 可为真实 not_applicable，PH-13 才生成工具产物 | invalid / unavailable；保留失败 |
| Commit | message、staged set、diff size、local identity、footer 和 predecessor 条件闭合 | 不提交，修 gate |
| Handoff | hash/message/post-status、baseline、blocker、user changes、next boundary 与 ledger 回写齐全 | 不推进 successor |

设计期所有 39 Gate 的实际状态为 not_run；唯一 current commit-01-a 为 blocked / wait_design，其余 planned / wait_until_current。

## 6. 评审维度与 stop-review

| 维度 | 评审问题 | 失败动作 |
|---|---|---|
| design | fields/DTO/Port/state/UoW/config/evidence 是否与 owning formal source 相符 | wait_design + source writeback |
| dependency | 只有 verified Core compile candidate；外部 owner seam 未被接管 | block dependency |
| scope | path、batch、diff、用户改动是否隔离 | split/reopen |
| behavior | happy/negative/stale/duplicate/late/Unknown/zero-write 是否覆盖 | fix current boundary |
| security | secret/body/hidden reasoning/raw provider material 是否被泄露 | hard stop + independent review |
| truth | local outcome/ACK/Observed/projection/evidence status 是否各自独立 | block status promotion |
| handoff | ledger、commit record、failure facts、next action 是否完整 | no successor |

每个 boundary 和每个 Phase 都必须停审。审查结论最多是 pass-designed；实际提交和 gate pass 只能来自未来真实实现记录。

## 7. Commit Record 与 Handoff Record

### 7.1 Commit Record（未来实现期）

必须填：boundary、commit_hash、commit_message、author_identity、committed_at、staged_paths、diff_stat、applicable_commands、gate_result。设计期统一为 committed_hash=none、commit=not_run，不得写虚构 hash/date。

### 7.2 Handoff Record（未来实现期）

必须填：source boundary、actual hash/message/post-status、design baseline、user/other-agent changes、raw/report/evidence refs 或 explicit not_applicable、open blockers、next boundary、project ledger update。缺字段不得推进。

## 8. 39 boundary 设计期停审矩阵

| Boundary | Phase | Design conclusion | Blocker posture | Baseline |
|---|---|---|---|---|
| commit-01-a | PH-01 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-01-b | PH-01 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-01-c | PH-01 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-02-a | PH-02 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-02-b | PH-02 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-02-c | PH-02 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-03-a | PH-03 | pass-designed | L2R-LANG-002; loop boundary | not_bound; actual gate not run |
| commit-03-b | PH-03 | pass-designed | L2R-LANG-002; loop boundary | not_bound; actual gate not run |
| commit-03-c | PH-03 | pass-designed | L2R-LANG-002; loop boundary | not_bound; actual gate not run |
| commit-04-a | PH-04 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-04-b | PH-04 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-04-c | PH-04 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-05-a | PH-05 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-05-b | PH-05 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-05-c | PH-05 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-06-a | PH-06 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-06-b | PH-06 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-06-c | PH-06 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-07-a | PH-07 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-07-b | PH-07 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-07-c | PH-07 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-08-a | PH-08 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-08-b | PH-08 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-08-c | PH-08 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-09-a | PH-09 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-09-b | PH-09 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-09-c | PH-09 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-10-a | PH-10 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-10-b | PH-10 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-10-c | PH-10 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-11-a | PH-11 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-11-b | PH-11 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-11-c | PH-11 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-12-a | PH-12 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-12-b | PH-12 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-12-c | PH-12 | pass-designed | upstream seam/blockers remain explicit | not_bound; actual gate not run |
| commit-13-a | PH-13 | pass-designed | L2R-IMPL-001; tooling not executed | not_bound; actual gate not run |
| commit-13-b | PH-13 | pass-designed | L2R-IMPL-001; tooling not executed | not_bound; actual gate not run |
| commit-13-c | PH-13 | pass-designed | L2R-IMPL-001; tooling not executed | not_bound; actual gate not run |

所有条目均为设计期结论；L2R-UP-001~008、L2R-CP-001、L2R-ENTRY-001、L2R-IMPL-001、L2R-LANG-001/002 不被本表关闭。

## 9. 跨 boundary 审计

| 检查 | 结果 |
|---|---|
| boundary 集合 | 39，严格 commit-01-a 至 commit-13-c |
| task/batch 集合 | 117/117，一一同号，无 orphan |
| gate 集合 | GATE-01~39，一对一 |
| phase mapping | 13 Phase，每 Phase 3 boundary；PH-03 Loop Kernel 独立 |
| gate ordering | 只有 predecessor Handoff 后才允许 successor current |
| message/body | 39 行均有 planned title 和恰好两组 body |
| evidence | 177 raw/EV、8 suites、9 checks 只在 PH-13 工具链产生；无 static/cross-run |
| actual facts | none / not_started；无 hash/run/artifact/report/evidence/verdict/signoff/readiness |

## 10. 回填草稿与进入 Step 12 条件

正式 §11 只回填第 2~7 节的稳定身份、message 规则、九子门禁、评审维度和 Commit/Handoff Record。进入 Step 12 前必须保持项目 ledger 唯一 current=commit-01-a blocked、implementation_status=not_started，并将 flow/project ledger 原子推进到 Step 12；不得创建实现仓、写代码或提交。
