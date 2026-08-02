# Step 9. 设计自动化与 CI/CD 门禁

> 对应SOP: `standards/document/测试方案讨论流程_SOP.md` Step 9
> 书写规范: `standards/document/测试方案书写规范.md` §5.9
> 回填章节: `05-测试方案.md` §9 自动化与CI/CD门禁
> 生成日期: 2026-07-13
> 状态: reviewed_passed_to_step_10
> 所属流程: `05_test_plan_calibration_flow.md`
> 本Step口径: 为254条`TC-SBX-*`和`PER-SBX-001~038`定义planned suite、gate、命令、artifact / report schema与阻断传播。目标实现仓、脚本和CI尚未形成;本文所有路径 /命令均为实施契约`planned_not_implemented`,不是已存在文件、真实run、EV、结果或验收结论。

---

## 1. Step开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 8并允许进入Step 9 | 是。用户在Step 8停审后明确回复“同意”,本次只放行Step 9。 |
| 台账与flow是否允许进入 | 是。Step 8原为`pass_wait_review`;本次确认后转为`passed_to_step_9`。 |
| 是否读取Step 9标准 | 是。已读取测试SOP Step 9和书写规范§5.9。 |
| 是否读取全部输入 | 是。复核Step 4分层、Step 6的254条TC、Step 7的28个数据集、Step 8的七环境 / profile,以及正式`03` §15 /正式`04` handoff。 |
| 是否参考L1粒度 | 是。参考L1-governance / L1-artifact的suite / gate / report结构,但不继承其suite名称、EV候选或脚本存在性假设。 |
| 当前状态 | 16个suite、7类gate /触发面、17个planned脚本契约、254条TC主归属、跨层补强、PER和artifact / report闭环已收稳;用户已确认并传递至Step 10。 |
| 上游blocker | 无阻塞Step 9设计的上游冲突。目标仓缺失阻塞suite实现;ENV-05缺口阻塞P0-Q执行;不影响planned gate设计。 |
| 停审 | 用户已确认Step 9;只放行Step 10,不得跨入Step 11或修改正式`05-测试方案.md`。 |

## 2. 目标、边界与成熟度词汇

本Step完成:

1. 按L1~L6最早失败位置建立suite,不把全部P0堆到E2E / release smoke。
2. 定义PR、main、nightly / operations、P0-Q、release summary、P1 selected-run和scope-reopen触发面。
3. 为每个阻断suite固定planned command、环境、profile、artifact和report路径、失败传播与PER去向。
4. 将254条TC分成237条P0-C、13条P0-Q和4条conditional主归属,并允许同一TC以`layer / parameter_id`在补强suite重复执行而不换义。
5. 定义write-audit、fault injection、deterministic scheduler、protocol inventory、redaction、dependency和qualification identity检查契约。

| 词汇 | 含义 | 不表示 |
|---|---|---|
| `planned_not_implemented` | suite /脚本 /路径是实现必须落码的契约 | 文件、CI job或测试已存在。 |
| `P0 blocking` | 实现后该suite失败必须阻断对应gate /整体P0 | 当前已经pass。 |
| `blocked_by_environment` | 测试设计和gate完整,但合法环境实例缺失 | N/A、skip、pass或低profile替代。 |
| `conditional_non_p0` | 激活条件满足后执行,结果不补偿P0 | 可忽略设计或伪造not applicable。 |
| `<run_id>` | 后续真实执行分配的固定占位符 | 本文创建了run_id。 |
| `PER-SBX-*` | planned evidence requirement | EV alias、artifact实例或证据通过。 |

本Step不实现脚本、测试函数、CI配置或harness;不生成真实artifact / report / acceptance handoff;不创建EV;不定义Step 10量化阈值或Step 13最终证据schema。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 哪些suite必须进PR | SUITE-001 carrier、002 state、003 config / static、004 command / query service和016 future-scope absence检查。001~004为P0 blocking;016命中变化时触发design-reopen阻断。 |
| 哪些suite进入main | PR suite加005 consumer / relay、006 job、007 transaction / replay、008 repository / adapter parity、009 race、010 error / recovery、011 55协议entry inventory和014 structural boundedness。全部适用P0 suite阻断。 |
| 哪些进入nightly / operations | main suite可重跑扩展参数;SUITE-012在ENV-04运行operations simulation。Nightly失败不得静默忽略;release只消费明确固定run。 |
| 哪些是P0-Q / release | SUITE-013只能在ENV-05由受控人员启动deterministic harness;GATE-SBX-P0Q失败 / blocked均阻断整体P0-Q。GATE-SBX-RELEASE只汇总固定P0-C / operations / P0-Q run,不得重算或用latest。 |
| 哪些是conditional | SUITE-015在ENV-06执行COND-001/002/005;不阻断P0。SUITE-016的COND-003为future scope审计,发现新surface必须先重开设计。 |
| flaky / timeout如何处理 | P0-C fake / schedule必须deterministic;flaky、timeout、harness crash均记Failed / InfraFailed并阻断,不得自动重跑后覆盖首个失败。诊断重跑必须新run_id并保留关联。 |
| gate需要哪些参数 | 所有planned gate都必须显式接收`--run-id`、`--artifact-root artifacts/test/<run_id>`和`--config-profile SBX-PROFILE-xx`;不得默认latest。 |
| artifact / report放哪里 | raw只进入`artifacts/test/<run_id>`;run report只进入`reports/runs/<run_id>`;acceptance handoff只允许后续Step 13进入`reports/acceptance`。 |
| 每个suite如何回指证据 | 当前只绑定`PER-SBX-*`;真实执行产生raw artifact后,Step 13才分配 /生成正式EV索引。 |
| 哪些P0不能自动化 | 没有P0断言允许manual-only。ENV-05可由授权人员启动,但preflight、probe、结果判断、cleanup disposition和artifact生成必须由deterministic harness完成。 |

## 4. 自动化套件总表

下表命令均为planned contract,目标仓形成后才允许创建对应脚本。`TC主归属`用于254条机械覆盖;补强suite可重复执行同一TC但必须记录相同`tc_id`和不同`layer / parameter_id`。

表中`suite raw + suite md`等紧凑写法统一展开为`artifacts/test/<run_id>/suites/<suite_id>/`和`reports/runs/<run_id>/suites/<suite_id>.md`;不得另设project子目录或`latest`别名。

| Suite ID /名称 | TC主归属 | 覆盖范围 / CUT | 环境 /执行位置 | 触发 | 阻断级别 | planned执行入口 | artifact / report |
|---|---|---|---|---|---|---|---|
| SUITE-SBX-001 `carrier-contract` | CTR-001~006,6条 | carrier、metadata、digest、typed ref、event family;CUT-001/002/012/023/029/032 | ENV-02;PR / main | contracts / shared carrier变化 | P0-C blocking | `run_ci_gate.sh --suite SUITE-SBX-001` | suite raw + suite md |
| SUITE-SBX-002 `domain-state-matrix` | STA-001~031,31条 | 31 Step 10 enum entries合法 /非法 /terminal /owner;CUT-003~008/014~021 | ENV-02;PR / main | domain / state变化 | P0-C blocking | `run_ci_gate.sh --suite SUITE-SBX-002` | case rows + state coverage |
| SUITE-SBX-003 `config-security-static` | CFG-001~030 + ARCH-001~003,33条 | FDT、I / FC / XVAL / NCFG、dependency、unsupported、redaction static;CUT-027~033 | ENV-02;PR / main / release check | config / manifest / registry / carrier变化 | P0-C blocking;ARCH执行在目标仓缺失时blocked | `run_ci_gate.sh --suite SUITE-SBX-003` | config index + static reports |
| SUITE-SBX-004 `command-query-service` | CMD-001~020 + QRY-001~026,46条 | 10 Command、13 Query、stored result、fail-closed、zero write;CUT-003~010/014~026/031 | ENV-02;PR / main | application / contracts / domain变化 | P0-C blocking | `run_ci_gate.sh --suite SUITE-SBX-004` | service call trace + write audit |
| SUITE-SBX-005 `consumer-event-relay` | CNS-001~022 + EVT-001~015,37条 | 9 Consumer、13 Event、dedup、receipt、payload、relay no rollback;CUT-011/012/020/022/024/026/029/032 | MAIN-CONTRACT使用ENV-02主结果;MAIN-SEAM使用ENV-03补强 | worker / event / publisher变化 | P0-C blocking | `run_ci_gate.sh --suite SUITE-SBX-005` | receipt / relay / payload-safe rows |
| SUITE-SBX-006 `job-maintenance-service` | JOB-001~012,12条 | 10 Job、partial、stored report、no repair;CUT-008/013/017~021/024~026/031 | ENV-02;main | jobs / selection / report变化 | P0-C blocking | `run_ci_gate.sh --suite SUITE-SBX-006` | job item + report rows |
| SUITE-SBX-007 `transaction-replay-flow` | TXN-001~014,14条 | staged UoW、rollback / commit unknown、three-channel replay、version;CUT-002/010~013/020~026 | ENV-02;main | repository / UoW / replay变化 | P0-C blocking | `run_ci_gate.sh --suite SUITE-SBX-007` | stage visibility + replay rows |
| SUITE-SBX-008 `repository-adapter-parity` | 补强,0条唯一主归属 | fake UoW parity、write-audit、adapter unavailable、page / cursor / unique / no-scan;CUT-004~008/010/015~25/28/31 | MAIN-CONTRACT使用ENV-02;MAIN-SEAM使用ENV-03;OPS可扩展参数 | infra / adapter / runtime builder变化 | P0-C blocking | `run_ci_gate.sh --suite SUITE-SBX-008` | parity matrix + port call budget |
| SUITE-SBX-009 `deterministic-race` | RACE-001~019,19条 | 19 deterministic race、single-winner、loser surface;CUT-020/022~025 | ENV-02;main / nightly | concurrency / persistence变化 | P0-C blocking | `run_ci_gate.sh --suite SUITE-SBX-009` | schedule + winner / loser rows |
| SUITE-SBX-010 `error-recovery-closed-set` | ERR-001~038,38条 | 38 typed producer、safe surface、rollback / no-recompute / recovery;CUT-003~008/010~26/29~35 | MAIN-CONTRACT使用ENV-02主结果;MAIN-SEAM使用ENV-03补强;OPS使用ENV-04补强 | error / mapper / adapter变化 | P0-C blocking | `run_ci_gate.sh --suite SUITE-SBX-010` | producer / surface / side-effect rows |
| SUITE-SBX-011 `entry-protocol-inventory` | 补强,0条唯一主归属 | 10 Command +13 Query +9 Consumer +13 Event +10 Job =55协议L4 entry;CUT-009~013/031 | MAIN-CONTRACT使用ENV-02;MAIN-SEAM使用ENV-03补强 | api / worker / jobs registry变化 | P0-C blocking | `run_ci_gate.sh --suite SUITE-SBX-011` | 55 /55 inventory + entry disposition |
| SUITE-SBX-012 `operations-simulation` | 补强,0条唯一主归属 | relay / retry、refresh / projection / reconciliation、lease / cleanup / redline、change / rollback;CUT-007/008/013/018~25/30~32 | ENV-04;operations / nightly / release input | operations / safety / change变化或schedule | P0-C blocking | `run_operations_gate.sh --suite SUITE-SBX-012` | simulation state + cleanup disposition |
| SUITE-SBX-013 `backend-conformance` | CONF-001~013,13条 | four-dimension、bounded lifecycle、capture、reaper、redline、identity、substitution / anti-leak;CUT-029/034~036 | ENV-05;controlled P0-Q trigger | candidate / generation / capability / provider变化 | P0-Q blocking;当前blocked_by_environment | `run_backend_conformance_gate.sh --suite SUITE-SBX-013` | qualification identity + probe / cleanup rows |
| SUITE-SBX-014 `structural-boundedness` | COND-004,1条 | optional不阻断、race / batch有界、无无界sync scan;AC-SBX-036结构性部分 | ENV-02 /04;main / nightly | core flow / batch / scan变化 | P0-C blocking;方法由Step 10补齐 | `run_ci_gate.sh --suite SUITE-SBX-014` | boundedness observations |
| SUITE-SBX-015 `conditional-real-like` | COND-001/002/005,3条 | durable parity、outage / rollout / drift、量化候选;CUT-037 /038 | ENV-06;selected-run | PROFILE-06 qualified后显式选择 | conditional_non_p0 | `run_selected_real_like_gate.sh --suite SUITE-SBX-015` | selected-run / unavailable report |
| SUITE-SBX-016 `future-scope-absence` | COND-003,1条 | production / peripheral / remote / hot surface current absence;CUT-038 | ENV-02 static;PR / design change | public / config / registry变化 | non-P0;命中变化则design-reopen blocking | `run_ci_gate.sh --suite SUITE-SBX-016` | scope absence / reopen report |

主归属计数: P0-C 237条 = SUITE-001~007 /009 /010 /014;P0-Q 13条 = SUITE-013;conditional 4条 = SUITE-015 /016;合计254条。SUITE-008 /011 /012只承担L3 / L4 / operations补强,不重复计数。

## 5. Gate与CI/CD阻断图

```text
PR change
  -> GATE-SBX-PR [ENV-02 / PROFILE-02]
     -> SUITE-001 / 002 / 003 / 004
     -> SUITE-016 scope absence

main merge
  -> GATE-SBX-MAIN
     -> MAIN-CONTRACT fixed source run [ENV-02 / PROFILE-02]
        -> GATE-SBX-PR blocking suites
        -> SUITE-005 / 006 / 007 / 008 / 009 / 010 / 011 / 014
     -> MAIN-SEAM fixed source run [ENV-03 / PROFILE-03]
        -> controlled supplements for SUITE-005 / 008 / 010 / 011

nightly / operations trigger
  -> GATE-SBX-OPS [ENV-04 / PROFILE-04]
     -> fixed main run reference
     -> SUITE-012 + expanded parameters for 007~010 / 014

authorized P0-Q trigger
  -> GATE-SBX-P0Q [ENV-05 / PROFILE-05]
     -> qualification preflight
     -> SUITE-013 deterministic harness
     -> cleanup / containment disposition

release candidate summary
  -> GATE-SBX-RELEASE [aggregator ENV-02 / PROFILE-02]
     -> fixed MAIN-CONTRACT source run
     -> fixed MAIN-SEAM source run
     -> fixed OPS source run
     -> fixed P0Q source run
     -> TC / protocol / redaction / dependency / pairing checks
     -> any failed / blocked / missing => release blocked

selected P1
  -> GATE-SBX-P1 [ENV-06 / PROFILE-06]
     -> SUITE-015;unavailable is conditional not-run,never P0 pass
```

门禁规则:

- PR gate提供快速最早失败,不代替main完整P0-C。
- GATE-SBX-MAIN保持单一gate ID,但release source必须拆成两个不同run:MAIN-CONTRACT在ENV-02产出237条P0-C主归属、MAIN checks和完整main suite集合;MAIN-SEAM在ENV-03产出005 /008 /010 /011 controlled补强。二者不得在一个context中声明两套ENV / PROFILE。
- ENV-04专属case仍由固定OPS source run承接;不得以测试计数替代TC / parameter列表。
- GATE-SBX-P0Q的Blocked与Failed同样阻断整体核心资格;当前因ENV-05不存在只能保持Blocked。
- GATE-SBX-RELEASE只聚合固定run引用和artifact digest,不得重建结果、使用`latest`或把P1替代P0。
- 诊断重跑必须产生新`<run_id>`并记录`parent_run_id`;不得覆盖原failed / blocked artifact。

## 6. Planned gate / report / check脚本契约

| Planned脚本 | 类型 /状态 | 必需输入 | 计划输出 | 失败处理 |
|---|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | gate;planned_not_implemented | `--gate pr/main/nightly`;`--suite`;`--run-id`;`--artifact-root`;`--config-profile`;作为release source时显式`--release-source-role`并取MAIN-CONTRACT或MAIN-SEAM | suite raw under固定run root | nonzero;保留首个failure / infra status;role / ENV / PROFILE错配时0 suite launch |
| `scripts/gates/run_operations_gate.sh` | gate;planned_not_implemented | run / profile / simulation source / suite | ENV-04 simulation raw | missing replay / cleanup disposition阻断 |
| `scripts/gates/run_backend_conformance_gate.sh` | gate;planned_not_implemented | run / profile / immutable qualification manifest / suite | ENV-05 preflight、probe、cleanup raw | identity缺失立即Blocked且0 launch |
| `scripts/gates/run_release_gate.sh` | gate;planned_not_implemented | own run ID +按序fixed MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q run identity与digests | release gate summary raw / report | 任一failed / blocked / missing / role / identity / digest mismatch阻断 |
| `scripts/gates/run_selected_real_like_gate.sh` | gate;planned_not_implemented | run / PROFILE-06 / selected scenario | conditional selected-run raw | unavailable / unqualified记not-run,不改P0 |
| `scripts/reports/generate_reports.sh` | report;candidate from formal`03`,not implemented | `--stage suite/run/evidence`;run / artifact root / report root | suite / run summary;minimal或final evidence index / detail按stage | raw缺失 / schema错非zero;不得推断pass或静态分配EV |
| `scripts/reports/generate_gate_results.sh` | report;planned_not_implemented | fixed run artifacts / source run refs | `gate-results.md` | 保持failed / blocked / not-run原状态 |
| `scripts/reports/generate_acceptance_handoff.sh` | report;defined_by_step_13,not implemented | fixed release run +按序fixed MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q reports + evidence index | `reports/acceptance/handoff.md`,`veto-checklist.md`,`risk-acceptance.md`,`open-issues.md` draft set | 每份文件内绑定fixed release run与四源digest;只生成初稿,不得写验收pass或伪签署 |
| `scripts/checks/check_redaction.sh` | check;candidate from formal`03`,not implemented | artifact root / report root / deny marker catalog | redaction raw + report | raw secret / body / full ref / stack命中阻断,报告不回显正文 |
| `scripts/checks/check_dependency_boundary.sh` | check;planned_not_implemented | manifest / generated dependency graph | dependency raw + report | 非core sibling compile dependency阻断 |
| `scripts/checks/check_tc_coverage.sh` | check;planned_not_implemented | suite case rows + expected TC manifest | TC coverage raw + report | P0 TC缺失、换义、重复主归属阻断 |
| `scripts/checks/check_protocol_inventory.sh` | check;planned_not_implemented | SUITE-011 rows + expected 55 protocol manifest | protocol inventory report | 非55 /55或family mismatch阻断 |
| `scripts/checks/check_artifact_report_pairing.sh` | check;planned_not_implemented | artifact root + report root | pairing report | blocking suite缺raw / report / digest阻断 |
| `scripts/checks/check_no_static_evidence.sh` | check;planned_not_implemented | reports / acceptance draft / index | no-fabrication report | 静态声明EV / pass、无raw回链阻断 |
| `scripts/checks/check_qualification_identity.sh` | check;planned_not_implemented | ENV-05 manifest + case rows | identity continuity report | candidate / profile / generation / environment / material mismatch阻断 |
| `scripts/checks/check_blocked_propagation.sh` | check;planned_not_implemented | suite / gate summaries | blocked propagation report | blocked被映射skip / pass / N/A阻断 |
| `scripts/checks/check_cleanup_disposition.sh` | check;planned_not_implemented | P0-Q / ops case rows | cleanup / containment report | missing disposition、guard bypass或teardown failure阻断 |

所有五个gate writer还必须接收并原样写入Step 13 `meta/context.json`所需的`run_intent`,`run_scope`,`trigger_refs[]`,`change_refs[]`。可被RELEASE消费的source run还必须显式写入`release_source_role`;CLI可使用repeatable `--trigger-ref` / `--change-ref`,但JSON必须排序去重。MAIN-CONTRACT固定ENV-02 / PROFILE-02,MAIN-SEAM固定ENV-03 / PROFILE-03,OPS固定ENV-04 / PROFILE-04,Qualification / P0Q固定ENV-05 / PROFILE-05 + `RT-SBX-017`;ReleaseAggregation固定`Release`及聚合器ENV-02 / PROFILE-02并省略source role;Conditional固定ENV-06 / PROFILE-06。缺失或组合非法时必须在suite launch前Blocked / InfraFailed且0推断默认值。`generate_reports.sh`和`generate_gate_results.sh`必须从context读取并渲染scope / change refs,不得从文件路径、suite名或commit message猜测。

目录约束:

- gate脚本只允许在`scripts/gates/`,report生成器只允许在`scripts/reports/`,check只允许在`scripts/checks/`。
- 当前仓中这些路径均未创建;表中命令不能用作“已执行”证明。
- `reports/`只放输出,不得放生成脚本。

## 7. Artifact与Report最小契约

| 输出 | 计划路径 | 最小字段 /内容 | 真实性规则 |
|---|---|---|---|
| suite result | `artifacts/test/<run_id>/suites/<suite_id>/report.json` | Step 13 schema,run / suite / gate,env / profile,subject revision,config identity,status,counts,duration,case index,digest | 必须由suite执行生成;Failed / Blocked / InfraFailed仍写;本文不创建实例 |
| case result | `artifacts/test/<run_id>/suites/<suite_id>/cases/<tc_id>/<parameter_id>.json` | tc_id,layer,parameter,dataset refs,status,assertion codes,failure code,artifact refs | 同一TC补强执行保留相同tc_id;不得静态填pass |
| raw logs | `artifacts/test/<run_id>/suites/<suite_id>/stdout.log`;`stderr.log` | redacted stdout / stderr;digest由`report.json`引用 | 禁止raw output、secret、provider response、stack正文 |
| qualification result | `artifacts/test/<run_id>/suites/SUITE-SBX-013/qualification-result.json` | candidate / profile / generation / env / capability / template / provider digests,probe refs,cleanup disposition,status | identity缺失只能Blocked,不能补默认值 |
| TC coverage raw | `artifacts/test/<run_id>/checks/tc-coverage.json` | expected / observed / missing / duplicate / conditional / blocked TC | expected集合必须来自确认Step 6 |
| suite report | `reports/runs/<run_id>/suites/<suite_id>.md` | raw digest、status、TC / CUT / PER、failure / blocked reason、cleanup summary | 只能由固定run raw生成 |
| gate results | `reports/runs/<run_id>/gate-results.md` | source run IDs / digests、blocking statuses、missing items | 不得把P1或低profile写成P0来源 |
| TC / protocol coverage | `reports/runs/<run_id>/tc-coverage.md`;`protocol-inventory.md` | 254主归属、237 /13 /4成熟度、55协议inventory | 缺项即对应gate失败 |
| planned requirement coverage | `reports/runs/<run_id>/per-coverage.md` | PER-SBX-001~038到suite / raw refs /状态 | 不是EV index;Step 13再定义正式证据 |
| acceptance handoff | `reports/acceptance/` | `handoff.md`,`veto-checklist.md`,`risk-acceptance.md`,`open-issues.md`初稿 | 每份文件必须记录同一fixed release run和来源digest并由人 / Agent审查;不可伪签署 |

统一status闭集由Step 13最终收口,Step 9最低要求保留`Passed / Failed / Blocked / NotRunConditional / InfraFailed`差异。`Blocked`、`InfraFailed`和`NotRunConditional`不得归一成Skipped；只有真实case完成全部断言才可产生Passed实例。

## 8. Suite到CUT / TC / PER /产物映射

| Suite | 主 /补强CUT | TC区间 | Planned requirement | Artifact / report | 阻断 |
|---|---|---|---|---|---|
| SUITE-001 | 001/002/012/023/029/032 | CTR-001~006 | PER-001/002/012/023/029/032 | suite raw / md | P0-C |
| SUITE-002 | 003~008/014~021/026 | STA-001~031 | PER-003~008/014~021/026 | state coverage | P0-C |
| SUITE-003 | 027~033/038 | CFG-001~030;ARCH-001~003 | PER-027~033/038;EHR-01~20适用 | config / dependency / redaction reports | P0-C;future scope reopen |
| SUITE-004 | 003~010/014~026/031 | CMD-001~020;QRY-001~026 | PER-003~010/014~026/031 | service / write-audit rows | P0-C |
| SUITE-005 | 006~008/011/012/017/020/022/024~026/029/032 | CNS-001~022;EVT-001~015 | 对应PER | receipt / relay / event rows | P0-C |
| SUITE-006 | 008/013/017~021/024~026/031 | JOB-001~012 | 对应PER | job / report rows | P0-C |
| SUITE-007 | 002/010~013/020~026/031 | TXN-001~014 | 对应PER | transaction / replay rows | P0-C |
| SUITE-008 | 004~008/010/015~025/028/031 | relevant CMD / QRY / CNS / EVT / JOB / TXN / RACE | 对应PER;EHR-02/06/09/10/14~16 | parity / call-budget rows | P0-C |
| SUITE-009 | 020/022~025 | RACE-001~019 | PER-020/022~025 | schedule rows | P0-C |
| SUITE-010 | 003~008/010~026/029~035 | ERR-001~038 | PER-026 + producer owner PER | error closed-set rows | P0-C;L5 subset另blocked |
| SUITE-011 | 009~013/031 | CMD-001~020;QRY-001~026;CNS-005~022 protocol rows;EVT-001~013;JOB-001~010 | PER-009~013/031 | 55 protocol inventory | P0-C |
| SUITE-012 | 007/008/013/018~025/030~032 | relevant safety / read / relay / job / race / config rows | 对应PER;EHR-09~17 | simulation / cleanup rows | P0-C |
| SUITE-013 | 029/034~036 | CONF-001~013 | PER-029/034~036;EHR-04/07/08/14~17/20 | qualification raw / report | P0-Q;当前Blocked |
| SUITE-014 | 004~007/025/030 | COND-004 | PER-004~007/025/030 | boundedness report | P0-C;Step 10补方法 |
| SUITE-015 | 037/038 | COND-001/002/005 | PER-037/038 | selected-run report | conditional_non_p0 |
| SUITE-016 | 038 | COND-003 | PER-038;EHR-19/20 | scope absence report | conditional;变化触发重开 |

表内`SUITE-001`按`SUITE-SBX-001`展开,`CTR-001`按`TC-SBX-CTR-001`展开,`PER-001`按`PER-SBX-001`展开。紧凑引用不创建新ID。

### 8.1 PER-SBX-001~038 planned producer矩阵

本表的“证据ID”使用Step 5已确认的planned requirement `PER-SBX-*`,不是正式EV。`planned artifact / report`只定义未来producer形态,真实路径实例必须绑定真实`<run_id>`。

| Planned requirement | 主producer suite / gate | 补强producer | Planned artifact / report | 当前成熟度 |
|---|---|---|---|---|
| PER-SBX-001 | SUITE-001 / GATE-PR | SUITE-011 entry inventory | carrier case rows / suite report | planned_not_implemented |
| PER-SBX-002 | SUITE-001 / GATE-PR | SUITE-004 /007 | metadata / digest / cursor rows | planned_not_implemented |
| PER-SBX-003 | SUITE-002 /004 / GATE-PR | SUITE-010 /011 | context / identity state + entry rows | planned_not_implemented |
| PER-SBX-004 | SUITE-004 / GATE-MAIN | SUITE-002 /008;SUITE-013不得替代 | boundary decision / adapter rows | planned_not_implemented |
| PER-SBX-005 | SUITE-004 / GATE-PR | SUITE-002 /010 | policy fail-closed rows | planned_not_implemented |
| PER-SBX-006 | SUITE-004 /005 / GATE-MAIN | SUITE-010 /012;SUITE-013 real subset | run / capture / handoff rows | planned_not_implemented;real subset blocked |
| PER-SBX-007 | SUITE-002 /012 / GATE-OPS | SUITE-004 /010;SUITE-013 real subset | safety guard / simulation rows | planned_not_implemented;real subset blocked |
| PER-SBX-008 | SUITE-012 / GATE-OPS | SUITE-002 /004 /006 | read / maintenance / no-repair rows | planned_not_implemented |
| PER-SBX-009 | SUITE-004 / GATE-MAIN | SUITE-011 | 10 Command service + entry inventory | planned_not_implemented |
| PER-SBX-010 | SUITE-004 / GATE-MAIN | SUITE-008 /011 | 13 Query + write-audit inventory | planned_not_implemented |
| PER-SBX-011 | SUITE-005 / GATE-MAIN | SUITE-010 /011 | 9 Consumer / receipt inventory | planned_not_implemented |
| PER-SBX-012 | SUITE-005 / GATE-MAIN | SUITE-001 /007 /011 | 13 Event / relay / payload rows | planned_not_implemented |
| PER-SBX-013 | SUITE-006 / GATE-MAIN | SUITE-008 /011 /012 | 10 Job / report inventory | planned_not_implemented |
| PER-SBX-014 | SUITE-002 / GATE-PR | SUITE-004 | intake / identity / reference state rows | planned_not_implemented |
| PER-SBX-015 | SUITE-002 / GATE-PR | SUITE-008 | boundary / handle / lease state rows | planned_not_implemented |
| PER-SBX-016 | SUITE-002 / GATE-PR | SUITE-004 | policy / high-risk state rows | planned_not_implemented |
| PER-SBX-017 | SUITE-002 / GATE-PR | SUITE-005 /006 /008 | run / capture / handoff state rows | planned_not_implemented |
| PER-SBX-018 | SUITE-002 /012 / GATE-OPS | SUITE-004 /006 /008 | failure / control / cleanup / redline rows | planned_not_implemented |
| PER-SBX-019 | SUITE-002 /004 / GATE-MAIN | SUITE-006 /008 /012 | query / projection / report no-write rows | planned_not_implemented |
| PER-SBX-020 | SUITE-005 /007 / GATE-MAIN | SUITE-009 /012 | relay status / race / no-rollback rows | planned_not_implemented |
| PER-SBX-021 | SUITE-002 /007 / GATE-MAIN | SUITE-008 /010 | replay / adapter / config-state rows | planned_not_implemented |
| PER-SBX-022 | SUITE-007 / GATE-MAIN | SUITE-008 /009 /010 | staged transaction visibility rows | planned_not_implemented |
| PER-SBX-023 | SUITE-001 /007 / GATE-MAIN | SUITE-004 /008 | version / cursor / selector rows | planned_not_implemented |
| PER-SBX-024 | SUITE-007 / GATE-MAIN | SUITE-004~006 /009 | three-channel replay rows | planned_not_implemented |
| PER-SBX-025 | SUITE-009 / GATE-MAIN | SUITE-007 /012 | deterministic schedule / winner rows | planned_not_implemented |
| PER-SBX-026 | SUITE-010 / GATE-MAIN | SUITE-001~009 /012按producer | error closed-set / safe-surface rows | planned_not_implemented |
| PER-SBX-027 | SUITE-003 / GATE-PR | none | strict source / parser / item index | planned_not_implemented |
| PER-SBX-028 | SUITE-003 / GATE-PR | SUITE-008 /011 | composition / generation / scoped rows | planned_not_implemented |
| PER-SBX-029 | SUITE-003 / GATE-MAIN | SUITE-005 /010;SUITE-013 provider subset | synthetic carrier scan / material rows | planned_not_implemented;provider subset blocked |
| PER-SBX-030 | SUITE-003 /012 / GATE-OPS | SUITE-014 structural | change / TOCTOU / rollback / drift rows | planned_not_implemented;physical drill conditional |
| PER-SBX-031 | SUITE-011 / GATE-MAIN | SUITE-003 /008 | builder / registry / current-unit inventory | planned_not_implemented |
| PER-SBX-032 | SUITE-003 / GATE-MAIN | SUITE-001 /005~012;redaction check | audit / safe carrier / redaction reports | planned_not_implemented |
| PER-SBX-033 | SUITE-003 / GATE-PR | SUITE-011 /016 | dependency / unsupported surface reports | blocked_by_target_repo for execution |
| PER-SBX-034 | SUITE-013 / GATE-P0Q | qualification identity check | four-dimension probe rows | designed_execution_blocked |
| PER-SBX-035 | SUITE-013 / GATE-P0Q | cleanup / redaction checks | lifecycle / capture / cleanup / redline rows | designed_execution_blocked |
| PER-SBX-036 | SUITE-013 / GATE-P0Q | SUITE-003 static + identity / blocked checks | qualification packet / substitution veto | designed_execution_blocked |
| PER-SBX-037 | SUITE-015 / GATE-P1 | SUITE-012 change simulation | durable / outage / rollout selected report | conditional_non_p0 |
| PER-SBX-038 | SUITE-016 / GATE-SCOPE-REOPEN | SUITE-015量化候选 / SUITE-003 static | scope absence / conditional report | conditional_non_p0 |

Producer审计: 38 /38 PER均有主producer、gate、planned artifact / report和成熟度;P0-Q的PER-034~036保持Blocked,PER-037 /038保持conditional,无PER被静态映射成EV或Passed。

## 9. Gate触发、传播与选择性执行

| Gate | 触发 | 必需suite /检查 | 允许选择性 | 失败 /不可用传播 |
|---|---|---|---|---|
| GATE-SBX-PR | PR / source change | 001~004 +016;dependency / TC manifest checks | 可按changed path减少补强参数,不可删除受影响主归属 | P0 suite failed / infra failed阻断merge;scope change触发设计重开 |
| GATE-SBX-MAIN | merge / main;两个fixed source run | MAIN-CONTRACT:ENV-02的001~011 +014、237条主结果和MAIN checks;MAIN-SEAM:ENV-03的005 /008 /010 /011补强 | 不允许以PR结果替代;两个role必须分别完整且不同run ID | 任一role失败 /缺raw /role identity错配均阻断main qualification |
| GATE-SBX-OPS | nightly / operations change / release input | 012 + expanded 007~010 /014;cleanup / pairing checks | 参数集可分片,汇总必须完整 | failed / missing阻断该operations run成为release输入 |
| GATE-SBX-P0Q | authorized candidate trigger | 013;identity / redaction / cleanup checks | 不允许替换candidate / env / generation;case可受控分批但同packet完整 | Blocked / Failed / identity mismatch均阻断P0-Q |
| GATE-SBX-RELEASE | release candidate;聚合器SBX-ENV-02 / SBX-PROFILE-02 | 按`MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q`顺序fixed四源refs;all checks;report generation | 聚合器身份不产生P0证明效力;不允许删源、换序或挑掉failed suite | 当前必然Blocked直到四源和SBX-ENV-05形成;不得伪pass |
| GATE-SBX-P1 | explicit selected-run | 015 | 仅激活的conditional case | unavailable / not qualified不阻断P0,但不能写P1 pass |
| GATE-SBX-SCOPE-REOPEN | public / config / product scope change | 003 /016 static results + design diff | 无 | 命中future surface先回写`00~04`,暂停相关实现 /测试 |

选择性执行只能减少未受影响suite的重复运行,不能减少固定run coverage manifest。Release四源必须使用相同design / subject / core-contracts / test-harness revision;每个source分别固定自己的profile-specific config、dataset和suite manifest。跨profile配置无需伪装成同一generation,但role / gate / ENV / PROFILE、source context和各自digest必须精确匹配;不一致时Blocked。

## 10. 自动化门禁停审记录

| Suite / Gate | 审查项 | 结论 | 缺口 /修正 |
|---|---|---|---|
| SUITE-001~003 | carrier / state / config / static是否最早失败 | 通过设计停审 | actual test package留实现仓。 |
| SUITE-004~007 | service / event / job / transaction是否逐协议 / channel | 通过设计停审 | 无E2E抽样替代。 |
| SUITE-008~010 | parity / race / error注入是否deterministic | 通过设计停审 | scheduler / fault API留实现。 |
| SUITE-011 | 55协议是否全量entry inventory | 通过设计停审 | 10 +13 +9 +13 +10固定。 |
| SUITE-012 | operations simulation是否保持no-real-release | 通过设计停审 | ENV-04 artifact实例未形成。 |
| SUITE-013 / GATE-P0Q | 资格identity / blocked / cleanup是否完整 | 通过设计停审;执行Blocked | candidate / provider / lab未形成。 |
| SUITE-014 | AC-SBX-036结构性部分是否进入P0-C | 通过设计停审 | 观察方法留Step 10,不继承旧阈值。 |
| SUITE-015 /016 | conditional / future scope是否不补偿P0 | 通过 | 激活条件与重开门禁明确。 |
| GATE-PR / MAIN / OPS | 触发、阻断、固定run是否明确 | 通过设计停审 | CI实现不存在。 |
| GATE-RELEASE | 是否拒绝blocked / missing / latest / P1替代 | 通过设计停审 | 当前只能Blocked。 |
| planned scripts | 目录、参数、输出、失败语义是否符合标准 | 通过 | 全部标记not implemented。 |

## 11. 跨Suite / Gate /证据审计

| 审计项 | 结论 | 缺口 /修正 |
|---|---|---|
| 254条TC是否有唯一主归属 | 是:237 P0-C +13 P0-Q +4 conditional。 | 补强执行不重复主计数。 |
| 38个CUT是否有suite / gate去向 | 是。 | PER-001~038均已绑定planned producer。 |
| 55协议是否全量进入L2 / L4 | 是,service族 + SUITE-011 inventory。 | 无抽样。 |
| write-audit / fault / race是否可定位 | 是,SUITE-004 /007~010 /012。 | 实现能力留`07`。 |
| P0是否存在manual-only断言 | 否。 | ENV-05只允许人工授权启动自动harness。 |
| P0-Q是否被fake / simulation / P1替代 | 否。 | GATE-P0Q blocked传播到release。 |
| artifact / report是否固定run且配对 | 是,禁止latest和project子层。 | 实例留执行。 |
| 是否使用正式EV | 否,只绑定PER。 | Step 13已定义runtime evidence schema /索引;仍不静态分配EV。 |
| 是否静态造pass / evidence | 禁止,有check契约。 | 无实例。 |
| blocked / infra / conditional是否混成skip | 否,最低status闭集分离。 | Step 13最终schema。 |
| acceptance报告是否越级生成 | 否,只预留Step 13脚本和路径。 | 未创建reports。 |
| 是否声称脚本 / CI /测试存在 | 否,全部planned_not_implemented。 | 目标仓仍open。 |

## 12. Blocker与Step 10承接

| 项 | 状态 | 对当前Step影响 | 后续处理 |
|---|---|---|---|
| 目标实现仓 / test packages / CI不存在 | open_for_07_precheck | 不阻塞门禁设计;全部suite planned | `07`创建实现boundary时落suite / script / manifest。 |
| `core-contracts` exact types /目标路径未复核 | open_for_07_precheck | SUITE-001 /003 /011不能执行 | `07` precheck;缺失回写`03`。 |
| ENV-05 / candidate / provider / lab不存在 | open_for_p0q_execution | SUITE-013 / GATE-P0Q / release保持Blocked | Step 10已定义专项方法;`07/09`后续形成实例。 |
| AC-SBX-036结构性观察方法与量化门槛 | resolved_by_step_10 | SUITE-014已有gate位置,COND-005仍conditional | Step 10已固定P0-C结构性方法,量化部分因无正式基线保持conditional。 |
| Step 13最终artifact / evidence / acceptance schema | resolved_by_step_13 | 本Step的最小字段和PER已由Step 13完整schema承接 | Step 13已闭合runtime EV / index / acceptance handoff,未创建实例。 |
| Step 9 suite result / log路径与当前Step 13标准不一致 | resolved_by_step_13_writeback | 原` suite-result.json` / `logs/`不能满足失败suite固定`report.json` / stdout / stderr契约 | 已在本文件回写为`report.json`,`stdout.log`,`stderr.log`;不创建文件实例。 |
| Step 14 regression run选择依据无法机器归档 | resolved_by_step_14_writeback | 原gate输入 / context只含suite / gate / profile,无法审计intent / scope / trigger / change | 已增加统一gate writer输入并回写Step 13 context schema;不创建run实例。 |

Step 10已按以下清单完成读取与承接:

1. 正式需求六类NFR与AC-SBX-035~041、VF / VETO方向。
2. 正式`03`事务 /错误 /并发 /观测与正式`04`安全 /failure /profile资格。
3. Step 6安全 /资格TC、Step 7专项数据、Step 8环境和本Step suite / gate。
4. 测试SOP Step 10与书写规范§5.10。
5. 性能、安全、一致性、恢复、观测、审计逐项方法、环境、来源阈值 /通过条件和PER去向。

## 13. 回填草稿

正式`05-测试方案.md` §9后续应装配:

- §4的16 suite和254条主归属。
- §5 / §9的PR / main / operations / P0-Q / release / P1 / scope-reopen门禁。
- §6 planned脚本契约与not-implemented声明。
- §7 artifact / report最小契约和固定run规则。
- §8 suite到CUT / TC / PER映射、§10~§12审计与blocker。

当前不得修改旧正式`05`;只能在Step 15由已确认Step 1~14整体装配。

## 14. 当前结论

Step 9在设计层已完成:

- 254条TC全部有唯一主suite,并按P0-C 237、P0-Q 13、conditional 4分离。
- 55协议、30状态、38错误、19 race、FDT-01~30和P0-Q均有自动化 / harness去向。
- P0没有manual-only断言;ENV-05人工启动不替代机器判定。
- Gate、planned命令、固定run路径、artifact / report、PER和blocked传播已闭合。
- GATE-P0Q和GATE-RELEASE因真实前置缺失保持Blocked,不得伪pass。
- 未创建脚本、CI、suite实现、run_id实例、artifact、report、EV、结果或签署。

当前状态为`reviewed_passed_to_step_10`。用户已确认Step 9;Step 10完成后必须重新停审。
