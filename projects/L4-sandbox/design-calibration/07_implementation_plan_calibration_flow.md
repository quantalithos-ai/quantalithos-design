# L4-sandbox 07 实施计划全量重启校准流程

> 对应SOP: `standards/document/实施计划讨论流程_SOP.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 书写规范: `standards/document/实施计划书写规范.md`
> 台账规范: `standards/document/代码实施台账与门禁规范.md`
> 创建日期: 2026-07-16
> 状态: step_13_completed_current_closeout
> 当前模式: full-restart
> 设计仓: `/home/aris/Projects/quantalithos-design`
> 项目目录: `projects/L4-sandbox`
> 正式文档目标: `projects/L4-sandbox/07-实施计划.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 本轮口径: 正式`00-需求文档.md`至`06-验收标准.md`是当前实施计划输入。旧`README.md`和重建前旧正式文档只作historical material,不得恢复旧对象、旧五段主线、Docker / gVisor硬选型、旧阈值、旧实施路线或任何伪执行事实。

---

## 1. 文档级恢复点

| 当前Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 13 | `formal_document_assembly:completed_current_closeout` | completed_current_closeout | 正式13章、current capture / handoff / relay / ordinary-hook contract lock、core actor authority、30 /31 /39设计库存、64 checks、254 /237 /250设计库存、项目级implementation ledger和32件planned boundary skeleton已形成并完成静态审计；未形成design commit baseline或实现授权。 | 设计文档流程已收口；实现移交前先固定可复现design baseline并关闭`CB-SBX-01A`其余Activation前置。 | `07-实施计划.md`;本Step产物;`implementation_execution_ledger.md`;`implementation-boundaries/CB-SBX-01A.md` |

---

## 2. 执行纪律

- 每次恢复先读取`project_execution_ledger.md`,再读取本flow和当前Step文件。
- 每个Step独立执行;用户已明确授权本轮一次性完成剩余设计收口时，内部子任务可连续推进，但必须逐项记录状态并保留Step / boundary门禁。
- Step 1~12只创建 /更新各自中间产物,不得零散写入正式`07-实施计划.md`;Step 13才能从已审查产物装配正式文档。
- 实施计划只定义将已完成设计按可验证顺序落地的phase、commit boundary、阅读、测试、验收、暂停、提交和handoff门禁;不得重新发明字段、DTO、port、flow、状态、配置项、TC、evidence schema或验收结论。
- 每个phase和commit boundary的字段 / DTO / ref / metadata / state / UoW / projection / artifact / evidence / phase边界闭环,以及可落码性标准§九的经验复核,必须由设计者在Step 5~6完成;不得留给实现agent自行补齐。
- 正式`07`完成时,必须同步创建项目级implementation ledger和Boundary Gate Matrix中全部planned boundary skeleton;当前唯一boundary才能active,未来boundary必须为`planned / wait_until_current`。
- 本流程只编辑设计仓文档,不创建实现仓代码、commit、真实`run_id`、runtime evidence alias、测试结果、风险接受、验收结论或签署。
- 长内容按Step、phase或boundary分批写入;单次写入遵守100~300行建议和500行强制拆分。

---

## 3. 权威输入与处理口径

| 输入 | 当前定位 | 本轮使用方式 |
|---|---|---|
| `00-需求文档.md` | reviewed requirements baseline | 提供C-SBX-1~5、FR-SBX-001~018、BR / AC / VF、NFR、P0 / P1 / P2与明确非目标 |
| `01-架构设计.md` | reviewed architecture baseline | 提供execution isolation truth、职责 /依赖 /数据所有权、coherent boundary、fail-closed、capture / cleanup / redline与禁止混层 |
| `02-概要设计.md` | reviewed HLD baseline | 提供六个主要组成部分、关键对象、接口骨架、处理流、状态主题与异常 /配置影响 |
| `03-详细设计.md` | direct implementation contract source | 提供Rust workspace、七模块、对象 / port、55协议、30个owner-level state machines、31个Step 10 canonical status enum entries、39个Step 6 shared status declarations、38 typed error、函数流、UoW、幂等 /并发、观测与实施承接 |
| `04-配置设计.md` | direct config implementation source | 提供PROFILE-01~07、I001~I101、40配置组、D01~D44、source / generation / sensitive material / adapter binding与禁止可配置化边界 |
| `05-测试方案.md` | direct test gate source | 提供254 TC、38 CUT / CBC / PER、28 DS、7 ENV / PROFILE、16 suite、7 gate、17 planned脚本、21 ESLOT、九schema和回归规则 |
| `06-验收标准.md` | reviewed acceptance design baseline | 提供P0-C / P0-Q、功能 /架构 /协议 /状态 / NFR / evidence门禁、17 VETO、缺陷 /风险 /最终裁决契约;不提供runtime验收事实 |
| `03_ddd_step_17_implementation_handoff.md` | direct explanatory handoff | 提供字段、DTO / Event / Job、Query view、状态、命名和phase / boundary预复核索引 |
| L2-tools / runtime / member-service `00~06` | historical seam reference | 只提取相邻仓职责线索;三者均缺正式`04`,其余文档为旧Draft /空checkbox口径,不得作为Sandbox实施契约或证据来源 |
| L1-identity / L1-work `00~07` | implementation granularity reference | 参考上游输入、phase / boundary、台账与门禁粒度;不继承身份 /工作领域语义 |
| 实施计划SOP /书写规范 /台账规范 /可落码性标准 /依赖裁剪规则 | normative standards | 固定Step 1~13、正式13章、boundary闭环、Commit / Handoff Gate、planned skeleton、经验复核与只允许`core-contracts`编译期sibling依赖 |

---

## 4. Step总任务表

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `07_implementation_plan_step_01_input_boundary.md` | 确认实施输入边界 | completed_reviewed_passed_to_step_2 | passed_to_step_2 | 已由Step 2承接;若后续发现输入冲突则回退Step 1。 | 正式`00~06`、标准、historical参考、缺失风险、闭环预判、Step 2放行与实现移交阻断均已明确。 |
| 2 | `07_implementation_plan_step_02_scope.md` | 明确实施目标、范围和非范围 | completed_reviewed_passed_to_step_3 | passed_to_step_3 | 已由Step 3承接;若后续发现范围冲突则回退Step 2。 | `MDR-SBX-P0`、P0-C / P0-Q、PROFILE-05 candidate、非范围和P1 / P2防误入可追溯。 |
| 3 | `07_implementation_plan_step_03_prerequisites_reading.md` | 收稳前置条件与阅读清单 | completed_reviewed_passed_to_step_4 | passed_to_step_4 | 已由Step 4承接;若阅读 / 前置变化则回退Step 3。 | 仓库 / git / Rust /命名、11个阅读包、11条记忆、台账模板、依赖、17脚本和前置关闭位置完整。 |
| 4 | `07_implementation_plan_step_04_objects_deliverables.md` | 抽取实施对象与交付物 | completed_reviewed_passed_to_step_5 | passed_to_step_5 | 已由Step 5承接;若交付物范围变化则回退Step 4。 | 19个实施surface及code / config / test / automation / evidence capability / handoff交付物均有来源、预计落点和完成判定;非交付物与跨仓依赖明确。 |
| 5 | `07_implementation_plan_step_05_phases_dependencies.md` | 设计实施阶段与依赖顺序 | completed_reviewed_passed_to_step_6 | passed_to_step_6 | 已由Step 6承接;若boundary审计发现phase范围冲突则回退Step 5。 | HDO-SBX-00、PH-01~14和PH-QP按可验证功能增量组织;14 /14逐phase停审及39交付物 /55协议 /门禁跨phase审计完整。 |
| 6 | `07_implementation_plan_step_06_tasks_commit_boundaries.md` | 拆分阶段任务、编写顺序与提交边界 | completed_reviewed_passed_to_step_7 | passed_to_step_7 | 已由Step 7承接;若门禁映射发现boundary范围冲突则回退Step 6。 | 32 boundary、62 task、108 batch、required reads / scope / checks、闭环 /经验复核、32 /32停审、跨boundary审计、Commit / Handoff Gate与ledger / skeleton schema完整。 |
| 7 | `07_implementation_plan_step_07_test_acceptance_gates.md` | 嵌入测试与验收门禁 | completed_reviewed_passed_to_step_8 | passed_to_step_8 | 已由Step 8承接;若配置 /环境准备发现门禁契约冲突则回退Step 7。 | 14 /14 phase与32 /32 boundary均有测试 /验收 / evidence / report /失败 / review门禁;16 suite、7 gate、17 script、21 slot、17 VETO和254 TC owner反查闭合。 |
| 8 | `07_implementation_plan_step_08_config_environment_dependencies.md` + 2分件 | 定义配置、环境与外部依赖准备 | completed_reviewed_passed_to_step_9 | passed_to_step_9 | 已由Step 9承接;若风险审计发现依赖准备冲突则回退Step 8。 | S00~S08、40 /101、44域、10 /23 material、7 ENV /Profile、14 phase、32 boundary、CI与不可用处置闭合。 |
| 9 | `07_implementation_plan_step_09_spikes_risks_open_questions.md` +2分件 | 定义Spike、风险与待确认事项 | completed_reviewed_passed_to_step_10 | passed_to_step_10 | 已由Step 10承接;若变更控制审计发现风险转换冲突则回退Step 9。 | 15 Spike、20 Risk、18 OQ、HDO /14 phase /32 boundary、转换 /回写 /risk acceptance边界闭合。 |
| 10 | `07_implementation_plan_step_10_rollback_pause_change_control.md` +2分件 | 定义回退、暂停与变更控制 | completed_reviewed_passed_to_step_11 | passed_to_step_11 | 已由Step 11承接;若提交 /交付审计发现控制路由冲突则回退Step 10。 | 三类合法台账路由、五类回退、HDO /14 phase /32 boundary、generation /P0-Q /四source /RELEASE /acceptance失效和恢复条件可判定。 |
| 11 | `07_implementation_plan_step_11_commit_review_delivery.md` +2分件 | 定义提交、评审与交付纪律 | completed_reviewed_passed_to_step_12 | passed_to_step_12 | 已由Step 12承接;若完成判定审计发现交付纪律冲突则回退Step 11。 | 33项SOP、英文commit、message / scope / body / footer、32 /32映射与停审、12 review、10 delivery、canonical artifact / report及24项跨审计完整。 |
| 12 | `07_implementation_plan_step_12_completion_criteria.md` +2分件 | 定义实施完成判定 | completed_reviewed_passed_to_step_13 | passed_to_step_13 | 已由Step 13承接;若装配审计发现完成判定冲突则回退Step 12。 | 四层判定、39 /39交付、14 /14 phase与32 /32 boundary可落码审计、250 P0、17 VETO、canonical证据、15 /20 /18风险集合及未完成处置已获用户确认。 |
| 13 | `07_implementation_plan_step_13_formal_document_assembly.md` | 整理正式实施计划文档 | completed_current_closeout | completed_current_closeout | 设计文档流程已收口;实现移交仍须先固定baseline并关闭01A Activation前置。 | 正式13章、4/4 current contract lock、30 /31 /39、64 checks、254 /237 /250设计库存、implementation ledger、32件skeleton和静态审计均完成；未生成执行事实。 |

未来Step的输出文件只在对应Step获得用户放行后创建。上表是流程契约,不是已生成产物或实现授权。

---

## 5. Step内统一执行模板

每个`07_implementation_plan_step_*`文件必须按以下小阶段独立推进:

1. Step状态与三层开工门禁。
2. 本步目标、输入与SOP问题回答。
3. 当前文档 / historical material问题诊断。
4. 改动前后对比与设计取舍。
5. 结构化中间产物与复杂度 /分批判断。
6. 字段 / DTO / ref / metadata / state / read model / transaction / evidence / phase boundary闭环及经验复核。
7. 正式章节回填草稿;只能作为Step 13输入,不能提前写入正式`07`。
8. 待确认事项、blocker、自检、停审和进入下一步条件。

Step 5必须逐phase停审,Step 6必须逐commit boundary停审;完成后分别做跨phase /跨boundary审计。每个boundary必须能独立review、验证和必要时回退,不得只按文件或对象堆叠任务。

## Current Closeout Override: `v7.9-closeout`

```text
current_document = 07-实施计划.md
current_step = Step 13 formal document assembly and current contract propagation
current_module = final_static_audit
design_status = completed_current_closeout
current_contract_lock = 4_of_4
actor_authority_lock = core_Human|AiMember|System|Integration;P0_worker_job_ActorKind::System_only;trusted_source_via_source_ref_and_envelope_gate
state_inventory = 30|31|39
check_inventory = 64|31_STCHK|14_TXCHK|19_RCHK
test_design_inventory = 254|237_P0-C|13_P0-Q|4_conditional|250_P0
current_boundary = CB-SBX-01A
implementation_gate = blocked|activation_gate|wait_design
next_allowed_action = fixed_design_baseline_then_close_01A_activation_prerequisites
```

---

## 6. 文档级blocker台账

| Blocker ID | Step /范围 | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| SBX-IMP-BOOT-001 | Step 1 | resolved_for_step_1_start | L4-sandbox原缺当前full-restart的实施计划flow。 | 本flow已先于Step 1产物创建。 |
| SBX-IMP-INPUT-001 | Step 1 | completed_reviewed_passed_to_step_2 | 正式`00~06`、实施承接、标准、historical参考和实现前缺口原未形成统一实施输入边界。 | Step 1已完成输入表、缺失风险、闭环预判和Step 2 /实现移交分判,并经用户确认由Step 2承接。 |
| SBX-IMP-SCOPE-001 | Step 2 | completed_reviewed_passed_to_step_3 | 实施最小交付、P0-C / P0-Q关系、PROFILE-05 /06 /07分层、相邻仓非范围和自动化交付面原未形成单一范围闭集。 | Step 2已固定`MDR-SBX-P0`,完成需求 /设计 /测试 /验收双向覆盖和防误入审计,并经用户确认由Step 3承接。 |
| SBX-IMP-PREREQ-001 | Step 3 | completed_reviewed_passed_to_step_4 | 实施阅读、仓库 /工具 /命名、台账入口、永久记忆、依赖、脚本 /报告路径和受影响boundary前置原未形成统一开工门禁。 | Step 3已形成32项回答、11个阅读包、11条记忆、三类台账入口、Gate模板、17脚本和13类前置,并经用户确认由Step 4承接。 |
| SBX-IMP-OBJECTS-001 | Step 4 | completed_reviewed_passed_to_step_5 | 七crate、55协议、状态 /错误 /一致性、配置、adapter、测试、自动化、evidence producer、非交付物和跨仓依赖原未形成统一可判定交付闭集。 | Step 4已形成19个实施surface、全部`DEL-SBX-*`交付表、非交付物 /跨仓表和Step 5承接约束,并经用户确认由Step 5承接。 |
| SBX-IMP-PHASES-001 | Step 5 | completed_reviewed_passed_to_step_6 | 39项交付物原无可验证phase、依赖顺序、P0-Q准备支线、逐phase后序依赖检查和跨phase门禁覆盖。 | Step 5已形成HDO-SBX-00、PH-01~14、PH-QP、PHG-SBX-01~14及全量审计,经用户确认并由Step 6承接。 |
| SBX-IMP-TEST-DOWNSTREAM-STATUS-001 | 正式`05`§15.5 / Step 5 | resolved_by_step_5_dynamic_writeback | 当前正式`05`的下游状态仍把`06`写为historical material、`07`写为完全不存在,与正式`06`已重建和`07` Step 5进度冲突。 | 已回写为正式`06` reviewed但验收`NotEntered`,正式`07`仍缺但Step 5已停审;未改测试契约或生成执行事实。 |
| SBX-IMP-DOWNSTREAM-STATUS-STEP7-001 | 正式`05/06`§15.5 / Step 7 | resolved_by_07_step_7_dynamic_writeback | 两份正式上游的下游进度仍停在Step 5,与Step 7已完成待审的恢复点冲突。 | 只回写当前进度与变更记录,并同步测试 /验收flow和项目台账;不改测试 /验收契约、编号或runtime事实。 |
| SBX-IMP-DOWNSTREAM-STATUS-STEP8-001 | 正式`04/05/06`下游状态 / Step 8 | resolved_by_07_step_8_dynamic_writeback | 正式`04`仍把`05/06`写为旧链或阻塞,正式`05/06`仍停在Step 7待审,与Step 8已完成待审冲突。 | 只回写下游进度与变更记录,并同步配置 /测试 /验收flow和项目台账;不改配置、测试、验收契约或runtime事实。 |
| SBX-IMP-HIST-001 | Step 1~13 | contained_as_historical_material | 旧README /旧正式链、L2三仓旧Draft和空checkbox可能将旧对象、产品、阈值、职责或证据回流为实施事实。 | 只作差异审计和接缝线索;与当前正式`00~06`冲突时必须排除。 |
| SBX-IMP-DESIGN-BASELINE-001 | implementation handoff | open_before_handoff | 当前设计HEAD为`edf2f8ca20cad08fbab76aa26cd74f50fb2e54f6`,但L4-sandbox新版`00~06`和校准链尚在工作区,未形成可复现的新design commit baseline。 | 不阻塞Step 1~13设计讨论;正式移交实现前必须由用户决定并固定baseline,本流程不自行commit。 |
| SBX-IMP-TARGET-REPO-001 | implementation precheck | open_before_first_boundary | 目标实现仓`/home/aris/Projects/quantalithos-sandbox`当前不存在。 | 不阻塞Step 1~13;Step 5已固定只有HDO-SBX-00完成后,才可由PH-01首个允许boundary创建 /确认。 |
| SBX-IMP-TARGET-VERSION-001 | bootstrap precheck | open_before_bootstrap_boundary | 目标仓edition / rust-version尚未形成Sandbox落盘事实;core现实基线为Rust 2024 /1.93。 | 不阻塞Step 5阶段设计;Step 6 bootstrap boundary前由design owner固定兼容值,不得由实现者直接复制core或自行选择。 |
| SBX-IMP-SIBLING-REPO-001 | dependency precheck | open_before_affected_boundary | 本机有`quantalithos-core`,但`quantalithos-tools`、`quantalithos-runtime`、`quantalithos-member-service`实现仓当前不存在。 | 只有`core-contracts`可成为编译期sibling依赖;其他仓缺失通过port / adapter / event / handoff / fake处理,不得引入业务path dependency或伪造下游已就绪。 |
| SBX-IMP-L2-REFERENCE-001 | Step 1 / seam reference | contained_as_historical_reference | L2-tools / runtime / member-service均缺`04-配置设计.md`,其`00~03/05/06`是旧Draft /空checkbox口径。 | 不将它们当作Sandbox的权威上游契约;仅保留tools semantic execution、runtime agent loop、member lifecycle orchestration应归属相邻仓的反向边界线索。 |
| SBX-IMP-BOUNDARY-001 | Step 5~6 / handoff | completed_reviewed_passed_to_step_7 | Step 5只有phase,原无commit boundary、逐项可落码闭环 /经验复核、scope、checks和停审。 | Step 6已定义32个boundary、62 task、108 batch、32 /32停审与跨boundary审计,经用户确认并由Step 7承接。 |
| SBX-IMP-GATES-001 | Step 7 | completed_reviewed_passed_to_step_8 | Phase / boundary原只有planned check方向,尚未逐项绑定正式suite / gate、AC / VETO、artifact / report、失败传播和审查责任。 | 已建立五级成熟度、固定路径 /脚本 /review规则、14 phase与32 boundary矩阵、14 +32停审及16 /7 /17 /21 /17 /254反查;经用户确认并由Step 8承接,未生成runtime事实。 |
| SBX-IMP-DEPENDENCY-001 | Step 8 | completed_reviewed_passed_to_step_9 | 配置 /环境 /外部依赖、替身证明上限、material、CI和不可用处置原未逐phase /boundary闭合。 | 已建立Step 8主件和配置 /material、32 boundary两分件,完成9 /40 /101 /44 /10 /23 /7 /14 /32反查;经用户确认并由Step 9承接,现实前置保持开放。 |
| SBX-IMP-RISKS-001 | Step 9 | completed_reviewed_passed_to_step_10 | Spike、实施风险、待确认事项、blocker / conditional / DesignReopen转换、上游回写及逐boundary风险原未形成统一可执行闭集。 | 已建立Step 9主件和风险登记 /32 boundary矩阵,完成15 /20 /18 /14 /32反查;经用户确认并由Step 10承接,未执行Spike或接受风险。 |
| SBX-IMP-DOWNSTREAM-STATUS-STEP9-001 | 正式`04/05/06`下游状态 / Step 9 | resolved_by_07_step_9_dynamic_writeback | 正式`04/05/06`及flow仍把`07`写为Step 8待审,与Step 9已完成待审冲突。 | 只回写下游进度与变更记录;不改配置、测试、验收、risk route或runtime事实。 |
| SBX-IMP-CONTROL-001 | Step 10 | completed_reviewed_passed_to_step_11 | Step 6~9已有boundary、Gate、依赖与风险,但暂停、回退、变更、恢复及非代码真相失效传播原未形成统一可执行闭集。 | Step 10主件和2分件已闭合三类合法路由、五类回退、HDO /14 phase /32 boundary及generation /P0-Q /RELEASE /acceptance失效传播,经用户确认并由Step 11承接。 |
| SBX-IMP-COMMIT-001 | Step 11 | completed_reviewed_passed_to_step_12 | 32个boundary已有scope、checks和子功能组,但原未统一为实现仓英文message、type / scope、body分组、评审与交付纪律。 | Step 11三件产物已完成33 /33、32 /32、12 /12、10 /10和24 /24审计,经用户确认并由Step 12承接;未形成commit或交付事实。 |
| SBX-IMP-COMPLETION-001 | Step 12 | completed_reviewed_passed_to_step_13 | 范围、交付物、boundary、门禁、风险、证据和验收最终规则原分散,缺少“boundary完成 /实现可送验 /验收裁决 /生效授权”分层及未完成分支。 | Step 12三件产物已闭合11 /11问题、39 /39交付、14 /14 phase、32 /32 boundary、250 P0、17 VETO、15 /20 /18集合、canonical交付包和未完成路由;已获用户确认并由Step 13承接。 |
| SBX-IMP-ASSEMBLY-001 | Step 13 | completed_reviewed | Step 1~12已审查产物原尚未装配为正式13章,implementation ledger和32件planned skeleton原不存在。 | 已同步形成正式`07`、Step 13装配审计、项目ledger和32件非空planned skeleton,通过机械审计并获用户明确审查确认;未伪造baseline、gate pass、commit或runtime evidence。 |
| SBX-IMP-DOWNSTREAM-STATUS-STEP12-001 | 正式`04/05/06`下游状态 / Step 12 | resolved_by_07_step_12_dynamic_writeback | 正式`04/05/06`及flow仍把`07`写为Step 11待审,与Step 12已完成待审冲突。 | 只回写完成判定、可落码审计、交付 /证据 /未完成处置进度;不改配置 /测试 /验收契约、编号、状态或runtime事实。 |
| SBX-IMP-COMMIT-REPO-001 | Step 11 / `CB-SBX-01A` Activation | open_before_cb_sbx_01a_activation | 目标实现仓不存在,当前无法核验其local git identity、hooks、commitlint、branch policy和历史合格样例。 | 不阻塞Step 11设计;01A开工前必须回读并叠加更严格规则,不得放宽英文message、scope必填、一boundary一commit和固定footer。 |
| SBX-IMP-LEDGER-ACTION-001 | Step 7~10 / future ledger | resolved_by_step_10_writeback | Step 7~9曾将`wait_dependency`写为future `next_allowed_action`,不属于台账规范合法值。 | 保留`dependency_wait`为原因分类;现实外部依赖统一映射`blocked / handoff`,当前scope可修复失败映射`blocked / fix_gate_failure`,设计缺口仍为`blocked / wait_design`。 |
| SBX-IMP-BOUNDARY-DIMENSION-001 | Step 6~10 / boundary wording | resolved_by_step_10_writeback | 少量“五维”简称未区分active execution identity、正式四维隔离主边界与`workspace_boundary`附加字段。 | 已统一为active identity前置 + resource / filesystem / network / process四维coherent isolation + workspace requirement;不改字段、协议、状态、TC / AC或boundary数量。 |
| SBX-IMP-DOWNSTREAM-STATUS-STEP10-001 | 正式`04/05/06`下游状态 / Step 10 | resolved_by_07_step_10_dynamic_writeback | 正式`04/05/06`及flow仍把`07`写为Step 9待审,与Step 10已完成待审冲突。 | 只回写下游进度、控制与失效传播摘要;不改配置 /测试 /验收契约、编号、状态或runtime事实。 |
| SBX-IMP-DOWNSTREAM-STATUS-STEP11-001 | 正式`04/05/06`下游状态 / Step 11 | resolved_by_07_step_11_dynamic_writeback | 正式`04/05/06`及flow仍把`07`写为Step 10待审,与Step 11已完成待审冲突。 | 只回写提交 /评审 /交付、32 boundary message和canonical artifact / report进度;不改配置 /测试 /验收契约、编号、状态或runtime事实。 |
| SBX-IMP-BOUNDARY-POLICY-CYCLE-001 | Step 6 /正式`02~05`回查 | resolved_by_07_step_6_writeback | Boundary establishment原消费后序policy snapshot / decision,形成PH-05 -> PH-06循环。 | 已回写概要对象 /接口 /flow、详细对象 /port /协议 /flow /持久化 /配置绑定 /测试切口,固定`Context -> Boundary -> Policy -> Run`;计数不变。 |
| SBX-IMP-LEASE-RUN-GUARD-001 | Step 6 /正式`03~05`回查 | resolved_by_07_step_6_writeback | I065消费时机与Run exact handle / lease读取surface原未完全闭合。 | I065固定在generation-scoped boundary establishment消费并保存window;Run沿exact refs校验active / expiry和Accepted policy,不得重算或scan latest;未新增协议 /配置项 /TC。 |
| SBX-IMP-BOUNDARY-SERIAL-001 | Step 6 | resolved_in_07_step_6 | `09B`与`10A`有限并行会违反项目ledger单current约束。 | 已线性化为`09A -> 09B -> 10A -> 10B`;只允许材料预读,不允许并行实现 / staging /提交。 |
| SBX-IMP-LEDGER-001 | Step 6 / Step 13 | instantiated_reviewed | 项目级implementation ledger和planned boundary skeleton原不存在。 | Step 13已与正式`07`同步创建项目ledger和32 /32非空实例并获用户审查确认;01A保持`blocked / wait_design`,其余31件保持`planned / wait_until_current`。 |
| SBX-IMP-SCRIPT-STANDARD-001 | automation boundary | open_before_script_boundary | 17个正式Shell入口已定义,但`standards/coding`无专用Shell规范且本机无`shellcheck`。 | 不阻塞Step 5阶段设计;Step 6 /7在首个脚本boundary前绑定正式规范或审查后的项目规则,并固定lint工具 /等价检查。 |
| SBX-IMP-CANONICAL-JSON-001 | schema writer boundary | open_before_schema_writer_boundary | 正式machine schema要求RFC 8785和固定sha256规则,但实现库 /工具尚未选择。 | 不阻塞Step 5阶段设计;Step 6 /7固定实现与fixture验证,不得以`jq` / `sha256sum`存在性替代闭环。 |
| SBX-IMP-RUNTIME-EVIDENCE-001 | execution / acceptance | open_for_future_execution | 当前无implementation commit、suite / script / CI、ENV实例、candidate、`run_id`、config digest、runtime EV、测试结果或签署。 | 不阻塞实施计划设计;必须作为Step 7 / 12的执行门禁,不得预填。 |

---

## 7. 当前 next_allowed_action

```text
current_document = `07-实施计划.md`
current_step = Step 13 `整理正式实施计划文档`
current_module = `formal_document_assembly_completed_reviewed`
gate_status = completed_reviewed
next_allowed_action = 设计文档流程已收口;实现移交前固定可复现design baseline并关闭CB-SBX-01A其余Activation前置
formal_document_created = yes_reviewed
implementation_ledger_created = yes_reviewed
planned_boundary_skeleton_created = yes_32_of_32_reviewed
implementation_repo_exists = no
real_implementation_started = no
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

## PHYSICAL EOF Current Override: Step 16 completed, Step 17 current (`DC-06`)

Step 16 已同步 implementation ledger、6件受技术基线影响的Boundary，并完成32/32 skeleton反向扫描。设计选择与
Activation验证已分离；当前只允许执行最终设计静态审计，不激活实现、不运行目标测试、不生成真实evidence。

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_plan_version = v1.0
current_document = 07-实施计划.md
current_step = Step 17 final design static audit
flow_status = final_design_closure_in_progress
completed_dc_tasks = DC-00|DC-01|DC-02|DC-03|DC-04|DC-05
current_dc_task = DC-06
step_16_status = completed_design_static_only
implementation_ledger_sync = completed
affected_boundary_sync = 6/6
boundary_reverse_scan = 32/32
current_boundary = CB-SBX-01A
current_boundary_status = blocked|activation_gate|handoff
implementation_started = no
real_commit_count = 0
real_run_count = 0
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
next_allowed_action = DC-06_run_final_design_static_audit
commit_required = no
```

## PHYSICAL EOF Current Override: final design closure calibration (`DC-03`)

Step 14 已完成未决项裁决，Step 15 已固定 Rust/core、RFC 8785 与 Shell/lint 技术基线。本 flow 现授权 Step 13
对正式 `07` 做 post-closeout 汇总，并在其后同步 implementation ledger 与 32 件 Boundary；不得激活任务或制造运行事实。

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_plan_version = v1.0
current_document = 07-实施计划.md
current_step = Step 15 completed; Step 13 post-closeout reassembly authorized
flow_status = final_design_closure_in_progress
completed_dc_tasks = DC-00|DC-01|DC-02|DC-03
current_dc_task = DC-04
implementation_started = no
real_commit_count = 0
real_run_count = 0
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
next_allowed_action = DC-04_backfill_formal_00_through_07_in_order
commit_required = no
```

## PHYSICAL EOF Current Override: Step 17 `DC-06` audit current

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_plan_version = v1.0
current_document = 07-实施计划.md
current_step = Step 17 final design static audit
flow_status = final_design_static_audit_in_progress
completed_dc_tasks = DC-00|DC-01|DC-02|DC-03|DC-04|DC-05
current_dc_task = DC-06
step_16_status = completed_design_static_only
current_boundary = CB-SBX-01A
current_boundary_status = blocked|activation_gate|handoff
implementation_started = no
real_commit_count = 0
real_run_count = 0
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
next_allowed_action = repair_formal_03_06_current_status_then_complete_DC-06_audit
commit_required = no
```

## PHYSICAL EOF Current Override: Step 17 completed, Step 18 current (`DC-07`)

Step 17 已完成 8 件正式文档、8 件 flow、8 件 assembly、两级 ledger 与 32 件 planned Boundary 的最终静态审计。
当前唯一设计任务切换为 Step 18，只记录 baseline 发布处置；未经明确提交授权，不执行 Git staging 或 commit。

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_plan_version = v1.0
current_document = 07-实施计划.md
current_step = Step 18 baseline publication disposition
flow_status = baseline_publication_disposition_current
completed_dc_tasks = DC-00|DC-01|DC-02|DC-03|DC-04|DC-05|DC-06
current_dc_task = DC-07
step_17_status = completed_design_static_only
design_conclusion = design_closed_ready_for_baseline_publication
design_baseline = not_fixed
commit_authorization = absent
current_boundary = CB-SBX-01A
current_boundary_status = blocked|activation_gate|handoff
implementation_started = no
real_commit_count = 0
real_run_count = 0
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
next_allowed_action = DC-07_record_baseline_publication_disposition
commit_required = no
```

## PHYSICAL EOF Current Override: Step 18 completed, design flow closed (`DC-07`)

Step 18 已完成 baseline 发布处置：由于没有明确 commit 授权，本轮没有执行 Git staging / commit，baseline 未发布。
设计文档闭环任务已全部完成并停审；未来只有收到明确提交授权时，才允许把发布作为新的恢复事件进入 Commit Gate。

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_plan_version = v1.0
current_document = 07-实施计划.md
current_step = Step 18 baseline publication disposition completed
flow_status = completed_design_static_only_without_publication
completed_dc_tasks = DC-00|DC-01|DC-02|DC-03|DC-04|DC-05|DC-06|DC-07
current_dc_task = none
step_17_status = completed_design_static_only
step_18_status = completed_design_static_only_without_publication
design_conclusion = design_closed_ready_for_baseline_publication
design_baseline = not_fixed
baseline_publication_disposition = completed_without_publication
baseline_publication_status = not_published
baseline_blocker_status = open_wait_explicit_commit_authorization
commit_authorization = absent
current_boundary = CB-SBX-01A
current_boundary_status = blocked|activation_gate|handoff
implementation_started = no
real_commit_count = 0
real_run_count = 0
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
next_allowed_action = wait_explicit_commit_authorization
commit_required = no
```
