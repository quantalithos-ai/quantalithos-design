# L2-runtime 00 需求 Step 17: 正式文档装配门禁

> 创建日期: 2026-08-07
> 状态: done_stop_review
> 当前模式: full-restart
> 目标文件: `projects/L2-runtime/00-需求文档.md`

## 0. Step 开工确认

| 门禁层级 | 输入 | 当前状态 | gate_status |
|---|---|---|---|
| 项目级 | `project_execution_ledger.md`、全局依赖规则、upstream blocker 台账 | 允许装配 `00`,禁止进入 `01` | pass |
| 文档级 | `00_requirements_calibration_flow.md`、Step 1~16 | Step 16 已通过,允许进入 Step 17 | pass |
| Step / 模块级 | 来源映射、自检、历史污染审计 | 正式正文已装配并完成后置审计 | pass |

## 1. 装配前问题回答

| 问题 | 收口结论 |
|---|---|
| 正式正文承载什么? | 只承载 16 章已确认的需求结论、边界、编号、依赖类型、owner、blocker 和 truthfulness 约束。 |
| 讨论过程放哪里? | 保留在对应 `design-calibration/00_req_step_*.md`;正文每章通过具体来源块回链。 |
| 旧文件如何处理? | 旧 `README.md` 与旧正式 00/01/02/03/05/06 仅作 historical material;正式 00 删除并重建,不继承旧技术栈、对象、API、指标或执行事实。 |
| 开放 seam 如何表达? | 以 `pending` / `blocked` / `waiting` / `degraded` / `fail-closed` 写入;不写正向 readiness、实现或证据。 |
| 何时停审? | 正式 00 完成后立即更新台账并停审,不创建 01 的 Step 文件或正文。 |

## 2. 正式章节来源映射

| 正式章节 | 具体校准来源 |
|---:|---|
| 1 与上游文档的关系声明 | `design-calibration/00_req_step_01_upstream_relation.md` |
| 2 本仓定位与边界 | `design-calibration/00_req_step_02_position_boundary.md` |
| 3 背景与问题定义 | `design-calibration/00_req_step_03_problem_context.md` |
| 4 目标与非目标 | `design-calibration/00_req_step_04_goals_non_goals.md` |
| 5 用户与角色 | `design-calibration/00_req_step_05_users_roles.md` |
| 6 使用方与依赖 | `design-calibration/00_req_step_06_consumers_dependencies.md` |
| 7 核心能力闭环 | `design-calibration/00_req_step_07_core_capability_loop.md` |
| 8 用户故事 | `design-calibration/00_req_step_08_user_stories.md` |
| 9 功能需求 | `design-calibration/00_req_step_09_functional_requirements.md` |
| 10 业务规则与边界约束 | `design-calibration/00_req_step_10_business_rules_boundaries.md` |
| 11 数据需求与数据归属 | `design-calibration/00_req_step_11_data_ownership.md` |
| 12 接口与依赖 | `design-calibration/00_req_step_12_interfaces_dependencies.md` |
| 13 非功能需求 | `design-calibration/00_req_step_13_non_functional_requirements.md` |
| 14 验收标准 | `design-calibration/00_req_step_14_acceptance_criteria.md` |
| 15 风险与待确认事项 | `design-calibration/00_req_step_15_risks_open_questions.md`; `project_execution_ledger.md` |
| 16 需求追溯矩阵 | `design-calibration/00_req_step_16_traceability_matrix.md` |

## 3. 装配取舍与污染审计

| 输入 | 处置 |
|---|---|
| 旧 C1~C9 / StateGraph / ReAct / Python / 固定框架 | historical_material;不进入正式需求结论。 |
| 旧 loop / checkpoint / memory 固定 SLA | historical_material;无当前 workload / authority,不继承。 |
| 旧 API、IPC、RPC、event topic、DTO、repository / handler | historical_material;需求正文不写实现协议。 |
| 旧 provider、vector store、Tools / Sandbox / Observability 直连 | historical_material;按当前依赖裁剪重写为 seam / pending。 |
| 旧测试结果、run、artifact、report、evidence、签署 | 禁止继承;当前没有执行事实。 |
| `projects/L3-method-library/03-详细设计.md` 未提交改动 | blocker `L2R-UP-008`;仅引用当前工作区正式内容,不声称 immutable baseline。 |

## 4. 三层写入前检查

| 检查 | 结果 | 依据 |
|---|---|---|
| 项目级允许当前文档装配 | pass | 项目台账 Step 16 通过,下一动作已切换为 Step 17。 |
| 文档级允许 Step 17 | pass | Step 1~16 均 `gate_status=pass`,未越过串行门禁。 |
| Step 17 来源映射完整 | pass | 本文件第 2 节覆盖正式 16 章。 |
| 正文不新增未讨论结论 | pass | 只回填 Step 1~16 已定义编号与边界。 |
| blocker / pending 不被改写为 readiness | pass | 使用 fail-closed / blocked / waiting / pending 语义。 |
| 需求正文不滑入实现设计 | pass | 不写 DTO、API path、repository、事务、代码目录或 provider backend。 |
| 每章有具体校准来源块 | pass | 16 章逐章列出相对路径和延伸阅读。 |

## 5. 写入批次计划

| 批次 | 章节 | 状态 |
|---:|---|---|
| 1 | 元信息、1~4 | done |
| 2 | 5~8 | done |
| 3 | 9~12 | done |
| 4 | 13~16、文档状态 | done |

## 6. 正式文档后置自检

- 16 个正式章节均存在,顺序为 `1 -> 16`。
- 每章开头都有 `校准来源` 和 `延伸阅读` 块。
- 正式编号无悬空引用,尤其不再使用未定义的 `G-001~005` 或 `FR-E04`。
- `L2R-UP-001~008`、风险和待确认事项没有被写成已解决或 ready。
- 正文没有实现、测试结果、artifact / report / evidence、run_id、commit、签署或验收 verdict。
- 旧文档只作为历史输入,不在正文形成 authority。

### 6.1 后置自检结果

| 检查 | 结果 |
|---|---|
| 正式 16 章顺序完整 | pass |
| 16 个章节均有具体校准来源和延伸阅读 | pass |
| 核心故事 / 功能 / 规则 / 数据 / 接口 / NFR / 验收编号可追溯 | pass |
| 44 条业务规则、12 项风险、11 项待确认事项逐项保留 | pass |
| 第 16 章使用逐功能六列主矩阵 | pass |
| `L2R-UP-001~008` 仍为 pending / blocked 条件 | pass |
| 无实现、测试结果、artifact、report、evidence、verdict、签署或 readiness 事实 | pass |
| `git diff --check` | pass |

## 7. 当前门禁

```text
gate_status = blocked
gate_reason = formal_00_complete_but_user_review_confirmation_pending
next_allowed_action = await_user_review_confirmation_for_formal_00
formal_document_write_allowed = false
next_formal_document_allowed = false_until_user_confirmation
```
