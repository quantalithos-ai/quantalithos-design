# Step 10 分件 A. Planned Evidence Slot 追溯与停审登记

> 父Step: `06_acceptance_step_10_observability_evidence.md`
> 上游真相源: `05_test_plan_step_13_evidence.md`;`05_test_plan_step_13_evidence_schemas.md`
> 生成日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_11
> 事实边界: 本文登记21个planned slot和future runtime生成条件,不创建`run_id`、EV alias、artifact、report、review或验收结论。

---

## 1. 登记语义与唯一真相源

`ESLOT-SBX-001~021`是已审查的planned evidence requirement,不是runtime evidence ID。本分件只做验收消费层的逐slot校验,不改写测试Step 13中的family、PER / CUT、TC、producer suite、AC / VF或maturity。

runtime writer只有在当次run的真实raw / report pair、schema、digest、redaction、pairing和其他适用validation control都合法时,才可使用`EV-SBX-<FAMILY>-<slot suffix>`生成一个evidence item。本文中的family和suffix是pattern输入,不表示alias已存在。

| 术语 | 本分件中的exact展开 |
|---|---|
| `RAW(run,suite)` | `artifacts/test/<run_id>/suites/<suite_id>/report.json`、`stdout.log`、`stderr.log`、适用`cases/<tc_id>/<parameter_id>.json`与`artifacts/<safe_name>.json` |
| `SREP(run,suite)` | `reports/runs/<run_id>/suites/<suite_id>.md` |
| `RIDX(run)` | `artifacts/test/<run_id>/evidence-index.json`与`reports/runs/<run_id>/evidence-index.md` |
| `EDETAIL(run,item)` | `reports/runs/<run_id>/evidence/<evidence_id>.md`;`evidence_id`只在runtime生成 |
| `CHECK(run,kind)` | `artifacts/test/<run_id>/checks/<check_id>.json`和对应fixed report / `report-audit.md`部分 |
| `AC / VF` | 表中的紧凑编号必须展开为完整`AC-SBX-*` / `VF-SBX-*`;runtime不允许保存range |

一个slot可引用多个source run中的证据,但每个source item仍必须保留自己的`run_id`、role、ENV / PROFILE和digest。不得把MAIN-CONTRACT、MAIN-SEAM、OPS或P0Q的raw复制到聚合器目录后伪装成同一run。

---

## 2. 逐slot停审准则

`ESTOP-SBX-001~021`是设计停审索引,不是runtime review record或evidence ID。每个slot必须同时通过以下检查:

1. family、suffix、PER / CUT、TC、producer suite与测试Step 13一致。
2. 每个TC family都有一个已列producer suite,无无owner raw入口。
3. 必需source role与fixed role矩阵一致,无低profile / simulation / historical substitution。
4. `RAW`、`SREP`、`RIDX`、`EDETAIL`和适用`CHECK`回链可直接机械构造。
5. runtime item必须展开exact TC / parameter / assertion / PER / CUT / AC / VF,无range / wildcard / representative替代。
6. 缺失、Failed、Blocked、InfraFailed和NotRunConditional的传播不互相吞并。
7. 设计停审只能记`PassDesign; runtime instance absent`,不能记evidence Passed。

---

## 3. P0-C 和共享P0 slot追溯: 001~016

| Stop / Slot | Family / suffix | PER / CUT;TC范围 | Producer suite | 最低source责任 | Runtime raw / report闭环 | AC / VF消费 | 缺失 /失败影响 |
|---|---|---|---|---|---|---|---|
| ESTOP-SBX-001 / ESLOT-SBX-001 | CONTRACT /001 | PER / CUT 001,002;CTR-001~006 | SUITE-001 | MAIN-CONTRACT | RAW+SREP(SUITE-001);RIDX;EDETAIL;pairing / redaction | AC-031/034/035/040;VF-005/009 | missing使contract / typed ref / digest不可裁决;assertion Failed使对应AC Failed |
| ESTOP-SBX-002 / ESLOT-SBX-002 | INTAKE /002 | 003,014;CMD-001/002,STA-001~003,ERR-014/015 | SUITE-002/004/010 | MAIN-CONTRACT;MAIN-SEAM错误接缝适用 | 全producer RAW+SREP;RIDX;EDETAIL;coverage / pairing / redaction | AC-001/006~008/026/032~040适用;VF-002/005/009/010 | missing使intake identity / rejection无法裁决;unsafe / weak fallback传Step 11 |
| ESTOP-SBX-003 / ESLOT-SBX-003 | BOUNDARY /003 | 004,015;CMD-003/004,STA-004~009,ERR-006/007 | SUITE-002/004/010 | MAIN-CONTRACT;MAIN-SEAM补强 | 全producer RAW+SREP;RIDX;EDETAIL;pairing / redaction | AC-002/009~011/027/032/036/038;VF-001~003 | missing使coherent boundary不可裁决;partial / host / 弱fallback失败传Step 11 |
| ESTOP-SBX-004 / ESLOT-SBX-004 | POLICY /004 | 005,016;CMD-005/006/008,STA-010~012,ERR-005 | SUITE-002/004/010 | MAIN-CONTRACT;MAIN-SEAM补强 | 全producer RAW+SREP;RIDX;EDETAIL;pairing / redaction | AC-003/012~015/028/037/038/040;VF-004/009 | missing使policy fail-closed不可裁决;weak fallback / bypass失败传Step 11 |
| ESTOP-SBX-005 / ESLOT-SBX-005 | EXECUTION /005 | 006,017;CMD-007~012,STA-013~015,CNS-013~016,EVT-004~006 | SUITE-002/004/005 | MAIN-CONTRACT;MAIN-SEAM接缝适用 | 全producer RAW+SREP;RIDX;EDETAIL;pairing / redaction / blocked | AC-004/016~019/029/035/039/041;VF-006/010 | missing使run / capture / handoff主链不可裁决;truth rewrite / body leak失败 |
| ESTOP-SBX-006 / ESLOT-SBX-006 | SAFETY /006 | 007,018;CMD-013~020,STA-016~019,JOB-005~007,ERR-010/011 | SUITE-002/004/006/010/012 | MAIN-CONTRACT + OPS;P0Q真实部分由018承接 | 全producer RAW+SREP;RIDX;EDETAIL;cleanup / pairing / redaction | AC-005/020~023/030/037~041;VF-007/008/010 | missing使control / cleanup / redline不可裁决;guard bypass / orphan传Step 11 |
| ESTOP-SBX-007 / ESLOT-SBX-007 | READ /007 | 008,019;QRY-017~024,JOB-008~010,STA-020~023 | SUITE-002/004/006/012 | MAIN-CONTRACT + OPS | 全producer RAW+SREP;RIDX;EDETAIL;pairing / no-static | AC-018/020~023/030/037/041;VF-006/009 | missing使query / reconciliation不可裁决;query write / repair为Failed |
| ESTOP-SBX-008 / ESLOT-SBX-008 | PROTOCOL /008 | 009~013,031;CMD / QRY / CNS / EVT / JOB全部formal TC | SUITE-004~006/011 | MAIN-CONTRACT + MAIN-SEAM + OPS适用 | 全producer RAW+SREP;RIDX;EDETAIL;protocol / coverage / pairing | AC-006~023/031适用;VF-009/010 | protocol非55 /55、旧名、缺family或orphan TC则失败 |
| ESTOP-SBX-009 / ESLOT-SBX-009 | RELAY /009 | 020;STA-024,CNS-021/022,EVT-015,JOB-001,RACE-014 | SUITE-002/005/006/009 | MAIN-CONTRACT + MAIN-SEAM + OPS | 全producer RAW+SREP;RIDX;EDETAIL;pairing / blocked | AC-018/019/022/039~041;VF-009/010 | missing使relay no-rollback不可裁决;owner truth rollback / duplicate publish为Failed |
| ESTOP-SBX-010 / ESLOT-SBX-010 | REPLAY /010 | 021,024;STA-025~030,TXN-007~012,CNS-003/004,JOB-011 | SUITE-002/005~007 | MAIN-CONTRACT + OPS | 全producer RAW+SREP;RIDX;EDETAIL;pairing / blocked | AC-006/008/015/019/020/037/040;VF-003/004/009 | missing使duplicate / replay不可裁决;new side effect / missing stored replay为Failed |
| ESTOP-SBX-011 / ESLOT-SBX-011 | CONSISTENCY /011 | 022,023,025;TXN-001~006/013/014,RACE-001~019,CTR-004/005 | SUITE-001/007~009 | MAIN-CONTRACT + OPS竞态补强 | 全producer RAW+SREP;RIDX;EDETAIL;coverage / pairing | AC-007/009/013/023/032/039/040;VF-008/009/010 | missing使UoW / winner不可裁决;half-state / double winner / recompute为Failed |
| ESTOP-SBX-012 / ESLOT-SBX-012 | ERROR /012 | 026;ERR-001~038 | SUITE-010 | MAIN-CONTRACT;MAIN-SEAM / OPS中的实际error rows必须保留source identity | RAW+SREP(SUITE-010);RIDX;EDETAIL;pairing / redaction / blocked | AC-020/037~041;VF-003/004/008/010 | missing使closed error / recovery不可裁决;generic fallback / unsafe diagnostic为Failed |
| ESTOP-SBX-013 / ESLOT-SBX-013 | CONFIG /013 | 027,028;CFG-001~023/029/030,STA-029/030 | SUITE-002/003/008 | MAIN-CONTRACT | 全producer RAW+SREP;RIDX;EDETAIL;redaction / pairing / blocked | AC-010/011/023/031/037/038;VF适用 | missing使strict source / generation不可裁决;fallback / partial generation / material leak为Failed |
| ESTOP-SBX-014 / ESLOT-SBX-014 | CHANGE /014 | 030;CFG-024~028,COND-004 | SUITE-003/012/014 | MAIN-CONTRACT + OPS;COND-004只在conditional trigger后计入 | 全producer RAW+SREP;RIDX;EDETAIL;pairing / no-static | AC-036/040;VF-009 | P0 change部分missing则不可裁决;inactive COND-004保持NotRunConditional |
| ESTOP-SBX-015 / ESLOT-SBX-015 | AUDIT /015 | 029,032;CTR-006,CFG-009/012/013/015/030,EVT-001~013 | SUITE-001/003/005/013适用 | MAIN-CONTRACT;MAIN-SEAM / OPS / P0Q适用source audit不得被MAIN替代 | 全适用producer RAW+SREP;RIDX;EDETAIL;redaction / pairing / no-static | AC-018/035/038/039/041;VF-005~007/010 | missing使formal audit / safe observability不可裁决;log替代audit / leak为Failed |
| ESTOP-SBX-016 / ESLOT-SBX-016 | ARCH /016 | 033;ARCH-001~003,CFG-007/029 | SUITE-003/016 | MAIN-CONTRACT static / build evidence | 全producer RAW+SREP;RIDX;EDETAIL;dependency / coverage / pairing | AC-031/034/038;VF-002/005/009 | dependency graph / absence proof missing则不可裁决;non-core sibling dep为Failed |

上表16个slot均为P0 expected。当RELEASE的任一slot没有valid runtime item时,必须出现在`missing_slot_refs`;不得通过从其他slot、P1 / P2、diagnostic run或acceptance text复制refs来填平。

---

## 4. P0-Q qualification slot追溯: 017~019

| Stop / Slot | Family / suffix | PER / CUT;TC范围 | Producer suite | Fixed source | Runtime raw / report闭环 | AC / VF消费 | 缺失 /失败影响 |
|---|---|---|---|---|---|---|---|
| ESTOP-SBX-017 / ESLOT-SBX-017 | QUAL-BOUNDARY /017 | 034;CONF-001~006 | SUITE-013 | P0Q only | RAW+SREP(SUITE-013);qualification-result;RIDX;EDETAIL;identity / redaction / cleanup / pairing | AC-002/009~011/027/038;VF-001~004 | candidate identity缺失只能Blocked且0 probe;boundary assertion Failed则P0-Q / RELEASE Failed |
| ESTOP-SBX-018 / ESLOT-SBX-018 | QUAL-LIFECYCLE /018 | 035;CONF-007~010/013,JOB-005~007 | SUITE-006/013 | P0Q only;OPS不能替代 | 全producer RAW+SREP;qualification-result;RIDX;EDETAIL;identity / redaction / cleanup / pairing | AC-004/005/016~023/029/030/038~041;VF-007/008/010 | cleanup / redline / teardown / material lifecycle missing阻断;assertion Failed传safety / VETO |
| ESTOP-SBX-019 / ESLOT-SBX-019 | QUAL-IDENTITY /019 | 036;CONF-001/006/011~013,ARCH-001 | SUITE-003/013 | P0Q only;MAIN config / ARCH证据不能替代packet identity | 全producer RAW+SREP;qualification-result;RIDX;EDETAIL;identity / dependency / redaction / cleanup | AC-002~005/008~023/027~030/034/035/038~041;VF-001~005/009/010 | anti-substitution identity任一缺失只能Blocked;digest mismatch / substitution为Failed |

P0Q三slot当前实例状态仍是absent,P0-Q仍是Blocked / NotEvaluated。本分件不把设计停审记录写成qualification Passed。

---

## 5. Conditional / scope slot追溯: 020~021

| Stop / Slot | Family / suffix | PER / CUT;TC范围 | Producer suite | 激活与source | Runtime raw / report闭环 | AC消费 | 缺失 /失败影响 |
|---|---|---|---|---|---|---|---|
| ESTOP-SBX-020 / ESLOT-SBX-020 | REAL-LIKE /020 | 037;COND-001/002/005,CFG-025~028 | SUITE-003/015 | formal Conditional trigger;SBX-ENV-06 / PROFILE-06;not release source | 全producer RAW+SREP;RIDX;EDETAIL;identity / redaction / pairing / no-static | AC-024/036;conditional P1 | 未激活保持NotRunConditional且不计missing;activation后missing / Failed只影响claim-specific目标,不补P0 |
| ESTOP-SBX-021 / ESLOT-SBX-021 | SCOPE /021 | 038;COND-003/005,ARCH-002,CFG-007/010/029 | SUITE-003/015/016 | formal conditional / scope-reopen trigger;not release source | 全producer RAW+SREP;RIDX;EDETAIL;dependency / coverage / pairing / no-static | AC-024/025/036;conditional P2 / reopen | 未激活不计missing;发现unsupported surface / dependency scope变化时触发DesignReopen,不伪写Passed |

020 /021不进入默认P0 expected set。只有`meta/context.json`的formal trigger / change refs和run intent / scope合法时,它们才进入当次run expected set。

---

## 6. Slot到schema、control与report的共享闭环

| 闭环项 | 001~016 | 017~019 | 020~021 |
|---|---|---|---|
| run context / source / config schema | required | required;qualification cross-field加严 | required;Conditional intent / scope加严 |
| suite / case / safe artifact schema | required按producer | required按producer | required按producer |
| qualification schema | 仅引用P0Q结论时适用,不得代写 | mandatory | 不适用,禁止假造candidate packet |
| evidence root / item schema | required | required | activation后required |
| redaction / pairing / no-static | required | required | activation后required |
| dependency / coverage / protocol | 按slot列中主题适用;但RELEASE总体都必须通过 | dependency / coverage适用;identity必须通过 | dependency / coverage按trigger适用 |
| blocked propagation | required | required | required;NotRunConditional不得改Skipped |
| cleanup disposition | resource / lifecycle slot适用 | mandatory | 建立resource时mandatory |
| human report | suite + detail + index均required | 同左 + qualification报告内容 | activation后同左 |

slot item不能通过只满足本行局部control就获得release效力。RELEASE还必须通过主件`EG-SBX-001~021`和report分件的全局完整性审计。

---

## 7. 逐slot设计停审结论

| 停审集合 | 数量 | 设计结论 | Runtime事实 |
|---|---:|---|---|
| ESTOP-SBX-001~016 | 16 | `PassDesign`;P0-C / shared P0 slot的producer、source、raw / report、AC / VF和缺失传播已闭合 | 0 item;P0-C NotEvaluated |
| ESTOP-SBX-017~019 | 3 | `PassDesign`;P0Q身份、qualification、cleanup与anti-substitution已闭合 | 0 item;P0-Q Blocked / NotEvaluated |
| ESTOP-SBX-020~021 | 2 | `PassDesign`;conditional / reopen activation与不补偿P0边界已闭合 | 0 item;NotRunConditional / inactive |

`PassDesign`只表示追溯契约可被后续实现和执行,不是`SbxArtifactStatus::Passed`。当前21个slot全部没有runtime实例。

---

## 8. 分件自检

| 检查项 | 结论 |
|---|---|
| `ESLOT-SBX-001~021`是否全覆盖 | 通过;21 /21。 |
| `ESTOP-SBX-001~021`是否连续唯一 | 通过;21 /21。 |
| P0 expected 001~019与conditional 020~021是否分离 | 通过 |
| 21个family / suffix是否与测试Step 13一致 | 通过;source diff=0。 |
| producer suite是否覆盖全部行内TC family | 通过;21行producer与Step 13零差异,并保留验收Step 8的owner回写。 |
| 四fixed source是否无交叉替代 | 通过 |
| 每项是否有raw / report / checks / AC / VF /传播 | 通过 |
| 是否生成了具体EV alias或Passed实例 | 否 |
| 是否修改上游slot语义 | 否 |
