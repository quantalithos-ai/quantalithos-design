# L4-sandbox Step 11 评审、交付与跨Boundary纪律审计

> 上游: Step 6 boundary / Step 7 gate / Step 10 control
> 主件: `07_implementation_plan_step_11_commit_review_delivery.md`
> Message矩阵: `07_implementation_plan_step_11_boundary_commit_message_matrix.md`
> 状态: completed_supporting_audit
> 当前成熟度: design_only;所有review、artifact、report和handoff状态均为future contract

---

## 1. 使用规则与当前事实

| 项 | 当前设计结论 | 当前现实状态 |
|---|---|---|
| boundary总数 | `CB-SBX-01A~14C`,共32个 | 均未激活 /实现 /提交 |
| review | 每个boundary有角色与输入,Commit前必须形成具体review record | 无真实review记录 |
| artifact / report | G0记录无producer理由;G1~G4使用fixed raw / paired report | 无`run_id`、raw或report |
| acceptance / review入口 | 固定4份acceptance draft +2份independent review | 文件均不存在 |
| implementation ledger | Step 13同步创建项目ledger和32件planned skeleton | 当前不存在 |
| 交付结论 | 只有Commit + Handoff Gate均通过才完成boundary | 无boundary完成事实 |

本分件中的“设计层通过”只表示纪律字段闭合,不表示未来runtime review、测试、验收或交付通过。

---

## 2. 评审纪律表

| Review ID | 评审面 | 必需输入 | Reviewer责任 | 通过条件 | 失败路由 |
|---|---|---|---|---|---|
| `RVD-SBX-01` | boundary identity | 项目 / boundary ledger、Step 6、message矩阵 | boundary reviewer | current唯一,staged diff只属于一个boundary | 清理staging;粒度冲突`wait_design` |
| `RVD-SBX-02` | design baseline | baseline hash、required reads、经验复核 | design reviewer | baseline可复现且未失效,无未闭口契约 | `blocked / wait_design` |
| `RVD-SBX-03` | allowed / forbidden scope | initial status、touched / staged paths、Step 6 scope | scope reviewer | path和behavior均未越界 | 当前scope可修复走`fix_gate_failure`;边界错误`wait_design` |
| `RVD-SBX-04` | Rust / script质量 | fmt / check / clippy、targeted tests、script syntax / lint | implementation reviewer | 所有适用命令有真实status和输出引用 | `blocked / fix_gate_failure` |
| `RVD-SBX-05` | state / transaction / race | exact TC、write set、rollback、replay、call budget | consistency reviewer | formal state / UoW / idempotency语义保持 | 设计缺口`wait_design`;实现失败`fix_gate_failure` |
| `RVD-SBX-06` | security redline | body-free、redaction、四维隔离、guard、containment、dependency | security reviewer | 适用VETO /红线无绕过,失败材料safe | 阻断commit;按S级 / design gap分类 |
| `RVD-SBX-07` | artifact / report | fixed raw、schema、digest、paired report、integrity checks | evidence reviewer | same-run pairing、status fidelity、no-static成立 | 保留raw,新run /补合法report |
| `RVD-SBX-08` | P0-Q qualification | immutable packet、identity、CONF、product / lab disposition | qualification + operations reviewer | 同一candidate packet,0 substitution,teardown可裁决 | `dependency_wait + blocked / handoff`或修harness |
| `RVD-SBX-09` | message | staged diff、planned mapping、完整message file | commit reviewer | title / scope / summary / groups / basename /量 / footer准确 | 修message后重审Commit Gate |
| `RVD-SBX-10` | acceptance handoff | fixed RELEASE、4 drafts、2 reviews、正式`06` | independent reviewer / adjudicator | draft、review、裁决和签署权限分离 | 保持pending / Blocked;generator不得代签 |
| `RVD-SBX-11` | user-owned changes | initial / precommit / postcommit status | worktree reviewer | 未授权用户文件未改写 /未stage | 暂停解决ownership |
| `RVD-SBX-12` | handoff continuity | commit record、gate list、not-run、blocker、next boundary | handoff reviewer | 真实hash写回且下一boundary唯一 | 当前boundary保持未完成 |

禁止review口径:

- 不允许只写`LGTM`、`looks good`、聊天“同意”或无evidence的`pass`。
- implementer / generator可以自检,但不能替代Step 7要求的独立security、qualification、acceptance或evidence review。
- reviewer不得用其他run、其他candidate、其他generation或其他boundary结果替代当前输入。
- review发现设计偏离时先回写design baseline,不能在review comment中授权实现端私补contract。

---

## 3. 交付纪律表

| Delivery ID | 交付项 | 必填字段 /引用 | 完成条件 | 禁止 |
|---|---|---|---|---|
| `DLD-SBX-01` | boundary identity | boundary ID、phase、design baseline、implementation repo | 与两级ledger一致 | 自由文本别名 |
| `DLD-SBX-02` | commit record | future真实hash、exact message、parent / post-status | commit后回读并写入 | planned title冒充hash / message |
| `DLD-SBX-03` | scope summary | semantic groups、actual basenames、approximate deltas | 与staged / committed tree一致 | 只写“code updated” |
| `DLD-SBX-04` | gates run | command、status、run / report ref、reviewer | 每个required gate有证据 | 未运行写pass |
| `DLD-SBX-05` | tests not run | exact item、reason、impact、next action | 未跑项可追踪且不影响required gate | 省略 /裸N/A |
| `DLD-SBX-06` | blocker state | ID、gate、owner、status、baseline、合法next action | open / resolved均完整 | 静默waive / risk accept VETO |
| `DLD-SBX-07` | artifact / report | fixed path、schema、digest、source identity、pairing | 与当前boundary / run一致且未失效 | `latest`、同义入口、完整日志 |
| `DLD-SBX-08` | user changes | 未触碰清单或经授权共同修改说明 | initial / post status可对照 | 擅自吸收用户改动 |
| `DLD-SBX-09` | acceptance / review | draft / review真实状态、fixed RELEASE和version | 只报告事实;缺失写missing | 预填Reviewed / Signed / Passed |
| `DLD-SBX-10` | next boundary | exact next ID、Activation前置、project ledger动作 | Handoff Gate通过后唯一推进 | 文本私自并行启动 |

交付说明保持高信号:报告命令与canonical path,不粘贴完整stdout / stderr、raw正文或敏感material。失败材料必须保留,但以safe ref / digest引用。

---

## 4. Artifact / Report交付检查表

### 4.1 Fixed入口与禁止别名

| 类别 | Canonical入口 | 必查字段 | 禁止入口 /行为 |
|---|---|---|---|
| raw root | `artifacts/test/<run_id>/...` | run intent / scope / trigger / change refs、ENV / PROFILE、source role、schema / digest / status | `latest`;覆盖失败raw;从路径猜intent |
| run summary | `reports/runs/<run_id>/summary.md` | fixed raw refs、suite / status / missing | 手写无raw summary |
| suite report | `reports/runs/<run_id>/suites/<suite_id>.md` | case / parameter / status / digest回链 | 只写总通过数 |
| gate report | `reports/runs/<run_id>/gate-results.md` | gate、source identity、Failed / Blocked / conditional原态 | `gate-summary.md`;状态归一为pass |
| coverage | `tc-coverage.md`;`protocol-inventory.md`;`per-coverage.md` | 254 owner、55 protocol、PER producer与missing | 只比较总数;自造分母 |
| integrity | `redaction-check.md`;`dependency-boundary.md`;`report-audit.md` | raw check path / digest / status、pairing、blocked propagation、cleanup | `all checks passed`替代逐项回链 |
| evidence | `evidence-index.md`;`evidence/<evidence_id>.md` | source role / run / suite / TC / parameter / assertion / digest | 无合法pair分配EV;静态alias |
| acceptance | `reports/acceptance/handoff.md`;`veto-checklist.md`;`risk-acceptance.md`;`open-issues.md` | fixed RELEASE、四source digest、draft version、missing / conditional | `final-decision.md`;`acceptance-summary.md`;预填裁决 |
| independent review | `reports/review/reviewer-notes.md`;`agent-review.md` | fixed RELEASE、review identity / version / time、findings / dispute | acceptance / review的run子目录;generator自审代替独立review |

### 4.2 配对与成熟度算法

```text
if boundary maturity == G0:
  require no_runtime_artifact plus exact producer-absence reason
  forbid run_id, source role, evidence alias and acceptance claim
else:
  require immutable raw under artifacts/test/<run_id>
  require paired human report under reports/runs/<run_id>
  require schema, status, digest, redaction and resource disposition
  require report-audit backlink to raw checks

if any required item is missing, Failed, InfraFailed, Blocked,
Invalidated or Superseded:
  forbid commit and handoff completion
  preserve old material
  create a new run / generation / batch where Step 10 requires it
```

### 4.3 Acceptance / Review交付检查

| 检查项 | Future通过条件 | 当前状态 |
|---|---|---|
| handoff draft | 同一fixed RELEASE,四source refs完整,无预填final decision | absent_not_created |
| VETO checklist | 17 /17 exact predicate与evidence / finding / disposition字段可判定 | absent_not_created |
| risk acceptance | owner / authority / action / expiry / status字段完整;VETO不可接受 | absent_not_created |
| open issues | Failed / Blocked / missing / invalidated / disputed全部保留 | absent_not_created |
| reviewer notes | 独立人类review identity / version / time和具体finding | absent_not_created |
| agent review | orphan / duplicate / path / digest / redaction / trace机械finding | absent_not_created |
| final decision | 只在`handoff.md`的`Final Decision and Signoff`受控section形成 | acceptance_not_entered |

当前状态列是现实缺失说明,不是失败测试结果。Step 11不得创建上述文件或把缺失改写为Passed。

---

## 5. PH-01~PH-08 Boundary提交纪律停审

| Boundary | Type / Scope审查 | Body group审查 | Review / evidence审查 | 设计层结论 | Future重复核 |
|---|---|---|---|---|---|
| `CB-SBX-01A` | `chore(workspace)`对应bootstrap,scope稳定 | manifests / graph与entry / repo guard表达共同bootstrap | architecture / build review;G0 direct checks | passed_design | 目标仓hooks、identity、version和core revision |
| `CB-SBX-02A` | `feat(contracts)`对应shared carriers | refs / metadata与status / error不可拆 | contracts + security;G0 carrier checks | passed_design | core shared type实际兼容性 |
| `CB-SBX-02B` | `feat(persistence)`对应kernel | UoW / replay / fake共同证明parity | consistency review;G0 rollback / replay | passed_design | actual fake与durable contract等价 |
| `CB-SBX-02C` | `feat(evidence)`对应canonical primitive | identity / path与digest writer / verifier不可拆 | evidence + security;G1 paired fixture | passed_with_precondition | RFC 8785工具关闭后重核 |
| `CB-SBX-02D` | `ci(automation)`对应最小脚本面 | entry与safe checks共享参数 /失败协议 | automation + evidence;G1 safe fixture | passed_with_precondition | Shell rule / lint关闭后重核 |
| `CB-SBX-03A` | `feat(config)`对应strict loader | selector / schema / validator共同阻断invalid publication | config + architecture + security | passed_design | 40 /101 /44 actual manifest |
| `CB-SBX-03B` | `feat(composition)`对应generation | registry / eligibility / generation / builder同代 | config + material + runtime builder | passed_design | concrete provider仍非本scope |
| `CB-SBX-04A` | `feat(intake)`对应contract-domain | protocol与context / identity truth共同闭口 | contracts + domain + security | passed_design | exact carrier / state tests |
| `CB-SBX-04B` | `feat(intake)`同scope纵切 | resolver / UoW / entry共同验证原子受理 | application + transaction + API | passed_design | stored replay和call budget |
| `CB-SBX-05A` | `feat(boundary)`对应coherent contract | active identity、四维隔离 / workspace、handle / lease共同闭合 | boundary domain + security | passed_design | no-policy-input和weak rejection |
| `CB-SBX-05B` | `feat(boundary)`对应establishment纵切 | seam / grouped transaction / entry不可横拆 | boundary + transaction + adapter | passed_design | I065 / exact reads / call budget |
| `CB-SBX-06A` | `feat(policy)`对应fail-closed truth | carrier与decision / high-risk state共同定义non-allow | policy + domain + security | passed_design | body-free与all non-allow states |
| `CB-SBX-06B` | `feat(policy)`对应evaluation纵切 | exact read与decision UoW / zero-launch entry同组 | application + policy + transaction | passed_design | backend call=0 trace |
| `CB-SBX-07A` | `feat(run)`对应controlled launch | truth / guards / entry共同形成唯一run事实 | run + boundary + policy + backend | passed_design | exact persisted guards / no relaunch |
| `CB-SBX-07B` | `feat(capture)`对应capture事实 | contract / side effect / partial verification共同保持诚实状态 | capture + material + security | passed_design | no raw body / no truth升格 |
| `CB-SBX-07C` | `feat(handoff)`对应delivery事实 | truth / adapter / no-rollback entry同组 | handoff + transaction + seam | passed_design | target identity / source unchanged |
| `CB-SBX-08A` | `feat(control)`对应control / classification | worker / classification / race共同保证single truth | safety + control + transaction | passed_design | unknown保守传播 |
| `CB-SBX-08B` | `feat(safety)`对应guard / containment | guard、destructive seam、release-zero验证不可拆 | safety + operations + security | passed_design | resource disposition和VETO redline |

---

## 6. PH-09~PH-14 Boundary提交纪律停审

| Boundary | Type / Scope审查 | Body group审查 | Review / evidence审查 | 设计层结论 | Future重复核 |
|---|---|---|---|---|---|
| `CB-SBX-09A` | `feat(query)`对应read contract | carriers / ports / no-scan fixtures共享lookup语义 | contracts + query + access control | passed_design | 13 /13 exact surface |
| `CB-SBX-09B` | `feat(query)`对应read-only facade | status / projection / API共同证明zero-write | application + API + projection + audit | passed_design | RACE-019 / write audit=0 |
| `CB-SBX-10A` | `feat(consumer)`对应trusted intake | schemas / dedup / worker groups共享receipt协议 | consumer + transaction + security | passed_design | 9 source maps / duplicate call budget |
| `CB-SBX-10B` | `feat(relay)`对应stored publish | snapshot / publisher / relay loop共同闭合outbox | event + outbox + publisher + transaction | passed_design | 13 payload / source no rollback |
| `CB-SBX-11A` | `feat(jobs)`对应shared kernel | schema / orchestration / runtime共享stored report | jobs contract + application + entry | passed_design | 10 /10 job / partial report |
| `CB-SBX-11B` | `feat(jobs)`对应collaboration jobs | relay / refresh / handoff / binaries共享bounded job协议 | jobs + relay + handoff + reference | passed_design | no source repair / owner call budget |
| `CB-SBX-11C` | `feat(operations)`对应guarded jobs | safety与read-side分组但共同坚持no-repair | safety + operations + projection | passed_design | resource disposition / no latest scan |
| `CB-SBX-12A` | `feat(protocol)`对应inventory closure | manifests / gap closure / owner checks必须同baseline | contracts + test architecture + trace | passed_design | 55 /30 owner machines /31 enum entries /39 shared declarations /38 /254 /237 exact |
| `CB-SBX-12B` | `test(consistency)`对应hardening主交付 | TXN / race / parity / source writers共同证明P0-C | test + consistency + evidence + security | passed_design | 14 /19 /source role fidelity |
| `CB-SBX-13A` | `feat(qualification)`对应identity binding | packet / preflight / safety fixture共同保证0-launch | design + qualification + security + provider | passed_with_precondition | candidate / ENV-05 / material / lab |
| `CB-SBX-13B` | `test(qualification)`对应CONF harness | cases / P0Q writer / teardown共同绑定single packet | qualification + security + operations | passed_with_precondition | 13A packet与lab authorization |
| `CB-SBX-14A` | `ci(gates)`对应orchestration | gate / selector / 9 checks共享status语义 | automation + release + evidence + security | passed_with_precondition | Shell rule、7 /9 actual inventory |
| `CB-SBX-14B` | `feat(evidence)`对应materialization | schemas / slots / renderers共享canonical raw | schema + report + security | passed_with_precondition | RFC 8785、21 slot、pairing |
| `CB-SBX-14C` | `feat(acceptance)`对应draft generator | four drafts / review index / scope audit同一RELEASE投影 | acceptance tooling + independent review contract + security | passed_design | no verdict / review / signature prefill |

停审计数:

```text
boundary_count = 32
passed_design = 26
passed_with_precondition = 6
failed_design = 0
runtime_reviewed = 0
runtime_committed = 0
```

`passed_with_precondition`只表示message / review结构成立但future activation前置开放,不授权实现或提交。

---

## 7. 跨Boundary纪律审计

| Audit ID | 审计项 | 结论 | 依据 /修正 |
|---|---|---|---|
| `CRDA-SBX-001` | 32 boundary是否各有唯一planned title | passed_design:32 /32 | message矩阵§2~§3 |
| `CRDA-SBX-002` | 实现仓title是否全部英文且scope必填 | passed_design:32 /32 | 所有title为`type(scope): subject` |
| `CRDA-SBX-003` | scope是否来自闭集并与surface一致 | passed_design:32 /32 | 主件§7.3 +矩阵 |
| `CRDA-SBX-004` | 是否存在跨boundary合并 | no | 每行唯一ID;序列仍严格串行 |
| `CRDA-SBX-005` | 是否把batch / crate /文件当commit | no | 108 batch只归所属boundary;body按semantic group |
| `CRDA-SBX-006` | body group是否承接Step 6 §7.7 | passed_design:32 /32 | group与同提交因果逐项对应 |
| `CRDA-SBX-007` | summary是否要求exact boundary ID | passed_design:32 /32 | 矩阵逐项summary |
| `CRDA-SBX-008` | basename / approximate delta规则是否完整 | passed_design | 主件§7.4 /§7.10 |
| `CRDA-SBX-009` | 字面量换行、bullet空行、footer规则 | passed_design | 完整message file +固定footer |
| `CRDA-SBX-010` | design / implementation语言是否分离 | passed_design | design中文subject / body;实现全英文 |
| `CRDA-SBX-011` | target repo历史规则是否伪造 | no | repo缺失登记为01A前置 |
| `CRDA-SBX-012` | Gate与commit时机是否一致 | passed_design:32 /32 | message矩阵§4~§5 + Step 7 |
| `CRDA-SBX-013` | blocked / pending是否可能commit | no | Step 10路由嵌入主件§7.6 |
| `CRDA-SBX-014` | artifact / report是否canonical | passed_design | 唯一`gate-results.md`;禁止`gate-summary.md` |
| `CRDA-SBX-015` | raw / report pairing是否强制 | passed_design | §4.2;G0例外有exact reason |
| `CRDA-SBX-016` | 是否允许完整日志 / sensitive body进入交付 | no | 只引用safe path / digest |
| `CRDA-SBX-017` | acceptance draft是否可能冒充裁决 | no | draft / review / adjudication / signoff分权 |
| `CRDA-SBX-018` | independent review是否被generator代替 | no | RVD-SBX-10 + fixed review paths |
| `CRDA-SBX-019` | user-owned changes是否受保护 | passed_design | RVD-SBX-11 / DLD-SBX-08 |
| `CRDA-SBX-020` | Handoff Gate是否要求真实hash后写回 | passed_design | DLD-SBX-02 / RVD-SBX-12 |
| `CRDA-SBX-021` | next boundary是否仍单current | passed_design | handoff后项目ledger唯一推进 |
| `CRDA-SBX-022` | 设计偏离是否回写owner truth | passed_design | `blocked / wait_design`,新baseline重复核 |
| `CRDA-SBX-023` | historical commit是否放宽规范 | no | 只作historical_material |
| `CRDA-SBX-024` | 是否伪造hash / run / EV / review / result | no | 全部分件design_only |

跨审计未发现需要重开Step 6、Step 7、Step 10或正式`00~06`的设计冲突。

---

## 8. Handoff Gate Future Record模板

Step 13创建的每件boundary skeleton必须能承载以下字段;当前全部保持planned / pending:

| field | future value要求 | 初态 |
|---|---|---|
| `boundary_id` | exact `CB-SBX-*` | planned exact ID |
| `planned_commit_message` | message矩阵title | planned title only |
| `actual_commit_message_file_checked` | path / digest或人工检查记录 | pending |
| `staged_scope_checked` | staged basenames + allowed scope对照 | pending |
| `required_checks` | commands + exact status + evidence refs | pending |
| `review_records` | reviewer role / identity / version / finding refs | pending |
| `committed_hash` | future真实hash | pending |
| `committed_message` | future exact readback | pending |
| `post_commit_status` | worktree / user changes / current HEAD | pending |
| `tests_not_run` | exact item / reason / impact / next action | pending |
| `remaining_blockers` | structured blocker refs | pending |
| `next_boundary` | exact successor after Handoff pass | planned |
| `handoff_gate` | `pending / pass / blocked / not_applicable` + evidence | pending |

未来boundary没有真实commit时,`committed_hash`和`committed_message`只能写`pending`,不得写空字符串、`TBD hash`或伪造示例值。

---

## 9. 自检与Step 11停审结论

| 自检项 | 结果 |
|---|---|
| 评审纪律是否覆盖boundary / design / scope / quality / consistency / security / evidence / qualification / message / acceptance / worktree / handoff | passed:12 /12 |
| 交付纪律是否覆盖commit / scope / gates / not-run / blocker / artifact / user / review / next | passed:10 /10 |
| canonical artifact / report入口是否与正式`05/06`一致 | passed |
| 是否禁止`gate-summary.md`、`latest`和同义final入口 | passed |
| acceptance四draft与两review是否保持不存在事实 | passed |
| 32 /32 boundary是否逐项停审 | passed_design:32 /32 |
| 跨boundary审计是否完成 | passed_design:24 /24 |
| 是否创建实现事实 | no |

本分件已完成。Step 11三件产物已转为`completed_pending_user_review`并停审,不得读取Step 12。
