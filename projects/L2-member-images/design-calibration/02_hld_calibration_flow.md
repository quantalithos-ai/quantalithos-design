# L2-member-images 02 概要设计全量校准流程

> 创建日期: 2026-08-23
> 最近更新: 2026-08-25
> 状态: `completed_stop_review`
> 当前模式: `full-restart`
> 设计仓: `/home/aris/Projects/quantalithos-design`
> 项目目录: `projects/L2-member-images`
> 正式文档目标: `projects/L2-member-images/02-概要设计.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 当前授权: 用户已明确授权完成全部 02；正式 02 已完成并停审，未授权 03、实现或 commit。

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 14 正式概要设计装配 | `formal_document_assembly` | `pass_stop_review` | Step 1~13 结论已完成固定 14 章装配；历史污染和全量审计通过 | 停止并等待用户明确确认；确认后才可创建 03 flow，不得提前写 03 或 commit | `02_hld_step_14_formal_document_assembly.md`;`02_hld_step_13_risks_open_questions.md`;`02-概要设计.md` |

## 2. 执行纪律

- 项目内严格按 `00 -> 01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07` 推进；正式 02 完成后立即停审，未经用户确认不得进入 03。
- 02 内部严格按 `Step 1 -> Step 14` 串行；当前 Step 通过和用户继续确认前，不得创建下一个 Step 文件。
- 每次开工、继续、上下文恢复时，先读 `project_execution_ledger.md`，再读本 flow 和当前 Step 文件，确认当前文档、Step、模块与下一允许动作。
- 每个 Step 必须先形成问题回答、诊断、改动前后对比、设计取舍、结构化中间产物、回填草稿、待确认事项和下一步门禁。
- 正式 `02-概要设计.md` 只允许在 Step 14 由 Step 1~13 已确认结论装配；此前不得读取、删除或修改旧正式 02。
- 旧 README、旧正式 `00/01/02/03/05/06` 只作 `historical_material`；旧正式 02 仅可在后置历史污染审计门禁开放后读取，不能直接继承。
- `BC-MI-01~05`、`LS-MI-01~04` 是架构语义边界，不得机械映射 service、crate、module、database 或部署单元。
- 依赖必须区分 `compile/runtime/event/ref/adapter/fake`；物理装配、消费或 sibling 协作不自动形成源码依赖。
- External truth 只可通过正式 ref、snapshot、safe conclusion 或产品中立 adapter 进入；fake 只能用于后续测试切口。
- Candidate、eligibility、availability、Artifact handoff 与 consumer / container 状态分别成立，不得压成单一 ready 生命周期。
- `MI-UP-001~009`、`Q-MI-001~004` 必须保持显式；只能形成 pending、blocked、unavailable、gap 或 future，不得伪闭口。
- 不确定项不得转写成 schema、产品、数字、run、digest、report、evidence、测试、verdict、signoff 或 readiness 事实。
- 只修改 `projects/L2-member-images/` 下设计文档与校准材料；不实现代码、不修改其他项目正式文档、不提交 commit。

## 3. Step 总流程计划

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `02_hld_step_01_upstream_boundary.md` | 确认上游输入边界 | `completed_user_confirmed` | `pass` | 已由 Step 2 承接 | 上游关系、Stable / pending / blocked、不再回答 / 必须回答清单闭合；未提前设计。 |
| 2 | `02_hld_step_02_goals_scope.md` | 明确本仓设计目标与当前范围 | `completed_user_confirmed` | `pass` | 已由 Step 3 承接 | 目标、非范围、03 交付与概要深度明确；pending / conditional 上限完整。 |
| 3 | `02_hld_step_03_constraints.md` | 收稳约束条件 | `completed_stop_review` | `pass_stop_review` | 等待用户确认后进入 Step 4 | 影响主体、对象、接口、流程、状态、异常与配置的硬约束闭合。 |
| 4 | `02_hld_step_04_code_subject_framework.md` | 代码主体框架映射 | `completed_stop_review` | `pass_stop_review` | 继续 Step 5 | 架构语义到代码主体和实现分层的映射闭合，且不机械映射 BC。 |
| 5 | `02_hld_step_05_components_boundary.md` | 主要组成部分、职责与边界 | `completed_stop_review` | `pass_stop_review` | 继续 Step 6 | 主要部分逐项停审，职责、非职责与接缝无冲突。 |
| 6 | `02_hld_step_06_key_objects.md` | 关键对象轮廓 | `completed_stop_review` | `pass_stop_review` | 继续 Step 7 | 对象、字段 / 状态 / 函数骨架和禁止事项闭合。 |
| 7 | `02_hld_step_07_api_interface_skeleton.md` | API / 接口骨架 | `completed_stop_review` | `pass_stop_review` | 继续 Step 8 | Command / Query / Event / Job 与边界 seam 可追溯。 |
| 8 | `02_hld_step_08_processing_flows.md` | 关键处理流 / 重要函数数据流 | `completed_stop_review` | `pass_stop_review` | 继续 Step 9 | 入口、编排、领域判断、port / repository / projection 的主流闭合。 |
| 9 | `02_hld_step_09_state_machine.md` | 状态机与状态流转 | `completed_stop_review` | `pass_stop_review` | 继续 Step 10 | 局部状态集合、迁移、禁止迁移与跨 owner gap 分层闭合。 |
| 10 | `02_hld_step_10_exceptions_boundaries.md` | 异常与边界场景轮廓 | `completed_stop_review` | `pass_stop_review` | 继续 Step 11 | 异常归属、保守失败与恢复边界可追溯。 |
| 11 | `02_hld_step_11_configuration_impact.md` | 配置影响轮廓 | `completed_stop_review` | `pass_stop_review` | 继续 Step 12 | 配置影响和禁止配置化边界明确，不生成正式 04 配置事实。 |
| 12 | `02_hld_step_12_detailed_design_handoff.md` | 详细设计承接清单 | `completed_stop_review` | `pass_stop_review` | 继续 Step 13 | 03 需展开的对象、接口、流程、状态、错误与配置契约有唯一来源。 |
| 13 | `02_hld_step_13_risks_open_questions.md` | 设计风险与待确认事项 | `completed_stop_review` | `pass_stop_review` | 继续 Step 14 | 风险与待确认分开，全部 upstream blocker 保留。 |
| 14 | `02_hld_step_14_formal_document_assembly.md` | 整理正式概要设计文档 | `completed_stop_review` | `pass_stop_review` | 停止并等待用户确认后才可进入 03 | 正式 02 已按固定 14 章重建；历史污染、对象、pending、范围、Markdown 与 diff 审计通过。 |

## 4. 公共输入与当前准入

| 输入 | 当前定位 | 本概要设计用法 |
|---|---|---|
| `projects/L2-member-images/00-需求文档.md` | 已停审的直接需求基线 | 承接 C / F / BR / D / IF / DEP / NFR / AC / VETO 与开放条件，不重写需求。 |
| `projects/L2-member-images/01-架构设计.md` | 已停审的直接架构基线 | 承接 BC / LS、运行角色、责任层、数据与一致性、交互、机制、风险和 ADR，不重写架构。 |
| `design-calibration/00_req_step_*.md`、`01_arch_step_*.md` | 已完成校准链 | 按需追溯正式 00 / 01 结论形成过程，不把过程状态当实现事实。 |
| 概要设计 SOP、书写规范及启动标准 | normative | 约束 Step 1~14、14 章结构、truth、依赖、证据和中间产物门禁。 |
| ADR-0005 | accepted / scoped | 只承接构建期预装、nightly、mapping owner、pinned production entry 与禁 `latest`。 |
| Runtime、Tools、Method Library、Artifact、Sandbox、Core 当前正式链与台账 | owner / dependency inputs | 只消费已正式闭口的 owner 和边界；实现状态或未闭合 exact contract 不升级为 readiness。 |
| `L2-member` 并行讨论输入 | sibling owner placeholder | image truth 外置、component release 形态与 compatibility 均只保留 owner / pending；不承接任何已闭合 release contract。 |
| `L2-member-service` 并行讨论输入 | sibling consumer placeholder | host / container owner 与 future consumer direction 只作 placeholder；exact manifest / ref / qualification / confirmation 均由 `MI-UP-001` 挂起。 |
| `L1-governance` 当前正式概要链 | pattern reference only | 仅参考职责分层、truth / projection、owner / adapter 分离与实施粒度。 |
| 旧正式 02、旧 README / 03 / 05 / 06、`draft/` | historical / non-normative | 旧正式 02 的后置污染审计已完成；其他历史材料不直接形成概要结论。 |

## 5. 当前门禁

```text
document_status = completed_stop_review
current_step = 14
current_module = formal_document_assembly
gate_status = pass_stop_review
gate_reason = formal_02_rebuilt_from_steps_1_to_13_and_full_audit_passed
next_allowed_action = wait_for_user_confirmation_before_creating_03_flow
formal_02_write_allowed = false_after_stop_review
old_formal_02_read_allowed = historical_audit_complete
future_step_files_allowed = false_until_user_confirms_03
next_formal_document_allowed = false_until_user_confirmation
implementation_allowed = false
commit_required = false
```
