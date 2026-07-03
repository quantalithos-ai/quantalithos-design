# L1-artifact 00 需求 Step 2: 本仓定位与边界

> 创建日期: 2026-06-29
> 状态: done
> 当前模式: full-restart
> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 2
> 回填位置: `00-需求文档.md` 第 2 章“本仓定位与边界”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 2 本仓定位与边界 |
| 输出文件 | `design-calibration/00_req_step_02_position_boundary.md` |
| 前置 Step | Step 1 `与上游文档的关系声明` 已完成并通过自检 |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md` Step 2;`需求文档书写规范.md` 4.2 |
| 已读取恢复文件 | yes:`project_execution_ledger.md`;`00_requirements_calibration_flow.md`;`00_req_step_01_upstream_relation.md` |
| 已读取边界线索 | yes:`全局项目依赖关系与裁剪规则.md`;`architecture/仓库拆分方案.md`;`product/六域模型.md`;`architecture/标准对齐全景图.md`;`architecture/bus-draft/event-catalog.md` |
| 历史材料口径 | 旧 README 和旧 `00-需求文档.md` 只作差异审计输入,不继承为当前结论 |
| 当前禁写范围 | 不写核心能力闭环、用户故事、功能、业务规则、数据归属、接口、NFR、验收、schema、事件 payload、port、repository、配置或实施边界 |
| 正式文档写入 | blocked: 当前只写中间产物,不修改正式 `00-需求文档.md` |
| next_allowed_action | 等待用户确认后进入 Step 3 `背景与问题定义`。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 已读取 Step 2 规范、Step 1 结论和边界线索。 |
| 整体模块搭建 | done | Step 2 模块骨架 | pass | 进入模块 1 思考。 |
| 模块 1 仓级定位候选:先思考 | done | 一句话定义候选的判定问题 / 诊断 / 取舍 | pass | 进入模块 1 再写入。 |
| 模块 1 仓级定位候选:再写入 | done | 一句话定义候选结论 | pass | 进入模块 2 思考。 |
| 模块 2 非职责与混淆对象:先思考 | done | 本仓不是什么、最易混淆对象的判断 | pass | 进入模块 2 再写入。 |
| 模块 2 非职责与混淆对象:再写入 | done | 非职责表和边界对象候选 | pass | 进入模块 3 思考。 |
| 模块 3 单独成仓原因:先思考 | done | 单独成仓理由的事实边界分析 | pass | 进入模块 3 再写入。 |
| 模块 3 单独成仓原因:再写入 | done | 单独成仓原因结论 | pass | 进入模块 4 思考。 |
| 模块 4 旧材料差异审计:先思考 | done | 旧 README / 旧 00 的边界污染检查 | pass | 进入模块 4 再写入。 |
| 模块 4 旧材料差异审计:再写入 | done | 可保留线索、废弃项、后置项 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 边界声明表候选 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 2 章草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 是否允许进入 Step 3 | pass | wait_user_confirm_step_3 |

---

## 2. 必读文档

### 2.1 已读取文档摘要

| 文档 | 读取结论 | 对 Step 2 的影响 |
|---|---|---|
| `design-calibration/00_req_step_01_upstream_relation.md` | Step 1 已把权威输入、流程约束、主题细化输入和历史差异输入分层;旧材料不继承为当前结论。 | Step 2 只能从已确认来源抽取仓级边界候选,不得直接复制旧对象或功能清单。 |
| `standards/document/需求文档讨论流程_SOP.md` Step 2 | 本步只回答一句话定义、单独成仓原因、本仓不是什么、最易混淆对象。 | Step 2 不进入背景、目标、依赖、能力、功能、数据、接口或验收。 |
| `standards/document/需求文档书写规范.md` 4.2 | 正式第 2 章必须固定为一张边界声明表和一段 2~4 句短文字。 | 中间产物需要先收敛表格四个字段:一句话定义、本仓不是什么、边界对象列表、单独成仓原因。 |
| `standards/document/设计文档讨论中间产物规范.md` | 每个 Step 必须先列必读文档,再搭模块,逐模块先思考后写入。 | 本文件只推进当前模块,后续不得一次性铺完整 Step。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 后续 schema / port / state / mapper / config / artifact evidence 都必须有正式真相源。 | Step 2 只做仓级边界声明,不写后续可落码字段或实现口径。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `L1-artifact` 依赖 `L0-core`,按需消费 governance / work / process 引用,通过 `L0-bus` 发布制品事件;Artifact 正文和血缘归 artifact。 | 可作为定位和非职责线索;具体依赖裁剪留到 Step 6 / Step 12。 |
| `architecture/仓库拆分方案.md` | `quantalithos-artifact` 是制品域服务;候选聚合包括 Artifact / ArtifactRelation / Baseline / DatasetArtifact;workspace 不拥有 Artifact 正文。 | 可作为仓级边界线索;对象和聚合结论不能在 Step 2 固化。 |
| `product/六域模型.md` | 制品域回答“产出什么可审计资产”,强调 Artifact、血缘、Baseline、DatasetArtifact 和跨域可追溯。 | 可支撑一句话定位候选,但状态机、事件、关系种类和字段留到后续 Step。 |
| `architecture/标准对齐全景图.md` | artifact 对齐 ISO 15288 Work Product / SoI、ISO 9001 Documented Information、ISO 25010 quality、ISO 24748-2 Baseline 等。 | 可说明为什么 artifact 不能退化为附件仓或普通文档仓;具体标准条款不在 Step 2 展开。 |
| `architecture/bus-draft/event-catalog.md` | artifact 事件族是跨域协作线索,订阅方包括 work / process / governance / archive / observability 等。 | 只作为边界混淆线索;Step 2 不定义事件清单或 payload。 |
| `projects/L1-artifact/README.md` | 旧 README 混合仓使命、对象、技术栈、目录、性能和安全内容。 | 只作历史材料;技术栈、存储、目录和性能指标不得进入 Step 2 结论。 |
| `projects/L1-artifact/00-需求文档.md` | 旧 00 已提前写入目标、功能、用户故事、数据、接口和验收。 | 只作差异审计输入;不能把旧章节内容直接作为本轮 Step 2 边界结论。 |
| `projects/L1-governance/design-calibration/00_req_step_02_position_boundary.md` | 已完成项目的 Step 2 使用“问题回答、旧材料诊断、设计取舍、结构化中间产物、回填草稿、自检”框架。 | 只借鉴文件组织方式,不复制 governance 的结论或对象。 |

### 2.2 待补读文档

| 文档 | 必要原因 | 预计落点 |
|---|---|---|
| `projects/L1-artifact/01-架构设计.md` | 若模块 4 需要审计旧架构如何污染边界,再按历史材料读取。 | 模块 4 旧材料差异审计。 |
| `projects/L1-artifact/02-概要设计.md` | 若旧概要已把对象 / 组件混入需求边界,再审计。 | 模块 4 旧材料差异审计。 |
| `projects/L1-artifact/03-详细设计.md` | 若需要识别 schema / port / API 对 Step 2 的反向污染,再审计。 | 模块 4 旧材料差异审计。 |
| `projects/L1-artifact/05-测试方案.md` / `06-验收标准.md` | 若旧测试或验收把性能 / 事件 / 数据归属反推边界,再审计。 | 模块 4 旧材料差异审计。 |

---

## 3. 整体模块骨架

Step 2 只拆四个实质模块:

| 模块 | 要回答的问题 | 输出 | 不输出 |
|---|---|---|---|
| 模块 1:仓级定位候选 | `L1-artifact` 最短一句话定义是什么?这个定义如何避免变成“附件仓 / 文档仓 / 存储仓”? | 一句话定义候选和定位取舍。 | 不列 Artifact kind、状态机、关系种类、功能清单。 |
| 模块 2:非职责与混淆对象 | 本仓不是什么?最容易与哪些仓、层、能力或概念混淆? | 非职责候选和边界对象列表。 | 不展开使用方与依赖,不写数据归属矩阵。 |
| 模块 3:单独成仓原因 | 为什么制品真相必须独立成仓,不能落入 work / process / governance / archive / workspace 等相邻仓? | 单独成仓原因结论。 | 不做架构选型对比,不写部署或存储方案。 |
| 模块 4:旧材料差异审计 | 旧 README / 旧 00 中哪些定位说法可保留为线索,哪些会污染 Step 2? | 可保留线索、废弃项、后置项。 | 不继承旧功能、旧技术栈、旧性能指标或旧验收。 |

---

## 4. 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| Step 2 开工 | pass | 用户已确认进入 Step 2。 |
| 必读文档读取 | pass | 已读取 Step 2 规范、Step 1 结论、边界线索和 L1-governance 框架参照。 |
| 整体模块搭建 | pass | 已明确 Step 2 四个实质模块和禁写范围。 |
| 下一模块 | done | Step 2 已完成;等待用户确认进入 Step 3。 |

---

## 5. 模块思考记录

### 5.1 模块 1:仓级定位候选:先思考

#### 5.1.1 问题回答

Step 2 的一句话定义必须回答“L1-artifact 是什么仓”,而不是列出它将来可能有哪些对象、事件或实现。基于 Step 1 来源分层和本步边界线索,当前定位候选应围绕三个关键词收束:

| 关键词 | 当前判断 | 边界含义 |
|---|---|---|
| 制品真相 | 本仓拥有可审计产出的正式制品事实。 | 不是 UI 附件、workspace 视图或 archive 包装。 |
| 正文与血缘 | 全局依赖规则已明确 Artifact 正文和血缘归 artifact。 | 不是只保存引用或外部链接的轻量索引仓。 |
| 可审计资产 | 六域模型强调 artifact 回答“产出什么可审计资产”。 | 不是通用文件存储、普通文档系统或代码仓镜像。 |

因此,一句话定义需要同时表达:

- 本仓是 L1 六域服务层的制品真相仓。
- 它承载可审计产出的正文、版本、血缘和基线语义。
- 它不接管 work / process / governance / conversation / archive / workspace 的业务真相。

#### 5.1.2 诊断

旧材料里有几个定位线索有价值,但不能原样进入 Step 2:

| 旧说法 | 可取之处 | 问题 |
|---|---|---|
| “制品域服务” | 能说明本仓属于六域之一。 | 太泛,没有说明真相边界,容易被理解为任意产物相关功能都归 artifact。 |
| “Artifact + ArtifactRelation + Baseline + DatasetArtifact” | 能提示后续对象候选。 | Step 2 不应把聚合清单写成一句话定义,否则提前进入数据 / 对象设计。 |
| “一切可审计产出的承载者” | 贴近六域模型的产品叙事。 | 需要补上“仓级真相”和“相邻仓不拥有正文 / 血缘”的边界,否则过宽。 |
| “Rust + PostgreSQL + 多后端内容存储” | 可能是历史实现候选。 | 属于架构 / 实现 / 配置,不得进入需求边界定义。 |
| “16 kind / 7 relation / P95 / hash 扫描” | 后续可能是功能、规则、NFR 或验收候选。 | 会把 Step 7~14 的内容提前塞入 Step 2。 |

Step 2 的一句话定义要避免两种极端:

- 太窄:把 L1-artifact 说成“文件附件仓 / 内容存储仓 / hash 校验仓”,会丢掉血缘、基线和可审计资产语义。
- 太宽:把所有与产物相关的协作、审批、流程、归档、展示、质量度量都纳入 artifact,会侵入 work / process / governance / archive / observability / workspace。

#### 5.1.3 取舍

| 方案 | 定位表达 | 优点 | 缺点 | 当前取舍 |
|---|---|---|---|---|
| 方案 A | `L1-artifact` 是制品域服务。 | 简短,承接仓库拆分和六域模型。 | 过泛,不足以防止正文 / 血缘 / 附件 / 归档边界混淆。 | 不采用。 |
| 方案 B | `L1-artifact` 是 Artifact / Relation / Baseline / DatasetArtifact 管理仓。 | 对旧材料和对象候选有承接。 | 提前固化对象清单,不符合 Step 2 粒度。 | 不采用。 |
| 方案 C | `L1-artifact` 是可审计制品真相仓,负责承载平台产出的 Artifact 正文、版本、血缘与基线事实。 | 能说明仓级真相、正文与血缘边界,不展开对象字段和功能。 | 后续还需在模块 2 解释与 work / process / governance / archive / workspace 的边界。 | 采用为当前候选。 |
| 方案 D | `L1-artifact` 是多后端内容存储与血缘查询服务。 | 贴近旧 README 的实现想象。 | 把需求定位降格为技术实现,且混入存储 / 查询方案。 | 不采用。 |

当前推荐把一句话定义收束为“可审计制品真相仓”,并在“负责承载”后只列仓级语义:正文、版本、血缘、基线事实。Artifact kind、关系种类、状态机、质量标签、Dataset 特化和事件清单留到后续 Step,不在模块 1 写成正式结论。

### 5.2 模块 1:仓级定位候选:再写入

#### 5.2.1 一句话定义候选

```text
L1-artifact 是可审计制品真相仓,负责承载平台产出的 Artifact 正文、版本、血缘与基线事实。
```

#### 5.2.2 定位字段解释

| 字段 | 采用内容 | 说明 |
|---|---|---|
| 仓名 | `L1-artifact` | 使用项目正式名,不使用旧 README 的实现仓名扩展。 |
| 核心定位 | 可审计制品真相仓 | 强调本仓拥有的是制品事实真相,不是附件展示、普通文件存储或归档包装。 |
| 承载对象 | 平台产出的 Artifact 正文、版本、血缘与基线事实 | 只列仓级语义,不列 kind、状态、关系枚举、字段或 API。 |
| 限制语义 | 负责承载 | 表达事实归属,不暗示本仓拥有 work / process / governance / archive / workspace 的业务真相。 |

#### 5.2.3 不采用表达

| 表达 | 不采用原因 |
|---|---|
| `L1-artifact` 是制品域服务。 | 过泛,不足以防止把所有产物相关能力都塞入本仓。 |
| `L1-artifact` 是 Artifact / ArtifactRelation / Baseline / DatasetArtifact 管理仓。 | 提前把对象候选写成 Step 2 定义,会污染后续数据 / 对象设计。 |
| `L1-artifact` 是多后端内容存储服务。 | 把需求定位降格为技术实现,且旧材料中的 Git / S3 / inline / URL 尚未校准。 |
| `L1-artifact` 是全平台所有质量、审计和归档制品的处理中心。 | 过宽,会侵入 governance、observability、archive 和 workspace。 |

#### 5.2.4 后续约束

模块 2 需要继续检查这句定义是否会被误读为:

- 本仓拥有 `L1-work` 的 WorkItem / Project 真相。
- 本仓拥有 `L1-process` 的 Activity / ProcessInstance 真相。
- 本仓拥有 `L1-governance` 的 Gate / Policy / AIIA / SoA 治理结论真相。
- 本仓拥有 `L4-archive` 的归档包正文或长期存储策略。
- 本仓拥有 `L1-workspace` / UI 的制品展示状态。

### 5.3 模块 2:非职责与混淆对象:先思考

#### 5.3.1 问题回答

模块 2 要回答的是“这句定位排除了什么”,不是列出完整依赖关系。根据当前一句话定义,`L1-artifact` 的边界核心是 Artifact 正文、版本、血缘与基线事实;相邻仓可以引用、消费、触发或展示这些事实,但不应把自己的业务真相转移给 artifact。

需要优先排除的混淆方向有四类:

| 混淆方向 | 当前判断 | 不能在本模块做的事 |
|---|---|---|
| 业务事实混淆 | work / process / governance 各自拥有项目、过程、治理决策真相,artifact 只承载制品事实和制品血缘。 | 不写依赖裁剪表,不定义事件流。 |
| 展示 / 归档混淆 | conversation / workspace / archive 可以展示、打包或恢复 artifact,但不拥有 artifact 正文和血缘真相。 | 不写 UI、归档包结构或恢复流程。 |
| 横切能力混淆 | observability 可持有审计 / trace 存储,但不替代 artifact 血缘事实。 | 不写追踪 API、指标或审计存储。 |
| 定义 / 运行混淆 | method-library、runtime、capability-hub 可以提供定义、执行或能力上下文,但不拥有制品正文事实。 | 不写方法定义、运行时策略或工具执行规则。 |

#### 5.3.2 诊断

当前一句话定义中的“平台产出的 Artifact 正文、版本、血缘与基线事实”容易产生三个误读:

- 误读为“所有与产出相关的业务状态都归 artifact”:例如 WorkItem done、Activity completed、Gate decided。实际这些仍应留在 work / process / governance。
- 误读为“artifact 负责所有制品生命周期协作”:例如审批、对话评审、归档、展示、质量看板。实际这些是相邻仓或横切仓职责,artifact 只保持制品事实可被引用。
- 误读为“artifact 是内容存储基础设施”:例如 Git / S3 / inline / URL、多后端存储、hash 扫描和备份。实际这些是后续架构 / 配置 / NFR 候选,不是 Step 2 的仓级需求边界。

因此模块 2 需要把非职责和混淆对象分开:

- 非职责用于回答“本仓不是什么”。
- 混淆对象用于列出读者最容易串线的仓、层、能力或概念。
- 解释原因可以写在思考记录和后续短文字中,但正式边界声明表里的“边界对象列表”只能列对象,不展开矩阵。

#### 5.3.3 取舍

| 取舍项 | 当前判断 | 理由 |
|---|---|---|
| 是否把 `L1-work` 列为混淆对象 | 需要列入。 | WorkItem、Project 和 Project baseline 引用最容易与 Artifact / Baseline 边界混写。 |
| 是否把 `L1-process` 列为混淆对象 | 需要列入。 | Activity outputs、process artifact inputs / outputs 容易被误读为 artifact 拥有过程真相。 |
| 是否把 `L1-governance` 列为混淆对象 | 需要列入。 | AIIA / SoA / Gate / Baseline control 同时涉及治理结论和制品正文。 |
| 是否把 `L1-conversation` / `L1-workspace` 列为混淆对象 | 需要列入,但只列展示 / 视图边界。 | conversation 可分享 artifact,workspace 可维护投影,但都不拥有 artifact 正文。 |
| 是否把 `L4-observability` / `L4-archive` 列为混淆对象 | 需要列入。 | 追溯、审计、归档与制品血缘紧密相关,但不是 artifact 真相替代者。 |
| 是否把 `L3-method-library` 列为混淆对象 | 需要列入。 | WorkProductDefinition / Artifact kind 语义来源可能与 artifact 实例真相混淆。 |
| 是否把技术后端列为混淆对象 | 不作为主要边界对象。 | Git / S3 / PostgreSQL 属于实现 / 配置候选,不是需求 Step 2 的相邻仓边界。 |

模块 2 的写入应采用两层输出:先写“非职责候选”,再写“边界对象候选”。其中非职责可以解释排除职责,边界对象只列对象和类型,为后续正式边界声明表做准备。

### 5.4 模块 2:非职责与混淆对象:再写入

#### 5.4.1 非职责候选

| 非职责对象 | 当前结论 |
|---|---|
| `L1-work` | `L1-artifact` 不拥有 Project、ProjectMember、WorkItem、Iteration、Backlog、承诺子集或工作状态真相。 |
| `L1-process` | `L1-artifact` 不拥有 ProcessTemplate、ProcessProfile、ProcessInstance、Activity、checkpoint、waiting gate 或过程执行真相。 |
| `L1-governance` | `L1-artifact` 不拥有 Gate decision、Policy 生效、AIIA / SoA 治理批准结论、Control 适用性或 Nonconformity 纠正闭环真相。 |
| `L1-conversation` | `L1-artifact` 不拥有 conversation space、Turn、review discussion、artifact preview turn 或对话显化真相。 |
| `L1-workspace` | `L1-artifact` 不拥有跨域工作台、聚合视图、筛选状态、展示布局或 UI 交互状态。 |
| `L4-observability` | `L1-artifact` 不拥有审计总账、trace storage、指标、告警流水或观测系统的物理存储真相。 |
| `L4-archive` | `L1-artifact` 不拥有项目归档包、长期保留策略、恢复编排或跨域快照包真相。 |
| `L3-method-library` | `L1-artifact` 不拥有 MethodContent、WorkProductDefinition、ProcessTemplateDef、RoleDefinition 或 artifact kind 定义来源真相。 |
| `L2-runtime` / `L3-capability-hub` | `L1-artifact` 不拥有运行时执行、工具调用、能力注册、工具白名单或自动化执行策略真相。 |
| 内容后端 / 存储基础设施 | `L1-artifact` 不等同于 Git、S3、inline content、external URL、PostgreSQL 或向量库等具体存储实现。 |

#### 5.4.2 边界对象候选

此表只列 Step 2 正式边界声明表可使用的边界对象候选,不展开依赖或数据归属。

| 类型 | 对象 | 混淆方向 |
|---|---|---|
| 仓 | `L1-work` | Project / WorkItem / baseline 引用与 Artifact / Baseline 事实。 |
| 仓 | `L1-process` | Activity output / process artifact input 与制品正文真相。 |
| 仓 | `L1-governance` | Gate / AIIA / SoA / Control 结论与 artifact 正文、版本、基线事实。 |
| 仓 | `L1-conversation` | artifact 分享 / 评审讨论 / 预览 turn 与制品真相。 |
| 仓 | `L1-workspace` | 跨域视图投影与 artifact 正文 / 血缘真相。 |
| 仓 | `L4-observability` | trace / audit / lineage 查询与 artifact 血缘事实。 |
| 仓 | `L4-archive` | 归档包 / 恢复包与 artifact 正文、版本和基线事实。 |
| 仓 | `L3-method-library` | WorkProductDefinition / artifact kind 定义与 artifact 实例真相。 |
| 仓 | `L2-runtime` | 自动化执行产物生成与 artifact 正文真相。 |
| 仓 | `L3-capability-hub` | 工具能力注册 / 工具调用结果与 artifact 产物事实。 |
| 概念 | Artifact 正文 | 可审计制品内容本体,不是 UI 附件或外部链接占位。 |
| 概念 | Artifact 血缘 | 制品之间的可追溯关系,不是 observability trace 的替代物。 |
| 概念 | Baseline | 冻结的 Artifact 版本集合事实,不是 work 项目的普通字段或 governance decision 本身。 |
| 概念 | DatasetArtifact | AI 数据集制品事实候选,不是通用数据治理系统或数据湖。 |

#### 5.4.3 当前限制

以上非职责和边界对象候选仍属于 Step 2 中间产物,不直接生成以下内容:

- 不生成使用方与依赖裁剪表。
- 不生成核心能力闭环。
- 不生成 Artifact kind、relation kind、state machine 或 Baseline schema。
- 不生成事件清单、接口、port、DTO、repository 或持久化设计。
- 不生成测试、验收、evidence 或实施 boundary。

### 5.5 模块 3:单独成仓原因:先思考

#### 5.5.1 问题回答

`L1-artifact` 需要单独成仓的理由不是“制品很多”“文件很大”或“需要独立存储系统”,而是制品事实具备独立真相边界。Artifact 正文、版本、血缘和基线会被 work、process、governance、conversation、workspace、observability、archive 等多个仓引用或消费;如果这些事实散落在任一相邻仓,后续就无法稳定回答“这个产出是什么、哪个版本、基于什么、被什么替代、是否进入基线、如何被跨域追溯”。

成仓理由应围绕三条主线:

| 主线 | 当前判断 | 边界意义 |
|---|---|---|
| 制品事实独立 | Artifact 正文、版本、血缘和基线不是 work / process / governance 的附属字段。 | 防止相邻仓各自保存一份不同的制品事实。 |
| 生命周期独立 | 制品从产生、评审、批准、冻结、发布、替代到归档的语义不同于项目、过程、治理或归档包生命周期。 | 防止用 WorkItem 状态、Activity 状态、Gate 结论或 archive 状态替代 Artifact 状态。 |
| 跨域引用独立 | 多个仓都需要稳定引用同一 Artifact 事实,而不是复制正文或重建血缘。 | 防止跨域追溯、审计和验收出现多真相。 |

#### 5.5.2 诊断

如果 `L1-artifact` 不单独成仓,常见替代方案都会破坏边界:

| 替代落点 | 表面好处 | 边界问题 |
|---|---|---|
| 放进 `L1-work` | WorkItem 常常产出或引用 Artifact。 | 制品会退化为项目 / 任务附件,组织级制品、跨项目复用、独立版本和血缘会变弱。 |
| 放进 `L1-process` | Activity 有 inputs / outputs。 | 制品会退化为过程执行产物,无法稳定覆盖过程外产生、过程后复用、长期引用和基线冻结。 |
| 放进 `L1-governance` | AIIA / SoA / ComplianceDeclaration 同时是治理对象和制品。 | 治理结论和制品正文会混在一起,容易产生审批真相和文档真相双写。 |
| 放进 `L4-archive` | 归档包需要包含 Artifact。 | 制品会变成冷归档材料,无法表达活跃版本、血缘演进、批准前更新和基线前生命周期。 |
| 放进 `L4-observability` | 可追溯性需要 trace / audit。 | trace / audit 记录不能替代 Artifact 之间的语义血缘和基线成员事实。 |
| 放进 `L1-workspace` / UI | 用户需要看制品。 | 展示视图和筛选状态不能成为制品正文、版本和血缘真相。 |

因此,单独成仓的核心理由应是“跨域共享的制品事实必须有唯一来源”,而不是“artifact 需要更复杂的存储”。

#### 5.5.3 取舍

| 取舍项 | 当前判断 | 理由 |
|---|---|---|
| 是否用“存储复杂度”作为成仓原因 | 不采用。 | 容易把需求边界降格为技术实现,且存储方案应留给架构 / 配置。 |
| 是否用“可审计产出很多”作为成仓原因 | 不单独采用。 | 数量不是成仓的本质,真相边界才是。 |
| 是否用“跨域引用唯一真相”作为主因 | 采用。 | 能解释为什么 work / process / governance / archive / workspace 都不能替代 artifact。 |
| 是否在成仓理由中提 Artifact kind / relation kind / state machine | 不在本模块展开。 | 这些属于后续能力、规则、数据和详细设计,Step 2 只写仓级原因。 |
| 是否提到 Baseline | 可以提,但只作为仓级事实。 | Baseline 是最容易与 work / governance / archive 混淆的边界对象,但不写 schema。 |

模块 3 的后续写入应把成仓理由压缩成一条清晰结论:平台需要一处独立、稳定、可追溯的制品事实来源,避免 Artifact 正文、版本、血缘和基线事实散落在工作、过程、治理、归档、观测或视图仓中。

### 5.6 模块 3:单独成仓原因:再写入

#### 5.6.1 单独成仓原因结论

```text
L1-artifact 必须单独成仓,因为平台需要一处独立、稳定、可追溯的制品事实来源,统一承载 Artifact 正文、版本、血缘和基线事实,避免这些事实散落在工作、过程、治理、归档、观测或视图仓中形成多真相。
```

#### 5.6.2 成仓理由拆解

| 理由 | 结论 | 防止的问题 |
|---|---|---|
| 唯一事实来源 | Artifact 正文、版本、血缘和基线必须有统一归属。 | work / process / governance / archive 各自保存不同版本的制品事实。 |
| 跨域稳定引用 | 相邻仓只能引用或消费 artifact 事实,不能复制正文或重建血缘。 | 下游根据不同副本做判断,导致追溯和验收不一致。 |
| 生命周期独立 | Artifact 生命周期不同于 WorkItem、Activity、Gate、archive package 或 workspace view。 | 用相邻仓状态替代制品状态,破坏版本、替代和基线语义。 |
| 审计与追溯独立 | Artifact 血缘是制品语义关系,不是 trace、audit log 或 UI 链接。 | 把可追溯性降格为日志查询或展示跳转。 |

#### 5.6.3 不作为成仓理由的事项

| 事项 | 处理口径 |
|---|---|
| 文件多、内容大 | 可作为后续 NFR 或架构容量输入,不作为 Step 2 成仓理由。 |
| 需要 Git / S3 / inline / URL 多后端 | 属于架构 / 配置候选,不是需求边界理由。 |
| 需要 hash 扫描、备份、benchmark | 属于业务规则、NFR、验收或实现候选,不进入 Step 2。 |
| 需要 16 kind / 7 relation / Dataset 特化 | 属于后续能力、功能、规则和数据归属讨论,当前只保留为主题线索。 |

### 5.7 模块 4:旧材料差异审计:先思考

#### 5.7.1 问题回答

旧 README 和旧 `00-需求文档.md` 在 Step 2 中只能用于检查边界污染,不能直接继承为当前定位结论。当前已形成的一句话定义、非职责和成仓原因可以吸收旧材料中的“制品真相 / 可审计产出 / Artifact 正文与血缘”线索,但必须排除以下旧内容:

- 对象清单提前固化:Artifact(16 kind)、ArtifactRelation(7 kind)、Baseline、DatasetArtifact。
- 技术栈提前固化:Rust、PostgreSQL、Git / S3 / inline / external URL、向量库。
- 功能与性能提前固化:GetLineage、hash 扫描、tampered 事件、P95、规模。
- 下游依赖提前固化:work / governance / process / archive / observability 的事件订阅和联动。

#### 5.7.2 诊断

旧 README 的最大问题是把“仓定位、对象设计、技术选型、目录结构、维护纪律、性能目标、安全机制”写在同一个入口里。它能提供定位线索,但不能作为 Step 2 的当前结论来源。

旧 `00-需求文档.md` 的问题更直接:头部定位已经把 Artifact 四对象和“一切可审计产出的真相源”写成需求定位,第 2 章又马上展开 16 kind、7 relation、Baseline、DatasetArtifact、hash 防篡改和性能规模。这些内容大多可能有价值,但它们属于后续 Step:

| 旧内容类型 | 应后置到 |
|---|---|
| 16 kind、7 relation、状态机、Baseline、DatasetArtifact | Step 7 / Step 9 / Step 10 / Step 11 |
| WorkItem done、Activity outputs、AIIA / SoA 双身份、archive 打包 | Step 6 / Step 12 |
| P95、5000w Artifact、1.5 亿 Relation、hash 扫描 | Step 13 / Step 14 |
| 技术栈、内容后端、目录结构、迁移、RPC | `01` / `02` / `03` / `04` / `07` |

#### 5.7.3 取舍

| 取舍项 | 当前判断 | 理由 |
|---|---|---|
| 是否保留“制品域服务” | 保留为背景线索,不作为最终一句话定义。 | 太泛,但能说明本仓属于六域之一。 |
| 是否保留“一切可审计产出的承载者” | 保留语义,改写为“可审计制品真相仓”。 | 需要补足正文、版本、血缘和基线事实边界。 |
| 是否保留 Artifact / Relation / Baseline / DatasetArtifact | 仅保留为后续对象候选。 | Step 2 不固化对象清单和字段。 |
| 是否保留旧非目标中的 work / governance / process / conversation 边界 | 保留为边界审计线索。 | 与模块 2 非职责方向一致,但需按新版边界重写。 |
| 是否保留旧性能和安全条目 | 后置。 | 属于 NFR、验收、架构或实现。 |

模块 4 后续写入应形成三类清单:可保留线索、废弃项、后置项。只要是对象字段、功能、技术栈、性能指标、事件清单或验收用例,都不得进入 Step 2 的正式边界结论。

### 5.8 模块 4:旧材料差异审计:再写入

#### 5.8.1 可保留线索

| 旧材料 | 可保留线索 | 当前处理 |
|---|---|---|
| `README.md` | L1-artifact 属于 L1 六域服务层中的制品域。 | 保留为上游定位线索。 |
| `README.md` / 旧 `00` | “一切可审计产出的承载者”这一产品叙事。 | 改写为“可审计制品真相仓”。 |
| `README.md` / 旧 `00` | Artifact 正文、血缘、Baseline 与 DatasetArtifact 是重要主题。 | 仅作为后续 Step 的对象 / 能力 / 数据候选。 |
| 旧 `00` | work / governance / process / conversation 等不是 artifact 的业务真相。 | 保留为非职责审计线索,按新版模块 2 重写。 |
| 旧 `00` | hash、防篡改、追溯、基线、质量标签是重要关注点。 | 后置到业务规则、NFR、验收或设计阶段。 |

#### 5.8.2 废弃项

| 旧内容 | 当前处理 | 原因 |
|---|---|---|
| 旧 `00` 已完成,可直接沿用 Step 2 定位 | 废弃。 | 本轮是 full-restart,旧 00 只作历史材料。 |
| 用 “Artifact(16 kind)+ ArtifactRelation(7 kind)+ Baseline + DatasetArtifact” 作为 Step 2 一句话定义 | 废弃。 | 这会提前固化对象清单,越过后续 Step。 |
| 用 Rust + PostgreSQL + 多后端内容存储定义本仓 | 废弃。 | 技术栈不属于需求 Step 2 的仓级定位。 |
| 把目录结构、migrations、tests、workflow 写入定位边界 | 废弃。 | 属于实现 / 实施组织,不属于需求边界。 |
| 把旧 benchmark 或规模数字写入 Step 2 | 废弃。 | 性能指标属于 Step 13 / Step 14。 |

#### 5.8.3 后置项

| 后置内容 | 后续落点 | 当前限制 |
|---|---|---|
| Artifact kind、ArtifactRelation kind、状态机 | Step 7 / Step 9 / Step 10 / Step 11 | 当前不写对象或枚举结论。 |
| Baseline 冻结、变更控制、成员 pin 到版本与 hash | Step 7 / Step 10 / Step 11 / Step 14 | 当前只保留 Baseline 是边界对象。 |
| DatasetArtifact 的 provenance、bias、quality、privacy、retention | Step 9 / Step 10 / Step 11 / Step 13 | 当前不写数据字段或治理细节。 |
| GetLineage、hash 校验、tampered 检测 | Step 9 / Step 10 / Step 13 / Step 14 | 当前不写功能、业务规则或验收。 |
| work / process / governance / archive / observability 事件联动 | Step 6 / Step 12 | 当前不写依赖裁剪或接口。 |
| 内容存储统一抽象、Git / S3 / inline / URL、PostgreSQL、向量库 | `01` / `02` / `03` / `04` / `07` | 当前不写技术选型或配置。 |

#### 5.8.4 当前结论

旧材料的定位方向可以作为线索,但旧材料的对象清单、功能、技术栈、性能、安全和依赖联动不能进入 Step 2 正式边界结论。Step 2 只保留仓级心智:本仓是可审计制品真相仓,不替代相邻仓业务真相,也不被技术存储后端定义。

---

## 6. 结构化中间产物

### 6.1 边界声明表候选

| 字段 | 候选内容 | 来源 |
|---|---|---|
| 一句话定义 | `L1-artifact 是可审计制品真相仓,负责承载平台产出的 Artifact 正文、版本、血缘与基线事实。` | 模块 1 仓级定位候选。 |
| 本仓不是什么 | `L1-artifact 不是工作事实仓、过程执行仓、治理决策仓、对话显化仓、workspace 视图仓、observability 审计存储仓、archive 归档恢复仓、method-library 定义仓、runtime / capability-hub 执行仓或具体内容存储后端。` | 模块 2 非职责与混淆对象。 |
| 边界对象列表 | `L1-work`;`L1-process`;`L1-governance`;`L1-conversation`;`L1-workspace`;`L4-observability`;`L4-archive`;`L3-method-library`;`L2-runtime`;`L3-capability-hub`;`Artifact 正文`;`Artifact 血缘`;`Baseline`;`DatasetArtifact` | 模块 2 非职责与混淆对象。 |
| 单独成仓原因 | `L1-artifact 必须单独成仓,因为平台需要一处独立、稳定、可追溯的制品事实来源,统一承载 Artifact 正文、版本、血缘和基线事实,避免这些事实散落在工作、过程、治理、归档、观测或视图仓中形成多真相。` | 模块 3 单独成仓原因。 |

### 6.2 边界对象解释候选

| 对象 | 当前边界说明 | 后续落点 |
|---|---|---|
| `L1-work` | 可以引用 Artifact / Baseline,但不拥有 Artifact 正文、版本、血缘或基线成员事实。 | Step 6 / Step 12。 |
| `L1-process` | 可以把 Artifact 作为 Activity input / output,但不拥有制品正文或制品版本真相。 | Step 6 / Step 12。 |
| `L1-governance` | 可以批准、约束或消费制品,但 Gate / Policy / AIIA / SoA 治理结论不等同于 Artifact 事实。 | Step 6 / Step 10 / Step 12。 |
| `L1-conversation` | 可以讨论、评审或显化 Artifact,但对话内容不替代制品正文和血缘真相。 | Step 5 / Step 6。 |
| `L1-workspace` | 可以展示 Artifact 跨域视图,但 workspace view / filter / layout 不拥有制品事实。 | Step 6 / Step 12。 |
| `L4-observability` | 可以记录 trace、audit 和指标,但不能替代 Artifact 血缘与基线事实。 | Step 6 / Step 13。 |
| `L4-archive` | 可以归档和恢复包含 Artifact 的包,但 archive package 不拥有活跃 Artifact 版本和血缘真相。 | Step 6 / Step 12。 |
| `L3-method-library` | 可以定义 work product / artifact kind 语义来源,但不拥有 artifact 实例正文和版本事实。 | Step 6 / Step 11。 |
| `L2-runtime` / `L3-capability-hub` | 可以执行工具或登记能力,但工具执行过程和能力注册不替代产出后的 Artifact 事实。 | Step 6 / Step 12。 |
| Artifact 正文 | 是本仓边界核心之一,但当前不定义存储后端、正文 schema 或 hash 策略。 | Step 7 / Step 9 / Step 11。 |
| Artifact 血缘 | 是本仓边界核心之一,但当前不定义 relation kind、图查询或事件 payload。 | Step 7 / Step 9 / Step 10 / Step 12。 |
| Baseline | 是冻结的 Artifact 版本集合事实,但当前不定义冻结规则、pinning 字段或审批流程。 | Step 7 / Step 10 / Step 11 / Step 14。 |
| DatasetArtifact | 是 AI 数据集制品事实候选,但当前不定义质量、偏差、隐私或保留字段。 | Step 7 / Step 9 / Step 11 / Step 13。 |

### 6.3 正式第 2 章草稿输入约束

回填草稿时只能使用本节 `6.1` 和 `6.2` 的边界声明候选,并保持以下限制:

- 不写核心能力闭环、用户故事、功能需求、数据字段、接口、NFR 或验收项。
- 不固化 Artifact kind、relation kind、state、schema、event payload、repository、port 或 storage backend。
- 不从旧 README / 旧 `00-需求文档.md` 直接复制对象、性能、技术栈或测试口径。
- 正式第 2 章应保持一张边界声明表和一段短文字,并回指本 Step 文件作为校准来源。

### 6.4 结构化中间产物门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否回答一句话定义 | pass | 已收敛为“可审计制品真相仓”。 |
| 是否回答本仓不是什么 | pass | 已排除相邻业务仓、横切仓、定义仓、执行仓和存储后端。 |
| 是否列出边界对象 | pass | 已列仓级混淆对象和四个概念候选。 |
| 是否说明单独成仓原因 | pass | 已收敛为跨域制品事实唯一来源。 |
| 是否越界到功能 / 数据 / 接口 / 实现 | pass | 本节只形成需求 Step 2 边界声明候选。 |

### 6.5 当前停审

```text
Step 2 `结构化中间产物` 已完成。
下一步只允许在用户确认后进入 `回填草稿`。
正式 `00-需求文档.md` 仍不得修改。
```

---

## 7. 回填草稿

### 7.1 正式第 2 章草稿

> 校准来源: `design-calibration/00_req_step_02_position_boundary.md` 6.1~6.2。

## 2. 本仓定位与边界

| 字段 | 结论 |
|---|---|
| 一句话定义 | L1-artifact 是可审计制品真相仓,负责承载平台产出的 Artifact 正文、版本、血缘与基线事实。 |
| 本仓不是什么 | L1-artifact 不是工作事实仓、过程执行仓、治理决策仓、对话显化仓、workspace 视图仓、observability 审计存储仓、archive 归档恢复仓、method-library 定义仓、runtime / capability-hub 执行仓或具体内容存储后端。 |
| 边界对象列表 | 仓:`L1-work`;仓:`L1-process`;仓:`L1-governance`;仓:`L1-conversation`;仓:`L1-workspace`;仓:`L4-observability`;仓:`L4-archive`;仓:`L3-method-library`;仓:`L2-runtime`;仓:`L3-capability-hub`;概念:Artifact 正文;概念:Artifact 血缘;概念:Baseline;概念:DatasetArtifact。 |
| 单独成仓原因 | L1-artifact 必须单独成仓,因为平台需要一处独立、稳定、可追溯的制品事实来源,统一承载 Artifact 正文、版本、血缘和基线事实,避免这些事实散落在工作、过程、治理、归档、观测或视图仓中形成多真相。 |

L1-artifact 的边界核心是制品事实,不是相邻仓对制品的工作安排、过程执行、治理判断、对话评审、视图展示、观测记录或归档包装。相邻仓可以引用、消费、展示或封存 Artifact,但 Artifact 正文、版本、血缘与基线事实必须保持唯一来源,否则后续追溯、审计和验收会形成多真相。本章只建立仓级边界心智,不展开使用方与依赖、核心能力、功能、业务规则、数据归属、接口或非功能指标。

### 7.2 回填草稿门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否使用固定结构边界声明表 | pass | 草稿包含一句话定义、本仓不是什么、边界对象列表、单独成仓原因四个字段。 |
| 是否只保留 2~4 句短文字 | pass | 表后使用一段三句短文字说明边界。 |
| 是否明确标注边界对象类型 | pass | 边界对象使用 `仓:` 和 `概念:` 前缀。 |
| 是否提前展开后续章节内容 | pass | 草稿未写依赖裁剪、能力闭环、功能、规则、数据归属、接口或 NFR。 |
| 是否修改正式 `00-需求文档.md` | pass | 本草稿仅写入中间产物文件。 |

### 7.3 当前停审

```text
Step 2 `回填草稿` 已完成。
下一步只允许在用户确认后进入 `自检与停审`。
正式 `00-需求文档.md` 仍不得修改。
```

---

## 8. 自检与停审

### 8.1 Step 2 完成标准自检

| 完成标准 | 结果 | 证据 |
|---|---|---|
| 已能用 3~5 句话说清本仓定位 | pass | `7.1` 已用边界声明表和三句短文字说明本仓定位。 |
| 已明确本仓不是什么 | pass | `7.1` 已排除工作、过程、治理、对话、视图、观测、归档、定义、执行和存储后端职责。 |
| 已指出至少 2 个最易混淆边界 | pass | `7.1` 已列 `L1-work`、`L1-process`、`L1-governance`、`L4-archive`、`L4-observability` 等边界对象。 |
| 未提前滑入依赖 | pass | 草稿未写依赖方向、调用关系、事件订阅或使用方矩阵。 |
| 未提前滑入核心能力闭环 | pass | 草稿未定义能力节点、闭环动作或能力分组。 |
| 未提前滑入功能 / 规则 / 数据 / 接口 | pass | 草稿未写功能清单、业务规则表、数据归属矩阵、schema、port 或接口清单。 |
| 未继承旧材料完成状态 | pass | 旧 README 和旧 `00-需求文档.md` 只作为差异审计输入。 |
| 未修改正式 `00-需求文档.md` | pass | 当前只修改 `design-calibration/` 中间产物。 |

### 8.2 Step 2 停审结论

```text
Step 2 `本仓定位与边界` 通过自检。
允许在用户确认后进入 Step 3 `背景与问题定义`。
进入 Step 3 前必须重新读取项目级台账、文档级 flow、本 Step 文件和需求 SOP / 书写规范中 Step 3 的规则。
正式 `00-需求文档.md` 仍不得修改。
```

### 8.3 Step 3 开工前限制

| 限制项 | 处理口径 |
|---|---|
| 不直接从 Step 2 跳到核心能力 | Step 3 只讨论背景与问题定义。 |
| 不把边界对象展开为依赖裁剪表 | 使用方与依赖留到 Step 6。 |
| 不把 Artifact 正文 / 血缘 / Baseline 展开为对象或数据字段 | 核心能力、功能、规则和数据归属留到 Step 7~11。 |
| 不读取旧下游设计反推问题定义 | 旧 `01/02/03/05/06` 仍只作历史材料和差异审计输入。 |

### 8.4 当前停审

```text
当前 Step 2 已完成。
下一步等待用户确认后进入 Step 3 `背景与问题定义`。
```
