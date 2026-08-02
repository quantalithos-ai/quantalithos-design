# L4-sandbox 00 需求 Step 17: 整理正式文档

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 17
> 回填章节: `projects/L4-sandbox/00-需求文档.md` 全文
> 生成日期: 2026-07-07

---

## 1. 本步目标

把 Step 1~16 已确认并可回填的全部结论,按正式需求文档结构整理成 `projects/L4-sandbox/00-需求文档.md`。本步只做重组、摘录、统一术语和交叉引用,不新增未经讨论的新需求,不把旧正式文档、旧 README、旧 `01/02/03/05/06` 或历史 benchmark 直接抄回正文。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_01_upstream_relation.md` | 已完成 | 回填正式 §1 |
| `design-calibration/00_req_step_02_position_boundary.md` | 已完成 | 回填正式 §2 |
| `design-calibration/00_req_step_03_problem_context.md` | 已完成 | 回填正式 §3 |
| `design-calibration/00_req_step_04_goals_non_goals.md` | 已完成 | 回填正式 §4 |
| `design-calibration/00_req_step_05_users_roles.md` | 已完成 | 回填正式 §5 |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | 已完成 | 回填正式 §6 |
| `design-calibration/00_req_step_07_core_capability_loop.md` | 已完成 | 回填正式 §7 |
| `design-calibration/00_req_step_08_user_stories.md` | 已完成 | 回填正式 §8 |
| `design-calibration/00_req_step_09_functional_requirements.md` | 已完成 | 回填正式 §9 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | 已完成 | 回填正式 §10 |
| `design-calibration/00_req_step_11_data_ownership.md` | 已完成 | 回填正式 §11 |
| `design-calibration/00_req_step_12_interfaces_dependencies.md` | 已完成 | 回填正式 §12 |
| `design-calibration/00_req_step_13_non_functional_requirements.md` | 已完成 | 回填正式 §13 |
| `design-calibration/00_req_step_14_acceptance_criteria.md` | 已完成 | 回填正式 §14 |
| `design-calibration/00_req_step_15_risks_open_questions.md` | 已完成 | 回填正式 §15 |
| `design-calibration/00_req_step_16_traceability_matrix.md` | 已完成 | 回填正式 §16 |
| 旧 `projects/L4-sandbox/README.md` 与旧 `00/01/02/03/05/06` | 已审计 | 只作为 historical material 保留,不做局部修补基线 |
| `projects/L4-sandbox/00-需求文档.md` | 已重建 | 按 Step 1~16 结论完成正式装配,等待用户审查 |

---

## 3. 正式章节来源映射

| 正式章节 | 来源中间产物 |
|---|---|
| §1 与上游文档的关系声明 | `00_req_step_01_upstream_relation.md` |
| §2 本仓定位与边界 | `00_req_step_02_position_boundary.md` |
| §3 背景与问题定义 | `00_req_step_03_problem_context.md` |
| §4 目标与非目标 | `00_req_step_04_goals_non_goals.md` |
| §5 用户与角色 | `00_req_step_05_users_roles.md` |
| §6 使用方与依赖 | `00_req_step_06_consumers_dependencies.md` |
| §7 核心能力闭环 | `00_req_step_07_core_capability_loop.md` |
| §8 用户故事 | `00_req_step_08_user_stories.md` |
| §9 功能需求 | `00_req_step_09_functional_requirements.md` |
| §10 业务规则与边界约束 | `00_req_step_10_business_rules_boundaries.md` |
| §11 数据需求与数据归属 | `00_req_step_11_data_ownership.md` |
| §12 接口与依赖 | `00_req_step_12_interfaces_dependencies.md` |
| §13 非功能需求 | `00_req_step_13_non_functional_requirements.md` |
| §14 验收标准 | `00_req_step_14_acceptance_criteria.md` |
| §15 风险与待确认事项 | `00_req_step_15_risks_open_questions.md` |
| §16 需求追溯矩阵 | `00_req_step_16_traceability_matrix.md` |

---

## 4. 组装口径

| 项 | 本步口径 |
|---|---|
| 正式文档结构 | 使用 `0. 文档说明` + `1~16` 正式章节结构,与当前 full-restart 讨论链一一对应 |
| 旧文档处理 | 旧 `00-需求文档.md` 只作 historical material,正式文档按 Step 1~16 结论重建 |
| 内容来源 | 只摘录 Step 1~16 已确认结论,不补现场新需求 |
| 术语统一 | 统一使用 `C-SBX-*`、`US-SBX-*`、`FR-SBX-*`、`BR-SBX-*`、`AC-SBX-*`、`VF-SBX-*` |
| 章节粒度 | 参考 `projects/L1-governance`、`projects/L1-artifact` 的正式文档粒度,尤其 Step 5 以后保持可落码承接密度 |
| 不进入正式正文的内容 | API path、DTO schema、Rust struct、repository、handler、配置 key、后端选型定稿、真实 benchmark、真实 evidence alias、真实 run_id、真实签署 |
| 外围增强处理 | `US/FR-SBX-E*` 进入正式文档,但不升级为核心通过前提 |
| NFR 处理 | 零容忍边界写为正式口径,历史时延 / 开销 / 可用率数字只保留为候选目标 |

---

## 5. 动作记录

| 动作 | 结果 |
|---|---|
| 读取 Step 1~16 中间产物、Step 17 SOP 和正式书写规范 | 已完成 |
| 创建本文件 `00_req_step_17_formal_document_assembly.md` | 已完成 |
| 删除旧 `00-需求文档.md` 的旧结构心智,按当前 0~16 结构重组 | 已完成 |
| 在正式文档每章补充 `校准来源` 与 `延伸阅读` | 已完成 |
| 把 Step 8~16 的正式编号、边界与追溯结果写入正式正文 | 已完成 |
| 保持 `01-架构设计.md` 未开工 | 已完成 |

---

## 6. 自检结论

| 检查项 | 当前结论 |
|---|---|
| 正式文档是否逐章标注校准来源 | 通过 |
| 正式文档是否覆盖 Step 1~16 | 通过 |
| 是否新增了未在 Step 1~16 确认的功能、规则、数据或接口 | 否 |
| 是否把旧 README / 旧正式文档直接当作当前基线回填 | 否 |
| 是否把工具语义、runtime 主线、member lifecycle、artifact truth 或 observability store truth 写入 sandbox | 否 |
| 是否写入 API path、DTO schema、Rust struct、repository、handler 或配置 key | 否 |
| 是否伪造 commit、run_id、evidence alias、测试结果或验收签署 | 否 |

---

## 7. 后续进入条件

- 正式 `projects/L4-sandbox/00-需求文档.md` 已重建完成。
- `00_requirements_calibration_flow.md` 与 `project_execution_ledger.md` 已更新到 Step 17 完成状态。
- 当前必须先等待用户审查正式 `00-需求文档.md`。
- 用户明确确认后,才允许进入 `01-架构设计.md` 的架构 SOP 开工准备。

## 8. Post-closeout disposition assembly (`DC-03`)

本轮已先读 Step 14/15 最终闭环产物及完整下游正式链。允许在正式 `00` 的风险与待确认章节增加 current disposition
附录：把当时合理挂起的接口、配置、测试、验收和实施问题分类为 `resolved_by_downstream_design`、
`activation_dependency` 或 `future_scope_design_reopen`。不得改写原始需求语义，也不得引入 Rust/provider/脚本实现细节。

```text
assembly_authorization = DC-04_formal_00_current_disposition_only
historical_gap_preserved = yes
requirement_semantics_changed = no
runtime_fact_created = no
next_allowed_action = update_formal_00_then_continue_authorized_closeout
```

## 9. PHYSICAL EOF DC-06 final audit disposition

Step 17 已反向审计正式 `00` 的 current disposition、下游解析引用与真实性边界。DC-06 没有发现需要修改需求语义或
正式正文的新差异；DC-04 的 current disposition 回填保持有效。

```text
dc_06_assembly_disposition = audit_only_no_formal_delta
formal_00_delta_in_dc_06 = none
requirement_semantics_changed = no
runtime_fact_created = no
design_audit_status = completed_design_static_only
```
