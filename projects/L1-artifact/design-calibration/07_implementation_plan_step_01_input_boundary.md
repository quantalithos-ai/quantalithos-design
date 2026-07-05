# Step 1. 确认实施输入边界

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 1
> 回填章节: `07-实施计划.md` §1 与上游文档的关系声明
> 参考粒度: `projects/L1-governance/design-calibration/07_implementation_plan_step_01_input_boundary.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 1 确认实施输入边界 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | `00-需求文档.md`;`01-架构设计.md`;`02-概要设计.md`;`03-详细设计.md`;`04-配置设计.md`;`05-测试方案.md`;`06-验收标准.md`;实施计划 SOP / 书写规范;可落码性标准;代码实施台账与门禁规范 |
| 输出文件 | `projects/L1-artifact/design-calibration/07_implementation_plan_step_01_input_boundary.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 2 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `projects/L1-artifact/00-需求文档.md` | 已存在 | 固定五个核心能力、`FR-ART-*`、业务规则、非功能和 `VF-ART-*` |
| `projects/L1-artifact/01-架构设计.md` | 已存在 | 固定 Artifact truth ownership、正文排除、依赖方向、只读消费和跨仓 seam |
| `projects/L1-artifact/02-概要设计.md` | 已存在 | 固定主要组成部分、接口骨架、处理流、状态集合和配置影响 |
| `projects/L1-artifact/03-详细设计.md` | 已存在 | 固定 workspace / crate、对象、port、protocol、flow、状态矩阵、事务、错误、幂等、观测和实施承接 |
| `projects/L1-artifact/04-配置设计.md` | 已存在 | 固定 P0 profiles、config source priority、strict validation、redaction、degraded/no-write 和 replay root |
| `projects/L1-artifact/05-测试方案.md` | 已存在 | 固定 `TC-ART-*`、blocking suite、artifact/report root、`EV-CAND-ART-*` 和缺陷 / 回归口径 |
| `projects/L1-artifact/06-验收标准.md` | 已存在;用户已确认 Step 15 | 固定 `AC-ART-001~058`、`VETO-ART-001~009`、risk acceptance 和最终裁决口径 |
| `projects/L1-artifact/design-calibration/03_ddd_step_17_implementation_handoff.md` | 已存在 | 提供详细设计到实施计划的承接清单和实现前预复核输入 |
| `projects/L1-artifact/design-calibration/03_ddd_step_19_formal_document_assembly.md` | 已存在 | 证明正式 `03` 已由 Step 1~19 装配,并给 `07` 提供正式入口 |
| `projects/L1-artifact/design-calibration/04_config_step_15_formal_document_assembly.md` | 已存在 | 证明正式 `04` 已按配置设计 Step 1~15 装配 |
| `projects/L1-artifact/design-calibration/05_test_plan_step_15_formal_document_assembly.md` | 已存在 | 证明正式 `05` 已按测试方案 Step 1~15 装配 |
| `projects/L1-artifact/design-calibration/06_acceptance_step_15_formal_document_assembly.md` | 已存在 | 证明正式 `06` 已按验收标准 Step 1~15 装配 |
| `standards/document/实施计划讨论流程_SOP.md` | 已读取 | 固定 Step 1~13 的讨论顺序和中间产物要求 |
| `standards/document/实施计划书写规范.md` | 已读取 | 固定正式 `07` 章节结构、phase / commit boundary、门禁和永久记忆种子 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 标准输入 | 固定每个 phase / commit boundary 的可落码闭环审计和经验复核来源 |
| `standards/document/代码实施台账与门禁规范.md` | 标准输入 | 固定 implementation ledger、boundary ledger、Commit Gate、Handoff Gate 和 planned boundary 预创建规则 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前仓是否已经具备完整的 `00/01/02/03/05/06` 文档? | 已具备,且当前还具备正式 `04-配置设计.md`。`07-实施计划.md` 尚不存在,应由本轮 Step 1~13 生成。 |
| 哪些上游文档版本是本轮实施计划基线? | 使用当前工作区的新版 `00`~`06` 作为设计输入,当前 Git HEAD 为 `50c41bb`。由于本轮 `06` 与 Step 15 改动尚未提交,正式移交实现前必须固定新的 design baseline / commit。 |
| 详细设计是否足以支持 1:1 实现? | 正式 `03` 已由 Step 1~19 装配,并指向字段级对象契约、port、protocol、flow、状态矩阵、持久化、错误、幂等、配置和观测校准文件。它足以进入实施计划拆分讨论,但不等于每个 commit boundary 已可移交实现;Step 6 必须逐 boundary 复核。 |
| 测试方案和验收标准是否足以定义阶段门禁? | `05` 提供 `TC-ART-*`、`EV-CAND-ART-*`、suite、artifact/report root 和回归策略;`06` 提供 `AC-ART-001~058`、`VETO-ART-001~009`、risk acceptance 和最终裁决口径。它们足以进入 Step 7 门禁嵌入讨论。 |
| 是否存在上游文档之间的当前 Step blocker? | 未发现阻塞 Step 1 的显性冲突。已知风险是设计 baseline 尚未提交固定,目标实现仓未发现,以及 boundary 级可落码审计尚未完成。 |
| 字段、DTO、状态、port、flow 和 evidence 是否已经完成 boundary 级复核? | 详细设计 Step 17 做过预复核,但 `07` 尚未定义 phase / commit boundary,因此正式 boundary 级复核未完成。该复核必须在 Step 5~6 完成,由设计者负责。 |
| 测试方案和验收标准是否使用详细设计正式名称? | 当前 `05/06` 已按新版 `03` 重写,使用 16 Command、13 Query、6 Consumer、8 Outbound Event、6 public Job、`PublishPendingArtifactRelays` 独立 relay facade、P0 profiles、`EV-CAND-ART-*` 和 `VETO-ART-*`。正式 `07` 必须沿用这些名称,不得回流旧 CreateArtifact / EvidenceRef / FreezeBaseline 少量主线。 |
| 哪些缺口会阻塞实施计划,哪些缺口可以记录为风险继续推进? | 当前没有阻塞进入 Step 2 的缺口。阻塞正式移交实现的缺口包括: design baseline 未提交固定、目标实现仓 `/home/aris/Projects/quantalithos-artifact` 当前未发现、`07` 尚未完成 phase / commit boundary 设计闭环与经验复核、implementation boundary 台账尚未预创建。执行期缺口包括真实 `run_id`、implementation commit、config digest、test artifact 和 evidence 尚未产生。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| `projects/L1-artifact/07-实施计划.md` | 文件尚不存在 | 不能定义 phase / commit boundary,不能移交实现 agent | 本轮按 SOP 从 Step 1 开始生成 |
| `design-calibration/07_*` | 尚无实施计划校准链 | 缺少实施计划讨论过程追溯 | 新建 flow 和 Step 1 中间产物 |
| Git 工作区 | 本轮 `06` 与 Step 15 改动尚未提交 | 实现 agent 不能只靠 HEAD 复现最新设计 | 记录为正式移交实现前必须固定 baseline |
| 目标实现仓 | `/home/aris/Projects/quantalithos-artifact` 当前检查未发现 | 实现开工前无目标 repo | 记录为 Step 3 / PH-01 前置门禁 |
| Boundary 台账 | implementation ledger 与 boundary ledger 尚未创建 | 后续实现推进会反复因缺 boundary 回到设计侧 | Step 6 / Step 13 必须预创建全部 planned boundary 台账骨架 |
| 真实 evidence | 无真实 `run_id`、test artifact、report 和 final signoff | 不阻塞设计,阻塞验收裁决 | Step 7 / Step 12 写为执行期门禁,不得伪造 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实施计划入口 | 无 `07` 校准 flow,无 Step 1 中间产物 | 新增 `07_implementation_plan_calibration_flow.md` 和 Step 1 输入边界 | 保留逐 Step 讨论和停审记录 |
| 输入边界 | `00`~`06` 分散存在 | 统一列出实施计划输入、用途、状态和风险 | 防止后续计划漏读配置、测试、验收或标准 |
| 缺口处理 | 目标仓、baseline、boundary 台账未进入当前恢复点 | 分类为移交实现前 blocker / 当前可推进风险 / 执行期基线缺口 | 避免把设计侧责任推给实现 agent |
| 正式文档生成 | 可能直接写完整 `07` | 明确 Step 13 再装配正式 `07` | 符合实施计划 SOP |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 直接生成正式 `07-实施计划.md` | 快速得到完整文档 | 跳过 Step 中间产物,难以审查,容易漏掉 boundary 复核和台账预创建 | 不采用 |
| 先生成 flow 与 Step 1,逐 Step 停审 | 可追溯,便于审查和回滚,符合 SOP | 需要更多轮次才能形成正式文档 | 采用 |
| 将未提交 design baseline 视为当前 blocker | 能保证 baseline 绝对干净 | 会阻断当前设计讨论,且本轮目标是继续制定 `07` | 不采用;记录为移交实现前 blocker |
| 将目标实现仓不存在视为当前 blocker | 可以提前处理实现仓缺口 | 会把实施前置动作提前到输入边界 Step | 不采用;Step 3 / PH-01 决定创建或确认路径 |
| 让实现 agent 后续补 boundary 台账 | 当前设计侧省事 | 与台账规范冲突,会导致实现推进时反复回设计侧 | 不采用;`07` 必须预创建 planned boundary |

## 7. 结构化中间产物

### 7.1 实施输入边界表

| 上游文档 | 路径 | 本计划如何使用 | 状态 | 风险 |
|---|---|---|---|---|
| `00-需求文档.md` | `projects/L1-artifact/00-需求文档.md` | 定义实施目标、五个核心能力、需求范围和验收红线 | 可用 | 无当前 Step blocker |
| `01-架构设计.md` | `projects/L1-artifact/01-架构设计.md` | 定义 truth ownership、外部正文排除、依赖方向和跨仓 seam | 可用 | 后续 boundary 必须守住非 core sibling 依赖红线 |
| `02-概要设计.md` | `projects/L1-artifact/02-概要设计.md` | 定义主要组成部分、接口骨架、处理流和状态集合 | 可用 | 后续不得用对象清单替代可验证功能增量 |
| `03-详细设计.md` | `projects/L1-artifact/03-详细设计.md` | 定义实现契约和 boundary 复核输入 | 可用 | Step 6 必须逐 boundary 复核字段、port、flow、状态、事务和 idempotency |
| `04-配置设计.md` | `projects/L1-artifact/04-配置设计.md` | 定义 P0 profiles、config validation、redaction 和 runtime binding | 可用 | Step 8 必须转成实现前置检查和 config gate |
| `05-测试方案.md` | `projects/L1-artifact/05-测试方案.md` | 定义 suite、gate、artifact/report root、`EV-CAND-ART-*` 和回归策略 | 可用 | 真实 execution evidence 尚未产生 |
| `06-验收标准.md` | `projects/L1-artifact/06-验收标准.md` | 定义 `AC-ART-*`、`VETO-ART-*`、risk acceptance 和 final decision | 可用;用户已确认 Step 15 | 不得伪造真实 `run_id`、`EV-ART-*` evidence alias 或 signoff |

### 7.2 缺失输入风险表

| 缺失 / 风险 | 分类 | 阻塞范围 | 处理 |
|---|---|---|---|
| `07-实施计划.md` 尚不存在 | 当前任务目标 | 阻塞实现移交,不阻塞 Step 1~13 | 按 SOP 逐 Step 生成 |
| `/home/aris/Projects/quantalithos-artifact` 当前未发现 | 实现前置 blocker | 阻塞实现开工 | Step 3 / PH-01 写入前置检查或创建任务 |
| 当前设计 baseline 尚未提交固定 | 实现移交 blocker | 阻塞交给实现 agent | 完成 `07` 后提交或固定 design baseline |
| implementation ledger / boundary ledger 尚未创建 | 实现移交 blocker | 阻塞 implementation gate | Step 6 / Step 13 定义并预创建 |
| phase / commit boundary 尚未定义 | 设计中间状态 | 阻塞 boundary 级可落码审计 | Step 5~6 完成阶段和提交边界 |
| commit boundary 经验复核尚未完成 | 设计移交 blocker | 阻塞实现移交 | Step 6 按可落码性标准 §九逐 boundary 复核 |
| 真实 implementation commit / run_id / config digest / evidence 尚未存在 | 执行期基线缺口 | 不阻塞设计,阻塞验收裁决 | Step 7 / Step 12 写为执行和验收门禁 |

### 7.3 闭环复核预判表

| 闭环复核项 | 来源 | 当前状态 | 阻塞范围 | 处理 |
|---|---|---|---|---|
| 字段闭环 | `03-详细设计.md`;`03_ddd_step_06_object_contracts.md`;Step 17 | 预复核通过 | 具体 commit boundary 待确认 | Step 6 逐 boundary 复核 |
| DTO / Event / Job 构造闭环 | `03_ddd_step_08_protocol_contracts.md`;Step 17 | 预复核通过 | 具体 commit boundary 待确认 | Step 6 逐 boundary 复核 |
| 状态闭环 | `03_ddd_step_10_state_matrix.md`;`05`;`06` | 预复核通过 | 具体阶段测试门禁待确认 | Step 6 / Step 7 复核 |
| Repository / version / UoW 闭环 | `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_11_persistence_transaction_consistency.md` | 预复核通过 | 具体写路径待确认 | Step 6 逐 boundary 复核 |
| Outbox / relay / projection / job report 闭环 | `03_ddd_step_06`~`03_ddd_step_15`;`05`;`06` | 可进入讨论 | 高风险 boundary 待确认 | Step 6 经验复核表重点覆盖 |
| Evidence 闭环 | `05-测试方案.md`;`06-验收标准.md` | 可进入讨论 | 实际 evidence 待执行 | Step 7 / Step 12 固定门禁 |
| Implementation ledger 闭环 | `代码实施台账与门禁规范.md` | 未完成 | 阻塞实现移交 | Step 6 / Step 13 定义项目级台账和 boundary 台账 |
| Phase boundary | 尚未由 `07` 定义 | 未完成 | 阻塞实现移交 | Step 5 / Step 6 完成 |

### 7.4 是否允许进入实施计划讨论

| 判定项 | 结论 | 理由 |
|---|---|---|
| 是否允许进入 Step 2 | 允许 | 上游 `00`~`06` 可作为实施计划输入,缺口已分类 |
| 是否允许直接移交实现 | 不允许 | `07` 未完成,design baseline 未固定,目标实现仓未发现,boundary 复核和 boundary 台账未完成 |
| 是否允许正式创建完整 `07` | 暂不允许 | 必须等 Step 1~12 中间产物确认后,由 Step 13 装配 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_01_input_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“实施输入边界表”“缺失输入风险表”和“闭环复核预判表”小节,了解实施计划输入边界如何收敛。

正式 `07-实施计划.md` §1 应回填:

本实施计划承接 `L1-artifact` 的新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 和 `06-验收标准.md`。实施计划回答如何按可验证顺序落地代码,不重新定义需求、架构、对象 schema、DTO、port、flow、状态矩阵、配置项、测试用例、验收 evidence 或最终验收结论。

`03-详细设计.md` 与其 `design-calibration/03_ddd_step_*.md` 是实现契约真相源;`05-测试方案.md` 是测试切口、suite、artifact 和 evidence 入口;`06-验收标准.md` 是验收门禁、VETO 和风险接受入口。若实施计划拆分 phase / commit boundary 时发现字段、DTO、状态、读取面、version 来源、payload source、affected view、job report、证据来源或 phase boundary 无法 1:1 闭合,必须暂停并回写设计真相源,不得要求实现 agent 自行补 schema、port、状态或边界。

正式实现移交前必须固定 design baseline,完成按 phase / commit boundary 的可落码闭环审计和经验复核,并预创建项目级 implementation ledger 与全部 planned boundary ledger。当前目标实现仓 `/home/aris/Projects/quantalithos-artifact` 在 Step 1 检查时未发现,应进入实施前置条件或 PH-01 创建任务。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| L1-artifact 文档何时统一提交并固定 design baseline | 影响实现 agent 是否能复现设计输入 | 记录为正式移交实现前 blocker |
| 目标实现仓由 PH-01 创建还是在实施前手动创建 | 影响 Step 3 前置条件和 Step 5 阶段设计 | 后续 Step 3 / Step 5 决定 |
| `07` 的 phase / commit boundary 粒度如何划分 | 影响可落码审计、经验复核和 implementation boundary 台账 | 后续 Step 5 / Step 6 处理 |
| implementation boundary 台账目录和命名 | 影响实现 agent 开工门禁 | 后续 Step 6 / Step 13 固定 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 上游输入基线明确 | 通过 | `00`~`06` 和关键标准已映射 |
| 缺失或冲突项已分类 | 通过 | 分为当前可推进风险、实现移交 blocker、执行期基线缺口 |
| 未直接生成正式 `07` | 通过 | 正式文档留到 Step 13 |
| 目标实现仓风险已记录 | 通过 | `/home/aris/Projects/quantalithos-artifact` 当前未发现 |
| implementation ledger 责任已纳入后续 Step | 通过 | Step 6 / Step 13 必须定义并预创建 |
| 可进入 Step 2 | 通过 | 下一步明确实施目标、范围和非范围;进入前等待用户审查 |
