# L2-tools 01 架构设计全量重启校准流程

> 创建日期: 2026-08-04
> 状态: completed_stop_review
> 当前模式: full-restart
> 设计仓: `/home/aris/Projects/quantalithos-design`
> 项目目录: `projects/L2-tools`
> 正式文档目标: `projects/L2-tools/01-架构设计.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 本轮口径: 当前正式 `00-需求文档.md` 是直接需求基线;旧 README 与旧 `01-架构设计.md` 仅作 historical material 和污染审计输入。

---

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 16 completed | `formal_document_assembly:completed_stop_review` | `pass` | 正式 01 已仅依据 Step 1~15 停审结论按固定 18 章重建;章节、来源、图、边界、依赖、数据、交互、风险、追溯、ADR、历史污染和事实纪律写后审计全部通过。 | `wait_user_review_before_02`;不得继续修改正式 01,不得创建 02 flow 或 Step 产物。 | `01_arch_step_16_formal_document_assembly.md`;正式 `../01-架构设计.md`;`01_arch_step_01_requirement_baseline.md`~`01_arch_step_15_adr_traceability.md` |

---

## 2. 执行纪律

本流程只负责 `L2-tools` 的 `01-架构设计.md` full-restart,必须按架构 SOP 逐 Step 推进。

- 每次恢复先读取 `project_execution_ledger.md`,再读取本 flow,再读取当前 Step 和全部前序 Step 文件。
- Flow 可以一次列出 Step 1~16 总计划,但未来 Step 中间产物只能在其前序 Step 已完成后创建。
- 每个 Step 必须先读取对应 SOP、书写规范、前序结论与本 Step 指定上游输入,再完成问题回答、材料诊断、设计取舍、结构化产物、回填草稿和门禁。
- Step 5、7、8、9、12、15 必须按架构单元逐个收敛并记录单元停审,最后完成跨单元审计。
- 正式 `01-架构设计.md` 只能在 Step 16 删除旧文件后,依据 Step 1~15 结论重建。
- 旧 README、旧正式 01 以及旧 02/03/05/06 只作 historical material;其中 Python 同进程包、builtin / MCP Client / inventory、Role extras、member-images、三态 executor、本地 registry / allowlist、固定事件名、错误码、SLA、ADR 和上线事实均不得继承。
- 架构阶段不写 DTO/schema/字段、API path、topic/event 名、数据库表、repository、handler、实现 commit boundary、测试结果、run、evidence alias 或验收签署。
- 当前依赖只使用 `compile`、`runtime`、`event` 三类;material handoff 不是第四种依赖类型。
- 未闭口的 authorization、Sandbox mapping / receipt、Observability route、Core shared contract 和 SDK client 必须保持 blocker / pending / future 状态,不得润色成 ready。
- 完成正式 01 后立即停审;未经用户再次明确确认不得创建 02 flow 或进入 `02-概要设计.md`。
- 当前无 commit 授权,不得提交。

---

## 3. 公共必读文档

| 文档 | 用途 | 状态 |
|---|---|---|
| `standards/document/设计文档编写通则.md` | 正式设计文档通用结构与事实纪律。 | read |
| `standards/document/设计文档讨论中间产物规范.md` | 三层台账、Step 中间产物和恢复门禁。 | read |
| `standards/document/设计真相源闭环与可落码性标准.md` | 真相源闭环、边界完整性与后续可落码要求。 | read |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 全局依赖基线和本项目依赖裁剪。 | read |
| `standards/document/架构设计讨论流程_SOP.md` | 架构 Step 1~16 顺序、问题、产出和门禁。 | read |
| `standards/document/架构设计书写规范.md` | 正式 01 的 18 章结构、表格和图规则。 | read |
| `projects/L2-tools/00-需求文档.md` | 当前架构的直接需求基线。 | read |
| `projects/L2-tools/design-calibration/00_req_step_*.md` | 需求边界、能力、数据、接口、风险和追溯细节。 | read_on_demand |
| `projects/L2-tools/README.md` | 旧定位和冲突线索。 | historical_material_read |
| `projects/L2-tools/01-架构设计.md` | 本轮全量重建后的正式架构基线;旧正文只保留在 Step 差异审计记录中。 | current_formal_completed |
| 六条指定上游正式链 `00~07` | Hub、Sandbox、Observability、Core、Bus、SDK 当前边界输入。 | read |
| `L1-governance`、`L1-artifact`、`L3-method-library`、`L3-capability-hub` 已完成 01 产物 | 粒度、Step 结构、架构单元停审和正式文档参考。 | read |

---

## 4. Step 总流程计划

| Step | 输出文件 | 主题 | 当前状态 | 前序依赖 | 核心输出 | 完成门禁 | next_allowed_action |
|---:|---|---|---|---|---|---|---|
| 1 | `01_arch_step_01_requirement_baseline.md` | 确认需求基线 | `done` | 正式 00 完成且用户已确认 | 架构需求基线、硬约束、未关闭需求风险 | 已区分稳定前提与开放风险,足以推导目标与约束。 | 已允许进入 Step 2。 |
| 2 | `01_arch_step_02_goals_constraints.md` | 明确架构目标与约束 | `done` | Step 1 | 驱动力、目标、不可变约束、取舍、非目标 | 结构目标和边界约束可判断,未预支技术方案。 | 已允许进入 Step 3。 |
| 3 | `01_arch_step_03_responsibility_boundary.md` | 职责边界 | `done` | Step 1~2 | 做 / 不做、易混淆职责、边界红线 | 本仓与 Runtime、Hub、authorization、Sandbox、Bus、Observability、SDK 等 owner 不串线。 | 已允许进入 Step 4。 |
| 4 | `01_arch_step_04_system_context.md` | 系统边界与上下文 | `done` | Step 1~3 | 系统上下文图、输入 / 输出面、边界说明 | 当前关系、条件关系和 future / excluded 关系不混画。 | 已允许进入 Step 5。 |
| 5 | `01_arch_step_05_bounded_context_subdomains.md` | 限界上下文与子域划分 | `done` | Step 1~4 | 架构单元、子域分类、统一语言、关系图 | 每个单元有职责、非职责和关系;完成单元停审与跨单元审计。 | 已允许进入 Step 6。 |
| 6 | `01_arch_step_06_container_deployment.md` | 容器 / 部署架构 | `done` | Step 1~5 | 逻辑运行单元、部署责任、隔离边界 | 不伪造技术栈、进程数量、数据库、broker 或平台事实。 | 已允许进入 Step 7。 |
| 7 | `01_arch_step_07_dependency_direction.md` | 依赖方向与层间约束 | `done` | Step 1~6 + 全局依赖规则 | 层间约束、裁剪表、分类表、禁止依赖表、裁剪图 | compile/runtime/event 分类完整,按单元停审且无第四类依赖。 | 已允许进入 Step 8。 |
| 8 | `01_arch_step_08_data_ownership_consistency.md` | 数据所有权与一致性策略 | `done` | Step 3、5、7 | truth/snapshot/ref/forbidden-body、时点锚定、一致性与失败口径 | 四类数据、14 单元 owner、A4/A5 attempt 分权和跨数据审计已通过。 | 已允许进入 Step 9。 |
| 9 | `01_arch_step_09_interactions_communication.md` | 关键交互与通信方式 | `done` | Step 4、5、7、8 | 同步、异步、后台交互及失败语义 | 16 场景、三类方式、14 单元停审与跨交互审计已通过。 | 已允许进入 Step 10。 |
| 10 | `01_arch_step_10_technology_choices.md` | 关键技术选型 | `done` | Step 6~9 | 技术机制选择、保留项、不选项 | 11 项机制均有问题、理由、代价和架构意义;未锁产品 / readiness。 | 已允许进入 Step 11。 |
| 11 | `01_arch_step_11_alternatives_tradeoffs.md` | 备选方案与取舍 | `done` | Step 2~10 | 关键路径备选、取舍、弃用方案 | 固定六列主表含四条有效路径;每条均有问题、收益、代价和正式结论,硬排除项未混入候选。 | 已允许进入 Step 12。 |
| 12 | `01_arch_step_12_cross_cutting_concerns.md` | 横切关注点 | `done` | Step 5、7~11 | 安全、审计、观测、配置、性能、可用性与降级边界 | 六类横切项、13 条具体约束和 14 个架构单元适用性均通过停审;跨约束无 unresolved 冲突。 | 已允许进入 Step 13。 |
| 13 | `01_arch_step_13_evolution_path.md` | 演进路线 | `done` | Step 2~12 | 当前核心、依赖闭口、外围增强和远期演进 | 四个结构阶段、九项可接受债务、八项不可接受债务及事实触发条件完整;无排期或 readiness 伪事实。 | 已允许进入 Step 14。 |
| 14 | `01_arch_step_14_risks_open_questions.md` | 风险与待确认事项 | `done` | Step 1~13 | 风险、开放问题、当前处理和后续阻塞点 | 九项风险、八项待确认和九项 blocker 全量承接,阻塞性明确,无问题被脑补关闭。 | 已允许进入 Step 15。 |
| 15 | `01_arch_step_15_adr_traceability.md` | ADR 与需求追溯 | `done` | Step 1~14 | 决策候选索引、需求追溯矩阵、漏项检查 | 九项长期决定全部回指正式来源和停审单元;全需求范围无孤儿,ADR 编号均为 `未建立`,开放 Q / UP 未被伪闭合。 | 已允许进入 Step 16。 |
| 16 | `01_arch_step_16_formal_document_assembly.md` | 整理正式文档 | `done_stop_review` | Step 1~15 | 重建正式 01、来源块、装配与最终审计 | 固定 18 章、18 组来源 / 延伸阅读、六幅图、全部主线与开放项通过写后全链审计。 | 等待用户审阅;未经确认不得进入 02。 |

---

## 5. 正式 / 历史材料处理状态

| 材料 | 当前状态 | 使用规则 |
|---|---|---|
| `projects/L2-tools/00-需求文档.md` | `current_baseline` | 当前架构第一权威输入,所有架构结论必须可追溯。 |
| `projects/L2-tools/design-calibration/00_req_step_*.md` | `current_baseline_detail` | 按当前 Step 需要读取,不得跳过正式 00 自行改口径。 |
| 旧 `projects/L2-tools/README.md` | `historical_material` | 仅识别旧定位、旧库存和旧装配污染。 |
| 当前 `projects/L2-tools/01-架构设计.md` | `current_formal_completed` | Step 16 已删除旧正文并按 Step 1~15 停审结论重建;正式 01 当前禁止继续写。 |
| 旧 `projects/L2-tools/02/03/05/06` | `historical_material` | 不得反向定义当前架构对象、协议、技术或状态。 |
| `projects/L2-tools/04-配置设计.md` | `missing` | 后续进入 04 时才补齐,不阻塞当前 01。 |
| `projects/L2-tools/07-实施计划.md` | `missing` | 后续进入 07 时才补齐并同步创建 implementation ledger / planned boundary skeleton。 |

---

## 6. 当前开放 blocker 台账

| Blocker | 状态 | 01 当前承接口径 | 后续阻塞点 |
|---|---|---|---|
| `L2T-UP-001~002` authorization owner/source/taxonomy | `open_upstream_boundary/contract` | 只确认条件性 authority consumption seam 和 fail-closed;不命名 owner、schema 或 taxonomy。 | 02~05/07 对应 authorization boundary ready。 |
| `L2T-UP-003` Sandbox generic execution mapping | `planned_l2_adapter_boundary` | 只确认 L2 semantic adapter responsibility 和 source-ref 边界;不定义 mapping。 | 02/03/05/06 mapping 与结果转换。 |
| `L2T-UP-004` Sandbox receipt/DLQ/feedback/cleanup seam | `open_upstream_contract` | 只记录 handoff 语境、尝试和缺口;不命名 receipt/route/status。 | 02~07 正向协议与实施边界。 |
| `L2T-UP-005~007` Observability producer/source/route/readiness 与 workspace 状态 | `open_integration_boundary` | 保留 event collaboration、安全材料和本地 gap;只称 current workspace input。 | 01~07 正向 route/evidence/readiness。 |
| `L2T-UP-008` Core Tools-specific shared contract authority | `upstream_contract_candidate` | Core compile 关系成立;具体 schema/package authority 仍开放。 | 01~03/05/07 shared boundary。 |
| `L2T-UP-009` SDK tools-specific client seam | `downstream_contract_pending` | 保持 future/excluded,不进入当前主链。 | SDK 独立设计和联调。 |

以上 blocker 不阻塞完成 01 的逻辑职责、上下文、依赖、数据、通信、横切和演进边界;它们阻塞具体合同、schema、route、ready 与 evidence 声明。

---

## 7. 当前 next_allowed_action

```text
current_document = 01-架构设计.md
document_status = 01_completed_stop_review
current_step = Step 16 formal_document_assembly completed
current_module = formal_document_assembly:completed_stop_review
gate_status = pass
gate_reason = the formal 18-chapter architecture document was rebuilt only from stopped Step 1 through 15 conclusions and passed the complete post-write audit while all open Q/UP seams remained explicit
next_allowed_action = wait_user_review_before_02
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```

当前 01 已完成并停审。若用户后续明确确认进入 02,应先读取 `standards/document/概要设计讨论流程_SOP.md`、`standards/document/概要设计书写规范.md`、正式 `00-需求文档.md`、本轮正式 `01-架构设计.md`、本 flow、Step 16 和项目级台账,然后创建 02 calibration flow;不得直接改写旧正式 `02-概要设计.md`。
