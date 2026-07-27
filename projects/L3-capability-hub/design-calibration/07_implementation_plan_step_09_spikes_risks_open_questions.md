# L3-capability-hub 07 实施计划 Step 9：Spike、风险与待确认事项

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 9
> 书写规范: `standards/document/实施计划书写规范.md` §5.9
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 风险权威: formal `03` §17、formal `04` §14、formal `05` §14、formal `06` §13
> 回填章节: `projects/L3-capability-hub/07-实施计划.md` §9
> 输入: Steps 1、5、6、7、8 及 active 00~06 risk/reopen registers
> 创建日期: 2026-07-26
> 当前模式: full-restart / continuous execution

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 9 定义 Spike、风险与待确认事项 |
| 当前状态 | completed_continuous_execution |
| canonical risk set | `CH-TEST-R01..R16`；保持 formal `05/06` identity |
| additional local debt | `CH-DOC-EVIDENCE-INDEX-PATH-001`；已在T071清零 |
| planned spikes | 8；均有触发条件、输出、deadline和禁止结论 |
| current upstream blocker | `0` |
| implementation blockers | target repo、tooling/harness、formal 07 + ledgers；按 scope 阻塞 |
| accepted residual | `0`；本 Step 不创建 risk acceptance |
| 下一动作 | 进入 Step 10，定义 rollback、pause 和 change control |

## 2. 本步输入与 SOP 问题回答

| 输入 | 用途 | 当前结论 |
|---|---|---|
| Step 1 authority risks | 避免历史文档/README成为实施输入 | formal 00~06优先；README到T070裁决 |
| Step 5 phase graph | 绑定风险影响范围和deadline | 风险按 `PH-01..11` 与 boundary 截止 |
| Step 6 boundary graph | 风险不得长期悬空 | 每个 blocking item在受影响 boundary 开工前解决或暂停 |
| Step 7 gate/evidence | 识别 evidence/VETO/redaction/dependency 风险 | no-static、same-run、denominator和review是硬门禁 |
| Step 8 dependency/config | 识别 repo/product/TLS/environment 风险 | P0 prerequisite与P1 selected严格分层 |
| formal `03/04` risk/reopen | 保留 debt、product/backend controlled reopen | 实现者不得临场改 schema/Port/state/config |
| formal `05/06` risk acceptance | 保留16个canonical risk ID和不可接受条件 | 当前 accepted residual仍为0 |

本步回答：

1. **哪些点需要 Spike？** 只有无法仅靠现有文档证明、且会影响 boundary/gate 的兼容性或产品能力：core bytes/wire、durable authority、external adapter/source/route、credential/TLS、observer backend、evidence pipeline、release aggregation。
2. **哪些会阻塞 phase？** target repo/core/toolchain阻塞PH-01；设计闭环/fake parity阻塞对应功能boundary；redaction/dependency/evidence/VETO阻塞PH-11；selected产品只阻塞声明required的selected/release scope。
3. **哪些待确认影响 boundary 或验收？** repo/git baseline、dependency compatibility、selected scope/products/TLS/backend、actual review roles、operations retention/cutover以及numeric claim。
4. **Spike 输出是什么？** compatibility matrix、fixture diff、bounded proof harness、typed failure matrix、dry-run raw/report审计或明确的controlled-reopen patch list；不能只写“可行”。
5. **风险处理与截止？** §5 canonical register和§6 open questions逐项绑定phase/boundary/trigger，不使用无期限“后续确认”。
6. **哪些必须回写上游？** 任何 public field/type/Port/protocol/state/TX/config/evidence schema/acceptance authority变化，必须回写 owning formal/calibration；产品私有适配且不改contract则留infra boundary。

## 3. 分类、诊断与取舍

### 3.1 Closed classification

| 分类 | 含义 | 当前处理 |
|---|---|---|
| `resolved` | 当前正式基线已闭合，仅保留历史追溯 | 不进入active blocker count |
| `non_blocking_debt` | 当前有保守合同，跨仓或文档尚未同步 | 监测trigger；变化时受控回开 |
| `implementation_prerequisite` | 设计可继续，实现某scope前必须成立 | 阻塞exact phase/boundary，不冒充design blocker |
| `selected_prerequisite` | 只影响P1 selected或release-required selected claim | P0独立；required时`blocked_dependency` |
| `controlled_reopen` | 当前product-neutral基线有效；触发surface变化时回开 | 只停受影响boundary，除非authority全局变化 |
| `operations_policy_pending` | deployment/retention/SLO/runbook等下游政策 | 不声称operations readiness或numeric pass |
| `future_evolution` | v1后兼容、dual schema、dynamic config等 | 当前reject unknown；trigger后新proposal |
| `out_of_scope_guard` | 不属于Hub truth owner | 禁止以“解决风险”为名吸收责任 |

### 3.2 当前问题诊断

| 问题 | 错误处理风险 | 本 Step 裁决 |
|---|---|---|
| formal `05/06` 风险登记早于当前07进度 | 把已完成formal06仍写成blocker | 更新current disposition，不删除canonical ID |
| 未选产品很多 | 全部变成mandatory Spike阻塞P0 | 只有selected scope触发产品Spike；P0使用closed fake/controlled seam |
| target repo absent | 被误作upstream design冲突 | implementation prerequisite；PH-01前必须解决 |
| 两项L0-core debt | 被伪报resolved或升级全局blocker | 保持non-blocking；dependency delta触发受控回开 |
| evidence pipeline尚未实现 | 空模板被当证据 | `CH-TEST-R04` active；`SP-CH-007`先验证nonpass/provenance |
| actual acceptor/operations owner未命名 | 设计期伪造签署人 | 只固定角色和deadline，真实执行期填授权主体 |
| evidence path单点冲突 | 实现创建两个index authority | 已回写canonical path；旧文件名只作为historical typo，不创建alias |

### 3.3 设计取舍

| 方案 | 结论 | 原因 |
|---|---|---|
| 所有未知都做Spike | 不采用 | 会以探索替代已闭合的直接实现 |
| Spike只针对semantic compatibility和evidence integrity | 采用 | 输出可决定“实现/选型/回开/停止” |
| Spike结果直接并入功能commit | 默认禁止 | 未审查实验代码会污染boundary；Step11另定adoption gate |
| 未选产品阻塞全部P0 | 不采用 | P0是product-neutral typed semantic closure |
| open question无deadline | 禁止 | 未到deadline可保持deferred；到deadline未关闭即暂停对应scope |

## 4. Planned Spike register

Spike 是未来实现期的 bounded proof，不在设计仓执行。若 trigger未发生，可保持`not_triggered`；一旦trigger发生，必须在deadline前输出可审计结论。Spike不得创建正式pass、accepted risk、release evidence或signoff。

| ID | Trigger / technical question | Affected phase / boundary | Required output | Success decision | Failure / uncertainty action | Deadline |
|---|---|---|---|---|---|---|
| `SP-CH-001` | target repo建立后，L0-core package、`IdempotencyKey::as_str()` bytes和shared serde v1是否匹配当前fixture | `PH-01/02`; `01-a`,`02-a` | Cargo metadata、public-surface diff、exact byte/serde fixture comparison、safe compatibility report | 保持current assumption并记录dependency digest | signature/bytes/shape变化则回开`03` Steps 8/13/14并同步`04/05/07` | `commit-02-a`开工前 |
| `SP-CH-002` | 选择Deployment durable authority时能否满足one authority、110 methods、CAS/current/unique、UoW、commit tri-state和linearizable recovery | selected `PH-02..10` | semantic capability matrix、minimal adapter proof、fault/rollback/Unknown results、migration gap list | 产品只进入infra binding，无public semantic变化 | 不满足则拒绝产品或触发`CH-REOPEN-PRODUCT-BINDING-001` | selected durable boundary开工前 |
| `SP-CH-003` | 选择MCP/A2A/API等external source adapter时，是否能只产生body-free typed reference observation | selected `PH-04`; `04-b` | 1-call Port mapping、input/output/failure/redaction matrix、forbidden body proof | 作为configured adapter候选 | 需要execution/body/route/quota/cost字段则拒绝或回开owner design | selected `commit-04-b`前 |
| `SP-CH-004` | 选择真实Worker feeds/trusted actor机制时，能否满足6 source、header/schema/actor-before-body和opaque delivery lifecycle | selected `PH-09`; `09-a` | six-family source matrix、actor authority proof、lifecycle/cleanup/failure harness | 保持source driver private state和existing consumer contract | 需要ack/lease/DLQ进入application或partial activation则拒绝/回开 | selected `commit-09-a`前 |
| `SP-CH-005` | 选择outbound transport时，能否满足10 routes、immutable envelope、A Durable before B且不在Hub保存delivery truth | selected `PH-09/10`; `09-b`,`10-c` | 10-route compatibility、failure/effect proof、capture/intent/replay matrix | 仅物理destination binding | 需要payload rebuild/local queue/attempt truth则拒绝/回开 | selected `commit-09-b`前 |
| `SP-CH-006` | 选择credential/TLS/provider API时，是否满足ref-only、shortest lifetime、revocation/expiry、zero raw material和Deployment TLS规则 | selected `PH-04/09/11` | provider/TLS lifecycle matrix、memory/redaction/fail-closed proof、config material list | 仅constructor-private material | raw secret/public type leakage或fallback要求则拒绝/回开`04` | first selected Configured boundary前 |
| `SP-CH-007` | gate/check/report/evidence pipeline能否从failed/missing/cross-run/static fixtures推导正确nonpass并保留attempt | `PH-11`; `11-a` | 4 builders + 9 checks dry-run raw/report、negative fixture results、pairing/redaction/no-static audit | provenance链可进入正式实现和后续真实run | 任一static pass、worst-status升级或body leak则修复；schema缺口回写`05/06/07` | `commit-11-a`提交前 |
| `SP-CH-008` | concrete observer backend或release aggregation被选择时，private/no-effect instrumentation与compatible lower-run/handoff能否闭合 | `PH-11`; `11-a/11-b` | observer neutrality proof或release lower-run compatibility matrix、review draft schema audit | 不改变business result；release只生成review input | third-party type/public Port/config变化回开observability；run不兼容则release blocked | relevant `11-a` backend adoption或`11-b`开工前 |

### 4.1 Spike execution discipline

| Rule | Requirement |
|---|---|
| isolation | Spike使用独立scratch/boundary batch，不能伪装正式功能完成 |
| scope | 只验证表中question；不得顺手实现runtime execution、approval、method body、marketplace或SDK client |
| output | 必须记录input version/config、commands、safe result、limitations和adopt/reject/reopen decision |
| adoption | 只有design closure、scope、tests和review通过后，必要代码才能按Step11规则进入planned boundary |
| failure | 不得“先merge后补设计”；失败/不确定保持boundary paused |
| evidence | Spike artifact不是canonical TC/EV、release evidence或acceptance proof |

## 5. Canonical risk register

### 5.1 `CH-TEST-R01..R16` current disposition

| Risk ID | Current class / status | Affected phase / scope | Interim rule / mitigation | Stop / reopen trigger | Deadline / owner |
|---|---|---|---|---|---|
| `CH-TEST-R01` | `non_blocking_debt`; active | `PH-02+` key/digest/inbound fixtures | exact `as_str().as_bytes()`；no normalization/Display/serde substitute | L0 signature/byte semantic delta | dependency upgrade及`commit-02-a`前；L0 + Hub contracts |
| `CH-TEST-R02` | `non_blocking_debt`; active | contracts/codec/digest/config/test | lock Hub v1 audited bytes；不声称upstream permanent promise | shared field/tag/newtype/envelope bytes delta | dependency upgrade及`commit-02-a`前；L0 + Hub test |
| `CH-TEST-R03` | `implementation_prerequisite`; active | all implementation phases | target repo/Cargo/git/toolchain preflight；不推断baseline | repo absent、invalid workspace或unknown unrelated changes | `commit-01-a`开工前；repository owner |
| `CH-TEST-R04` | `implementation_prerequisite`; active | `PH-01/11` and all evidence gates | implement gate/check/builder harness with self-test nonpass | static/raw-less/cross-run/worst-status defect | scripts by`01-b`; full proof by`11-a`; test tooling owner |
| `CH-TEST-R05` | `selected_prerequisite`; pending | Deployment persistence and selected parity | P0 fake parity；Deployment no inMemory fallback | selected durable product cannot satisfysemantic matrix | selected staging before R3/R4；architecture/persistence/ops |
| `CH-TEST-R06` | `selected_prerequisite`; pending | 9 adapters/6 sources/10 routes | P0 Configured/Fake/Disabled contracts；selected manifest exact | selected product needsnewpublic semantics or partial graph | relevant selected boundary；dependency/source/collaboration owners |
| `CH-TEST-R07` | `selected_prerequisite`; pending | credential/TLS/security configured boundaries | ref-only、fail-closed、no raw material/fallback | provider API violates lifetime/redaction/Deployment policy | first selected Configured boundary；security/provider |
| `CH-TEST-R08` | `controlled_reopen`; pending | concrete observation implementation | backend-neutral private cut；Off/Redacted/no business effect | backend/config/facade/public type or failure effect changes | before backend adoption in`11-a`; observability/infra |
| `CH-TEST-R09` | `implementation_prerequisite + operations_policy_pending`; active | activation/release/rollback proof | deterministic barriers、immutable artifacts、typed Unknown；no auto-resolution | readiness/cutover needs new semantics or missing owner | `11-b`/real release before; config/release/ops |
| `CH-TEST-R10` | `operations_policy_pending`; pending | numeric performance/capacity/SLO claims | structural P0 gates；record samples only | any numeric pass/SLO/release claim requested | before that claim; product/architecture/SRE/acceptance |
| `CH-TEST-R11` | `operations_policy_pending`; pending | evidence retention/access/deletion | event-based minimum and explicit run roots；no duration claim | release/operations requires retention compliance | before real release handoff; security/ops/acceptance |
| `CH-TEST-R12` | `resolved`; historical | formal acceptance design | formal `06` rebuilt at T053；roles/risk/signoff contract active | only reopened by acceptance authority change | no current deadline; acceptance design owner |
| `CH-TEST-R13` | `implementation_prerequisite`; resolved for design handoff, implementation remains blocked | formal07、implementation ledger、26 skeletons | T063~T069 and T070/T071 completed；no code before repository/baseline handoff | missing formal07/ledger/skeleton or stale boundary | before implementation start; plan owner |
| `CH-TEST-R14` | `operations_policy_pending`; pending | alerts/dashboard/runbook/formal09 readiness | safe profiles only；no production readiness claim | deployment/operations scope becomes required | before real Deployment/release; SRE/security/operations |
| `CH-TEST-R15` | `future_evolution`; pending | post-v1 schema/consumer/config evolution | v1 only；reject unknown schema/hot reload/dynamic source | dual-version/dynamic config requirement appears | future proposal before implementation; design/release |
| `CH-TEST-R16` | `out_of_scope_guard`; active | README/reader/ownership | formal 00~07 outrank README；run responsibility scan | README reintroduces provider/cost/approval/runtime/listing | ongoing; Capability Hub design owner |

### 5.2 Local document consistency debt

| ID | Class | Conflict | Interim rule | Deadline / closure |
|---|---|---|---|---|
| `CH-DOC-EVIDENCE-INDEX-PATH-001` | resolved document consistency debt | formal `05` §9.4和Step9已统一为`evidence-index.md/.json`；旧`evidence-candidates.md`仅为historical typo | canonical path固定`evidence-index.md/.json`；不创建alias/second digest | T071 final audit confirmed closure |

### 5.3 Never-acceptable risk handling

以下事项不能被降级为 residual、waiver 或有条件通过：任一VETO/S/current P0 A、P0 prerequisite缺失、design contradiction、forbidden body/secret、non-core compile dependency、responsibility leakage、silent config fallback、missing denominator、static/raw-less/cross-run/digest-mismatched evidence、fake review/signature或unknown impact。处理只能是修复、复验、受控回开或保持blocked/not_decided。

## 6. Open questions and deadlines

| ID | Question / required confirmer | Current rule before confirmation | Affected phase / boundary | Deadline / overdue action |
|---|---|---|---|---|
| `OQ-CH-001` | target repo由repository/implementation owner如何创建、初始化和保护用户改动 | 不创建替代仓、不写代码、不声称git facts | `PH-01`; `01-a` | `01-a`开工前；未确认则pause |
| `OQ-CH-002` | target repo branch/worktree、project git identity和initial baseline由repository owner确认 | implementation ledger保持preflight pending | first commit | first commit前；未确认不得commit |
| `OQ-CH-003` | L0-core package/public bytes/wire compatibility由L0 + Hub contracts owner确认 | current exact assumptions + debts | `02-a` | `02-a`开工前；delta触发`SP-CH-001`/reopen |
| `OQ-CH-004` | current release manifest是否要求P1 selected scope，由release/acceptance owner确认 | P0与selected分离；未声明即不形成selected claim | `PH-11`; `11-b` | lower-run manifest冻结前；required unresolved=>blocked |
| `OQ-CH-005` | durable product/schema/migration由architecture/persistence/ops选择 | Local/Integration fake parity；Deployment readiness不声称 | selected `PH-02..10` | selected staging前；未选则selected blocked |
| `OQ-CH-006` | 9 adapter、6 source、10 route产品由dependency/source/collaboration owners选择 | P0 fake/disabled；Configured无fallback | selected `04-b/09-a/09-b` | relevant selected boundary前；未选则不执行selected |
| `OQ-CH-007` | credential/TLS/provider material由security/provider owner选择 | ref-only、fail-closed、Deployment configured rules | selected configured boundaries | first selected Configured boundary前；未选则blocked |
| `OQ-CH-008` | concrete observer backend/facade由observability/infra owner选择 | private backend-neutral cut；Off/Redacted profiles | `11-a` if adopted | adoption前；surface change触发reopen |
| `OQ-CH-009` | actual acceptance/review/risk/signoff主体由authorized owner指派 | 只生成pending-review draft，无名字/签名/时间 | `11-b` / real acceptance | handoff review前；未指派保持not_decided |
| `OQ-CH-010` | artifact storage/permissions/retention/cutover/runbook由ops/security/release owner确定 | run-scoped local contract；no retention/readiness claim | real release/Deployment | real release前；未确认不进入release claim |
| `OQ-CH-011` | 是否需要numeric SLO/capacity verdict，由product/architecture/SRE/acceptance确认 | structure-first；numeric `not_evaluated` | `PH-11` or future ops | claim提出前；无baseline不得pass/fail |
| `OQ-CH-012` | future dual-schema/dynamic config是否成为需求，由architecture/design确认 | v1-only；unknown/dynamic/hot reload reject | future evolution | proposal进入scope前；必须重开design |

### 6.1 Open-question closure record contract

未来关闭一项问题至少记录：question ID、confirmer role、decision、affected phase/boundary、source/ADR/design refs、effective baseline、reopen trigger和date/provenance。设计期不填真实人名、签名、commit或执行时间。

## 7. Upstream writeback and controlled-reopen matrix

| Trigger | First authority | Required action | Forbidden shortcut |
|---|---|---|---|
| core shared type/bytes/wire delta | `03` contracts/codec/digest | reopen DDD Steps 8/13/14/16 and sync `04/05/07` | copied replacement、Display/JSON guess |
| new/changed public field/type/variant/Port/callable | `03` exact owning Step | stop boundary；update declaration, flows, state/TX/tests and Rustdoc | private workaround或undocumented field |
| new state/transition/error/retry semantic | `03` Steps 10~13 | update matrix/mapping/test/acceptance | generic Other/error text parsing |
| config key/profile/source/binding/fallback change | formal `04` | reopen relevant config Steps and downstream tests/plan | entry-local flag/env invention |
| product cannot satisfy Port/UoW/lifecycle | architecture + `03/04` | reject product or controlled reopen affected surface | sleep/retry/cache/partial graph compensation |
| observer backend changes public/business surface | `03` Step14/15 + `04` | reopen exact owner; preserve no-effect | new ObservabilityPort/state/repository |
| TC/DS/EV/suite/check/builder/evidence schema change | formal `05` | update canonical owner/manifest and `06/07` | new IDs in implementation only |
| AC/VF/VETO/risk/signoff authority change | formal `06` | acceptance design reopen and downstream sync | script auto-verdict/acceptance |
| phase/boundary/scope/dependency order change | formal `07` Step5~12 | update flow/formal07/ledger/all affected skeletons | implementation agent ad hoc merge/split |
| runtime/tools/approval/method body/marketplace/provider/SDK ownership request | formal `00/01/02` owner boundary | reject or restart upstream scope | hide in adapter/config/job/report |

## 8. Risk / Spike stop-review and cross-risk audit

### 8.1 Stop-review

| Review item | Result | Notes |
|---|---|---|
| Spike bounded and output-defined | `8/8 pass-designed` | trigger、output、decision、failure、deadline完整 |
| canonical risk identity preserved | `16/16` | 未另造平行acceptance risk set |
| current disposition updated | pass-designed | R12 historical resolved；R13 design-handoff prerequisite resolved；implementation prerequisites remain blocked |
| phase/boundary binding | pass-designed | active risk和Spike均有exact scope/deadline |
| open questions have deadline | `12/12` | overdue action均为pause/blocked/reopen |
| upstream writeback triggers | `10` classes | public/config/test/acceptance/plan/owner均闭合 |
| accepted residual fabricated | `0` | no acceptor/evidence/decision/signature |
| unresolved upstream design blocker | `0` | implementation/selected/ops事项按scope分类 |

### 8.2 Cross-risk audit

| Audit | Result | Gap / action |
|---|---|---|
| target repo/core/toolchain | covered | R03、SP01、OQ01~03 |
| design closure/Rustdoc | covered | controlled-reopen matrix；boundary preflight |
| fake parity/query/job no-repair | covered | R04/R05/R06 and Step7 gates |
| persistence/product/TLS/external products | covered | R05~R07；SP02~06 |
| observability backend/no-effect | covered | R08；SP08/OQ08 |
| evidence/provenance/no-static | covered | R04；SP07/08；document path debt |
| numeric/retention/operations | covered | R09~R11/R14；OQ10/11 |
| formal07/ledgers | covered | R13 handoff artifact closure verified at T071 |
| future schema | covered | R15/OQ12 |
| README historical leakage | covered | R16 remains an ongoing responsibility guard after T070 |
| out-of-scope ownership | covered | reopen matrix final row |
| long-lived unowned question | `0` | every question has role/deadline/interim rule |

## 9. 回填草稿

> 校准来源：
> - `design-calibration/07_implementation_plan_step_09_spikes_risks_open_questions.md` §4~§8

正式 `07-实施计划.md` §9 应保留8个triggered Spike、`CH-TEST-R01..R16` current disposition、`CH-DOC-EVIDENCE-INDEX-PATH-001`和12项open question。Spike只证明compatibility、product fit或evidence integrity，不替代正常功能实现；失败或不确定必须暂停、拒绝产品或回写真相源。

当前没有unresolved upstream design blocker，也没有accepted residual。目标仓、harness和formal07/ledger是implementation prerequisites；durable/external/TLS是selected prerequisites；observer是controlled reopen；numeric/retention/runbook是operations policy；future schema和README是future/out-of-scope guards。任一VETO/S/P0-A/evidence/dependency/redaction/config hard failure不得风险接受。

## 10. Step 9 完成记录

| 项目 | 状态 |
|---|---|
| Step 9 设计产物 | completed_continuous_execution |
| planned spikes | 8/8 bounded；未执行 |
| canonical risks | 16/16 classified；R12 historical resolved，R13 design-handoff prerequisite resolved；implementation prerequisites remain blocked |
| local document debt | 0；`CH-DOC-EVIDENCE-INDEX-PATH-001` resolved at T071 |
| open questions | 12/12 owner/deadline/interim rule完整 |
| controlled-reopen classes | 10 |
| accepted risk / execution fact | 0 / 0 |
| unresolved upstream blocker | 0 |
| next step | Step 10 回退、暂停与变更控制 |
