# L3-capability-hub 07 实施计划校准流程

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md`
> 书写规范: `standards/document/实施计划书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 代码实施台账规范: `standards/document/代码实施台账与门禁规范.md`
> 可落码性标准: `standards/document/设计真相源闭环与可落码性标准.md`
> 目标正式文档: `projects/L3-capability-hub/07-实施计划.md`
> 创建日期: 2026-07-26
> 当前模式: full-restart / continuous execution
> 当前状态: `07_completed_design_task_wait_implementation_handoff`

## 1. 本轮目标

把 active formal `00-需求文档.md` 至 `06-验收标准.md` 转译为可执行、可验证、可提交、可回退的实施路径。正式 `07-实施计划.md` 只能在 Step 13 由 Step 1~12 中间产物整体装配；实施仓代码、测试运行、真实 artifact/report/evidence、implementation commit、验收签署均不在本轮产生。

本轮必须保持以下职责主线：

- 本仓只实施 capability identity、capability registry、adapter descriptor、governance/policy approval seam 的引用关系、method-library body-free relation、formal exposure/visibility、traceability/impact、SDK server exposure boundary 及其必要的外部 MCP/A2A/API 接入合同。
- runtime execution、tools execution、governance approval truth、method body/source、marketplace listing/transaction、provider route/quota/cost/secret truth、SDK client/cache 和 observability backend truth 不得被实施计划吸收。
- 任何 Rust public declaration、struct field、enum variant/payload field、trait、method 和 callable 在未来实现中都必须有完整英文 `///`；enum struct-variant field 不写 field-level `pub`。
- 每个 phase 与 commit boundary 都必须能回指正式 `03/04/05/06` 的 exact source、测试合同、验收门禁和代码实施台账字段。

## 2. 历史材料处置

| 历史材料 | 冲突 | 当前处置 |
|---|---|---|
| 旧 README | 将 capability-hub 定义为 MCP 白名单、Provider Contract、成本记账和 policy 下发执行中心 | 只作为 historical material；正式 00~06 为 active authority，T070 再审计 README |
| 旧 formal 00~06 方向 | 混入 provider、cost、approval、runtime、KMS/Vault、旧阈值和旧 evidence | 不迁移同义词、不建立 alias；只在校准文件记录污染诊断 |
| 缺失或旧 formal 07 | 没有可承接的 active phase/boundary/commit 计划 | 从本 flow Step 1~13 重建；不得在旧文件上增量修补 |
| 参考项目 07 | L1/L3 的阶段、crate、对象、阈值和真实实现事实 | 只借用结构粒度和门禁格式，不复制领域事实、commit、run 或验收结果 |

## 3. 权威输入顺序

```text
formal 00 requirement / scope / AC / VF
  -> formal 01 architecture / ownership / dependency
  -> formal 02 HLD / components / flow grouping
  -> formal 03 DDD / exact types / protocols / states / TX / bindings
  -> formal 04 configuration / profiles / sources / failure
  -> formal 05 tests / cases / data / evidence / gates
  -> formal 06 acceptance / VETO / release / signoff contract
  -> 07 Steps 1~12
  -> formal 07 Step 13 assembly
  -> implementation ledger + all planned boundary skeletons
```

正式文档优先于 calibration；formal 文档无法定位时才读取对应 calibration 的 exact section；仍存在字段、状态、Port、配置、证据或责任冲突时，必须暂停并回写 owning design Step，不得由实施计划猜测。

## 4. Step 总计划

| Step | 主题 | 中间产物 | 状态 | 正式回填章节 |
|---|---|---|---|---|
| Step 1 | 确认实施输入边界 | `07_implementation_plan_step_01_input_boundary.md` | [x] completed | §1 |
| Step 2 | 明确实施目标、范围和非范围 | `07_implementation_plan_step_02_scope.md` | [x] completed | §2 |
| Step 3 | 收稳前置条件与阅读清单 | `07_implementation_plan_step_03_prerequisites_reading.md` | [x] completed | §3 |
| Step 4 | 抽取实施对象与交付物 | `07_implementation_plan_step_04_objects_deliverables.md` | [x] completed | §4 |
| Step 5 | 设计实施阶段与依赖顺序 | `07_implementation_plan_step_05_phases_dependencies.md` | [x] completed | §5 |
| Step 6 | 拆分阶段任务、编写顺序与提交边界 | `07_implementation_plan_step_06_tasks_commit_boundaries.md` | [x] completed | §6 |
| Step 7 | 嵌入测试与验收门禁 | `07_implementation_plan_step_07_tests_acceptance_gates.md` | [x] completed | §7 |
| Step 8 | 定义配置、环境与外部依赖准备 | `07_implementation_plan_step_08_config_environment_dependencies.md` | [x] completed | §8 |
| Step 9 | 定义 Spike、风险与待确认事项 | `07_implementation_plan_step_09_spikes_risks_open_questions.md` | [x] completed | §9 |
| Step 10 | 定义回退、暂停与变更控制 | `07_implementation_plan_step_10_rollback_pause_change_control.md` | [x] completed | §10 |
| Step 11 | 定义提交、评审与交付纪律 | `07_implementation_plan_step_11_commit_review_delivery.md` | [x] completed | §11 |
| Step 12 | 定义实施完成判定 | `07_implementation_plan_step_12_completion_criteria.md` | [x] completed | §12 |
| Step 13 | 整理正式实施计划文档 | `07_implementation_plan_step_13_formal_document_assembly.md` | [x] completed | §13 / full document |

## 5. 通用执行纪律

1. 每个 Step 开工先读取 project ledger、本 flow、当前 Step、对应 SOP 段落和 active upstream；先思考再写入。
2. 每个 Step 独立保留问题回答、诊断、取舍、结构化中间产物、回填草稿、待确认事项和进入下一步条件。
3. 正式 `07-实施计划.md` 在 Step 13 前不创建、不修改；Step 文件按 100~300 行批次写入，长内容拆批。
4. 实施计划不补需求、架构、对象 schema、DTO、Port、状态、配置 key、证据 schema 或实现代码；发现缺口必须记录 blocker 并回流 owning source。
5. Step 5~7 以 phase / commit boundary 小循环为主轴：阶段目标、依赖、代码批次、设计闭环、经验复核、测试/验收/证据门禁和停审记录必须逐项收敛。
6. 正式 `07` 完成时必须同时定义 implementation ledger 路径、Boundary Gate Matrix 和全部 planned boundary skeleton；未来 skeleton 不能标记为 pass 或授权实现。
7. 不伪造实现仓、分支、commit、run_id、artifact、report、digest、evidence、defect、risk acceptance、verdict、signoff 或测试结果。

## 6. 设计期 truthfulness 状态

| 事实类别 | 当前值 |
|---|---|
| active formal 00~06 | 已装配；作为设计输入 |
| target implementation repository | `/home/aris/Projects/quantalithos-capability-hub` 在设计期未发现；需实现前确认或创建 |
| implementation baseline / commit | 未建立 |
| test run / artifact / report / evidence instance | 不存在 |
| acceptance verdict / signoff | 未进入 |
| accepted residual risk | 0 |
| unresolved upstream design blocker | 0 |
| commit required for this design task | no |

目标仓缺失是 implementation prerequisite blocker，不是 upstream design blocker；在正式 07 中必须保留为移交实现前门禁。

## 7. 当前恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | required reading |
|---|---|---|---|---|---|---|
| `07-实施计划.md` | Step 13 completed; T068/T069/T070/T071/T072 closure | implementation handoff and final audit | `design_task_completed` | Formal 07, implementation ledger, README disposition, 26 skeletons and final audit are complete. No implementation fact exists; target repository and immutable baseline remain blocked prerequisites. | `wait_for_authorized_implementation_handoff` | `代码实施台账与门禁规范.md`、formal `07` §§3/6/7/8/10/11/12、implementation ledger、T071 final audit |

```text
document = 07-实施计划.md
flow = completed
current_step = 13_completed
next_allowed_action = wait_for_authorized_implementation_handoff
formal_07_authority = active
implementation_repository = not_established
implementation_commit = none
test_run = none
evidence_instance = none
accepted_risk_count = 0
unresolved_upstream_blocker = none
commit_required = no
```

## 8. Step 13 完成快照

正式`07-实施计划.md`已按Step 1~12整体装配并通过章节、phase、boundary、gate、denominator、配置、责任、Rustdoc、evidence path和truthfulness静态审计；T068/T069已创建实现移交台账与26个planned skeleton，T070/T071已完成README和全量一致性审计。该flow与设计任务完成不改变`implementation_incomplete / not_started`事实；后续只能等待授权的真实实现仓和baseline handoff。

## Final closure overlay

T072 已关闭本轮设计任务。此前 Step 1~13 表格和历史恢复记录保留其原始讨论轨迹；当前唯一恢复入口如下：

| field | value |
|---|---|
| formal_design_status | `completed` |
| final_audit | `design-calibration/T071_full_restart_final_audit.md` |
| implementation_repository | `not_established` |
| implementation_baseline | `not_fixed_until_handoff` |
| current_boundary | `commit-01-a` |
| implementation_gate_status | `blocked` |
| implementation_next_allowed_action | `wait_design` |
| unresolved_upstream_design_blocker | `0` |
| commit_required | `no` |

The valid next action after this flow is `wait_for_authorized_implementation_handoff`; no code, test, evidence, acceptance or commit action is authorized by this closure.
