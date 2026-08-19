# Step 9. Spike、风险与待确认事项校准

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 9
> 回填目标：正式 `07-实施计划.md` §9
> 状态：`completed / pass-designed`
> 事实边界：所有 Spike、风险关闭和确认事项均为 planned；当前没有 Spike run、report、adopt/reject decision、risk acceptance 或 closure record。

## 1. 分类规则

| Kind | 用途 | 不得承担 |
|---|---|---|
| Spike | 验证被选实现或产品是否满足既有正式合同；输出有限兼容矩阵和 adopt/reject/reopen 建议 | 发明 owner schema、修改 Runtime ownership、生成 readiness |
| Risk | 记录已知发生概率与影响、缓解、触发器、owner 和截止点 | 替代 source blocker、验收残余风险或风险接受 |
| Open Question | 需要 authority 明确选择/事实才能继续的事项；未确认姿态必须封闭 | 长期“后续确认”、实现者自行默认 |
| Blocker | 已有正式缺口或前置不成立，直接阻止 boundary/positive lane | 用 fake、目录、ping、设计文本或用户口头同意关闭 |

Source blockers `L2R-UP-001~008`、`L2R-CP-001`、`L2R-ENTRY-001`、`L2R-IMPL-001`、`L2R-LANG-001/002` 保持原身份。`R-L2R-*` 仅为实施投影，不重编号或关闭 source blocker。Accepted risk instances 固定为 `0`。

## 2. Planned Spike register

| ID | 问题 / trigger | 影响 boundary | 必须输出 | 成功判定 | 失败或不确定动作 | 截止点 |
|---|---|---|---|---|---|---|
| `SP-L2R-001` | L0-core exact package/crate/public types/schema/codec/features 是否满足 Runtime planned reuse | `commit-01-a/b` | metadata、public surface、round-trip fixture、source ref/digest、dependency graph report | only-Core compile candidate 可绑定且不需要 shadow schema | reject binding；`wait_design` 回写 03/05/07 | `commit-01-a` activation 前 |
| `SP-L2R-002` | selected local Store/UoW 是否满足 CAS、append、inbox/outbox、idempotency、lease/page/cursor、known/unknown commit | `commit-02-b/c` 后的 product binding | capability/fault/atomicity/crash-window matrix | private adapter 完全实现 formal Ports，不改变 state/UoW/replay semantics | reject product 或 controlled reopen 03/04/05/07 | 任何 durable adapter boundary 前 |
| `SP-L2R-003` | selected source/durable-memory adapter 是否只返回 safe snapshot/ref/status | PH-05 positive lane | source/version/freshness/body/redaction/failure matrix | source/body owner 不进入 Runtime；working/durable 分层不变 | reject product；缺 contract 回 owner；保持 `L2R-UP-005/006` | positive source/memory adapter 前 |
| `SP-L2R-004` | selected model adapter 是否提供 provider-neutral semantic result、stable submission identity/status 与 Unknown reconciliation | PH-06 positive lane | request/result/status/mismatch/timeout/redaction matrix | Runtime DTO 不含 route/secret/quota/cost/raw response；无 blind retry | reject/reopen owner contract；保持 `L2R-UP-004` | positive model call 前 |
| `SP-L2R-005` | Tools/Hub/Governance/Sandbox seams 是否共同支持 five-owner guard、record-before-call、receipt/cleanup truth separation | PH-07 positive lane | per-owner source/freshness/decision/request/outcome/fault matrix | missing/stale/denied/unknown 均 zero-call；Runtime 不执行 tool、不直连 Sandbox | owning upstream closure；affected boundary blocked | positive action call 前 |
| `SP-L2R-006` | child runtime seam 是否支持 strict parent subset、budget/depth、stable request/result、once-only receipt | PH-08 positive lane | scope/budget/identity/result/late/duplicate matrix | 无 member/container/image lifecycle、无 shared mutable context | reject seam；保持 `L2R-ENTRY-001` 或回 owner | positive delegation 前 |
| `SP-L2R-007` | checkpoint backend 是否支持 matching receipt、commit tri-state、stable status reconcile 和 no-blind-retry | PH-09 positive lane | prepare/commit/receipt/reconcile/crash matrix | only matching proof -> Committed；Unknown 可按同 identity reconcile | reject/reopen `L2R-CP-001`；禁止 resume | `commit-09-b` positive call 前 |
| `SP-L2R-008` | Bus/Observability/handoff routes 是否支持 immutable body-free payload/status refs，而不要求 Runtime 拥有 delivered/Observed | PH-10/11 positive lanes | route/source/status/fault/redaction/replay matrix | local attempt/gap 与 external status 分离；stored payload exact replay | reject/reopen owner；local outbox/gap 保留 | positive handoff/publisher 前 |
| `SP-L2R-009` | 13 slot/config snapshot fingerprint 是否能排除 secret、raw locator 和 full sensitive refs仍保持稳定 | `commit-12-a/b`、`commit-13-b` | allowlist、canonical fixtures、rotation/drift/redaction proof | safe digest stable且不可逆暴露 forbidden material | 回写 04/05/06/07；不得 hash raw 代替 | `commit-12-b` 前 |
| `SP-L2R-010` | selected composition/entry framework 是否保持 facade-only、startup atomic publication 和 zero constructor I/O | `commit-12-b/c` | builder/entry/cancellation/profile/fake-leak matrix | exact C/Q/E/J dispatch；无 direct repository/adapter I/O 或 lifecycle creep | reject framework或回 03/04/07 | `commit-12-b` 前 |
| `SP-L2R-011` | evidence pipeline 是否对 missing/failed/blocked/invalid/cross-run/static/redaction fixtures保持 non-pass | `commit-13-a~c` | manifest/raw/report/index/draft negative matrix | 177 denominator、8 suite、9 checks、same-run pairing和status precedence成立 | 回写 05/06/07；保留失败 run；不得手写 evidence | `commit-13-b` 前 |

### Spike execution contract

| Rule | Requirement |
|---|---|
| scope | 只在当前 boundary 的 scratch/fixture 范围执行；不提前实现 successor |
| provenance | 记录 exact source/version/profile/commands/safe outputs/limitations |
| decision | 只允许 `adopt_candidate / reject_candidate / reopen_design / remain_blocked` |
| evidence ceiling | Spike output 不是 TC evidence、positive qualification、acceptance verdict 或 readiness |
| uncertainty | 输出不完整即 `remain_blocked`；不能通过无限 success fake、默认值或 private schema 补齐 |

## 3. Risk register

| ID | 风险 / 类型 | 影响 | 当前缓解 | Stop/Reopen trigger | Owner / deadline |
|---|---|---|---|---|---|
| `R-L2R-001` | implementation prerequisite：target repo absent | all boundaries | 仅设计 planned ledger/skeleton | 未显式授权或路径仍 absent | repo owner；`commit-01-a` 前 |
| `R-L2R-002` | immutable formal 00~07 baseline absent | every Design Gate | baseline=`not_bound` | 试图以 dirty HEAD/date/file set 激活 | design/repo owner；first activation 前 |
| `R-L2R-003` | Rust manifest/toolchain compatibility未验证 | PH-01+ | formal candidate + future preflight | build lane被本机事实替代或擅自降级 | implementation owner；`commit-01-a` 前 |
| `R-L2R-004` | formal 03 Rustdoc language 与 `standards/coding/rust.md` 冲突 (`L2R-LANG-002`) | every Rust source boundary | affected boundary `wait_design` | 实现者任选中英文或混写 | detailed-design owner；任何 Rust edit 前 |
| `R-L2R-005` | Core Runtime schema/API compatibility open | PH-01+ | candidate-only、no copy | public/codec/source mismatch | Core/Runtime contract owners；`SP-L2R-001` |
| `R-L2R-006` | local Store/UoW product未选 | PH-02+ infra | deterministic Port/fault semantics先行 | product-specific schema/semantics进入 domain | architecture/infra；binding 前 |
| `R-L2R-007` | Runtime Loop Kernel 被分散递归实现 | PH-03 | dedicated phase、one-service step、T1/T2/T3 gates | capability service自调下一操作、multi-service step、自旋 | Runtime design/reviewer；PH-03 each boundary |
| `R-L2R-008` | Method Library current source dirty | PH-04 | current workspace ref + dirty disclosure | immutable source claim或definition drift | Method owner；PH-04 baseline 前 |
| `R-L2R-009` | durable memory/source owner/product open | PH-05 | working/ref-only + Blocked finite seam | durable write/index/lifecycle/readiness claim | memory/source owner；positive 前 |
| `R-L2R-010` | model adapter/secret/route/status open | PH-06 | provider-neutral + blocked/Unknown | positive call或provider field leak | model/security owner；positive 前 |
| `R-L2R-011` | Tools/Hub/Governance/Sandbox seams open | PH-07 | five guards、zero-call、record-before-call | default allow/direct Sandbox/tool execution claim | upstream owners；positive 前 |
| `R-L2R-012` | child/member entry seam open | PH-08/12 | strict subset + facade-only | member/container/image lifecycle进入 Runtime | entry/product owner；positive 前 |
| `R-L2R-013` | physical checkpoint contract open | PH-09 | Prepared/Unknown/fence split | Committed/resume without matching proof | checkpoint owner；positive 前 |
| `R-L2R-014` | Bus/Obs/handoff route/status open | PH-10/11 | local outbox/attempt/gap/status separation | delivery/Observed/audit/readiness claim | Bus/Obs owner；positive 前 |
| `R-L2R-015` | 12/153/39、13x5、7x6 config denominator drift | PH-12 | exact V0~V12 checks | default/alias/Ready/fake leak/partial publish | config design owner；`commit-12-a` |
| `R-L2R-016` | runner/report/evidence tooling absent | PH-13 | exact planned manifests/gates | static/manual/cross-run evidence attempt | test tooling owner；PH-13 |
| `R-L2R-017` | numeric performance/SLO authority absent | PH-13/future | structural bounds only | numeric pass/release claim | product/SRE；claim 前 |
| `R-L2R-018` | artifact retention/access/runbook pending | real release/operations | failed-run preservation + fixed roots | release/deploy requested without owner policy | ops/security/release；release 前 |
| `R-L2R-019` | historical README/旧 12-phase/35-boundary/109-EV 污染 | all | source/denominator scans + current formal priority | old identity/count/state reappears | design/reviewer；every boundary |
| `R-L2R-020` | planned/blocked/fake/ACK/receipt 被提升为 pass/readiness | all | TRUTH/FAKE/NOSTATIC checks | 任何状态提升或伪造事实 | all reviewers；immediate hard stop |

## 4. Non-waivable risks

以下不能通过风险接受绕过：任何 VF、secret/body/hidden reasoning 泄漏、owner truth takeover、default allow/host fallback、Unknown blind retry、新 identity 重投、Query write、Job truth repair、projection/outcome status promotion、non-Core compile dependency、fake leak、static/cross-run evidence、P0 denominator 缺失，以及伪造 commit/run/artifact/report/evidence/verdict/signoff/readiness。

## 5. Open questions

| ID | 待确认事项 | 未确认前的唯一姿态 | 影响 | Deadline / overdue action |
|---|---|---|---|---|
| `OQ-L2R-001` | target repo 创建和明确授权方式 | 不建替代仓、不落代码 | `commit-01-a` | activation 前；pause |
| `OQ-L2R-002` | branch/worktree/repo-local identity/initial status | ledger blocked | first commit | edit/commit 前；pause |
| `OQ-L2R-003` | immutable formal 00~07 baseline | `not_bound` | all boundaries | first activation 前；`wait_design` |
| `OQ-L2R-004` | formal 03 Rustdoc 语言冲突的 authority resolution | affected Rust boundary blocked | all Rust source | any edit 前；reopen 03 |
| `OQ-L2R-005` | Core exact reusable surface | compile candidate only | PH-01 | `SP-L2R-001`；不闭则 blocked |
| `OQ-L2R-006` | local Store/UoW/lease product | deterministic Port/fake only | PH-02 infra | product binding 前；Spike/reject |
| `OQ-L2R-007` | source/memory/model/Tools/Sandbox/checkpoint/Bus/Obs positive contracts/products | Disabled/Blocked/Candidate | PH-05~11 | owning positive call 前；remain blocked |
| `OQ-L2R-008` | child/entry actor/scope/transport/product owner | strict child/facade-only shell | PH-08/12 | positive entry 前；`L2R-ENTRY-001` |
| `OQ-L2R-009` | async runtime/transport/framework selection | no implementation selection | PH-03/12 | selection 前；design impact review |
| `OQ-L2R-010` | secret/TLS/credential provider | opaque ref、production inactive | external Candidate | before candidate qualification；blocked |
| `OQ-L2R-011` | actual evidence/acceptance/risk/signoff roles | draft/review_required；no names/signatures | PH-13/06 process | handoff review 前；not_bound |
| `OQ-L2R-012` | artifact retention/permissions/runbook | fixed local roots only | release | release 前；no readiness |
| `OQ-L2R-013` | numeric SLO/capacity authority | numeric `not_evaluated` | NFR/release | numeric claim 前；no verdict |
| `OQ-L2R-014` | downstream SDK/product Runtime client | downstream ref only | future | proposal before dependency; reopen design |

A future closure record must contain `id`、authority role、decision、affected boundary、source refs、effective immutable baseline、reopen trigger and provenance. Current files must not invent person name, signature, commit, run or timestamp as closure.

## 6. Upstream writeback matrix

| Trigger | First authority | Required cascade | Forbidden shortcut |
|---|---|---|---|
| public field/type/DTO/Port/callable/Rustdoc policy | formal 03 owning Step | 03 declaration/flow/state/test -> 05/06/07 -> ledgers/skeletons | private alias/helper/comment choice |
| state/UoW/idempotency/Unknown/loop semantics | formal 03 §9~§13 | writers/readers/replay/errors -> 05/06/07 | code-only semantic or generic StateManager |
| config key/profile/source/activation | formal 04 (semantic first 03) | 04/05/06/07 + PH-12 boundaries | env alias/default/fallback/partial publish |
| CUT/TC/suite/check/artifact/report/evidence schema | formal 05 | 05/06/07 + PH-13 boundaries | handwritten report/static EV |
| AC/VF/risk/signoff authority | formal 06 | 06/07 gate and handoff map | implementation-side verdict/risk acceptance |
| Phase/boundary split/merge/order | formal 07 Step 5~7/11/12 | formal 07、implementation ledger、all skeletons | implementation improvisation |
| private adapter/product choice only | infra/config binding | prove no public/semantic/status delta + targeted tests | fake-as-product/readiness |

## 7. Step closure audit

| Check | Result |
|---|---|
| 11 Spike entries have bounded output/success/failure/deadline | `pass-designed` |
| 20 risks bind phase, stop trigger, owner and deadline | `pass-designed` |
| 14 OQ entries have fail-closed default and overdue action | `pass-designed` |
| PH-03 Loop Kernel and PH-13 tooling are independently covered | `pass-designed` |
| `L2R-LANG-002` is explicit blocker, not implementation choice | `pass` |
| source blocker/risk/OQ/acceptance residual identities remain distinct | `pass` |
| actual Spike/closure/risk acceptance/result | `none / planned` |

```text
step_09 = completed
next_allowed_action = rebuild_step_10_rollback_pause_change_control
formal_07_write_allowed = false
implementation_status = not_started
```
