# L4-sandbox 02 概要设计全量重启校准流程

> 创建日期: 2026-07-08
> 状态: completed_current_closeout
> 最近定向回查: 2026-08-01 (`v7.9-closeout`)
> 当前模式: full-restart
> 设计仓: `/home/aris/Projects/quantalithos-design`
> 项目目录: `projects/L4-sandbox`
> 正式文档目标: `projects/L4-sandbox/02-概要设计.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 本轮口径: 新版 `00-需求文档.md` 和新版 `01-架构设计.md` 是当前概要设计直接上游;旧 `02-概要设计.md` 和旧 README 只作 historical material / 差异审计输入。DesignReopen关闭后仅按Step 13 /14 current disposition定向更新正向port索引与下游状态，不重开概要主体。

---

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 14 | `整理正式概要设计文档:completed_current_closeout` | pass | 原14章正式装配已审查；2026-08-01又按Step 13 §15和Step 14 §13完成定向current-source装配，只更新capture / handoff / relay正向port索引、material / relay outcome边界和下游文档状态。概要主体、职责、对象、flow与状态分层未重开，也未生成任何实现事实。 | 设计文档流程已收口；恢复时读取项目ledger、implementation ledger和正式`07`，实现仅可先固定design baseline并关闭01A Activation前置。 | `project_execution_ledger.md`;`implementation_execution_ledger.md`;`02_hld_step_13_risks_open_questions.md`;`02_hld_step_14_formal_document_assembly.md`;`projects/L4-sandbox/02-概要设计.md`;`projects/L4-sandbox/03-详细设计.md`;`projects/L4-sandbox/04-配置设计.md`;`projects/L4-sandbox/05-测试方案.md`;`projects/L4-sandbox/06-验收标准.md`;`projects/L4-sandbox/07-实施计划.md`;`07_implementation_plan_step_13_formal_document_assembly.md` |

---

## 2. 执行纪律

本流程只负责 `L4-sandbox` 的 `02-概要设计.md` full-restart。执行时必须按概要 SOP 一个 Step 一个 Step 推进。

固定纪律:

- 每次恢复先读取 `project_execution_ledger.md`,再读取本文档,再读取当前 Step 文件。
- 正式 `02-概要设计.md` 只在 Step 14 `整理正式概要设计文档` 时重建;Step 1~13 不改正式 `02`。
- 旧 `README.md`、旧 `02-概要设计.md`、旧 `03/05/06` 只能在当前 Step 独立结论形成后做差异审计,不得作为新版概要真相源直接继承。
- flow 可以一次列出 Step 1~14,但不得提前创建尚未到达的 Step 中间产物文件。
- 当前 Step 文件必须记录 Step 开工确认、Step 内计划、SOP 问题回答、旧材料诊断、取舍、结构化中间产物、回填草稿、待确认事项和自检。
- 每次用户确认只推进一个当前 Step;不得跨 Step 合并。
- Step 5~9 后续必须以主要组成部分为小循环主轴,先组件能力和边界,再对象、接口、处理流、状态,每个主要组成部分停审后再做跨部分审计。
- 概要阶段不得写完整 Rust struct、完整函数签名、DDL、协议 schema、event payload、配置 key、测试用例、实施 commit boundary、真实 ADR 编号、evidence alias、run_id 或验收签署。
- 对 `L4-sandbox` 必须持续闭合 execution environment identity、resource limits、filesystem / network / process boundary、tool/runtime launch policy、artifact capture、observability hooks、failure classification、cleanup / lease / reaper、security redlines。
- 不得把 tools semantic execution、runtime agent loop、member lifecycle orchestration、artifact truth、observability store 或 policy definition / approval / allowlist / capability truth 混进 sandbox。
- 单次写入以 100~300 行为宜;该限制只约束单次 patch / 写入批次,不限制 Step 文件或正式文档最终长度。

---

## 3. 稳定输入与处理口径

| 输入 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `projects/L4-sandbox/00-需求文档.md` | current_reviewed_baseline | 作为概要设计需求边界,承接受控执行隔离闭环、C-SBX-1~5、FR / BR / AC / VF、数据归属、接口依赖和 NFR 红线。 |
| `projects/L4-sandbox/01-架构设计.md` | current_architecture_baseline_reviewed_for_02_start | 作为概要设计架构边界,承接 execution isolation truth、核心 / 支撑子域、运行承载、依赖裁剪、数据所有权、通信方式、机制级选型和风险待确认。 |
| `design-calibration/00_req_step_01_*` ~ `00_req_step_17_*` | current_baseline_detail | 按需追溯需求结论来源,不得替代正式 `00`。 |
| `design-calibration/01_arch_step_01_*` ~ `01_arch_step_16_*` | current_baseline_detail | 按需追溯架构结论来源,不得替代正式 `01`。 |
| `projects/L4-sandbox/README.md` | historical_material | 只提供旧后端、目录、事件、安全和性能线索;不得继承 Docker/gVisor、SandboxService、旧事件或旧性能数字为当前结论。 |
| `projects/L4-sandbox/02-概要设计.md` | current_formal_baseline_v7.9 | 原14章已审查，并按Step 13 /14 current disposition定向更新正向port和下游状态。 |
| `projects/L4-sandbox/03-详细设计.md` | current_formal_detailed_design | 提供capture / handoff / relay publisher / ordinary hook current contract lock；不把详细字段反向复制进概要。 |
| `projects/L4-sandbox/04-配置设计.md` | current_formal_config_design | 已形成配置owner / binding / validator设计；不代表candidate或profile已qualified。 |
| `projects/L4-sandbox/05-测试方案.md` / `06-验收标准.md` | current_formal_test_acceptance_design | 已形成测试与验收设计；测试未运行，验收保持`NotEntered`。 |
| `projects/L4-sandbox/07-实施计划.md` | current_formal_implementation_design | 已形成正式计划、implementation ledger和32件planned skeleton；实现仍blocked。 |

---

## 4. Step 总任务表

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `02_hld_step_01_upstream_boundary.md` | 确认上游输入边界 | done | pass | Step 14 已完成;当前等待用户审查正式 `02`。 | 已明确承接需求 / 架构结论、稳定输入、未收稳输入、本文不再回答和必须回答的问题;未展开代码主体、对象、接口、流程或状态。 |
| 2 | `02_hld_step_02_goals_scope.md` | 明确本仓设计目标与当前范围 | done | pass | Step 14 已完成;当前等待用户审查正式 `02`。 | 设计目标、范围、非范围和当前深度收稳;未提前拆代码主体、对象、接口、flow 或状态。 |
| 3 | `02_hld_step_03_constraints.md` | 收稳约束条件 | done | pass | Step 14 已完成;当前等待用户审查正式 `02`。 | 影响结构判断的约束已收稳,不复述全量上游,不写实现策略、schema、配置项、测试或实施边界。 |
| 4 | `02_hld_step_04_code_subject_framework.md` | 代码主体框架映射 | done | pass | Step 14 已完成;当前等待用户审查正式 `02`。 | 架构语义已映射到代码主体骨架和实现分层,已输出两张 ASCII 图,不写目录路径。 |
| 5 | `02_hld_step_05_components_boundary.md` | 主要组成部分、职责与边界 | done | pass | Step 14 已完成;当前等待用户审查正式 `02`。 | 主要组成部分、capability、接缝、对象候选池和停审记录收稳。 |
| 6 | `02_hld_step_06_key_objects.md` | 关键对象轮廓 | done | pass | Step 14 已完成;当前等待用户审查正式 `02`。 | 关键对象从 Step 5 候选池正式化,字段 / 函数保持骨架层级。 |
| 7 | `02_hld_step_07_api_interface_skeleton.md` | API / 接口骨架 | done | pass | Step 14 已完成;当前等待用户审查正式 `02`。 | Command / Query / Inbound Event Consumer / Outbound Event / Operations Job / external port 分类和骨架收稳。 |
| 8 | `02_hld_step_08_processing_flows.md` | 关键处理流 / 重要函数数据流 | done | pass | Step 14 已完成;当前等待用户审查正式 `02`。 | 关键 flow 已连接入口、service、domain、port、event / handoff,并补齐通用路径、覆盖清单、关键图、停审记录和状态机反查清单。 |
| 9 | `02_hld_step_09_state_machine.md` | 状态定义与状态流转 | done | pass | Step 14 已完成;当前等待用户审查正式 `02`。 | 状态主语、状态集合、迁移方向、禁止迁移和传播关系已收稳。 |
| 10 | `02_hld_step_10_exceptions_boundaries.md` | 异常与边界场景轮廓 | done | pass | Step 14 已完成;当前等待用户审查正式 `02`。 | 会改变主线理解的异常、边界场景和失败语义收稳。 |
| 11 | `02_hld_step_11_configuration_impact.md` | 配置影响轮廓 | done | pass | Step 14 已完成;当前等待用户审查正式 `02`。 | 配置影响、禁止配置化边界和 03/04 承接方向收稳。 |
| 12 | `02_hld_step_12_detailed_design_handoff.md` | 详细设计承接清单 | done | pass | Step 14 已完成;当前等待用户审查正式 `02`。 | `03` 需要承接的对象、接口、flow、状态、配置和测试切口输入收稳。 |
| 13 | `02_hld_step_13_risks_open_questions.md` | 设计风险与待确认事项 | done | pass | Step 14 已完成;当前等待用户审查正式 `02`。 | 概要层风险、待确认、阻塞转换规则和后续文档缺口收稳。 |
| 14 | `02_hld_step_14_formal_document_assembly.md` | 整理正式概要设计文档 | done_reviewed_for_03_start | pass | 已移交 `03-详细设计.md` full-restart;当前恢复点以 `project_execution_ledger.md` 和 `03_ddd_calibration_flow.md` 为准。 | 正式 `02-概要设计.md` 已按 Step 1~13 结论和 14 章结构重建,每章带具体校准来源,无装配新增结论;用户已确认可进入 `03`。 |

---

## 5. 文档级 blocker 台账

| Blocker ID | Step | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| SBX-HLD-BOOT-001 | Step 1 | resolved_for_step_1 | L4-sandbox 缺当前重启状态下的 `02` 概要校准 flow。 | 本文件已创建。 |
| SBX-HLD-HIST-001 | Step 1 | contained_as_historical_material | 旧 `02-概要设计.md` 把“新人理解”、SandboxExecution、SandboxSession、SandboxCommand、SandboxPolicy、SandboxOutput、retry / replay、五段旧主线、旧量化指标和旧上下文图写成概要主线。 | Step 1 已记录为 historical material / pollution risk;后续 Step 4~9 重新推导代码主体、组成部分、对象、接口、flow 和状态。 |
| SBX-HLD-CONSTRAINT-001 | Step 3 | resolved_for_hld_step_3 | 旧 `02` / README 中技术约束、资源约束、旧后端、旧对象和旧指标容易回流为概要约束。 | Step 3 已按新版 `00/01` 提炼结构性约束,旧内容仅保留为 historical material / pollution risk。 |
| SBX-HLD-CODE-001 | Step 4 | resolved_for_hld_step_4 | 旧 README / 旧 `02` 的 `SandboxExecution`、`SandboxSession`、`SandboxCommand`、`SandboxPolicy`、`SandboxOutput`、`SandboxService`、Docker/gVisor、旧事件和旧目录容易回流为当前代码主体。 | Step 4 已改用新版架构主语映射代码主体骨架,旧对象、旧服务、旧后端和旧目录仅作为 historical material。 |
| SBX-HLD-COMPONENT-001 | Step 5 | resolved_for_hld_step_5 | 旧 README / 旧 `02` 的五段主线、旧对象词、旧后端产品和运维控制叙事容易回流为当前主要组成部分。 | Step 5 已改用六个业务主要组成部分承接 execution environment identity、coherent boundary、policy execution decision、capture / handoff、failure / cleanup / redline 和 read / derived support;旧对象、旧后端和旧目录仅作为 historical material。 |
| SBX-HLD-OBJECT-001 | Step 6 | resolved_for_hld_step_6 | 旧 `SandboxExecution`、`SandboxSession`、`SandboxCommand`、`SandboxPolicy`、`SandboxOutput` 和旧后端 / 目录线索容易回流为当前关键对象。 | Step 6 已从 Step 5 对象候选池 formalize 新版关键对象,旧对象词仅作为 historical material;ports、repository、API、DTO、trigger 和 backend SDK response 已排除到 Step 7 / 详细设计。 |
| SBX-HLD-INTERFACE-001 | Step 7 | resolved_for_hld_step_7 | 旧 `SandboxService`、旧事件、旧 backend / SDK / allowlist / audit 线索容易回流为当前 API / 接口骨架。 | Step 7 已按新版 Step 5 / Step 6 主语重建 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 和 external / infrastructure port 骨架;旧 service、topic、SDK、backend product 和 allowlist 线索仅作 historical material。 |
| SBX-HLD-FLOW-001 | Step 8 | resolved_for_hld_step_8 | 旧 README / 旧 `02` 的“service 调后端跑命令”主线、旧 retry / replay / cleanup 叙事和 output / audit / artifact 混写容易回流为当前处理流。 | Step 8 已按新版 Step 7 接口和 Step 6 对象重建 12 条关键处理流,显式分离 intake、boundary、policy、run、capture、handoff、failure / control、cleanup / reaper、redline、derived / reconciliation 和 relay。 |
| SBX-HLD-STATE-001 | Step 9 | resolved_for_hld_step_9 | 旧 README / 旧 `02` 缺少正式状态机拆分,容易把执行、capture、cleanup、redline 和 read surface 写成一条旧状态线,也容易让 query / relay / handoff 反写核心 truth。 | Step 9 已按 Step 6 / Step 8 重建 6 组并行状态机,显式分离 core truth、lifecycle / guard、read / relay / derived 状态,并补齐允许 / 禁止迁移与传播关系。 |
| SBX-HLD-EXCEPTION-001 | Step 10 | resolved_for_hld_step_10 | 旧 README / 旧 `02` 容易把所有异常压成 backend failure,把 capture / handoff / cleanup / redline / read-side 混成单线失败,或让 query / relay / reconciliation 反写 core truth。 | Step 10 已按 Step 8 / Step 9 主语重建关键异常与边界场景,显式分离 run 前阻断、run 后收束、cleanup / reaper / redline 互锁和 read-side 降级。 |
| SBX-HLD-CONFIG-001 | Step 11 | resolved_for_hld_step_11 | 旧 README / 旧 `02` 容易把 Docker/gVisor、default no-egress、旧 allowlist / fallback、旧 security profile、旧性能数字或下游 target 参数反向写成 sandbox 配置真相,也容易让配置越界改写 fail-closed、cleanup guard、redline 或 truth ownership。 | Step 11 已按 Step 3 / Step 8 / Step 9 / Step 10 主语重建配置影响轮廓,显式区分“可配置承载 / 接缝 / cadence”和“不可配置语义 / 边界 / guard / ownership”。 |
| SBX-HLD-HANDOFF-001 | Step 12 | resolved_for_hld_step_12 | 旧 `02/03` 缺少“概要已收稳内容如何交给详细设计”的显式承接清单,容易让 `03` 重发明对象、接口、状态、port 和 flow。 | Step 12 已把 Step 4~11 稳定输入、继续展开方向和回退规则显式化。 |
| SBX-HLD-RISK-001 | Step 13 | resolved_for_hld_step_13 | 旧 `02` 缺少“概要层已识别风险”和“仍待确认事项”的显式拆分,容易让 `03/04/07` 把历史线索、产品假设或文档缺口误润色成正式结论。 | Step 13 已把风险、待确认、当前不阻塞项和后续阻塞转换规则显式化。 |
| SBX-IMP-BOUNDARY-POLICY-CYCLE-001 | downstream `07` Step 6 writeback | resolved_by_07_step_6_writeback | 实施可落码回查发现概要校准对象 /接口 /flow曾让Boundary requirement或establishment读取后序Policy,与正式阶段顺序形成循环。 | 已回写Step 5 /6 /7 /8相关校准产物,固定`Context -> Boundary -> Policy -> Run`;正式`02`高层顺序未冲突,无需重装配,对象 /接口 /flow计数不变。 |
| SBX-DOC-GAP-001 | downstream | resolved_by_formal_04_review | 正式`04-配置设计.md`原缺失。 | 正式`04`已形成；真实profile / provider qualification仍按Activation前置处理。 |
| SBX-DOC-GAP-002 | downstream | resolved_by_07_step_13_review | 正式`07-实施计划.md`、implementation ledger和planned skeleton原缺失。 | 正式`07`、ledger和32 /32 skeleton已形成；`CB-SBX-01A`仍`blocked / activation_gate / wait_design`。 |
| SBX-HLD-CURRENT-SOURCE-001 | downstream DesignReopen writeback | resolved_by_v7.9_targeted_assembly | 正式`02`正向索引和§13曾保留旧generic port、material dead-letter歧义及旧下游缺口。 | Step 13 /14中间产物先完成定向回查，再更新正式`02`；旧内容只保留为historical material。 |

---

## 6. 当前 next_allowed_action

```text
`02-概要设计.md` full-restart 与 `v7.9-closeout` 定向装配均已完成;
Step 14 `整理正式概要设计文档` gate_status = completed_current_closeout;
正式 `projects/L4-sandbox/02-概要设计.md` 保持14章并已同步current port与下游状态;
next_allowed_action = 设计文档流程保持关闭;实现前固定可复现design baseline并关闭CB-SBX-01A Activation前置;
当前恢复点以 `project_execution_ledger.md`、`implementation_execution_ledger.md` 和 `07_implementation_plan_calibration_flow.md` 为准;
当前不需要提交 commit,且未经用户明确要求不得提交。
```

## PHYSICAL EOF Current Override: final design closure calibration (`DC-03`)

`02` 主体职责、对象、流程与状态分层保持关闭。本轮只授权 Step 14 在 `DC-04` 回填技术基线的概要级约束及未决项
current disposition；不得把 RFC 8785 算法、Shell 脚本细节或运行结果反向提升为概要职责。

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_document = 02-概要设计.md
current_step = Step 14 post-closeout baseline backfill authorized
flow_status = completed_current_closeout_pending_DC-04_formal_backfill
subject_design_reopen = no
next_allowed_action = DC-04_backfill_formal_02_current_disposition
commit_required = no
```

## PHYSICAL EOF Current Override: `DC-06` static audit

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_document = 02-概要设计.md
current_step = final design static audit
flow_status = completed_current_closeout_audited
formal_delta = audit_only_no_delta
design_semantic_status = closed
current_boundary = CB-SBX-01A
current_boundary_status = blocked|activation_gate|handoff
implementation_started = no
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
next_allowed_action = DC-06_complete_cross_document_audit
commit_required = no
```

## PHYSICAL EOF Current Override: `DC-06` completed, `DC-07` current

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_document = 02-概要设计.md
current_step = DC-06 final audit completed
flow_status = completed_design_static_only
formal_delta = audit_only_no_formal_delta
design_conclusion = design_closed_ready_for_baseline_publication
project_current_document = 07-实施计划.md
project_current_step = Step 18 baseline publication disposition
current_dc_task = DC-07
design_baseline = not_fixed
current_boundary = CB-SBX-01A
current_boundary_status = blocked|activation_gate|handoff
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
current_document = 02-概要设计.md
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
current_boundary = CB-SBX-01A
current_boundary_status = blocked|activation_gate|handoff
implementation_started = no
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
next_allowed_action = wait_explicit_commit_authorization
commit_required = no
```
