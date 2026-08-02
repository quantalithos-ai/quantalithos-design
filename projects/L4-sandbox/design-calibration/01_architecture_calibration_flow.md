# L4-sandbox 01 架构设计全量重启校准流程

> 创建日期: 2026-07-07
> 状态: completed_wait_user_review
> 当前模式: full-restart
> 设计仓: `/home/aris/Projects/quantalithos-design`
> 项目目录: `projects/L4-sandbox`
> 正式文档目标: `projects/L4-sandbox/01-架构设计.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 本轮口径: 新版 `00-需求文档.md` 是当前架构设计直接需求基线;旧 `01-架构设计.md`、旧 README 和旧下游文档只作 historical material / 差异审计输入。

---

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 16 | `整理正式文档:completed_wait_user_review` | pass_wait_review | 用户已确认 Step 15;Step 16 已按架构 SOP 和书写规范 18 章结构创建 `01_arch_step_16_formal_document_assembly.md`,并按 Step 1~15 已确认结论整体重建正式 `projects/L4-sandbox/01-架构设计.md`。正式文档逐章标注校准来源,保留 execution isolation truth、正式受控执行入口、coherent boundary、policy fail-closed、capture / handoff 分层、failure / cleanup / redline 一等事实、同步 / 异步 / 后台路径分离、只读派生、`L0-core` 唯一编译期依赖、配置不可越界和产品 / 旧指标后置等架构决定,未新增 API / schema / 状态机 / 产品 / profile / SLO / 测试 / 实施动作。 | 等待用户审查正式 `01-架构设计.md`;用户明确确认后,才能启动 `02-概要设计.md` full-restart,并先读取项目台账、本文档、`01_arch_step_16_formal_document_assembly.md`、正式 `00/01`、概要设计 SOP 和概要设计书写规范。 | `project_execution_ledger.md`;`01_arch_step_01_requirement_baseline.md`;`01_arch_step_02_goals_constraints.md`;`01_arch_step_03_responsibility_boundary.md`;`01_arch_step_04_system_context.md`;`01_arch_step_05_bounded_context_subdomains.md`;`01_arch_step_06_container_deployment.md`;`01_arch_step_07_dependency_direction.md`;`01_arch_step_08_data_ownership_consistency.md`;`01_arch_step_09_interactions_communication.md`;`01_arch_step_10_technology_choices.md`;`01_arch_step_11_alternatives_tradeoffs.md`;`01_arch_step_12_cross_cutting_concerns.md`;`01_arch_step_13_evolution_path.md`;`01_arch_step_14_risks_open_questions.md`;`01_arch_step_15_adr_traceability.md`;`01_arch_step_16_formal_document_assembly.md`;`projects/L4-sandbox/00-需求文档.md`;`projects/L4-sandbox/README.md`;`projects/L4-sandbox/01-架构设计.md`;`projects/L2-tools/00~06`;`projects/L2-runtime/00~06`;`projects/L2-member-service/00~06`;`projects/L1-identity/00~07`;`projects/L1-work/00~07`;`standards/document/架构设计讨论流程_SOP.md`;`standards/document/架构设计书写规范.md`;`standards/document/设计文档讨论中间产物规范.md`;`standards/document/设计真相源闭环与可落码性标准.md`;`standards/document/全局项目依赖关系与裁剪规则.md` |

---

## 2. 执行纪律

本流程只负责 `L4-sandbox` 的 `01-架构设计.md` full-restart。执行时必须按架构 SOP 一个 Step 一个 Step 推进。

固定纪律:

- 每次恢复先读取 `project_execution_ledger.md`,再读取本 flow,再读取当前 Step 文件。
- 正式 `01-架构设计.md` 只在 Step 16 `整理正式文档` 时重建;Step 1~15 不改正式 `01`。
- 旧 `README.md`、旧 `01-架构设计.md`、旧 `02/03/05/06` 只能在当前 Step 独立结论形成后做差异审计,不得作为新版架构真相源直接继承。
- flow 可以一次列出 Step 1~16,但不得提前创建 Step 2~16 的中间产物文件。
- 当前 Step 文件必须记录 Step 开工确认、Step 内计划、问题回答、旧材料诊断、取舍、结构化中间产物、回填草稿和自检。
- 每次用户确认只推进一个当前 Step;不得跨 Step 合并。
- 架构阶段不得写数据库表、Rust struct、repository、handler、DTO schema、事件 payload、测试用例或实施 commit boundary。
- 对 `L4-sandbox` 必须持续闭合 execution environment identity、resource limits、filesystem / network / process boundary、tool/runtime launch policy、artifact capture、observability hooks、failure classification、cleanup / lease / reaper、security redlines。
- 不得把 tools semantic execution、runtime agent loop、member lifecycle orchestration、artifact truth、observability store 或 policy definition truth 混进 sandbox。
- 单次写入以 100~300 行为宜;该限制只约束单次 patch / 写入批次,不限制 Step 文件或正式文档最终长度。

---

## 3. 公共必读文档

| 文档 | 用途 | 状态 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | 架构 Step 顺序、Step 内问题、回填位置、门禁和未来 Step 不得提前落盘规则。 | read_for_01_full_restart |
| `standards/document/架构设计书写规范.md` | 正式架构文档章节结构、校准来源和需求基线 / 约束 / 追溯规范。 | read_for_01_full_restart |
| `standards/document/设计文档编写通则.md` | 正式正文边界、可追溯和设计文档通用底线。 | read_for_01_full_restart |
| `standards/document/设计文档讨论中间产物规范.md` | 三层台账、Step 中间产物、分批写入和恢复规则。 | read_for_01_full_restart |
| `standards/document/设计真相源闭环与可落码性标准.md` | 防止架构结论后续无法进入 02~07 可落码链路。 | read_for_01_full_restart |
| `standards/document/全局项目依赖关系与裁剪规则.md` | L4-sandbox 依赖方向、编译期 / 运行期 / 事件协作分类。 | read_for_01_full_restart |
| `projects/L4-sandbox/design-calibration/project_execution_ledger.md` | 项目级恢复入口和文档切换门禁。 | read_for_01_full_restart |
| `projects/L4-sandbox/design-calibration/00_requirements_calibration_flow.md` | 需求阶段状态与 00 完成门禁。 | read_for_01_full_restart |
| `projects/L4-sandbox/00-需求文档.md` | 当前架构设计直接需求基线。 | read_for_01_full_restart |
| `projects/L4-sandbox/README.md` | 旧仓定位、后端、事件、目录和性能线索。 | historical_material |
| `projects/L4-sandbox/01-架构设计.md` | 当前正式架构基线;旧 Draft 仅保留在差异审计记录中。 | current_architecture_baseline_wait_review |
| `projects/L2-tools/00~06` | tools 调用 sandbox 的语义边界和禁止反向拥有 ToolPolicy / ToolResult。 | read_on_demand |
| `projects/L2-runtime/00~06` | runtime 调度和执行主线边界,禁止 sandbox 拥有 ExecutionInstance / recover truth。 | read_on_demand |
| `projects/L2-member-service/00~06` | member host / SandboxBinding / callback material 边界。 | read_on_demand |
| `projects/L1-identity/00~07` | actor / member identity anchor 来源和禁止正文入仓。 | read_on_demand |
| `projects/L1-work/00~07` | project / work / context refs 来源和 work truth 边界。 | read_on_demand |

---

## 4. Step 总任务表

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `01_arch_step_01_requirement_baseline.md` | 确认需求基线 | done | pass | Step 16 已完成;等待用户审查正式 `01`。 | 已明确架构前提、硬约束和未关闭风险,足以支撑架构目标与约束讨论;未写容器、技术选型、schema 或实现组织。 |
| 2 | `01_arch_step_02_goals_constraints.md` | 明确架构目标与约束 | done | pass | Step 16 已完成;等待用户审查正式 `01`。 | 架构目标、不可变约束、当前阶段取舍和架构非目标已收敛;未写容器、依赖图、数据库、协议、schema、状态机、配置 key 或技术方案。 |
| 3 | `01_arch_step_03_responsibility_boundary.md` | 职责边界 | done | pass | Step 16 已完成;等待用户审查正式 `01`。 | 做 / 不做、易混淆职责和边界红线已收敛;未写容器、数据矩阵、接口协议或实现层依赖。 |
| 4 | `01_arch_step_04_system_context.md` | 系统边界与上下文 | done | pass | Step 16 已完成;等待用户审查正式 `01`。 | 正式上下文图、输入面、输出面、边界说明和依赖失效降级口径已收敛;未写容器、协议 schema、具体后端或技术选型。 |
| 5 | `01_arch_step_05_bounded_context_subdomains.md` | 限界上下文与子域划分 | done | pass | Step 16 已完成;等待用户审查正式 `01`。 | 核心子域、支撑子域、本地索引 / 投影 / 引用、上下文关系图、统一语言、单上下文停审和跨上下文审计已收敛;未写容器、部署、接口、对象字段、事件或代码模块。 |
| 6 | `01_arch_step_06_container_deployment.md` | 容器 / 部署架构 | done | pass | Step 16 已完成;等待用户审查正式 `01`。 | 运行承载图、运行单元说明表、部署关系、通信方式和运行边界红线已收敛;未下沉到实施脚本、协议 schema、技术产品或代码组织。 |
| 7 | `01_arch_step_07_dependency_direction.md` | 依赖方向与层间约束 | done | pass | Step 16 已完成;等待用户审查正式 `01`。 | 依赖角色、层间约束、依赖倒置、按架构单元依赖规则、依赖裁剪表、分类表、禁止依赖表、依赖裁剪图和跨依赖审计已收敛。 |
| 8 | `01_arch_step_08_data_ownership_consistency.md` | 数据所有权与一致性策略 | done | pass | Step 16 已完成;等待用户审查正式 `01`。 | truth / snapshot / ref / forbidden body、一致性策略、按架构单元数据所有权、停审记录和跨数据边界审计已收敛。 |
| 9 | `01_arch_step_09_interactions_communication.md` | 关键交互与通信方式 | done | pass | Step 16 已完成;等待用户审查正式 `01`。 | 关键交互、通信方式和失败语义已收敛,未写协议 schema。 |
| 10 | `01_arch_step_10_technology_choices.md` | 关键技术选型 | done | pass | Step 16 已完成;等待用户审查正式 `01`。 | 技术机制、采用理由、代价 / 约束和不采用口径已收敛,未写产品清单或实现机制。 |
| 11 | `01_arch_step_11_alternatives_tradeoffs.md` | 备选方案与取舍 | done | pass | Step 16 已完成;等待用户审查正式 `01`。 | 备选方案、方案对比、最终选择和不采用原因已收敛,未写产品横评或实现机制。 |
| 12 | `01_arch_step_12_cross_cutting_concerns.md` | 横切关注点 | done | pass | Step 16 已完成;等待用户审查正式 `01`。 | 安全、审计、观测、配置、性能和降级边界已按本仓裁剪,未写监控 / 配置 / profile / 测试实现。 |
| 13 | `01_arch_step_13_evolution_path.md` | 演进路线 | done | pass | Step 16 已完成;等待用户审查正式 `01`。 | 当前主线成立边界、可接受 / 不可接受债务、后续结构演进和触发条件已收敛,未写项目排期、任务拆单或实现计划。 |
| 14 | `01_arch_step_14_risks_open_questions.md` | 风险与待确认事项 | done | pass | Step 16 已完成;等待用户审查正式 `01`。 | 架构风险、待确认事项、阻塞判断和后续阻塞转换规则已明确。 |
| 15 | `01_arch_step_15_adr_traceability.md` | ADR 与需求追溯 | done | pass | Step 16 已完成;等待用户审查正式 `01`。 | ADR 候选索引、需求追溯矩阵、漏项检查、架构决定停审和跨 ADR / 需求追溯审计已收敛。 |
| 16 | `01_arch_step_16_formal_document_assembly.md` | 整理正式文档 | done_wait_review | pass_wait_review | 等待用户审查正式 `01`;确认后才能进入 `02-概要设计.md`。 | 正式 `01-架构设计.md` 已按 Step 1~15 结论重建,无新增未确认结论。 |

---

## 5. 正式 / 旧材料处理状态

| 材料 | 当前状态 | 使用规则 |
|---|---|---|
| `projects/L4-sandbox/00-需求文档.md` | current_reviewed_baseline | 用户已确认可进入 01;新版需求基线是架构设计直接输入。 |
| `projects/L4-sandbox/design-calibration/00_req_step_*.md` | current_baseline_detail | 按需读取,用于解释正式 00 的来源、取舍和追溯。 |
| `projects/L4-sandbox/README.md` | historical_material | 提供旧定位、后端、事件、目录、安全和性能线索;不得继承为架构事实。 |
| `projects/L4-sandbox/01-架构设计.md` | current_architecture_baseline_wait_review | 已在 Step 16 按 18 章结构重建;当前等待用户审查确认。旧 Draft 只作为 historical material 留在 calibration 诊断中。 |
| `projects/L4-sandbox/02-概要设计.md` | historical_material | 后续对应文档重启时再审计,不得反推当前架构。 |
| `projects/L4-sandbox/03-详细设计.md` | historical_material | 对象、状态、目录、持久化和接口细节后续重启时审计。 |
| `projects/L4-sandbox/04-配置设计.md` | missing | 后续进入 04 时创建。 |
| `projects/L4-sandbox/05-测试方案.md` | historical_material | 后续 05 重启时审计;当前不产生真实测试结果。 |
| `projects/L4-sandbox/06-验收标准.md` | historical_material | 后续 06 重启时审计;当前不作为验收签署。 |
| `projects/L4-sandbox/07-实施计划.md` | missing | 后续进入 07 时创建正式文档、implementation ledger 和 planned boundary skeleton。 |

---

## 6. 文档级 blocker 台账

| Blocker ID | Step | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| SBX-ARCH-BOOT-001 | Step 1 | resolved_for_step_1 | L4-sandbox 缺当前重启状态下的 01 架构校准 flow。 | 本文件已创建。 |
| SBX-ARCH-HIST-001 | Step 1~15 | contained_as_historical_material | 旧 README / 旧 `01` 把 Docker/gVisor、SandboxService、旧审计事件、旧性能目标、旧目录、具体上下文图角色、Sandbox API / Backends / Limits / Policy Gate / Audit、capability-hub policy 来源、observability audit sink、local_process test-only 后端、SDK 依赖、`api -> application -> domain -> infra` 依赖图、metadata / allowlist snapshot / audit events、RPC / SDK、allowlist lookup、audit emitter、backlog / replay、backend fallback、seccomp / AppArmor / cap drop 配置、旧 P95 / SLA、灰度回滚策略和旧阶段 1~4 路线图写成架构事实。 | Step 1~15 已记录为 historical material / pollution risk;Step 15 已重新建立需求追溯与 ADR 候选索引,旧口径未成为新版来源。 |
| SBX-DOC-GAP-001 | downstream | open_downstream | 正式 `04-配置设计.md` 缺失。 | 后续进入 04 时创建,不阻塞 01 Step 1。 |
| SBX-DOC-GAP-002 | downstream | open_downstream | 正式 `07-实施计划.md` 缺失。 | 后续进入 07 时创建 implementation ledger 和 boundary skeleton,不阻塞 01 Step 1。 |

---

## 7. 当前 next_allowed_action

```text
`01-架构设计.md` full-restart 已推进到 Step 16;
Step 16 `整理正式文档` 已完成,gate_status = pass_wait_review;
正式 `projects/L4-sandbox/01-架构设计.md` 已按 18 章结构重建;
next_allowed_action = 等待用户审查正式 `01-架构设计.md`;
用户确认后才允许启动 `02-概要设计.md` full-restart;
当前不需要提交 commit,且未经用户明确要求不得提交。
```

## PHYSICAL EOF Current Override: final design closure calibration (`DC-03`)

本节是 `01` flow 的唯一 current 状态。上文 `completed_wait_user_review` 已被用户后续连续确认及 `02~07` 正式设计
消费，属于 historical review gate；`04/07 missing` 也已由后续设计解决。该覆盖不把实现、测试、验收或交付写成已完成。

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_plan_version = v1.0
current_document = 01-架构设计.md
current_step = Step 16 post-closeout disposition backfill authorized
flow_status = completed_current_closeout_pending_DC-04_formal_backfill
historical_review_status = completed_wait_user_review
current_review_status = consumed_by_user_confirmation_and_downstream_design
historical_document_gaps = SBX-DOC-GAP-001|SBX-DOC-GAP-002
current_document_gap_status = resolved_by_downstream_design
implementation_started = no
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_allowed_action = DC-04_backfill_formal_01_current_disposition
```

## PHYSICAL EOF Current Override: `DC-06` static audit

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_document = 01-架构设计.md
current_step = final design static audit
flow_status = completed_current_closeout_audited
formal_delta = audit_only_no_delta
design_semantic_status = closed
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
current_document = 01-架构设计.md
current_step = DC-06 final audit completed
flow_status = completed_design_static_only
formal_delta = audit_only_no_formal_delta
design_conclusion = design_closed_ready_for_baseline_publication
project_current_document = 07-实施计划.md
project_current_step = Step 18 baseline publication disposition
current_dc_task = DC-07
design_baseline = not_fixed
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
current_document = 01-架构设计.md
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
implementation_started = no
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
next_allowed_action = wait_explicit_commit_authorization
commit_required = no
```
