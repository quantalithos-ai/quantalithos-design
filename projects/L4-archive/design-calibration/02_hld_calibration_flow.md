# L4-archive 02 概要设计校准流程

> 模式：`full-restart + single-agent-serial`；日期：2026-09-10。
> 正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 已停审；02 授权范围已执行完毕。
> 旧 `02-概要设计.md` 只作 `historical_material` / 污染审计输入；Step 14 前不得局部回填。

## 1. 执行边界

- 只修改 `projects/L4-archive/`；不实现代码、不运行测试、不修改 owning project、不提交 commit。
- 严格按 Step 1→14；只有当前 Step 通过门禁后才创建下一 Step 文件。
- Step 5~9 以 CP1~CP6 为小循环主轴，逐组成部分完成问题、诊断、取舍、结构化、回填和停审，再做跨部分审计。
- `AR-UP-001~009`、`AR-ARCH-001` 继续开放；允许收稳本地骨架和负向语义，不允许声称外部合同、provider、digest、receiver 或 readiness 已存在。
- 正式 02 只在 Step 14 删除旧文件后重建；正式正文只摘录已停审中间产物。

## 2. 总流程计划与状态台账

| Step | 主题 | 输入 | 输出文件 | 状态 | 当前模块 | 完成门禁 |
|---|---|---|---|---|---|---|
| 1 | 确认上游输入边界 | 正式 00/01、全局规则、正式上游 | `02_hld_step_01_upstream_boundary.md` | `done` | self_reviewed | 可承接/不再回答/必须回答及裁剪收稳 |
| 2 | 设计目标与范围 | Step 1、00 §4/9、01 §14/15 | `02_hld_step_02_goals_scope.md` | `done` | self_reviewed | 目标、非范围、设计深度收稳 |
| 3 | 约束条件 | Step 1~2、01 §3/8~13 | `02_hld_step_03_constraints.md` | `done` | self_reviewed | 约束能指导对象/接口/流/状态 |
| 4 | 代码主体框架 | Step 2~3、01 §6~11 | `02_hld_step_04_code_subject_framework.md` | `done` | self_reviewed | 两张必需图、业务轴/分层轴收稳 |
| 5 | 组成部分与边界 | Step 4、01 U1~U6 | `02_hld_step_05_components_boundary.md` | `done` | self_reviewed | CP1~CP6 逐项停审、对象候选池与跨部分审计通过 |
| 6 | 关键对象轮廓 | Step 5、01 §9 | `02_hld_step_06_key_objects.md` | `done` | self_reviewed | 逐 CP 对象卡、有类型字段/函数及反查通过 |
| 7 | API / 接口骨架 | Step 5~6、01 §10 | `02_hld_step_07_api_interface_skeleton.md` | `done` | self_reviewed | Command/Query/Event/Job 逐 CP 停审 |
| 8 | 关键处理流 | Step 5~7 | `02_hld_step_08_processing_flows.md` | `done` | self_reviewed | P0/状态写入/一致性 Job 有独立流并跨流审计 |
| 9 | 状态机与流转 | Step 6~8 | `02_hld_step_09_state_machine.md` | `done` | self_reviewed | 多轴状态逐 CP 停审且不互相推导 |
| 10 | 异常与边界 | Step 8~9、00 §14 | `02_hld_step_10_exceptions_boundaries.md` | `done` | self_reviewed | 关键异常有归属与保守口径 |
| 11 | 配置影响 | Step 4~10、01 §13 | `02_hld_step_11_configuration_impact.md` | `done` | self_reviewed | 影响轮廓、禁止配置化、03/04 交接收稳 |
| 12 | 详细设计承接 | Step 4~11 | `02_hld_step_12_detailed_design_handoff.md` | `done` | self_reviewed | 稳定主语、继续展开项和回退规则收稳 |
| 13 | 风险与待确认 | Step 4~12、项目台账 | `02_hld_step_13_risks_open_questions.md` | `done` | self_reviewed | 概要风险与外部路径门禁分开 |
| 14 | 正式装配 | Step 1~13、概要规范 | `02_hld_step_14_formal_document_assembly.md` | `done` | self_reviewed | 14 章、来源、引用、跨章静态审计通过并停审 |

未来 Step 仅存在于本表，不提前创建。`done` 表示文档静态产物完成，不表示外部合同或运行能力 ready。

## 3. 标准与输入台账

| 材料 | 使用范围 | 当前判断 |
|---|---|---|
| 概要设计 SOP 全 14 Step、概要设计书写规范新版强骨架 | 全程 | 旧规范保留区只作反例边界，正式输出采用新版 14 章 |
| 通用设计标准、中间产物规范、真相源闭环标准、全局依赖规则 | 全程 | 三层门禁、逐 Step、依赖分类、可落码与证据边界 |
| 本仓正式 00/01 与 00/01 flow、Step 16、项目台账 | 直接基线 | 需求/架构结论稳定；blocker 原样继承 |
| `L1-workspace` 正式 02 与 02 flow/Step | 粒度样本 | 借鉴逐 CP、对象卡、接口/流/状态粒度，不复制 workspace 领域主语 |
| identity/conversation/work/process/governance/artifact 正式设计 | owner 边界 | snapshot/export/ref 与 restore receiver 只能写本地需求 seam |
| `L4-observability` 正式设计 | audit material 边界 | audit material/ref 不等于完整审计链或 backend truth |
| `L0-core` / `L0-bus` / `L0-sdk` 正式设计 | 共享契约、event、client 边界 | Core 仅核验后 compile；Bus/SDK 不成为业务 truth 或反向依赖 |
| 本仓 README、旧 02/03/05/06、draft | historical material | 只做后置污染审计，不继承对象、SLA、provider 或成功声明 |

## 4. 当前恢复点

```text
current_document = 02-概要设计.md
current_step = 14_done
current_module = formal_stop_review
gate_status = pass_with_upstream_blockers / stop_review
gate_reason = 正式 02 已完成 14 章、14 来源、六 CP、26 对象、30 入口、多轴状态、38 异常、配置与 blocker 静态审计
next_allowed_action = 等待用户新的明确授权；若授权 03，先读取详细设计 SOP 与书写规范，再创建/更新 03 flow、Step 1 和项目台账
formal_02_write_allowed = false_except_review_fixes
next_document_03_allowed = false_until_new_explicit_user_authorization
```
