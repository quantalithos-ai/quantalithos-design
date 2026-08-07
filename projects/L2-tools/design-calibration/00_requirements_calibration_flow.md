# L2-tools 00 需求文档全量重启校准流程

> 创建日期: 2026-08-02
> 状态: 00_completed_stop_review
> 当前模式: full-restart
> 项目目录: `projects/L2-tools`
> 正式文档目标: `projects/L2-tools/00-需求文档.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 本轮边界: 只完成需求 Step 1~17 和正式 00 装配;随后等待用户审阅。

---

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 17 completed stop review | `formal_document_assembly:completed_stop_review` | `blocked` | 最终全链审计已通过,正式 00 已完成;当前仅由用户审阅门禁阻塞文档切换。 | `wait_user_review_to_01_architecture`;未经用户明确确认不得进入 01。 | `project_execution_ledger.md`;`00_req_step_16_traceability_matrix.md`;`00_req_step_17_formal_document_assembly.md`;`../00-需求文档.md` |

---

## 2. 执行纪律

- 严格执行 Step 1 -> Step 17,不得合并 Step。
- 每个 Step 文件都维护“Step 内计划”“问题回答”“诊断”“取舍”“结构化中间产物”“回填草稿”“自检与门禁”。
- 当前 Step 通过前不创建未来 Step 文件。
- 旧 L2 README / `00/01/02/03/05/06` 只能在独立结论形成后做 historical-material 差异审计。
- Step 7 先固定核心能力节点和顺序;Step 8~14 必须逐节点记录小循环停审。
- 正式 `00-需求文档.md` 仅在 Step 17 三层门禁通过后删除并重建。
- 正式章节逐章列具体 calibration source,不合并写“Step 1~16”。
- 需求阶段不写 struct、DTO 字段、API path、event schema、repository、handler、事务或部署形态。
- 不伪造实现 / 运行 / 测试 / evidence / 验收事实。

---

## 3. 公共必读文档

| 文档 | 用途 | 状态 |
|---|---|---|
| `standards/document/设计文档编写通则.md` | 正式文档通用结构、追溯和评审纪律。 | read |
| `standards/document/设计文档讨论中间产物规范.md` | 三层台账、full-restart、Step 内计划与写入门禁。 | read |
| `standards/document/设计真相源闭环与可落码性标准.md` | owner / consumer / handoff 闭环及不可伪造约束。 | read |
| `standards/document/全局项目依赖关系与裁剪规则.md` | Step 6 / Step 12 依赖裁剪格式和层级顺序。 | read |
| `standards/document/需求文档讨论流程_SOP.md` | 需求 17 Step 和能力节点小循环。 | read |
| `standards/document/需求文档书写规范.md` | 正式 16 章结构、固定表格、编号与门禁。 | read |
| `projects/L2-tools/README.md`、旧 `00/01/02/03/05/06` | historical-material 差异审计。 | read_historical |
| `projects/L3-capability-hub/00-需求文档.md` ~ `07-实施计划.md` | capability identity / descriptor / exposure / controlled consumer boundary。 | read_current_workspace |
| `projects/L4-sandbox/00-需求文档.md` ~ `07-实施计划.md` | isolation execution / capture / failure / handoff truth boundary。 | read_current_workspace |
| `projects/L4-observability/00-需求文档.md` ~ `07-实施计划.md` | body-free safe material / no-write truth boundary。 | read_current_workspace_with_status_conflict |
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | 当前编译期共享基础契约关系;Tools-specific schema / contract authority 仍待闭口。 | read_current_workspace |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | 当前事件协作关系;不得假定 Tools-specific producer / source / route 或 schema。 | read_current_workspace |
| `projects/L0-sdk/00-需求文档.md` ~ `07-实施计划.md` | downstream client boundary;不得把 SDK client 合入 L2。 | read_current_workspace |

---

## 4. Step 总流程计划

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `00_req_step_01_upstream_relation.md` | 与上游文档的关系声明 | done | pass | 创建 Step 2。 | authority / auxiliary / historical / blocker 分层,不重定义上游。 |
| 2 | `00_req_step_02_position_boundary.md` | 本仓定位与边界 | done | pass | 创建 Step 3。 | 清晰定义 runtime 行动契约层中的工具调用语义契约真相边界。 |
| 3 | `00_req_step_03_problem_context.md` | 背景与问题定义 | done | pass | 创建 Step 4。 | 问题不混入目标或方案。 |
| 4 | `00_req_step_04_goals_non_goals.md` | 目标与非目标 | done | pass | 创建 Step 5。 | 目标可验证,非目标有明确 owner。 |
| 5 | `00_req_step_05_users_roles.md` | 用户与角色 | done | pass | 创建 Step 6。 | 人类角色与系统角色分开。 |
| 6 | `00_req_step_06_consumers_dependencies.md` | 使用方与依赖 | done | pass | 创建 Step 7。 | 四个固定依赖裁剪产物齐全。 |
| 7 | `00_req_step_07_core_capability_loop.md` | 核心能力闭环 | done_stop_review | pass | 等待用户审阅,不得自动进入 Step 8。 | 五节点、逻辑顺序、进入 / 退出条件、条件路径和停审表齐全。 |
| 8 | `00_req_step_08_user_stories.md` | 用户故事 | done_stop_review | pass | 创建 Step 9。 | 五节点逐一收敛,无孤儿故事。 |
| 9 | `00_req_step_09_functional_requirements.md` | 功能需求 | done_stop_review | pass | 创建 Step 10。 | 17 项核心 FR 与 6 项外围 FR 回指节点和故事,无 CRUD / API 拆分。 |
| 10 | `00_req_step_10_business_rules_boundaries.md` | 业务规则与边界 | done_stop_review | pass | 创建 Step 11。 | 42 条核心规则和 1 条外围规则有功能 / 边界来源,无实现校验。 |
| 11 | `00_req_step_11_data_ownership.md` | 数据需求与归属 | done_stop_review | pass | 创建 Step 12。 | 34 项数据覆盖 truth / snapshot / ref / forbidden body,无多 truth owner。 |
| 12 | `00_req_step_12_interfaces_dependencies.md` | 接口与依赖 | done_stop_review | pass | 创建 Step 13。 | 19 核心 / 4 外围接口与 8 条依赖边界完整;Step 16 复审补齐同步 authorization 消费 seam,候选状态未误升。 |
| 13 | `00_req_step_13_non_functional_requirements.md` | 非功能需求 | done_stop_review | pass | 创建 Step 14。 | 19 项 NFR 按六类逐项判断,均有非空口径,无伪 SLA。 |
| 14 | `00_req_step_14_acceptance_criteria.md` | 验收标准 | done_stop_review | pass | 创建 Step 15。 | 39 项 AC、13 项 VF 闭合,无测试结果。 |
| 15 | `00_req_step_15_risks_open_questions.md` | 风险与待确认事项 | done_stop_review | pass | 创建 Step 16。 | 12 项风险、8 项待确认及 9 项开放 blocker 的影响与当前约束清晰。 |
| 16 | `00_req_step_16_traceability_matrix.md` | 需求追溯矩阵 | done_stop_review | pass | 创建 Step 17。 | 以 FR 为主轴且孤儿项归零。 |
| 17 | `00_req_step_17_formal_document_assembly.md` | 正式文档装配 | completed_stop_review | pass | `wait_user_review_to_01_architecture`。 | 16 章、16 个来源块、对象全集、23 行固定六列矩阵与依赖裁剪终审通过;九项 blocker 保持开放且不阻塞需求文档完成。 |

---

## 5. 核心能力小循环固定结论

Step 7 已从仓存在必要性重新验证并固定以下五个能力节点。它们是后续 Step 8~14 的讨论顺序和结构锚点,不是运行时调用顺序、接口时序、事件传播顺序或开发优先级:

```text
C-L2T-1 工具能够以稳定身份和完整定义进入正式契约语境
C-L2T-2 工具定义的外部能力关联边界能够受控成立且不复制外部真相
C-L2T-3 正式工具契约能够形成统一且可消费的规范调用语义
C-L2T-4 规范调用的执行前置约束与条件化隔离交接能够成立
C-L2T-5 规范调用的结果、错误、工具域审计与安全交接能够成立
```

条件路径已固定:纯本地工具可以在正式声明无需外部关联后从 C-L2T-1 进入 C-L2T-3;capability-bound 工具必须承接 C-L2T-2;执行前拒绝 / 等待 / fail-closed 不伪造 Sandbox run,但必须进入 C-L2T-5 形成无执行 outcome / error / audit;外部观察或事件 handoff 失败不得反写本地结果。

---

## 6. Historical material 差异审计规则

旧材料只能在当前 Step 独立结论形成后检查:

| 检查项 | 处理方式 |
|---|---|
| Python 同进程包 vs Rust RPC / HTTP 服务冲突 | 记录冲突,当前需求不锁技术和部署形态。 |
| builtin / MCP Client / Role extras / member-images | 默认排除;除非当前 authority 明确重开。 |
| 本地 capability registry / allow-deny / policy truth | 拒绝继承,分别守住 Hub 与 governance owner。 |
| invocation DB / history / replay / observability store | 拒绝继承,只讨论 L2 自身结果 / 审计契约真相。 |
| 旧事件名、错误码、SLA、测试 / 验收声明 | 不继承且不视为事实。 |

---

## 7. 当前门禁

```text
document_status = 00_completed_stop_review
current_step = 17 formal_document_assembly completed_stop_review
current_module = formal_document_assembly:completed_stop_review
gate_status = blocked
gate_reason = final full-chain audit passed and formal 00 is complete; document transition awaits explicit user confirmation; L2T-UP-001~009 remain open but do not block requirements completion
next_allowed_action = wait_user_review_to_01_architecture
future_step_files_allowed = false
formal_00_write_allowed = false
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
