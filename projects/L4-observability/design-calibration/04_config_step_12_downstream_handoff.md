# L4-observability 04-配置设计 Step 12：定义测试、验收、实施与运维承接

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 12
> 回填章节：`04-配置设计.md` §12
> 当前模式：`full-restart_after_current_M3`
> 本步边界：只定义formal `04`向current `05/06/07`与future `09`交付的配置输入、责任和停止点；
> 不替下游定义完整用例、AC、commit boundary、部署命令、真实artifact/evidence或运行结果

## 1. Step状态

| 项 | 当前值 |
|---|---|
| 当前文档 | `04-配置设计.md`，formal仍冻结 |
| 当前Step | Step12 `定义测试、验收、实施与运维承接` |
| 当前模块 | `config-contract-downstream-handoff` |
| 输出文件 | `projects/L4-observability/design-calibration/04_config_step_12_downstream_handoff.md` |
| 前序门禁 | Step11 current full rewrite `pass`；用户已授权连续完成全部M4 |
| 写入状态 | `completed_current_full_rewrite` |
| gate_status | `pass_consumed_by_step_13` |
| gate_reason | SOP五问、四类下游责任、场景/门禁/物理前置、12 affected路由、禁止重定义与truthfulness均闭合 |
| 新上游blocker | `none` |
| inherited affected | I05两项、H13及其余9项保持开放；本Step只路由，不关闭 |
| implementation readiness | `blocked`；current `05~07`尚待full-restart，target repo与真实execution未建立 |
| next_allowed_action | `continue_to_current_step_13_under_continuous_M4_authorization` |

### 1.1 执行记录

| 动作 | 输入 / 产出 | 状态 |
|---|---|---|
| 读取SOP/规范 | Step12五问、三列表、不得代写用例/部署命令 | done |
| 读取Step06/07/11 | 环境、field registry、failure/cut输入 | done |
| 读取formal `03` §15~§17 | planned tests、implementation preconditions、affected gates | done |
| 审计旧Step12/旧formal §12 | 旧对象、旧profile、旧ID和自动pass全部隔离 | done |
| 审计旧`05/06/07` flow | 均为pre-M3 automatic template，只能historical | done |
| 建立四类handoff | test/acceptance/implementation/operations责任分离 | done |
| 传播12 affected | 每项有下游owner/stop rule | done |
| 自检 | formal未写，无result/evidence/commit fabrication | done |

## 2. 目标与非目标

### 2.1 目标

1. 给current `05`交付可转成suite/case/fixture的配置场景、组合和failure cut。
2. 给current `06`交付可裁决的hard gate与VETO输入，不提前写pass/fail结论。
3. 给current `07`交付schema/loader/builder/adapter/control-plane/environment的implementation precondition和spike边界。
4. 给future `09`交付产品、挂载、权限、轮换、激活、drain、restore、alert/runbook责任。
5. 防止下游重新定义field、source、profile、sensitive、activation、failure、truth/no-write契约。
6. 让12项affected在`05/06/07`有明确承接点和未关闭前行为。

### 2.2 非目标

- 不生成current `05` suite ID、case ID、fixture schema、command或artifact path。
- 不生成current `06` AC/VETO ID、evidence alias、verdict、risk acceptance或signoff。
- 不生成current `07` phase/task/commit boundary、implementation ledger或skeleton。
- 不选择DB、broker、KMS、scheduler、config control plane、alerting产品或部署拓扑。
- 不写shell/Kubernetes/systemd/CI命令、secret mount、rollback命令或incident procedure。
- 不把config validation report、runtime telemetry、health或design matrix当真实evidence。

## 3. SOP五问回答

### 3.1 哪些配置场景进入测试方案？

| Handoff ID | Scenario family | `04`提供的assertion input | `05`必须补齐 |
|---|---|---|---|
| `CFG-HO-T01` | strict source/parse | duplicate/unknown/alias/unsupported/incoherent source reject | suite/case、parser harness、negative corpus、command/artifact contract |
| `CFG-HO-T02` | field/type/range | required、enum、integer、set、catalog、hard range、no clamp | table/property tests、boundary fixtures |
| `CFG-HO-T03` | source priority | DECL<JSON<ENV、invalid winner no-fallback、whole catalog replace | deterministic source snapshots and spies |
| `CFG-HO-T04` | runtime class/mode | six lanes映射three formal classes、IntegrationLike Durable、RuntimeLike no Fake/Controlled | parameter matrix、environment prerequisites |
| `CFG-HO-T05` | sensitive/no-output | locator/material/safe projection/history分层、provider unavailable、rotation | provider fake、serialization/output scanner、negative corpus |
| `CFG-HO-T06` | builder complete-or-error | 13-stage order、seven errors、zero partial root | stage failpoints、resource cleanup/facade exposure spies |
| `CFG-HO-T07` | store/capability parity | atomic UoW/CAS/fence/schema/claim/report capability | fake/durable conformance suite |
| `CFG-HO-T08` | entry/catalog totality | 9 Consumer/9 Job safe catalog、prepare-all/arm-all/revoke-all | deterministic registrar barrier and invocation spies |
| `CFG-HO-T09` | lifecycle | protected candidate、cold activation、four ownership、drain、rollback | controlled host fake、phase fault injection |
| `CFG-HO-T10` | historical recovery | old snapshot/binding/token pinning、no current fallback、retirement scan | restart/rotation/history fixtures |
| `CFG-HO-T11` | unavailable/unknown | availability four-way、commit/external unknown、same-token probe/manual | typed external stubs、UoW ambiguity |
| `CFG-HO-T12` | redline/dependency | no raw body/source write/non-core compile edge/fake production | forbidden-call/dependency/redaction scans |

这些是scenario families，不是完整test case。Current `05`必须决定层级、priority、fixture、environment、automation、
entry/exit、artifact/report/evidence contract，并保持`not_run`直到真实执行。

### 3.2 哪些配置门禁进入验收标准？

| Handoff ID | Acceptance gate input | Fail/VETO condition | Evidence requirement direction |
|---|---|---|---|
| `CFG-HO-A01` | schema/source determinism | unknown accepted、invalid winner fallback、partial merge | real parser/source run artifact |
| `CFG-HO-A02` | required config completeness | missing required或conditional mapping仍暴露runtime | builder exposure evidence |
| `CFG-HO-A03` | profile isolation | RuntimeLike使用Fake/InMemory/Controlled越界 | profile/capability matrix result |
| `CFG-HO-A04` | safety/no-output | raw body/secret/full ref/fingerprint进入任何output | scanner report + raw artifact review |
| `CFG-HO-A05` | atomic capability | accepted write缺UoW/history/result/outbox或claim/fence | conformance/failure-injection evidence |
| `CFG-HO-A06` | entry registration atomicity | partial active Consumer/Job/root | barrier/fault artifact |
| `CFG-HO-A07` | unknown/manual | commit/external/ownership unknown被写成功或blind retry | ambiguity/probe evidence |
| `CFG-HO-A08` | historical binding | old work被current route/credential/digest重解释 | restart/rotation artifact |
| `CFG-HO-A09` | lifecycle authority | activation/rollback/retirement无authoritative control-plane fact | real control-plane audit evidence |
| `CFG-HO-A10` | truth/no-write | config/health/telemetry改变source truth或伪造evidence/signoff | write spy + forbidden material scan |

Formal `06`只能在真实`05` evidence contract和execution output存在后裁决。设计表、file存在、fake always-success、
placeholder alias或agent声明不能作为通过证据。

### 3.3 哪些配置准备进入实施计划？

| Handoff ID | Implementation preparation | Current precondition / stop point |
|---|---|---|
| `CFG-HO-I01` | target repo/workspace/config module reality | target repo absent/unknown时先初始化与reality check，不在design repo写代码 |
| `CFG-HO-I02` | raw schema/field registry/serde/ENV registry | 必须逐字段映射Step07，不允许implementation key/alias/default |
| `CFG-HO-I03` | loader/validator/identity | exact source/validation order与body-free identity；mechanism需boundary audit |
| `CFG-HO-I04` | sensitive provider wrapper | selected product/API/permission需spike；application/entry无locator/material能力 |
| `CFG-HO-I05` | store adapter/capability | physical schema/atomicity/CAS/fence/recovery必须映射formal logical contract |
| `CFG-HO-I06` | external adapter/catalog/history | exact phase/token/probe/historical binding capability不足则production boundary blocked |
| `CFG-HO-I07` | runtime builder/entry registrars | 13 stages、five façades、three slices、two registrars、zero partial root |
| `CFG-HO-I08` | host cold activation/control plane | ownership/audit/custody机制未选时只能spike/blocked，不能发明in-process hot swap |
| `CFG-HO-I09` | tests/gates/artifacts/reports | current `05/06`正式契约完成后再拆真实producer；不得静态pass |
| `CFG-HO-I10` | migration/history/retirement | Step13语义 + current `07` boundary闭合前不得激活migration class |

Current `07`必须逐commit boundary整体审计formal `03/05/06/07`，并在完成时一次创建current implementation ledger和
全部planned skeleton；本Step不预判boundary数量或状态。

### 3.4 哪些细节留给部署与运维手册？

| Handoff ID | Operations subject | `04`固定语义 | `09`/operations补齐 |
|---|---|---|---|
| `CFG-HO-O01` | JSON artifact selection | one protected strict candidate、custody/identity一致 | path、mount、owner、permission、promotion |
| `CFG-HO-O02` | ENV injection | only exact allowlisted leaves、coherent snapshot | platform mapping、secret-safe injection procedure |
| `CFG-HO-O03` | secret/provider | opaque locator、private resolution、no-output、rotation/history | product、bootstrap identity、ACL、network、issuance/rotation |
| `CFG-HO-O04` | runtime profiles | explicit formal class、no environment guessing | environment inventory、topology、capacity、release mapping |
| `CFG-HO-O05` | activation/drain | protected candidate、cold build、exclusive ownership、drain | host commands、timeouts、cancel/force-stop authority/runbook |
| `CFG-HO-O06` | rollback | prior protected candidate重新validate/assemble/activate | operator decision path、command、incident coordination |
| `CFG-HO-O07` | history/retirement | active obligation zero + exact resolution retained | scan cadence、restoration、retention、retire execution |
| `CFG-HO-O08` | alert/incident | safe finite signal、telemetry non-authority/no recursion | alert product、routing、severity、ack、escalation/runbook |
| `CFG-HO-O09` | migration | no auto migration、dual-read/switch-write/retire sequence | execution command、backup、cutover、rollback/forward repair |

### 3.5 下游不得重复定义什么？

| Frozen config contract | Owner | 下游允许 | 下游禁止 |
|---|---|---|---|
| typed root/field/nested schema | formal `03` + current Step07 | 引用并实现/测试 | 新key、alias、default、field/enum |
| source precedence/conflict | Step05 | 构造source fixtures | CLI/config center/deep merge/private override |
| runtime class/mode | formal `03` + Step06 | 参数化环境 | 新profile、RuntimeLike fake fallback |
| sensitive/no-output | Step08 | 选择provider并验证 | raw secret、full ref/hash escape、entry material |
| load/validate/assembly | Step09 | 实现13 stages | reorder、partial root、extra reader |
| cold activation/rollback | Step10 | 映射host mechanism | hot swap、generic LKG、rewrite old work |
| failure/degraded | Step11 | 建case/gate/runbook | silent fallback、unknown=success、blind retry |
| truth/no-write/UoW/state/protocol | formal `00~03` | 验证/实现exact contract | config override或second truth owner |
| evidence/verdict/signoff | current `05/06` + real execution/reviewer | 定义producer/consumer并真实生成 | placeholder/static/fake acceptance fact |

## 4. Current historical diagnosis

| Historical material | 问题 | Current处理 |
|---|---|---|
| old Step12 81行模板 | 复制obsolete observation schema，未回答五问 | 全量替换为downstream contract |
| old formal §12 | 引用旧profile/topic/report roots/external GRC | 全部historical，不进入current handoff |
| old `05` | 旧case/profile/artifact ID且pre-M3 | current `05` full-restart，不复用ID/pass |
| old `06` | 旧AC/evidence/verdict口径 | current `06` full-restart，不继承签署/通过 |
| old `07` | 自动phase/commit boundary与旧implementation assets | current `07`重新拆boundary并重建全部assets |
| README/product数字 | 技术栈、P95、retention、Grafana/Timescale假设 | 仅historical；下游不得升级为truth |

## 5. 下游承接总表

| 下游文档 | 承接内容 | 本文提供的输入 |
|---|---|---|
| current `05-测试方案.md` | config suites/cases/data/environment/automation/failure/NFR/evidence contract | `CFG-HO-T01~T12`、six lanes、field registry、25 failures、12 affected |
| current `06-验收标准.md` | config hard gates/VETO/evidence/reviewer/verdict requirements | `CFG-HO-A01~A10`、redlines、truthfulness和not-evaluated规则 |
| current `07-实施计划.md` | repo/config/adapter/builder/control-plane/test assets的phase/boundary/precondition | `CFG-HO-I01~I10`、12 affected、physical/reality blockers |
| future `09-部署与运维手册.md` | product/environment/credential/activation/drain/restore/alert/migration runbook | `CFG-HO-O01~O09`及安全/历史边界 |

## 6. 测试方案配置输入矩阵

| Config surface | Positive design input | Negative/fault input | Required harness capability | Truth status |
|---|---|---|---|---|
| source/registry | canonical strict candidate | unknown/duplicate/alias/incoherent | source snapshot + parser recorder | planned_not_run |
| field schema | exact typed values/ranges/sets/catalogs | missing/type/overflow/noncanonical | table/property generator | planned_not_run |
| profile | three formal classes/six lanes | invalid mode/store/external combos | parameter matrix | planned_not_run |
| sensitive | opaque locator/private material | unavailable/leak/rotation drift | provider fake + output scanner | planned_not_run |
| store/UoW | qualifying descriptor | schema/atomicity/CAS/fence mismatch | fake/durable conformance + failpoint | planned_not_run |
| external | exact target/phase/probe | Unknown/Unsupported/mismatch/history absent | typed stub + token spy | planned_not_run |
| entry | total raw/private/safe/catalog | Nth prepare/arm/mismatch | deterministic registrar barrier | planned_not_run |
| lifecycle | complete cold switch | partial owner/drain/history/rollback | controlled host fake | planned_not_run |
| no-write/safety | redaction/body-free/zero source write | bypass/raw/hash/current rebuild | write/output/dependency spies | planned_not_run |

## 7. 验收门禁配置输入矩阵

| Gate class | Must prove | Immediate VETO | Current evidence state |
|---|---|---|---|
| schema/source | deterministic exact candidate | invalid accepted/fallback/deep merge | nonexistent |
| complete assembly | zero partial root | any façade/entry before all gates | nonexistent |
| profile/dependency | RuntimeLike durable/endpoint constraints | Fake/InMemory/non-core compile edge | nonexistent |
| sensitive | zero raw/full-ref/fingerprint output | any secret/body leakage | nonexistent |
| UoW/entry | atomic write and atomic registration | partial commit/root | nonexistent |
| unknown/history | probe/manual/no-current fallback | blind retry/ack success/reroute | nonexistent |
| lifecycle authority | custody/review/exclusive ownership/audit | double owner/static activated claim | nonexistent |
| truth/no-write | observation-only and source-write absence | config/telemetry becomes truth | nonexistent |

## 8. 实施准备与物理能力矩阵

| Preparation | Design truth | Reality check / spike | Blocked boundary when absent |
|---|---|---|---|
| target workspace | seven-crate/file plan informal `03` | repo/git/Cargo/core path/dirty state | all code boundaries |
| strict loader | field/ENV registry fixed | parser duplicate semantics/coherent source | config foundation |
| identity | effective semantic binding fixed | canonical bytes/collision corpus | snapshot/history boundaries |
| durable store | logical stores/UoW fixed | DDL/transaction/CAS/fence/index/migration | durable accepted/Job boundaries |
| provider wrapper | private resolution fixed | SDK/API/bootstrap/no-output/rotation | Endpoint/secret boundaries |
| external effect | phase/token/probe fixed | real target idempotency/probe/history | production publication/handoff/export |
| host activation | lifecycle fixed | ownership/control-plane/audit/drain capability | production activation |
| test/evidence | cuts and truthfulness fixed | scripts/fixtures/artifacts/reports/reviewer | release/acceptance boundaries |

## 9. Inherited affected downstream routing

| Affected ID | `05` route | `06` route | `07` route | 未关闭前行为 |
|---|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | negative decode/zero-write only | positive activation cannot pass | I05 decode/fixture boundary blocked | slot不激活 |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | missing/ambiguous registration | exact binding gate | producer/registration boundary blocked | disabled/startup fail |
| `R06.6-F2-H13-UPSTREAM` | J06 controlled negative | no positive completion/H13 acceptance | J06/H13 boundary blocked | Blocked/manual |
| `R06-F-AFFECT-UOW-01` | UoW failpoints/all accepted flows | atomicity VETO | each mutation boundary exact audit | fixed save order |
| `S08-RECOVERY-CLASS-OWNER-01` | mapper/retry/dead-letter tables | unmapped class VETO | mapper boundary blocked | fail closed/manual |
| `R07-EXTERNAL-PHASE-LINK-01` | link/capability fault | no external call without link | adapter phase boundary blocked | retain intent/no call |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | same-token/probe/accounting | blind retry VETO | production effect boundary blocked | probe/manual |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | Consumer same-UoW snapshot | post-commit rebuild VETO | exact Consumer slice blocked | rollback/no event |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | commit unknown/ack spy | unknown=success VETO | worker completion boundary blocked | no ack/manual |
| `S08-JOB-REPORT-REF-OWNER-01` | Job report/finalize negative | fake ref/Completed VETO | Job completion boundary blocked | no finalize |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | compile/wire/fixture owner cut | alias/private duplicate VETO | contracts/DTO boundary blocked | entry reject |
| `03-RPR-S09-PER-FLOW` | 60 exact flow coverage | family-only evidence insufficient | per-boundary flow audit | no slice completion claim |

本Step关闭`0/12`。只有对应formal owner、real implementation boundary、真实test evidence和authorized acceptance
按各自规则闭合后，状态才可改变。

## 10. 跨下游审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| `05`是否被提前写成完整用例 | no | 仅scenario/harness/expected boundary input |
| `06`是否被提前裁决 | no | evidence均nonexistent，只有gate direction |
| `07`是否被提前拆boundary | no | 只给preparation/stop point，不给phase/commit数量 |
| `09`是否含部署命令 | no | 只给runbook subject和fixed semantics |
| 下游是否可改config schema | no | frozen contract表明确禁止 |
| config是否拥有business truth | no | no-write/truth/VETO贯穿 |
| test artifact是否冒充acceptance evidence | no | 需current `05/06` schema和真实execution/reviewer |
| historical IDs是否复用 | no | old `05~07`全部historical |
| 12 affected是否全部路由 | pass | exact 12；closed=0 |
| implementation readiness | blocked | current `05~07`、target/product/tests/evidence未完成 |

## 11. 对详细设计的影响判定

| Handoff conclusion | `03` impact | Action |
|---|---|---|
| test harness needs deterministic failpoint/barrier/spies | no current code API assumed | `05/07`规划；无法实现则回owner设计，不建private bypass |
| physical store/provider/host needs capability | no product selection in `03` | `07` spike/reality gate；capability不足阻塞boundary |
| downstream needs new field/error/trait/audit store | changes formal code contract | stop and backwrite owning DDD/formal `03` before implementation |
| operations needs hot reload/remote source/force-stop API | changes lifecycle/reader/concurrency | reopen formal `03/04~07` |

Current Step12没有新增代码契约或上游blocker。

## 12. Formal `04` §12回填草稿

```markdown
## 12. 测试、验收、实施与运维承接

下游只能消费本文配置契约，不得重新定义typed root、field、source priority、runtime class、sensitive/no-output、
13-stage assembly、cold activation、failure或truth/no-write边界。

| 下游文档 | 承接内容 | 本文提供的输入 |
|---|---|---|
| `05-测试方案.md` | source/schema/profile/sensitive/builder/store/entry/lifecycle/history/redline测试设计 | 12类scenario、six lanes、25 failures、12 affected |
| `06-验收标准.md` | schema、complete assembly、profile、安全、atomicity、unknown/history、lifecycle、truth VETO | 10类gate input及真实evidence要求 |
| `07-实施计划.md` | repo、loader、identity、provider、store、external、builder、host、test、migration准备 | 10类implementation preparation与stop point |
| `09-部署与运维手册.md` | artifact/env/provider/profile/activation/rollback/history/alert/migration runbook | 9类operations handoff及固定安全语义 |

本章不表示任何环境、实现、test、artifact、evidence、verdict或signoff已存在。
```

## 13. 自检与完成门禁

| 检查项 | 状态 |
|---|---|
| SOP五问 | pass |
| required三列表 | pass |
| test scenarios | 12 groups, planned only |
| acceptance gates | 10 groups, no verdict |
| implementation preparations | 10 groups, no boundary fabrication |
| operations handoff | 9 groups, no commands |
| downstream frozen contract | explicit |
| 12 affected route | exact, `0/12` closed |
| formal `04` | not modified |
| code/commit/run/evidence/signoff | none fabricated |

| Gate | Current status | Next action |
|---|---|---|
| input gate | pass | standards/current Step06/07/11/formal `03` read |
| content gate | `pass_consumed_by_step_13` | four downstream responsibilities and stop points complete |
| upstream blocker | none_new | inherited affected retained |
| implementation readiness | blocked | current `05~07` and reality/evidence absent |
| next_allowed_action | `continue_to_current_step_13_under_continuous_M4_authorization` | 按SOP进入migration/deprecation/evolution |
