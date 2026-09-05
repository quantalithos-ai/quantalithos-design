# L2-member 02 概要设计校准工作台

> 对应正式文档: `projects/L2-member/02-概要设计.md`
> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md`
> 书写规范: `standards/document/概要设计书写规范.md`
> 直接需求基线: `projects/L2-member/00-需求文档.md`
> 直接架构基线: `projects/L2-member/01-架构设计.md`
> 模式: `full-restart + single-agent-serial`
> 创建日期: 2026-08-23
> 用户授权: 2026-08-23 明确批准 `01 -> 完整 02`
> 当前状态: Step 1~14 completed / pass / stop_review；正式 `02-概要设计.md` 已完成装配并停审

## 1. 工作台职责

本工作台记录 `02` 的总流程计划、Step 门禁、恢复点、主要组成部分小循环和正式装配约束。每个 Step 的输入、问题回答、诊断、取舍、结构化结论、回填草稿与自检写入独立 `02_hld_step_*.md`;本工作台不替代 Step 中间产物或正式文档。

用户于 2026-08-23 明确同意从已完成停审的正式 `01` 进入完整 `02`。该授权允许按 Step 1~14 严格串行完成概要设计,不授权进入 `03`、实现代码、修改兄弟目录或提交 commit。

## 2. 输入效力

| 输入层级 | 材料 | 效力 |
|---|---|---|
| normative authority | 概要设计 SOP / 书写规范、通则、中间产物规范、真相源标准、全局依赖裁剪规则 | 决定 14 Step、正式 14 章、对象 / 接口 / 流程 / 状态粒度、三层门禁和依赖分类。 |
| direct baseline | 当前正式 `00-需求文档.md`、`01-架构设计.md` 及其 calibration | 本概要设计的直接需求与架构真相源;不得在 02 重开 owner、上下文或架构取舍。 |
| stable direct upstream | `L2-runtime/00~07`、`L2-tools/00~07` | Runtime entry / run / context / plan / outcome / handoff 与 Tools contract / action / binding / outcome 边界的正式来源。 |
| stable foundation / truth input | `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity`、`L1-work`、`L1-conversation` 当前正式链 | 只承接 shared primitive、event delivery、downstream SDK、ProjectMember / GlobalMember、conversation truth 等稳定 owner 边界。 |
| granularity reference | `L1-governance`、`L1-artifact` 正式 02 与 calibration | 参考“业务主要组成部分 × 实现分层”、对象正式化和 Step 5~9 停审粒度,不复制其业务对象。 |
| sibling current | `L2-member-service` 当前正式 00 / 01 与台账;`L2-member-images` 当前正式 00 / 01 与台账 | member-service 正式 01 尚待其用户批准,只做漂移审计;member-images 正式 01 已获其用户批准进入 02,可引用 image supply / pinned entry 架构边界。双方 exact contract 继续 pending。 |
| confirmed discussion input | `draft/README.md`、`draft/01~03` | 用户确认的预推演输入;只能作为候选,须由每个概要 Step 独立复核。 |
| historical material | 旧 README、旧正式 `02/03/05/06`;旧正式 `00/01` 的被替换版本 | 只做污染 / 差异审计;不得直接继承对象、API、协议、状态、指标或技术栈。 |

## 3. 串行与停审纪律

- 严格 `Step 1 -> ... -> Step 14`;当前 Step `pass` 前不得创建下一 Step 文件。
- Step 5~9 先回答全局问题并做取舍,再按已冻结主要组成部分逐个完成 capability、对象、接口、处理流、状态与停审,最后执行跨组成部分审计。
- Step 1~13 不修改旧正式 `02`;Step 14 才允许删除旧文件并按 14 章从空文件重建。
- 正式 02 每章必须引用具体 calibration source 并给出延伸阅读入口。
- 只停在可实现结构骨架:可点名对象、字段类型、函数参数类型、API / Event / Job / Port、流程和状态;不写完整 schema、实现、DDL、代码目录、配置项、测试结果或实施任务。
- `L2M-UP-001~008` 只能保持 pending / blocked / waiting / degraded / fail-closed,不得在本仓脑补闭口。
- CloudEvents / W3C 只承接 Core authority;AG-UI、UDS、launch token、member-specific event family、语言 / 进程管理器和旧 SLA 不自动继承。
- 只有 compile dependency 才能进入 package dependency;runtime / event / ref / adapter / fake 必须分列。
- 正式 `02` 完成后立即 `stop_review`;未经用户再次明确确认不得进入 `03`。

## 4. Step 总流程计划

| Step | 名称 | 输出文件 | 核心范围 | 状态 | gate | 下一允许动作 |
|---:|---|---|---|---|---|---|
| 1 | 确认上游输入边界 | `02_hld_step_01_upstream_boundary.md` | stable / pending / historical 分层、上游映射、污染审计 | completed | pass | 已完成;Step 2 已获串行进入条件 |
| 2 | 明确设计目标与范围 | `02_hld_step_02_goals_scope.md` | 设计目标、非范围、概要深度 | completed | pass | 已完成;Step 3 已获串行进入条件 |
| 3 | 收稳约束条件 | `02_hld_step_03_constraints.md` | 影响结构的硬约束 | completed | pass | 已完成;Step 4 已获串行进入条件 |
| 4 | 代码主体框架映射 | `02_hld_step_04_code_subject_framework.md` | 架构上下文到代码主体、实现分层双轴映射 | completed | pass | 已完成;Step 5 已获串行进入条件 |
| 5 | 主要组成部分、职责与边界 | `02_hld_step_05_components_boundary.md` | 组成部分、capability、候选对象、逐部分停审与跨审计 | completed | pass | 7 部分与跨部分审计已完成 |
| 6 | 关键对象轮廓 | `02_hld_step_06_key_objects.md` + 七个组成部分附录 | 候选筛选、字段 / 函数骨架、逐部分停审与跨审计 | completed | pass | 34/34 对象、七部分停审与跨对象审计通过 |
| 7 | API / 接口骨架 | `02_hld_step_07_api_interface_skeleton.md` + 七个组成部分附录 | Command / Query / Consumer / Event / Job / Port | completed | pass | 10 / 16 / 14 / 24 / 5 分类、七部分停审与跨接口审计通过 |
| 8 | 关键处理流 | `02_hld_step_08_processing_flows.md` + 七个组成部分附录 | P0 write、state consumer、关键 query / job 流与跨审计 | completed | formal_step_08_complete_stop_review | 七部分处理流、覆盖与反向写审计通过;已停审 |
| 9 | 状态机与状态流转 | `02_hld_step_09_state_machine.md` + 七个组成部分附录 | 状态族、迁移、传播、逐部分停审与跨审计 | completed / pass / stop_review | formal_step_09_complete_stop_review | 34/34 对象、`10 / 16 / 14 / 24 / 5` 接口分类、唯一 source owner、无反向写与 pending 审计通过 |
| 10 | 异常与边界场景 | `02_hld_step_10_exceptions_boundaries.md` | 改变主线理解的异常 / 边界 | completed / pass / stop_review | formal_step_10_complete_stop_review | 主线断点、跨部分影响、forbidden-body、pending与详细设计后移项已收稳 |
| 11 | 配置影响轮廓 | `02_hld_step_11_configuration_impact.md` | 受配置影响面、禁止配置化、03 / 04 承接 | completed / pass / stop_review | formal_step_11_complete_stop_review | 已完成；Step 12 已获串行进入条件 |
| 12 | 详细设计承接清单 | `02_hld_step_12_detailed_design_handoff.md` | 稳定主语、03 展开项和回退规则 | completed / pass / stop_review | formal_step_12_complete_stop_review | 已完成；Step 13 已获串行进入条件 |
| 13 | 风险与待确认事项 | `02_hld_step_13_risks_open_questions.md` | 概要风险、pending / blocker、进入 03 影响 | completed / pass / stop_review | formal_step_13_complete_stop_review | 已完成；Step 14 已获串行进入条件 |
| 14 | 正式文档装配 | `02_hld_step_14_formal_document_assembly.md` + 正式 `02-概要设计.md` | 从空文件重建 14 章、静态总审计、停审 | completed / pass / stop_review | formal_02_complete_stop_review | 正式02已停审；未经用户明确确认不得创建或推进03 |

## 5. Step 5~9 小循环候选

Step 4 通过前不冻结正式组成部分。当前只登记来自正式架构的七个候选映射:

```text
BC-L2M-01 Presence and Host Collaboration
BC-L2M-02 Inbound Boundary
BC-L2M-03 Runtime Mediation
BC-L2M-04 Outbound Boundary
BC-L2M-05 Interaction Trace
BC-L2M-06 External Context Mirror
BC-L2M-07 Member Read Model
```

`Member truth core` 是七者共同遵守的不变量,不是第八个组成部分。`adapter / repository / port / job / process / protocol` 是实现主体或分层角色,不是业务主要组成部分。Step 4 必须先证明这组映射成立,Step 5 才能冻结名称与 capability。

## 6. 当前恢复点

```text
current_document = 02-概要设计.md
current_step = Step 14 completed / pass / stop_review
current_module = formal_document_assembly_complete
gate_status = blocked_by_formal_02_review
gate_reason = Formal_02_completed_and_stop_review;explicit_user_confirmation_required_for_03
next_allowed_action = wait_for_explicit_user_confirmation_of_02_to_03
current_step_file_allowed = false
future_step_files_allowed = none_until_user_confirmation
formal_02_write_allowed = review_corrections_only_if_user_requests
formal_03_write_allowed = false
implementation_write_allowed = false
commit_required = false
```

## 7. 非伪造声明

本工作台和后续 `02` 材料只记录设计结论及 planned / pending / blocked / waiting / degraded / fail-closed 口径。它们不声明实现、commit、run_id、测试结果、artifact、report、evidence、verdict、signoff、integration pass 或 readiness。
