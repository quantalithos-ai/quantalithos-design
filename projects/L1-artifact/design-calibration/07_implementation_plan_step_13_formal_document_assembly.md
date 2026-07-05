# Step 13. 整理正式实施计划文档

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 13
> 回填章节: `projects/L1-artifact/07-实施计划.md`
> 参考粒度: `projects/L1-governance/design-calibration/07_implementation_plan_step_13_formal_document_assembly.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 整理正式实施计划文档 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 1~Step 12 中间产物;`实施计划书写规范.md`;`代码实施台账与门禁规范.md`;当前 `L1-artifact` 正式 `00`~`06` |
| 输出文件 | `projects/L1-artifact/design-calibration/07_implementation_plan_step_13_formal_document_assembly.md`;`projects/L1-artifact/07-实施计划.md`;implementation ledger skeleton |
| 停审方式 | 完成本 Step 后暂停,由用户审查正式 `07`、项目级 implementation ledger 和 boundary skeleton |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 1 输入边界 | 已完成;用户已确认 | 装配正式 §1 |
| Step 2 范围 | 已完成;用户已确认 | 装配正式 §2 |
| Step 3 前置条件与阅读清单 | 已完成;用户已确认 | 装配正式 §3 |
| Step 4 实施对象与交付物 | 已完成;用户已确认 | 装配正式 §4 |
| Step 5 阶段与依赖顺序 | 已完成;用户已确认 | 装配正式 §5 |
| Step 6 任务、批次与提交边界 | 已完成;用户已确认 | 装配正式 §6 and implementation ledgers |
| Step 7 测试与验收门禁 | 已完成;用户已确认 | 装配正式 §7 |
| Step 8 配置、环境与外部依赖 | 已完成;用户已确认 | 装配正式 §8 |
| Step 9 Spike、风险与待确认事项 | 已完成;用户已确认 | 装配正式 §9 |
| Step 10 回退、暂停与变更控制 | 已完成;用户已确认 | 装配正式 §10 |
| Step 11 提交、评审与交付纪律 | 已完成;用户已确认 | 装配正式 §11 |
| Step 12 实施完成判定 | 已完成;用户已确认 | 装配正式 §12 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 正式文档是否完整覆盖书写规范章节主链? | 是。正式 `07` 使用 13 章主链:上游关系、目标范围、前置阅读、交付物、阶段顺序、任务提交边界、测试验收门禁、配置环境依赖、Spike 风险、回退暂停变更、提交评审交付、完成判定、参考。 |
| 每一章是否来自已确认中间产物? | 是。正式 §1~§12 分别来自 Step 1~Step 12,§13 来自本 Step 的来源映射和标准引用。 |
| 阶段编号、任务编号和门禁编号是否一致? | 是。沿用 PH-01~PH-08、`commit-01-a`~`commit-08-b`、`SP-ART-*`、`R-ART-*`、`OQ-ART-*`、`AC-ART-*`、`VETO-ART-*` 和 `EV-CAND-ART-*`。 |
| 上游引用、测试引用和验收引用是否准确? | 是。正式文档引用正式 `00`~`06`、Step 中间产物和 standards;不复制详细设计字段级契约。 |
| 是否复制详细设计内容? | 否。正式 `07` 只保留实施层必要索引、phase、boundary、门禁、风险和纪律,字段 / DTO / port / flow 仍以正式 `03` 为真相源。 |
| 每个 phase / commit boundary 是否有开工前闭环复核? | 是。正式 §6 保留通用开工前设计闭环复核、经验复核责任和 Boundary Gate Matrix 摘要;implementation-boundaries 中逐 boundary 固定 required reads / gates。 |
| 正式 `07` 是否包含交付实现前可落码闭环审计门禁? | 是。正式 §12 固定 design closure audit 为实现可送验条件,且 implementation ledger 的恢复协议要求 blocker 回流。 |
| 是否存在未解释空表、空图或占位内容? | 未保留空表。`<run_id>` 是执行期变量,不代表未填写结果。真实 implementation commit、test result、config digest 和 signoff 不在设计阶段伪造。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| `07-实施计划.md` | 尚不存在 | 无法正式移交实现 | 创建正式 13 章文档 |
| implementation ledger | 尚不存在 | 实现 agent 会反复等待设计补 boundary | 创建项目级 ledger 和 20 个 boundary skeleton |
| Step 1~12 | 内容详细 | 若全量复制会过长 | 正式文档保留执行摘要,细节回指中间产物 |
| 执行期证据 | 真实 run_id / commit / signoff 不存在 | 容易误填假结果 | 正式文档明确执行期填写,设计阶段不伪造 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 正式 `07` | 不存在 | 已装配正式实施计划 | 满足实现移交输入 |
| 台账入口 | 不存在 | 已创建 implementation ledger skeleton | 满足代码实施门禁 |
| future boundary | 未建 | 全部预创建为 `planned / wait_until_current` | 避免实现推进时反复回设计补文件 |
| 校准来源 | 分散在 Step 文件 | 正式每章引用校准来源 | 保持追溯 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 全量复制 Step 1~12 | 信息最全 | 正式文档过长且重复中间产物 | 不采用 |
| 只写极简摘要 | 文档短 | 实现 agent 缺可执行边界 | 不采用 |
| 正式文档保留执行摘要并回指中间产物 | 可读且可追溯 | 需要准确来源映射 | 采用 |
| 不创建 boundary skeleton | 本轮少写文件 | 违反 implementation ledger 规范 | 不采用 |
| 预创建全部 boundary skeleton | 实现推进稳定 | 本轮文件更多 | 采用 |

## 7. 结构化中间产物

### 7.1 正式章节来源映射

| 正式章节 | 校准来源 |
|---|---|
| §1 与上游文档的关系声明 | `design-calibration/07_implementation_plan_step_01_input_boundary.md` |
| §2 实施目标与范围 | `design-calibration/07_implementation_plan_step_02_scope.md` |
| §3 实施前置条件与阅读清单 | `design-calibration/07_implementation_plan_step_03_prerequisites_reading.md` |
| §4 实施对象与交付物清单 | `design-calibration/07_implementation_plan_step_04_objects_deliverables.md` |
| §5 实施阶段与依赖顺序 | `design-calibration/07_implementation_plan_step_05_phases_dependencies.md` |
| §6 阶段任务拆分、编写顺序与提交边界 | `design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` |
| §7 测试与验收门禁嵌入 | `design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` |
| §8 配置、环境与外部依赖准备 | `design-calibration/07_implementation_plan_step_08_config_environment_dependencies.md` |
| §9 Spike、风险与待确认事项 | `design-calibration/07_implementation_plan_step_09_spikes_risks_open_questions.md` |
| §10 回退、暂停与变更控制 | `design-calibration/07_implementation_plan_step_10_rollback_pause_change_control.md` |
| §11 提交、评审与交付纪律 | `design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` |
| §12 实施完成判定 | `design-calibration/07_implementation_plan_step_12_completion_criteria.md` |
| §13 参考 | `design-calibration/07_implementation_plan_step_13_formal_document_assembly.md` |

### 7.2 正式文档装配原则

| 原则 | 要求 |
|---|---|
| 来源可追溯 | 每章开头列出校准来源 |
| 不重写详细设计 | 不复制完整 object、DTO、port、flow、DDL |
| 不伪造执行结果 | 不填写真实 run_id、implementation commit、config digest、final verdict |
| boundary 可执行 | 保留 PH、commit boundary、门禁、复核、暂停和完成规则 |
| 证据真实 | release evidence 从 raw artifact/report 推导,不得静态宣告 pass |
| P1/P2 不污染 P0 | selected-run unavailable 只进入 residual |
| 实现者不补设计 | 字段 / DTO / 状态 / port / evidence 缺口必须暂停并回写设计 |

### 7.3 实施计划评审清单

| 审查项 | 结论 | 说明 |
|---|---|---|
| 章节完整性 | 通过 | 正式文档包含 13 个章节 |
| 校准来源 | 通过 | 每章有具体 Step 文件来源 |
| 阶段一致性 | 通过 | PH-01~PH-08 未改名 |
| commit boundary 一致性 | 通过 | `commit-01-a`~`commit-08-b` 未改名 |
| 门禁一致性 | 通过 | Step 7 phase / boundary 门禁已摘要进入正式 §7 |
| 风险一致性 | 通过 | Step 9 blocker / residual / OQ 已保留 |
| 回退一致性 | 通过 | Step 10 pause / rollback / change / recovery 已保留 |
| 提交纪律 | 通过 | Step 11 实现仓英文 commit 和 body 分组规则已保留 |
| 完成判定 | 通过 | Step 12 evidence、VETO、design closure audit 已保留 |
| implementation ledger | 通过 | 项目级 ledger 和全部 boundary skeleton 已预创建 |
| 无空表 | 通过 | 正式文档无未解释空表或未填占位 |

## 8. 正式装配结果

| 输出 | 状态 | 说明 |
|---|---|---|
| `projects/L1-artifact/07-实施计划.md` | 已创建 | 13 章正式文档,由 Step 1~12 装配 |
| `projects/L1-artifact/design-calibration/implementation_execution_ledger.md` | 已创建 | 当前 boundary 为 `commit-01-a` |
| `projects/L1-artifact/design-calibration/implementation-boundaries/commit-01-a.md`~`commit-08-b.md` | 已创建 | `commit-01-a` ready,其余 planned / wait_until_current |

## 9. 待确认事项

| 待确认事项 | 当前处理 |
|---|---|
| 是否提交本轮正式 `07` 与台账 | 等用户明确要求提交 |
| 目标实现仓当前不存在 | 正式 §3 / §8 / §9 和 `commit-01-a` boundary 标为开工前检查 |
| design baseline 尚未有包含正式 `07` 的 commit hash | implementation ledger 用本轮 formal-07 baseline label;提交后可回写真实 design commit hash |
| release run_id、implementation commit、config digest | 执行期填写,不得在设计阶段伪造 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 正式 `07` 已创建 | 通过 | `projects/L1-artifact/07-实施计划.md` |
| implementation ledger 已创建 | 通过 | 项目级 ledger + 20 个 boundary skeleton |
| 正式文档检查已通过 | 通过 | boundary 列表、错误串、尾随空白和 `git diff --check` 已检查 |
| 可交用户审查 | 通过 | Step 13 正式装配结果可停审 |
