# L2-member-service 01 架构设计校准工作台

> 文档：`01-架构设计.md`
> 模式：full-restart
> 最近更新：2026-08-23
> 当前状态：Step 1~16 completed / pass；正式 01 已停审待评审
> 正式文档状态：`01-架构设计.md` 已由校准材料重建为正式架构基线；未经用户明确确认禁止进入 02

## 1. 工作台职责

本工作台记录 01 的总流程、门禁、恢复点、架构单元停审和正式装配约束。每个 Step 必须先完成问题回答、诊断、取舍、结构化结论、回填草稿和自检，再将本 Step 标记为 `pass`；未来 Step 只能在计划表中出现，不得提前创建文件。

正式 01 只能在 Step 16 删除旧文件并从已通过的 Step 1~15 重建。Step 16 完成后必须立即停审，未经用户再次明确确认不得进入 02。

## 2. 输入效力

| 输入类别 | 材料 | 使用规则 |
|---|---|---|
| direct baseline | 当前正式 `00-需求文档.md` 及 `00_req_step_01~17` | 01 的直接需求真相源；架构只能转译，不得重写需求。 |
| stable upstream | `L2-runtime/00~07`、`L2-tools/00~07`、`L4-sandbox`、`L1-identity`、`L1-work`、`L0-core`、`L0-bus`、`L0-sdk` 当前正式文档 | 只消费其正式 owner、边界、依赖和开放合同；不得替其定义 truth。 |
| granularity reference | `L1-governance/01-架构设计.md`、`L1-artifact/01-架构设计.md` | 只参考核心 / 支撑 / 本地影子分层和文档粒度，不复制领域结论。 |
| sibling current | `L2-member` 正式 00 与进行中的 01；`L2-member-images` 正式 00 与进行中的 01 | 只把正式 00 的需求级 owner / supply 分工视为基线；进行中的架构结论保持 pending。 |
| discussion input | `draft/README.md`、`draft/01~04` | 只作为候选；每项必须由对应 Step 重新核验。 |
| historical_material | 旧 README、旧正式 `01/02/03/05/06` | 只用于 Step 1 / 16 污染审计，不继承技术栈、对象、状态、指标或部署结论。 |

## 3. 不可变执行纪律

- 严格 `Step 1 -> Step 2 -> ... -> Step 16`，当前 Step `pass` 前不得创建下一 Step 文件。
- Step 5 / 7 / 8 / 9 / 12 / 15 必须按架构单元逐项停审，再做跨单元审计。
- Step 1~15 不修改旧正式 01；Step 16 才删除并按 18 章结构重建。
- 只有正式停审的兄弟结论可成为 truth；进行中的兄弟架构内容不得升格。
- runtime / event / ref / adapter / fake seam 不得写成源码依赖；fake 只证明边界可控，不证明真实集成。
- 未闭口正向合同必须保持 pending / blocked / waiting / degraded / unknown / fail closed。
- 不写实现代码，不修改兄弟项目，不提交 commit。

## 4. Step 总流程计划

| Step | 名称 | 前序输入 | 输出文件 | 完成门禁 | 状态 |
|---|---|---|---|---|---|
| 1 | 确认需求基线 | 正式 00、上游正式链、旧材料 | `01_arch_step_01_requirement_baseline.md` | 稳定需求、硬约束、开放风险和 positive ceiling 清楚 | completed / pass |
| 2 | 明确架构目标与约束 | Step 1 | `01_arch_step_02_goals_constraints.md` | 目标、不可变约束、阶段取舍、非目标分层 | completed / pass |
| 3 | 职责边界 | Step 1~2 | `01_arch_step_03_responsibility_boundary.md` | 做 / 不做、易混淆职责和红线收稳 | completed / pass |
| 4 | 系统边界与上下文 | Step 1~3 | `01_arch_step_04_system_context.md` | 正式对象、输入 / 输出面、失效上限清楚 | completed / pass |
| 5 | 限界上下文与子域 | Step 3~4 | `01_arch_step_05_bounded_context_subdomains.md` | 单元逐项停审，核心 / 支撑 / 本地影子无冲突 | completed / pass |
| 6 | 容器 / 部署架构 | Step 4~5 | `01_arch_step_06_container_deployment.md` | 运行承载角色和部署关系清楚，不写实现拓扑 | completed / pass |
| 7 | 依赖方向与层间约束 | Step 5~6、全局裁剪规则 | `01_arch_step_07_dependency_direction.md` | 单元依赖、裁剪、类型和禁止边完整 | completed / pass |
| 8 | 数据所有权与一致性 | Step 3 / 5 / 7 | `01_arch_step_08_data_ownership_consistency.md` | truth / snapshot / ref / forbidden 与一致性逐项停审 | completed / pass |
| 9 | 关键交互与通信方式 | Step 4 / 6 / 8 | `01_arch_step_09_interactions_communication.md` | 同步 / 异步 / 后台选择与失败口径逐项停审 | completed / pass |
| 10 | 关键技术选型 | Step 2 / 7~9 | `01_arch_step_10_technology_choices.md` | 只锁机制，理由和代价完整，产品保持 deferred | completed / pass |
| 11 | 备选方案与取舍 | Step 2 / 10 | `01_arch_step_11_alternatives_tradeoffs.md` | 路径级替代方案和拒绝理由可追溯 | completed / pass |
| 12 | 横切关注点 | Step 2 / 8~11 | `01_arch_step_12_cross_cutting_concerns.md` | 安全、追溯、韧性、性能口径、配置逐项停审 | completed / pass |
| 13 | 演进路线 | Step 10~12 | `01_arch_step_13_evolution_path.md` | 阶段、触发条件、可接受 / 不可接受债务清楚 | completed / pass |
| 14 | 风险与待确认 | Step 1~13 | `01_arch_step_14_risks_open_questions.md` | 风险、Q、blocker、owner 和挂起上限分层 | completed / pass |
| 15 | ADR 与需求追溯 | Step 1~14 | `01_arch_step_15_adr_traceability.md` | 决策逐项停审；需求和架构无孤儿 | completed / pass |
| 16 | 整理正式文档 | Step 1~15、旧 01 | `01_arch_step_16_formal_document_assembly.md`；`../01-架构设计.md` | 18 章、逐章来源、总审计和污染审计通过 | completed / pass；stop-review |

## 5. 架构单元候选与冻结纪律

`draft/04_module_layering.md` 中的 3 个核心、4 个支撑和本地影子层只是候选。Step 5 必须重新判定语义分类、统一语言和不拥有边界；Step 5 `pass` 前，候选名称不得被当作正式上下文、源码模块或部署单元。Step 7 / 8 / 9 / 12 / 15 只能沿 Step 5 已停审单元工作。

## 6. 当前 blocker / pending 注册表

| ID | 主题 | 架构期上限 |
|---|---|---|
| `MSVC-UP-001` | Runtime entry / host session surface | 只定义宿主侧能力 seam；正向 runtime handoff blocked。 |
| `MSVC-UP-002` | Member launch / register / heartbeat / status 详细合同 | 需求级 owner 分工可采用；字段、IPC、凭据和联调 waiting。 |
| `MSVC-UP-003` | Member Images exact pinned supply contract | 需求级 supply 方向可采用；exact manifest / ref / confirmation blocked。 |
| `MSVC-UP-004` | SandboxBinding / release / cleanup 正向合同 | 只定义 host-side port 与 no-fallback；字段、caller、receipt pending。 |
| `MSVC-UP-005` | policy 到宿主传递 owner | 无当前 FR，不预建能力、上下文或依赖。 |
| `MSVC-UP-006` | launch credential owner | 只允许实例绑定安全 ref；签发、撤销与正文 truth 外置。 |
| `MSVC-UP-007` | Core schema / event family | 只引用 Core 类别，不本地 shadow。 |
| `MSVC-UP-008` | SDK 准确 compile target / Server 自测试 | 遵守 compile 基线；准确 target 和正向证据 pending。 |
| `MSVC-UP-009` | 非项目型执行主语 | 当前范围 resolved；非项目型 fail closed，未来须重开需求。 |

## 7. 当前恢复点

```text
current_document = 01-架构设计.md
current_step = Step 16 completed / pass
current_module = formal_document_stop_review
gate_status = formal_01_completed_pending_user_approval
next_allowed_action = wait_for_user_review_and_explicit_confirmation
formal_01_write_allowed = false_except_user_review_feedback
formal_02_write_allowed = false_until_explicit_user_confirmation
```

## 8. 非伪造声明

01 只形成设计结论，不形成实现仓、commit、run_id、测试结果、artifact、report、evidence、verdict、signoff 或 readiness。所有实际集成和正向资格必须等待后续合同、实现与真实证据。
