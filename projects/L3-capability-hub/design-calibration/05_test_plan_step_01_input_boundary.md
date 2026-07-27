# L3-capability-hub 05 测试方案 Step 1：确认测试输入边界

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 1
> 回填章节：`projects/L3-capability-hub/05-测试方案.md` §1
> 创建日期：2026-07-25
> 当前模式：full-restart / continuous execution
> 状态：`05_step_01_completed_continuous_execution`
> 真实性边界：本文只确认测试设计输入与边界；未创建或执行测试，未生成 TC/EV/run_id/artifact/report/signoff/commit。

---

## 1. 本步目标、输入与输出

| 项目 | 本步结论 |
|---|---|
| 目标 | 判断 active formal 00~04 是否足以启动新版测试方案，并固定测试方案必须回答与不得回答的问题 |
| 输入 | 测试方案 SOP/书写规范、active formal 00~04、DDD Step 16、configuration Steps 11/12、old formal 05/06、README、reference flows |
| 输出 | authority/input map、historical-material disposition、must-answer / must-not-answer lists、upstream impact/blocker gate、formal §1 draft |
| 不做 | 不定义测试目标优先级、cut inventory、layer、TC/EV、数据、环境、CI、阈值、报告、验收或实施顺序 |

## 2. 必读输入与读取结论

| 输入 | 读取内容 | 权威裁决 | 本步使用边界 |
|---|---|---|---|
| `standards/document/测试方案讨论流程_SOP.md` Step 1 | 五问、三项输出和下一步条件 | normative process | 只确认输入和边界，不提前进入 Step 2~15 |
| `standards/document/测试方案书写规范.md` §§1~4 | 15 章主链、source block、TC/EV 与 evidence path contract | normative result structure | formal 05 只能 Step 15 装配 |
| `00-需求文档.md` §§2~16 | 定位/边界、能力闭环、故事、FR/BR、数据、接口、NFR、验收方向、风险与追溯 | active requirement authority | 不修改需求编号、目标、阈值或验收语义 |
| `01-架构设计.md` §§3~16 | constraints、responsibility、context/container、dependency、data/consistency、interaction、cross-cutting、risk/traceability | active architecture authority | 不重选产品、依赖或一致性方案 |
| `02-概要设计.md` | component/object/interface/flow/state/error/config outline | active HLD authority | 只提取 testable outline，不自行补代码契约 |
| `03-详细设计.md` §§3~15 | 7 module、43+7 object/helper、36 Port、22/110 repository、250 protocol、83 flow、24/111/638 state、transaction/error/idempotency/config/observation/test cuts | active code-contract authority | exact field/variant/method/state/error/phase/oracle names不得由05改写 |
| `03_ddd_step_16_test_cuts.md` §§1~18 | exact minimum cuts、fake seams、oracle precedence、future static/gate/report contract | normative cut source | Step 3/6 承接；当前不把 cut 当完整 case 或执行结果 |
| `04-配置设计.md` §§5~14 | source/profile/items/secrets/V0~V8/Stage 0~7/barrier/failure/change/evolution/risk/handoff | active config authority | key/default/profile/failure/fallback 不得被测试方案改写 |
| `04_config_step_11_failure_degradation.md` | `CFG-F-01..18`、24 failure modes、domain/layer failure behavior | exact config failure source | Step 3/6/8/10 承接，当前只登记输入 |
| `04_config_step_12_downstream_handoff.md` | 05 minimum objects/oracles、06 gate candidates、future evidence lifecycle | exact downstream source | 不分配真实 evidence 或声称 gate evaluated |
| old formal `05/06` and README | legacy objects/TC/topology/acceptance and responsibility pollution | historical material | negative-diff input only |

## 3. SOP 五问回答

| SOP 问题 | 收口答案 |
|---|---|
| 1. 当前测试方案承接哪些需求、规则和 NFR？ | 承接正式 00 的 capability identity、registry、adapter descriptor、governance seam、method relation、formal SDK/runtime exposure、controlled view、trace/impact/reference，以及全部正式 FR/BR/NFR、数据/接口/依赖/验收方向；编号和语义保持原样。 |
| 2. 哪些概要/详细设计章节直接影响测试对象？ | HLD 全部 component/object/interface/flow/state/error/config outline；DDD §§3~15 的 module/object/Port/repository/protocol/flow/state/transaction/error/idempotency/config/observability/test-cut contract；配置 §§5~13 的 source/profile/item/security/assembly/change/failure/evolution。 |
| 3. 哪些验收项需要 05 提供证据？ | 正式 00 §14 的 capability closure、rules/data/dependency/NFR/veto directions，以及 formal 03/04 的 exact contract、no-write/no-body/no-fallback/atomicity/error fidelity/profile isolation/redaction/Rustdoc redlines。05 定义 evidence producer contract，06 后续裁决。 |
| 4. 哪些内容不应在 05 重新定义？ | requirement/architecture、object/field/variant/Port/method/DTO/flow/state/transaction/error/config key/profile、product topology、acceptance threshold/veto/signature、implementation phase/commit boundary。 |
| 5. 是否存在阻塞测试设计的上游缺口？ | 否。active 00~04 与 exact cut sources 足够开始 Step 2。目标实现仓、产品和真实环境缺失是 execution prerequisites；old 06 未重建是 downstream work，不是 Step 1 blocker。 |

## 4. 上游输入映射

| Source | Stable test input | Primary formal 05 destination | Later consumer |
|---|---|---|---|
| formal 00 §§2~4 | ownership、goals/non-goals、scope redlines | §§1~2 | coverage、negative responsibility cases、acceptance veto |
| formal 00 §§5~10 | actors、dependencies、capability loop、stories、FR/BR | §§2/3/5/6 | TC matrix and functional evidence |
| formal 00 §§11~12 | body-free data ownership、interfaces/dependency types | §§3/5/6/7/8 | data fixtures、Port/integration oracles |
| formal 00 §§13~14 | NFR and acceptance directions | §§5/10/12/13 | non-functional plan and future 06 gates |
| formal 00 §§15~16 | risks/open items and traceability | §§5/14 | residual-risk and regression triggers |
| formal 01 §§3~8 | constraints、responsibility、context/container/dependency | §§1~5/8 | static dependency and topology cuts |
| formal 01 §§9~13 | data/consistency、communication、mechanisms、cross-cutting | §§3~10 | transaction/integration/security/observation cuts |
| formal 01 §§14~16 | evolution、risk、requirement trace | §§5/14 | reopen and residual-risk matrix |
| formal 02 | components、objects、interfaces、flows、states、errors、config handoff | §§3~6 | test-object completeness audit |
| formal 03 §§3~6 | coding/Rustdoc、7 modules、43+7 objects、36 Ports、22/110 repositories、250 protocols | §§3~7/9 | static/unit/contract test plans |
| formal 03 §§7~8 | 26 C + 33 Q + 6 I + 10 O + 8 J exact protocols/flows | §§3/5/6 | stable TC families and effect oracles |
| formal 03 §9 | 24 families / 111 variants / 638 pairs | §§3/6/7 | generated/table-driven state cases |
| formal 03 §§10~12 | persistence/UoW/error/idempotency/concurrency/reentry | §§3/6/7/10 | deterministic failure/race/crash cases |
| formal 03 §§13~14 | config/binding and 155+3 observer profiles | §§3/6/8/10 | binding/redaction/no-cancellation cases |
| formal 03 §15 + DDD Step 16 | minimum cut identities and oracle precedence | §§3~6 | complete cut-to-case expansion |
| formal 04 §§5~11 | strict sources、18/27/21 inventory、profiles、security、assembly、24 failures | §§3/6/7/8/10 | parser/config/activation/failure test families |
| formal 04 §§12~14 | downstream handoff、evolution、17 risks | §§5/12/13/14 | evidence/entry-exit/regression/risk contracts |
| old formal 06 | historical acceptance directions only | none as authority | T038+ rebuild after formal 05 |

## 5. 测试方案必须回答的问题

| ID | Mandatory question | Owning Step / formal chapter |
|---|---|---|
| `TP-MUST-01` | 哪些 active requirements/design/config contracts属于本轮 P0/P1/P2 测试范围？ | Step 2 / §2 |
| `TP-MUST-02` | 每个 module/object/protocol/flow/state/transaction/config/observer 的 test cut 是什么，在哪个最小层发现风险？ | Steps 3~4 / §§3~4 |
| `TP-MUST-03` | 每个 requirement/rule/NFR/design/config cut如何映射到 planned TC、oracle和evidence class？ | Step 5 / §5 |
| `TP-MUST-04` | 每个 P0 cut 的 exact precondition、action、positive/negative/boundary branch、typed/effect oracle是什么？ | Step 6 / §6 |
| `TP-MUST-05` | synthetic data如何覆盖valid/invalid/boundary/race/crash且不泄露body/secret？ | Step 7 / §7 |
| `TP-MUST-06` | Local/Integration/Deployment及fake/configured/disabled/missing在何种product-neutral topology中测试？ | Step 8 / §8 |
| `TP-MUST-07` | 哪些planned suites进入PR/nightly/integration/release gate，缺失/失败如何阻断？ | Step 9 / §9 |
| `TP-MUST-08` | security/performance/reliability/concurrency/recovery/compatibility/observability专项如何验证？ | Step 10 / §10 |
| `TP-MUST-09` | defect severity、retest impact和closure evidence规则是什么？ | Step 11 / §11 |
| `TP-MUST-10` | test-design readiness、execution entry/exit和missing evidence如何判定？ | Step 12 / §12 |
| `TP-MUST-11` | future artifact/report/evidence schema、producer/consumer/path/redaction/retention是什么，且如何避免伪造？ | Step 13 / §13 |
| `TP-MUST-12` | 变更触发哪些最小/全量回归，哪些风险仍未执行或需产品/环境确认？ | Step 14 / §14 |

## 6. 测试方案不再回答的问题

| Forbidden decision | Authority / owner | 05 allowed treatment |
|---|---|---|
| Hub 是否拥有 runtime/tools execution、marketplace listing、governance approval、method body、provider cost/routing、SDK client/cache | formal 00/01 | 只做责任泄漏负向断言，不做正向 E2E |
| object/field/variant/Port/method/DTO/event/state/error/phase schema | formal 03 | exact引用；缺口则停止并回写03 |
| config key/default/source/profile/fallback/hot-reload semantics | formal 04 | exact引用；不从fixture/CI反向定义 |
| DB/bus/KMS/Vault/telemetry/CI vendor和真实endpoint/credential | future architecture/07/09 | product-neutral seam、preflight和not-executed状态 |
| acceptance pass threshold、veto裁决、risk acceptance、signer | future formal 06 | 只提供planned evidence和test exit input |
| implementation batch、commit boundary、开发顺序、rollback执行 | future formal 07 and implementation ledger | 只提供gate/command/path prerequisites |
| real run_id、artifact digest、evidence alias、test result、coverage、performance number | real test execution/report process | 文档中只允许placeholder/contract/not_executed |

## 7. Historical-material contamination audit

| Historical claim | Current conflict | Decision |
|---|---|---|
| `ProviderContract`/`CapabilityDecision`/`CostRecord` as Hub truth | current identity/registry/descriptor/relation/exposure model has different ownership | exclude; no alias |
| MCP/A2A provider execution, KMS/Vault operation, cost backlog | execution/security/cost responsibilities are outside Hub | negative leakage only |
| marketplace/runtime/tools as Hub-controlled E2E consumers | Hub owns only body-free refs/exposure/controlled views | test Hub boundary, not downstream product behavior |
| local PG/fake secret store/bus/staging topology | products and target repo are unselected | discard topology; Step 8 rebuilds product-neutral matrix |
| old `TC-001..012`, “all P0 passed”, evidence index | no current source/oracle/run provenance | historical IDs/results; never reused |
| old 12-section formal shape | current standard requires 15 chapters and per-chapter source blocks | replace only in Step 15 |

Historical contamination accepted into the new input baseline: `0`.

## 8. 输入充分性、缺口与影响判定

| Item | Classification | Blocks next Step? | Current treatment |
|---|---|---|---|
| active 00~04 formal chain | complete design input | no | sole positive authority |
| DDD/config cut sources | complete minimum cut input | no | Step 3 expands inventory; Step 6 assigns cases |
| old formal 06 not rebuilt | downstream_work | no | only 00 acceptance direction + future evidence consumer placeholder |
| target repository absent | implementation_prerequisite | no for design; yes for execution | do not name existing test files/commands/results |
| product/topology/credentials unselected | implementation/operations prerequisite | no for product-neutral design | Step 8/14 retain exact blocking scopes |
| L0-core two design-sync debts | non_blocking_debt | no | preserve assumptions and trigger-based reopen |
| missing formal oracle discovered later | potential design blocker | conditional | stop affected cut and reopen exact 03/04 owner |

| Current conclusion | Changes 00~04? | Impact type | Treatment |
|---|---|---|---|
| use active formal 00~04 as sole positive source | no | source governance | 无回写 |
| isolate old 05/06/README | no | historical disposition | 无回写 |
| retain exact DDD/config inventories and oracle precedence | no | test translation | 无回写 |
| defer product/repo/environment execution facts | no | downstream prerequisite | 无回写 |

Current `待回写=0`, `阻塞待确认=0`, unresolved upstream blocker=`0`.

## 9. Formal §1 回填草稿

正式 `05-测试方案.md` §1 在 Step 15 应写入：

1. active formal 00~04 与 exact DDD/config cut sources 的 authority chain；
2. requirement/architecture/HLD/DDD/config inputs及其测试去向；
3. 05只定义“如何验证与如何留证”，不修改设计、不做验收裁决、不安排实施；
4. old formal 05/06、README和旧 TC/topology/result为historical material；
5. test truthfulness：所有 case/gate/evidence在真实执行前均为planned/not_executed；
6. upstream impact/blocker gate与controlled-reopen规则。

正式 §1 不得包含新版 TC/EV、测试范围优先级、环境拓扑、命令、阈值、实际结果或验收状态；这些属于后续 Steps。

## 10. 待确认事项与下一步门禁

| Open item | Current impact | Owner / later Step | Before confirmation |
|---|---|---|---|
| exact implementation repository/test framework/file layout | execution only | formal 07 preflight | use conceptual layers and future path contract |
| exact durable/external products and topology | integration/deployment execution | Steps 8/14 + 07/09 | product-neutral seams; no readiness claim |
| exact CI platform and commands | automation binding | Step 9 + formal 07 | define semantic gates, not existing jobs |
| acceptance evidence selection and veto threshold | downstream decision | future formal 06 | define evidence candidates only |

Step 1 completion gate：

| Condition | Result |
|---|---|
| SOP five questions answered | pass, `5/5` |
| active input list and authority clear | pass |
| historical material isolated | pass; contamination=`0` |
| must-answer and must-not-answer lists | pass, `12 + 7` |
| input sufficiency assessed | pass |
| current writeback/blocking/upstream blocker | `0/0/0` |
| formal 05 modified | `0` |
| fabricated TC/EV/run/result/evidence/signoff/commit | `0` |

Step 1 is complete. Next allowed action is T024 / Step 2：read SOP Step 2、writing standard §2 and the scope/non-scope sections of active 00~04；define test goals, P0/P1/P2 scope, exclusions and owners without assigning TC/EV or editing formal 05.
