# L4-sandbox 00 需求文档全量重启校准流程

> 创建日期: 2026-07-06
> 状态: completed_reviewed_for_01_start
> 当前模式: full-restart
> 设计仓: `/home/aris/Projects/quantalithos-design`
> 项目目录: `projects/L4-sandbox`
> 正式文档目标: `projects/L4-sandbox/00-需求文档.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 本轮口径: 用户已确认从头开始;旧正式文档和前序粗稿只作 historical_material / invalidated_material。

---

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 17 | `整理正式文档:completed_reviewed_for_01_start` | pass | Step 17 已创建正式装配中间产物并重建正式 `projects/L4-sandbox/00-需求文档.md`;正文逐章标注校准来源,未新增 Step 1~16 之外的新需求;用户已确认可进入 `01-架构设计.md`。 | 已移交 `01-架构设计.md` full-restart;当前恢复点以 `project_execution_ledger.md` 和 `01_architecture_calibration_flow.md` 为准。 | `project_execution_ledger.md`;`00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_07_core_capability_loop.md`;`00_req_step_08_user_stories.md`;`00_req_step_09_functional_requirements.md`;`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_13_non_functional_requirements.md`;`00_req_step_14_acceptance_criteria.md`;`00_req_step_15_risks_open_questions.md`;`00_req_step_16_traceability_matrix.md`;`00_req_step_17_formal_document_assembly.md`;`projects/L4-sandbox/00-需求文档.md`;`standards/document/需求文档讨论流程_SOP.md`;`standards/document/需求文档书写规范.md`;`standards/document/全局项目依赖关系与裁剪规则.md`;`standards/document/设计文档编写通则.md`;`standards/document/设计文档讨论中间产物规范.md`;`standards/document/设计真相源闭环与可落码性标准.md` |

---

## 2. 执行纪律

本流程只负责 `L4-sandbox` 的 `00-需求文档.md`。执行时必须按需求 SOP 一个 Step 一个 Step 推进。

固定纪律:

- 每个 Step 先读取公共标准、当前 flow、项目台账和已完成上游 Step 文件。
- 每个 Step 文件必须包含 Step 开工确认、Step 内计划、问题回答、诊断、取舍、结构化产物、回填草稿和自检停审。
- 旧 L4-sandbox 正式文档只能作为 historical_material;先形成当前 Step 独立结论,再审计旧材料。
- 不得预生成未来 Step 文件;Step 5~17 只能在当前 Step 通过并经用户确认后逐步创建。
- 正式 `00-需求文档.md` 每章必须能追溯到具体 `00_req_step_*` 中间产物。
- 需求阶段不得写数据库表、Rust struct、repository、port、handler、事务流程、代码目录、API path 或 DTO schema。
- Step 5 以后必须以核心能力节点小循环收束故事、功能、规则、数据、接口、NFR、验收和追溯。
- 单次写入批次建议 100~300 行;该限制不压缩最终内容完整性。

---

## 3. 公共必读文档

| 文档 | 用途 | 当前状态 |
|---|---|---|
| `standards/document/设计文档编写通则.md` | 正式正文边界、可追溯和可落码底线。 | read_for_step_17 |
| `standards/document/设计文档讨论中间产物规范.md` | 三层台账、Step 门禁、写入前检查和 full-restart 纪律。 | read_for_step_17 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 防止后续实现阶段缺 schema / port / evidence / boundary 真相源。 | read_for_step_17 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | L4-sandbox 依赖方向、编译期 / 运行期 / 事件协作分类。 | read_for_step_17 |
| `standards/document/需求文档讨论流程_SOP.md` | Step 1~17 生成顺序与能力小循环纪律。 | read_for_step_17 |
| `standards/document/需求文档书写规范.md` | 正式需求 16 章结构和校准来源格式。 | read_for_step_17 |
| `projects/README.md` | 项目清单、仓类型和基础设施契约型写法。 | read_for_step_4 |
| `architecture/仓库拆分方案.md` | L4-sandbox 在基础设施层的仓级来源。 | read_for_step_4 |
| `architecture/标准对齐全景图.md` | sandbox 对齐沙箱逃逸防御、ISO 25010 Security、ISO 42001 A.6。 | read_for_step_4 |
| `product/六域模型.md` | 六域之外横切基础设施与执行隔离线索。 | read_for_step_4 |
| `standards/子项目遵循规范清单.md` | 旧规范中的 sandbox 强制项线索,仅作历史 / 主题输入。 | read_for_step_4 |

---

## 4. Step 总任务表

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `00_req_step_01_upstream_relation.md` | 与上游文档的关系声明 | done | pass | done | 权威输入、主题输入、上游边界参考和历史材料分清;不提前写 Step 2 边界或 Step 7 能力。 |
| 2 | `00_req_step_02_position_boundary.md` | 本仓定位与边界 | done | pass | done | 已明确 sandbox 是运行隔离基础,不混入 tools/runtime/member truth。 |
| 3 | `00_req_step_03_problem_context.md` | 背景与问题定义 | done | pass | done | 已说明背景、主要问题、量化处理和业务/技术问题分类。 |
| 4 | `00_req_step_04_goals_non_goals.md` | 目标与非目标 | done | pass | done | 已完成目标、非目标和范围收束。 |
| 5 | `00_req_step_05_users_roles.md` | 用户与角色 | done | pass | done | 已完成角色说明、角色分类、非角色排除、权限差异口径和回填草稿;用户已确认进入 Step 6。 |
| 6 | `00_req_step_06_consumers_dependencies.md` | 使用方与依赖 | done | pass | done | 已完成内部仓依赖表、外部系统依赖表、依赖裁剪表、类型分类表、禁止依赖表、依赖裁剪 ASCII 图和回填草稿;用户已确认进入 Step 7。 |
| 7 | `00_req_step_07_core_capability_loop.md` | 核心能力闭环 | done | pass | done | 已完成仓存在必要性、核心能力闭环、能力节点顺序、能力层级表、旧功能回填映射和回填草稿;用户已确认进入 Step 8。 |
| 8 | `00_req_step_08_user_stories.md` | 用户故事 | done | pass | done | 已完成按 C-SBX-1~5 组织的核心闭环故事、外围增强故事、边界外故事排除表、故事与闭环映射、回填草稿和自检;用户已确认进入 Step 9。 |
| 9 | `00_req_step_09_functional_requirements.md` | 功能需求 | done | pass | done | 已完成按 C-SBX-1~5 组织的核心闭环功能、外围增强功能、能力级功能语义补充、故事映射、回填草稿和自检;用户已确认进入 Step 10。 |
| 10 | `00_req_step_10_business_rules_boundaries.md` | 业务规则与边界约束 | done | pass | done | 已完成按 C-SBX-1~5 组织的正式规则、规则类型结论、约束对象结论、规则与功能映射、回填草稿和自检;用户已确认进入 Step 11。 |
| 11 | `00_req_step_11_data_ownership.md` | 数据需求与数据归属 | done | pass | done | 已完成按 C-SBX-1~5 组织的数据归属表、数据类型结论、功能 / 规则映射、边界外数据排除表、回填草稿和自检。 |
| 12 | `00_req_step_12_interfaces_dependencies.md` | 接口与依赖 | done | pass | done | 已完成按 C-SBX-1~5 组织的接口与依赖结论、对外能力接口表、外部依赖边界表、类型结论、映射结论、回填草稿和自检。 |
| 13 | `00_req_step_13_non_functional_requirements.md` | 非功能需求 | done | pass | done | NFR 已按能力级 / 全局质量约束和六类类别完成重建。 |
| 14 | `00_req_step_14_acceptance_criteria.md` | 验收标准 | done | pass | done | 已完成按 C-SBX-1~5 组织的能力级验收、五类验收类别、正式验收项、一票否决项和映射结论。 |
| 15 | `00_req_step_15_risks_open_questions.md` | 风险与待确认事项 | done | pass | done | 已完成风险清单、待确认事项、当前不阻塞项与后续阻塞项;用户已确认进入 Step 16。 |
| 16 | `00_req_step_16_traceability_matrix.md` | 需求追溯矩阵 | done | pass | done | 已完成主追溯矩阵、跨能力追溯审计、漏项检查表和回填草稿;用户已确认进入 Step 17。 |
| 17 | `00_req_step_17_formal_document_assembly.md` | 整理正式文档 | done_reviewed_for_01_start | pass | handed_to_01 | 正式每章有具体校准来源,正文不新增未确认结论;正式 `00-需求文档.md` 已重建,用户已确认可进入 `01`。 |

---

## 5. 旧材料处理状态

| 材料 | 当前状态 | 使用规则 |
|---|---|---|
| `projects/L4-sandbox/README.md` | historical_material | 可作旧定位线索;技术栈、目录、性能数字、后端清单不直接继承。 |
| `projects/L4-sandbox/00-需求文档.md` | current_reviewed_architecture_baseline | 已按 Step 1~17 full-restart 重建,包含 0~16 章、正式编号体系、NFR、验收和追溯矩阵;用户已确认可进入 `01`。 |
| `projects/L4-sandbox/01-架构设计.md` | historical_material | 后续 01 重启时审计,不得反推需求。 |
| `projects/L4-sandbox/02-概要设计.md` | historical_material | 五段主线已在 Step 7 作为历史主题线索重新映射;后续 02 full-restart 时继续审计,不得反推需求。 |
| `projects/L4-sandbox/03-详细设计.md` | historical_material | 对象、流程、目录、持久化和接口实现设想不得进入需求。 |
| `projects/L4-sandbox/04-配置设计.md` | missing | 后续进入 04 时创建,不阻塞 `00`。 |
| `projects/L4-sandbox/05-测试方案.md` | historical_material | 不伪造测试结果;后续 05 重启时审计。 |
| `projects/L4-sandbox/06-验收标准.md` | historical_material | 不作为真实验收签署;后续 06 重启时审计。 |
| `projects/L4-sandbox/07-实施计划.md` | missing | 后续进入 07 时创建 implementation ledger 和 boundary skeleton。 |
| 旧 `00_req_step_02/03/04` 粗稿 | invalidated_material_deleted | 用户确认“从头开始”后已删除;后续按顺序重建。 |

---

## 6. 文档级 blocker 台账

| Blocker ID | Step | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| SBX-REQ-BOOT-001 | Step 1 | resolved_for_step_1 | L4-sandbox 缺当前重启状态下的 00 需求校准 flow。 | 本文件已重建。 |
| SBX-REQ-HIST-001 | Step 1 | contained_as_historical_material | 旧正式文档混入旧结构和实现细节。 | Step 1 已记录为 historical_material;后续逐 Step 审计。 |
| SBX-REQ-ROUGH-001 | Step 2~4 | resolved_by_delete | 前序粗稿过短且跳过用户最新“从头开始”确认。 | 已删除;不得作为后续输入。 |
| SBX-DOC-GAP-001 | downstream | open | 正式 `04-配置设计.md` 缺失。 | 后续进入 04 时创建,不阻塞当前正式 `00` 审查。 |
| SBX-DOC-GAP-002 | downstream | open | 正式 `07-实施计划.md` 缺失。 | 后续进入 07 时创建,并同步 implementation ledger / boundary skeleton;不阻塞当前正式 `00` 审查。 |

---

## 7. 当前 next_allowed_action

```text
`00-需求文档.md` full-restart 已推进到 Step 17;
Step 17 `整理正式文档:自检与停审` 已完成,gate_status = pass;
正式 `projects/L4-sandbox/00-需求文档.md` 已按 Step 1~16 结论重建;
next_allowed_action = 已移交 `01-架构设计.md` full-restart;
当前恢复点以 `project_execution_ledger.md` 和 `01_architecture_calibration_flow.md` 为准;
当前不需要提交 commit,且未经用户明确要求不得提交。
```

## PHYSICAL EOF Current Override: final design closure calibration (`DC-03`)

本节是 `00` flow 的唯一 current 状态，覆盖上文发生时成立的下游缺口快照，但不删除其历史审计价值。正式
`04-配置设计.md`、`07-实施计划.md`、implementation ledger 与 32 件 planned Boundary skeleton 已由后续流程形成，
因此 `SBX-DOC-GAP-001/002` 当前均为 `resolved_by_downstream_design`，不再是 active blocker。

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_plan_version = v1.0
current_document = 00-需求文档.md
current_step = Step 17 post-closeout disposition backfill authorized
flow_status = completed_current_closeout_pending_DC-04_formal_backfill
historical_document_gaps = SBX-DOC-GAP-001|SBX-DOC-GAP-002
current_document_gap_status = resolved_by_downstream_design
formal_chain = 00|01|02|03|04|05|06|07 present_design_only
implementation_started = no
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_allowed_action = DC-04_backfill_formal_00_current_disposition
```

## PHYSICAL EOF Current Override: `DC-06` static audit

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_document = 00-需求文档.md
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
current_document = 00-需求文档.md
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
current_document = 00-需求文档.md
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
