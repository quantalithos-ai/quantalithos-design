# L4-archive 架构设计校准流程

> 模式：`full-restart + single-agent-serial`；当前文档：`01-架构设计.md`。
> 正式 `00-需求文档.md` 已停审；用户已明确授权连续完成 01 的 Step 1~16。
> 本流程只记录架构推导，不声明实现、测试、真实集成、bundle、digest、evidence、signoff、readiness 或 commit 已发生。

## 1. 总流程计划

| Step | 主题 | 输入 | 输出文件 | 状态 | 完成门禁 |
|---|---|---|---|---|---|
| 1 | 需求基线 | 正式 00、全局规则、正式上游 | `01_arch_step_01_requirements_baseline.md` | `done` | 稳定需求、硬约束、未关闭风险明确 |
| 2 | 架构目标与约束 | Step 1 | `01_arch_step_02_goals_constraints.md` | `done` | 目标、不可变约束、取舍、非目标收稳 |
| 3 | 职责边界 | Step 1~2 | `01_arch_step_03_responsibility_boundaries.md` | `done` | 做/不做、易混淆职责和红线收稳 |
| 4 | 系统边界与上下文 | Step 1~3 | `01_arch_step_04_system_context.md` | `done` | 上下文图、输入/输出面及失效姿态收稳 |
| 5 | 限界上下文与子域 | Step 3~4 | `01_arch_step_05_bounded_contexts.md` | `done` | 每个架构单元停审，跨单元无冲突 |
| 6 | 容器 / 部署架构 | Step 4~5 | `01_arch_step_06_container_deployment.md` | `done` | 运行承载与正式设施边界收稳 |
| 7 | 依赖方向与层间约束 | Step 5~6、全局规则 | `01_arch_step_07_dependencies.md` | `done` | 逐单元依赖、三类裁剪表和禁依赖收稳 |
| 8 | 数据所有权与一致性 | Step 3、5、7 | `01_arch_step_08_data_ownership_consistency.md` | `done` | truth/snapshot/projection/ref/forbidden 与一致性收稳 |
| 9 | 关键交互与通信 | Step 4、6、8 | `01_arch_step_09_interactions_communication.md` | `done` | sync/event/task/handoff、失败与补偿边界收稳 |
| 10 | 关键技术选型 | Step 2、7~9 | `01_arch_step_10_technology_choices.md` | `done` | 机制、理由、代价和不采用项收稳 |
| 11 | 备选方案与取舍 | Step 2、10 | `01_arch_step_11_alternatives_tradeoffs.md` | `done` | 路径级方案比较可追溯 |
| 12 | 横切关注点 | Step 2、7~10 | `01_arch_step_12_cross_cutting.md` | `done` | 逐单元安全、韧性、审计等约束收稳 |
| 13 | 演进路线 | Step 10~12、blocker | `01_arch_step_13_evolution.md` | `done` | 阶段、债务、触发条件不伪造事实 |
| 14 | 风险与待确认 | 全部前序、上游台账 | `01_arch_step_14_risks_open_questions.md` | `done` | blocker 的 owner、影响、挂起与解锁明确 |
| 15 | ADR 与需求追溯 | Step 1~14 | `01_arch_step_15_adr_traceability.md` | `done` | 逐决定停审、需求双向追溯无孤儿 |
| 16 | 正式装配 | Step 1~15 | `01_arch_step_16_formal_assembly.md` | `done` | 18 章与跨单元静态审计通过并停审 |

未来 Step 只存在于本表。只有当前 Step 完成并通过门禁后，才创建下一 Step 文件；旧 `01-架构设计.md` 在 Step 15 通过之前保持 `historical_material`，不局部修补。

## 2. 执行纪律

- 每个 Step 先读取项目台账、本文、前序 Step、对应 SOP/书写规范和正式上游，再完成问题回答、历史诊断、取舍、结构化产物、回填草稿与自检。
- Step 5/7/8/9/12/15 按架构单元或关键决定逐项停审，完成后再做跨单元审计。
- `AR-UP-001~009` 贯穿 01；架构只能保留 adapter seam、pending、blocked、unknown 和 fail-closed，不得代替 owner 补合同。
- 正式 01 的每章必须引用具体 Step 文件；正式正文只承载收口结论。
- 用户已授权连续完成 01，因此 Step 内 pass 可进入下一 Step；01 完成后立即停止，未经新授权不得进入 02。
- 只修改 `projects/L4-archive/`；不实现代码、不执行项目测试、不修改 owning project、不提交 commit。

## 3. 来源复核与权限边界

| 来源 | 本轮承接内容 | 限制 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md`、`架构设计书写规范.md` | Step 1~16 与正式 18 章 | 过程与结果不可互相替代 |
| 通用设计标准与全局依赖规则 | 真相源、可落码性、三层台账、依赖分类 | runtime/event/ref/adapter/fake 不得冒充 compile |
| 本仓正式 `00-需求文档.md` | A1~A9、F-AR-001~009、BR-AR-001~012、AR-UP-001~009 | 架构不得修改需求基线 |
| `L1-workspace` 正式 00~07 与项目台账 | 只读 projection、coverage/freshness、archive 下游边界 | workspace projection 永不升格为 L1 canonical truth |
| identity/conversation/work/process 正式文档 | owner truth 与 snapshot/export/restore receiver 边界 | Archive 无跨域写权 |
| `L1-governance` 正式文档 | policy/decision/hold/delete/risk authority | Archive 不决定 retention、hold、delete、risk acceptance |
| `L1-artifact` 正式文档 | Artifact body/version/lineage/baseline authority | ref 集合不等于正文闭包 |
| `L4-observability` 正式文档 | audit/evidence material 与 backend authority | Archive 不拥有完整审计链或观测后端 |
| `L0-core` / `L0-bus` / `L0-sdk` 正式文档 | 共享契约候选、事件主干、下游访问适配 | 只有已核验共享契约可 compile；SDK 不成为本仓 client/cache truth |
| 本仓 README、旧 01/02/03/05/06、draft | `historical_material` / 污染审计输入 | 不直接继承产品、供应商、算法、SLA、schema 或成功声明 |

上游缺口依用户授权只能记录在本仓并指向 owning project；本轮不跨目录回写，也不声称已通知 owner。

## 4. Step 执行状态明细

| Step | 模块骨架 | 当前模块 | 思考 | 写入 | 自检 | gate_status | 下一动作 | blocker |
|---|---|---|---|---|---|---|---|---|
| 1 | baseline | requirements_baseline | done | done | done | pass_with_upstream_blockers | 进入 Step 2 | AR-UP-001~009 |
| 2 | goals_constraints | goals_constraints | done | done | done | pass_with_upstream_blockers | 进入 Step 3 | AR-UP-001~009 |
| 3 | responsibilities | responsibility_boundaries | done | done | done | pass_with_upstream_blockers | 进入 Step 4 | AR-UP-001~009 |
| 4 | context | system_context | done | done | done | pass_with_upstream_blockers | 进入 Step 5 | AR-UP-001~009 |
| 5 | U1→U6→cross-audit | cross_audit | done | done | done | pass_with_upstream_blockers | 进入 Step 6 | AR-UP-001~009 |
| 6 | runtime_units | container_deployment | done | done | done | pass_with_upstream_blockers | 进入 Step 7 | AR-UP-001~009 |
| 7 | U1→U6→crop→cross-audit | cross_audit | done | done | done | pass_with_upstream_blockers | 进入 Step 8 | AR-UP-001~009；AR-ARCH-001 |
| 8 | U1→U6→authority→cross-audit | cross_audit | done | done | done | pass_with_upstream_blockers | 进入 Step 9 | AR-UP-001~009；AR-ARCH-001 |
| 9 | U1→U6→cross-audit | cross_audit | done | done | done | pass_with_upstream_blockers | 进入 Step 10 | 同上 |
| 10 | technology_mechanisms | technology_choices | done | done | done | pass_with_upstream_blockers | 进入 Step 11 | 同上 |
| 11 | alternative_paths | alternatives_tradeoffs | done | done | done | pass_with_upstream_blockers | 进入 Step 12 | 同上 |
| 12 | categories→U1~U6→cross-audit | cross_audit | done | done | done | pass_with_upstream_blockers | 进入 Step 13 | 同上 |
| 13 | evolution_stages | evolution | done | done | done | pass_with_upstream_blockers | 进入 Step 14 | 同上 |
| 14 | risks_and_questions | risks_open_questions | done | done | done | pass_with_upstream_blockers | 进入 Step 15 | 同上 |
| 15 | ADR-AR-001→008→trace→cross-audit | cross_audit | done | done | done | pass_with_upstream_blockers | 进入 Step 16 | 同上 |
| 16 | 18_chapters→static_audit | formal_assembly | done | done | done | pass_with_upstream_blockers | 正式 01 停审；按用户连续授权进入 02 Step 1 | 同上 |

## 5. 当前恢复点

```text
current_document = 01-架构设计.md
current_step = 16 completed
current_module = formal_assembly completed
gate_status = pass_with_upstream_blockers / stop_review
gate_reason = 18 章正式正文、跨单元静态审计和追溯均已通过；外部 blocker 保持 fail-closed
next_allowed_action = 按用户连续授权读取概要设计 SOP/规范并启动 02 Step 1
formal_01_write_allowed = false_except_review_fixes
next_document_allowed = true_for_02_only
```
