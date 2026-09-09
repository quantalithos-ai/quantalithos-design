# L1-workspace 架构设计校准流程

> 模式：`full-restart + single-agent-serial`；当前文档：`01-架构设计.md`。
> 正式 00 已停审。本流程只记录架构推导过程，不声明实现、测试、commit、evidence、signoff 或 readiness。

## 总流程计划

| Step | 主题 | 输入 | 输出文件 | 状态 | 门禁 |
|---|---|---|---|---|---|
| 1 | 需求基线 | 正式 00、全局规则、上游边界 | `01_arch_step_01_requirements_baseline.md` | `done` | 基线、硬约束、风险和追溯入口明确 |
| 2 | 架构目标与约束 | Step 1 | `01_arch_step_02_goals_constraints.md` | `done` | 目标、不可变约束、取舍、非目标收稳 |
| 3 | 职责边界 | Step 1~2 | `01_arch_step_03_responsibility_boundaries.md` | `done` | 做/不做、易混淆职责、红线收稳 |
| 4 | 系统边界与上下文 | Step 1~3 | `01_arch_step_04_system_context.md` | `done` | 上下文图、输入输出面、降级边界收稳 |
| 5 | 限界上下文与子域 | Step 3~4 | `01_arch_step_05_bounded_contexts.md` | `done` | 每个上下文停审、跨上下文无冲突 |
| 6 | 容器与部署 | Step 4~5 | `01_arch_step_06_container_deployment.md` | `done` | 运行单元和部署关系收稳 |
| 7 | 依赖方向与层约束 | Step 5~6、全局规则 | `01_arch_step_07_dependencies.md` | `done` | 依赖裁剪、方向、倒置和禁依赖收稳 |
| 8 | 数据所有权与一致性 | Step 3、5、7 | `01_arch_step_08_data_ownership_consistency.md` | `done` | truth/projection/ref/forbidden 与一致性收稳 |
| 9 | 关键交互与通信 | Step 4、6、8 | `01_arch_step_09_interactions_communication.md` | `done` | sync/event/task、失败与补偿边界收稳 |
| 10 | 技术选型 | Step 2、7~9 | `01_arch_step_10_technology_choices.md` | `done` | 只到架构级技术类别，未伪造协议细节 |
| 11 | 备选方案与取舍 | Step 2、10 | `01_arch_step_11_alternatives_tradeoffs.md` | `done` | 采用/放弃方案及理由可追溯 |
| 12 | 横切关注点 | Step 2、7~10 | `01_arch_step_12_cross_cutting.md` | `done` | 安全、可观测、可靠、演进约束适配本仓 |
| 13 | 演进路线 | Step 10~12、blocker | `01_arch_step_13_evolution.md` | `done` | 阶段与前置条件不伪造实现事实 |
| 14 | 风险与待确认 | 全部前序、上游台账 | `01_arch_step_14_risks_open_questions.md` | `done` | blocker、影响、owner、解锁条件明确 |
| 15 | ADR 与需求追溯 | Step 1~14 | `01_arch_step_15_adr_traceability.md` | `done` | ADR 索引、需求映射和证据边界完整 |
| 16 | 正式装配 | Step 1~15 | `01_arch_step_16_formal_assembly.md` | `done` | 18 章正文静态审计通过，已停审 |

## 执行纪律

- 每个 Step 先回答问题、诊断历史材料、做取舍，再写结构化结论、回填草稿和自检。
- 未来 Step 文件不提前创建；当前 Step 完成并更新本表后才进入下一 Step。
- `WS-UP-001~008` 作为 pending/blocker 贯穿，不得被架构文档写成已闭合合同。
- 正式章节只承载收口结论，过程、冲突与停审记录留在对应中间产物。

## 来源复核与权限边界

| 来源 | 本轮承接的正式章节 / 台账 | 限制 |
|---|---|---|
| `projects/L0-core/00-需求文档.md` §6、`01-架构设计.md`、`03-详细设计.md`、`07-实施计划.md` | shared contract、公开读取与幂等边界；`design-calibration/07_implementation_plan_calibration_flow.md` | 通用契约不等于 workspace 专用类型已发布 |
| `projects/L0-bus/00-需求文档.md` §2、`01-架构设计.md` recovery、`03-详细设计.md`、`04-配置设计.md` recovery、`05-测试方案.md` REC、`06-验收标准.md` AC-FUNC-005、`07-实施计划.md` PH-06 | delivery 与 replay preparation；`design-calibration/07_implementation_plan_calibration_flow.md` | preparation ready 不等于 replay executed |
| `projects/L0-sdk/00-需求文档.md`、`01-架构设计.md`、`design-calibration/07_implementation_plan_calibration_flow.md` | SDK 访问封装与下游消费 | 不引入 SDK cache truth / compile 依赖 |
| `projects/L1-identity/00-需求文档.md` §2/6、`01-架构设计.md` 依赖/ADR、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` | GlobalMember 与 ProjectMember 分离；`design-calibration/07_implementation_plan_calibration_flow.md` | 身份不等于 authentication / authorization |
| `projects/L1-conversation/00-需求文档.md` §2/4、`01-架构设计.md` §4/5、`03-详细设计.md` 范围、`07-实施计划.md` 依赖 | 对话 truth 与 workspace 分离；`design-calibration/07_implementation_plan_calibration_flow.md` | ReadCursor 不是 conversation receipt |
| `projects/L1-work/00-需求文档.md` §4/6、`01-架构设计.md` 上下文/依赖、`02-概要设计.md` §4/流程、`03-详细设计.md` 依赖、`04-配置设计.md` visibility | Project/ProjectMember/WorkItem owner；`design-calibration/07_implementation_plan_calibration_flow.md` | 不从 view 隐式创建 Project |
| `projects/L1-process/00-需求文档.md` §2/4、`01-架构设计.md` 边界、`02-概要设计.md` 组成、`03-详细设计.md` 依赖、`04-配置设计.md` 守卫、`05-测试方案.md` Query、`06-验收标准.md` 红线、`07-实施计划.md` | ProcessInstance/Activity truth 与 no-write；`design-calibration/07_implementation_plan_calibration_flow.md` | 进度视图不是流程推进 |
| `projects/L1-governance/00-需求文档.md` §2、`01-架构设计.md` §5/6/8/9/13、`02-概要设计.md` consumption | Policy/Gate/Decision；`design-calibration/01_architecture_calibration_flow.md`、`07_implementation_plan_calibration_flow.md` | 不把所有域授权统称为 governance 统一授予 |
| `projects/L1-artifact/00-需求文档.md` §2/4、`01-架构设计.md` §5~17、`05-测试方案.md` 消费边界 | 正文/版本/血缘/baseline owner；`design-calibration/project_execution_ledger.md`、`01_architecture_calibration_flow.md` | safe preview 不意味着正文可存入 workspace |
| `projects/L2-runtime/00-需求文档.md`、`01-架构设计.md`、`design-calibration/project_execution_ledger.md` | execution 非 workspace truth，07 stop_review | 运行状态不构成 workspace 输入授权 |
| `projects/L2-tools/00-需求文档.md`、`01-架构设计.md`、`design-calibration/project_execution_ledger.md` | tool execution 边界，07 stop_review | capability registry 不归 workspace |
| `projects/L2-member/00~07` 中 execution subject / L2M-UP-008 条目 | `design-calibration/project_execution_ledger.md` | 仅 project-scoped 双锚；非项目 subject blocked |
| `projects/L2-member-service/00~07` 中 execution subject / MSVC-UP-009 条目 | `design-calibration/project_execution_ledger.md` | Workspace view 不创建 host / 第三执行主语 |
| `projects/L2-member-images/00~07` 中 seed / MI-UP-006 条目 | `design-calibration/project_execution_ledger.md` | 静态 seed owner pending，不消费 live workspace |

本表是本轮架构专题复核入口，不宣称全文重读全部上游 00~07，亦不证明其接口已实际实现。部分早期项目缺 `project_execution_ledger.md`，以存在的文档级 flow 恢复，不为其创建台账。参考项目粒度用于边界、单元、一致性和追溯，不直接继承其实现栈。

只允许写本项目与“回写 owning 项目 flow/ledger”的要求存在范围冲突：本轮在本地记录待回流项、目标与解锁条件，不跨目录写入；真正回流须获得额外授权。此项不阻塞保守架构结论，但不能声称已通知或已回写 owner。

## Step 执行状态明细

| Step | 模块骨架 | 当前模块 | 思考记录 | 写入记录 | 自检状态 | gate_status | gate_reason / 下一动作 | blocker |
|---|---|---|---|---|---|---|---|---|
| 1 | not_applicable | baseline | done | done | done | pass | 基线不创造外部合同；进入 2 | WS-UP-001~008 |
| 2 | done | goals_constraints | done | done | done | pass | 单元与跨单元自检已完成；进入 3 | WS-UP-001~008 |
| 3 | done | responsibility_boundaries | done | done | done | pass | 单元与跨单元自检已完成；进入 4 | WS-UP-001~008 |
| 4 | done | system_context | done | done | done | pass | 单元与跨单元自检已完成；进入 5 | WS-UP-001~008 |
| 5 | done | bounded_contexts | done | done | done | pass | 单元与跨单元自检已完成；进入 6 | WS-UP-001~008 |
| 6 | done | container_deployment | done | done | done | pass | 单元与跨单元自检已完成；进入 7 | WS-UP-001~008 |
| 7 | done | dependencies | done | done | done | pass | 单元与跨单元自检已完成；进入 8 | WS-UP-001~008 |
| 8 | done | data_ownership_consistency | done | done | done | pass | 单元与跨单元自检已完成；进入 9 | WS-UP-001~008 |
| 9 | done | interactions_communication | done | done | done | pass | 单元与跨单元自检已完成；进入 10 | WS-UP-001~008 |
| 10 | done | technology_choices | done | done | done | pass | 单元与跨单元自检已完成；进入 11 | WS-UP-001~008 |
| 11 | done | alternatives_tradeoffs | done | done | done | pass | 单元与跨单元自检已完成；进入 12 | WS-UP-001~008 |
| 12 | done | cross_cutting | done | done | done | pass | 单元与跨单元自检已完成；进入 13 | WS-UP-001~008 |
| 13 | done | evolution | done | done | done | pass | 单元与跨单元自检已完成；进入 14 | WS-UP-001~008 |
| 14 | done | risks_open_questions | done | done | done | pass | 单元与跨单元自检已完成；进入 15 | WS-UP-001~008 |
| 15 | done | adr_traceability | done | done | done | pass | 单元与跨单元自检已完成；进入 16 | WS-UP-001~008 |
| 16 | done | formal_assembly | done | done | done | pass | 正式 01 完成并停审；等待用户确认 02 | WS-UP-001~008 / 006-S |

正式 01 装配门禁：已完成，关闭写入。Step 1~15、Step 16 总审计与终检通过，等待用户审阅；pass 不等于上游或实现就绪。表中“进入下一 Step”只记录当时门禁，不授权重新执行或进入 02。

## 当前恢复点

```text
current_step = 16
current_module = formal_assembly_completed_stop_review
gate_status = completed / pass_with_upstream_blockers / stop_review
gate_reason = 正式 18 章、16 Step 与引用/所有权/依赖/安全/恢复边界静态审计完成
next_allowed_action = wait_for_user_confirmation_before_02
source_files = project_execution_ledger.md; 01_arch_step_16_formal_assembly.md
```
