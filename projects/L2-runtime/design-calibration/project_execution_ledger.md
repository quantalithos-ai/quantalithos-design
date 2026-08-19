# L2-runtime 项目设计讨论执行台账

> 创建日期: 2026-08-07
> 当前模式: full-restart + single-agent-serial
> 当前任务: 从 `00-需求文档.md` 开始重建正式 `00~07` 设计链
> 项目目录: `projects/L2-runtime`
> 实施状态: not_started;本任务不实现代码

## 1. 当前恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 细节入口 |
|---|---|---|---|---|---|---|
| `07-实施计划.md` | Step 13 | `formal_document_assembly` | `closed_stop_review` | Step 12 已闭合不可伪造完成谓词；Step 13 已重建 13 章正式 07、修正 Annex B 为 ph07_13、生成 39 planned skeleton 与 39-row implementation ledger，并完成集合/污染/事实审计；实现状态仍 not_started | stop_review；不进入实现、不创建目标仓、不提交 | `design-calibration/07_implementation_plan_calibration_flow.md`;`design-calibration/07_implementation_plan_step_13_formal_document_assembly.md` |

## 2. 文档级进度

| 文档 | flow 文件 | 状态 | 当前 Step | 文档切换门禁 | blocker |
|---|---|---|---|---|---|
| `00-需求文档.md` | `design-calibration/00_requirements_calibration_flow.md` | completed_user_confirmed | Step 17 | pass | `L2R-UP-001~008` 已传递到架构 Step 1,持续阻塞相关正向设计 / qualification。 |
| `01-架构设计.md` | `design-calibration/01_architecture_calibration_flow.md` | completed_user_confirmed | Step 16 | pass | 正式 01 已完成并经用户确认，进入 02。 |
| `02-概要设计.md` | `design-calibration/02_hld_calibration_flow.md` | completed_user_confirmed | Step 14 | pass | 正式 02 已完成并获用户连续授权，作为 03 直接输入。 |
| `03-详细设计.md` | `design-calibration/03_ddd_calibration_flow.md` | completed_user_confirmed_with_04_writeback | Step 19 D09 + 04 contract closure | pass_as_04_input | D09 已经用户确认；04 仅允许回写配置 carrier、13 canonical slots 与正文曾引用但未定义的 Port，不改变能力/协议/Flow/状态语义。 |
| `04-配置设计.md` | `design-calibration/04_config_calibration_flow.md` | completed_user_confirmed | Step 15 | pass_as_05_input | 正式 04 与 Step 15 已闭合并获用户继续确认；11 个 external blocker 原样传入 05。 |
| `05-测试方案.md` | `design-calibration/05_test_plan_calibration_flow.md` | completed_user_confirmed | Step 15 | pass_as_06_input | 正式 05 与 Step 15 已闭合并获用户授权进入 06；开放 external seam 原样传递。 |
| `06-验收标准.md` | `design-calibration/06_acceptance_calibration_flow.md` | completed_user_confirmed | Step 15 | pass_as_07_input | 正式 06 已完成 full-restart；用户已明确授权进入 07。actual acceptance 仍 not_entered/none/not_bound/not_formed。 |
| `07-实施计划.md` | `design-calibration/07_implementation_plan_calibration_flow.md` | full_restart_closed_stop_review | Step 13 | closed_stop_review | Step 1~13 complete；正式 07、implementation ledger、39 planned skeleton 和后置审计已闭合；implementation remains not_started，所有真实执行事实为 none/not_bound。 |

## 3. 当前执行规则

| 规则 | 状态 | 说明 |
|---|---|---|
| 只修改设计仓 | active | 不创建或修改实现仓,不实现代码。 |
| full-restart | active | 旧 README 和旧 `00/01/02/03/05/06` 只作 historical material。 |
| 正式文档串行 | active | 严格 `00 -> 01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07`。 |
| Step 串行 | active | 当前 Step 通过前不得创建下一 Step 文件。 |
| 正式文档后置装配 | active | 00 / 01 / 02 均只在各自最终 Step 装配；03~07 继续遵守对应 SOP。 |
| 不伪造事实 | active | 不写实现、commit、run_id、测试结果、artifact、report、EV、验收 verdict、签署或 readiness。 |
| 正式文档停审 | active | 每完成一份正式文档立即停审,不自动进入下一份。 |
| 不提交 | active | 未获得 commit 授权。 |

## 4. 输入与历史材料台账

| 材料 | 定位 | 处理口径 |
|---|---|---|
| 当前设计标准与需求 SOP / 规范 | normative_authority | 决定流程、结构、依赖裁剪和写入门禁。 |
| `projects/L2-tools/00~07` | current_direct_upstream | 工具行动语义合同;开放 seam 必须原样传递。 |
| `projects/L3-capability-hub/00~07` | current_upstream | capability identity / registry / adapter descriptor / formal exposure;不含 provider runtime。 |
| `projects/L4-sandbox/00~07` | current_upstream | isolation execution truth 与受控 handoff;不含 runtime loop。 |
| `projects/L4-observability/00~07` | current_upstream | observation / audit projection 与 body-free safe material;不反写 runtime truth。 |
| `projects/L3-method-library/00~07` | current_upstream_with_dirty_workspace | method / role / process definition;`03-详细设计.md` 当前有未提交改动,不得声称 immutable baseline。 |
| `projects/L0-core/L0-bus/L0-sdk` 当前正式链 | current_foundation | Core 为唯一编译期候选;Bus 是 event seam;SDK 是下游封装边界,不是 runtime 反向 package 依赖。 |
| `projects/L1-governance` 当前正式链 | current_truth_input | approval / Decision / Policy effective truth;Runtime 只消费并执行,不得反写。 |
| `projects/L1-artifact` 当前正式链 | granularity_and_ref_input | 正文、版本、血缘与 evidence truth 不进入 runtime;只允许 ref / candidate / handoff。 |
| `projects/L2-runtime/README.md`、旧 `00/01/02/03/05/06` | historical_material | 只做污染和差异审计;旧技术栈、指标、对象、API、状态、事件和执行事实均不继承。 |
| `/home/aris/Projects/workdoc/ai/quantalithos_next_repo_dependency_order.md` | historical_material | 旧状态表已落后于当前设计仓;不参与当前顺序与 readiness 判断。 |

## 5. 上游 blocker / pending 台账

| ID | 来源 | 状态 | 影响范围 | 当前处理口径 |
|---|---|---|---|---|
| `L2R-UP-001` | `L2-tools` `L2T-UP-001~004` | open_upstream_contract | governed tool invocation、Sandbox 正向执行 / receipt / feedback | Runtime 只消费正式 Tool 合同;受影响路径 fail closed,不直连 Sandbox 补工具执行语义。 |
| `L2R-UP-002` | `L2-tools` `L2T-UP-005~007` 与 Observability | open_integration_boundary | tool/runtime safe material 的 producer / source / route / observed readiness | 只定义本地 handoff eligibility / attempt / gap;不声称 delivered / observed。 |
| `L2R-UP-003` | `L2-tools` `L2T-UP-008~009` | upstream_contract_candidate | Core tools-specific shared schema、SDK tools client | 不复制 shared type;SDK 保持 downstream future seam。 |
| `L2R-UP-004` | model provider boundary | owner_contract_pending | provider-independent model selection之后的正向 model adapter | Runtime 可拥有 model intent / selection decision,不拥有 provider secret、physical route、quota、cost或账单;具体 adapter 未闭口时 positive qualification blocked。 |
| `L2R-UP-005` | durable episodic / semantic memory | owner_boundary_pending | 长期记忆正文、索引、保留、删除、重建 | Runtime 只拥有 working memory 与检索 / 候选 / 引用语境;外部 durable owner 未闭口时不得声明长期写入 ready。 |
| `L2R-UP-006` | Runtime-specific Core / Bus / Observability contracts | schema_and_route_pending | shared runtime type、runtime event schema、safe signal source family | 需求层只固定类别与 owner;后续字段 / route 未闭口时保持 pending,不得本地冒充 Core 或 Observability authority。 |
| `L2R-UP-007` | `L4-sandbox` / `L4-observability` implementation state | implementation_readiness_absent | real isolation、RuntimeLike、observed / audit backend 正向资格 | 目录和设计文件不等于 implementation readiness;只能设计 fake / adapter / blocked seam。 |
| `L2R-UP-008` | current workspace | uncommitted_upstream_input | immutable design baseline | `L3-method-library/03-详细设计.md` 有既有未提交改动;本轮只引用 current workspace formal content,不声称 commit baseline。 |

上述开放项不阻塞 `00-需求文档.md` 对 owner、能力、失败和 fail-closed 条件的设计完成;它们阻塞相应 positive integration、字段定稿、配置激活、测试执行、证据与 readiness 声明。

## 6. 已闭合的 04 受控重开记录

以下顺序仅保留为历史恢复记录；当前不允许重开或修改正式 04。

```text
1. 读取项目台账、04 flow、当前正式 03 与配置/Port 校准来源。
2. 将旧正式 04 和旧 Step 1~15 登记为 `historical_material`，不得直接继承。
3. 先闭合 03 中 `RuntimeConfigSnapshot`、13 canonical slots、`DefinitionResolverPort`、`RuntimeConfigSnapshotPort` 与 `EventPublisherPort` 的唯一契约源。
4. 严格按 Step 1 -> Step 14 重建中间产物；每步完成影响判定后才进入下一步。
5. Step 14 不得残留 `待回写` 或 `阻塞待确认` 的 03 内部缺口。
6. Step 15 删除并重建正式 04，终检后设为 `closed_stop_review`，不得进入 05。
```

## 7. 当前 next_allowed_action

```text
current_document = 07-实施计划.md
current_step = Step 13
current_module = formal_document_assembly
gate_status = closed_stop_review
gate_reason = step_13_formal_07_ledger_39_skeleton_assembly_and_audit_closed
next_allowed_action = stop_review
next_formal_document_allowed = false_after_step_13
future_step_files_allowed = none_until_controlled_reopen
current_recovery_point = 07_step_13_formal_document_assembly_closed_stop_review
formal_01_write_allowed = false
formal_02_write_allowed = false_after_completion
formal_04_write_allowed = false_after_close_except_authorized_reopen
next_formal_document = none_until_controlled_reopen
formal_05_write_allowed = false_after_close_except_authorized_reopen
formal_06_write_allowed = false_after_completion
formal_07_write_allowed = closed_after_step_13
implementation_ledger_write_allowed = planned_inventory_only
boundary_skeleton_write_allowed = planned_inventory_only
implementation_repo_write_allowed = false
acceptance_process_state = not_entered
actual_baseline_run_evidence = none
actual_verdict_signoff_readiness = none
next_step = stop_review_after_step_13
next_step_allowed = stop_review
commit_required = false
```
