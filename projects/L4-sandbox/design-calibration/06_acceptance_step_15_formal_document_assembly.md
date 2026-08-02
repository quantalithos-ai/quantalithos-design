# L4-sandbox 验收标准 Step 15 正式文档装配

> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 15
> 书写规范: `standards/document/验收标准书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md` §5.10
> 回填目标: `projects/L4-sandbox/06-验收标准.md`全文
> 创建日期: 2026-07-15
> 状态: completed_current_closeout_v7.9
> 当前成熟度: design_assembly_reviewed;验收过程仍为`NotEntered`,没有runtime evidence、验收结论、风险接受、授权或签署
> 配套分件: `06_acceptance_step_15_cross_gate_audit.md`

---

## 1. Step状态与三层写入门禁

| 门禁层 | 检查结果 | 裁决 |
|---|---|---|
| 项目级台账 | `project_execution_ledger.md`恢复点为`06 / Step 15 / in_progress`,明确允许装配正式`06`且禁止进入`07`。 | passed_for_step_15 |
| 文档级flow | `06_acceptance_calibration_flow.md`中Step 1~14均已审查通过,Step 15为唯一进行中Step。 | passed_for_step_15 |
| Step级输入 | Step 14主件与分件均为`completed_reviewed_passed_to_step_15`;Step 5~11门禁、evidence和VETO均完成停审。 | passed_for_assembly |
| 正式文档写入 | 只允许从已确认Step 1~14装配15章;不得把本Step审计汇总升格为新需求或设计契约。 | allowed_in_controlled_batches |
| 下游写入 | 正式`07`、implementation ledger和planned boundary skeleton尚未进入其自身流程。 | forbidden_in_this_step |

当前Step恢复点:

```text
current_document = `06-验收标准.md`
current_step = Step 15 `整理正式验收标准文档`
current_module = `formal_document_reviewed`
gate_status = passed_to_07
next_allowed_action = 本Step已收口;由`07` Step 1接续
```

---

## 2. 本步目标与职责边界

本Step必须完成:

1. 使用书写规范固定的15章主链full-restart重建正式`06-验收标准.md`。
2. 每章在正文前引用具体校准主件 /分件,并给出针对性的延伸阅读入口。
3. 保留可裁决粒度:每个P0门禁能够回指正式设计契约、TC、planned ESLOT、未来runtime EV / fixed report、通过条件、失败条件和裁决影响。
4. 保持Step 1~14已确认的scope、baseline、状态、路径、数量、VETO、风险和三值结论语义不变。
5. 形成跨门禁裁决总审计和中间产物规范§5.10十类一致性审计,且不得遗留unresolved冲突。
6. 完成Markdown、ID、路径、命名、数量、历史污染和伪事实机械审计。

本Step不得完成:

- 不运行测试,不创建raw artifact、runtime EV alias、报告实例、缺陷实例或验收packet。
- 不填写真实commit、build、image、`run_id`、digest、review version、principal、日期、裁决、授权或签署。
- 不把planned ESLOT / EHR、acceptance draft或空模板描述成有效证据。
- 不把当前`NotEntered`误写成“不通过”,也不预填三值结论。
- 不重新定义`00~05`的字段、对象、状态、错误、协议、配置、TC、suite、gate或schema。
- 不进入`07`,不创建implementation ledger或planned boundary skeleton。

---

## 3. 输入读取与权威顺序

| 输入 | 状态 | 本Step用途 | 冲突口径 |
|---|---|---|---|
| 验收SOP Step 15 | current standard | 固定输出、自审、总审计和停审要求 | 过程要求以SOP为准 |
| 验收书写规范全篇 | current standard | 固定15章、三值、证据路径和章节必备表 | 正文结构以书写规范为准 |
| 中间产物规范§5.10 | current standard | 固定十类跨文档审计产物 | 十类不得删减 |
| Step 1~4主件 /分件 | completed_reviewed | 装配§1~§4 | 不在Step 15重开已确认口径 |
| Step 5~11主件 /追溯 /停审分件 | completed_reviewed | 装配§5~§11并执行P0 / evidence / VETO总审计 | 单项细节以对应register为准 |
| Step 12~14主件 /停审分件 | completed_reviewed | 装配§12~§14和结论传播 | 不把候选或模板写成实例事实 |
| 正式`00~05` | current reviewed baseline | 校验名称、数量、路径和上游契约 | 发现冲突即暂停相关装配并回写owner文档 |
| L1-governance / L1-artifact Step 15 | granularity reference | 参考章节映射、自审和停审结构 | 不继承其领域ID、风险等级或结论 |
| 旧正式`06` | historical_material | 仅用于污染扫描和改动前后对照 | 不得继承正文 |

---

## 4. Historical material排除清单

旧正式`06`重建前SHA-256为`003d98327b927ba4c776f71d7f9a8d08d3b04dbb20603e7a504ce67baff3c476`。以下内容只允许出现在明确的historical排除说明或审计记录中:

| 旧内容 | 排除原因 | 当前替代来源 |
|---|---|---|
| `SandboxExecution / SandboxSession / SandboxCommand / SandboxOutput / Control`五段旧主线 | 与当前六组件、七模块、execution environment identity和coherent boundary主线不一致 | 正式`00~03`;Step 2 /5~8 |
| 旧十章结构 | 不满足当前15章验收标准主链 | 验收书写规范§3 |
| “API响应 / DB记录 / trace / compare report”等泛化证据 | 无TC、slot、runtime EV生成条件和fixed report定位 | Step 5~10 |
| 未授权路径 /网络“0”、回收率 /留痕率“100%样本链”、无来源性能阈值 | 混合正式零容忍、样本结果和无来源数字 | Step 9阈值分件 |
| 空checkbox、`[待评审结论]`和姓名占位 | 会污染当前`NotEntered`事实并诱导伪签署 | Step 4 /14 |
| “A视情况”“B可带着走”和静态遗留项接受人 | 不符合S / A / B闭集与资格化风险接受 | Step 12 /13 |
| runtime、tools、provider、artifact或member语义进入Sandbox owner边界 | 混淆相邻仓语义与Sandbox运行隔离责任 | 正式`00/01`;Step 2 /6 /7 |

---

## 5. SOP问题预审回答

| SOP问题 | 装配前回答 | 最终验证位置 |
|---|---|---|
| 是否按15章主链组织 | 是;正式§1~§15顺序和名称与书写规范一致 | 本件§6;正式标题扫描 |
| 是否删除SOP问题原文 | 是;问题回答只留在本件,正式正文只保留裁决规则 | 正式全文扫描 |
| P0是否有通过 /失败 /证据 | Step 5~10已停审;正文必须保留闭环总表和稳定分件索引 | 跨门禁审计CG-01~CG-06 |
| VETO是否真实生效 | Step 11固定17项;任一Triggered必须总体不通过且不可风险接受 | 正式§11 /§13 /§14 |
| P0是否回指设计 / TC / evidence | 已由Step 5~10建立;正文不得降格为“见报告” | 跨门禁审计CG-02 |
| 正式名称是否一致 | 以正式`03~05`及已回写校准源为准 | §5.10名称 /状态 /协议审计 |
| 风险是否有authority与动作 | 仅未来有效`Accepted`记录可满足;当前没有实际接受 | 正式§13 |
| Step 5~11是否全部停审 | 是,对应主件 /分件均已审查通过 | 本件§1;总审计输入栏 |
| 是否存在孤儿 /重复 /路径冲突 /越权 | 15.8审计未发现unresolved项;一处Step 15风险状态名漂移已按Step 13 owner修正并登记 | 配套审计分件最终结论 |

---

## 6. 正式章节到校准来源映射

| 正式章节 | 主来源 | 必须联合引用的分件 /跨章来源 | 正文必须保留 |
|---|---|---|---|
| §1 与上游文档的关系声明 | `06_acceptance_step_01_input_boundary.md` | Step 15本件 | 权威输入、回答 /不回答、证据成熟度、historical / blocker原则 |
| §2 验收目标与范围 | `06_acceptance_step_02_scope.md` | Step 1 | AG-SBX-01~11、ASCP-SBX-001~024、P0-C / P0-Q、P1 / P2、接缝 /非范围 |
| §3 验收基线 | `06_acceptance_step_03_baseline.md` | `06_acceptance_step_03_baseline_register.md` | ABSL-SBX-001~040、四source run、fixed路径、FormalEntryReady / DecisionPacketComplete |
| §4 进入条件与退出条件 | `06_acceptance_step_04_entry_exit.md` | `06_acceptance_step_04_entry_pause_resume_register.md`;Step 14 | AENT、APAUSE、AEXT、normal / terminal双路径、当前NotEntered |
| §5 功能验收门禁 | `06_acceptance_step_05_function_gate.md` | function trace / review register | AC-SBX-006~023逐项闭环与18项停审 |
| §6 数据边界与架构红线验收 | `06_acceptance_step_06_data_arch_redlines.md` | data arch trace / review register | RL-SBX-001~016、AC-SBX-026~035、ARCH / PROTOCOL双slice |
| §7 接口、事件与跨仓同步验收 | `06_acceptance_step_07_interfaces_events_sync.md` | protocol trace / sync review register | PG-SBX-001~055、SYNC-SBX-001~014、ISA-SBX-001~034、下游未就绪边界 |
| §8 状态机、事务与一致性验收 | `06_acceptance_step_08_state_tx_consistency.md` | state transition / transaction race register | 31 canonical enum entry /30 owner-level machine /39 shared declaration、14事务 /重放、19 race、64项检查、no-write / no-repair |
| §9 非功能验收门禁 | `06_acceptance_step_09_nonfunctional.md` | NFR gate / threshold review register | AC-SBX-036~041、36逐维门禁、20阈值 /成熟度、P0-Q边界 |
| §10 可观测性、审计与证据门禁 | `06_acceptance_step_10_observability_evidence.md` | evidence traceability / report handoff register | 21 ESLOT、九schema、fixed source / report、raw pairing、review / handoff |
| §11 一票否决项 | `06_acceptance_step_11_veto.md` | veto traceability / review register | VETO-SBX-001~017、五值disposition、不可风险接受 |
| §12 缺陷分级、复验与放行规则 | `06_acceptance_step_12_defects_retest_release.md` | defect retest review register | S / A / B、DTR / DRT / DCL / DRL、L-R1~L-R5、证据失效 |
| §13 风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` | risk review register | RAQ-SBX-001~016、RR-SBX-001~008、七状态、authority / expiry /同步 |
| §14 最终结论与签署 | `06_acceptance_step_14_final_decision_signoff.md` | final decision review register | FDQ、AEXT消费、九维、三值、双授权、5必签 +2条件角色 |
| §15 参考 | Step 1~15 | 正式`00~05`、标准、全部验收校准主件 /分件 | 权威文档、证据入口、下游边界和当前成熟度声明 |

---

## 7. 受控装配批次

| 批次 | 写入范围 | 状态 | 批次门禁 |
|---|---|---|---|
| 15.1 | 本件 +跨门禁审计分件 | done | 来源映射、historical排除、十类审计和冲突门禁已先于正式文档存在 |
| 15.2 | 正式元信息、§1~§4 | done | 输入、scope、40基线、进入 /暂停 /退出和NotEntered事实完整 |
| 15.3 | 正式§5~§6 | done | 18功能AC、16红线 /10 canonical AC、TC / slot / report /裁决闭环 |
| 15.4 | 正式§7~§8 | done | 55协议、14同步、34审计、31 canonical enum entry /30 owner-level machine、14事务、19 race无缺口 |
| 15.5 | 正式§9~§10 | done | 6 canonical NFR、36门禁、20阈值、21 slot、九schema和fixed report完整 |
| 15.6 | 正式§11~§12 | done | 17 VETO、三等级、复验 /关闭 /放行传播无弱化 |
| 15.7 | 正式§13~§15 | done | 风险资格、8 RR、三值 /双授权 /签署、参考和事实边界完整 |
| 15.8 | 全文 / §5.10 /机械审计 | done | 0 unresolved;集合、路径、旧名、checkbox、伪事实、表格和diff检查通过 |

单批写入以100~300行为建议范围;批次是恢复和审查单位,不是压缩正式文档的理由。每批完成后更新本表和配套审计,最后统一更新flow /项目台账。

---

## 8. 跨门禁裁决审计闭集

| 审计ID | 起点 | 必须闭合到 | 失败处理 |
|---|---|---|---|
| CG-SBX-01 | scope / baseline | P0-C / P0-Q适用性、fixed RELEASE和四source run | 缺失则NotEntered / Blocked,不得生成结论 |
| CG-SBX-02 | 设计契约 / canonical AC | TC -> planned ESLOT -> future runtime EV -> fixed report | 任一断裂暂停装配并回写owner Step |
| CG-SBX-03 | 55 protocol / 31 canonical state entry /30 owner-level machine /39 shared declaration /38 error | 对应TC、evidence family、验收slice | 数量 /名称差异为unresolved conflict |
| CG-SBX-04 | evidence identity / schema | raw-report pairing、checks、RELEASE aggregation、review | missing / invalidated不得映射Passed |
| CG-SBX-05 | 17 VETO | checklist disposition -> S缺陷 -> overall不通过 | 不得由风险、签署或条件窗口覆盖 |
| CG-SBX-06 | 缺陷 /风险 | retest / closure -> Accepted资格 / expiry -> final decision ceiling | S / A / P0 / VETO不得进入Accepted |
| CG-SBX-07 | AEXT / FDQ | 九维 ->唯一三值 -> effect state ->双授权 -> signoff | 未完成时结论必须absent_not_adjudicated |
| CG-SBX-08 | 正式15章 | 具体来源、延伸阅读、稳定索引、无过程污染 | 任一章缺来源不得完成Step 15 |

完整逐项结果记录在`06_acceptance_step_15_cross_gate_audit.md`。

---

## 9. 正式文档写法取舍

| 议题 | 采用口径 | 未采用口径 | 理由 |
|---|---|---|---|
| 正文粒度 | 裁决总表 +稳定主件 /分件索引 | 复制全部九千余行过程材料;或只写短摘要 | 保持可落码 /可执行且避免双写真相源 |
| P0呈现 | canonical AC逐项保留完整小循环;大闭集按family / range索引 | “全部P0通过”泛化句 | 可反查设计、TC和证据 |
| evidence成熟度 | 明确planned ESLOT、future runtime EV、fixed report消费条件 | 给planned slot分配真实EV alias | 防止伪造执行事实 |
| 当前状态 | `NotEntered` + `absent_not_adjudicated` | 空checkbox、Draft结论或“不通过” | 区分未进入与已裁决失败 |
| 旧正式文件 | full-restart整体替换 | 在旧十章上局部追加 | 旧主线和证据污染面过大 |
| 下游边界 | 只提供`07`可消费的验收设计输入 | 提前生成implementation boundary | 遵守逐正式文档停审规则 |

---

## 10. Step 15完成门禁

以下条件已全部满足,且用户已完成文档审查,所以本Step标记为`completed_reviewed_passed_to_07`:

1. 正式`06`完整使用15章主链,每章有具体校准来源和有针对性的延伸阅读。
2. Step 5~11中的P0验收项、evidence和VETO在正式正文中可稳定反查,无停审降级。
3. 配套分件完成§5.10十类一致性审计和CG-SBX-01~08总审计,无unresolved冲突。
4. 55协议、31个canonical状态enum entry /30个owner-level machine /39个shared declaration、38 typed error、21 ESLOT、九schema、17 VETO等闭集与上游一致。
5. 只使用`reports/runs/<run_id>/gate-results.md`和固定acceptance / review入口,不存在第二同义路径。
6. 没有旧对象主线、空checkbox、旧阈值、模糊证据、风险越权或签署占位污染。
7. 没有伪造commit、`run_id`、runtime EV、测试结果、缺陷、风险接受、结论、授权或签署。
8. `git diff --check`和Markdown表格结构检查通过。
9. flow与项目台账已记录用户确认;设计文档流程放行到`07` Step 1,但未改写任何runtime事实。

审查确认后,本Step不再作为项目恢复点。`07`必须继续遵守自身Step 1~13流程;本确认不允许跳步创建正式`07`、implementation ledger或planned boundary skeleton。

```text
current_document = `06-验收标准.md`
current_step = Step 15 `整理正式验收标准文档`
current_module = `formal_document_reviewed`
gate_status = passed_to_07
formal_document_status = completed_reviewed_for_07_start
process_state = NotEntered
final_decision = absent_not_adjudicated
next_allowed_action = 由`07_implementation_plan_step_01_input_boundary.md`接续
implementation_ledger_created = no
planned_boundary_skeleton_created = no
commit_required = no
```

## 12. Final Activation propagation audit (`DC-03`)

新增 `TOOLCHAIN/CANONICAL/SHELL-VERIFY` 只细化既有实现与测试准入，不新增验收 check、evidence slot 或裁决状态。
任一 required verification 未真实通过时，验收保持 `NotEntered`，不得生成 alias 或签署。正式 `06` 仅需 current
disposition，不重开 64 checks 与 17 VETO。

```text
assembly_disposition = audit_only_no_acceptance_schema_delta
acceptance_status = NotEntered
real_evidence_created = no
next_allowed_action = record_formal_06_audit_disposition_then_continue
```

## 13. DC-06 current-truth audit repair authorization

允许把正式§15.5的唯一current Boundary路由从历史`blocked / wait_design`更新为
`blocked / activation_gate / handoff`。验收process仍`NotEntered`，不修改check、VETO、算法、authority或签署。

```text
assembly_authorization = DC-06_formal_06_current_boundary_route_only
acceptance_schema_changed = no
acceptance_status = NotEntered
next_allowed_action = update_formal_06_current_boundary_route
```

## 11. Current closeout override (`v7.9-closeout`)

本节覆盖前述 `07`、implementation ledger 和 skeleton 尚未进入自身流程的历史装配快照。current 验收设计已完成下游
传播；实际验收仍未进入，任何 planned ESLOT、路径或报告 schema 都不构成 runtime evidence 或裁决。

```text
current_document = 06-验收标准.md
current_step = Step 15 current acceptance design closeout completed
design_chain_status = completed_current_closeout
process_state = NotEntered
final_decision = absent_not_adjudicated
implementation_ledger_created = yes_32_boundary_package_by_07_step_13
planned_boundary_skeleton_created = yes_32_of_32
real_acceptance_execution = not_started
real_test_execution = not_started
real_evidence_created = no
risk_acceptance_created = no
acceptance_signoff = no
next_allowed_action = fixed_design_baseline_then_close_01A_activation_prerequisites
commit_required = no
```

## 14. PHYSICAL EOF DC-06 final audit disposition

前述授权已被正式 `06` 精确消费：§15.5 的 current Boundary 路由已更新为
`blocked / activation_gate / handoff`。64 checks、17 VETO、evidence authority、裁决算法与过程状态均未改变；验收仍为
`NotEntered`。

```text
dc_06_assembly_disposition = exact_formal_delta_completed
formal_06_delta = section_15_5_boundary_route
acceptance_schema_changed = no
acceptance_status = NotEntered
real_evidence_created = no
acceptance_signoff = no
design_audit_status = completed_design_static_only
```
