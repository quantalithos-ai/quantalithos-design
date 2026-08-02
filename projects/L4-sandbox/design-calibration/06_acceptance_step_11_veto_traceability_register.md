# L4-sandbox 验收Step 11 VETO追溯登记

> 主件: `06_acceptance_step_11_veto.md`
> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 11
> 创建日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_12
> 当前成熟度: design_trace_only;全部runtime evidence / check / report / checklist实例均不存在

---

## 1. 登记目的与强制规则

本分件逐项固定`VETO-SBX-001~017`的正式来源、测试切口、planned evidence、fixed source、raw / check、report path和裁决传播,防止正式§11只保留口号式红线。

强制规则:

1. 表中range只用于设计阅读。未来machine artifact必须展开完整ID数组,不得保存`001~019`、斜线或“适用集合”。
2. `CUT / PER / ESLOT / NFCHK / VC / ECA`都是设计或检查索引,不是runtime evidence ID。
3. runtime evidence实例唯一定位为`(run_id,evidence_id,artifact_digest)`;必须回指exact TC、suite raw、suite report和source identity。
4. 固定gate report只允许`reports/runs/<run_id>/gate-results.md`;不得恢复旧`gate-summary.md`。
5. 每个VETO最终都必须在`reports/acceptance/veto-checklist.md`逐项登记,且不得默认`NotTriggered`或`Passed`。
6. suite / gate `Failed`不自动等于VETO命中。只有有效finding满足本VETO trigger predicate才记`Triggered`;运行前置或证据不足记`Blocked`。

---

## 2. 路径与来源别名

| 别名 | 固定含义 |
|---|---|
| `CTX` | `artifacts/test/<run_id>/meta/context.json` + `source-commits.json` + `config-digest.json` |
| `RAW(<suite>)` | `artifacts/test/<source_run_id>/suites/<suite_id>/report.json`及同suite cases / logs / safe artifacts |
| `CHECK(<kind>)` | `artifacts/test/<run_id>/checks/<check_id>.json`;必须带input path / digest、status和safe findings |
| `QRESULT` | `artifacts/test/<p0q_run_id>/suites/SUITE-SBX-013/qualification-result.json` |
| `SREP(<suite>)` | `reports/runs/<source_run_id>/suites/<suite_id>.md` |
| `GATE` | `reports/runs/<run_id>/gate-results.md` |
| `RIDX` | `reports/runs/<release_run_id>/evidence-index.md`及machine `artifacts/test/<release_run_id>/evidence-index.json` |
| `EDETAIL` | `reports/runs/<source_run_id>/evidence/<evidence_id>.md` |
| `REDACT` | `reports/runs/<run_id>/redaction-check.md` |
| `DEP` | `reports/runs/<run_id>/dependency-boundary.md` |
| `RAUDIT` | `reports/runs/<run_id>/report-audit.md` |
| `VCL` | `reports/acceptance/veto-checklist.md` |
| `REV` | `reports/review/reviewer-notes.md` + `reports/review/agent-review.md` |

Fixed RELEASE只聚合,不在聚合器环境重跑产品断言。证明来源顺序固定为`MAIN-CONTRACT -> MAIN-SEAM -> OPS -> P0Q`;每个VETO只消费其适用source,但VCL必须对四source的适用 /不适用和缺失原因逐项诚实记录。

---

## 3. 正式来源追溯矩阵

| VETO | 需求VF | 配置VETO来源 | RL来源 | canonical AC / NFR检查 | primary语义 |
|---|---|---|---|---|---|
| `VETO-SBX-001` | VF-001 /009 | VETO-CFG-01辅助 | RL-001 /016 | AC-001~023适用;AC-037~041;NFCHK-001 /025 | 核心闭环和P0双轴不可被删减 /替代 |
| `VETO-SBX-002` | VF-002 | VETO-CFG-01 | RL-001 /007 /016 | AC-026 /027 /038;NFCHK-013 | 非受控carrier不得冒充formal success |
| `VETO-SBX-003` | VF-003 | VETO-CFG-02 | RL-006 /014 | AC-027 /036~038;NFCHK-008 /014 | 四维coherent boundary不可partial |
| `VETO-SBX-004` | VF-004 | VETO-CFG-03 | RL-008 /014 | AC-028 /037 /038 /040 /041;NFCHK-009 /015 /020 /031 | policy / authorization必须fail-closed |
| `VETO-SBX-005` | VF-005 /009 | VETO-CFG-04 /16 | RL-001~004 /007 /008 /013 | AC-026 /028 /031~035 /038 /040;NFCHK-020 /025 | truth ownership与领域编排边界 |
| `VETO-SBX-006` | VF-005 /010 | VETO-CFG-05 | RL-005 /015 | AC-029 /032 /035 /038 /041;NFCHK-016 /036 | raw / sensitive / body零泄漏 |
| `VETO-SBX-007` | VF-003 /004 /009 | VETO-CFG-06 | RL-014 | AC-010 /011 /023 /031 /037 /038 /041;NFCHK-034 | generation必须完整同代原子发布 |
| `VETO-SBX-008` | VF-003 /004 /009 | VETO-CFG-14 /15 | RL-014 /016 | AC-024 /025 /036~038;NFCHK-034;ECA-013 | unsupported / compatibility不得安全削弱 |
| `VETO-SBX-009` | VF-006 | VETO-CFG-13 | RL-009 | AC-016~019 /029 /035 /038~041;NFCHK-010 /017 /021 /032 | material / receipt不得升格下游truth |
| `VETO-SBX-010` | VF-010 | VETO-CFG-07 | RL-001 /005 /010 | AC-039 /041;NFCHK-019~024 /036 | formal audit与关键追溯不可断裂 |
| `VETO-SBX-011` | VF-009 /010 | VETO-CFG-08 | RL-009 /010 | AC-018 /019 /022 /029 /039~041;NFCHK-010 /021 /023 /030 /032 | relay / handoff failure不得回滚或重建source payload |
| `VETO-SBX-012` | VF-009 | VETO-CFG-11 | RL-001 /007 /011 | AC-031 /034 /040 /041;NFCHK-002 /003 /011 /025 /030 /035 | read /外围面不得成为第二writer /语义 |
| `VETO-SBX-013` | VF-009 /010 | VETO-CFG-12 | RL-010 /011 | AC-006 /008 /015 /019 /020 /037 /039 /040;NFCHK-004 /027~029 | duplicate / stored result不得重算 |
| `VETO-SBX-014` | VF-007 /010 | VETO-CFG-09 | RL-010 /014 | AC-021~023 /030 /038 /039 /041;NFCHK-018 /022 /033;VC-009 | cleanup / reaper不得先删材料或绕guard |
| `VETO-SBX-015` | VF-008 /010 | VETO-CFG-10 | RL-010 /014 /015 | AC-020~023 /030 /037~041;NFCHK-012 /015 /018 /022 /033;VC-009 | lease / orphan / redline必须保持containment |
| `VETO-SBX-016` | VF-005 /009辅助 | 无;由架构硬红线直接产生 | RL-012 /013 | AC-031 /034 /038;ECA-015 | sibling compile闭集与模块方向 |
| `VETO-SBX-017` | VF-010辅助 | 无;由测试S级 / evidence integrity直接产生 | 无;不冒充RL | AC-039及Step 10 evidence gate;VC-003~009;ECA-001~021 | 禁止静态造证、状态篡改和不可恢复证据失真 |

`VETO-SBX-016/017`没有机械制造新的需求VF或VETO-CFG来源。前者直接承接正式架构裁剪与RL-012/013,后者直接承接正式`05` S级和Step 10验收证据真实性硬门禁。

---

## 4. CUT / TC / slot / suite追溯矩阵

| VETO | 主要CUT / PER | exact TC / assertion方向 | planned slot | producer suite | fixed source role |
|---|---|---|---|---|---|
| 001 | CUT / PER-003~007 /009 /022 /031 /034~036 | CMD-001~020适用;STA-001~019;TXN-001~006;CONF-001~013;核心positive / negative closure | ESLOT-002~006 /011 /015 /017~019 | SUITE-002 /004 /007 /010 /012 /013 | MAIN-CONTRACT;MAIN-SEAM适用;OPS;P0Q;RELEASE |
| 002 | 003 /004 /009 /031 /033~034 /036 | CMD-001~004 /007 /008;CFG-010;CONF-011 /012;ARCH-001;formal carrier与launch调用断言 | 002 /003 /016 /019 | SUITE-003 /004 /013 | MAIN-CONTRACT;P0Q;RELEASE |
| 003 | 004 /015 /021 /026 /028 /031 /034 /036 | CMD-003 /004;STA-004~009;ERR-006 /007;CFG-010 /016 /018;CONF-001~006 /011 /012 | 003 /012 /013 /017 /019 | SUITE-002~004 /010 /013 | MAIN-CONTRACT;MAIN-SEAM补强;P0Q;RELEASE |
| 004 | 005 /016 /021 /026 /031 /033~034 /036 | CMD-005 /006 /008;STA-010~012;ERR-005;CFG-008 /018;CONF-004~006 /010 /012 | 004 /012 /013 /017~019 | SUITE-002~004 /010 /013 | MAIN-CONTRACT;MAIN-SEAM补强;P0Q;RELEASE |
| 005 | 001~005 /009~013 /031~033 /036 /038 | CTR-001~005;CMD-001 /002 /005 /006;CNS-001 /002;ARCH-002 /003;COND-003;schema owner / no external lifecycle | 001 /002 /004 /008 /013 /016 /019 /021 | SUITE-001 /003~006 /011 /016 | MAIN-CONTRACT;MAIN-SEAM;OPS适用;P0Q适用;RELEASE |
| 006 | 001 /006 /026 /029 /032 /035~036 | CTR-006;CMD-002 /008 /010 /020;ERR-008 /033;CFG-009 /012 /013 /030;CONF-008 /013 | 001 /005 /012 /015 /018 /019 | SUITE-001 /003 /004 /010 /013 | 四source扫描根;RELEASE |
| 007 | 027 /028 /031~033 | CFG-005 /011 /014 /016;STA-029 /030;0 handle或完整same-generation publication | 003 /004 /006 /013 | SUITE-002 /003 /008 | MAIN-CONTRACT;OPS补强;RELEASE |
| 008 | 027 /033 /038 | CFG-007 /008 /029;ARCH-002;COND-003;unsupported declaration strict reject / DesignReopen | 013 /016 /020 /021 | SUITE-003 /015 /016 | MAIN-CONTRACT;conditional source仅判污染;RELEASE |
| 009 | 006 /008 /011~012 /017 /019 /029 /032 | CMD-009~012;CNS-013~020;EVT-004~006;JOB-004 /007;CFG-021;receipt / write-audit owner断言 | 005 /006 /008 /009 /015 /018 /019 | SUITE-004~006 /012 /013适用 | MAIN-CONTRACT;MAIN-SEAM;OPS;P0Q适用;RELEASE |
| 010 | 003~008 /012 /014~022 /026 /032 /035~036 | CTR-003~006;CMD-001~020适用;STA-001~019;TXN-001~006 /011;EVT-001~015;QRY-025 /026;CFG-015 /030 | 002~006 /009 /011 /012 /015 /018 /019 | SUITE-001~007 /010 /013适用 | 四source;RELEASE |
| 011 | 006 /011~012 /017 /020 /026 | CMD-009~012;CNS-013~022;EVT-015;JOB-001 /004;STA-024;RACE-014;CFG-021;ERR-035~038 | 005 /008 /009 /012 /015 | SUITE-004~006 /009 /010 /012 | MAIN-CONTRACT;MAIN-SEAM;OPS;RELEASE |
| 012 | 002~025 /030~031 /036适用 | CTR-001~005;ARCH-003;QRY-001~026;JOB-008~012;CFG-019 /023;ERR-009 /019 /020 /025 /026 /034;write calls=0 | 001 /007 /008 /012 /013 /015 /016 /021 | SUITE-001 /003 /004 /006 /008 /011 /012 /016 | MAIN-CONTRACT;MAIN-SEAM;OPS;P0Q适用;RELEASE |
| 013 | 021~025 | STA-025~030;TXN-007~014;CNS-003 /004;JOB-011;ERR-016 /022~024;RACE-001~019适用 | 010 /011 /012 | SUITE-002 /005~007 /009 /010 | MAIN-CONTRACT;MAIN-SEAM;OPS;RELEASE |
| 014 | 006~007 /018 /022 /029 /032 /035 | CMD-017~020;JOB-005~007;ERR-010 /011;CFG-022;CONF-009;cleanup / release calls=0 when guard non-Allowed | 006 /012 /015 /018 | SUITE-002 /004 /006 /009 /010 /012 /013 | MAIN-CONTRACT;OPS;P0Q;RELEASE |
| 015 | 007 /015 /018 /025~026 /032 /035 | CMD-013~020;JOB-005~007;ERR-010 /011;CFG-022;CONF-007 /009 /010;containment / control transition断言 | 006 /012 /015 /018 | SUITE-002 /004 /006 /010 /012 /013 | MAIN-CONTRACT;OPS;P0Q;RELEASE |
| 016 | 001 /009 /013 /031 /033 /038 | ARCH-001 /003;CTR-003;CFG-014 /017适用;manifest edge、module edge、entry call graph断言 | 001 /008 /013 /016 /021 | SUITE-001 /003 /004 /011 /016 | MAIN-CONTRACT static / build;RELEASE |
| 017 | PER-001~036适用;P0 expected闭集 | CTR-003~006及全部适用producer TC;status / identity / digest / pairing / no-static / review assertion | ESLOT-001~019;020 /021仅formal trigger后 | 全部适用suite +九项VC | 四source + RELEASE |

---

## 5. Raw / check / report闭环矩阵

| VETO | 必需raw / validation check | fixed report path | `Triggered`的最小有效finding | 缺失传播 |
|---|---|---|---|---|
| 001 | CTX;适用RAW;QRESULT;identity / blocked propagation | GATE;RIDX;SREP(002/004/012/013);VCL | 核心节点 / P0轴被替代仍汇总formal success | 任一mandatory source缺失 -> Blocked |
| 002 | RAW(003/004/013);qualification identity check | SREP(004/013);GATE;RIDX;VCL | formal success carrier明确为host / local / bypass / anonymous / fake | identity / carrier proof缺失 -> Blocked |
| 003 | RAW(002/004/010/013);QRESULT;cleanup / identity check适用 | SREP(004/013);GATE;RIDX;VCL | launch成立且至少一维未施加,或forbidden probe成功 | candidate / probe未形成 -> Blocked |
| 004 | RAW(002/004/010/013);policy fixture与backend call audit | SREP(004/010/013);GATE;RIDX;VCL | non-Allowed输入仍产生launch /高风险动作 | policy输入或harness缺失 -> Blocked |
| 005 | RAW(001/003~006/011/016);protocol / dependency / write-audit | `protocol-inventory.md`;DEP;适用SREP;RIDX;VCL | external truth / lifecycle owner或领域编排存在于Sandbox schema / writer / behavior | inventory / graph / raw缺失 -> Blocked |
| 006 | RAW(所有含synthetic marker的producer);redaction check | REDACT;RAUDIT;RIDX;VCL | safe finding确认禁止材料进入任一扫描根 / carrier | scan未执行 /不完整 -> Blocked |
| 007 | RAW(002/003/008);pairing / blocked propagation | SREP(003/008);GATE;RAUDIT;RIDX;VCL | incomplete / mixed generation存在可调用handle或正式可用状态 | publication raw / report缺失 -> Blocked |
| 008 | RAW(003/015/016);protocol / scope / blocked checks | SREP(003/016);GATE;`reports/acceptance/open-issues.md`;VCL | unsupported声明成功 / fallback,或兼容安全削弱生效 | 正式保持absent / reject为NotTriggered;检查缺失为Blocked |
| 009 | RAW(004~006/012/013适用);write-audit / redaction | SREP(004~006);RIDX;EDETAIL;VCL | receipt / material直接创建 /覆盖下游formal truth | target未形成或TC未执行 -> Blocked |
| 010 | RAW(适用owner suite);formal audit row;pairing / no-static | RIDX;EDETAIL;RAUDIT;适用SREP;VCL | accepted truth无formal audit /关键ref,或只有telemetry / log | audit evidence未形成 -> Blocked |
| 011 | RAW(004~006/009/010/012);stored payload / source version audit | SREP(005/006/012);RIDX;EDETAIL;VCL | failure后source回滚或payload由当前truth重建 | failure branch未执行 -> Blocked |
| 012 | RAW(001/003/004/006/008/011/012/016);write-audit | SREP(004/006/012);`protocol-inventory.md`;DEP适用;RIDX;VCL | query / job等write core truth或同signal形成第二正式语义 | write-audit / protocol raw缺失 -> Blocked |
| 013 | RAW(002/005~007/009/010);stored result / owner call audit | SREP(007/009);RIDX;EDETAIL;VCL | duplicate再次调用owner / backend或重算result / receipt / report | duplicate fixture / stored row缺失 -> Blocked |
| 014 | RAW(002/004/006/009/010/012/013);cleanup check | SREP(012/013);GATE;RAUDIT;VCL | guard非Allowed仍delete / release或伪Released | disposition / guard input缺失 -> Blocked |
| 015 | RAW(002/004/006/010/012/013);cleanup / identity check | SREP(012/013);QRESULT;GATE;VCL | orphan / redline在containment外继续或被非formal control解除 | lifecycle / lab未形成 -> Blocked |
| 016 | manifest / generated graph raw;dependency check;module / entry call graph | DEP;RAUDIT;SREP(003/016);RIDX;VCL | 确认非法sibling edge、反向module edge或entry直访 | repo / graph / check缺失 -> Blocked |
| 017 | 所有适用RAW;VC-003~009 raw;source / report diff | GATE;RIDX;RAUDIT;VCL;REV | 确认静态造EV / pass、状态 / identity / digest篡改或故意隐藏阻断状态 | 普通missing pair / generator故障 /未review -> Blocked |

每行最终都必须在VCL引用对应source report和RELEASE RIDX。VCL不能反向生成EV,不能以“全绿”一行替代逐VETO evidence refs。

---

## 6. Checklist逐项记录模型

未来每一行VCL记录的逻辑主键固定为:

```text
(release_run_ref, checklist_review_version, veto_id)
```

每行至少保存以下逻辑字段:

| 字段组 | 必须展开的值 |
|---|---|
| identity | release ref / digest;四source role / run / ENV / PROFILE / revision / config digest |
| source | exact VF / VETO-CFG / RL / AC / NFCHK / VC / ECA refs |
| predicate | predicate version;positive trigger clause;required negative coverage clauses |
| evidence | runtime evidence tuple数组;exact TC / parameter / assertion;slot只作catalog ref |
| artifact | raw path / digest / status;check path / digest / status;report path / digest / status |
| disposition | `NotEvaluated / Blocked / NotTriggered / Triggered / Disputed` |
| handling | stable reason / safe summary;defect / containment;review refs;invalidated / superseded refs |

`NotTriggered`要求所有required negative coverage clause在同一identity下完成,不是“没有看到失败”。`Triggered`只需一个有效肯定finding,但仍必须记录其他source的missing / blocked事实,不得隐藏packet完整性问题。

---

## 7. 当前实例事实与停审

| 对象 | 当前实例事实 | 允许的设计结论 |
|---|---|---|
| 四fixed source run / RELEASE | absent | 只定义消费顺序,不能分配真实identity |
| runtime EV tuple | absent | 只引用planned pattern和slot |
| raw suite / check | absent | 只固定路径 / schema / producer |
| fixed report | absent | 只固定writer input和status传播 |
| VCL / review / defect | absent | 不得填`NotTriggered / Triggered / Reviewed / Closed` |
| `VETO-SBX-001~017` | all `NotEvaluated` | 追溯设计完整,不等于验收通过 |

```text
traceability_status = completed_reviewed_passed_to_step_12
vf_coverage = 10_of_10_mapped
veto_cfg_coverage = 16_of_16_mapped
rl_coverage = 16_of_16_mapped
veto_trace_rows = 17_of_17
runtime_evidence_created = no
runtime_veto_evaluated = no
next_allowed_action = 用户已确认;由Step 12接续缺陷分级、复验与放行规则
```
