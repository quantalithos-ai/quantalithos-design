# L3-capability-hub 04 配置设计 Step 12：测试、验收、实施与运维承接

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 12
> 回填章节: `projects/L3-capability-hub/04-配置设计.md` §12
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> 状态: `04_step_12_completed_continuous_execution`

---

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 `定义测试、验收、实施与运维承接` |
| 输入基线 | 04 Steps 5~11；formal 03 §§13~16；DDD Steps 16~17；测试/验收/实施/运维规范 |
| 输出 | four-owner handoff、scenario/gate/task/operations matrices、future evidence contract、03 impact和formal §12 draft |
| historical material | existing `05-测试方案.md` / `06-验收标准.md` only；不得承接旧编号、旧provider/cost/runtime口径或旧证据说法 |
| absent downstream | `07-实施计划.md`、`09-部署与运维手册.md` absent；absence is downstream work, not an upstream blocker |
| formal 04 | not created；only Step 15 may assemble |
| 03 影响 | `无回写`；本 Step 只分配下游责任，不改变代码契约 |
| 上游 blocker | 0 |

## 2. 本步目标、输出与限制

本 Step 把已经闭合的配置真相源翻译为四类下游可直接消费的输入，同时保持四类文档各自的职责边界：

1. `05-测试方案.md` 决定怎样验证，必须把 Step 11 的切口扩展为完整 precondition/action/oracle/data/environment/automation/evidence contract。
2. `06-验收标准.md` 决定什么结果算通过、什么配置缺陷一票否决，但只能消费未来真实测试报告和固定交付基线。
3. `07-实施计划.md` 安排 parser、validator、builder、adapter binding、redaction、tests 和 gates 的可验证实施顺序及 commit boundary。
4. `09-部署与运维手册.md` 才能填真实环境值、产品、路径、部署/重启/回滚命令、轮换步骤、告警阈值和处置流程。

本 Step 不创建或重写 `05/06/07/09`，不分配真实 `TC/EV/AC` 编号，不写实现 commit、测试命令结果、`run_id`、artifact/report、acceptance signature、deployment/cutover/rollback record。它只定义未来文档必须承接什么、从哪里承接、谁生成事实，以及不允许重新定义什么。

## 3. 本步输入

| 输入 | 本 Step 承接 | 不得推导 |
|---|---|---|
| Step 5 | constants/JSON/env precedence、21 bounded env leaves、bootstrap-only CLI | arbitrary override、config center |
| Step 6 | exact `Local/Integration/Deployment` profiles、environment-purpose mapping、fake/durable constraints | CI/staging/prod new enum |
| Step 7 | 18 modules、27 rows、strict JSON、9/14 Ports/callables、6 sources、10 routes、8 Jobs | implementation exists、real product/value |
| Step 8 | public/internal/sensitive/secret、ref-only、provider-to-constructor injection、rotation/output rules | raw secret、provider selection |
| Step 9 | V0~V8、Stage 0~7、three entry barriers、frozen root | hot reload、partial graph |
| Step 10 | immutable artifact、review/audit/cutover/eligible rollback | actual approval/cutover/rollback result |
| Step 11 | six terms、24 failure modes、18 future test cuts、safe observation intent | executed tests、alerts、evidence |
| formal 03 §§13~16 | exact typed owners、errors、observation cuts、minimum test registry、implementation source | new DTO/error/Port/flow |
| test standard/SOP | full cases/data/env/automation/evidence ownership | test report before execution |
| acceptance standard/SOP | fixed baseline、three-value decision、veto/evidence closure | signed decision or risk acceptance |
| implementation standard/SOP | phase/boundary/gate/ledger ownership | implementation progress/commit |
| operations standard | real deployment/monitoring/runbook owner | assumed topology/product/threshold |

## 4. SOP 五问回答

| SOP 问题 | L3-capability-hub 回答 |
|---|---|
| 哪些配置场景进入测试方案？ | 所有 18 modules、27 canonical rows、3 profiles、source precedence、strict JSON bounds、21 env leaves、ref/reachability、secret/TLS、V0~V8、Stage 0~7、9/6/10 complete predicates、API/Worker/Jobs barrier、change/rollback eligibility和Step 11 `CFG-F-01..18`。05必须补精确数据、执行层、oracle、automation和future evidence schema。 |
| 哪些配置门禁进入验收标准？ | 配置schema完整性、Deployment durable/system/fake=0、invalid env no fallback、Missing != Disabled、raw secret/body no-output、configured no-fallback、no partial graph、frozen root/no hot reload、unsafe rollback veto和配置不越过Hub责任边界。06必须把它们变成可判定通过/失败/一票否决条件，并引用未来05证据。 |
| 哪些配置准备进入实施计划？ | infra-local strict parser/typed config、bounded source selector/merge、whole-graph validator、provider-to-constructor material resolver、Stage 0~7 builder/prefix disposal、API/Worker/Jobs barriers、safe diagnostic projection、test fixtures/fakes及配置测试/gate。07须按formal 03文件/对象边界安排，不在计划内补schema。 |
| 哪些部署细节留给运维手册？ | artifact实际路径/权限/digest、环境到profile选择、21 env leaf真实注入、durable store/transport/endpoint/provider/TLS真实产品和值、credential/certificate rotation、process start/restart/cutover/rollback命令、告警阈值/路由/dashboard/runbook、retention/access和真实记录模板。 |
| 下游不应重复定义什么？ | 18-module schema、27-row语义、key/type/default/bounds、source precedence、profile含义、sensitivity、startup-only activation、failure taxonomy、binding cardinality、forbidden responsibilities和03 code contracts。发现冲突必须回开03/04，不能在05/06/07/09私改。 |

## 5. 当前文档问题诊断

| Material | 当前事实/风险 | 本 Step disposition |
|---|---|---|
| old `05-测试方案.md` | 217 lines，restart前测试主语/编号/配置环境可能与新版03/04冲突 | `historical_material`; T022起删除重建，不能作为本Step输入真相 |
| old `06-验收标准.md` | 189 lines，restart前门禁/签署/证据口径可能错误 | `historical_material`; T038起删除重建，不能声明旧结果有效 |
| missing `07` | 尚无phase/commit boundary/implementation ledger | downstream pending；formal 06完成后按SOP创建 |
| missing `09` | 尚无真实产品、路径、命令、告警和runbook | operations prerequisite；不阻塞04~07设计完成 |
| implementation repo | `/home/aris/Projects/quantalithos-capability-hub`尚未建立的设计事实 | 07 Step 3 preflight；04不伪造Cargo/git/path readiness |
| evidence | no test run/report/evidence/signoff exists | only future schema/placeholders may be defined by05/06 |

## 6. 改动前后对比

| 维度 | Step 12 前 | Step 12 后 |
|---|---|---|
| test handoff | Step 11有18个cut，但无下游owner矩阵 | 05明确扩展维度、coverage minimum和证据生成责任 |
| acceptance handoff | failure/redline已知，但未形成裁决输入 | 06有exact gate/veto候选和future evidence dependence |
| implementation handoff | formal 03提供代码面，04提供raw schema | 07有配置implementation object/boundary/prerequisite输入 |
| operations handoff | product-neutral material和safe intent | 09明确真实值、产品、操作、阈值和记录责任 |
| truth-source control | 下游可能重命名或简化配置 | immutable contract表规定发现gap必须回开 |
| evidence truthfulness | design cut易被误写成已测试 | future-only lifecycle和placeholder规则明确 |

## 7. 配置设计取舍

| 议题 | 候选 | 裁决 |
|---|---|---|
| 是否现在重写05/06 | 同步修改；只交接 | 只交接。正式文档必须各自完整走15 Steps |
| 是否现在创建07/09 | 提前创建；等待对应流程 | 等待。07需承接正式05/06，09还需真实发布/运维输入 |
| 是否预分配TC/EV/AC | 在04分配；由owner分配 | 由05/06分配，避免孤儿/重复编号和fake evidence alias |
| 是否把test cut当验收证据 | 是；否 | 否。cut是future obligation，只有固定run真实report才是证据 |
| 是否让07选择配置schema | 是；否 | 否。07只能安排落码，schema由03/04固定 |
| 是否让09修改key/profile/failure | 可按平台调整；必须回开 | 必须回开。平台限制不能被私自吸收为运维差异 |

## 8. 总体下游承接表

| 下游文档 | 承接内容 | 本文提供的输入 |
|---|---|---|
| `05-测试方案.md` | test objects/cuts、positive/negative/boundary cases、data、profile/environment、automation/gates、future report/evidence contract | Steps 5~11；`CFG-F-01..18`；18/27/9/6/10 inventories；formal 03 test cuts |
| `06-验收标准.md` | acceptance baseline input、configuration gates、redline/veto、evidence sufficiency、risk boundary | formal 04 §§4~11；future formal 05 TC/report mapping；no-fabrication rule |
| `07-实施计划.md` | typed/raw config implementation objects、phases、commit boundaries、per-boundary tests/gates、preflight and controlled reopen | formal 03 §§13~16；formal 04 §§5~12；future formal 05/06 gates |
| `09-部署与运维手册.md` | actual artifact/value/product/topology、injection、start/restart/cutover/rollback、rotation、monitoring/alerts/runbook/audit records | formal 04 source/profile/sensitivity/change/failure contracts；formal 07 delivery inventory；real platform facts |

## 9. `05-测试方案.md` 承接合同

### 9.1 配置测试对象与最小覆盖

| Test object | Minimum coverage | Required oracle source | 05 must add |
|---|---|---|---|
| strict source/parser | missing/read/size/UTF-8/BOM/JSON syntax/duplicate/unknown/null/coercion | Step 7 parser rules、Step 11 FM-01/02 | exact fixture bytes、test layer、command placeholder、future report path |
| source selection/merge | constants/file/21 env leaves、invalid high priority、CLI selector boundary | Steps 5/7、FM-07/24 | one test per env leaf family and no-fallback assertion |
| profile matrix | Local/Integration/Deployment across authority/clock/id/9 Ports/6 sources/fixtures | Step 6 exact matrix | pairwise/full combinations justified; Deployment all redlines mandatory |
| item/whole graph validation | 18 modules、27 rows、types/ranges/relations/reachability/cycles/families | Steps 7/9、FM-03~06 | stable cases and coverage traceability |
| sensitive/provider/TLS | raw material reject、provider result、expiry/revocation/mismatch、safe diagnostics | Steps 8/11、FM-08/09 | security fixtures that contain no real secret/evidence |
| runtime assembly | Stage 0~7、prefix disposal、27 local、9 external | Step 9、FM-10~12 | fault injection owner and no-public-partial-graph oracle |
| entry barriers | API/Worker/Jobs exact preconditions | Step 9、FM-13 | no listener/task/facade exposure oracle |
| active failure boundary | six Port failures、Query degraded、Worker/Jobs/Outbound outcomes | formal 03 + Step 11 FM-14~19 | exact typed result and effect/retry oracle; no generic config error |
| frozen lifecycle/change | candidate rejection、drift、unsafe target、fix-forward、no hot reload | Steps 9~11 FM-20/21/24 | current-process unchanged and no business-truth rewrite assertions |
| observer boundary | Off/Redacted、redaction violation、sink failure | formal 03 §14 + FM-22 | byte/body omission and business-result-equivalence oracle |
| absent controls/responsibility | config center/admin/runtime execution/listing/approval/method body/provider routing/SDK lifecycle | Steps 2/4/11 FM-23/24 | static/schema/architecture negative checks, not fake outage tests |

### 9.2 `CFG-F-01..18` expansion rule

Each Step 11 cut must become at least one stable `TC-*` in formal 05 Step 6 unless 05 records an explicit, justified merge. For every case, 05 must define:

| Required field | Contract |
|---|---|
| design source | exact formal 03/04 section and calibration source where needed |
| precondition | profile、entry、artifact shape、binding state、fake/fault capability |
| action | exact parser input、provider/constructor fault or typed Port return |
| oracle | error/result/state/effect/absence/cleanup using formal names |
| data | synthetic and body-safe; never a real credential/evidence body |
| layer | unit/contract/integration/process/static/release-gate as justified |
| automation | future command/script owner and nonzero exit semantics |
| evidence | future `EV-*` and `<run_id>` report path assigned only by formal 05 |
| prohibition | no implementation/test/pass/evidence claim in design text |

### 9.3 Environment handoff

`05` must treat `Local/Integration/Deployment` as runtime profile truth. `local-dev`、`ci-test`、`integration-like`、`operations-replay`、`staging-like` and `production-like` are test/deployment purposes mapped onto those profiles; they are not additional enum values. Deployment-like tests must use durable/system/non-fake constructor categories or explicitly stop as environment prerequisite. A missing real product does not permit fake success under Deployment.

## 10. `06-验收标准.md` 承接合同

| Gate candidate | Pass predicate | Failure/veto candidate | Required future evidence owner |
|---|---|---|---|
| schema/source gate | strict JSON and only allowed source chain; all invalid forms reject | unknown/coerced/oversize/invalid env accepted or fallback | formal 05 parser/source cases and fixed run report |
| 18/27 completeness gate | 18 modules and 27 semantic rows have positive/negative coverage | item/module/row omitted or duplicate authority accepted | formal 05 traceability/coverage report |
| profile isolation gate | Deployment durable/system/fake=0; exact entry/profile matrix | any fake/inMemory/deterministic fixture or incomplete graph under Deployment | formal 05 profile matrix report |
| Missing/Disabled gate | missing rejects; explicit legal Disabled alone yields NotConfigured | omission silently creates Disabled/Fake or continues | formal 05 branch negative cases |
| sensitive no-output gate | raw secret/body/provider response never enters config/root/output/report | any forbidden material appears in artifact/error/log/trace/report | formal 05 security/redaction report |
| assembly atomicity gate | any Stage/barrier failure exposes no graph/listener/task/facade | partial graph or reduced `9/6/10` graph becomes active | formal 05 fault-injection/process report |
| configured no-fallback gate | provider/constructor failure rejects candidate | fallback fake/disabled/inMemory/plaintext/other endpoint/provider | formal 05 constructor/fallback report |
| runtime error fidelity gate | exact Port/typed/consistency/transaction rules retained | config exception swallows typed error or defect becomes degraded | formal 05 active failure cases |
| frozen/change gate | root immutable; candidate/rollback eligibility fully revalidated | hot reload/admin/online LKG/unsafe rollback or business rewrite | formal 05 lifecycle/change report plus release artifact when real |
| responsibility gate | Hub remains registration/integration metadata and handoff center | execution/listing/approval/method body/provider routing/SDK delivery enters config/code | static architecture/design-closure report |
| evidence sufficiency gate | every P0 AC points to fixed future run/report and exact TC/EV | `latest`、placeholder、design table or claimed signal used as evidence | formal 05/06 evidence index at actual acceptance time |

Formal 06 must not fill `<run_id>`, `EV-*`, decision, signer, date or risk acceptor until those facts exist. At design time it may define placeholders and an explicit `not_evaluated` baseline; it may never interpret this Step as proof of pass.

## 11. `07-实施计划.md` 承接合同

### 11.1 Implementation object families

| Family | Design-owned deliverable | Mandatory source | Boundary/gate obligation |
|---|---|---|---|
| raw config types/parser | strict 18-module shape、closed variants、bounds、unknown/duplicate rejection | formal 03 §13 + formal 04 §§5~7 | Rust structs/enums/fields/variants/callables all English `///`; parser tests before builder |
| bootstrap/source merge | file/profile/entry selector and 21 env leaves | formal 04 §5/§7 | no arbitrary override or invalid-env fallback |
| validation | V0~V8 and deterministic safe issue projection | formal 04 §9 | complete negative matrix and no raw value output |
| material resolution | endpoint/transport/credential/TLS provider to exact constructor | formal 03 §13 + formal 04 §8/§9 | product choice is prerequisite; no public/raw secret carrier |
| runtime assembly | Stage 0~7、27/9 complete graph、prefix disposal | formal 03 §13 + formal 04 §9/§11 | each stage independently reviewable/fault-injectable |
| entry assembly | API/Worker/Jobs typed handoff and barriers | formal 03 entry contracts + formal 04 §9 | no host exposure before complete predicate |
| active failure wrappers | Port retry upper bounds and exact existing error preservation | formal 03 §§11~13 + formal 04 §11 | effect proof tests; no new generic config error |
| diagnostics | Off/Redacted static projections and non-cancelling sink | formal 03 §14 + formal 04 §§8/11 | backend selection controlled reopen where required |
| fake/fixture support | Local/Integration deterministic parity | formal 03/04 profile matrix | Deployment gate and no real evidence/readiness claim |
| test/gate integration | formal 05 cases and formal 06 gates | future formal 05/06 | per-boundary commands/evidence placeholders; no fabricated run |

### 11.2 Implementation preflight

Formal 07 must stop before assigning code work if the target repository/path/Cargo package/workspace naming, sibling dependencies, private provider/backend products or formal 05/06 gates remain unavailable for that boundary. It must distinguish:

- design blocker: exact typed field/variant/Port/error/flow cannot be implemented; reopen formal 03/04;
- environment/product prerequisite: product/credential/backend/repository not yet selected; boundary remains planned/not started;
- execution fact: branch/commit/test/run/evidence; only implementation ledger may record it after real execution.

The completed formal 07 must create `implementation_execution_ledger.md` and every planned `implementation-boundaries/commit-*.md` skeleton together. This Step only hands off that obligation; it does not create them early.

## 12. `09-部署与运维手册.md` 承接合同

| Operations topic | 09 must supply from real platform | Immutable 04 boundary | Required stop condition |
|---|---|---|---|
| artifact baseline | actual path/store、owner、permissions、immutable identity/digest | strict <=1MiB JSON、safe projection only | no immutable/approved artifact mechanism |
| profile/entry selection | host/process purpose to exact profile/entry | only Local/Integration/Deployment and API/Worker/Jobs | mapping requires new enum/branch |
| environment injection | actual names/mounts for the 21 allowed leaves and bootstrap selectors | no arbitrary env/CLI override、invalid no fallback | platform cannot preserve closed allowlist |
| durable authority | actual DB/store product、schema/migration/readiness procedure | one authority、Deployment durable、no config-only migration claim | compatibility/data migration unproven |
| external connection | actual transport/endpoint/provider/TLS products and registrations | 9 slots、6 sources、10 routes、ref-only、no route/cost/failover semantics | product needs unmodeled fields/branch |
| secret/certificate | access policy、provider locator setup、rotation/overlap/revocation procedure | provider-to-exact-constructor、no raw output、atomic groups | cannot prove expiry/revocation/mismatch gates |
| startup/restart/cutover | actual commands/platform sequence、health/readiness/cutover result resolution | V0~V8、Stage 0~7、entry barrier、unknown not guessed | process can expose before barrier or cutover unknown unresolved |
| rollback/fix-forward | actual operator steps and approved target lookup | target fully revalidated；unsafe material fix-forward；no business rewrite | previous artifact no longer safe/compatible |
| monitoring/alerts | backend、threshold/window、route、dashboard、retention、access | existing profile/safe fields only；observer non-cancelling | backend needs forbidden/raw fields or changes business behavior |
| incident/runbook | diagnosis/escalation/repair for startup, dependency, drift, observer failures | failure taxonomy and owner boundaries | runbook proposes silent fallback/hot patch/business rewrite |
| records | real release/review/cutover/rollback/incident references | product-neutral safe audit semantics | record requires secret/raw config or fake acceptance truth |

P0 04 does not require a remote config center. An operations platform may store/distribute the immutable artifact only if it preserves the defined source and activation semantics; introducing online watches, dynamic merge, admin override or LKG reload is a design change, not an operations detail.

## 13. Future evidence lifecycle and truthfulness

```text
[formal 03/04 design contract]
  -> [formal 05 planned TC + future EV/report schema]
  -> [formal 07 implementation boundary + planned gate]
  -> [real implementation/test execution outside design repo]
  -> [fixed run report and evidence index, if actually produced]
  -> [formal 06 acceptance evaluation against that fixed baseline]
  -> [real operations release/cutover/rollback record, if executed]
```

| Stage | May define now | May only exist after real action |
|---|---|---|
| 04 | scenario/gate/task/ops handoff and safe evidence fields | no TC/EV/run/report/result |
| 05 | planned TC/EV identifiers、commands、report schema/path templates | actual run ID、artifact content、pass/fail result |
| 06 | AC/veto/decision rules and placeholders | evaluated decision、signer、risk acceptance、fixed evidence refs |
| 07 | phases/boundaries/gates/ledger skeleton | commit hash、completed boundary、command output |
| 09 | procedure/templates and required records | actual deployment/cutover/rollback/alert/incident record |

No design document may use a calibration completion, Markdown checkbox, static count, example digest or placeholder path as implementation, test or acceptance evidence.

## 14. 下游不可改写契约

| Contract | Authority | Downstream may translate into | Downstream must not change |
|---|---|---|---|
| typed code shape/error/flow/state | formal 03 exact canonical sections | test oracle、implementation task、acceptance redline | field/variant/method/error/retry/effect semantics |
| 18 modules / 27 rows / key/type/bounds | formal 04 §§3~7 | parser cases、config files、implementation batches | rename、default、coercion、generic map |
| source priority | formal 04 §5 | source tests and injection procedure | fallback/extra source/admin override |
| profiles/cardinality | formal 04 §6 | environment/test matrix | new runtime profile、Deployment fake、partial graph |
| sensitivity/injection | formal 04 §8 | security tests/provider operations | raw secret/root carrier/output relaxation |
| validation/activation | formal 04 §9 | builder implementation/process gate | reload、partial exposure、second reader |
| change/rollback | formal 04 §10 | review/release/operations process | unsafe target、in-place graph patch、business rewrite |
| failure behavior | formal 04 §11 | exact tests/gates/runbooks | silent fallback、generic degraded、blind retry |
| Hub responsibility | formal 00~04 | negative tests/veto/implementation non-scope | runtime/tools execution、marketplace、approval、method body、provider routing/cost、SDK delivery |

Conflict rule: formal documents outrank calibration background. If a downstream author finds formal 03 and formal 04 inconsistent, the affected work stops and both sources are reviewed; the author cannot pick the more convenient rule or hide the difference in a test/environment exception.

## 15. 下游承接停审记录

| Downstream | Completeness | Boundary preservation | Fabricated fact | Result |
|---|---|---|---:|---|
| `05` | 11 object groups + 18 cut expansion fields | tests only; no design redefinition | 0 | pass |
| `06` | 11 gate candidates with pass/fail/evidence owner | decision only after fixed evidence | 0 | pass |
| `07` | 10 implementation families + preflight/ledger obligation | no schema invention or execution claim | 0 | pass |
| `09` | 11 operations topics + stop conditions | real products/commands cannot weaken04 | 0 | pass |
| evidence lifecycle | 5-stage owner chain | placeholders != facts | 0 | pass |

## 16. 跨下游审计

| Audit item | Result | Gap/correction |
|---|---|---|
| 04 contract without downstream owner | `0` | every source/profile/item/security/activation/change/failure family assigned |
| 05 asked to decide pass/release | `0` | provides evidence only |
| 06 asked to design test or implementation | `0` | consumes evidence and decides only |
| 07 asked to fill design gap | `0` | controlled reopen required |
| 09 allowed to change schema/profile/failure | `0` | stop/reopen rule fixed |
| old 05/06 treated as authority | `0` | historical material only |
| absent 07/09 treated as current fact | `0` | downstream pending only |
| fake TC/EV/AC/run/report/signoff | `0` | identifiers/results assigned by future owners/actions |
| fake commit/release/cutover/rollback/alert | `0` | procedure/placeholder only |
| config center/hot reload/LKG introduced by operations | `0` | design reopen required |
| runtime/tools/listing/approval/method/provider/SDK leakage | `0` | negative gate retained |
| 03 writeback gap | `0` | no code-contract change |

## 17. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 05承接配置test objects/cuts/oracles | 否 | downstream verification allocation | formal 03 §15 / formal 04 §§5~11 | 无回写 |
| 06承接gate/veto/evidence sufficiency | 否 | downstream decision allocation | formal 03 §15 / formal 04 §§4~11 | 无回写 |
| 07承接existing parser/builder/adapter/entry/diagnostic objects | 否 | implementation sequencing around existing contracts | formal 03 §§13~16 | 无回写 |
| 09承接real product/value/operation/alert details | 否 | deployment/operations ownership | formal 04 §§5~11 | 无回写 |
| future downstream needs new config field/profile/error/Port/reload/flow | 触发时是 | typed/runtime contract change | controlled reopen formal 03 and originating 04 Step | 当前未引入；受控回开 |

Current `待回写=0`, `阻塞待确认=0`, `upstream blocker=0`。Rust declaration/struct/field/enum/variant/payload/trait/method/callable delta=`0`，Rustdoc delta=`0`。07实施任何既有Rust声明时仍必须逐项保留英文 `///`，包括每个结构体字段和enum variant/payload field。

## 18. Formal §12 回填草稿

正式 `04-配置设计.md` §12 应装配：

1. four-owner overall handoff table；
2. 05 test object/minimum coverage、18-cut expansion和profile mapping；
3. 06 configuration gate/pass/failure/future evidence table；
4. 07 implementation object/preflight/controlled-reopen table；
5. 09 real artifact/product/value/rotation/restart/rollback/alert/runbook handoff；
6. future evidence lifecycle、immutable downstream contract、stop/reopen rule；
7. downstream stop review、cross-owner audit和03 no-writeback conclusion。

正式章节不得预分配真实TC/EV/AC或run ID，不得声称旧05/06仍有效，不得创建实现/部署/验收状态。它必须标记07/09当前缺失为下游工作，而非已完成或上游 blocker。

## 19. 待确认事项

| 事项 | 当前影响 | Owner | 未确认前处理 |
|---|---|---|---|
| target repo/Cargo/workspace/git facts | blocks actual implementation start, not design | formal 07 Step 3 / implementation owner | keep prerequisite; do not invent |
| durable store/transport/secret/TLS/observer products | blocks corresponding configured adapter boundaries | formal 07/09 + dependency/security owners | remain product-neutral; no fake Deployment fallback |
| actual environment/profile mapping and artifact distribution | blocks real deployment procedure | formal 09/operations owner | only canonical profile rules apply |
| concrete test commands/scripts/report tooling | blocks execution, not test-plan design | formal 05/07 | define future contracts; no result claim |
| alert thresholds/routes/retention/runbook | blocks production operations readiness | formal 09 | safe profile intent only |

No item blocks Step 13. Product/environment choices that require new fields or semantics trigger controlled reopen; they are not silently solved downstream.

## 20. Step 12 completion gate

| Completion condition | Result |
|---|---|
| SOP five questions answered | pass |
| 05/06/07/09 owner separation | pass `4/4` |
| config test handoff complete | pass; 11 groups + 18-cut expansion |
| acceptance gate handoff complete | pass; 11 candidates |
| implementation handoff complete | pass; 10 families + preflight |
| operations handoff complete | pass; 11 topics |
| downstream immutable contracts | pass; 9 authorities |
| fake evidence/run/signoff/commit/deployment fact | `0` |
| old 05/06 authority leakage | `0` |
| config responsibility leakage | `0` |
| 03 pending writeback/upstream blocker | `0/0` |
| formal 04 write before Step 15 | `0` |

Step 12 is complete. Next allowed action: read SOP Step 13、writing standard §5.13、Step 7 schema/version inventory、Steps 5/9/10 source/activation/change contracts and upstream compatibility/version rules；then define additive change、rename/deprecation/removal and compatibility gates without claiming any released legacy configuration exists.
