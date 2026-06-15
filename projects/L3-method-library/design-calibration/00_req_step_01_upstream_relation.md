# L3-method-library 00 需求 Step 1: 与上游文档的关系声明

> 状态: completed
> 创建日期: 2026-06-14
> 本轮口径: 全量重新讨论,旧 L3-method-library 文档只作差异审计。
> 回填位置: `00-需求文档.md` 第 1 章“与上游文档的关系声明”

---

## 0. Step 内计划

| 模块 | 状态 | 产物 | 完成门禁 |
|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | 已读取本 Step 必读输入。 |
| 整体模块搭建 | done | 本 Step 模块骨架 | 已先建骨架。 |
| 权威输入分层思考 | done | 问题回答 / 诊断 / 取舍 | 未直接继承旧结论。 |
| 权威输入分层写入 | done | 来源分层表 | 来源可追溯。 |
| 文档链路思考 | done | 本文承接层级判断 | 未提前写边界和能力。 |
| 文档链路写入 | done | 文档链路说明 | 只写 Step 1 范围。 |
| 旧材料差异审计 | done | 冲突 / 可保留事实 / 废弃项 | 旧材料未直接继承。 |
| 自检与停审 | done | 自检表 / 待确认事项 | 达到本 Step 门禁。 |

---

## 1. 必读文档

### 1.1 公共规范

| 文档 | 读取结论 |
|---|---|
| `standards/document/需求文档讨论流程_SOP.md` | Step 1 只校准语义来源,输出上游文档来源结论、承接主题结论和收束说明结论。 |
| `standards/document/需求文档书写规范.md` | 正式第 1 章必须是一张来源映射表 + 一段 2~3 句收束说明,不得滑入仓边界、依赖、能力、功能、规则、数据或接口。 |
| `standards/document/设计文档讨论中间产物规范.md` | 每个 Step 必须独立生成中间产物,正式章节必须能追溯到具体 `design-calibration` 文件。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 同一概念只能有一个正式定义来源;需求阶段要避免为后续设计制造多真相源。 |

### 1.2 本 Step 专用输入

| 文档 | 读取结论 |
|---|---|
| `/tmp/l3_method_library_00_requirements_discussion_steps.md` | 本轮按全量重启讨论,旧 L3 文档只能用于后置差异审计。 |
| `/tmp/quantalithos_subproject_discussion_plan.md` | 当前主线下一项目是 `L3-method-library`,入口为 `00-需求文档`。 |
| `projects/README.md` | `L3-method-library` 属于 L3 方法能力层,是运行时能力型仓;需求写法强调能力如何被上下游使用。 |
| `architecture/仓库拆分方案.md` | `quantalithos-method-library` 是方法库,即 SPEM Method Content 的服务端载体。 |
| `architecture/标准对齐全景图.md` | method-library 主要承载 SPEM Method Content、24748-2 生命周期模型、42001 AI Policy 和 ViewProfile 外置等方法资产主题。 |
| `architecture/开发路线图与优先级.md` | N3 方法能力层产出“怎么做”和“用什么”两套资产;process 依赖 method-library 的内容,需提早对齐。 |
| `standards/子项目遵循规范清单.md` | ML1~ML6 给出 method-library 必须遵循的项目级约束,但具体目标和规则应在后续 Step 展开。 |

---

## 2. 整体模块骨架

Step 1 只拆三个模块:

| 模块 | 输出 | 不输出 |
|---|---|---|
| 权威输入分层 | 哪些上游文档能定义本仓需求语义,哪些只是辅助输入。 | 不判断本仓具体边界。 |
| 文档链路收束 | 新版 `00-需求文档.md` 如何承接上游并驱动 `01~07`。 | 不列功能、接口或实施顺序。 |
| 旧材料差异审计 | 旧 README/旧 00 中哪些内容不能在 Step 1 继承。 | 不重写旧文档正文。 |

---

## 3. 模块思考记录

### 3.1 权威输入分层

问题回答:

- 本文承接的最高层语义来自全局项目清单、仓库拆分方案和标准对齐全景图。
- `product/六域模型.md`、`domain/method-library/README.md` 和 ADR 可以作为主题细化输入,但本轮 Step 1 不直接展开它们的对象、字段、接口或事件。
- 历史 `L3-method-library` 正式文档与历史 calibration 不能作为权威输入;它们只能在每个 Step 独立结论形成后做差异审计。

诊断:

- 旧 `00-需求文档.md` 的第 1 章把“来源、目标、功能、非功能”混在一张表里,已经超过 Step 1 允许范围。
- 旧 README 在头部写入技术栈、目录结构和种子数据,这些不是 Step 1 来源声明内容。

取舍:

- 采用三层输入:权威输入、主题细化输入、差异审计输入。
- 不采用旧 `00` 的“章节 / 本文来源 / 对应文档”结构,因为它把后续章节内容提前塞进 Step 1。

### 3.2 文档链路收束

问题回答:

- 新版 `00-需求文档.md` 只负责说明 method-library 为什么存在、要做什么、不做什么、做到什么程度算完成。
- `01-架构设计.md` 之后的文档必须从新版 `00` 的需求结论往下推导,不能继续从旧 README 或旧详细设计反推需求。
- Step 1 的正式正文只应告诉读者“本文从哪些上游细化而来”,不提前解释本仓边界和核心能力。

诊断:

- 旧文档头部写“前置文档: domain/method-library README + product/六域模型 + ADR-0008/0009/0010/0011”,但没有区分权威输入、细化输入和已过时/Proposed 输入。
- ADR-0010 / ADR-0011 在部分材料中是 Proposed 或后续议题,Step 1 不应把它们作为当前需求已决细节。

取舍:

- Step 1 正式来源表只放当前能稳定定义主题范围的文档。
- ADR 和 domain README 放入“主题细化输入 / 后续 Step 按需读取”,避免把后续详细设计内容提前锁死。

---

## 4. 旧材料差异审计

### 4.1 已审计旧材料

| 旧材料 | 审计结论 |
|---|---|
| `projects/L3-method-library/README.md` | 可保留“Method Content 存储与分发”和主要标准对齐的主题线索;不能继承技术栈、目录结构、种子数据、RPC/infra 暗示。 |
| `projects/L3-method-library/00-需求文档.md` §1 | 可保留“方法资产型需求仓”方向;不能继承 13 节旧结构、旧前置文档列表和混入目标/功能/非功能的来源表。 |
| `projects/L3-method-library/00-需求文档.md` §2~3 | 只作为后续 Step 3/4 差异审计输入;本 Step 不继承背景、目标、P0、P1 细节。 |
| `standards/子项目遵循规范清单.md` ML1~ML6 | 是当前标准约束输入;具体规则进入后续 Step 10/11/14,Step 1 只记录其存在。 |

### 4.2 不能继承的旧口径

| 旧口径 | 为什么不能在 Step 1 继承 | 后续处理 |
|---|---|---|
| `技术栈: Rust + PostgreSQL + 对象存储` | Step 1 不写实现和部署选择。 | 架构 / 配置 / 实施阶段再裁定。 |
| `CRUD + seed + E2E` | Step 1 不写功能和测试口径。 | Step 9 / Step 14 重新讨论。 |
| `MethodContent 7 类 + Plugin + Configuration` | Step 1 不裁定 P0/P1 内容范围。 | Step 4 / Step 7 重新讨论。 |
| `ADR-0010 / ADR-0011 直接列为前置` | 状态和适用范围需要逐 Step 复核,不能在 Step 1 锁死。 | Step 10/15 视需要列为待确认或后续输入。 |

---

## 5. 结构化中间产物

### 5.1 来源分层表

| 层级 | 来源文档 | 上游章节 / 模块 | 本 Step 承接内容 |
|---|---|---|---|
| 权威输入 | `projects/README.md` | 27 个子项目清单 / 仓类型分类 | 确认 `L3-method-library` 是正式 27 仓之一,属于运行时能力型 / 方法能力层项目。 |
| 权威输入 | `architecture/仓库拆分方案.md` | `六、L3 · 方法能力层 / 6.2 quantalithos-method-library` | 确认本仓主题是方法库,即 SPEM Method Content 的服务端载体。 |
| 权威输入 | `architecture/标准对齐全景图.md` | `quantalithos-method-library` 单仓对齐块 | 确认本仓承接 SPEM Method Content、24748-2 生命周期模型、42001 AI Policy、ViewProfile 外置等方法资产主题。 |
| 权威输入 | `standards/document/需求文档讨论流程_SOP.md` | `Step 1. 与上游文档的关系声明` | 确认本 Step 只输出来源、承接主题和收束说明。 |
| 权威输入 | `standards/document/需求文档书写规范.md` | `4.1 与上游文档的关系声明` | 确认正式第 1 章写法为来源映射表 + 短收束说明。 |
| 流程约束 | `/tmp/quantalithos_subproject_discussion_plan.md` | 当前下一项目 | 确认本轮主线从 `L3-method-library` 的 `00-需求文档` 重新进入。 |
| 主题细化输入 | `product/六域模型.md` | 方法库横切相关主题 | 后续 Step 可读取以细化方法资产在产品域中的位置;Step 1 不直接展开。 |
| 主题细化输入 | `domain/method-library/README.md` | 方法库域 README | 后续 Step 可用于差异审计和主题细化;不能直接继承对象/接口/事件。 |
| 主题细化输入 | `architecture/adr/0005-member-image-per-role.md` | Role -> image_variant 决策 | 后续 Step 6/10/11 可用于角色镜像映射边界。 |
| 主题细化输入 | `architecture/adr/0008-activity-completion-policy.md` | Activity completion policy 决策 | 后续 Step 10/12/15 可用于 ProcessTemplate 与 process 执行边界。 |
| 主题细化输入 | `architecture/adr/0009-viewprofile-in-method-library.md` | ViewProfile 归 method-library | 后续 Step 7/10/12 可用于 ViewProfile 消费边界。 |
| 差异审计输入 | 旧 `projects/L3-method-library/00-需求文档.md` | 全文 | 每个 Step 独立结论形成后做冲突和可保留事实审计。 |
| 差异审计输入 | 旧 `projects/L3-method-library/design-calibration/02_hld_*` / `03_ddd_*` | 全部历史 calibration | 仅在后续 Step 对应阶段做反向污染检查。 |

### 5.2 本文承接主题结论

新版 `00-需求文档.md` 承接的主题是:在 Quantalithos 27 仓架构中,为 L3 方法能力层的 `method-library` 重新定义仓级需求,说明平台为什么需要一个统一的方法资产定义源,以及它如何从产品 / 架构 / 标准对齐主题中细化出需求范围。

本 Step 不裁定:

- MethodContent 的具体类型清单。
- P0/P1 目标。
- 下游消费者清单。
- 事件名、接口名、DTO、对象、字段或状态。
- 技术栈、存储、目录和实施计划。

### 5.3 正式第 1 章回填用来源映射表

| 来源文档 | 上游章节 / 模块 | 承接内容 |
|---|---|---|
| `projects/README.md` | 27 个子项目清单 / 仓类型分类 | `L3-method-library` 是正式子项目,需求写法按运行时能力型 / 方法能力层项目处理。 |
| `architecture/仓库拆分方案.md` | `六、L3 · 方法能力层 / 6.2 quantalithos-method-library` | 本文承接“方法库 / SPEM Method Content 服务端载体”的仓级主题。 |
| `architecture/标准对齐全景图.md` | `quantalithos-method-library` 单仓对齐块 | 本文承接 SPEM Method Content、24748-2 生命周期模型、42001 AI Policy、ViewProfile 外置等方法资产对齐主题。 |
| `standards/document/需求文档讨论流程_SOP.md` | `Step 1. 与上游文档的关系声明` | 本文按需求 SOP 从来源声明开始逐 Step 重新讨论。 |
| `standards/document/需求文档书写规范.md` | `4.1 与上游文档的关系声明` | 本章只做来源映射与语义收束,不展开边界、能力、功能、数据或接口。 |

---

## 6. 回填草稿

### 1. 与上游文档的关系声明

> 校准来源:
> - `design-calibration/00_req_step_01_upstream_relation.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/00_req_step_01_upstream_relation.md` 的“结构化中间产物”“旧材料差异审计”和“回填草稿”小节,了解本章来源关系如何收敛。

| 来源文档 | 上游章节 / 模块 | 承接内容 |
|---|---|---|
| `projects/README.md` | 27 个子项目清单 / 仓类型分类 | `L3-method-library` 是正式子项目,需求写法按运行时能力型 / 方法能力层项目处理。 |
| `architecture/仓库拆分方案.md` | `六、L3 · 方法能力层 / 6.2 quantalithos-method-library` | 本文承接“方法库 / SPEM Method Content 服务端载体”的仓级主题。 |
| `architecture/标准对齐全景图.md` | `quantalithos-method-library` 单仓对齐块 | 本文承接 SPEM Method Content、24748-2 生命周期模型、42001 AI Policy、ViewProfile 外置等方法资产对齐主题。 |
| `standards/document/需求文档讨论流程_SOP.md` | `Step 1. 与上游文档的关系声明` | 本文按需求 SOP 从来源声明开始逐 Step 重新讨论。 |
| `standards/document/需求文档书写规范.md` | `4.1 与上游文档的关系声明` | 本章只做来源映射与语义收束,不展开边界、能力、功能、数据或接口。 |

本文是在 Quantalithos 正式子项目与架构分层中,对 L3 方法能力层 `method-library` 的仓级需求细化。本文不重新定义 SPEM、24748-2、42001 或 ViewProfile 等上游方法论主题,只说明这些主题在本仓需求层如何被承接、裁剪和验收。

---

## 7. 自检与停审

### 7.1 自检表

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写上游关系 | 通过 | 未展开本仓边界、依赖、核心能力、功能、规则、数据和接口。 |
| 是否区分权威输入与旧材料 | 通过 | 旧 `00`、README 和历史 calibration 均降级为差异审计输入。 |
| 是否遵循 4.1 表达形式 | 通过 | 回填草稿是一张来源映射表 + 一段收束说明。 |
| 是否避免实现细节 | 通过 | 未写技术栈、存储、目录、handler、repository、port 或 DTO。 |
| 是否可进入 Step 2 | 通过 | 读者能知道本文从哪些上游细化而来,且不会误以为本文重新发明方法资产主题。 |

### 7.2 待确认事项

| 编号 | 事项 | 当前状态 | 后续落点 |
|---|---|---|---|
| REQ-S1-OPEN-001 | `product/六域模型.md` 与 `domain/method-library/README.md` 中哪些内容仍适合作为本轮需求细化输入。 | 本 Step 不裁定;只列为主题细化输入。 | Step 2~7 按需读取和裁剪。 |
| REQ-S1-OPEN-002 | ADR-0010 / ADR-0011 是否进入当前 P0 需求范围。 | 本 Step 不继承旧口径。 | Step 4 / Step 7 / Step 15 再裁定。 |

### 7.3 进入下一步条件

已满足进入 Step 2 的条件:

- 上游来源分层已收敛。
- 旧材料已降级为后置差异审计输入。
- Step 1 未提前写本仓边界和能力内容。
