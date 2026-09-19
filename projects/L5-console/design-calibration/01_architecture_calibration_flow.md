# L5-console `01-架构设计` 校准流程

> 创建日期：2026-09-15  
> 当前模式：`full-restart + single-agent-serial`  
> 目标文档：`projects/L5-console/01-架构设计.md`  
> 项目台账：`projects/L5-console/design-calibration/project_execution_ledger.md`  
> 当前授权：用户已明确授权在正式 `00-需求文档.md` 后继续完成 `01-架构设计.md`；`01` 完成后立即停审，不自动进入 `02`。

## 1. 状态总览

| 项 | 当前状态 |
|---|---|
| 当前文档 | `01-架构设计.md` |
| 当前 Step | Step 16 · 整理正式文档（已完成） |
| 当前模块 | `formal-document-assembly` |
| 当前模式 | `full-restart` |
| 正式 `01` 写入 | `completed / formal_stop_review` |
| 单 agent 串行 | `active` |
| 旧正式 `01` | 仅作 `historical_material` 与污染审计输入 |
| 下一停审点 | 已达到正式 `01` 的 `formal_stop_review`；不得进入 `02`，等待用户新授权 |

## 2. 已读取输入与架构前置

| 输入类别 | 文件 / 范围 | 当前用途 |
|---|---|---|
| 正式需求基线 | `projects/L5-console/00-需求文档.md` | 唯一需求真相，已完成 `formal_stop_review`。 |
| 需求校准中间产物 | `design-calibration/00_req_step_01~17_*`、`00_requirements_calibration_flow.md` | 提供需求结论、pending、风险和追溯来源。 |
| 架构流程 | `standards/document/架构设计讨论流程_SOP.md` | Step 1~16 的生成顺序、输入/输出和门禁。 |
| 架构书写 | `standards/document/架构设计书写规范.md` | 正式 `01` 18 章结构、表格与 ASCII 图规则。 |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` | Step 内小阶段、三层台账、写入与恢复纪律。 |
| 真相源标准 | `standards/document/设计真相源闭环与可落码性标准.md` | truth owner、pending、可落码性和事实诚实。 |
| 全局依赖规则 | `standards/document/全局项目依赖关系与裁剪规则.md` | Step 7 的依赖类型和本仓裁剪。 |
| 产品/全局架构 | `product/产品矩阵.md`、`product/最终目的.md`、`architecture/仓库拆分方案.md` | 产品语境、L5 位置和依赖基线。 |
| 专项正式上游 | L0-sdk、L1/L2/L3/L4 已停审正式文档及必要台账 | 仅承接可引用 owner 边界；未闭口合同继续 pending。 |
| 历史材料 | 旧 `01-架构设计.md`、README、旧 `02/03/05/06` | 只做污染审计，不直接继承。 |

## 3. 总流程计划

未来 Step 文件只在到达该 Step 时创建或改写；本表列出计划，不表示未来 Step 已开始。

| Step | 主题 | 主要输入 | 输出文件 | 前序依赖 | 当前状态 | 完成门禁 | 下一步许可 |
|---:|---|---|---|---|---|---|---|
| 1 | 确认需求基线 | 正式 `00`、需求校准、架构规范 | `01_arch_step_01_requirement_baseline.md` | 正式 `00` 停审、架构规范已读 | `done` | 基线、硬约束、后移风险和架构回指入口明确 | Step 2 |
| 2 | 明确架构目标与约束 | Step 1、`00` §4/§7/§10/§14/§15 | `01_arch_step_02_goals_constraints.md` | Step 1 `pass` | `done` | 目标、不可变约束、阶段取舍、架构非目标分层 | Step 3 |
| 3 | 职责边界 | Step 1~2、`00` §2/§10/§11 | `01_arch_step_03_responsibility_boundary.md` | Step 2 `pass` | `done` | 做/不做、易混职责、边界红线闭合 | Step 4 |
| 4 | 系统边界与上下文 | Step 3、`00` §6/§12 | `01_arch_step_04_system_context.md` | Step 3 `pass` | `done` | 上下文图、输入/输出面、失效降级收敛 | Step 5 |
| 5 | 限界上下文与子域划分 | Step 3~4、`00` §7/§11 | `01_arch_step_05_bounded_context_subdomains.md` | Step 4 `pass` | `done` | 每个架构单元逐个停审，跨上下文审计无冲突 | Step 6 |
| 6 | 容器 / 部署架构 | Step 4~5、`00` §12/§13 | `01_arch_step_06_container_deployment.md` | Step 5 `pass` | `done` | 运行承载与部署边界不滑入源码/协议/参数 | Step 7 |
| 7 | 依赖方向与层间约束 | Step 5~6、全局依赖规则 | `01_arch_step_07_dependency_direction.md` | Step 6 `pass` | `done` | 架构单元依赖规则停审，跨仓依赖类型完成裁剪 | Step 8 |
| 8 | 数据所有权与一致性策略 | Step 3/5/7、`00` §11 | `01_arch_step_08_data_ownership_consistency.md` | Step 7 `pass` | `done` | truth/snapshot/ref/forbidden body 与失败口径收稳 | Step 9 |
| 9 | 关键交互与通信方式 | Step 4/6/8、`00` §12 | `01_arch_step_09_interactions_communication.md` | Step 8 `pass` | `done` | 同步/异步/后台承接理由和降级边界收稳 | Step 10 |
| 10 | 关键技术选型 | Step 2/7/8/9 | `01_arch_step_10_technology_choices.md` | Step 9 `pass` | `done` | 只记录影响架构主线的机制，不写技术栈清单 | Step 11 |
| 11 | 备选方案与取舍 | Step 2/10 | `01_arch_step_11_alternatives_tradeoffs.md` | Step 10 `pass` | `done` | 路径级替代、得失和采用结论明确 | Step 12 |
| 12 | 横切关注点 | Step 2/8/9/10/11 | `01_arch_step_12_cross_cutting.md` | Step 11 `pass` | `done` | 安全、审计、观测、韧性、性能、配置按单元停审 | Step 13 |
| 13 | 演进路线 | Step 10~12、已知债务 | `01_arch_step_13_evolution_roadmap.md` | Step 12 `pass` | `done` | 结构阶段、可接受债务、触发条件分离 | Step 14 |
| 14 | 风险与待确认事项 | Step 1~13 | `01_arch_step_14_risks_open_questions.md` | Step 13 `pass` | `done` | 风险/待确认分表，未决不润色成定论 | Step 15 |
| 15 | ADR 与需求追溯 | Step 1~14、`00` 追溯矩阵 | `01_arch_step_15_adr_traceability.md` | Step 14 `pass` | `done` | 关键决策有来源、单元停审、无孤儿/新增结论 | Step 16 |
| 16 | 整理正式文档 | Step 1~15、架构书写规范 | `01_arch_step_16_formal_document_assembly.md` + `../01-架构设计.md` | Step 15 `pass`、用户授权 | `done / formal_stop_review` | 18 章重建、来源完整、跨单元总审计通过 | 已停审，等待 `02` 新授权 |

## 4. Step 内统一结构

每个已到达的 Step 文件必须独立包含：

1. Step 状态与 Step 内计划；
2. 本步输入；
3. SOP 问题回答；
4. 当前材料 / 旧文档问题诊断；
5. 改动前后对比与设计取舍；
6. 结构化中间产物；
7. 复杂度判断；
8. 回填草稿；
9. 待确认事项；
10. 自检、三层门禁和进入下一步条件。

Step 5、7、8、9、12、15 必须按架构单元或架构决定逐项停审，再做跨单元审计。正式 `01` 只在 Step 16 从已完成中间产物重建，不在中间 Step 直接写正文。

## 5. 架构线固定边界

| 边界 | 当前架构口径 |
|---|---|
| Console 真相 | 只拥有客户端会话壳、导航、筛选/布局、草稿、请求呈现、错误/恢复/a11y 和偏好等交互事实。 |
| 外部 truth | identity/member、work/process、governance/artifact、workspace、method、capability、observability、archive、sandbox truth 归正式 owner。 |
| 访问边界 | 业务读取和受控意图经 `L0-sdk` 或正式服务边界；不得数据库直连、复制规则、本地 RBAC、绕过 Policy/Gate 或内部 bus 私有订阅。 |
| 结果边界 | transport/receipt/pending/unknown 不等于 owner 正式完成；unknown 不自动重放。 |
| 数据边界 | 外部内容只允许 owner-safe 快照或引用；forbidden body 不进入本地持久、诊断、错误或导出旁路。 |
| 架构粒度 | 本文讨论责任边界、上下文、运行承载、依赖方向、数据一致性、交互类别、架构机制和取舍；不进入 DTO、API path、源码目录、数据库表、函数、测试用例或部署参数。 |

## 6. 当前 Step 门禁

| 层级 | gate_status | gate_reason | 下一动作 |
|---|---|---|---|
| 项目级 | `formal_stop_review` | Step 16 已完成；当前授权不覆盖 `02` | 停止并等待用户新授权 |
| 文档级 | `formal_stop_review` | 正式 `01` 已从已确认结论装配并通过总审计 | 不进入 `02`；不提交 commit |
| Step / 模块级 | `completed` | 只重组已确认结论，统一术语/编号/引用，并完成静态审计 | 保持停审；后续须新建 `02` calibration 并经用户授权 |

## 7. 历史材料与 pending 原则

- 旧 `01` 的组织治理中心、Provider Contract、固定指标/控制项、前端框架、具体 API、内部聚合和绿色/readiness 语义均为 `historical_material`，不得回填。
- `L5-chat`、`L5-runner`、`L5-sync`、`L6-marketplace`、`L6-bridges` 未停审内容只保留为未来正式 link/ref 的 pending 候选。
- exact owner query/command/result/ref、scope/visibility、safe-field/freshness/coverage、unknown reconciliation、Workspace/Method/Capability/Observability/Archive/Sandbox activation、性能/兼容/诊断 envelope 仍未闭口时，只能保留架构级边界和风险，不得写成 integrated/ready。
- 不伪造 baseline、commit、run_id、测试结果、artifact、report、evidence、verdict、signoff 或 readiness。

## 8. Step 16 结束记录

| 审计项 | 结果 |
|---|---|
| 正式章节 | §1～§18 顺序完整，每章有具体 calibration 来源与延伸阅读。 |
| 图表 | 系统上下文、子域、运行承载、依赖裁剪、数据边界和交互图均有图后说明；固定表格字段齐全。 |
| 真相与依赖 | Console 只拥有交互 truth；owner truth、SDK-only、compile/runtime/event 裁剪和 forbidden-body 边界一致。 |
| 交互与恢复 | 同步 query/资格/受理、可选 SDK 提示、owner 延后工作和正式结果/unknown 分层一致；unknown 不自动重放。 |
| 污染审计 | Provider Contract、固定数字、旧 SLA、框架/协议和旧 ADR 未回流为正式前提。 |
| 事实诚实 | 无实现、测试、集成、baseline、run、artifact、report、evidence、verdict、signoff 或 readiness 伪声明。 |

Step 16 完成后立即停审。下一动作只能是等待用户明确授权 `02-概要设计.md`；本文件不授权进入下一文档。
