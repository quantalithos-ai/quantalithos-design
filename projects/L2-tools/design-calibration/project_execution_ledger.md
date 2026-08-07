# L2-tools 项目设计讨论执行台账

> 创建日期: 2026-08-02
> 当前模式: full-restart
> 当前任务: `07-实施计划.md` full-restart 已完成并停审；正式设计链 `00~07` 已闭合，实施尚未启动
> 项目目录: `projects/L2-tools`

---

## 1. 当前恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 细节入口 |
|---|---|---|---|---|---|---|
| `07-实施计划.md` | Step 13 completed / pass; stop review | `formal_document_assembly:completed_stop_review` | `pass`（design document gate） | 正式 07 已按 13 章装配；1 个 implementation ledger 与 26 个非空 boundary skeleton 已创建并通过结构、编号、状态和事实边界终检。该 pass 只表示设计交付闭合；实现仍为 `not_started / blocked`。 | `wait_for_user_review`；不得据此进入实现、激活 future boundary、填写执行事实或提交 commit。 | `design-calibration/07_implementation_plan_calibration_flow.md`; `design-calibration/07_implementation_plan_step_13_formal_document_assembly.md`; `design-calibration/implementation_execution_ledger.md`。 |

---

## 2. 文档级进度

| 文档 | flow 文件 | 状态 | 当前 Step | 文档切换门禁 | blocker |
|---|---|---|---|---|---|
| `00-需求文档.md` | `design-calibration/00_requirements_calibration_flow.md` | `00_completed_stop_review` | Step 17 completed stop review | review gate 已由用户明确确认;正式 00 仍不可再写 | 无新增上游 blocker;`L2T-UP-001~009` 继续开放但不阻塞需求文档完成。最终全链审计已通过。 |
| `01-架构设计.md` | `design-calibration/01_architecture_calibration_flow.md` | `01_completed_stop_review` | Step 16 completed stop review | 正式 01 禁止继续写;等待用户审阅和文档切换确认 | `L2T-UP-001~009` 不阻塞逻辑架构完成,但继续阻塞具体 contract/schema/mapping/route/client/measurement/readiness 声明。 |
| `02-概要设计.md` | `design-calibration/02_hld_calibration_flow.md` | `02_completed_stop_review` | Step 14 completed stop review | review gate 已由用户明确确认；正式 02 写入仍关闭 | 无新增；`L2T-UP-001~009` 继续开放并进入 03 blocked boundary。 |
| `03-详细设计.md` | `design-calibration/03_ddd_calibration_flow.md` | `completed / stop review` | Step 19 completed / pass | review gate 已由用户以“继续”解除；正式 03 写入保持关闭 | `L2T-UP-001~009` 不阻塞 local/negative design，但继续阻塞 external positive provider/schema/mapping/route/client/readiness；目标实现仓当前不存在。 |
| `04-配置设计.md` | `design-calibration/04_config_calibration_flow.md` | `04_completed_stop_review` | Step 15 completed stop review | 正式04写入已关闭；用户已授权切换到05 | `L2T-UP-001~009` 继续开放；不阻塞P0正式04，阻塞对应positive profile/readiness。 |
| `05-测试方案.md` | `design-calibration/05_test_plan_calibration_flow.md` | `05_completed_stop_review` | Step 15 completed / pass | review gate 已由用户明确确认并授权切换到 06；正式 05 写入保持关闭 | 无新增；`L2T-UP-001~009` 继续开放，正向 provider/readiness 保持 blocked/conditional。 |
| `06-验收标准.md` | `design-calibration/06_acceptance_calibration_flow.md` | `06_completed_stop_review` | Step 15 completed / pass | review gate 已由用户明确确认并授权切换到 07；正式 06 写入保持关闭 | 无新增；`L2T-UP-001~009` 继续开放但不阻塞验收合同设计完成，受影响 external positive qualification 仍 blocked/conditional/future。 |
| `07-实施计划.md` | `design-calibration/07_implementation_plan_calibration_flow.md` | `07_completed_stop_review` | Step 13 completed / pass | 正式 07 写入已关闭；停在最终正式文档审阅点 | 无新增；`L2T-UP-001~009` 继续开放并只阻塞相应 external positive qualification。目标实现仓不存在且 immutable design baseline 未冻结，因此 `commit-01-a` 保持 `blocked / wait_design`。 |

---

## 3. 当前执行规则

| 规则 | 状态 | 说明 |
|---|---|---|
| 只做设计仓文档 | active | 不实现代码,不修改实现仓。 |
| full-restart | active | 从 `00` Step 1 建立新结论;旧正式链和 README 仅作 historical material。 |
| 正式文档串行 | satisfied | `00 -> 01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07` 已按序完成并停在正式 07 审阅点。 |
| Step 串行 | satisfied for 07 | 07 已按 Step 1~13 串行完成；正式 07 只在 Step 13 装配并已关闭写入。 |
| 单 agent 串行 | active | 用户明确要求不使用多 agent；07 全流程由单一 agent 完成。 |
| 正式文档后置装配 | satisfied | 正式 07 在 Step 1~12 完成后由 Step 13 整体装配；implementation ledger 与 26 个 skeleton 同步创建。 |
| 概要组成部分小循环 | satisfied | Step 5~9 已按组成部分完成 capability、对象、接口、流、状态、逐项停审与跨部分审计。 |
| 不伪造事实 | active | 不写实现 commit、run_id、真实测试结果、验收签署或 evidence alias。 |
| 不自动跨正式文档 | satisfied | 07 是正式链最后一份文档，当前停审；不自动转入实现。 |
| 不提交 | active | 当前无提交授权,不创建 commit。 |

---

## 4. 正式 / 历史材料处理台账

| 材料 | 当前定位 | 处理口径 |
|---|---|---|
| `projects/L2-tools/README.md` | `historical_material` | 仅作旧定位和冲突线索;Python 同进程包、builtin 库存、MCP Client、Role extras、member-images 装配均不继承。 |
| 旧 `projects/L2-tools/00-需求文档.md` | `historical_material` | 旧 13 节、功能表、SLA、事件名、MCP / extras 主线不作当前需求基线。 |
| 旧 `projects/L2-tools/01-架构设计.md` | `historical_material` | Python monorepo / 同进程形态只作差异审计输入。 |
| 旧 `projects/L2-tools/02-概要设计.md` | `historical_material` | 旧对象、接口和流程不得反推当前需求。 |
| 旧 `projects/L2-tools/03-详细设计.md` | `historical_material` | Rust 服务、RPC / HTTP、持久化与 replay 等与旧定位冲突,只作污染检查。 |
| 旧 `projects/L2-tools/05-测试方案.md` | `historical_material` | 旧用例、阈值和测试结果口径不作当前事实。 |
| 旧 `projects/L2-tools/06-验收标准.md` | `historical_material` | 旧验收项、签署和成熟度声明不作当前事实。 |

---

## 5. 上游 blocker / pending 台账

| ID | 上游位置 | 状态 | 影响范围 | 当前处理口径 |
|---|---|---|---|---|
| `L2T-UP-001` | `L4-sandbox` policy ownership | `open_upstream_boundary` | Step 10/12/15;后续 01~04 | Sandbox 对 `ToolPolicy` owner 的旧声明引用已失效的 L2 historical material;本轮只固定 L2 声明工具风险与执行要求,不拥有 effective governance / authorization truth;未闭口时 fail closed。 |
| `L2T-UP-002` | `L4-sandbox` policy source matrix / high-risk taxonomy | `open_upstream_contract` | Step 10/12/15;后续 02~05 | 不在 L2 私造来源矩阵或高风险分类;需求层保留风险语义和拒绝边界。 |
| `L2T-UP-003` | `L4-sandbox` generic execution mapping | `planned_l2_adapter_boundary` | Step 12/15;后续 02/03 | Sandbox 未定义 ToolInvocation 到 generic command chain、capture/failure 到 ToolInvocationResult 的映射;归 L2 后续消费 adapter 设计,不阻塞需求定位。 |
| `L2T-UP-004` | `L4-sandbox` downstream receipt / dead-letter handoff | `open_upstream_contract` | Step 12/15;后续 02~07 | L2 不伪造 receipt、route、dead-letter 协议;未闭合时不得声明交付可执行。 |
| `L2T-UP-005` | `L4-observability` producer/source family | `open_integration_boundary` | Step 12/15;后续 01~07 | 当前无 Tools-specific producer/source family;只能保留 body-free safe material handoff 需求,不得私造 enum、route 或 schema。 |
| `L2T-UP-006` | `L4-observability` 正式链状态 | `upstream_status_conflict` | 后续 readiness / handoff | 当前 `03` 的未完成声明与已有 `04~07` 文件冲突;只把正式内容视为 current workspace input,不把 implementation readiness 当事实。 |
| `L2T-UP-007` | 当前 workspace 基线 | `uncommitted_upstream_input` | 全文来源声明 | 全局依赖规则和 Observability 有用户未提交改动;不得声称冻结 commit baseline。 |
| `L2T-UP-008` | `L0-core` shared contract coverage | `upstream_contract_candidate` | Step 6/12/15;后续 01~03 | Core 需求声明向 L2-tools 提供共享基础类型、错误、追踪和相关事件 / 服务契约,但当前概要 / 详细设计没有 tools-specific shared schema;需求只引用共享类别,进入跨仓字段与协议定稿前必须确认正式 contract authority。 |
| `L2T-UP-009` | `L0-sdk` tools client seam | `downstream_contract_pending` | Step 6/12/15;后续 SDK 联调 | SDK 当前只有 generic formal API / fake boundary,没有已闭合 tools-specific client;L2 只声明未来可消费的正式服务边界,不得承诺现成 SDK client。 |

这些缺口不阻塞正式 `07-实施计划.md` 的 local/negative/blocked-aware 实施合同设计完成，但任何受影响的实际验收、实施和 future positive qualification 必须在 owner 闭口后验证，或继续以显式 fail-closed / blocked gate 承接。当前没有新增上游 blocker。

---

## 6. 恢复顺序

停在 07 审阅点恢复时，按顺序读取：

```text
1. design-calibration/project_execution_ledger.md
2. design-calibration/07_implementation_plan_calibration_flow.md
3. design-calibration/07_implementation_plan_step_13_formal_document_assembly.md
4. 当前正式 07-实施计划.md，重点复核 §3、§6、§7、§10~§12
5. design-calibration/implementation_execution_ledger.md
6. design-calibration/implementation-boundaries/commit-01-a.md
7. 等待用户审阅；不得修改正式 07、进入实现或把 planned skeleton 写成执行事实
```

若未来由独立实现流程接手，除上述恢复入口外必须重读：

```text
1. standards/document/代码实施台账与门禁规范.md
2. standards/document/设计真相源闭环与可落码性标准.md
3. standards/document/全局项目依赖关系与裁剪规则.md
4. standards/document/子项目目录与代码文件组织规范.md
5. standards/coding/rust.md
6. 当前正式 00-需求文档.md 至 07-实施计划.md
7. current boundary 指定的精确 formal/calibration sources
```

---

## 7. 当前 next_allowed_action

```text
current_document = 07-实施计划.md
document_status = 07_completed_stop_review
current_step = Step 13 completed / pass; stop review
current_module = formal_document_assembly:completed_stop_review
gate_status = pass
gate_reason = Formal 07 has 13 unique chapters and 13 concrete calibration sources; the implementation ledger and all 26 non-empty boundary skeletons passed inventory, structure, status, denominator, blocker and truthfulness audits.
next_allowed_action = wait_for_user_review
future_step_files_allowed = false_no_later_formal_document
formal_document_write_allowed = false
next_formal_document = none_formal_chain_complete
implementation_status = not_started
implementation_gate_status = blocked
current_boundary = commit-01-a
boundary_next_allowed_action = wait_design
implementation_repo = /home/aris/Projects/quantalithos-tools absent
design_baseline = not_fixed_until_handoff
commit_required = false
```
