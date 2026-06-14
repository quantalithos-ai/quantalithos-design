# Step 14. 整理正式概要设计文档

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 14
> 回填章节: `projects/L1-identity/02-概要设计.md` 全文
> 生成日期: 2026-06-11
> 状态: Step 14 已完成,等待用户审核

---

## 1. Step 状态 + Step 内计划

本 Step 只做正式文档装配,不新增概要设计结论。正式 `02-概要设计.md` 必须从 Step 1~13 已审核中间产物重组而来,并按 `standards/document/概要设计书写规范.md` 的 14 章主链输出。

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取 Step 14 SOP 和概要书写规范 | 已完成 | §2 |
| 复核 Step 1~13 已审核中间产物 | 已完成 | §2 |
| 回答 Step 14 SOP 问题 | 已完成 | §3 |
| 诊断当前正式 `02` 占位状态和旧 Step 14 问题 | 已完成 | §4 |
| 比较装配前后口径 | 已完成 | §5 |
| 确认装配取舍 | 已完成 | §6 |
| 形成章节映射、术语统一、风险保留和参考材料表 | 已完成 | §7 |
| 重建正式 `02-概要设计.md` | 已完成 | `../02-概要设计.md` |
| 更新 `02_hld_calibration_flow.md` 状态 | 已完成 | `02_hld_calibration_flow.md` |
| 完成自检和进入下一阶段条件说明 | 已完成 | §8~§11 |

---

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `02_hld_step_01_upstream_boundary.md` | 第 1 章上游关系声明 |
| `02_hld_step_02_goals_scope.md` | 第 2 章目标与范围 |
| `02_hld_step_03_constraints.md` | 第 3 章约束条件 |
| `02_hld_step_04_code_subject_framework.md` | 第 4 章代码主体框架 |
| `02_hld_step_05_components_boundary.md` | 第 5 章主要组成部分、职责与边界 |
| `02_hld_step_06_key_objects.md` | 第 6 章关键对象轮廓 |
| `02_hld_step_07_api_interface_skeleton.md` | 第 7 章 API / 接口骨架 |
| `02_hld_step_08_processing_flows.md` | 第 8 章关键处理流 |
| `02_hld_step_09_state_machine.md` | 第 9 章状态定义与流转 |
| `02_hld_step_10_exceptions_boundaries.md` | 第 10 章异常与边界场景 |
| `02_hld_step_11_configuration_impact.md` | 第 11 章配置影响轮廓 |
| `02_hld_step_12_detailed_design_handoff.md` | 第 12 章详细设计承接清单 |
| `02_hld_step_13_risks_open_questions.md` | 第 13 章风险与待确认事项 |
| `projects/L1-identity/00-需求文档.md` | 需求基线和需求编号来源 |
| `projects/L1-identity/01-架构设计.md` | 架构边界和运行约束来源 |
| `standards/document/概要设计讨论流程_SOP.md` | Step 14 生成流程 |
| `standards/document/概要设计书写规范.md` | 正式 14 章结构和校准来源规则 |
| `standards/document/设计文档讨论中间产物规范.md` | 中间产物结构、追溯和重建纪律 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 后续详细设计 / 实现不得脑补的闭环门禁 |

---

## 3. SOP 问题回答

### 3.1 哪些已确认结论应分别回填到哪些正式章节?

Step 1~13 与正式章节不是机械复制,但每个正式章节必须有唯一主来源。第 1~13 章分别承接对应 Step 的结构化中间产物和回填草稿。第 14 章承接 Step 1~13 实际使用材料、上游正式文档和标准文档。

### 3.2 哪些结论需要拆分吸收到多个章节,而不是机械复制?

Step 3 的约束会在第 3 章集中呈现,同时作为第 5~11 章的门禁口径保留。Step 5 的主要组成部分同时影响第 5 章组成部分、第 6 章对象来源、第 7 章接口归属、第 8 章处理流批次和第 9 章状态归属。Step 13 的风险不只出现在第 13 章,还通过第 12 章回退规则提醒后续 `03/04/05/06/07` 不能自行补口。

### 3.3 哪些术语、编号或交叉引用需要统一?

正式 `02` 统一使用 Step 5~9 已收稳术语:

- `主要组成部分`:8 个业务结构主语。
- `GlobalMember`:平台级 AI 员工身份 truth 主语。
- `ProjectMember`:项目内承担事实,不属于 identity truth。
- `RoleCapabilitySummary`:identity-side role / capability safe summary。
- `MemoryReference`:成员与外部 memory / archive refs 的身份侧关系。
- `MemberSummaryView`:可重建、可裁剪、可 stale 的 read model。
- `IdentityOutboxRecord` / `TraceHandoffIntent`:accepted fact propagation 与 trace / archive handoff 主语。

旧 `RoleCatalogEntry`、`CapabilityProfile`、旧 API 名、旧性能数字和旧配置项不作为新版正式结论进入正文。

### 3.4 哪些内容仍应继续保留为设计风险或待确认,不能润色成定论?

以下内容必须留在第 13 章,不得在装配阶段闭口:

- sibling repo / shared contract reality check。
- role / capability source protocol 和 safe summary 字段。
- high-risk lifecycle basis schema。
- work participation source marker。
- memory / archive carrier、handoff target 和 receipt marker。
- visibility / privacy 字段级矩阵。
- projection lookup、reference refresh scope、cursor、version、id generator。
- outbox payload snapshot、event envelope、fake / controlled adapter 语义。
- 现有 `04-配置设计.md` 的处理方式和 P0 性能 / 验收阈值。

### 3.5 哪些细节仍应留给详细设计,不应在整理阶段补进来?

本 Step 不补完整字段 schema、Rust 签名、repository / port trait、DTO、DDL、事务顺序、错误码、retry 参数、topic、event payload、handoff receipt、配置 JSON、测试矩阵、验收 evidence 或实施 commit boundary。

### 3.6 当前概要设计实际依赖了哪些参考材料,每份材料用途是什么?

实际依赖材料包括新版 `00/01`、Step 1~13 中间产物、概要 SOP、概要书写规范、中间产物规范和设计真相源闭环标准。参考章节只列这些实际使用材料,不列旧 `03/04/05/06/07` 作为新版 `02` 上游。

---

## 4. 当前材料 / 旧文档问题诊断

| 材料 / 旧状态 | 问题 | 本 Step 处理 |
|---|---|---|
| 当前 `02-概要设计.md` 仍是重写占位 | 只说明停在 Step 1,不再反映 Step 1~13 已完成 | 整体替换为 14 章正式概要设计草稿 |
| 旧 Step 14 文件过短 | 只有组装规则和映射,缺少 SOP 问题回答、诊断、取舍、装配自检 | 按最新版中间产物规范重建 |
| 旧 `02` 大量旧口径 | 旧 API、旧对象、旧性能数字和旧上线策略会反向污染新版 `02` | 不局部修补,只从 Step 1~13 回填 |
| Step 6~9 内容很重 | 若全量搬入正式文档,正式 `02` 会退化成详细设计 | 正式文档保留索引、摘要和延伸阅读入口 |
| 旧 `04-配置设计.md` 已存在 | 早于新版 `02/03`,不能反向约束概要 | 只在第 13 章作为风险保留 |

---

## 5. 改动前后对比

| 项 | 装配前 | 装配后 |
|---|---|---|
| 正式 `02` 状态 | 装配前占位稿,不能作为正式概要设计使用 | 14 章正式概要设计草稿,等待审核 |
| 章节结构 | 只有当前状态、可信入口、重写纪律、下一步 | 按书写规范输出第 1~14 章 |
| 校准来源 | 未逐章列出 | 每章开头列具体 `design-calibration` 文件和延伸阅读 |
| 内容来源 | 旧占位声明 | Step 1~13 已审核中间产物 |
| 风险处理 | 未装配 Step 13 | 第 13 章保留风险和待确认事项 |
| 详细设计承接 | 未装配 Step 12 | 第 12 章列出 `03` 继续展开和回退规则 |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 保留占位,等 `03` 前再装配 | 不采用 | Step 14 的目标就是完成正式 `02` 装配 |
| 把 Step 1~13 全量复制到正式 `02` | 不采用 | 会使正式文档过长,并把中间产物细节误当正式主链 |
| 只装配章节摘要并保留校准来源入口 | 采用 | 符合书写规范,也方便后续读者追溯中间产物 |
| 在 Step 14 补齐未闭口协议 / schema | 不采用 | 会新增未经讨论结论,违反 Step 14 约束 |
| 将旧 `04` 配置结论前移到第 11 章 | 不采用 | Step 11 已明确旧 `04` 不反向约束新版 `02` |

---

## 7. 结构化中间产物

### 7.1 正式章节映射表

| 正式章节 | 主要校准来源 | 装配方式 |
|---|---|---|
| 1. 与上游文档的关系声明 | Step 1 | 回填上游关系映射、本文不再回答、本文必须回答 |
| 2. 本次设计目标与范围 | Step 2 | 回填目标、范围、非范围和深度口径 |
| 3. 约束条件 | Step 3 | 回填约束表、后续章节门禁和高风险串线点 |
| 4. 代码主体框架总览 | Step 4 | 回填两张 ASCII 图和分层判断 |
| 5. 主要组成部分、职责与边界 | Step 5 | 回填 8 个组成部分总表、交互图、对象发现维度 |
| 6. 关键对象轮廓 | Step 6 | 回填对象索引、合并 / 后移 / 排除口径和对象审计 |
| 7. API / 接口骨架 | Step 7 | 回填接口分类规则、接口总表和跨接口审计 |
| 8. 关键处理流 / 重要函数数据流 | Step 8 | 回填处理流分类、覆盖审计和关键流摘要 |
| 9. 状态定义与状态流转 | Step 9 | 回填状态主语总表、传播图和禁止迁移口径 |
| 10. 异常与边界场景轮廓 | Step 10 | 回填异常分组、异常表、影响图和后移细节 |
| 11. 配置影响轮廓 | Step 11 | 回填配置影响表、禁止配置化边界、配置影响图 |
| 12. 详细设计承接清单 | Step 12 | 回填承接清单、继续展开方向和回退规则 |
| 13. 设计风险与待确认事项 | Step 13 | 回填风险、待确认事项和阻塞条件 |
| 14. 参考 | Step 1~13、`00/01`、标准 | 只列实际使用材料 |

### 7.2 术语统一表

| 术语 | 正式口径 |
|---|---|
| `GlobalMember` | 平台级 AI 员工身份 truth 主语 |
| `IdentityAnchorState` | 成员身份 ref 的锚定与不可复用持有状态 |
| `GlobalLifecycleState` | 成员平台级生命周期状态 |
| `RoleCapabilitySummary` | identity-side role / capability safe summary,不含 definition body |
| `CareerRecord` | 身份侧 append-only 生涯记录 |
| `MemoryReference` | 成员与外部 memory / archive refs 的身份侧关系 |
| `MemberSummaryView` | 可重建、可裁剪、可 stale 的成员摘要 read model |
| `IdentityTraceRecord` | accepted identity fact 或安全 marker 的追溯记录 |
| `ProjectionState` | 派生 view freshness / rebuild marker |
| `ReferenceResolutionState` | 外部 ref resolved / stale / unavailable / unrecognized marker |
| `ReconciliationReport` | report-only finding,不自动修复 |
| `IdentityOutboxRecord` | accepted identity fact 的待发布 outbox material |
| `TraceHandoffIntent` | trace / audit / archive handoff intent |
| `OutboxState` | publish marker,`Published` 不代表下游业务已处理 |
| `HandoffState` | handoff marker,`Delivered` 必须来自正式 receipt marker |

### 7.3 风险保留规则

| 规则 | 处理 |
|---|---|
| 风险不得润色成已闭口结论 | 第 13 章逐项保留影响范围和后续闭口位置 |
| 详细设计若需要新增主语 | 必须回退到对应概要 Step |
| 旧 `04` 不反向约束新版 `02` | 第 11 章只写配置影响轮廓,第 13 章保留旧 `04` 风险 |
| 实现 agent 不能自行补 schema / port / state / mapping | 第 12 / 13 章明确回退与阻塞条件 |
| fake / controlled adapter 不得伪成功 | 第 10 / 11 / 13 章保留为硬边界 |

### 7.4 参考材料表

| 参考材料 | 用途 |
|---|---|
| `projects/L1-identity/00-需求文档.md` | 需求基线、需求编号和业务红线来源 |
| `projects/L1-identity/01-架构设计.md` | 架构边界、依赖方向和运行机制来源 |
| `projects/L1-identity/design-calibration/02_hld_step_01_upstream_boundary.md` ~ `02_hld_step_13_risks_open_questions.md` | 正式第 1~13 章的校准来源 |
| `standards/document/概要设计讨论流程_SOP.md` | Step 14 执行依据 |
| `standards/document/概要设计书写规范.md` | 正式 14 章结构和校准来源要求 |
| `standards/document/设计文档讨论中间产物规范.md` | 中间产物、追溯和重建纪律 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 后续 `03/04/05/06/07` 与实现阶段的闭环门禁 |

### 7.5 装配自检表

| 自检项 | 结论 | 说明 |
|---|---|---|
| 是否每章有具体校准来源 | 通过 | 第 1~14 章均有来源和延伸阅读 |
| 是否新增 Step 1~13 未确认结论 | 未发现 | 正文只做压缩、重排和术语统一 |
| 是否把风险写成定论 | 未发现 | 第 13 章保留风险 / 待确认 |
| 是否把详细设计内容提前写入 | 未发现 | DTO、port、DDL、配置 JSON、测试矩阵均后移 |
| 是否清理旧占位语言 | 通过 | 正式 `02` 不再保留旧占位状态说明 |
| 是否保持中文书写 | 通过 | 正式正文和中间产物均使用中文 |

---

## 8. 复杂度判断 / 是否拆分

本 Step 需要改写正式 `02` 全文,因此采用两个产物分离:

- `02_hld_step_14_formal_document_assembly.md`:记录装配过程、映射和自检。
- `../02-概要设计.md`:正式 14 章正文。

正式正文不复制 Step 6~9 的完整批次内容,而是保留概要层摘要和校准来源入口。这样既保持正式文档可读,也保留 governance 式粒度的中间产物追溯。

---

## 9. 回填草稿

正式 `02-概要设计.md` 已按以下结构重建:

1. 与上游文档的关系声明。
2. 本次设计目标与范围。
3. 约束条件。
4. 代码主体框架总览。
5. 主要组成部分、职责与边界。
6. 关键对象轮廓。
7. API / 接口骨架。
8. 关键处理流 / 重要函数数据流。
9. 状态定义与状态流转。
10. 异常与边界场景轮廓。
11. 配置影响轮廓。
12. 详细设计承接清单。
13. 设计风险与待确认事项。
14. 参考。

---

## 10. 待确认事项

| 待确认项 | 影响 | 当前处理 |
|---|---|---|
| 用户是否认可正式 `02` 已可作为新版概要设计草稿 | 若不认可,需指出具体章节回退到对应 Step 修正 | 当前状态为等待审核 |
| 是否允许进入新版 `03-详细设计.md` | 若允许,应先按详细设计 SOP 建立新的 `03` 校准工作台 | 本 Step 不进入 `03` |
| 旧 `04-配置设计.md` 后续如何处理 | 影响配置线重写顺序 | 第 13 章继续挂起,等待新版 `03` 后裁定 |

---

## 11. 进入下一阶段条件

进入下一阶段前必须满足:

- 用户审核通过正式 `02-概要设计.md` 的 14 章结构和内容粒度。
- 用户认可第 13 章风险与待确认事项没有被写成已闭口结论。
- 若后续进入 `03`,必须按详细设计 SOP 重新建立 `03` 校准工作台,并从本 `02` 的第 12 / 13 章承接。

当前 Step 14 已完成,等待用户审核。
