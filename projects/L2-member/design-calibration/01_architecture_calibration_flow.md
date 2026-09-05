# L2-member 01 架构设计校准工作台

> 对应正式文档: `projects/L2-member/01-架构设计.md`
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md`
> 书写规范: `standards/document/架构设计书写规范.md`
> 直接需求基线: `projects/L2-member/00-需求文档.md`
> 模式: `full-restart + single-agent-serial`
> 创建日期: 2026-08-22
> 当前状态: Step 1~16 complete;formal 01 stop_review
> 正式文档状态: 已从空文件按 18 章重建并通过写后总审计;等待用户确认

## 1. 工作台职责

本工作台记录 `01` 的总流程计划、Step 门禁、恢复点、架构单元停审和正式装配约束。每个 Step 的阅读、诊断、SOP 问题回答、结构化结论、回填草稿与自检写入独立 `01_arch_step_*.md`;工作台不替代中间产物或正式文档。

用户于 2026-08-22 明确同意从已完成的正式 `00` 进入 `01`。该确认只解除本项目 `00 -> 01` 门禁,不授权进入 `02`、实现代码、修改兄弟目录或提交 commit。

## 2. 输入效力

| 输入层级 | 材料 | 效力 |
|---|---|---|
| normative authority | 架构 SOP / 书写规范、通则、中间产物规范、真相源标准、全局依赖裁剪规则 | 决定流程、正式结构、证据闭环和依赖分类。 |
| direct baseline | 当前正式 `00-需求文档.md` 与其 Step 1~17 校准材料 | 架构推导的直接需求真相源。 |
| stable upstream | `L2-runtime`、`L2-tools`、`L0-core`、`L0-bus`、`L0-sdk`、`L1-identity`、`L1-work`、`L1-conversation` 当前正式材料 | 只消费已稳定 owner、ref、entry、outcome、tool action、delivery 和 truth 边界。 |
| granularity reference | `L1-governance`、`L1-artifact` 当前正式架构与校准材料 | 参考架构单元、分层、数据分类和停审粒度,不复制业务结论。 |
| sibling current | `L2-member-service`、`L2-member-images` 正式 00 / 当前 01 与最新台账 | 两者正式 00 均已停审。2026-08-23 最新现场为 member-service 正式 01 Step 16 allowed(未停审)、member-images 正式 01 stop_review;后者确认 image supply / pinned entry owner 与本仓边界无漂移,但 exact member component release、compatibility、handoff / confirmation 仍 pending。 |
| confirmed discussion input | `draft/README.md`、`draft/01~03` | 用户确认的预推演输入;每项仍须由对应 Step 独立核验。 |
| historical material | 旧 README、旧正式 `01/02/03/05/06` | 只在独立结论形成后做污染 / 差异审计,不得直接继承。 |

## 3. 串行与停审纪律

- 严格 `Step 1 -> ... -> Step 16`;当前 Step `pass` 前不得创建下一 Step 文件。
- Step 5 / 7 / 8 / 9 / 12 / 15 按架构单元逐个停审,全部单元完成后再做跨单元审计。
- Step 1~15 不修改旧正式 `01`;Step 16 才允许删除并按 18 章正式结构重建。
- 不下沉对象字段、API / event schema、数据库表、代码目录、handler、配置值、测试步骤或实施任务。
- `L2M-UP-001~008` 只能保持 pending / blocker / fail-closed,不得在本仓脑补闭口。
- CloudEvents / W3C 只承接 Core authority;AG-UI、UDS、launch token、member-specific event family、语言 / 进程管理器和旧 SLA 不自动继承。
- 只有 compile dependency 才能进入 package dependency;runtime / event / ref / adapter / fake 必须分列。
- 正式 `01` 完成后立即 `stop_review`;未经用户再次明确确认不得进入 `02`。

## 4. Step 总流程计划

| Step | 名称 | 输出文件 | 核心范围 | 状态 | gate | 下一允许动作 |
|---:|---|---|---|---|---|---|
| 1 | 确认需求基线 | `01_arch_step_01_requirements_baseline.md` | 稳定需求、硬约束、未关闭风险、历史问题诊断 | completed | pass | 创建 Step 2 前停审;已完成 |
| 2 | 明确架构目标与约束 | `01_arch_step_02_goals_constraints.md` | 目标、不可变约束、取舍、非目标 | completed | pass | 创建 Step 3 前停审;已完成 |
| 3 | 职责边界 | `01_arch_step_03_responsibility_boundary.md` | 做 / 不做、易混淆职责、红线 | completed | pass | 创建 Step 4 前停审;已完成 |
| 4 | 系统边界与上下文 | `01_arch_step_04_system_context.md` | 正式上下文对象、输入 / 输出面、降级 | completed | pass | 创建 Step 5 前停审;已完成 |
| 5 | 限界上下文与子域 | `01_arch_step_05_bounded_context_subdomains.md` | 架构单元逐个停审 + 跨语义审计 | completed | pass | 7 单元与跨上下文审计已完成 |
| 6 | 容器 / 部署架构 | `01_arch_step_06_container_deployment.md` | 运行单元、部署关系、正式通信 | completed | pass | 创建 Step 7 前停审;已完成 |
| 7 | 依赖方向与层间约束 | `01_arch_step_07_dependency_direction.md` | 单元依赖停审、裁剪与类型审计 | completed | pass | 7 单元与跨依赖 / 固定裁剪输出已完成 |
| 8 | 数据所有权与一致性 | `01_arch_step_08_data_ownership_consistency.md` | 单元 truth / projection / ref 停审 | completed | pass | 7 单元与跨数据审计已完成 |
| 9 | 关键交互与通信 | `01_arch_step_09_interactions_communication.md` | 单元同步 / 事件 / 后台 / 补偿停审 | completed | pass | 7 单元与跨交互审计已完成 |
| 10 | 关键技术选型 | `01_arch_step_10_technology_choices.md` | 机制、理由、代价、不采用口径 | completed | pass | 创建 Step 11 前停审;已完成 |
| 11 | 备选方案与取舍 | `01_arch_step_11_alternatives_tradeoffs.md` | 架构级替代路径比较 | completed | pass | 创建 Step 12 前停审;已完成 |
| 12 | 横切关注点 | `01_arch_step_12_cross_cutting_concerns.md` | 单元适用性停审 + 跨横切审计 | completed | pass | 7 单元与跨横切审计已完成 |
| 13 | 演进路线 | `01_arch_step_13_evolution_path.md` | 当前阶段、债务、触发条件 | completed | pass | 当前基线、债务与触发条件已收敛 |
| 14 | 风险与待确认事项 | `01_arch_step_14_risks_open_questions.md` | 风险 / Q / blocker 分层 | completed | pass | 风险 / question / debt / trigger / veto 已分层 |
| 15 | ADR 与需求追溯 | `01_arch_step_15_adr_traceability.md` | 决策逐项停审 + 孤儿审计 | completed | pass | 9 项决定、103 项追溯和跨审计已通过 |
| 16 | 整理正式文档 | `01_arch_step_16_formal_document_assembly.md` + 正式 `01-架构设计.md` | 18 章装配、来源块、总审计、停审 | completed | formal_01_complete_stop_review | 等待用户明确确认;不得进入 02 |

## 5. 当前恢复点

```text
current_document = 01-架构设计.md
current_step = Step 16 complete
current_module = formal_01_stop_review
gate_status = formal_01_complete_stop_review
next_allowed_action = wait_for_user_confirmation_before_02
step_16_file_allowed = already_created
future_step_files_beyond_16_allowed = false
formal_01_write_allowed = false_stop_review
formal_02_write_allowed = false
implementation_write_allowed = false
commit_required = false
```

## 6. 架构单元候选与冻结纪律

`draft/03_模块划分与分层.md` 的 8 个组成部分只作为 Step 5 候选。Step 5 必须重新判断核心 / 支撑 / 本地影子分类及统一语言;在 Step 5 pass 前,不得把候选名称当成正式上下文、源码模块或部署单元。后续 Step 7 / 8 / 9 / 12 / 15 只能沿 Step 5 已停审单元工作。

## 7. 非伪造声明

本工作台和后续 `01` 材料只记录设计结论、planned / pending / blocked / waiting / degraded / fail-closed 口径。它们不声明实现、commit、run_id、测试结果、artifact、report、evidence、verdict、signoff、integration pass 或 readiness。
