# Step 1. 确认实施输入边界

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 1
> 回填章节: `07-实施计划.md` §1 与上游文档的关系声明

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 1 确认实施输入边界 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | `00-需求文档.md`;`01-架构设计.md`;`02-概要设计.md`;`03-详细设计.md`;`04-配置设计.md`;`05-测试方案.md`;`06-验收标准.md`;实施计划 SOP / 书写规范;可落码性标准 |
| 输出文件 | `projects/L1-governance/design-calibration/07_implementation_plan_step_01_input_boundary.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 2 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `projects/L1-governance/00-需求文档.md` | 已存在 | 固定实施目标、需求范围、非范围、AC / VF 和数据归属红线 |
| `projects/L1-governance/01-架构设计.md` | 已存在 | 固定 Governance truth、依赖裁剪、跨仓协作和架构红线 |
| `projects/L1-governance/02-概要设计.md` | 已存在 | 固定主要组成部分、关键对象、接口骨架、处理流、状态和配置影响 |
| `projects/L1-governance/03-详细设计.md` | 已存在 | 固定模块、对象、port、protocol、flow、状态矩阵、事务、错误、幂等、配置、观测和实施承接 |
| `projects/L1-governance/04-配置设计.md` | 已存在但当前未跟踪 | 固定配置控制面、profile、adapter binding、secret / redaction 和外部依赖准备 |
| `projects/L1-governance/05-测试方案.md` | 已存在 | 固定测试切口、suite、gate、artifact / report root、EV 证据族和回归策略 |
| `projects/L1-governance/06-验收标准.md` | 已存在 | 固定验收门禁、VETO、risk acceptance、最终裁决和 evidence 真实性口径 |
| `projects/L1-governance/design-calibration/03_ddd_step_17_implementation_handoff.md` | 已存在 | 提供详细设计到实施计划的承接清单和实现前预复核输入 |
| `projects/L1-governance/design-calibration/03_ddd_step_19_formal_document_assembly.md` | 已存在 | 证明正式 `03` 已由 Step 1~18 装配,并给 `07` 提供正式入口 |
| `standards/document/实施计划讨论流程_SOP.md` | 已读取 | 固定 Step 1~13 的讨论顺序和中间产物要求 |
| `standards/document/实施计划书写规范.md` | 已读取 | 固定正式 `07` 章节结构、commit boundary、门禁和永久记忆种子要求 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 标准输入 | 固定每个 phase / commit boundary 的经验复核来源 |

## 3. SOP 问题回答

1. 当前仓是否已经具备完整的 00 / 01 / 02 / 03 / 05 / 06 文档。

   回答: 已具备 `00`、`01`、`02`、`03`、`05`、`06`,且当前还具备 `04-配置设计.md`。`07-实施计划.md` 尚不存在,应由本轮 Step 1~13 生成。`04` 和大量 calibration 文件当前处于未跟踪状态,这是提交 / baseline 风险,不阻塞继续制定实施计划。

2. 哪些上游文档版本是本轮实施计划的基线。

   回答: 本轮使用当前工作区的新版 `00`~`06` 作为设计阶段输入,当前 Git HEAD 为 `68eb677`。由于工作区存在大量未提交 Governance 文档,正式移交实现前必须固定新的 design baseline / commit,不能只引用当前脏工作区。

3. 详细设计是否已经足以支持 1:1 实现。

   回答: 正式 `03-详细设计.md` 已由 Step 1~19 装配,并指向字段级对象契约、port、protocol、flow、状态矩阵、持久化、错误、幂等、配置和观测校准文件。它足以进入实施计划拆分讨论,但不等于所有 commit boundary 已可直接移交实现;`07` Step 6 必须按 boundary 做字段、DTO、状态、port、outbox、projection、job、evidence 和 phase boundary 复核。

4. 测试方案和验收标准是否足以定义阶段门禁。

   回答: `05-测试方案.md` 已提供 `TC-GOV-*`、`EV-GOV-*`、suite / gate、artifact root 和 report root;`06-验收标准.md` 已提供 AC / VETO / evidence / risk acceptance / final decision 口径。它们足以进入 Step 7 的门禁嵌入讨论。真实 `run_id`、implementation commit、config digest 和 evidence 执行结果属于实施 / 验收执行期基线,不得在设计阶段伪造。

5. 是否存在上游文档之间的冲突。

   回答: 当前未发现阻塞 Step 1 的显性冲突。已知风险是文档状态和 Git 状态不一致:部分正式文档标记 Draft 或未跟踪,因此正式实现移交前必须提交并固定 baseline。若后续 Step 5~6 拆 phase / commit 时发现 `03/05/06/07` 对同一对象、状态、证据或 boundary 的描述冲突,必须回写设计真相源后重复核。

6. 详细设计是否已经完成字段闭环、DTO 构造闭环、状态闭环和 phase boundary 复核。

   回答: `03_ddd_step_17_implementation_handoff.md` 已做详细设计到实施计划的预复核,`03_ddd_step_19_formal_document_assembly.md` 已把正式 `03` 装配完成。但 phase / commit boundary 尚未由 `07` 定义,因此正式 boundary 级复核尚未完成。该复核必须在 Step 6 完成,并由设计者承担。

7. 测试方案和验收标准是否使用详细设计正式字段、状态、接口和证据名称。

   回答: `05` 和 `06` 已按新版 `03` 重新组织,使用 Governance truth center、23 Command、14 Query、9 Consumer、12 Outbound Event、7 Job、状态矩阵、TC / EV 和 report path 口径。正式 `07` 仍需在 Step 7 把每个阶段和 commit boundary 的测试 / 验收门禁绑定到这些正式名称,避免旧 GovernanceRequest / Gate / Decision / RiskAcceptance 主线回流。

8. 哪些缺口会阻塞实施计划,哪些缺口可以记录为风险继续推进。

   回答: 当前没有阻塞继续进入 Step 2 的缺口。阻塞正式移交实现的缺口包括未固定 design baseline、目标实现仓 `/home/aris/Projects/quantalithos-governance` 当前未发现、以及尚未完成 `07` 的 commit boundary 设计闭环 / 经验复核。可作为风险继续推进的是 `04` 未跟踪、`05/06` 仍是 Draft 文档状态、真实送验基线和 evidence 尚未产生。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| `projects/L1-governance/07-实施计划.md` | 文件尚不存在 | 不能直接移交实现,也不能定义 commit boundary | 本轮按 SOP 从 Step 1 开始生成 |
| `design-calibration/07_*` | 尚无实施计划校准链 | 缺少实施计划讨论过程追溯 | 新建 flow 和 Step 1 中间产物 |
| Git 工作区 | `04` 和大量 calibration 文件未跟踪,`02/03/05/06` 有未提交改动 | 正式实现基线不能只指向 HEAD | 标记为移交实现前必须固定 baseline |
| 目标实现仓 | `/home/aris/Projects/quantalithos-governance` 当前检查未发现 | 实现开工前无目标 repo | 标记为 PH-01 / 前置条件门禁 |
| `05/06` 文档状态 | 当前文档元信息仍为 Draft | 正式验收基线需要审查确认 | 记录为风险;不阻塞继续拆实施计划 |
| Boundary 复核 | `07` 尚未定义 phase / commit boundary | 无法完成最终可落码审计 | Step 6 必须补齐 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实施计划入口 | 无 `07` 校准 flow,无 Step 1 中间产物 | 新增 `07_implementation_plan_calibration_flow.md` 和 Step 1 输入边界 | 保留逐 Step 讨论和停审记录 |
| 输入边界 | 只能从 `00`~`06` 分散读取 | 统一列出实施计划输入、用途、状态和风险 | 防止后续实施计划引用旧口径或漏读关键标准 |
| 缺口处理 | 目标 repo、脏工作区、baseline 未固定未进入实施计划视野 | 分类为移交实现前 blocker / 当前可推进风险 | 避免把设计阶段风险推给实现 agent |
| 正式文档生成 | 可能直接写完整 `07` | 明确 Step 13 再装配正式 `07` | 符合 SOP 和用户要求的分步写入 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 直接生成正式 `07-实施计划.md` | 快速得到完整文档 | 跳过 Step 中间产物,难以审查和回滚,容易漏掉 commit boundary 复核 | 不采用 |
| 先生成 flow 与 Step 1,逐 Step 停审 | 可追溯,便于逐步审查,符合 SOP | 需要更多轮次才能形成正式文档 | 采用 |
| 将未提交文档视为 blocker 停止 | 能保证 baseline 绝对干净 | 会阻断当前设计讨论,且用户当前目标是继续制定 `07` | 不采用;记录为实现移交前 blocker |
| 将未提交文档视为无风险 | 推进最快 | 可能导致实现 agent 无法复现设计基线 | 不采用;作为风险继续推进 |

## 7. 结构化中间产物

### 7.1 实施输入边界表

| 上游文档 | 版本 / 路径 | 本计划如何使用 | 状态 | 风险 |
|---|---|---|---|---|
| `00-需求文档.md` | `projects/L1-governance/00-需求文档.md` | 定义实施目标、需求范围、非范围和验收红线 | 可用 | 无当前 Step blocker |
| `01-架构设计.md` | `projects/L1-governance/01-架构设计.md` | 定义架构边界、依赖方向、truth ownership 和跨仓协作 | 可用 | 文档元信息仍为 Draft,后续需确认最终状态 |
| `02-概要设计.md` | `projects/L1-governance/02-概要设计.md` | 定义主要组成部分、对象轮廓、接口骨架和处理流 | 可用 | 工作区有未提交改动 |
| `03-详细设计.md` | `projects/L1-governance/03-详细设计.md` | 定义实现契约和 boundary 复核输入 | 可用 | 工作区有未提交改动;boundary 复核待 Step 6 |
| `04-配置设计.md` | `projects/L1-governance/04-配置设计.md` | 定义配置、环境、profile 和外部依赖准备 | 可用 | 当前未跟踪,移交实现前必须纳入 baseline |
| `05-测试方案.md` | `projects/L1-governance/05-测试方案.md` | 定义测试切口、suite、gate 和 evidence | 可用 | Draft 状态;真实运行证据尚未产生 |
| `06-验收标准.md` | `projects/L1-governance/06-验收标准.md` | 定义验收门禁、VETO、风险接受和最终裁决 | 可用 | Draft 状态;真实验收基线尚未固定 |

### 7.2 缺失输入风险表

| 缺失 / 风险 | 分类 | 阻塞范围 | 处理 |
|---|---|---|---|
| `07-实施计划.md` 尚不存在 | 当前任务目标 | 阻塞实现移交,不阻塞 Step 1~13 | 按 SOP 逐 Step 生成 |
| `/home/aris/Projects/quantalithos-governance` 当前未发现 | 实现前置 blocker | 阻塞实现开工 | Step 3 / PH-01 写入前置检查或创建任务 |
| 当前 Governance 文档未形成干净 git baseline | 实现移交 blocker | 阻塞交给实现 agent | 完成 `07` 后提交或固定 design baseline |
| phase / commit boundary 尚未定义 | 设计中间状态 | 阻塞 boundary 级可落码审计 | Step 5~6 完成阶段和提交边界 |
| 每个 commit boundary 经验复核尚未完成 | 设计移交 blocker | 阻塞实现移交 | Step 6 按可落码性标准 §九逐 boundary 复核 |
| 真实 implementation commit / run_id / config digest / evidence 尚未存在 | 执行期基线缺口 | 不阻塞设计,阻塞验收裁决 | Step 7 / Step 12 写为执行和验收门禁 |

### 7.3 闭环复核预判表

| 闭环复核项 | 来源 | 当前状态 | 阻塞范围 | 处理 |
|---|---|---|---|---|
| 字段闭环 | `03-详细设计.md`;`03_ddd_step_06_object_contracts.md`;Step 17 | 预复核通过 | 具体 commit boundary 待确认 | Step 6 逐 boundary 复核 |
| DTO / Event / Job 构造闭环 | `03_ddd_step_08_protocol_contracts.md`;Step 17 | 预复核通过 | 具体 commit boundary 待确认 | Step 6 逐 boundary 复核 |
| 状态闭环 | `03_ddd_step_10_state_matrix.md`;`05`;`06` | 预复核通过 | 具体阶段测试门禁待确认 | Step 6 / Step 7 复核 |
| Repository / version / UoW 闭环 | `03_ddd_step_07`;`03_ddd_step_11` | 预复核通过 | 具体写路径待确认 | Step 6 逐 boundary 复核 |
| Outbox / projection / job result 闭环 | `03_ddd_step_06`~`13`;`05`;`06` | 预复核通过 | 高风险 boundary 待确认 | Step 6 经验复核表重点覆盖 |
| 证据闭环 | `05-测试方案.md`;`06-验收标准.md` | 可进入讨论 | 实际 evidence 待执行 | Step 7 / Step 12 固定门禁 |
| Phase boundary | 尚未由 `07` 定义 | 未完成 | 阻塞实现移交 | Step 5 / Step 6 完成 |

### 7.4 是否允许进入实施计划讨论

| 判定项 | 结论 | 理由 |
|---|---|---|
| 是否允许进入 Step 2 | 允许 | 上游 `00`~`06` 可作为实施计划输入,缺口已分类 |
| 是否允许直接移交实现 | 不允许 | `07` 未完成,design baseline 未固定,目标实现仓未发现,boundary 复核未完成 |
| 是否允许正式创建完整 `07` | 暂不允许 | 必须等 Step 1~12 中间产物确认后,由 Step 13 装配 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_01_input_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“实施输入边界表”“缺失输入风险表”和“闭环复核预判表”小节,了解实施计划输入边界如何收敛。

正式 `07-实施计划.md` §1 应回填:

本实施计划承接 `L1-governance` 的新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 和 `06-验收标准.md`。实施计划不重新定义需求、架构、对象 schema、DTO、port、flow、状态矩阵、配置项、测试用例、验收 evidence 或最终验收结论。

`03-详细设计.md` 与其 `design-calibration/03_ddd_step_*.md` 是实现契约真相源;`05-测试方案.md` 是测试切口、suite、artifact 和 evidence 入口;`06-验收标准.md` 是验收门禁和 VETO 入口。若实施计划拆分 phase / commit boundary 时发现字段、DTO、状态、读取面、version 来源、payload source、affected view、job report、证据来源或 phase boundary 无法 1:1 闭合,必须暂停并回写设计真相源,不得要求实现 agent 自行补 schema、port、状态或边界。

正式实现移交前必须固定 design baseline,并完成按 phase / commit boundary 的可落码闭环审计和经验复核。当前目标实现仓 `/home/aris/Projects/quantalithos-governance` 在 Step 1 检查时未发现,应进入实施前置条件或 PH-01 创建任务。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Governance 文档何时统一提交并固定 design baseline | 影响实现 agent 是否能复现设计输入 | 记录为正式移交实现前 blocker |
| 目标实现仓由 PH-01 创建还是在实施前手动创建 | 影响 Step 3 前置条件和 Step 5 阶段设计 | 后续 Step 3 / Step 5 决定 |
| `05/06` Draft 状态是否需要改为更明确的设计阶段状态 | 影响正式交付语义 | 记录为风险,不阻塞 Step 2 |
| Step 6 的 commit boundary 粒度如何划分 | 影响可落码审计和经验复核 | 后续 Step 5 / Step 6 处理 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 上游输入基线明确 | 通过 | `00`~`06` 和关键标准已映射 |
| 缺失或冲突项已分类 | 通过 | 分为当前可推进风险、实现移交 blocker、执行期基线缺口 |
| 未直接生成正式 `07` | 通过 | 正式文档留到 Step 13 |
| 目标实现仓风险已记录 | 通过 | `/home/aris/Projects/quantalithos-governance` 当前未发现 |
| 可进入 Step 2 | 通过 | 下一步明确实施目标、范围和非范围;进入前等待用户审查 |
