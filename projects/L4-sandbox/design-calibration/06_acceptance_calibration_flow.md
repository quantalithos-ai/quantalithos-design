# L4-sandbox 06 验收标准全量重启校准流程

> 对应SOP: `standards/document/验收标准讨论流程_SOP.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 书写规范: `standards/document/验收标准书写规范.md`
> 创建日期: 2026-07-13
> 状态: completed_current_closeout_v7.9
> 当前模式: full-restart
> 设计仓: `/home/aris/Projects/quantalithos-design`
> 项目目录: `projects/L4-sandbox`
> 正式文档目标: `projects/L4-sandbox/06-验收标准.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 本轮口径: 正式 `00-需求文档.md` 至 `05-测试方案.md` 是当前验收设计输入；重建前旧 `06` 只作 historical material。Step 1~15 full-restart 与 DesignReopen current inventory 传播均已完成；正式 `06` 为 current 验收设计基线，验收过程仍为 `NotEntered`，没有 runtime evidence、裁决、风险接受、授权或签署。

---

## 1. 文档级恢复点

| 当前Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 15 | `current_acceptance_design_closeout` | completed_design_static_only | 正式§1~§15、64 checks、250 mandatory P0、17 VETO 与 current `30 /31 /39` inventory 已完成设计静态回查；process state 仍为 `NotEntered`。 | 设计链已关闭；下一合法动作由项目台账统一为固定 design baseline 并关闭 `CB-SBX-01A` Activation 前置，不进入实际验收。 | `06_acceptance_step_15_formal_document_assembly.md`;`06-验收标准.md`;`project_execution_ledger.md`;`implementation_execution_ledger.md` |

---

## 2. 执行纪律

- 每次恢复先读取`project_execution_ledger.md`,再读取本flow和当前Step文件。
- 每个Step独立执行;用户只说“继续 /同意”时只放行一个当前Step。
- 正式`06-验收标准.md`只允许在Step 15由用户逐步确认的Step 1~14装配;Step 1~14不得修改正式`06`。
- 旧`README/06`必须后置审计,不得直接继承旧`SandboxExecution / SandboxSession / SandboxCommand / SandboxOutput / Control`主线、旧三红线、旧阈值、旧证据表达、空checkbox、风险接受或签署占位。
- 验收标准是裁决文档,不是需求补丁、设计评审、测试方案、测试报告、实施计划、发布runbook或运维手册。
- 每个P0验收项必须按“验收主题 -> 验收项 -> 设计契约 -> TC -> runtime EV / fixed report -> 通过 /失败条件 -> 裁决影响”形成小循环;planned ESLOT / EHR不得伪装成runtime EV。
- 若验收设计发现正式`00~05`不可裁决、互相冲突或缺少可验证契约,必须登记上游blocker并回写对应正式文档;不得由`06`自行发明字段、状态、TC或证据。
- 不得填写真实送验版本、commit、`run_id`、config digest、缺陷状态、风险接受、验收结论或签署;不得创建实现代码、测试代码、implementation ledger或planned boundary skeleton。
- 正式`07`、implementation ledger和全部planned boundary skeleton只能在验收Step 15完成并经用户确认后,按`07`自身SOP逐步形成。
- 长内容按Step和验收主题分批写入;单次写入遵守100~300行建议和500行强制拆分。

---

## 3. 权威输入与处理口径

| 输入 | 当前定位 | 本轮使用方式 |
|---|---|---|
| `00-需求文档.md` | current reviewed requirements baseline | C-SBX-1~5、FR-SBX-001~018、BR-SBX-001~033、AC-SBX-001~041、VF-SBX-001~010和六类NFR裁决来源 |
| `01-架构设计.md` | current reviewed architecture baseline | execution isolation truth、职责边界、数据所有权、依赖裁剪、coherent boundary、fail-closed、capture / handoff、cleanup / reaper / redline红线 |
| `02-概要设计.md` | current reviewed HLD baseline | 六个主要组成部分、关键对象、接口骨架、处理流、六组状态主题、异常与配置影响 |
| `03-详细设计.md` | direct acceptance design source | 七模块、55协议、30个owner-level state machine、31个canonical enum entry、39个shared status declaration、事务 /一致性、38 typed error、幂等、观测和测试切口 |
| `04-配置设计.md` | direct config acceptance source | PROFILE-01~07、I001~I101、40配置组、D01~D44、AHG-01~19、EHR-01~20、VETO-CFG和风险边界 |
| `05-测试方案.md` | direct evidence and gate source | 254 TC、250 P0、38 CUT / CBC / PER、28 DS、7 ENV / PROFILE、16 suite、7 gate、17 planned脚本、21 ESLOT、九schema、20 RT和8 RR |
| `04_config_step_12_downstream_handoff.md` | direct explanatory input | `04 -> 06`的AHG / EHR、证据成熟度、profile资格和不得重定义边界 |
| `05_test_plan_step_13_evidence.md`及schema分件 | direct explanatory input | fixed-run目录、runtime EV生成条件、raw / report pairing、review和acceptance draft边界 |
| `05_test_plan_step_14_regression_risks.md`及residual分件 | direct explanatory input | 证据失效、Release scope、RR-SBX-001~008和不可接受风险 |
| `05_test_plan_step_15_formal_document_assembly.md` | reviewed handoff | 正式`05`覆盖闭集、当前成熟度和无执行 / evidence事实结论 |
| 旧`06-验收标准.md` | historical_material | 只识别旧主语、章节、泛化证据、无来源阈值、风险接受和签署污染;不得回填 |
| L1-governance / L1-artifact验收flow与对应Step | granularity_reference | 只参考输入映射、证据成熟度、historical / blocker和停审结构,不继承领域AC、EV或结论 |

---

## 4. Step总任务表

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `06_acceptance_step_01_input_boundary.md` | 确认验收输入边界 | done_reviewed | passed_to_step_2 | 用户已确认;由Step 2接续。 | 正式输入、必须回答 /不再回答、证据成熟度、交付 /run /环境 /数据待固定项、historical / blocker和上游影响明确。 |
| 2 | `06_acceptance_step_02_scope.md` | 明确验收目标与范围 | done_reviewed | passed_to_step_3 | 用户已确认;由Step 3接续。 | P0 / P1 / P2范围、只验接缝能力、非范围和VETO候选明确。 |
| 3 | `06_acceptance_step_03_baseline.md` + `06_acceptance_step_03_baseline_register.md` | 固定验收基线 | done_reviewed | passed_to_step_4 | 用户已确认;由Step 4接续。 | ABSL-SBX-001~040、四源run、路径、缺失 /失效、ASCP反查和§3草稿明确。 |
| 4 | `06_acceptance_step_04_entry_exit.md` + `06_acceptance_step_04_entry_pause_resume_register.md` | 定义进入条件与退出条件 | done_reviewed | passed_to_step_5 | 用户已确认;由Step 5接续。 | AENT-001~016、APAUSE-001~012、AEXT-001~016与双关闭路径可判定。 |
| 5 | `06_acceptance_step_05_function_gate.md` +追溯 /停审分件 | 定义功能验收门禁 | done_reviewed | passed_to_step_6 | 用户已确认;由Step 6接续。 | AC-SBX-006~023逐项闭环设计、TC、planned ESLOT、future EV / report、通过 /失败和裁决影响;18项停审与跨功能审计通过。 |
| 6 | `06_acceptance_step_06_data_arch_redlines.md` +追溯 /停审分件 | 定义数据边界与架构红线验收 | done_reviewed | passed_to_step_7 | 用户已确认;由Step 7接续。 | RL-SBX-001~016可检查;AC-SBX-026~035逐项闭环;AC-SBX-031 ARCH / PROTOCOL slice分工、10项停审和跨红线审计通过。 |
| 7 | `06_acceptance_step_07_interfaces_events_sync.md` +协议登记 /同步停审分件 | 定义接口、事件与跨仓同步验收 | done_reviewed | passed_to_step_8 | 用户已确认;由Step 8接续。 | PG-SBX-001~055逐项闭合正式surface、TC、planned evidence和裁决;SYNC-SBX-001~014、ISA-SBX-001~034、下游未就绪及AC-SBX-031双slice规则明确。 |
| 8 | `06_acceptance_step_08_state_tx_consistency.md` +状态 /事务并发分件 | 定义状态机、事务与一致性验收 | done_reviewed | passed_to_step_9 | 用户已确认;由Step 9接续。 | 31 /31 canonical enum entry（对应30 owner-level machine）、14 /14事务 /重放、19 /19 deterministic race、64项检查、幂等、no-write / no-repair及21个canonical AC slice均可裁决。 |
| 9 | `06_acceptance_step_09_nonfunctional.md` +逐维门禁 /阈值分件 | 定义非功能验收门禁 | done_reviewed | passed_to_step_10 | 用户已确认;由Step 10接续。 | AC-SBX-036~041、36项逐维门禁、20项阈值 /成熟度、零容忍、结构有界、P0-Q Blocked和conditional量化边界可裁决。 |
| 10 | `06_acceptance_step_10_observability_evidence.md` +evidence追溯 / report handoff分件 | 定义可观测性、审计与证据门禁 | done_reviewed | passed_to_step_11 | 用户已确认;由Step 11接续。 | 21个ESLOT到runtime EV、九schema、四fixed source、九validation control、fixed report、raw pairing、redaction、review和handoff闭合。 |
| 11 | `06_acceptance_step_11_veto.md` +追溯 /停审分件 | 定义一票否决项 | done_reviewed | passed_to_step_12 | 用户已确认;由Step 12接续。 | 17个唯一VETO、10 /10 VF、16 /16 VETO-CFG、16 /16 RL、Triggered / Blocked边界、不可风险接受、逐项停审和24项跨VETO审计闭合。 |
| 12 | `06_acceptance_step_12_defects_retest_release.md` +状态 /复验停审分件 | 定义缺陷分级、复验与放行规则 | done_reviewed | passed_to_step_13 | 用户已确认;由Step 13接续。 | S / A / B、12 DTR、L-R1~L-R5、14 DRT、11 DCL、12 DRL、17 /17 VETO、16 /16 suite和22项跨审计闭合。 |
| 13 | `06_acceptance_step_13_risk_acceptance.md` +资格 /停审分件 | 定义风险接受与遗留项 | done_reviewed | passed_to_step_14 | 用户已确认;由Step 14接续。 | 16 /16 RAQ、8 /8 RR、17 /17 VETO禁止接受、B级候选、不可接受项、七状态、authority / expiry、下游同步和26项跨审计闭合。 |
| 14 | `06_acceptance_step_14_final_decision_signoff.md` +停审分件 | 定义最终结论与签署口径 | done_reviewed | passed_to_step_15 | 用户已确认;由Step 15接续。 | 8 /8 FDQ、16 /16 AEXT消费、9 /9维度、三值规则、双授权、5必签 +2条件角色、唯一handoff结论区和30项跨审计闭合。 |
| 15 | `06_acceptance_step_15_formal_document_assembly.md` +跨门禁审计分件 | 整理正式验收标准文档 | completed_reviewed | passed_to_07 | 用户已确认正式`06`和Step 15产物;由`07` Step 1接续。 | 正式`06`按15章主链full-restart装配,15 /15来源块完整,§5~§11门禁与证据 / VETO无断裂,CG-SBX-01~08和§5.10十类审计无unresolved冲突。 |

未来Step的输出文件只在对应Step获得用户放行后创建。上表是总流程计划,不是提前生成未来中间产物。

---

## 5. Step内统一执行模板

每个`06_acceptance_step_*`文件必须按以下小阶段独立推进:

1. Step状态与Step内计划。
2. 本步目标与输入。
3. SOP问题回答。
4. 当前文档 /historical material问题诊断。
5. 改动前后对比。
6. 验收裁决取舍。
7. 结构化中间产物。
8. 复杂度与分批判断。
9. 正式章节回填草稿。
10. 对上游设计的影响判定、待确认事项和blocker。
11. 自检、停审与进入下一步条件。

Step 5~14涉及验收项时,每个P0验收项必须保留设计契约、TC、planned slot、runtime EV / report消费条件、通过条件、失败条件和裁决影响,不得先写全局大表再事后补证据。

---

## 6. 文档级blocker台账

| Blocker ID | Step /范围 | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| SBX-ACC-BOOT-001 | Step 1 | resolved_for_acceptance_step_1_start | L4-sandbox原缺当前full-restart的验收校准flow。 | 本文件已先于Step 1产物创建。 |
| SBX-ACC-HIST-001 | Step 1~15 | contained_as_historical_material | 旧README / `06`固化旧对象、十章结构、泛化API / DB / trace证据、无来源阈值、空checkbox、风险接受和签署。 | 后置差异审计;不得继承为当前门禁或事实。 |
| SBX-ACC-INPUT-001 | Step 1 | resolved_reviewed_passed_to_step_2 | 正式`00~05`、AHG / EHR、ESLOT / runtime EV、RR和送验基线原未形成统一验收输入边界。 | Step 1已输出映射、成熟度、待固定基线、blocker分层和上游影响判定并经用户确认。 |
| SBX-ACC-SCOPE-001 | Step 2 | resolved_reviewed_passed_to_step_3 | 需求核心 /外围、P0-C / P0-Q、P1 / P2、PROFILE证明上限、接缝、非范围和VETO候选原未形成统一验收裁决范围。 | Step 2已输出AG-SBX-01~11、ASCP-SBX-001~024、升级规则、接缝、正式词汇、VF / VETO与RR范围映射并经用户确认。 |
| SBX-ACC-BASELINE-001 | Step 3 | resolved_reviewed_passed_to_step_4 | 文档source ref、送验声明、交付identity、环境 /配置 /数据 /依赖manifest、fixed run和acceptance packet原未统一为可定位基线。 | Step 3已建立ABSL-SBX-001~040、字段 /路径、缺失传播、变更失效和ASCP反查并经用户确认;真实值继续待送验固定。 |
| SBX-ACC-BASELINE-PATH-001 | Step 3 /正式`05` | resolved_by_acceptance_step_3_writeback | 正式`05`与Step 9 /13 /15使用run-scoped acceptance / review子目录,与当前测试和验收标准的固定平铺入口冲突。 | 已回写为`reports/acceptance/*.md`和`reports/review/*.md`;fixed release run、来源digest和review version由文件正文承载。 |
| SBX-ACC-BASELINE-META-001 | Step 3 /正式`02/03/05` | resolved_by_acceptance_step_3_writeback | 正式文件头仍写`Draft`或“待用户审查”,与各自flow及项目台账已审查通过的事实冲突。 | 只校准三个文件头为已审查上游基线;不改变正文契约、正式版本或designed事实成熟度。 |
| SBX-ACC-BASELINE-IDENTITY-001 | Step 3 /正式`04/05` | resolved_by_acceptance_step_3_writeback | Step 13机器schema把canonical SBX-ENV / SBX-PROFILE缩短为机器值,且ReleaseAggregation没有聚合器ENV / PROFILE。 | 机器enum已回写canonical全名;Release聚合器固定SBX-ENV-02 / SBX-PROFILE-02且证明效力只来自四个fixed source run。 |
| SBX-ACC-BASELINE-SOURCE-RUN-001 | Step 3 /正式`05` | resolved_by_acceptance_step_3_writeback | GATE-SBX-MAIN原把ENV-02和controlled ENV-03表达为一个fixed run,与一个context只能绑定一组ENV / PROFILE / config identity冲突。 | 保持单一MAIN gate,拆为MAIN-CONTRACT与MAIN-SEAM两个run;RELEASE按MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q固定顺序逐源校验。 |
| SBX-ACC-ENTRY-PHASE-001 | Step 4 / Step 3 | resolved_by_acceptance_step_4_writeback | Step 3原“基线已固定”表达未显式区分正式进入前的evidence / draft齐备与进入后形成的review /风险裁决 /签署。 | 已回写FormalEntryReady / DecisionPacketComplete双阶段,并把ABSL-024~037的进入阻断语义校准为与SOP及正式`05`一致。 |
| SBX-ACC-ENTRY-EXIT-001 | Step 4 | resolved_reviewed_passed_to_step_5 | Step 3基线、正式`05`测试退出、缺陷、evidence与review要求原未统一为可判定进入 /暂停 /恢复 /退出门禁。 | Step 4已建立AENT / APAUSE / AEXT、normal / terminal关闭路径、风险阶段边界和当前NotEntered readiness,并经用户确认。 |
| SBX-ACC-FUNCTION-001 | Step 5 | resolved_reviewed_passed_to_step_6 | C-SBX-1~5、FR-SBX-001~018、适用BR / AC、详细设计功能流与功能TC原未汇成逐项可裁决的功能验收小循环。 | 已复用AC-SBX-006~023闭合18项门禁、逐项正式契约 / TC / planned slot / future EV / report、通过 /失败、裁决影响、停审和FCA-SBX-001~020审计;用户已确认,未生成runtime事实。 |
| SBX-ACC-DATA-ARCH-001 | Step 6 | resolved_reviewed_passed_to_step_7 | execution isolation truth、外部正文禁止、typed ref / snapshot、依赖裁剪、product-neutral语义、四维边界及配置 /敏感材料红线原未汇成统一可裁决门禁。 | 已建立RL-SBX-001~016、AC-SBX-026~035逐项闭环、ARCH / PROTOCOL slice分工、10项停审和DAA-SBX-001~024审计;用户已确认,未生成runtime事实。 |
| SBX-ACC-INTERFACE-SYNC-001 | Step 7 | resolved_reviewed_passed_to_step_8 | 10 Command、13 Query、9 Consumer、13 Outbound Event、10 Operations Job及运行期 /事件 /handoff接缝原未汇成逐协议、逐同步方向可裁决门禁。 | 已建立PG-SBX-001~055、SYNC-SBX-001~014和ISA-SBX-001~034,闭合formal surface、正负TC、planned evidence、source report、下游未就绪和AC-SBX-031 PROTOCOL-SLICE;用户已确认,未生成runtime事实。 |
| SBX-ACC-STATE-TX-001 | Step 8 | resolved_reviewed_passed_to_step_9 | 31个canonical状态enum entry、14个事务 /重放用例、19个deterministic race及其副作用 / rollback / winner裁决原未汇成验收门禁。 | Step 8三件产物已逐项闭合31 /31 entry（对应30 owner-level machine）、14 /14事务 /重放、19 /19 race、64项聚合停审和24项跨状态审计并经用户确认。 |
| SBX-ACC-NFR-001 | Step 9 | resolved_reviewed_passed_to_step_10 | AC-SBX-036~041、六类NFR专项、零容忍 /结构有界门槛、P0-Q Blocked和conditional量化项原未汇成统一非功能验收门禁。 | Step 9三件产物已闭合6个canonical AC、36项逐维门禁、20项阈值 /成熟度和18项跨NFR审计;无来源数字均排除,并已获用户确认。 |
| SBX-ACC-STATE-NAME-001 | Step 8 / 正式`03`回查 | resolved_by_acceptance_step_8_writeback | 正式`03`§9.4把`ControlledExecutionRunStatus`初态转写为非正式`Pending`,并把`FailureClassificationStatus::Classified`误接入run;§15.3还使用非正式`Publishing`、不存在的reconciliation `Pending -> Completed`及其他口语状态。 | 已以`03_ddd_step_10_state_matrix.md`§12~§19为canonical源,回写正式`03`§9.4 /§15.3全表并登记详细设计flow;验收只接受exact variant。 |
| SBX-TEST-EVIDENCE-PRODUCER-001 | Step 8 / 正式`05`回查 | resolved_by_acceptance_step_8_writeback | `ESLOT-SBX-002/009/011/013/018/019/020/021`声明了ERR / STA / CTR / JOB / ARCH / CFG用例,但producer suite列漏掉对应主归属suite,使future evidence item可能丢raw入口。 | 已回写测试Step 13、正式`05`和Step 7 relay摘要,并登记测试flow / Step 15;未新增TC、slot、suite或EV。 |
| SBX-ACC-EVIDENCE-GATE-PATH-001 | Step 10 / 正式`05`及测试Step 9 /13 /15、验收Step 3 /4 | resolved_by_acceptance_step_10_writeback | 已审查`05`使用`gate-summary.md`,与当前测试与验收标准固定的`reports/runs/<run_id>/gate-results.md`冲突。 | 以当前标准为owner受控回写`gate-results.md`和`generate_gate_results.sh`,同步Step 4入口描述;禁止保留第二入口,未改任何gate、schema、status或runtime事实。 |
| SBX-ACC-EVIDENCE-GATE-001 | Step 10 | resolved_reviewed_passed_to_step_11 | 21个planned slot、runtime EV、九schema、validation control、runtime observability和acceptance / review入口尚未统一为验收证据门禁。 | 三件产物已闭合14 OAG、21 EG、21 ESTOP、21 RSTOP、9 VC和21 ECA,并已获用户确认。 |
| SBX-ACC-VETO-001 | Step 11 | resolved_reviewed_passed_to_step_12 | VF-SBX-001~010、VETO-CFG-01~16、RL-SBX-001~016、测试S级与evidence integrity原未收口为唯一可裁决`VETO-SBX-*`索引。 | 三件产物已建立17个唯一VETO,闭合来源、TC / slot、fixed report、五值checklist disposition、Triggered / Blocked边界、总体不通过、不可风险接受、逐项停审和跨VETO审计,并已获用户确认。 |
| SBX-ACC-DEFECT-001 | Step 12 | resolved_reviewed_passed_to_step_13 | 正式`05`已有S / A / B、L-R1~L-R5、证据失效和回归规则,但尚未收口为验收结论、暂停 /恢复、关闭材料和下一阶段放行的唯一规则。 | 两件产物已保持三等级闭集,区分缺陷与Blocked / InfraFailed / DesignReopen / residual,并闭合17个VETO、suite / check归因、复验、关闭材料、证据失效和放行传播,且已获用户确认。 |
| SBX-ACC-RISK-001 | Step 13 | resolved_reviewed_passed_to_step_14 | RR-SBX-001~008和B级候选原只有来源 / owner role / trigger,尚未形成验收层资格、authority、实际状态、动作、期限 /失效、下游同步和有条件通过约束。 | 两件Step 13产物已闭合16项RAQ、8项RR动态路由、B级入口、不可接受闭集、七状态、authority / expiry、下游同步与26项跨审计,并已获用户确认;当前八项只为catalog `PendingAssessment`,无实际接受。 |
| SBX-ACC-FINAL-001 | Step 14 | resolved_reviewed_passed_to_step_15 | Step 1~13已分别定义scope、baseline、entry / exit、门禁、evidence、VETO、缺陷和风险,但尚未收口为唯一三值结论、维度聚合、下一阶段 /发布准备边界及签署契约。 | 两件Step 14产物已闭合8项FDQ、16项AEXT逐项消费、9维聚合、三值算法、双授权、5必签 +2条件角色、唯一handoff final section、失效规则和30项跨审计,并已获用户确认;当前仍NotEntered且无实际结论 /签署。 |
| SBX-ACC-FORMAL-001 | Step 15 | resolved_reviewed_passed_to_07 | 旧正式`06`十章historical结构与Step 1~14已确认裁决链不一致。 | 已从确认产物重建正式§1~§15、完成CG-SBX-01~08、§5.10十类和机械审计,并经用户确认放行到`07`;不表示runtime验收通过。 |
| SBX-ACC-STEP15-RISK-STATE-001 | Step 15总审计初稿 | resolved_writeback | 风险状态一度误写为非正式`Fulfilled / Superseded`,与Step 13七状态闭集冲突。 | 已按owner改回`NotApplicableByScope / Closed`,在总审计冲突表留痕;正式§13未受污染。 |
| SBX-ACC-EVIDENCE-001 | acceptance execution | open_for_runtime_evidence | 当前21个ESLOT是planned slot,无真实raw / report / check / review或`EV-SBX-*`。 | 不阻塞Step 1~14设计;阻塞任何实际裁决、pass、风险接受或签署。 |
| SBX-ACC-DELIVERY-001 | acceptance baseline | open_for_delivery_baseline | 目标实现仓、送验版本、source revisions、config digest和固定release run尚未形成。 | Step 3定义必填基线和缺失传播;当前不得填假值。 |
| SBX-ACC-EXECUTION-001 | test / acceptance execution | open_for_07_precheck_and_execution | 真实suite、scripts、CI、ENV实例和验收handoff尚未形成。 | 不阻塞验收文档设计;阻塞进入实际验收和最终结论。 |
| SBX-ACC-P0Q-001 | P0-Q / PROFILE-05+ | open_for_p0q_execution | candidate backend、capability matrix、provider、dedicated lab和anti-leak资格未形成。 | P0-Q保持Blocked;不得由P0-C、controlled seam或conditional结果替代。 |
| SBX-ACC-RETENTION-001 | evidence retention | open_for_07_09_physical_policy | 只有condition-based guard,无权威物理介质和数值retention策略。 | Step 13裁决是否形成条件 / blocker;`07/09`后续选择物理策略,不得绕过cleanup /调查guard。 |
| SBX-ACC-DESIGN-REOPEN-001 | `00~05` future writeback | blocker_if_triggered | 后续验收项可能发现需求、字段、状态、TC、证据schema或门禁不可裁决。 | 立即停止相关Step并回写上游;不得由`06`补造契约。 |
| SBX-IMP-BOUNDARY-LEASE-ACCEPTANCE-AUDIT-001 | downstream `07` Step 6 verification | verified_no_acceptance_writeback | Boundary / Policy单向顺序和Run exact persisted lease guard完成上游回写后,需确认正式验收门禁没有依赖旧循环或launch时重算lease。 | 已回查AC-SBX-009~014、状态 /事务 /race、P0-Q与VETO门禁;既有“coherent boundary + active handle / lease + Accepted policy,否则0 launch /不通过”可继续裁决,无需修改正式`06`或验收Step产物,不产生验收事实。 |
| SBX-ACC-IMPLEMENT-001 | downstream `07` | updated_by_07_step_13_review_writeback | 正式`07`、implementation ledger和planned boundary skeleton原不存在;§15.5下游进度曾停在Step 12待审。 | `07` Step 13已同步形成正式13章、项目ledger和32件planned skeleton,完成机械审计并获用户审查确认;不产生验收事实或实现授权。 |
| SBX-IMP-DOWNSTREAM-STATUS-STEP8-001 | 正式`06`§15.5 / downstream `07` | resolved_by_07_step_8_dynamic_writeback | §15.5仍把`07`进度写为Step 7待审,与项目恢复点Step 8已完成待审冲突。 | 只更新配置 /环境 /依赖准备进度;不改AC、VETO、状态、裁决规则或验收事实。 |
| SBX-IMP-DOWNSTREAM-STATUS-STEP9-001 | 正式`06`§15.5 / downstream `07` | resolved_by_07_step_9_dynamic_writeback | §15.5仍把`07`进度写为Step 8待审,与项目恢复点Step 9已完成待审冲突。 | 只更新Spike /风险 /待确认事项、风险转换和32 boundary反查进度;不改AC、VETO、risk route、状态、裁决规则或验收事实。 |
| SBX-IMP-DOWNSTREAM-STATUS-STEP10-001 | 正式`06`§15.5 / downstream `07` | resolved_by_07_step_10_dynamic_writeback | §15.5仍把`07`进度写为Step 9待审,与项目恢复点Step 10已完成待审冲突。 | 只更新暂停 /回退 /变更 /恢复、generation /P0-Q /四source /RELEASE /acceptance失效传播进度;不改AC、VETO、risk route、状态、裁决规则或验收事实。 |
| SBX-IMP-DOWNSTREAM-STATUS-STEP11-001 | 正式`06`§15.5 / downstream `07` | resolved_by_07_step_11_dynamic_writeback | §15.5仍把`07`进度写为Step 10待审,与项目恢复点Step 11已完成待审冲突。 | 只更新32 boundary提交 /评审 /交付、canonical artifact / report和Handoff纪律进度;不改AC、VETO、risk route、状态、裁决规则或验收事实。 |
| SBX-IMP-DOWNSTREAM-STATUS-STEP12-001 | 正式`06`§15.5 / downstream `07` | resolved_by_07_step_12_dynamic_writeback | §15.5仍把`07`进度写为Step 11待审,与项目恢复点Step 12已完成待审冲突。 | 只更新四层完成判定、39 /39交付、14 /14 phase、32 /32 boundary可落码审计、250 P0、17 VETO、15 /20 /18集合和未完成处置进度;不改AC、VETO、risk route、状态、裁决规则或验收事实。 |
| SBX-IMP-DOWNSTREAM-STATUS-STEP13-001 | 正式`06`§15.5 / downstream `07` | resolved_by_07_step_13_review_writeback | §15.5曾把正式`07`、implementation ledger和planned skeleton写为不存在或装配待审,与项目恢复点Step 13已获用户审查确认的当前状态冲突。 | 只更新正式13章、项目ledger、32件planned skeleton、13章 /32 boundary /62 task /108 batch /九类Gate机械审计和文档审查进度;不改AC、VETO、risk route、状态、裁决规则或验收事实。 |

当前没有阻塞Step 15完成的未解上游设计blocker。用户已完成文档审查并放行到`07`;目标仓、suite、环境、P0-Q和真实evidence尚未形成,继续阻塞真实执行与验收裁决,但不影响正式`06`作为`07`的设计输入。

---

## 7. 当前next_allowed_action

```text
current_document = `06-验收标准.md`
current_step = Step 15 `整理正式验收标准文档`
current_module = `formal_document_reviewed`
gate_status = passed_to_07
next_allowed_action = `07` Step 13已装配并获用户审查确认;项目当前读取implementation ledger与`CB-SBX-01A.md`,先固定可复现baseline并关闭其余Activation前置
formal_document_write = complete_no_further_write_without_review_feedback
real_acceptance_execution = not_started
real_evidence_created = no
implementation_ledger_created = yes_by_07_step_13_reviewed
planned_boundary_skeleton_created = yes_32_of_32_by_07_step_13_reviewed
commit_required = no
```

## PHYSICAL EOF Current Override: final design closure calibration (`DC-03`)

`06` 的 64 checks、17 VETO、evidence authority 与裁决状态机不重开。Step 15 仅获准确认新增技术验证 blocker 的
验收传播规则；不得预填 evidence alias、reviewer、签署或通过结果。

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_document = 06-验收标准.md
current_step = Step 15 post-closeout activation propagation audit authorized
flow_status = completed_current_closeout_pending_DC-04_audit
acceptance_status = NotEntered
next_allowed_action = DC-04_audit_formal_06_activation_propagation
commit_required = no
```

## PHYSICAL EOF Current Override: DesignReopen acceptance propagation completed

本节覆盖前述“继续到 `07`”的历史恢复路径。current 验收设计已经消费 30 owner-level state machines、31 Step 10 enum
entries、39 shared declarations、64 checks 与 250 mandatory P0；这些都是设计库存，不是实际裁决。

```text
current_document = 06-验收标准.md
current_step = DesignReopen acceptance inventory propagation completed
design_chain_status = completed_current_closeout
process_state = NotEntered
final_decision = absent_not_adjudicated
real_acceptance_execution = not_started
real_test_execution = not_started
real_evidence_created = no
risk_acceptance_created = no
authorization_created = no
acceptance_signoff = no
next_required_reads = project_execution_ledger.md|implementation_execution_ledger.md|07-实施计划.md|implementation-boundaries/CB-SBX-01A.md
next_allowed_action = fixed_design_baseline_then_close_01A_activation_prerequisites
commit_required = no
```

## PHYSICAL EOF Current Override: `DC-06` current-truth repair authorized

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_document = 06-验收标准.md
current_step = Step 15 final static audit repair
flow_status = current_truth_repair_authorized
formal_delta = section_15_5_boundary_route_only
acceptance_schema_changed = no
current_boundary_status = blocked|activation_gate|handoff
implementation_started = no
real_test_execution = not_started
real_evidence_created = no
acceptance_status = NotEntered
acceptance_signoff = no
next_allowed_action = update_formal_06_current_boundary_route
commit_required = no
```

## PHYSICAL EOF Current Override: `DC-06` completed, `DC-07` current

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_document = 06-验收标准.md
current_step = DC-06 current-truth repair and final audit completed
flow_status = completed_design_static_only
formal_delta = section_15_5_boundary_route
design_conclusion = design_closed_ready_for_baseline_publication
project_current_document = 07-实施计划.md
project_current_step = Step 18 baseline publication disposition
current_dc_task = DC-07
design_baseline = not_fixed
acceptance_status = NotEntered
implementation_started = no
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
next_allowed_action = DC-07_record_baseline_publication_disposition
commit_required = no
```

## PHYSICAL EOF Current Override: `DC-07` disposition completed

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_document = 06-验收标准.md
current_step = DC-07 baseline publication disposition consumed
flow_status = completed_design_static_only
project_design_status = closed_without_baseline_publication
completed_dc_tasks = DC-00|DC-01|DC-02|DC-03|DC-04|DC-05|DC-06|DC-07
project_current_design_task = none
design_conclusion = design_closed_ready_for_baseline_publication
design_baseline = not_fixed
baseline_publication_disposition = completed_without_publication
baseline_publication_status = not_published
commit_authorization = absent
acceptance_status = NotEntered
implementation_started = no
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
next_allowed_action = wait_explicit_commit_authorization
commit_required = no
```
