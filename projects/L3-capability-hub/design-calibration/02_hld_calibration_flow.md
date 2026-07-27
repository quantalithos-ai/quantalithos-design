# L3-capability-hub 02 概要设计全量重启校准流程

> 创建日期: 2026-07-08
> 状态: `02_completed_design_task_wait_implementation_handoff`
> 当前模式: full-restart
> 设计仓: `/home/aris/Projects/quantalithos-design`
> 项目目录: `projects/L3-capability-hub`
> 正式文档目标: `projects/L3-capability-hub/02-概要设计.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 本轮口径: 以新版 `00-需求文档.md` 和新版 `01-架构设计.md` 作为概要设计唯一直接上游;旧 `02-概要设计.md`、旧 README 和旧 `03/05/06` 只作 historical material / 差异审计输入。

---

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 14 | `整理正式概要设计文档:completed` | `design_task_completed` | 正式 `02-概要设计.md` 已按 Step 1~13 重建并由后续 `03~07` 承接；T070/T071/T072 已完成最终收口。 | `wait_for_authorized_implementation_handoff` | `project_execution_ledger.md`;`02_hld_calibration_flow.md`;`02_hld_step_01_upstream_boundary.md`至`02_hld_step_14_formal_document_assembly.md`;正式 `00~07`;T071 final audit |

---

## 2. 执行纪律

本流程只负责 `L3-capability-hub` 的 `02-概要设计.md` full-restart。执行时必须按概要设计 SOP 一个 Step 一个 Step 推进。

固定纪律:

- 每次恢复先读取 `project_execution_ledger.md`,再读取本文档,再读取当前 Step 文件。
- 正式 `02-概要设计.md` 已在 Step 14 重建;后续不得在进入 `03` 前继续扩写概要结论。
- 旧 `README.md`、旧 `02-概要设计.md`、旧 `03/05/06` 只能作 historical material / 差异审计输入,不得作为新版概要真相源直接继承。
- 当前已完成 Step 1~14;不得创建 `03` 中间产物或正式文档,除非用户审查 Step 14 后明确同意继续。
- 每次用户确认只推进一个当前 Step;不得跨正式文档合并。
- 概要阶段不得写完整字段全集、完整函数实现、DDL、协议 schema、事件 payload、配置 key、测试结果、验收签署、run_id、真实 evidence alias 或实现 commit。
- 对 `L3-capability-hub` 必须持续闭合 capability identity、capability registry、adapter descriptor、governance seam、method relation、formal exposure / controlled consumer view 和 traceability / impact 语义,不得把 runtime execution、tools execution、governance approval、method body、SDK client、marketplace listing、secret / KMS、cost / billing、provider runtime 或 observability store 混入本仓。

---

## 3. 稳定输入与处理口径

| 输入 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `projects/L3-capability-hub/00-需求文档.md` | current_reviewed_baseline | 作为概要设计需求边界,承接 capability access truth 定位、`C-CH-1~5`、`FR-CH-001~016`、规则边界、数据归属、接口依赖、NFR、验收和风险红线。 |
| `projects/L3-capability-hub/01-架构设计.md` | current_architecture_baseline_reviewed_for_02_start | 作为概要设计架构边界,承接独立 capability access truth、五个核心子域、正式承接边界、运行承载、依赖裁剪、数据分层、交互分层、技术机制和挂起事项。 |
| `design-calibration/02_hld_step_01_upstream_boundary.md` ~ `02_hld_step_14_formal_document_assembly.md` | current_hld_baseline_detail | 作为正式 `02-概要设计.md` 的唯一过程来源和回填依据。 |
| `projects/L3-capability-hub/README.md` | historical_material | 只保留“外部 MCP / A2A / API 集成中心”方向线索;不继承旧 Provider / Cost / KMS / execution gateway 主线。 |
| 旧版 `projects/L3-capability-hub/02-概要设计.md` | superseded_historical_material | 已被 Step 14 重建的正式 `02-概要设计.md` 取代;旧主线只保留在 git 历史和差异审计口径中。 |
| `projects/L3-capability-hub/03-详细设计.md` | historical_material | 后续进入 `03` 时审计;当前不得反推对象、接口、状态、存储和实现边界。 |
| `projects/L3-capability-hub/04-配置设计.md` | missing_downstream | 后续进入 `04` 时按配置 SOP 重建。 |
| `projects/L3-capability-hub/05-测试方案.md` / `06-验收标准.md` | historical_material | 后续测试 / 验收重启时审计;当前不作为真实测试和签署来源。 |
| `projects/L3-capability-hub/07-实施计划.md` | missing_downstream | 后续进入 `07` 时同步创建 implementation ledger 和 planned boundary skeleton。 |

---

## 4. Step 总任务表

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `02_hld_step_01_upstream_boundary.md` | 确认上游输入边界 | done | pass | Step 14 已完成;当前等待用户审查 Step 14。 | 已明确承接需求 / 架构结论、稳定输入、未收稳输入、本文不再回答和必须回答的问题;未展开代码主体、对象、接口、流程或状态。 |
| 2 | `02_hld_step_02_goals_scope.md` | 明确本仓设计目标与当前范围 | done | pass | Step 14 已完成;当前等待用户审查 Step 14。 | 设计目标、范围、非范围和当前深度收稳。 |
| 3 | `02_hld_step_03_constraints.md` | 收稳约束条件 | done | pass | Step 14 已完成;当前等待用户审查 Step 14。 | 影响结构判断的约束已收稳,且未写实现策略、数据库约束、部署约束、协议 schema、测试用例或实施计划。 |
| 4 | `02_hld_step_04_code_subject_framework.md` | 代码主体框架映射 | done | pass | Step 14 已完成;当前等待用户审查 Step 14。 | 架构语义已映射到代码主体骨架和实现分层,已输出两张 ASCII 图,未下沉到目录、文件路径或完整契约。 |
| 5 | `02_hld_step_05_components_boundary.md` | 主要组成部分、职责与边界 | done | pass | Step 14 已完成;当前等待用户审查 Step 14。 | 主要组成部分、职责、非职责、功能 / capability、代码主体、对象候选池、交互总图和跨组成部分闭环审计已收稳。 |
| 6 | `02_hld_step_06_key_objects.md` | 关键对象轮廓 | done | pass | Step 14 已完成;当前等待用户审查 Step 14。 | 已从 Step 5 候选池正式化关键对象,字段 / 函数保持骨架层级,完成对象停审、反查和跨对象审计。 |
| 7 | `02_hld_step_07_api_interface_skeleton.md` | API / 接口骨架 | done | pass | Step 14 已完成;当前等待用户审查 Step 14。 | 已按 Command / Query / Inbound Event Consumer / Outbound Event / Operations Job / External Port Skeleton 分类,完成逐组成部分接口骨架、接口停审、反查和跨接口审计。 |
| 8 | `02_hld_step_08_processing_flows.md` | 关键处理流 / 重要函数数据流 | done | pass | Step 14 已完成;当前等待用户审查 Step 14。 | 已完成处理流候选池、通用处理流、逐组成部分独立处理流、Step 9 反查、跨处理流一致性审计和旧处理流污染审计。 |
| 9 | `02_hld_step_09_state_machine.md` | 状态定义与状态流转 | done | pass | Step 14 已完成;当前等待用户审查 Step 14。 | 已完成状态候选接收、多状态族边界、逐组成部分状态定义、允许 / 禁止迁移、状态流转图、状态传播关系、停审和跨状态一致性审计。 |
| 10 | `02_hld_step_10_exceptions_boundaries.md` | 异常与边界场景轮廓 | done | pass | Step 14 已完成;当前等待用户审查 Step 14。 | 已完成异常候选接收、异常与边界场景总览、按处理流族归类的异常口径、异常影响图、状态影响清单、停审和跨异常一致性审计。 |
| 11 | `02_hld_step_11_configuration_impact.md` | 配置影响轮廓 | done | pass | Step 14 已完成;当前等待用户审查 Step 14。 | 已完成配置影响候选识别、配置影响轮廓表、禁止配置化边界表、配置影响图、详细设计承接方向、`04` 后移说明和旧配置口径污染审计。 |
| 12 | `02_hld_step_12_detailed_design_handoff.md` | 详细设计承接清单 | done | pass | Step 14 已完成;当前等待用户审查 Step 14。 | `03` 需要承接的对象、接口、flow、状态、异常、配置和测试矩阵输入已收稳,并明确主语变更回退规则。 |
| 13 | `02_hld_step_13_risks_open_questions.md` | 设计风险与待确认事项 | done | pass | Step 14 已完成;当前等待用户审查 Step 14。 | 概要层风险、待确认和后续阻塞转换规则已收稳,并排除任务 / backlog / 已进入 Step 12 的稳定输入。 |
| 14 | `02_hld_step_14_formal_document_assembly.md` | 整理正式概要设计文档 | done_wait_review | pass_wait_review | 等待用户审查 Step 14;确认后进入 `03-详细设计.md` Step 1。 | 正式 `02-概要设计.md` 已按 14 章结构重建,每章有具体校准来源,无装配新增结论。 |

---

## 5. 文档级 blocker 台账

| Blocker ID | Step | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| CH-HLD-HIST-001 | Step 1~14 | resolved_for_02 | 旧 `02` 把 `ProviderContract`、`CapabilityDecision`、`CostRecord`、KMS / Vault、`QueryCapabilities`、policy refresh 和 execution gateway 写成概要主线。 | Step 1~14 已全部隔离为 historical material,正式 `02` 已按新版 `00/01` 和 Step 1~13 重建。 |
| CH-HLD-DOWNSTREAM-001 | downstream | open_downstream_not_blocking_02 | `04-配置设计.md`、`07-实施计划.md` 仍待后续按 SOP 重建。 | 不阻塞 `02` 完成;进入 `04` 和 `07` 时分别按新规则创建。 |
| CH-HLD-IMPLEMENTATION-001 | downstream | open_downstream_not_blocking_02 | implementation ledger 和 planned boundary skeleton 仅在 `07-实施计划.md` 完成时创建。 | 当前 Step 14 不创建,避免伪造实施边界或 evidence。 |

---

## 6. 当前 next_allowed_action

```text
`02-概要设计.md` full-restart 已完成 Step 14;
Step 14 `整理正式概要设计文档` 已完成,gate_status = pass_wait_review;
正式 `projects/L3-capability-hub/02-概要设计.md` 已按 14 章结构重建;
next_allowed_action = 等待用户审查 Step 14;
用户确认后才允许进入 `03-详细设计.md` Step 1;
进入 `03` 前必须读取详细设计 SOP 和详细设计书写规范;
当前不需要提交 commit,且未经用户明确要求不得提交。
```
## Final closure overlay

T072 已关闭本轮设计任务。本文前部的 Step 状态、历史恢复点和文档切换记录保留原始讨论轨迹；当前项目级恢复入口以 `project_execution_ledger.md` 和 `T071_full_restart_final_audit.md` 为准。

| field | value |
|---|---|
| formal_document | `02-概要设计.md` |
| document_status | `HLD design completed` |
| current_step | `Step 14 completed` |
| final_audit | `design-calibration/T071_full_restart_final_audit.md` |
| unresolved_upstream_design_blocker | `0` |
| implementation_status | `pre_implementation_blocked` |
| implementation_current_boundary | `commit-01-a` |
| implementation_next_allowed_action | `wait_design` |
| commit_required | `no` |

不得依据本文历史段落中的旧 `next_allowed_action` 重新进入已完成 Step。有效的下一动作是 `wait_for_authorized_implementation_handoff`；目标实现仓、immutable baseline、实现代码、测试 run、evidence instance、verdict、signoff 和 commit 均不存在。
