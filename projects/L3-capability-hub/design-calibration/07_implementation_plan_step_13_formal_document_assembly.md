# L3-capability-hub 07 实施计划 Step 13：正式文档装配

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 13
> 书写规范: `standards/document/实施计划书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 台账规范: `standards/document/代码实施台账与门禁规范.md`
> 目标正式文档: `projects/L3-capability-hub/07-实施计划.md`
> 创建日期: 2026-07-26
> 当前模式: full-restart / continuous execution

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 整理正式实施计划文档 |
| 当前状态 | completed_design_task_wait_implementation_handoff |
| 输入基线 | Step 1~12 全部completed；active formal `00~06` |
| 正式 `07` 装配方式 | 先完成本中间产物，再按100~300行批次创建正式文档 |
| implementation handoff | 正式07完成后已执行T068/T069，project ledger与26 skeleton已创建 |
| implementation facts | target repo/commit/run/artifact/report/verdict/signoff均不存在 |
| unresolved upstream blocker | `0` |
| 下一动作 | `wait_for_authorized_implementation_handoff`；implementation ledger 与 26 个 boundary skeleton 已由 T068/T069 创建 |

## 2. 本步输入与 SOP 问题回答

| 输入 | 状态 | 正式回填用途 |
|---|---|---|
| Step 1 input boundary | completed | §1 authority、historical material、truthfulness |
| Step 2 scope | completed | §2 P0/P1/P2、non-scope、责任红线 |
| Step 3 prerequisites | completed | §3 repo/naming/dependency/reading/ledger/memory seeds |
| Step 4 deliverables | completed | §4 seven members、objects/protocol/config/test/evidence/ledger |
| Step 5 phases | completed | §5 `PH-01..11`及依赖 |
| Step 6 tasks/boundaries | completed | §6 26 boundary、batch、scope、closure、timing |
| Step 7 gates | completed | §7 10 suite/5 gate/9 check/4 builder、phase/boundary gate |
| Step 8 readiness | completed | §8 profiles/entries/modules/bindings/dependencies |
| Step 9 risks | completed | §9 8 Spike、16 canonical risks、12 OQ、reopen/debt |
| Step 10 controls | completed | §10 pause/rollback/change/recovery |
| Step 11 discipline | completed | §11 26 title/body/review/handoff、language/footer |
| Step 12 completion | completed | §12 completion predicate、evidence、non-completion |

本步回答：

1. **正式章节是否完整？** 使用书写规范规定的13章，不增加营销式概述，不删除提交、完成或参考章节。
2. **每章是否有明确来源？** §1~§12逐章回指唯一Step文件；§13回指本装配中间产物和真实读取标准。
3. **编号是否稳定？** 保留`PH-01..11`、`commit-01-a..11-b`、`GATE-01..09`、`SP-CH-001..008`、`CH-TEST-R01..R16`、`OQ-CH-001..012`、`PAUSE-CH-01..10`和`RB-CH-01..09`。
4. **上游引用是否准确？** formal03是落码authority，04是配置authority，05是test/evidence authority，06是acceptance/VETO/final-decision authority；07不复制或改写其schema。
5. **是否复制详细设计？** 正式07只保留inventory、source pointer、implementation order、boundary/gate和完成条件，不复制250 type、110 method或83 flow的完整定义。
6. **是否有可落码复核？** §6保留通用closure matrix和26 boundary表；§12保留11 phase/26 boundary交付实现前审计。
7. **是否包含永久记忆种子？** §3保留`MEM-CH-001..008`摘要、生成门禁和冲突处理。
8. **是否存在空表/占位？** 禁止空表；`<run_id>`仅为真实运行期变量，`future/not_started/not_evaluated`是明确状态而非待填占位。
9. **是否满足planned skeleton规则？** §3/§6/§11/§12明确正式07完成后预创建26个boundary ledger；未来boundary不得标pass或提前授权。

## 3. 当前问题诊断与装配取舍

### 3.1 问题诊断

| 问题 | 风险 | 装配处理 |
|---|---|---|
| Step 1~12总量大 | 过度压缩后实现agent仍需反复问设计 | 保留11 phase、26 boundary、gate/readiness/risk/control/commit/completion核心表 |
| 详细设计inventory很大 | 全量复制会形成第二真相源 | 只列count、owner和exact source指针 |
| boundary gate表非常宽 | formal07不可读或过长 | §6保留scope/timing/check摘要；exact selector/command回指Step7 |
| target repo不存在 | 正式状态易被误写成已准备 | 文档元信息、§1/§3/§8/§12均写not established |
| README与active baseline冲突 | 实现者可能回读旧职责 | §1/§2明确README historical；T070已重写 |
| evidence path有单点旧称 | 正式07可能继承alias | 只使用canonical`evidence-index.md/.json`；T071已清债 |

### 3.2 装配取舍

| 方案 | 结论 | 原因 |
|---|---|---|
| 正式文档只写一页摘要 | 不采用 | 不能直接执行或生成boundary skeleton |
| 把Step文件逐字合并 | 不采用 | 重复讨论过程且掩盖authority |
| 保留执行必需表并回指exact Step | 采用 | 可读、可审计、可落码 |
| formal07完成后等待实现agent再要ledger | 禁止 | 违反planned boundary预创建规则 |
| formal07后立即创建project ledger和26 skeleton | 采用 | T068/T069已连续完成移交 |

## 4. 正式章节来源与不可压缩内容

| 正式章节 | Calibration source | 不可压缩内容 |
|---|---|---|
| §1 | `07_implementation_plan_step_01_input_boundary.md` | authority顺序、historical material、target repo/status truth |
| §2 | `07_implementation_plan_step_02_scope.md` | P0 IDs、七类non-scope、P1/P2隔离 |
| §3 | `07_implementation_plan_step_03_prerequisites_reading.md` | repo/naming、唯一dependency、reading matrix、ledger、MEM-CH-001..008 |
| §4 | `07_implementation_plan_step_04_objects_deliverables.md` | seven members、protocol counts、test/evidence/ledger deliverables |
| §5 | `07_implementation_plan_step_05_phases_dependencies.md` | 11 phase顺序、输入/输出/门禁/non-scope |
| §6 | `07_implementation_plan_step_06_tasks_commit_boundaries.md` | write order、closure matrix、26 boundary目标/scope/timing |
| §7 | `07_implementation_plan_step_07_tests_acceptance_gates.md` | canonical topology、phase gates、boundary gate source、truthfulness |
| §8 | `07_implementation_plan_step_08_config_environment_dependencies.md` | 3 profile/entry、18/27/21、27+9 Port、6 source、10 route、readiness |
| §9 | `07_implementation_plan_step_09_spikes_risks_open_questions.md` | 8 Spike、16 risk disposition、12 OQ/deadline、debt/reopen |
| §10 | `07_implementation_plan_step_10_rollback_pause_change_control.md` | state machine、10 pause、9 rollback、authority routing、recovery |
| §11 | `07_implementation_plan_step_11_commit_review_delivery.md` | dual-language、26 planned title/group、Commit/Handoff、artifact delivery |
| §12 | `07_implementation_plan_step_12_completion_criteria.md` | total predicate、26/11 closure、189/638/83、37/13/23、current status |
| §13 | 本文件 | active formal、calibration、standards、historical rule |

## 5. 正式文档装配批次

| 批次 | 写入范围 | 预计规模 | 完成检查 |
|---|---|---:|---|
| A | 标题、元信息、§1~§3 | 180~260行 | authority/repo/dependency/reading/memory |
| B | §4~§5 | 120~200行 | deliverable counts、11 phase/order |
| C | §6 | 180~260行 | 26/26 boundary、closure、batch/timing |
| D | §7~§8 | 180~260行 | 10/5/9/4、phase gates、config/readiness |
| E | §9~§10 | 180~260行 | 8/16/12、10 pause、9 rollback/change |
| F | §11~§13 | 180~260行 | 26 message groups、completion、references |

每批完成后运行heading、ID、路径、责任红线和truthfulness检查；正式文档全部完成后再运行跨文档审计。

## 6. 正式文档评审清单

| 审查项 | 通过条件 |
|---|---|
| 章节 | 13/13存在且顺序正确 |
| source blocks | §1~§12均指向对应Step文件 |
| phase | `PH-01..11`唯一且顺序一致 |
| boundary | 26/26且与Step6/7/11完全一致 |
| gate | GATE-01~09、10 suite、5 gate script、9 check、4 builder一致 |
| denominator | 189 TC/DS/EV、638 pair、83 flow、37 AC/13 VF/23 VETO一致 |
| config | 18/27/21、3 profiles、3 entries、27 local/base + 9 external一致 |
| responsibility | runtime/tools/approval/body/marketplace/provider/SDK client/backend均排除 |
| Rustdoc | public declaration/struct field/enum variant/payload/trait/method/callable英文`///`门禁存在 |
| truthfulness | target repo/commit/run/evidence/verdict/signoff不伪造 |
| evidence path | 只使用`evidence-index.md/.json`，无alias/latest |
| completion | 当前明确`implementation_incomplete / not_started` |
| skeleton handoff | project ledger + 26 planned skeleton路径/规则明确 |

## 7. Implementation handoff assembly contract

正式07通过评审后，设计交付必须继续完成 implementation handoff artifacts；T068/T069 已完成，T070/T071/T072 已完成最终收口。以下规则仍是移交和实现阶段的有效约束：

1. `design-calibration/implementation_execution_ledger.md` 已创建；它记录实现移交前的真实性状态，不授权落码。
2. 项目级 current boundary 固定为 `commit-01-a`，当前状态为 `blocked`，next action=`wait_design`；design baseline 不得伪造 commit hash，必须保持 `not_fixed_until_handoff`。
3. `implementation-boundaries/commit-01-a.md` 至 `commit-11-b.md` 共 26 个文件已预创建。
4. `commit-01-a` 当前为 `blocked / wait_design`，不授权落码；target repo/baseline preflight 未闭合前不得切换为 `implement` 或 `commit`。
5. 所有future boundary状态=`planned`，next action=`wait_until_current`，Gate均不得标pass。
6. skeleton必须继承required reads、allowed/forbidden scope、batches、显式 Exact Step 7 Gate Contract、checks、planned message/body groups、rollback/pause和Handoff Gate。

设计仓当前未固定可复现commit baseline且用户禁止提交，因此ledger不能伪造hash。实现移交前若规范要求hash，项目台账必须保持baseline prerequisite blocked，并由后续真实提交/用户授权流程填入；不能用当前dirty HEAD冒充完整设计baseline。

## 8. 剩余风险与待确认事项

| 事项 | 当前状态 | 装配处置 |
|---|---|---|
| target implementation repo | absent | §1/§3/§8/§12写implementation prerequisite |
| design immutable baseline | not fixed | ledger保持pending/blocked，不造hash |
| external/durable/TLS products | unselected | §8/§9写selected prerequisite |
| reviewer/acceptor/signatory | unassigned | §9/§11/§12保持not_decided |
| evidence path debt | resolved at T071 | formal07、formal05和Step9统一使用canonical `evidence-index.md/.json`；旧文件名仅为historical typo |
| README contamination | resolved at T070 | §1/§2声明historical，README已重建为active authority导航 |

## 9. 装配结论

| 条件 | 结果 |
|---|---|
| Step 1~12来源完整 | pass |
| 13章结构和不可压缩内容明确 | pass |
| 分批装配与评审清单明确 | pass |
| implementation ledger/skeleton后续门禁明确 | pass |
| 无upstream design blocker | pass |
| 可创建正式`07-实施计划.md` | yes；已完成 |

## 10. 正式装配与静态审计结果

正式`07-实施计划.md`已按A~F六个批次完成装配，共13章。静态审计结果如下：

| 审计项 | 结果 | 说明 |
|---|---|---|
| heading/order | `13/13 pass` | §1~§13存在且顺序唯一 |
| phase identity | `11/11 pass` | `PH-01..PH-11`均存在，未出现平行phase identity |
| boundary identity | `26/26 pass` | `commit-01-a..commit-11-b`全部存在，与Steps 6/7/11一致 |
| risk/control identity | `8/16/12/10/9 pass` | Spike/risk/OQ/pause/rollback编号完整 |
| gate/denominator | pass | 10 suites、5 gate scripts、9 checks、4 builders、189/638/83和37/13/23口径一致 |
| config/readiness | pass | 18/27/21、3 profiles、3 entries、27 local/base + 9 external、6/10/8 inventory一致 |
| evidence path | pass | canonical仅为`evidence-index.md/.json`；旧文件名只以禁止alias的historical typo出现 |
| responsibility | pass | runtime/tools/approval/body/marketplace/provider/SDK client/backend均保持排除 |
| Rustdoc | pass-designed | public declaration、struct field、enum variant/payload、trait/method/callable完整英文`///`在boundary、Commit和completion层均为blocking gate |
| truthfulness | pass | target repo/baseline/commit/run/artifact/report/evidence/review/verdict/signoff均明确不存在或未来执行 |
| current implementation conclusion | pass | 固定为`implementation_incomplete / not_started` |

本审计是设计文档的静态装配审计，不是实现编译、测试运行、evidence审核或验收签署。`CH-DOC-EVIDENCE-INDEX-PATH-001`已在T071完成formal `05`和Step 9回写；不创建旧文件名alias。

## 11. Step 13 完成记录

| 项目 | 状态 |
|---|---|
| Step 13 | completed_continuous_execution |
| formal `07` | active design authority，13/13章节 |
| implementation handoff prerequisites | formal plan、project ledger与26 skeleton complete；real repository/baseline remain blocked prerequisites |
| implementation facts | none |
| unresolved upstream blocker | `0` |
| next task | `wait_for_authorized_implementation_handoff` |
| commit required | no |

## 12. T071/T072 收口记录

| 任务 | 状态 | 产物/结论 |
|---|---|---|
| T070 | completed | README 已重建为 active formal 导航，历史职责冲突已隔离。 |
| T071 | completed | `T071_full_restart_final_audit.md` 已完成 formal、flow、Step、ledger、skeleton、责任、Rustdoc、evidence provenance 和真实性审计。 |
| T072 | completed | project ledger 与 `/tmp` remaining-task ledger 已切换到完成快照；设计任务关闭，等待授权实现移交。 |

T071/T072 的完成不改变实现台账事实：目标实现仓未建立、immutable design baseline 未冻结、`commit-01-a` 仍为 `blocked / wait_design`，没有实现 commit、run、artifact、report、evidence、verdict、risk acceptance 或 signoff。
