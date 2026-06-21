# L3-method-library 00 需求 Step 1: 与上游文档的关系声明

> 创建日期: 2026-06-15
> 状态: in_progress
> 当前模式: full-restart
> 本轮口径: 全量重新讨论,旧 L3-method-library 文档只作差异审计。
> 回填位置: `00-需求文档.md` 第 1 章“与上游文档的关系声明”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 1 与上游文档的关系声明 |
| 输出文件 | `design-calibration/00_req_step_01_upstream_relation.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md`;`需求文档书写规范.md` §4.1 |
| 已读取项目输入 | yes:`/tmp/l3_method_library_00_requirements_discussion_steps.md`;`/tmp/quantalithos_subproject_discussion_plan.md`;`projects/README.md`;`architecture/仓库拆分方案.md`;`architecture/标准对齐全景图.md` |
| 当前模式 | full-restart |
| 进入条件 | pass |
| next_allowed_action | Step 1 已完成,允许文档级 flow 进入 Step 2。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入模块 1 思考。 |
| 整体模块搭建 | done | 本 Step 模块骨架 | pass | 进入模块 1 思考。 |
| 模块 1 权威输入分层:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入模块 1 写入。 |
| 模块 1 权威输入分层:再写入 | done | 来源分层表 | pass | 进入模块 2 思考。 |
| 模块 2 文档链路收束:先思考 | done | 本文承接层级判断 | pass | 进入模块 2 写入。 |
| 模块 2 文档链路收束:再写入 | done | 文档链路说明 | pass | 进入模块 3 思考。 |
| 模块 3 旧材料差异审计:先思考 | done | 旧材料读取清单和审计问题 | pass | 进入模块 3 写入。 |
| 模块 3 旧材料差异审计:再写入 | done | 冲突 / 可保留事实 / 废弃项 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 1 章草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 待确认事项 | pass | 允许进入 Step 2。 |

---

## 2. 必读文档

### 2.1 已读取文档摘要

| 文档 | 读取结论 | 对 Step 1 的影响 |
|---|---|---|
| `/tmp/l3_method_library_00_requirements_discussion_steps.md` | 本轮按全量重启讨论,旧 L3 文档只能用于后置差异审计;每个 Step 先列必读文档,再搭整体模块,再逐模块先思考后写入。 | Step 1 不继承旧 `00_req_step_01` 的完成状态,必须重新建立来源分层结论。 |
| `standards/document/设计文档讨论中间产物规范.md` | 设计讨论必须落三层台账:项目级 `project_execution_ledger.md`、文档级 flow、Step / 模块级文件;`/tmp` 计划不能成为唯一进度记录。 | 本 Step 已创建项目级台账,并重建 00 flow 和 Step 1 文件。 |
| `standards/document/需求文档讨论流程_SOP.md` | 需求文档必须先讨论后成文;Step 1 只处理与上游文档的关系声明;恢复时必须先读项目级台账、文档级 flow 和当前 Step 文件。 | Step 1 只回答来源和承接关系,不得提前写本仓边界、核心能力、功能、数据或接口。 |
| `/tmp/quantalithos_subproject_discussion_plan.md` | 当前未完成项目主线的下一项目是 `L3-method-library`;虽然有历史 calibration,本轮仍按未完成项目从 `00` 重新讨论。 | Step 1 的来源声明必须体现“本轮重新进入”,不能把历史材料当作完成依据。 |
| `projects/README.md` | `L3-method-library` 是 27 个正式子项目之一,属于 L3 方法能力层;仓类型偏运行时能力型,需求写法强调能力如何被上下游使用。 | Step 1 可把它列为权威输入,用于确认项目存在性、层级和文档体系约束。 |
| `architecture/仓库拆分方案.md` | 27 仓拆分中 L3 方法能力层包含 `capability-hub` 和 `method-library`;依赖方向严格向下;`method-library` 位于方法能力层。 | Step 1 可把它列为权威输入,但具体职责边界留到 Step 2。 |
| `architecture/标准对齐全景图.md` | `quantalithos-method-library` 主要对齐 SPEM Method Content、24748-2 生命周期模型、42001 AI Policy、ADR-0009 ViewProfile;次要参考 29110、CMMI、ADR-0005、ADR-0008。 | Step 1 可承接这些上游主题,但不在本 Step 裁定 MethodContent 子类清单或 P0 范围。 |
| `standards/document/需求文档书写规范.md` §4.1 | 正式第 1 章必须是一张来源映射表和一段 2~3 句收束说明;承接内容只写主题或范围,不写功能、接口或实现机制。 | Step 1 的回填草稿必须保持短,不得滑入 Step 2 之后的边界和能力内容。 |
| `standards/document/设计真相源闭环与可落码性标准.md` §2.1 | 同一个概念只能有一个正式定义来源;继续任务必须从项目级台账、flow 和当前 Step 文件恢复。 | Step 1 需要把上游来源分层清楚,防止后续把旧材料、ADR 草案或当前需求正文变成第二真相源。 |
| `standards/子项目遵循规范清单.md` §4.2 | method-library 强制项包括 SPEM Method Content 组织、ProcessTemplate 版本化发布、24748-2 家族、Role image_variant、AIPolicy、29110 分发格式。 | 这些是主题细化输入,不能在 Step 1 直接写成目标、功能或业务规则。 |
| `architecture/开发路线图与优先级.md` N3 | method-library 是 N3 方法能力层 exit criteria 之一;process 的 BPMN 引擎需要 method-library 内容,依赖要提早对齐。 | 可作为项目讨论顺序和上游重要性输入;具体目标范围留到 Step 4/7。 |

### 2.2 待补读文档

| 文档 | 必要原因 | 预计落点 |
|---|---|---|
| none | 当前 Step 1 必读输入已满足。 | not_applicable |

---

## 3. 整体模块骨架

Step 1 只拆三个模块:

| 模块 | 要回答的问题 | 输出 | 不输出 |
|---|---|---|---|
| 模块 1:权威输入分层 | 哪些文档能定义本仓需求语义?哪些只是主题细化?哪些只能后置差异审计? | 权威输入 / 流程约束 / 主题细化输入 / 差异审计输入分层表。 | 不判断本仓具体边界、不列 P0、不列功能。 |
| 模块 2:文档链路收束 | 新版 `00-需求文档.md` 如何承接上游并驱动后续 `01~07`? | 文档链路说明和正式第 1 章来源映射草案。 | 不列接口、事件、实施顺序。 |
| 模块 3:旧材料差异审计 | 旧 README、旧 00 和历史 calibration 中哪些内容不能在 Step 1 继承? | 冲突项、可保留事实、废弃项、后续 Step 落点。 | 不重写旧文档正文,不把旧对象模型转成需求。 |

---

## 4. 模块思考记录

### 4.1 模块 1:权威输入分层

问题回答:

- 能定义本仓需求语义的权威输入是项目清单、仓库拆分方案、标准对齐全景图、需求 SOP 和需求书写规范。
- 项目讨论顺序文件和 `/tmp` 计划只定义本轮进入顺序和执行纪律,不能定义 method-library 的业务语义。
- 子项目遵循规范清单、开发路线图、产品 / domain / ADR 文档只作为主题细化输入,不能在 Step 1 直接变成 P0、功能或规则。
- 旧 `L3-method-library` 正式文档和历史 calibration 只能作为后置差异审计输入。

诊断:

- 历史 `00_req_step_01_upstream_relation.md` 已经有一份完整来源表,但它属于旧轮次完成状态,不能作为本轮直接继承结果。
- 旧 README 和旧详细设计容易把技术栈、对象、接口、种子数据和 MethodContent 子类提前带入 Step 1。
- 若 Step 1 把 ML1~ML6 或 ADR-0005/0008/0009 直接写成当前需求结论,后续 Step 4、Step 7、Step 10 会失去独立裁剪空间。

取舍:

- 采用四层来源:权威输入、流程约束、主题细化输入、差异审计输入。
- 正式第 1 章只放权威输入和必要流程来源;主题细化输入留在中间产物,后续 Step 按需读取。
- 不采用旧 Step 1 中直接保留的完整结论,而是重新用当前规范验证后生成新的来源表。

### 4.2 模块 2:文档链路收束

问题回答:

- 新版 `00-需求文档.md` 承接的是 L3 方法能力层中 method-library 的仓级需求语义。
- 它不是重新定义 SPEM、24748-2、42001、29110 或 ViewProfile,也不是替代全局仓库拆分方案。
- 它只说明这些上游主题在本仓需求层如何被裁剪、细化和后续验收。

诊断:

- 如果第 1 章写成本仓职责说明,会抢占 Step 2。
- 如果第 1 章写成 MethodContent 类型清单或 ProcessTemplate 家族,会抢占 Step 4/7/11。
- 如果第 1 章写入接口、事件、发布流程或实施顺序,会越过需求层。

取舍:

- 正式第 1 章使用“来源映射表 + 一段收束说明”。
- 只列稳定上游来源:项目清单、仓库拆分方案、标准对齐全景图、需求 SOP、需求书写规范。
- 将开发路线图和子项目遵循规范清单保留为中间产物中的主题细化输入,不进入正式第 1 章主表。

### 4.3 模块 3:旧材料差异审计

问题回答:

- 本 Step 只审计旧材料是否能作为来源声明输入,不审计其功能、规则、数据或接口是否正确。
- 旧 `README.md` 和旧 `00-需求文档.md` 可以保留“method-library 是方法资产 / Method Content 存储与分发”的方向线索。
- 旧历史详细设计、旧对象模型和旧 calibration 不进入 Step 1 来源表。

诊断:

- 旧材料中的实现目录、技术栈、种子数据、CRUD、事件、DTO 和状态词都不是 Step 1 允许内容。
- 旧文档若把 ADR 草案当作已决上游,会在当前轮次形成第二真相源。

取舍:

- 旧材料只在差异审计表中记录可保留事实和禁止继承项。
- 后续 Step 到达时再读取对应旧材料,不得在 Step 1 预先裁定。

---

## 5. 旧材料差异审计

### 5.1 已审计旧材料

| 旧材料 | 审计结论 |
|---|---|
| `projects/L3-method-library/README.md` | 可保留“Method Content 存储与分发”的主题线索;不得继承技术栈、目录结构、种子数据、接口或实现状态。 |
| `projects/L3-method-library/00-需求文档.md` | 可保留“方法资产型需求仓”的方向线索;不得继承旧 00 的完成状态、旧章节组织或后续目标 / 功能 / 规则内容。 |
| `projects/L3-method-library/design-calibration/00_req_step_01_upstream_relation.md` | 已被本文件替换;旧内容只作为差异线索,不作为本轮完成状态。 |
| `projects/L3-method-library/design-calibration/02_hld_*` / `03_ddd_*` | 不进入 Step 1;后续 Step 只用于反向污染检查。 |

### 5.2 不能继承的旧口径

| 旧口径 | 为什么不能在 Step 1 继承 | 后续处理 |
|---|---|---|
| Rust / PostgreSQL / service / package / seed 等实现口径 | Step 1 只声明上游来源,不写技术和实现。 | 架构、配置或实施阶段按需裁定。 |
| MethodContent 子类完整清单 | Step 1 不裁定本仓范围、P0 或对象模型。 | Step 4、Step 7、Step 11 后续重审。 |
| ProcessTemplate 8 种、9 种 Role 定义等 exit criteria | Step 1 不写目标或验收指标。 | Step 4 / Step 14 重新讨论。 |
| ADR-0010 / ADR-0011 作为当前已决输入 | 状态和适用范围需逐 Step 复核。 | Step 15 可列为待确认或后续输入。 |

---

## 6. 结构化中间产物

### 6.1 来源分层表

| 层级 | 来源文档 | 上游章节 / 模块 | 本 Step 承接内容 |
|---|---|---|---|
| 权威输入 | `projects/README.md` | 27 个子项目清单 / 仓类型分类 | 确认 `L3-method-library` 是正式子项目之一,属于 L3 方法能力层。 |
| 权威输入 | `architecture/仓库拆分方案.md` | `二、七层总览`;`六、L3 · 方法能力层` | 确认 L3 方法能力层存在,并确认 method-library 属于该层。 |
| 权威输入 | `architecture/标准对齐全景图.md` | `L3 · 方法能力层 / quantalithos-method-library` | 确认本仓承接 SPEM Method Content、24748-2 生命周期模型、42001 AI Policy、ViewProfile 等方法资产主题。 |
| 权威输入 | `standards/document/需求文档讨论流程_SOP.md` | `Step 1. 与上游文档的关系声明` | 确认 Step 1 只处理来源、承接主题和收束说明。 |
| 权威输入 | `standards/document/需求文档书写规范.md` | `4.1 与上游文档的关系声明` | 确认正式第 1 章形态和禁止内容。 |
| 流程约束 | `/tmp/quantalithos_subproject_discussion_plan.md` | `2.2 当前下一项目`;`4.2 当前主线顺序` | 确认本轮重新进入 `L3-method-library` 的讨论顺序。 |
| 流程约束 | `/tmp/l3_method_library_00_requirements_discussion_steps.md` | 全量重启口径 / 执行总规则 | 确认本轮从 Step 1 重做,旧材料只能后置审计。 |
| 主题细化输入 | `standards/子项目遵循规范清单.md` | `4.2 quantalithos-method-library` | 后续 Step 可读取 ML1~ML6,但 Step 1 不直接展开目标、规则或验收。 |
| 主题细化输入 | `architecture/开发路线图与优先级.md` | `节点 N3 · 方法能力层` | 后续 Step 可用来判断优先级和依赖压力,但 Step 1 不写 exit criteria。 |
| 主题细化输入 | `product/六域模型.md`;`domain/method-library/README.md`;ADR-0005/0008/0009/0010/0011 | 相关方法资产主题 | 后续 Step 按需读取和裁剪;Step 1 不直接继承对象、字段、接口或状态。 |
| 差异审计输入 | 旧 `projects/L3-method-library/00-需求文档.md`;旧 `design-calibration/00_req_step_*`;旧 `02/03` calibration | historical_material | 每个 Step 独立结论形成后做冲突和可保留事实审计。 |

### 6.2 正式第 1 章来源映射表

| 来源文档 | 上游章节 / 模块 | 承接内容 |
|---|---|---|
| `projects/README.md` | 27 个子项目清单 / 仓类型分类 | `L3-method-library` 是正式子项目,需求写法按运行时能力型 / 方法能力层项目处理。 |
| `architecture/仓库拆分方案.md` | `二、七层总览`;`六、L3 · 方法能力层` | 本文承接 L3 方法能力层中 `method-library` 的仓级主题。 |
| `architecture/标准对齐全景图.md` | `L3 · 方法能力层 / quantalithos-method-library` | 本文承接 SPEM Method Content、24748-2 生命周期模型、42001 AI Policy、ViewProfile 等方法资产对齐主题。 |
| `standards/document/需求文档讨论流程_SOP.md` | `Step 1. 与上游文档的关系声明` | 本文按需求 SOP 从来源声明开始逐 Step 重新讨论。 |
| `standards/document/需求文档书写规范.md` | `4.1 与上游文档的关系声明` | 本章只做来源映射与语义收束,不展开边界、能力、功能、数据或接口。 |

---

## 7. 回填草稿

### 1. 与上游文档的关系声明

> 校准来源:
> - `design-calibration/00_req_step_01_upstream_relation.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/00_req_step_01_upstream_relation.md` 的“结构化中间产物”“旧材料差异审计”和“自检与停审”小节,了解本章来源关系如何收敛。

| 来源文档 | 上游章节 / 模块 | 承接内容 |
|---|---|---|
| `projects/README.md` | 27 个子项目清单 / 仓类型分类 | `L3-method-library` 是正式子项目,需求写法按运行时能力型 / 方法能力层项目处理。 |
| `architecture/仓库拆分方案.md` | `二、七层总览`;`六、L3 · 方法能力层` | 本文承接 L3 方法能力层中 `method-library` 的仓级主题。 |
| `architecture/标准对齐全景图.md` | `L3 · 方法能力层 / quantalithos-method-library` | 本文承接 SPEM Method Content、24748-2 生命周期模型、42001 AI Policy、ViewProfile 等方法资产对齐主题。 |
| `standards/document/需求文档讨论流程_SOP.md` | `Step 1. 与上游文档的关系声明` | 本文按需求 SOP 从来源声明开始逐 Step 重新讨论。 |
| `standards/document/需求文档书写规范.md` | `4.1 与上游文档的关系声明` | 本章只做来源映射与语义收束,不展开边界、能力、功能、数据或接口。 |

本文是在 Quantalithos 正式子项目和七层架构中,对 L3 方法能力层 `method-library` 的仓级需求细化。本文不重新定义 SPEM、24748-2、42001 或 ViewProfile 等上游方法资产主题,只说明这些主题在本仓需求层如何被承接、裁剪和验收。

---

## 8. 自检与停审

### 8.1 自检表

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写上游关系 | 通过 | 未展开本仓边界、依赖、核心能力、功能、规则、数据和接口。 |
| 是否区分权威输入与旧材料 | 通过 | 旧 `00`、旧 Step 文件和历史 calibration 均降级为差异审计输入。 |
| 是否遵循 4.1 表达形式 | 通过 | 回填草稿是一张来源映射表 + 一段收束说明。 |
| 是否避免实现细节 | 通过 | 未写技术栈、存储、目录、handler、repository、port、DTO 或状态机。 |
| 是否可进入 Step 2 | 通过 | 读者能知道本文从哪些上游细化而来,且不会误以为本文重新定义方法资产标准。 |

### 8.2 待确认事项

| 编号 | 事项 | 当前状态 | 后续落点 |
|---|---|---|---|
| REQ-S1-OPEN-001 | `product/六域模型.md`、`domain/method-library/README.md` 和 ADR 中哪些内容仍适合作为本轮需求细化输入。 | 本 Step 不裁定;只列为主题细化输入。 | Step 2~7 按需读取和裁剪。 |
| REQ-S1-OPEN-002 | ML1~ML6、N3 exit criteria 是否全部进入当前 P0。 | 本 Step 不裁定。 | Step 4 / Step 7 / Step 14 再裁定。 |

### 8.3 进入下一步条件

已满足进入 Step 2 的条件:

- 上游来源分层已收敛。
- 旧材料已降级为后置差异审计输入。
- Step 1 未提前写本仓边界和能力内容。
