# Step 10 分件 B. Report、Handoff与Independent Review完整性登记

> 父Step: `06_acceptance_step_10_observability_evidence.md`
> Slot追溯: `06_acceptance_step_10_evidence_traceability_register.md`
> 上游真相源: `05-测试方案.md` §9 /§13;`05_test_plan_step_13_evidence.md`;`05_test_plan_step_13_evidence_schemas.md`
> 生成日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_11
> 事实边界: 本文定义fixed path、minimum content、writer / reader、validation、review和缺失传播,不创建任何report、review record、风险接受、验收结论或签署实例。

---

## 1. 登记语义、分层与固定入口

`RSTOP-SBX-001~021`是逐artifact / report / handoff的设计停审索引,`VC-SBX-001~009`是validation control设计索引,`ECA-SBX-001~021`是跨证据裁决审计索引。三者都不是canonical AC、TC、runtime EV、defect、VETO或machine schema enum。

| 层级 | 固定root | Writer | Reader | 能否人工改结果 |
|---|---|---|---|---|
| machine raw | `artifacts/test/<run_id>/` | gate / harness / check artifact writer | gate / report / evidence generator / reviewer | 否;immutable |
| human run report | `reports/runs/<run_id>/` | `scripts/reports/*`和check report writer | QA / reviewer / acceptance | 可补safe说明,不得改raw status / digest |
| acceptance draft / packet | `reports/acceptance/` | handoff generator草稿 + acceptance review补充 | acceptance reviewer / final authority | 可补充责任与裁决说明,不得伪造raw / EV |
| independent review | `reports/review/` | human reviewer / review agent分别写 | acceptance / final authority / audit | 只写review record,不得回写raw / report status |

固定入口禁止project子层、`latest`、branch、mutable tag、acceptance / review的`<release_run_id>`子目录与同义第二文件。fixed RELEASE、四源run / digest和review version全部由文件正文承载。

---

## 2. 逐artifact / report完整性与设计停审

| Stop | 对象 /固定路径 | 最低来源与内容 | 独立停审条件 | 缺失 /失败影响 | 当前事实 |
|---|---|---|---|---|---|
| RSTOP-SBX-001 | run identity packet:`meta/context.json`,`source-commits.json`,`config-digest.json` | 三类schema;run / gate / intent / scope / refs / role / ENV / PROFILE / revisions / config / roots / digest | cross-field、path、revision、digest与fixed role全部一致 | source不可升格;RELEASE Blocked | absent |
| RSTOP-SBX-002 | suite raw bundle:`suites/<suite>/report.json`,logs,cases,safe artifacts | suite / case / safe-artifact schema;expected / observed / assertions / failures / disposition / exact-bytes log digest | Passed / Failed / Blocked / NotRunConditional / InfraFailed均保留;无输出保留零字节log | pairing Failed;不分配EV | absent |
| RSTOP-SBX-003 | machine evidence index:`artifacts/test/<run_id>/evidence-index.json` | reviewed slot catalog、expected / missing、real items、ordered source refs、validation refs、item / root digest | item只从raw / report pair生成;P0 expected 001~019;no orphan / duplicate / static | 送验不成立 | absent |
| RSTOP-SBX-004 | `reports/runs/<run_id>/summary.md` | context / source / config digests、gate、scope、suite / TC counts、status、blocked / failure / conditional summary | 与raw和所有suite status一致,不忽略失败 /未运行 | run report incomplete | absent |
| RSTOP-SBX-005 | `reports/runs/<run_id>/gate-results.md` | applicable gate、source role / run / digest、blocking status、missing、failure / blocked reason、conditional disposition | 覆盖当次全部适用gate;原样保留status;项目内无第二活跃路径 | release gate不可裁决 | absent |
| RSTOP-SBX-006 | `reports/runs/<run_id>/evidence-index.md` | machine index digest、expected / missing slot、每item的TC / suite / raw / report / AC / VF / status / digest / review state | 每个P0 item可从Markdown定位到machine item,但不从Markdown反推raw | P0 evidence incomplete / orphan | absent |
| RSTOP-SBX-007 | `reports/runs/<run_id>/tc-coverage.md` | 254 expected / observed / primary、237 P0-C /13 P0-Q /4 conditional、missing / duplicate / blocked | 分母与reviewed TC manifest一致,主归属唯一 | coverage Failed | absent |
| RSTOP-SBX-008 | `reports/runs/<run_id>/protocol-inventory.md` | 10 Command /13 Query /9 Consumer /13 Event /10 Job、55 protocol到TC / suite / status | 55 /55,exact formal name / family,无旧名 /临时surface | AC-031及相关门禁不可通过 | absent |
| RSTOP-SBX-009 | `reports/runs/<run_id>/per-coverage.md` | PER-SBX-001~038到CUT / TC / suite / raw refs / status | 38 /38,不得将PER当EV或用静态coverage补raw | planned requirement追溯不完整 | absent |
| RSTOP-SBX-010 | `reports/runs/<run_id>/redaction-check.md` | scanned roots / digests、deny catalog ref、safe finding codes / refs、status | artifact / run / acceptance / review根均扫描;report不回显match正文 | evidence gate Failed;传Step 11 | absent |
| RSTOP-SBX-011 | `reports/runs/<run_id>/dependency-boundary.md` | manifest / generated graph digests、allowed / observed edges、safe findings、status | 只有允许的core compile upstream,无non-core sibling source dep | 架构红线失败;传Step 11 | absent |
| RSTOP-SBX-012 | `reports/runs/<run_id>/report-audit.md` | pairing、no-static、orphan / duplicate、path / digest、status propagation、partial report和safe findings | 九validation control的适用结果可回指raw check,不为control伪造EV | evidence integrity Failed | absent |
| RSTOP-SBX-013 | `reports/runs/<run_id>/suites/<suite_id>.md` | suite raw digest、identity、expected / observed TC、counts、status、failure / blocked、cleanup summary | 与`report.json`一致;失败仍可读;不包raw output | 对应suite evidence不可用 | absent |
| RSTOP-SBX-014 | `reports/runs/<run_id>/evidence/<evidence_id>.md` | evidence tuple、slot / family、TC / assertions、raw / report / checks、AC / VF、status、digest | 只对valid runtime item生成;与machine item字段一致 | 缺detail或静态detail使item不可接受 | absent |
| RSTOP-SBX-015 | `suites/SUITE-SBX-013/qualification-result.json`及SUITE-013 report | candidate / profile / generation / ENV / capability / template / provider digest、probe、disposition、teardown、redaction | identity先于probe;P0Q only;缺identity时Blocked + 0 probe | P0-Q / RELEASE Blocked | absent |
| RSTOP-SBX-016 | `reports/acceptance/handoff.md` | fixed RELEASE /四源identity / digest、design / subject、mandatory / conditional / inactive scope、missing / limitation、review version | entry前作draft存在且不预填pass;决策前有review回链 | draft缺失阻entry;未审查阻decision | absent |
| RSTOP-SBX-017 | `reports/acceptance/veto-checklist.md` | 同一RELEASE /四源;VF-SBX / VETO-CFG /后续VETO-SBX的source / evidence / check / defect / status | 无默认Passed,无缺项;失败不被risk acceptance覆盖 | 不得通过 | absent |
| RSTOP-SBX-018 | `reports/acceptance/risk-acceptance.md` | 同一RELEASE /四源;candidate RR / defect、impact、owner role、action、expiry source、invalidation trigger、review version | 当前不预填acceptance;最终只含Step 13允许项;空集也显式 | 缺失时不得有条件通过 | absent |
| RSTOP-SBX-019 | `reports/acceptance/open-issues.md` | 同一RELEASE /四源;Failed / Blocked / InfraFailed / missing / invalidated / disputed、defect refs、status | 与gate / evidence / defect / review全量对账,无隐藏或N/A吞并 | packet不完整;不得DecisionReady | absent |
| RSTOP-SBX-020 | `reports/review/reviewer-notes.md` | 同一RELEASE /四源、reviewer identity / version / time、sample paths / digests、findings / disputes / refs | 独立human review完成;不修改raw / report status | 缺失或Disputed未处置阻decision | absent |
| RSTOP-SBX-021 | `reports/review/agent-review.md` | 同一RELEASE /四源、agent / tool version ref、orphan / duplicate / path / digest / redaction / trace审计 | 独立mechanical review完成;不写risk acceptance / signoff | 缺失或unresolved finding阻decision | absent |

上表的“设计停审条件”是后续实现和执行必须支持的可判定契约。当前21个对象实例均为absent,所以没有任何runtime stop-review Passed。

---

## 3. 九项Validation Control闭环

| Control | Planned script | Raw check | Human report / 消费位置 | 通过条件 | 失败处置 |
|---|---|---|---|---|---|
| VC-SBX-001 Redaction | `scripts/checks/check_redaction.sh` | `checks/<redaction_check_id>.json` | `redaction-check.md`;`report-audit.md`;veto draft | 全四层root Clean,负向fixture safe,无正文回显 | Failed;不得通过,传Step 11 |
| VC-SBX-002 Dependency | `check_dependency_boundary.sh` | `checks/<dependency_check_id>.json` | `dependency-boundary.md`;`report-audit.md`;veto draft | manifest / graph一致,只有允许core edge | Failed;架构红线候选 |
| VC-SBX-003 TC coverage | `check_tc_coverage.sh` | `checks/<tc_coverage_check_id>.json` | `tc-coverage.md`;`report-audit.md` | 254主归属完整且分母 / maturity一致 | Failed;不得声明P0覆盖 |
| VC-SBX-004 Protocol inventory | `check_protocol_inventory.sh` | `checks/<protocol_check_id>.json` | `protocol-inventory.md`;`report-audit.md` | 55 /55 exact formal surface与family | Failed;AC-031等不可通过 |
| VC-SBX-005 Pairing | `check_artifact_report_pairing.sh` | `checks/<pairing_check_id>.json` | `report-audit.md`;evidence index | blocking invocation / item的raw / report / digest pair完整 | Failed;不分配 /不接受EV |
| VC-SBX-006 No-static | `check_no_static_evidence.sh` | `checks/<no_static_check_id>.json` | `report-audit.md`;acceptance draft scan | 无静态EV / pass / signature,每item有real pair | Failed;证据完整性阻断 |
| VC-SBX-007 Qualification identity | `check_qualification_identity.sh` | `checks/<qualification_identity_check_id>.json` | qualification / suite report;`report-audit.md` | candidate / profile / generation / ENV / material适用identity连续 | 缺失则Blocked + 0 launch;错配则Failed |
| VC-SBX-008 Blocked propagation | `check_blocked_propagation.sh` | `checks/<blocked_check_id>.json` | `gate-results.md`;`report-audit.md`;open issues | Blocked / InfraFailed / NotRunConditional无Skipped / Passed / N/A吞并 | Failed;RELEASE不可通过 |
| VC-SBX-009 Cleanup disposition | `check_cleanup_disposition.sh` | `checks/<cleanup_check_id>.json` | suite / qualification / gate reports;open issues / veto | 所有test resource有cleaned / contained / investigation / teardown处置 | Failed / Blocked;阻断evidence / entry,传Step 11 |

validation control是证据可信性前置,不自动生成runtime EV。`report-audit.md`可聚合它们的safe结果,但必须回指各自raw check path / digest / status,不得用一行“all checks passed”取代。

---

## 4. Fixed Source报告交接和RELEASE聚合审查

| 交接项 | MAIN-CONTRACT | MAIN-SEAM | OPS | P0Q | RELEASE要求 |
|---|---|---|---|---|---|
| context role | exact `MAIN-CONTRACT` | exact `MAIN-SEAM` | exact `OPS` | exact `P0Q` | aggregation context省略role,按左到右顺序引用 |
| gate / ENV / PROFILE | MAIN / 02 /02 | MAIN /03 /03 | OPS /04 /04 | P0Q /05 /05 | RELEASE /02 /02只是聚合器身份 |
| source identity | design / subject / core / harness revision与其他三源一致 | 同左 | 同左 | 同左 | 逐源校验,不从Markdown推断 |
| config / data / suite identity | 与自context一致 | 与自context一致 | 与自context一致 | 与自context一致 | 不要求跨profile config generation相等 |
| report minimum | summary、gate results、evidence / coverage、checks、suite / detail | 同左的适用集 | 同左 + cleanup / lifecycle | 同左 + qualification / teardown | 检查四源与P0 expected slots,不重写source result |
| 缺失传播 | P0-C / RELEASE Blocked | controlled seam / RELEASE Blocked | operations / RELEASE Blocked | P0-Q / RELEASE Blocked | 禁止删源、换序、PR / P1 / diagnostic替代 |

RELEASE `source_run_refs` 每项必须包含role、run ID、gate、ENV / PROFILE、subject / config refs和context / source revisions / config identity / evidence index digest。任一不一致都不得通过report completeness gate。

---

## 5. Acceptance Draft与Review阶段边界

| 阶段 | `reports/acceptance/*` | `reports/review/*` | 允许结论 | 禁止行为 |
|---|---|---|---|---|
| FormalEntryReady前 | handoff / veto / risk / issues四草稿必须存在并绑定identity | 可不存在,但review责任与访问必须已分配 | 只说scope / missing / current source status | 预填pass、risk accepted、reviewed、signed |
| InReview | 可补充finding / disposition refs,不改raw | reviewer-notes / agent-review独立形成 | Reviewed / Disputed记录只在review层 | 同一generator代替独立review;review回写evidence status |
| Paused | 保留pause cause、invalidated / missing和新packet需求 | 保留已有note并显式标注受影响version | 无新裁决 | 只修文字消除identity / evidence变化 |
| DecisionReady前 | 六文件同一RELEASE /四源digest,内容对账 | human / agent review完成,争议为0或明确进不通过依据 | 只表示packet complete | 把packet complete当最终通过或伪造签署 |

Step 14才定义最终裁决和签署角色。本分件只确保不完整或未审查的supporting packet不会被当作裁决。

---

## 6. 报告生成与成熟度门禁

| 输出集 | Planned writer | 输入真相 | 成熟度 | 不得产生 |
|---|---|---|---|---|
| suite / run / coverage reports | `generate_reports.sh --stage suite/run` | 真实suite / case / check JSON和identity | `script_capability` -> run report | 无raw的status、静态TC覆盖 |
| gate results | `generate_gate_results.sh` | fixed run artifacts / source refs / statuses | run report | 第二路径、改写Failed / Blocked / conditional |
| minimal index shell | `generate_reports.sh --stage evidence --maturity minimal` | real meta + reviewed expected catalog | `minimal_index_shell` | EV alias、Passed missing slot |
| final index / detail | `generate_reports.sh --stage evidence --maturity final` | valid raw / report pairs + controls | `final_evidence` | 空TC / raw / report refs、静态item |
| acceptance draft set | `generate_acceptance_handoff.sh` | fixed RELEASE +有序四源reports / evidence | `acceptance_draft` | pass、risk accepted、reviewed、signed |
| independent review | human reviewer / review agent分别写 | immutable raw / reports / drafts | review record | 改写source、替代final authority |

任一writer失败时必须保留partial output的safe state、missing path、source digest和失败原因ref,不得手写文件补洞或覆盖原run。

---

## 7. 跨证据裁决审计

| Audit | 审计问题 | 设计结论 | Runtime缺口处置 |
|---|---|---|---|
| ECA-SBX-001 | 四source顺序、role / gate / ENV / PROFILE是否exact | PassDesign | 任一不一致使RELEASE Blocked / Failed |
| ECA-SBX-002 | design / subject / core / harness revision是否四源一致 | PassDesign | mismatch使packet invalid |
| ECA-SBX-003 | 是否存在`latest`、project子层、mutable ref或同义report path | PassDesign | path gate Failed |
| ECA-SBX-004 | 九类schema的required / enum / digest / cross-field是否合法 | PassDesign | InfraFailed / Blocked;不分配EV |
| ECA-SBX-005 | Failed / Blocked / InfraFailed / NotRunConditional是否原样传播 | PassDesign | status propagation Failed |
| ECA-SBX-006 | 每个blocking invocation是否有raw / report / digest pair | PassDesign | pairing Failed |
| ECA-SBX-007 | 是否存在orphan raw、orphan report或orphan EV | PassDesign | report audit Failed |
| ECA-SBX-008 | 同一slot / run是否存在duplicate EV,或TC主结果重复计数 | PassDesign | duplicate audit Failed |
| ECA-SBX-009 | EV / acceptance status是否来自静态JSON、Markdown或default pass | PassDesign | no-static Failed |
| ECA-SBX-010 | 254 TC、237 /13 /4和execution role是否一致 | PassDesign | coverage Failed |
| ECA-SBX-011 | 55 protocol是否exact name / family / TC / suite完整 | PassDesign | protocol inventory Failed |
| ECA-SBX-012 | P0 expected 001~019是否无missing,每item有nonempty exact TC / raw / report | PassDesign | evidence index不可Passed |
| ECA-SBX-013 | conditional 020 /021是否只在formal trigger后计expected | PassDesign | inactive保持NotRunConditional;illegal activation Blocked |
| ECA-SBX-014 | redaction是否覆盖raw / run / acceptance / review并无二次泄漏 | PassDesign | redaction Failed;传Step 11 |
| ECA-SBX-015 | dependency graph是否仅有允许core compile edge | PassDesign | architecture redline Failed |
| ECA-SBX-016 | P0Q identity是否完整且先于probe | PassDesign | Blocked + 0 launch或identity Failed |
| ECA-SBX-017 | test resource是否全有cleanup / containment / investigation / teardown处置 | PassDesign | evidence / entry Blocked;传Step 11 |
| ECA-SBX-018 | acceptance四文件是否同一RELEASE /四源并无预填结论 | PassDesign | entry / evidence integrity Blocked |
| ECA-SBX-019 | human / agent review是否独立、identity-bound且不回写raw | PassDesign | DecisionReady Blocked |
| ECA-SBX-020 | review `Disputed`、open issues和veto / risk是否全量对账 | PassDesign | unresolved项不得被隐藏或有条件通过 |
| ECA-SBX-021 | invalidated / superseded evidence是否immutable保留并取消旧效力 | PassDesign | 暂停裁决;新run / packet / review |

设计审计表只定义未来report-audit / reviewer必须查什么。当前没有raw、report或review input,不存在runtime audit Passed。

---

## 8. 当前Readiness与停审结论

| 对象集 | 设计停审 | 当前实例状态 | 不得宣称 |
|---|---|---|---|
| RSTOP-SBX-001~015 machine / run reports | `PassDesign` | 0文件;source / RELEASE absent | 任何gate / suite / EV Passed |
| RSTOP-SBX-016~019 acceptance files | `PassDesign` | 0文件;acceptance NotEntered | handoff complete、veto clear、risk accepted、issues closed |
| RSTOP-SBX-020~021 review files | `PassDesign` | 0文件;review not started | Reviewed、Disputed resolved、DecisionReady |
| VC-SBX-001~009 | `PassDesign` | scripts / checks not implemented or not run | validation clean / passed |
| ECA-SBX-001~021 | `PassDesign` | runtime audit not run | no orphan / no static / packet complete的事实结论 |

---

## 9. 分件自检

| 检查项 | 结论 |
|---|---|
| RSTOP-SBX-001~021是否连续唯一 | 通过;21 /21。 |
| VC-SBX-001~009是否九项全覆盖 | 通过;9 /9。 |
| ECA-SBX-001~021是否连续唯一 | 通过;21 /21。 |
| 唯一gate report是否`gate-results.md` | 通过;旧名只位于historical /回写登记,无第二active path。 |
| run report是否逐文件有source / minimum / review /失败影响 | 通过 |
| handoff / veto / risk / issues / reviewer / agent六文件是否完整 | 通过 |
| acceptance draft与independent review阶段是否分离 | 通过 |
| validation control是否被伪造为EV | 否 |
| 是否写入真实run / report / review /接受 /签署 | 否 |
