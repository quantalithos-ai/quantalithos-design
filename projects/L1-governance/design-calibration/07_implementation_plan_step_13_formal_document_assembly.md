# Step 13. 整理正式实施计划文档

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 13
> 回填章节: `projects/L1-governance/07-实施计划.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 整理正式实施计划文档 |
| 当前状态 | 进行中;先完成本中间产物,再分章节装配正式文档 |
| 输入基线 | Step 1~Step 12 中间产物;`standards/document/实施计划书写规范.md`;当前 Governance 文档目录 |
| 输出文件 | `projects/L1-governance/design-calibration/07_implementation_plan_step_13_formal_document_assembly.md`;`projects/L1-governance/07-实施计划.md` |
| 停审方式 | 用户已要求自动执行完成;本 Step 完成后进行最终文档检查 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 1 输入边界 | 已完成 | 装配正式 §1 |
| Step 2 范围 | 已完成 | 装配正式 §2 |
| Step 3 前置条件与阅读清单 | 已完成 | 装配正式 §3 |
| Step 4 实施对象与交付物 | 已完成 | 装配正式 §4 |
| Step 5 阶段与依赖顺序 | 已完成 | 装配正式 §5 |
| Step 6 任务、批次与提交边界 | 已完成 | 装配正式 §6 |
| Step 7 测试与验收门禁 | 已完成 | 装配正式 §7 |
| Step 8 配置、环境与外部依赖 | 已完成 | 装配正式 §8 |
| Step 9 Spike、风险与待确认事项 | 已完成 | 装配正式 §9 |
| Step 10 回退、暂停与变更控制 | 已完成 | 装配正式 §10 |
| Step 11 提交、评审与交付纪律 | 已完成 | 装配正式 §11 |
| Step 12 实施完成判定 | 已完成 | 装配正式 §12 |
| `standards/document/实施计划书写规范.md` | 已存在 | 校验正式章节结构、边界和提交纪律 |

## 3. SOP 问题回答

1. 正式文档是否完整覆盖书写规范章节主链。

   回答: 正式文档必须使用 13 个章节:上游关系、目标范围、前置阅读、交付物、阶段顺序、任务提交边界、测试验收门禁、配置环境依赖、Spike 风险、回退暂停变更、提交评审交付、完成判定、参考。

2. 每一章是否来自已确认中间产物。

   回答: 是。§1~§12 分别来自 Step 1~Step 12;§13 来自本 Step 的来源映射和标准引用。每章正文开头必须列出校准来源。

3. 阶段编号、任务编号和门禁编号是否一致。

   回答: 正式文档沿用 PH-01~PH-08、commit-01-a~commit-08-b、SP/R/OQ-GOV 编号、AC/VETO/EV/report 路径,不得在装配时改名。

4. 上游引用、测试引用和验收引用是否准确。

   回答: 正式文档引用 `00`~`06`、Step 中间产物和 standards;不复制详细设计字段级契约,只引用来源和实施门禁。

5. 是否存在详细设计内容被复制进实施计划。

   回答: 正式文档只保留实施层必要索引、phase、boundary、门禁、风险和纪律,不复制完整 object/DTO/port/flow schema。

6. 每个 phase / commit boundary 是否都有开工前字段、DTO、状态、证据和 phase boundary 复核。

   回答: 正式 §6 必须保留通用开工前设计闭环复核、commit boundary 经验复核责任和提交前门禁摘要。

7. 正式 `07` 是否包含交付实现前可落码闭环审计门禁、审计表和对应永久记忆种子。

   回答: 正式 §3 保留永久记忆种子摘要;§6/§12 保留可落码闭环审计门禁和审计表。

8. 是否存在未解释的空表、空图或占位内容。

   回答: 正式文档不得保留空表。路径模板中的 `run_id` 作为运行期变量说明,不作为未填占位。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| `07-实施计划.md` | 尚不存在 | 无法移交实现 | 本 Step 创建正式文档 |
| Step 1~12 | 内容较详细 | 正式文档若全量复制会冗长并重复详细设计 | 正式文档摘要装配,保留校准来源 |
| Step 6 | commit boundary 表很长 | 正式文档必须保留可执行边界,但可压缩批次细节 | 正式 §6 放总表和关键复核规则 |
| Step 7 | 门禁矩阵较长 | 正式文档需保留 phase / boundary 门禁摘要 | 正式 §7 放阶段门禁和证据规则 |
| Step 12 | 完成判定为执行期判定 | 正式文档不能填假结果 | 只写判定标准和证据路径 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 正式 `07` | 不存在 | 将创建完整 13 章正式实施计划 | 满足实施移交输入 |
| 校准来源 | 分散在 Step 文件 | 每章显式列出来源 | 保持追溯 |
| 表格细节 | 中间产物非常详细 | 正式文档保留执行必需摘要 | 避免重复 detailed design |
| 完成判定 | 仅在 Step 12 中 | 正式 §12 固定送验条件 | 让实施者知道何时可结束 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 全量复制 Step 1~12 | 信息完整 | 正式文档过长,重复中间产物 | 不采用 |
| 只写极简摘要 | 文档短 | implementation agent 缺少可执行边界 | 不采用 |
| 正式文档保留执行摘要,细节回指中间产物 | 可读且可追溯 | 需要准确来源映射 | 采用 |
| 一次性写完整正式文档 | 快 | 不符合用户逐文件分批要求 | 不采用 |
| 先搭框架再分章节回填 | 稳定 | 需要多批 patch | 采用 |

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
| 来源可追溯 | 每章开头列出具体校准来源 |
| 不重写详细设计 | 不复制完整 object、DTO、port、flow、DDL |
| 不伪造执行结果 | 不填写真实 run_id、implementation commit、config digest、final verdict |
| boundary 可执行 | 保留 PH、commit boundary、门禁、复核、暂停和完成规则 |
| 证据真实 | release evidence 从 raw artifact/report 推导,不得静态宣告 pass |
| P1/P2 不污染 P0 | selected-run unavailable 只进入 residual |
| 实现者不补设计 | 字段/DTO/状态/port/evidence 缺口必须暂停并回写设计 |

### 7.3 实施计划评审清单

| 审查项 | 通过条件 |
|---|---|
| 章节完整性 | 正式文档包含 13 个章节 |
| 校准来源 | 每章有具体 Step 文件来源 |
| 阶段一致性 | PH-01~PH-08 未改名 |
| commit boundary 一致性 | commit-01-a~commit-08-b 未改名 |
| 门禁一致性 | Step 7 的 phase / boundary 门禁在正式文档中有摘要 |
| 风险一致性 | Step 9 的 blocker/residual/open question 被保留 |
| 回退一致性 | Step 10 的 pause/rollback/change/recovery 规则被保留 |
| 提交纪律 | Step 11 的实现仓英文 commit 和 body 分组规则被保留 |
| 完成判定 | Step 12 的 evidence、VETO、design closure audit 被保留 |
| 无空表 | 正式文档没有未解释空表或未填占位 |

### 7.4 剩余风险与待确认事项

| 事项 | 处理 |
|---|---|
| 目标实现仓当前未发现 | 正式 §3/§8/§9 写为 PH-01 开工前 blocker |
| 当前工作区有大量 Governance 文档未提交 | 正式 §1/§3 写为实现移交前必须固定 design baseline |
| P1 selected-run、真实产品、production-like 未覆盖 | 正式 §2/§9/§12 写为 residual/future |
| 实际 run_id、implementation commit、config digest 尚不存在 | 正式 §7/§12 写为执行期填写,不得伪造 |

## 8. 回填草稿

正式 `07-实施计划.md` 应在本 Step 中分批创建。装配顺序:

1. 创建文档标题、状态、目录和 13 章框架。
2. 回填 §1~§4:输入边界、范围、前置阅读、交付物。
3. 回填 §5~§6:phase、任务批次、commit boundary、开工前复核。
4. 回填 §7~§8:测试验收门禁、配置环境依赖。
5. 回填 §9~§12:风险、回退变更、提交纪律、完成判定。
6. 回填 §13:参考和中间产物来源。
7. 运行局部文档检查。

## 9. 待确认事项

| 待确认事项 | 当前处理 |
|---|---|
| 是否在本轮提交正式 `07` | 用户此前要求不要提交,仅写文档;不执行 git commit |
| 正式文档是否需要更长表格 | 中间产物保留详细表,正式文档保留执行摘要和来源 |
| 文档状态如何标注 | 标注为正式实施计划初版,但实现移交前仍需固定 design baseline |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 章节来源映射完成 | 通过 | §7.1 |
| 装配原则完成 | 通过 | §7.2 |
| 评审清单完成 | 通过 | §7.3 |
| 剩余风险清楚 | 通过 | §7.4 |
| 可创建正式 `07` | 通过 | 下一步按章节分批写正式文档 |
