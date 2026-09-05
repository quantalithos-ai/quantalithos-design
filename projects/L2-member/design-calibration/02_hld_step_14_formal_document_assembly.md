# Step 14. 正式概要设计文档装配

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 14
> 对应书写规范: `standards/document/概要设计书写规范.md` §3、§4.1~§4.14
> 正式输出: `projects/L2-member/02-概要设计.md`
> 生成日期: 2026-08-25
> 状态: completed / pass / stop_review
> 装配权限: Step 14 only；允许删除旧正式02并从空文件重建

## 1. 开工确认与装配边界

| 检查项 | 结论 |
|---|---|
| 项目级门禁 | `project_execution_ledger.md` 已切至 `02 / Step 14 / formal_document_assembly`，且用户已授权完整 `02` 流程。 |
| 文档级门禁 | `02_hld_calibration_flow.md` 的 Step 1~13 均为 `completed / pass / stop_review`；Step 14 是唯一允许写正式02的阶段。 |
| Step 级门禁 | Step 1~13 文件均已形成回填草稿和停审结论；Step 14 只重组这些结论。 |
| full-restart | 旧 `02-概要设计.md` 是 historical material；本 Step 必须删除后从空文件建立新版14章主链。 |
| 写入范围 | 仅修改 `projects/L2-member/02-概要设计.md` 与本 Step 中间产物 / 台账；不改兄弟项目、不实现代码、不提交 commit。 |
| 禁止 | 不新增对象、接口、流程、状态、协议、配置、产品选型、任务、测试结果、evidence、integration 或 readiness 结论。 |

## 2. 章节装配映射

| 正式章节 | 主校准来源 | 装配结论 |
|---:|---|---|
| 1 与上游文档的关系声明 | `02_hld_step_01_upstream_boundary.md` | 只写已收稳输入、本文不再回答 / 必须回答和概要层展开方向。 |
| 2 本次设计目标与范围 | `02_hld_step_02_goals_scope.md` | 使用目标表和非范围表，保持 product-neutral、blocked-aware 范围。 |
| 3 约束条件 | `02_hld_step_03_constraints.md` | 汇总直接决定主体、数据、依赖、状态和安全结构的硬约束。 |
| 4 代码主体框架总览 | `02_hld_step_04_code_subject_framework.md` | 保留架构到代码主体图、实现分层图、双轴关系和关键判断。 |
| 5 主要组成部分、职责与边界 | `02_hld_step_05_components_boundary.md` | 保留CP01~CP07总表、对象发现维度、交互总图和逐部分职责 / 非职责 / 候选。 |
| 6 关键对象轮廓 | `02_hld_step_06_key_objects.md` 及七个对象附录 | 从候选池筛选后逐一收录34个对象的概要骨架；不写完整schema。 |
| 7 API / 接口骨架 | `02_hld_step_07_api_interface_skeleton.md` 及七个接口附录 | 按Command / Query / Consumer / Event / Job分类收录；保持逻辑carrier与exact carrier的区分。 |
| 8 关键处理流 / 重要函数数据流 | `02_hld_step_08_processing_flows.md` 及七个流程附录 | 收录通用流与每个关键写、Consumer、Job、复杂Query的处理轮廓；不补实现调用链。 |
| 9 状态定义与状态流转 | `02_hld_step_09_state_machine.md` 及七个状态附录 | 收录对象化状态族、迁移 / 禁止迁移和传播关系；无全局lifecycle。 |
| 10 异常与边界场景轮廓 | `02_hld_step_10_exceptions_boundaries.md` | 收录改变主线理解的异常和保守口径。 |
| 11 配置影响轮廓 | `02_hld_step_11_configuration_impact.md` | 收录影响面、禁止配置化边界和03 / 04分工。 |
| 12 详细设计承接清单 | `02_hld_step_12_detailed_design_handoff.md` | 收录稳定输入、03展开方向与回退规则；开放项不伪装成稳定输入。 |
| 13 设计风险与待确认事项 | `02_hld_step_13_risks_open_questions.md` | 用两张表分离风险与待确认，保留`L2M-UP-001~008`。 |
| 14 参考 | `02_hld_step_01_upstream_boundary.md`、本文件 | 只列实际用于本次装配与复核的正式材料 / 标准及具体用途。 |

## 3. 术语、编号与交叉引用统一

| 统一项 | 装配口径 |
|---|---|
| 业务主体 | 固定为 CP01 Presence and Host Collaboration、CP02 Inbound Boundary、CP03 Runtime Mediation、CP04 Outbound Boundary、CP05 Interaction Trace、CP06 External Context Mirror、CP07 Member Read Model。 |
| 执行主体 | 正向路径固定为 `ProjectMemberRef + GlobalMemberRef`；前者是执行主语，后者是身份锚，不互相替代。 |
| truth 语义 | member 仅拥有 local interaction / support / derived-read truth；Runtime、host、Bus、Governance、Tools、Conversation、Artifact、Observability等owner保持外置。 |
| 成功语义 | `accepted`、`ready`、`passed`、`eligible`、`submitted`、`resolved`、`current`、`available`均绑定对象，不互相代答。 |
| 依赖类型 | compile / runtime / event / ref / adapter / fake / persistence分列；仅Core shared primitive是compile candidate。 |
| carrier 口径 | semantic Event、logical envelope和Port可在概要层存在；exact schema、route、adapter activation不因其名称出现而视为闭口。 |
| 历史材料 | 旧 README 与旧正式02仅作为污染审计输入；不向正文继承旧协议、进程、语言、指标或部署结论。 |

## 4. 正式正文写入前检查

| 检查项 | 结论 |
|---|---|
| 14章主链 | 将严格使用书写规范的 §1~§14 标题；不沿用旧15章结构。 |
| 追溯入口 | 每章开头均写具体 `design-calibration/02_hld_step_*.md`，并给出应继续阅读的小节。 |
| 主体完整性 | 正式正文必须包含七个组成部分、34个对象、`10 / 16 / 14 / 24 / 5`接口分类、流程、状态、异常、配置、承接与风险。 |
| 层次边界 | 第5章只做候选与边界；第6章逐对象骨架；第7章接口分类；第8章流程；第9章状态；不相互暗改主语。 |
| 待确认处理 | `L2M-UP-001~008` 只在第13章作为待确认项；正文其他章节只写对应的blocked-aware边界。 |
| 非伪造 | 不写实现已完成、commit、真实run、测试结果、artifact、report、evidence、verdict、signoff、集成通过或readiness。 |

## 5. 静态审计记录

| 审计项 | 方法与结果 | 结论 |
|---|---|---|
| 正式结构与追溯入口 | 检索一级章节得到 14 个，编号连续为 §1~§14；`校准来源` 与 `延伸阅读` 均为 14 处。 | pass：正式结构、章节来源和继续阅读入口完整。 |
| 组成部分与对象 | CP01~CP07 均在主体、对象、接口、流和状态章节出现；§6 排除候选池与反查清单后得到 34 个对象卡片。 | pass：无第八业务主要组成部分或未归属对象。 |
| 接口分类 | 按 §7 表格计数为 10 Command、16 Query、14 Consumer、24 semantic Event、5 Job。Event 总数由 CP01 `3`、CP02 `3`、CP03 `4`、CP04 `4`、CP05 `4`、CP06 `2`、CP07 `4` 复核。 | pass：分类、主语与总数一致。 |
| 流、状态与单向性 | §8 覆盖 CP01~CP07 和通用 local-commit / continuation；§9 记录对象化状态、禁止迁移、CP06→CP07 的单向消费与 Query no-write。 | pass：没有全局 lifecycle、source 反写或把 local attempt 说成外部成功。 |
| pending / blocker | `L2M-UP-001~008` 均在 §13 的待确认表中逐项出现，并在前文仅以 blocked-aware 语义引用。 | pass：没有把 host、image、Runtime、Core、credential、policy 或 subject 合同写成已闭口。 |
| 依赖裁剪 | §7.7 明列 compile / runtime / event / ref / adapter / fake / persistence；全文将 Core shared primitive 限为唯一 compile candidate。 | pass：未把 runtime、event、ref 或 adapter 伪装为 package dependency。 |
| 历史污染 | 对 CloudEvents、W3C、AG-UI、UDS、launch token、语言、进程与 SLA 的命中均位于非范围、风险或参考中的“不得继承 / 仅经当前 authority / 历史污染审计”语境。 | pass：未形成未授权 protocol、transport、language、deployment 或性能承诺。 |
| 非伪造 | 检索未发现 `run_id`；文档只描述设计骨架、pending 或 future 承接，未报告代码、真实 run、测试结果、artifact、report、evidence、verdict、signoff、集成通过或 readiness。 | pass：静态装配不构成实现或集成声明。 |
| 文本与工作区 | `git diff --check -- projects/L2-member/02-概要设计.md` 无输出；仅检查并保留项目目录内已有未提交改动，不执行提交、清理或改动兄弟项目。 | pass：无 whitespace error；未提交。 |

## 6. 当前装配计划

| 批次 | 内容 | 状态 |
|---:|---|---|
| 1 | 删除旧正式02，重建元信息与第1~5章 | completed |
| 2 | 回填第6章34个关键对象骨架 | completed |
| 3 | 回填第7~9章接口、流程与状态 | completed |
| 4 | 回填第10~14章、参考和交叉引用 | completed |
| 5 | 执行静态审计、回填审计记录、更新三层台账并停审 | completed / pass |

## 7. Step 14 停审结论与后续门禁

本 Step 只完成“已确认中间产物 → 正式 02 正文”的静态装配。`02-概要设计.md` 已按 14 章重建，所有正文结论均可回指本文件第 2 节所列的 Step 1~13 校准材料；本 Step 没有新增对象、接口、流程、状态、协议、配置、技术选型、任务或任何实现事实。

Step 14 结论为 `completed / pass / stop_review`。正式 `02-概要设计.md` 现处于审核点：不得创建、读取并推进 `03-详细设计.md` 的 Step 材料，不得实现代码、修改兄弟目录或提交 commit。只有用户再次明确确认 `02 -> 03` 后，才可按详细设计 SOP 从 Step 1 开始。

## 8. 非伪造声明

本 Step 的“通过”只表示设计中间产物与正式正文的静态装配一致；它不表示代码、adapter、configuration、test、integration、artifact、report、evidence、verdict、signoff或readiness已经存在。
