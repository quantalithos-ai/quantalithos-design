# Step 13. 定义测试报告与证据归档

> 对应SOP: `standards/document/测试方案讨论流程_SOP.md` Step 13
> 书写规范: `standards/document/测试方案书写规范.md` §5.13
> Schema分件: `05_test_plan_step_13_evidence_schemas.md`
> 回填章节: `05-测试方案.md` §13 测试报告与证据归档
> 生成日期: 2026-07-13
> 状态: reviewed_passed_to_step_14_with_downstream_gate_path_writeback
> 所属流程: `05_test_plan_calibration_flow.md`
> 本Step口径: 定义planned evidence slot、机器artifact schema、报告生成、归档、保留、审查和验收追溯。当前不创建目录 /文件实例、真实`run_id`、`EV-SBX-*` alias、测试结果、风险接受或签署。

---

## 1. Step开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 12并允许进入Step 13 | 是。用户确认Step 12后回复“同意”,中断后再次回复“继续”;本次只放行Step 13。 |
| 台账与flow是否允许进入 | 是。Step 12原为`pass_wait_review`;本次确认后转为`passed_to_step_13`。 |
| 是否读取Step 13标准 | 是。已读取测试SOP Step 13、书写规范§5.13和真相源标准§7.3~§7.5。 |
| 是否读取全部输入 | 是。复核Step 5 PER / AC / VF、Step 9 suite / path / scripts、Step 10专项、Step 11证据失效、Step 12退出及EHR-01~20。 |
| 是否参考L1粒度 | 是。参考L1-governance / L1-artifact目录、报告和审查结构,不继承其EV alias或status词表。 |
| 当前状态 | 21个planned evidence slot、九类JSON schema、目录、报告、保留、失败归档、人 / Agent审查和追溯审计已收稳;用户已确认并传递至Step 14。 |
| 上游blocker | 发现Step 9路径与当前标准冲突,已登记`SBX-TEST-EVIDENCE-PATH-001`并回写为`report.json` / stdout / stderr,当前无unresolved上游冲突。 |
| 停审 | 用户已确认Step 13;只放行Step 14,不得进入Step 15或修改正式`05-测试方案.md`。 |

## 2. 目标、边界与证据成熟度

本Step完成:

1. 为PER-SBX-001~038、EHR-01~20、250条P0与4条conditional定义真实producer到验收引用的归档链。
2. 以planned `ESLOT-SBX-*`代替静态EV,真实执行时才从raw / report pair派生`EV-SBX-<FAMILY>-<NNN>`。
3. 固定artifact / report / acceptance / review目录,禁止`latest`和project子层。
4. 固定机器JSON字段、枚举、版本、digest、writer / reader、失败保留与redaction;详见Schema分件。
5. 区分script capability、minimal index shell、final evidence detail和acceptance draft成熟度。

本Step不运行suite / script,不创建slot catalog文件、evidence index实例、EV详情页、acceptance初稿或审查记录。新版`06`才分配验收裁决和签署责任。

| 成熟度 | 允许输出 | 禁止输出 |
|---|---|---|
| `script_capability` | 参数 / path / schema / redaction检查与失败摘要 | evidence item、EV detail、acceptance结论 |
| `minimal_index_shell` | 从真实run渲染run / suite / path / missing slot骨架 | 静态补齐EV、把missing写Passed |
| `final_evidence` | 从真实case + suite report生成完整index和detail pages | 无raw / report时分配alias |
| `acceptance_draft` | 固定release run的handoff / veto / risk / issues初稿 | 验收pass、risk acceptance或签署 |

## 3. 证据Identity与生成链

```text
PER / EHR planned requirement
  -> reviewed ESLOT expected catalog
  -> real suite case JSON + report.json + check artifacts
  -> report generator verifies run / digest / redaction / pairing
  -> runtime evidence_id + evidence item + detail page
  -> fixed-run evidence index
  -> acceptance draft + human / Agent review
  ->新版06验收裁决
```

规则:

- `ESLOT-SBX-*`只是设计slot,不是证据ID、alias或通过事实。
- `EV-SBX-<FAMILY>-<NNN>`只是runtime pattern;只有真实artifact / report pair存在且schema / digest / check通过时才可分配。
- 每个expected slot在一个run内最多生成一个evidence item;满足生成条件时`NNN`取slot的三位后缀,缺失slot不预留或静态生成alias。
- 正式引用必须使用`(run_id,evidence_id,artifact_digest)`;其中`artifact_digest`是Evidence Item对象自身digest,单独alias、root index digest或`latest`不能定位证据实例。
- 每个run必须在`meta/context.json`记录Step 14定义的`run_intent`,`run_scope`,`trigger_refs`,`change_refs`;报告与evidence不得从path或suite列表反推回归原因。
- slot表中的TC range只为文档可读性;JSON `tc_refs`必须展开为逐个正式`TC-SBX-*`,不得保存range / wildcard /自然语言。
- pairing / no-static / coverage等meta-check是validation control,不自动分配EV。未来若要成为EV,必须先新增正式report-audit TC并重开Step 5 /6 /9 /13。

## 4. Planned Evidence Slot归档表

`runtime family`只定义alias pattern中的family token,不创建alias实例。

| Slot | runtime family | PER | 主要TC归档范围 | Producer suite | AC / VF主引用 |
|---|---|---|---|---|---|
| ESLOT-SBX-001 | CONTRACT | 001/002 | CTR-001~006 | 001 | AC-031/034/035/040;VF-005/009 |
| ESLOT-SBX-002 | INTAKE | 003/014 | CMD-001/002;STA-001~003;ERR-014/015 | 002/004/010 | AC-001/006~008/026/032~040适用;VF-002/005/009/010 |
| ESLOT-SBX-003 | BOUNDARY | 004/015 | CMD-003/004;STA-004~009;ERR-006/007 | 002/004/010 | AC-002/009~011/027/032/036/038;VF-001~003 |
| ESLOT-SBX-004 | POLICY | 005/016 | CMD-005/006/008;STA-010~012;ERR-005 | 002/004/010 | AC-003/012~015/028/037/038/040;VF-004/009 |
| ESLOT-SBX-005 | EXECUTION | 006/017 | CMD-007~012;STA-013~015;CNS-013~016;EVT-004~006 | 002/004/005 | AC-004/016~019/029/035/039/041;VF-006/010 |
| ESLOT-SBX-006 | SAFETY | 007/018 | CMD-013~020;STA-016~019;JOB-005~007;ERR-010/011 | 002/004/006/010/012 | AC-005/020~023/030/037~041;VF-007/008/010 |
| ESLOT-SBX-007 | READ | 008/019 | QRY-017~024;JOB-008~010;STA-020~023 | 002/004/006/012 | AC-018/020~023/030/037/041;VF-006/009 |
| ESLOT-SBX-008 | PROTOCOL | 009~013/031 | CMD/QRY/CNS/EVT/JOB全部正式TC | 004~006/011 | AC-006~023/031适用;VF-009/010 |
| ESLOT-SBX-009 | RELAY | 020 | STA-024;CNS-021/022;EVT-015;JOB-001;RACE-014 | 002/005/006/009 | AC-018/019/022/039~041;VF-009/010 |
| ESLOT-SBX-010 | REPLAY | 021/024 | STA-025~030;TXN-007~012;CNS-003/004;JOB-011 | 002/005~007 | AC-006/008/015/019/020/037/040;VF-003/004/009 |
| ESLOT-SBX-011 | CONSISTENCY | 022/023/025 | TXN-001~006/013/014;RACE-001~019;CTR-004/005 | 001/007~009 | AC-007/009/013/023/032/039/040;VF-008/009/010 |
| ESLOT-SBX-012 | ERROR | 026 | ERR-001~038 | 010 | AC-020/037~041;VF-003/004/008/010 |
| ESLOT-SBX-013 | CONFIG | 027/028 | CFG-001~023/029/030;STA-029/030 | 002/003/008 | AC-010/011/023/031/037/038;VF适用 |
| ESLOT-SBX-014 | CHANGE | 030 | CFG-024~028;COND-004 | 003/012/014 | AC-036/040;VF-009 |
| ESLOT-SBX-015 | AUDIT | 029/032 | CTR-006;CFG-009/012/013/015/030;EVT-001~013 | 001/003/005/013适用 | AC-018/035/038/039/041;VF-005~007/010 |
| ESLOT-SBX-016 | ARCH | 033 | ARCH-001~003;CFG-007/029 | 003/016 | AC-031/034/038;VF-002/005/009 |
| ESLOT-SBX-017 | QUAL-BOUNDARY | 034 | CONF-001~006 | 013 | AC-002/009~011/027/038;VF-001~004 |
| ESLOT-SBX-018 | QUAL-LIFECYCLE | 035 | CONF-007~010/013;JOB-005~007 | 006/013 | AC-004/005/016~023/029/030/038~041;VF-007/008/010 |
| ESLOT-SBX-019 | QUAL-IDENTITY | 036 | CONF-001/006/011~013;ARCH-001 | 003/013 | AC-002~005/008~023/027~030/034/035/038~041;VF-001~005/009/010 |
| ESLOT-SBX-020 | REAL-LIKE | 037 | COND-001/002/005;CFG-025~028 | 003/015 | AC-024/036;conditional P1 |
| ESLOT-SBX-021 | SCOPE | 038 | COND-003/005;ARCH-002;CFG-007/010/029 | 003/015/016 | AC-024/025/036;conditional P2 / reopen |

表内紧凑引用只用于文档可读性:`PER 001/002`按`PER-SBX-001` / `PER-SBX-002`展开,`AC-031`按`AC-SBX-031`展开,`VF-005`按`VF-SBX-005`展开,`suite 001`按`SUITE-SBX-001`展开,TC范围按`TC-SBX-<FAMILY>-<NNN>`逐项展开。任何机器artifact / evidence item必须保存完整正式ID数组,不得保存本表的省略前缀、range或斜线写法。

Step 5已固定`PER-SBX-NNN`与`CUT-SBX-NNN`同号一一对应,因此本表PER列同时构成CUT到slot映射;runtime item的`cut_refs`必须逐项保存对应完整CUT ID。每行保存位置统一由producer展开为`artifacts/test/<run_id>/suites/<suite_id>/...`、`reports/runs/<run_id>/suites/<suite_id>.md`和`reports/runs/<run_id>/evidence/<evidence_id>.md`,不得把占位符或planned slot写成目录实例。

P0 expected slots为001~019,对应PER-001~036;slot 020 /021保持conditional。一个case artifact可被多个slot引用,但同一`evidence_id`只能属于一个slot,且不得重复计TC主归属。

## 5. EHR-01~20到Slot承接

| EHR | Slot / producer | 最小归档要求 |
|---|---|---|
| EHR-01/02/03 | 013 / SUITE-003 | strict parse、I001~I101 index、source no-fallback raw / report |
| EHR-04 | 013 +017~019 | PROFILE-01~07 maturity与P05 fixed identity |
| EHR-05/06 | 013 | NCFG、FC、XVAL、complete generation |
| EHR-07 | 015 | all-carrier redaction,无真实material正文 |
| EHR-08 | 015 +018/019 | material lifecycle与适用provider qualification |
| EHR-09/10 | 013 +011 | generation atomicity、scoped / fixture isolation |
| EHR-11/12/13 | 014 +020 | review / TOCTOU、rollback、drift;physical部分conditional |
| EHR-14 | 004/012/017~019 | fail-closed dependency与0 weak fallback |
| EHR-15 | 007/015 | degraded no-write / no-repair与formal audit保持 |
| EHR-16 | 005/006/009/010 | no-truth-rewrite recovery与owning marker |
| EHR-17 | 015 | safe log / metric / audit / report和低基数标签 |
| EHR-18 | 016 | dependency graph / build raw与report |
| EHR-19 | 016/021 | unsupported surface absence / design reopen |
| EHR-20 | 017~020适用 | profile activation packet固定identity;P06仍conditional |

EHR仍是planned requirement,不改名为EV。真实slot item只消费其适用PER / EHR追溯,不会声明配置验收已通过。

## 6. 目录结构

### 6.1 Machine Artifact

```text
artifacts/test/<run_id>/
  meta/context.json
  meta/source-commits.json
  meta/config-digest.json
  checks/<check_id>.json
  evidence-index.json
  suites/<suite_id>/report.json
  suites/<suite_id>/stdout.log
  suites/<suite_id>/stderr.log
  suites/<suite_id>/cases/<tc_id>/<parameter_id>.json
  suites/<suite_id>/artifacts/<safe_name>.json
  suites/SUITE-SBX-013/qualification-result.json
```

根目录不得增加project层或`latest`;文件schema见分件A。每次suite invocation无论Passed / Failed / Blocked / NotRunConditional / InfraFailed均必须生成`report.json`、redacted `stdout.log`和`stderr.log`;无输出时写零字节文件并记录其digest,缺失本身由pairing check阻断。

### 6.2 Human-readable Reports

```text
reports/
  README.md
  runs/<run_id>/
    summary.md
    gate-results.md
    evidence-index.md
    tc-coverage.md
    protocol-inventory.md
    per-coverage.md
    redaction-check.md
    dependency-boundary.md
    report-audit.md
    suites/<suite_id>.md
    evidence/<evidence_id>.md
  acceptance/
    handoff.md
    veto-checklist.md
    risk-acceptance.md
    open-issues.md
  review/
    reviewer-notes.md
    agent-review.md
```

Acceptance / review使用标准规定的固定平铺入口。六个文件都必须在正文内记录同一fixed release run、来源run / digest和各自review version;不得依赖目录名承载identity。review notes可引用证据,不能替代raw、改变status或伪造签署。

## 7. 报告生成与成熟度映射

| 输出 | Source | Planned writer | 审查要求 |
|---|---|---|---|
| suite report | suite `report.json` + case JSON | `generate_reports.sh --stage suite` | status / tc / failure / cleanup与raw一致 |
| run summary / coverage | all suite + check JSON | `generate_reports.sh --stage run` | 237 /13 /4、55协议、PER与Blocked传播准确 |
| gate results | fixed run / source-run refs | `generate_gate_results.sh` | RELEASE按MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q固定顺序,不混revision / role / profile,不使用latest |
| minimal index shell | meta + expected slot catalog | `generate_reports.sh --stage evidence --maturity minimal` | 只显示missing / path,不分配EV |
| final index + detail | valid raw / report pairs + checks | `generate_reports.sh --stage evidence --maturity final` | 逐TC refs、digest、AC / VF / VETO完整 |
| redaction / dependency / report audit | raw + reports / manifests | Step 9对应check scripts | failure safe且不回显forbidden内容 |
| acceptance draft set | fixed RELEASE +按序MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q四源reports | `generate_acceptance_handoff.sh` | 人 / Agent补充边界 /争议;每份绑定四源identity / digest,不写pass /签署 |

`reports/`只存输出,不得存generator。所有脚本仍`planned_not_implemented`;本表不增加真实脚本或执行事实。

## 8. 失败、保留与删除Guard

| 情形 | 必须保留 | 删除 /覆盖禁止 |
|---|---|---|
| assertion Failed | report、case、redacted logs、safe failure ref | 重跑覆盖原run或改写Passed |
| InfraFailed / Blocked | meta、已生成raw、missing / precondition refs | 归一Skipped或静态补EV |
| redaction命中 | safe check artifact、受限原始材料处置ref | 在report回显marker / secret / body |
| P0-Q failure / redline | qualification、probe、product disposition、lab teardown ref | force-clean被测truth或删除调查材料 |
| report generation失败 | partial check、missing path、source digests | 手写index / detail补洞 |
| evidence后来失效 | 原artifact immutable、invalidation / supersede ref | 删除旧证据或沿用旧Passed |

| Retention class | 最低保留条件 |
|---|---|
| Diagnostic | run结束且无open defect / security hold后可清理;不得成为送验证据 |
| P0Run | 至少保留到验收裁决完成且相关S / A复验关闭 |
| Qualification | 至少保留到P0Q裁决、全部resource disposition和安全调查关闭 |
| FailureInvestigation | 保留到缺陷 / redline / integrity调查关闭且superseding evidence可用 |
| Acceptance | 保留到验收、风险接受有效期和后续审计窗口均结束 |

当前无正式数值retention来源,不得发明天数。`07/09`后续必须选择物理策略,但任何TTL都不能越过上述condition-based guard;artifact retention与sandbox resource cleanup是两个owner。

## 9. 人 / Agent审查补充

| 材料 | 人 / Agent必须复核 | 不可替代 |
|---|---|---|
| handoff | fixed run identities、P0-C / P0-Q边界、未覆盖项 | gate raw /新版06裁决 |
| veto checklist | VF-001~010和VETO-CFG适用项逐项有真实item / check | 自动填“全部通过” |
| risk acceptance | 只含Step 11允许的B级 / conditional,含owner /期限 /触发 | S / A关闭或签署 |
| open issues | Failed / Blocked / InfraFailed、missing slot、证据失效无遗漏 | defect ledger |
| reviewer notes | 争议、抽查路径、review identity /时间 | raw artifact |
| agent review | orphan / duplicate / digest / redaction / path / trace机械复核 | 人工风险接受或验收签署 |

Review只能把`review_status`从Pending改为Reviewed / Disputed的独立审查记录,不得编辑raw evidence index或把Failed / Blocked变Passed。

## 10. 真实性、追溯与当前事实审计

| 审计项 | 设计结论 | 当前事实 |
|---|---|---|
| 250条P0是否有归档方式 | case JSON逐TC + slots 001~019 + exact index expansion | designed;无实例 |
| 4条conditional是否隔离 | slots 020 /021,NotRunConditional不补偿P0 | designed;无实例 |
| PER-001~038 / EHR-01~20是否有producer去向 | §4 / §5闭合 | planned only |
| AC-001~041 / VF-001~010是否可被引用 | slot + exact runtime arrays | designed;无验收结论 |
| meta-check是否静态造EV | 不分配EV;需要正式TC才可升级 | none created |
| report是否可脱离raw | pairing + digest + no-static check禁止 | scripts未实现 |
| failed / blocked是否保留 | schema与§8固定 | 无run |
| 是否创建真实alias / run /报告 | 否 | 0实例 |

### 10.1 证据归档停审记录

| 证据 /报告 | 审查项 | 设计结论 | 缺口 /修正 |
|---|---|---|---|
| slot catalog / evidence item | P0 TC / CUT / PER、AC / VF、raw / report回链 | pass_for_design | 21个slot均为planned;真实item等待执行。 |
| machine artifact | path、schema、enum、digest、writer / reader、失败保留 | pass_for_design | 九类schema可编码;目标仓和writer仍`planned_not_implemented`。 |
| run / gate reports | 固定run来源、生成脚本、Blocked传播、无latest | pass_for_design | 当前无run或报告实例。 |
| acceptance / review | 固定release run、handoff / veto / risk / issues、独立审查 | pass_for_design | 新版`06`才裁决;当前无签署。 |
| redaction / retention | forbidden body、失败调查、condition-based guard | pass_for_design | 数值期限与物理策略留`07/09`,不得越过关闭条件。 |

证据停审结论:每个P0 TC有case归档和slot去向;21 slot无孤儿PER;目录、schema、writer、report、review、retention和redaction闭合。当前P0-C / P0-Q仍NotEvaluated,ENV-05与目标仓blocker不因证据设计改变。

## 11. 上游影响、回填与进入下一步

| 影响 | 状态 | 处理 |
|---|---|---|
| Step 9 suite result / log路径不符合当前标准 | resolved_by_step_13_writeback | 已改为`report.json`,`stdout.log`,`stderr.log`并登记blocker。 |
| Step 14发现run context无法记录回归选择依据 | resolved_by_step_14_writeback | schema已增加run intent / scope / trigger / change refs,gate writer输入同步回写Step 9。 |
| Step 8验收回查发现slot producer suite未覆盖行内全部TC主归属 | resolved_by_acceptance_step_8_writeback | `ESLOT-SBX-002/009/011/013/018/019/020/021`已补齐ERR / STA / CTR / JOB / ARCH / CFG的正式owner suite;未改TC、slot、suite主归属或成熟度。 |
| Step 10验收回查发现gate report名与当前固定路径冲突 | resolved_by_acceptance_step_10_writeback | `gate-summary.md`及`generate_gate_summary.sh`已受控更名为`gate-results.md`及`generate_gate_results.sh`;未改gate、source run、schema、status或结果事实。 |
| 正式TC中无report-audit TC | contained_by_validation_control_boundary | meta-check不分配EV;若验收要求formal EV则先重开Step 5 /6。 |
| 目标仓 / scripts / environment不存在 | open_for_07_precheck | 不阻塞Step 13设计,阻塞所有真实artifact / report。 |
| ENV-05未形成 | open_for_p0q_execution | slots 017~019不得实例化为Passed。 |
| retention无数值来源 | open_for_07_09_physical_policy | 当前使用condition guard,不发明时长。 |

正式`05-测试方案.md` §13后续应装配§3~§10,并引用Schema分件的完整字段契约。不得把`ESLOT`改写为现有EV,不得创建静态evidence index或预填review / acceptance。

| 进入下一步条件 | 状态 | 说明 |
|---|---|---|
| P0用例均有证据归档方式 | 通过 | 250条P0由case JSON + slots 001~019承接。 |
| JSON schema可直接编码 | 通过 | 字段 / enum / version / digest / owner见分件A。 |
| raw / report / acceptance路径一致 | 通过 | 固定run且无project / latest。 |
| failed / blocked / conditional不丢失 | 通过 | status闭集与保留规则明确。 |
| 不静态造EV | 通过 | runtime raw / report pair后才分配alias。 |
| 跨证据真实性 /追溯无unresolved冲突 | 通过 | path冲突已回写,meta-check边界已contain。 |
| 是否存在阻塞Step 14设计的上游blocker | 否 | 执行blocker继续保留,不阻塞回归 /残余风险设计。 |

新增`SBX-TEST-EVIDENCE-001`已解析为`resolved_for_test_step_13`;路径冲突`SBX-TEST-EVIDENCE-PATH-001`已回写关闭。Step 14发现的regression metadata缺口已按`SBX-TEST-REGRESSION-META-001`回写schema,不改变九类artifact数量。验收Step 10又按`SBX-ACC-EVIDENCE-GATE-PATH-001`将gate report固定路径收敛为当前标准的`gate-results.md`,不改变任何测试语义。当前仍为已审查的`05`上游基线。
