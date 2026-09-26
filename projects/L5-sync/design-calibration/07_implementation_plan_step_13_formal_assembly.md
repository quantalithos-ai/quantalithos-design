# Step 13. 整理正式实施计划文档

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 13
> 回填目标：正式 `projects/L5-sync/07-实施计划.md`

## Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 13 / formal_document_assembly |
| Step 状态 | `completed / stop_review`（正式文档、实施台账和 16 个 skeleton 已写入并完成静态审计） |
| gate_status | `pass_with_upstream_blockers` |
| 下一步 | `user_review_formal_07`；未经新授权不得进入实现、测试或 commit |

## 本步输入

| 输入 | 来源 | 状态 | 正式回填 |
|---|---|---|---|
| 输入边界 | `07_implementation_plan_step_01_input_boundary.md` | completed / stop_review | §1 |
| 目标/范围 | `07_implementation_plan_step_02_scope.md` | completed / stop_review | §2 |
| 前置/阅读 | `07_implementation_plan_step_03_prerequisites_reading.md` | completed / stop_review | §3 |
| 交付物 | `07_implementation_plan_step_04_deliverables.md` | completed / stop_review | §4 |
| 阶段/依赖 | `07_implementation_plan_step_05_phases.md` | completed / stop_review | §5 |
| 任务/提交 | `07_implementation_plan_step_06_tasks_commits.md` | completed / stop_review | §6 |
| 测试/验收门禁 | `07_implementation_plan_step_07_test_acceptance_gates.md` | completed / stop_review | §7 |
| 配置/依赖 | `07_implementation_plan_step_08_dependencies.md` | completed / stop_review | §8 |
| Spike/风险 | `07_implementation_plan_step_09_spikes_risks.md` | completed / stop_review | §9 |
| 回退/变更 | `07_implementation_plan_step_10_rollback_change.md` | completed / stop_review | §10 |
| 提交/交付 | `07_implementation_plan_step_11_commit_handoff.md` | completed / stop_review | §11 |
| 完成判定 | `07_implementation_plan_step_12_completion.md` | completed / stop_review | §12 |
| 规范/SOP | 07 三份规范、真相源闭环、目录组织、TypeScript | read | 章节和审计约束 |

## SOP 问题回答

| 问题 | 收口回答 | 依据 |
|---|---|---|
| 正式文档是否覆盖 13 章？ | 是，严格使用实施计划规范 §1～§13 主链；每章有具体 calibration 来源。 | 07 SOP Step 13、书写规范 §3 |
| 是否复制详细设计？ | 否。正式 07 只承载阶段、任务、门禁、依赖、风险、提交和完成判定；字段/状态/协议细节回指 03。 | 07 书写规范 §2.4 |
| 是否创建实现代码？ | 否。只创建设计仓台账和 planned boundary skeleton；目标实现仓仍 absent/not_created。 | 用户约束、07 台账规范 |
| 是否填写真实 commit/run/evidence/readiness？ | 否。所有实现记录为 planned/blocked/waiting；当前无真实 artifact/report/evidence。 | 05/06/台账规范 |
| 正式 07 完成后下一步是什么？ | `user_review_formal_07`；未经新授权不得创建实现仓、改代码、跑测试或提交。 | 用户约束、flow |

## 当前文档问题诊断

| 问题 | 影响 | 装配处理 |
|---|---|---|
| 旧 07 不存在 | 无旧文件可删除，但仍需证明 full-restart | 记录 `formal_07_old_file = absent`，以 Step 1～12 装配 |
| implementation ledger/skeleton 尚不存在 | 正式 07 完成时必须同步创建 | 本步按 16 boundary 全量预创建；状态不超过 planned/blocked/waiting |
| target implementation repo 不存在 | 不可填写 baseline/hash/实际 gate | ledger 使用 `no approved baseline / blocked`，不伪造 hash |
| 上游 positive blocker 持续 | 计划不能宣称 ready | 正式 07 标 `formal / stop_review`，实施移交状态另列 blocked/waiting |

## 改动前后对比

| 维度 | 装配前 | 装配后 | 理由 |
|---|---|---|---|
| 正式 07 | §1～§4 已写入 | §1～§13 full-restart formal document | 已完成正式装配 |
| 实施台账 | absent | project ledger + 16 boundary skeleton | 已创建并保持 planned/blocked/waiting |
| 状态 | calibration Step 13 | formal/stop_review；实现 not_started | 区分计划完成与代码完成 |
| 交付口径 | 只有 calibration | 正式可交给用户复核的实施路径 | 可追溯到具体 Step 文件 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 在旧 07 上增量追加 | 省写入 | 旧口径可能污染 phase/boundary | 拒绝 |
| 只写正式 07，不建实施台账 | 文档短 | 实现移交时无恢复和门禁载体 | 拒绝 |
| 按 Step 1～12 full-restart 装配 13 章，且同步预创建全部 planned boundary skeleton | 完整可追溯，符合 07 规范 | 文件较多 | 采用 |

## 结构化中间产物

### 正式章节来源映射

| 正式章节 | 唯一来源 | 装配内容 |
|---|---|---|
| §1 | Step 1 | 上游输入、baseline、阻塞边界 |
| §2 | Step 2 | 目标、范围、非范围、P0/P1/P2 |
| §3 | Step 3 | 阅读清单、矩阵、记忆种子、台账和环境检查 |
| §4 | Step 4 | 对象族、交付物、非交付物 |
| §5 | Step 5 | PH-01～PH-08 图、表、增量和依赖审计 |
| §6 | Step 6 | 任务、批次、16 boundary、Gate Matrix、经验复核 |
| §7 | Step 7 | GATE-01～16、TC/AC/VETO、evidence/report 规则 |
| §8 | Step 8 | 依赖分类、profile、fake ceiling、builder 顺序 |
| §9 | Step 9 | Spike、风险、待确认、截止点 |
| §10 | Step 10 | pause/rollback/change/recovery |
| §11 | Step 11 | commit/review/handoff、message、artifact/report |
| §12 | Step 12 | boundary/phase/overall completion、closure audit |
| §13 | 本步 | 参考、状态声明、实施移交上限 |

### 正式装配约束

1. 正式 07 只承载收口结论；SOP 问题回答、旧材料诊断和方案取舍留在 calibration。
2. 每章开头列出具体 `design-calibration/07_implementation_plan_step_*.md` 来源和延伸阅读。
3. 不写实现仓 commit hash、测试结果、真实 artifact/report/evidence、review verdict、signoff 或 readiness。
4. 不新增 00～06 未定义的需求、对象、字段、协议、状态、配置 leaf、outbound event 或 truth owner。
5. implementation ledger 与 boundary skeleton 只记录 planned/blocked/waiting；不授权实现。
6. 未来 boundary 缺少 required reads、allowed/forbidden scope、required checks、Commit/Handoff Gate 时不得移交实现。

### 装配后静态审计目标

- [x] §1～§13 全部存在且顺序正确。
- [x] 每章 calibration 来源具体可定位。
- [x] PH-01～PH-08、commit-01-a～commit-08-b 编号一致。
- [x] GATE-01～16、TC/SUITE/EV、AC/VETO 回指无孤儿。
- [x] 29 objects、10 Command、13 Query、3 Consumer、0 Outbound Event、3 Job、17 state、42 leaf/4 profiles 与 03/04/05/06 一致。
- [x] 固定证据路径只使用 `artifacts/test/<run_id>/`、`reports/runs/<run_id>/`、`reports/acceptance/`。
- [x] 无 `latest`、`reports/<project>`、`artifacts/test/<project>/<run_id>` 作为正式引用。
- [x] 无真实实现、commit、run、artifact、report、evidence、verdict、signoff、readiness 声明。
- [x] implementation ledger 和 16 个 boundary skeleton 均存在，状态值合法。
- [x] 07 完成后 flow/ledger 均切换到 `formal / stop_review` 和 `user_review_formal_07`。

## 回填草稿

正式 07 采用规范要求的 §1～§13 主链；正文只放收口实施计划，详细过程保留在本 Step 和 Step 1～12 文件。文档完成后同步创建 `design-calibration/implementation_execution_ledger.md` 和 `implementation-boundaries/commit-*.md` 全量 skeleton。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 用户审查正式 07 | 是否允许未来实现移交 | 正式 07 停审后 |
| target repo/baseline/toolchain | 是否能激活 commit-01-a | 用户明确实现授权后 |
| blocker 解锁 | 各正向 boundary | 对应 phase 开工前 |

## 进入下一步条件

- [x] Step 1～12 均 `completed / stop_review`。
- [x] 正式章节映射、装配约束和静态审计目标完成。
- [x] 正式 07 full-restart 创建并补齐 §1～§13。
- [x] project implementation ledger 和全部 boundary skeleton 创建。
- [x] 最终静态审计通过并停审；下一动作是 `user_review_formal_07`。
