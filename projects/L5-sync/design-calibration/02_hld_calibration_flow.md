# L5-sync 02 概要设计校准流程

> 模式：`full-restart + single-agent-serial`；当前文档：`02-概要设计.md`；启动日期：2026-09-20；完成日期：2026-09-21。
> 用户授权：完成全部 02。正式 00、01 已处于 `formal_stop_review`；本流程严格执行 Step 1→14，Step 14 前不得写正式 02，完成后立即停审，不进入 03。
> 当前 agent 独立完成全部阅读、分析、写入和审计；不创建、调用或委派任何 sub-agent、worker、team 或并行代理。

## 1. 执行边界

- 只修改 `projects/L5-sync/` 下设计文档、calibration 中间产物和项目台账；不实现代码、不运行测试、不提交 commit。
- 正式 00/01 是本轮直接基线；README、旧正式 02/03/05/06 和 draft 只作 `historical_material` / `pre-calibration_input`，结论必须重新核验后才能进入本轮。
- `SYNC-UP-001~010` 始终保持 `pending/blocked`，只允许收稳本地保守骨架；不得用历史接口、缓存、fixture、日志或推测关闭。
- `gate_status` 仅表达文档门禁；`done` / `pass_with_upstream_blockers` 不表示实现、集成、测试、evidence、review、signoff 或 readiness。

## 2. 总流程计划与状态台账

每步开工前回读项目台账、本文、前步文件与对应 SOP/规范；未来 Step 文件只能在到达该 Step 时创建。Step 5~9 按五个主要组成部分逐个执行 `capability → 对象 → 接口 → 处理流 → 状态 → 单部分停审`，随后执行跨部分审计。

| Step | 主题 | 主要输入 | 输出文件 | 状态 | 当前模块 | gate_status | 完成门禁 / 下一动作 |
|---|---|---|---|---|---|---|---|
| 1 | 上游输入边界 | 正式 00/01、专项上游、全局规则 | `02_hld_step_01_upstream_boundary.md` | done | self_reviewed | pass_with_upstream_blockers | 映射与 blocker 保留完成；已进入 Step 2 |
| 2 | 目标与范围 | Step 1、正式 00/01 | `02_hld_step_02_goals_scope.md` | done | self_reviewed | pass_with_upstream_blockers | 目标/范围/深度完成；已进入 Step 3 |
| 3 | 约束条件 | Step 1~2、owner/data/safety 边界 | `02_hld_step_03_constraints.md` | done | self_reviewed | pass_with_upstream_blockers | 结构性硬约束完成；已进入 Step 4 |
| 4 | 代码主体框架 | Step 2~3、正式 01 模块/分层 | `02_hld_step_04_code_subject_framework.md` | done | self_reviewed | pass_with_upstream_blockers | 两图与主体清单完成；已进入 Step 5 |
| 5 | 组成部分与边界 | Step 4、正式 01 五部分 | `02_hld_step_05_components_boundary.md` | done | cross_component_reviewed | pass_with_upstream_blockers | 五部分停审与跨部分审计完成；已进入 Step 6 |
| 6 | 关键对象 | Step 5 候选池 | `02_hld_step_06_key_objects.md` | done | cross_object_reviewed | pass_with_upstream_blockers | 29 对象逐节正式化与跨对象审计完成；已进入 Step 7 |
| 7 | 接口骨架 | Step 5~6、owner seam | `02_hld_step_07_api_interface_skeleton.md` | done | cross_interface_reviewed | pass_with_upstream_blockers | 五部分接口、ports、consumer/job 与跨接口审计完成；已进入 Step 8 |
| 8 | 处理流 | Step 5~7 | `02_hld_step_08_processing_flows.md` | done | cross_flow_reviewed | pass_with_upstream_blockers | 关键流、五部分停审与跨流审计完成；已进入 Step 9 |
| 9 | 状态机 | Step 6~8 | `02_hld_step_09_state_machine.md` | done | cross_state_reviewed | pass_with_upstream_blockers | 五部分状态/迁移/传播与跨状态审计完成；已进入 Step 10 |
| 10 | 异常边界 | Step 8~9 | `02_hld_step_10_exceptions_boundaries.md` | done | self_reviewed | pass_with_upstream_blockers | 40 个异常场景、影响图与审计完成；已进入 Step 11 |
| 11 | 配置影响 | Step 4~10、横切约束 | `02_hld_step_11_configuration_impact.md` | done | self_reviewed | pass_with_upstream_blockers | 影响类别、禁止配置化边界与交接完成；已进入 Step 12 |
| 12 | 详细设计承接 | Step 4~11 | `02_hld_step_12_detailed_design_handoff.md` | done | self_reviewed | pass_with_upstream_blockers | 17 项交接、测试切口与回退规则完成；已进入 Step 13 |
| 13 | 风险与待确认 | Step 4~12、上游 blocker | `02_hld_step_13_risks_open_questions.md` | done | self_reviewed | pass_with_upstream_blockers | 14 风险、10 待确认与路径门禁完成；已进入 Step 14 |
| 14 | 正式装配 | Step 1~13、概要书写规范 | `02_hld_step_14_formal_document_assembly.md` | done | formal_assembly_completed | formal_stop_review | 正式 02 已 full-restart 装配并通过静态审计；等待用户明确授权 03 |

## 3. 标准与输入台账

| 材料 | 用途 | 当前口径 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` | 14 Step 执行主链 | 每 Step 独立落盘与过门禁 |
| `standards/document/概要设计书写规范.md` | 正式 14 章与对象/API/流/状态粒度 | Step 14 只装配既有结论 |
| 设计通则、中间产物规范、闭环标准、全局依赖规则 | full-restart、三层台账、truth/落码/依赖纪律 | Layer 5 窗口不改变本仓串行顺序 |
| 本项目正式 `00-需求文档.md` | FR/BR/NFR/AC 与 owner 边界 | 需求不等于接口/schema 已闭合 |
| 本项目正式 `01-架构设计.md` | 五部分、分层、依赖、数据与通信边界 | 架构名不等于实现符号 |
| `L0-sdk`、五个 L1 owner、`L4-archive`、`L4-observability` 当前正式文档及必要台账 | 专项 owner 与 seam 核验 | 精确合同未闭合处保留 blocker |
| `projects/L1-workspace/draft/` 与其 02 calibration / 正式 02 | 框架和粒度样本 | 不继承 Workspace 业务主语或结论 |
| L5-sync README、旧正式 02、draft | 历史污染与候选线索 | 不直接成为当前 truth |

## 4. 稳定结构基线

业务主要组成部分固定承接正式 01：

1. `Selection & Access`
2. `Working Copy & Metadata`
3. `Source Materialization`
4. `Conflict & Recovery`
5. `Review Handoff & Provenance`

`External Owner References` 只作为五部分共享的本地引用/快照支撑，不成为第六个业务 truth 组成部分。实现分层与业务组成部分正交：Inbound / Operations、Application Services、Domain Model / Policies、Ports、local metadata persistence、SDK/Git/filesystem/observability adapters。

## 5. 持续 blocker 与完成上限

`SYNC-UP-001~010` 详见项目台账。它们允许本轮定义 fail-closed / unsupported / needs-action 的类型化骨架，但阻止锁定未经 owner 支持的 SDK 方法、source priority、review ACK/probe、metadata 永久 schema、Git remote 映射、增量 comparator、LFS/浅克隆/GUI 支持事实和自动冲突决策。

正式 02 的完成含义仅为：概要层代码主体、对象、接口、流、状态、异常、配置影响与详细设计交接已形成可审查基线；不表示代码可运行或上游合同已交付。

## 6. 当前恢复点

```text
current_document = 02-概要设计.md
current_step = 14
current_module = formal_assembly_completed_stop_review
gate_status = formal_stop_review
next_allowed_action = wait_for_user_confirmation_before_03
formal_02_write_allowed = completed / closed
formal_03_calibration_write_allowed = false_until_new_user_authorization
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
