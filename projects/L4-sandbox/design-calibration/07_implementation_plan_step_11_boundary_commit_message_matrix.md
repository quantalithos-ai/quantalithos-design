# L4-sandbox Step 11 Commit Boundary Message矩阵

> 上游: `07_implementation_plan_step_06_tasks_commit_boundaries.md` §7.3~§7.7
> 门禁输入: `07_implementation_plan_step_07_test_acceptance_gates.md` §6~§8
> 控制输入: `07_implementation_plan_step_10_rollback_pause_change_control.md`
> 主件: `07_implementation_plan_step_11_commit_review_delivery.md`
> 状态: completed_supporting_register
> 当前成熟度: design_only;所有message均为planned template,不是commit事实

---

## 1. 使用规则

1. 每个`CB-SBX-*`只允许形成一笔目标实现仓commit;不同boundary不得合并。
2. `default type`按首轮计划交付选择。实际diff若是既有缺陷修复,可在review记录中把`feat / test / ci / chore`受控改为`fix`;scope不得漂移。
3. title和body必须全英文。summary必须包含exact boundary ID。
4. body group机械承接Step 6 §7.7的同提交子功能;不得改成按crate、目录、生产代码 /测试代码平铺。
5. 文件bullet只写未来staged diff中的basename、近似改动量和文件职责;本矩阵不预填文件清单或行数。
6. evidence列是交付引用契约,不表示路径、run、report或结果当前存在。
7. 任一`pending / blocked / Invalidated / Superseded`必需输入使commit时机不成立。

统一footer:

```text
Co-Authored-By: Codex <noreply@openai.com>
```

---

## 2. PH-01~PH-08 Planned Message与Body分组

| Boundary | Default message title | Boundary summary | Semantic body groups | 同提交因果 |
|---|---|---|---|---|
| `CB-SBX-01A` | `chore(workspace): bootstrap the seven-crate sandbox workspace` | `Bootstrap the complete workspace and repository guard for CB-SBX-01A.` | `Workspace manifests and package graph:`;`Binary entry shells and repository guard:` | manifests、七crate / binary空入口、only-core依赖和repo guard共同构成唯一可编译bootstrap graph |
| `CB-SBX-02A` | `feat(contracts): add body-free shared sandbox carriers` | `Add the shared safe carrier foundation for CB-SBX-02A.` | `Typed references and shared metadata:`;`Safe status, receipt, report, and error carriers:` | 三通道必须共享metadata、typed refs和safe disposition,拆开会产生临时私有carrier |
| `CB-SBX-02B` | `feat(persistence): add transactional persistence and replay kernel` | `Add the rollback-safe persistence and replay kernel for CB-SBX-02B.` | `Transaction and repository kernel:`;`Idempotency and stored replay:`;`Semantic fakes and rollback fixtures:` | fake、UoW、version、idempotency和stored result必须一起证明durable parity与rollback |
| `CB-SBX-02C` | `feat(evidence): add canonical machine artifact primitives` | `Add canonical machine artifact identity and digest primitives for CB-SBX-02C.` | `Machine artifact identity and paths:`;`Canonical digest writer and verifier:` | writer / verifier必须共享schema identity、canonical bytes、self-digest和path规则 |
| `CB-SBX-02D` | `ci(automation): add safe minimal gate and report scripts` | `Add the safe automation entry foundation for CB-SBX-02D.` | `Minimal gate and report entry points:`;`Safe dependency, redaction, and no-static checks:` | 六个最小入口共同固定参数、退出码、raw保留和safe failure协议 |
| `CB-SBX-03A` | `feat(config): add strict typed sandbox configuration loading` | `Add strict source selection, typed loading, and validation for CB-SBX-03A.` | `Raw configuration selection and source precedence:`;`Typed schema and coverage manifests:`;`Strict validation and negative corpus:` | selector、schema、coverage和validator共同保证invalid输入在publication前被拒绝 |
| `CB-SBX-03B` | `feat(composition): assemble atomic profile runtime generations` | `Assemble material-safe complete runtime generations for CB-SBX-03B.` | `Material-safe adapter registry:`;`Profile eligibility and atomic generation:`;`Runtime builder and parity fixtures:` | material、availability、profile和builder必须同代原子发布,不能形成半组合 |
| `CB-SBX-04A` | `feat(intake): add execution context and identity contracts` | `Add the intake and execution identity truth contracts for CB-SBX-04A.` | `Intake command and event contracts:`;`Context, execution identity, reference, and audit truth:` | Command 1目标、状态、identity和safe relay / audit carrier需在contract-domain增量闭口 |
| `CB-SBX-04B` | `feat(intake): open controlled execution contexts atomically` | `Open controlled execution contexts as one atomic slice for CB-SBX-04B.` | `Resolver and repository seams:`;`Intake transaction and stored replay:`;`API entry and integration verification:` | resolver、grouped UoW、replay和entry共同构成首个可验证受理纵切 |
| `CB-SBX-05A` | `feat(boundary): add coherent execution boundary contracts` | `Add the complete coherent boundary contract for CB-SBX-05A.` | `Active identity and boundary requirement carriers:`;`Coherent boundary, handle, and lease truth:` | active identity、四维隔离、workspace requirement、generation、handle和lease必须同步闭合 |
| `CB-SBX-05B` | `feat(boundary): establish coherent execution boundaries atomically` | `Establish coherent execution boundaries as one grouped transaction for CB-SBX-05B.` | `Capability and backend establishment seam:`;`Grouped boundary establishment transaction:`;`API entry and exact-read verification:` | bounded adapter outcome、requirement / decision / boundary / handle / lease原子可见且后序可exact read |
| `CB-SBX-06A` | `feat(policy): add fail-closed policy decision contracts` | `Add body-free fail-closed policy truth for CB-SBX-06A.` | `Policy and authorization carriers:`;`Applicability, decision, and high-risk truth:` | source map、applicability、decision和high-risk state共同定义non-allow语义 |
| `CB-SBX-06B` | `feat(policy): evaluate policy without unauthorized launch` | `Evaluate policy without introducing any backend launch path for CB-SBX-06B.` | `Requirement and policy snapshot reads:`;`Policy decision transaction and zero-launch entry:` | exact prior requirement、one-shot snapshot、decision UoW和entry共同证明backend call为0 |
| `CB-SBX-07A` | `feat(run): launch guarded controlled runs` | `Launch controlled runs only after exact persisted guards for CB-SBX-07A.` | `Run contracts and owner truth:`;`Boundary, handle, lease, and policy guards:`;`Worker and API entry with replay verification:` | run truth只在四类前序truth精确匹配且adapter outcome与UoW同组时成立 |
| `CB-SBX-07B` | `feat(capture): capture body-free execution materials` | `Capture execution materials with honest body-free outcomes for CB-SBX-07B.` | `Capture contracts and owner truth:`;`Capture side effect and material safety:`;`API entry with partial and failed verification:` | adapter outcome、capture status、safe refs和entry必须一起保持Complete / Partial / Failed诚实性 |
| `CB-SBX-07C` | `feat(handoff): deliver captured materials without rollback` | `Deliver captured materials without changing capture truth for CB-SBX-07C.` | `Handoff contracts and owner truth:`;`Delivery adapter and no-capture-rollback transaction:`;`API entry and stored replay verification:` | delivery outcome、owner state、stored replay和source unchanged共同闭合handoff |
| `CB-SBX-08A` | `feat(control): control runs and classify failures conservatively` | `Control runs and preserve conservative failure classification for CB-SBX-08A.` | `Control contracts and worker entry:`;`Failure classification and safety transaction:`;`Conflict, race, and replay verification:` | control影响与failure source marker需同一事务审查,保证single truth和unknown不成功 |
| `CB-SBX-08B` | `feat(safety): enforce cleanup guards and redline containment` | `Enforce guarded cleanup and redline containment for CB-SBX-08B.` | `Cleanup and redline contracts:`;`Guarded destructive seam and containment:`;`Release-zero, retention, and race verification:` | release资格、containment、call budget和resource disposition必须同提交防止guard与副作用分离 |

---

## 3. PH-09~PH-14 Planned Message与Body分组

| Boundary | Default message title | Boundary summary | Semantic body groups | 同提交因果 |
|---|---|---|---|---|
| `CB-SBX-09A` | `feat(query): add typed read-only query contracts` | `Add the complete typed read contract surface for CB-SBX-09A.` | `Query and view carriers with paging:`;`Typed read ports and projection identities:`;`Contract and no-scan fixtures:` | 13 Query共享visibility、page、cursor、marker和typed lookup规则,不能留某族私有contract |
| `CB-SBX-09B` | `feat(query): serve bounded queries without writes` | `Serve all bounded query families with a zero-write facade for CB-SBX-09B.` | `Status query services:`;`Projection and audit query services:`;`API facade and zero-write verification:` | 13 entry共同证明一致disposition、bounded read和write set为0 |
| `CB-SBX-10A` | `feat(consumer): consume trusted events idempotently` | `Consume all trusted inbound event families idempotently for CB-SBX-10A.` | `Trusted consumer schemas and source checks:`;`Deduplication, receipt, and quarantine transaction:`;`Worker groups and replay verification:` | 9 Consumer必须共用trusted-source、dedup、receipt、marker和quarantine协议 |
| `CB-SBX-10B` | `feat(relay): publish stored event snapshots without rollback` | `Publish immutable stored event snapshots without source rollback for CB-SBX-10B.` | `Stored event snapshots and relay append:`;`Publisher adapter and route handling:`;`Relay worker and no-rollback verification:` | 13 payload、source-tx snapshot、relay status和publisher outcome共同闭合outbox链 |
| `CB-SBX-11A` | `feat(jobs): add replayable operations job kernel` | `Add the shared replayable public job kernel for CB-SBX-11A.` | `Job schemas and bounded selection:`;`Per-item orchestration and stored report replay:`;`Job runtime entry kernel:` | 10 Job必须先共享idempotency、selection、partial report、stored replay和entry detail面 |
| `CB-SBX-11B` | `feat(jobs): run collaboration maintenance jobs safely` | `Run collaboration maintenance jobs without source repair for CB-SBX-11B.` | `Relay, reference, and capability maintenance jobs:`;`Handoff retry jobs:`;`Job binaries and partial-report verification:` | 四个协作job只推进formal relay / ref / handoff owner并共享page、UoW和report |
| `CB-SBX-11C` | `feat(operations): run guarded safety and projection jobs` | `Run guarded safety and read-side maintenance jobs for CB-SBX-11C.` | `Lease, cleanup, and redline safety jobs:`;`Projection, derived, and reconciliation jobs:`;`Binaries and no-repair verification:` | no-repair operations在同一boundary汇合,但按高风险batch独立验证guard / truth分离 |
| `CB-SBX-12A` | `feat(protocol): close protocol state and error inventories` | `Close the canonical protocol, state, error, and P0-C owner inventories for CB-SBX-12A.` | `Canonical inventories and expected manifests:`;`Contract, domain, and service gap closure:`;`Unique owner and coverage checks:` | count manifest与实际缺口修复必须在同一baseline冻结,避免编号 / owner漂移 |
| `CB-SBX-12B` | `test(consistency): harden transactions races and source writers` | `Harden P0-C consistency and fixed source writer capabilities for CB-SBX-12B.` | `Transaction and deterministic race hardening:`;`Semantic fake parity and integrity checks:`;`Fixed source writer capabilities:` | 14 TXN、19 race、parity、checks和三source writer共同证明P0-C一致性与source真实性 |
| `CB-SBX-13A` | `feat(qualification): bind immutable candidate identity` | `Bind one immutable qualification candidate packet before probing for CB-SBX-13A.` | `Immutable candidate packet and adapter binding:`;`Zero-launch preflight and identity checks:`;`Credential and material safety fixtures:` | adapter只有在同一不可替换packet完成preflight后才可进入probe boundary |
| `CB-SBX-13B` | `test(qualification): add backend conformance qualification harness` | `Add the complete backend conformance harness for CB-SBX-13B.` | `Backend conformance case groups:`;`P0Q source writer and identity checks:`;`Teardown, redaction, and cleanup disposition:` | CONF、identity、raw、product disposition与lab teardown必须绑定同一qualification packet |
| `CB-SBX-14A` | `ci(gates): orchestrate release gates and integrity checks` | `Orchestrate all gate roles and integrity checks for CB-SBX-14A.` | `PR, MAIN, OPS, and P0Q gate orchestration:`;`RELEASE, P1, and scope selection:`;`Nine integrity checks:` | 7 gate的status传播、四source顺序、P1 /scope选择和9 check必须共享selector语义 |
| `CB-SBX-14B` | `feat(evidence): materialize canonical evidence and reports` | `Materialize canonical fixed-run evidence and reports for CB-SBX-14B.` | `Machine schema families:`;`Evidence slot allocation and pairing:`;`Run, gate, and evidence renderers:` | renderer只有消费同一canonical raw、slot allocation和pairing guard才不会静态补洞 |
| `CB-SBX-14C` | `feat(acceptance): generate reviewable acceptance handoff drafts` | `Generate non-adjudicating acceptance handoff drafts for CB-SBX-14C.` | `Handoff and VETO drafts:`;`Risk and open-issue drafts:`;`Review index and conditional scope audit:` | 四draft和review入口是同一RELEASE packet的无裁决投影,必须共同防止预填结论 |

---

## 4. PH-01~PH-08 Evidence引用与Commit时机

| Boundary | Evidence / review引用 | 只有何时才允许Commit Gate | 禁止用作证明 |
|---|---|---|---|
| `CB-SBX-01A` | boundary ledger中的Cargo metadata / workspace / dependency graph / git identity direct checks和`no_runtime_artifact`理由 | HDO、目标仓、target version、core revision、only-core graph与workspace checks均真实关闭 | 空run、ARCH结果、业务行为 |
| `CB-SBX-02A` | boundary ledger中的SUITE-SBX-001 contract slice与6 /6 carrier断言 | body-free typed refs / metadata / status / error roundtrip及negative checks通过 | run report、业务DTO /状态 |
| `CB-SBX-02B` | boundary ledger中的rollback / version / three-channel replay / semantic fake traces | UoW all-or-nothing、loser visibility、stored replay和fake parity均闭合 | 237主case、具体command结果 |
| `CB-SBX-02C` | `artifacts/test/<run_id>` fixture raw + `reports/runs/<run_id>/summary.md`及fixture detail | RFC 8785方案已关闭且canonical / digest / path / redaction roundtrip配对成功 | source role、EV、业务suite |
| `CB-SBX-02D` | `summary.md`,`redaction-check.md`,`dependency-boundary.md`,`report-audit.md`及对应synthetic raw | Shell rule / lint关闭,六个入口syntax、missing-input、nonzero和safe-output通过 | RELEASE、acceptance、静态pass |
| `CB-SBX-03A` | SUITE-SBX-003 report、`dependency-boundary.md`,`redaction-check.md` | 40 /101 /44 coverage与unknown /duplicate /ambiguous /unsupported负向语料全部按strict semantics通过 | implicit default、partial publication |
| `CB-SBX-03B` | config / material / parity suite reports及targeted redaction / scope report | material descriptor、P01~05 eligibility、availability与complete generation原子发布通过 | concrete candidate、P06 /P07 claim |
| `CB-SBX-04A` | SUITE-SBX-002 /004 intake contract-domain reports与redaction report | Command 1 schema、STA / ERR、factory和body-free event payload闭合 | transaction / API成功事实 |
| `CB-SBX-04B` | intake service / consistency / error / audit reports及`report-audit.md` | resolver、grouped UoW、rollback、duplicate、stored replay和entry mapping通过 | PH-05+能力、真实相邻仓集成 |
| `CB-SBX-05A` | boundary state / protocol / error reports与redaction report | active identity、四维隔离 + workspace requirement、coherent set、handle / lease和weak rejection通过 | backend side effect、P0-Q资格 |
| `CB-SBX-05B` | boundary / consistency / config / audit reports及parity / redaction / report audit | capability outcome、I065、grouped rollback、exact reads、call budget和no weak fallback通过 | real candidate、policy、run |
| `CB-SBX-06A` | policy state / protocol / error reports与redaction report | body-free carrier、missing / stale / conflict / unsupported均非Accepted且state闭合 | local allowlist、backend launch |
| `CB-SBX-06B` | policy / replay / consistency reports及redaction / status fidelity / report audit | exact requirement、one-shot snapshot、duplicate、UoW及所有non-allow backend call=0通过 | run、旧Accepted复用 |
| `CB-SBX-07A` | run / replay / consistency / audit raw与suite / pairing reports | exact boundary / handle / persisted lease / policy guard、duplicate no-relaunch和UoW通过 | tool semantics、agent loop、real candidate |
| `CB-SBX-07B` | capture / material / audit raw与suite / redaction / report audit | Complete / Partial / Failed / Unavailable、no-body、no-recapture和rollback诚实通过 | Artifact / Observability truth、handoff |
| `CB-SBX-07C` | handoff / relay / replay raw与suite / pairing / redaction reports | target identity、Delivered / Retryable / Failed、source unchanged和stored replay通过 | downstream accepted truth、retry job |
| `CB-SBX-08A` | control / failure / race / replay reports与report audit | conflict、single winner、known / unknown分类和保守传播通过 | runtime recovery orchestration、cleanup |
| `CB-SBX-08B` | cleanup / redline / containment raw与redaction / cleanup / report audit | guard-first、non-Allowed release=0、retention / redline和resource disposition通过 | force cleanup、风险接受、材料删除 |

---

## 5. PH-09~PH-14 Evidence引用与Commit时机

| Boundary | Evidence / review引用 | 只有何时才允许Commit Gate | 禁止用作证明 |
|---|---|---|---|
| `CB-SBX-09A` | query contract / protocol reports及dependency / redaction report | 13 /13 view、selector、cursor、marker、typed lookup、no-scan contract通过 | query service、write / repair |
| `CB-SBX-09B` | query / protocol / boundedness / `report-audit.md` | QRY-001~026、RACE-019、bounded reads、visibility和mechanical write set=0通过 | refresh / rebuild / audit append |
| `CB-SBX-10A` | consumer / protocol reports及redaction / report audit | 9 /9 trusted source、schema、dedup、receipt、quarantine、rollback和duplicate owner-call通过 | outbound publish、core success |
| `CB-SBX-10B` | event / relay / protocol reports及pairing / redaction integrity | 13 stored payload、source-tx snapshot、route、retry / dead-letter和source no-rollback通过 | current-state payload rebuild、real topic |
| `CB-SBX-11A` | job / protocol reports及report audit | 10 /10 input、bounded selection、per-item result、partial / failed report与stored replay通过 | concrete maintenance、scheduler |
| `CB-SBX-11B` | job / operations reports及pairing / redaction | JOB-001~004、bounded page、per-item UoW、duplicate call=0、no rollback和honest partial通过 | cleanup / projection /source repair |
| `CB-SBX-11C` | job / OPS-targeted reports及cleanup / redaction / report audit | JOB-005~010、guard-first、atomic report、resource disposition、no core / query repair通过 | force release、latest scan、真实调度 |
| `CB-SBX-12A` | suite reports、`tc-coverage.md`,`protocol-inventory.md`,`per-coverage.md` | 55 protocol、30 owner machines /31 canonical enum entries /39 shared declarations、38 error、254 expected、237 P0-C owner均无missing /duplicate /换义 | 新协议 /状态 /错误、candidate |
| `CB-SBX-12B` | fixed source writer raw / report能力及`summary.md`,`gate-results.md`,coverage / inventory / integrity reports | 14 TXN、19 race、fake parity、双MAIN role、OPS、schema / pairing / status propagation能力通过 | source run存在 /Passed、RELEASE |
| `CB-SBX-13A` | qualification identity / preflight fixture raw与run-root targeted report | 单一candidate packet的ADR /revision /P05 /ENV-05 /generation /template /capability /provider /material /lab全部关闭且missing call=0 | CONF结果、probe、credential入仓 |
| `CB-SBX-13B` | SUITE-SBX-013 report、qualification / identity / redaction / cleanup / report-audit材料 | 同一packet下CONF-001~013 harness、status、redaction、product disposition和lab teardown闭合 | 静态qualification、P1、无identity launch |
| `CB-SBX-14A` | `reports/runs/<run_id>/gate-results.md`及redaction / dependency / report audit fixture reports | 7 /7 gate、9 /9 check、四source固定顺序、Blocked传播、P1 /scope selector通过 | RELEASE Pass、EV、acceptance verdict |
| `CB-SBX-14B` | `summary.md`,`gate-results.md`,`evidence-index.md`,`evidence/<evidence_id>.md`及coverage / integrity reports | 九schema、21 /21 slot、canonical digest、pairing、allocation和renderer status fidelity通过 | 无raw EV、静态alias、acceptance decision |
| `CB-SBX-14C` | 四份`reports/acceptance/*.md` draft fixture与`reports/review/*`入口检查;同run fixture报告 | generator只生成同一RELEASE绑定draft,254 /16 /7 scope完整且无verdict /接受 /review /signature预填 | 真实review、risk acceptance、最终签署 |

---

## 6. Planned Type Override规则

| Actual diff主语 | 允许override | 条件 | 不允许 |
|---|---|---|---|
| 首次实现计划增量 | 使用矩阵default | staged diff与boundary目标一致 | 改成模糊`chore`规避review |
| 修复同boundary已记录失败 | `fix(<same-scope>)` | 有失败evidence,无新增contract / state /scope | 借fix引入后序能力 |
| 纯测试 / harness补强 | `test(<same-scope>)` | 生产语义不变且该补强仍是当前boundary完整目标 | 把生产逻辑隐藏在test commit |
| 纯CI / script编排 | `ci(<same-scope>)` | 只适用于automation / gates等正式scope | 业务semantics进入脚本 |
| 纯内部重构 | `refactor(<same-scope>)` | behavior、status、artifact和public contract均不变 | 迁移状态 /错误 /输出仍称refactor |

任何scope变化、跨boundary文件 /行为或breaking change都不是type override问题,必须暂停并回写Step 6 / Step 11。

---

## 7. 32 /32映射机械审计

| 审计项 | 结果 |
|---|---|
| Step 6 boundary数量 | 32 |
| Planned title数量 | 32 |
| Exact summary数量 | 32 |
| Semantic group映射 | 32 /32 |
| 同提交因果 | 32 /32 |
| Evidence / review引用 | 32 /32 |
| Commit时机 | 32 /32 |
| 明确禁止证明 | 32 /32 |
| Scope来自主件闭集 | 32 /32 |
| 是否填入真实hash / run / result | 否 |

当前矩阵已完成并通过32 /32集合审计。未获用户确认前不得将planned title写成`committed_message`或进入Step 12。
