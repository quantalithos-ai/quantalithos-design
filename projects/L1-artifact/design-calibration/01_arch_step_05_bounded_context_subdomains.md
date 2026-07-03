# Step 5. 限界上下文与子域划分

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 5
> 回填章节: `01-架构设计.md` §6 限界上下文与子域划分
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

说明 `L1-artifact` 内部语义结构如何划分:哪些是核心子域,哪些是支撑子域,哪些只是本地索引 / 投影 / 引用,以及它们之间的上下文映射关系。本步只讨论本仓内部语义结构,不写对象字段、数据库表、代码目录、函数接口、容器部署、技术选型、事件名、运行顺序或实现组件。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | Step 3 已完成 | 承接 Artifact fact / version / lineage / baseline / consumable backref 的职责边界和红线。 |
| `design-calibration/01_arch_step_04_system_context.md` | Step 4 已完成 | 承接正式上下文对象、输入 / 输出面、自动化来源边界和降级口径。 |
| `projects/L1-artifact/00-需求文档.md` §7 / §9 / §10 / §11 / §12 / §14 | 已重建 | 承接五个核心能力、FR-ART-001~020、BR-ART-001~025、数据归属和验收否决项。 |
| `design-calibration/00_req_step_07_core_capability_loop.md` | 已完成 | 提供核心能力闭环:事实承载、版本化、血缘、基线、可消费表达。 |
| `design-calibration/00_req_step_09_functional_requirements.md` | 已完成 | 提供功能需求主轴,用于防止子域遗漏功能承接。 |
| `design-calibration/00_req_step_11_data_ownership.md` | 已完成 | 提供 truth / snapshot / ref / forbidden body 边界,用于区分核心、支撑和本地影子结构。 |
| 旧 `projects/L1-artifact/01-架构设计.md` §5 | 旧 Draft | 仅作为旧 Metadata / Lineage / Freeze / Dataset / Content / ExecutionPlan 划分诊断输入。 |
| `projects/L1-governance/design-calibration/01_arch_step_05_bounded_context_subdomains.md` | 已参考 | 只参考“核心子域 + 支撑上下文 + 本地影子层”的组织方式,不复制治理结论。 |

---

## 3. SOP 问题回答

### 3.1 本仓内部有哪些子域或本地上下文?

`L1-artifact` 的内部语义结构围绕“可审计制品事实”展开,分为三层:

| 层级 | 上下文 |
|---|---|
| 核心子域 | `制品事实核心`;`制品版本核心`;`制品血缘核心`;`制品基线核心` |
| 支撑子域 | `制品输入收束上下文`;`责任审查语境上下文`;`自动化产出边界上下文`;`制品消费表达上下文`;`派生读侧与维护上下文` |
| 本地索引 / 投影 / 引用 | `定义来源引用`;`工作与过程语境引用`;`治理与审计语境引用`;`外部正文与内容来源引用`;`运行与能力来源摘要`;`消费投影 / 搜索 / 报告材料`;`归档 / 观测 / 同步交接引用` |

### 3.2 哪些是核心子域?

核心子域必须直接承载 Artifact truth 主线,缺少任一项都会让本仓退化为附件库、视图仓、归档包或外部正文索引:

| 核心子域 | 判断 |
|---|---|
| `制品事实核心` | 承载 Artifact fact 进入正式事实语境的核心语义,是版本、血缘、基线和消费回指的共同锚点。 |
| `制品版本核心` | 承载 Artifact version truth、候选修订、替代和历史版本语义,防止 current latest 或自动化再生成无声覆盖事实。 |
| `制品血缘核心` | 承载 Artifact fact / version 之间的来源、影响、替代、依赖和追溯语义,防止 runtime trace、tool result 或 event stream 补造血缘。 |
| `制品基线核心` | 承载受控 Artifact version 集合和历史冻结语义,防止 project baseline、governance decision、release note 或 archive package 替代 baseline truth。 |

`制品事实可消费表达` 不单独列为核心子域,因为它横切 fact、version、lineage 和 baseline 四个核心子域,属于消费边界和支撑上下文。这样可以避免把 read surface、SDK、console、sync、projection 或 workspace view 误写成新的 truth 本体。

### 3.3 哪些是支撑子域?

支撑子域围绕核心制品事实存在,负责输入收束、责任语境、自动化边界、消费表达和派生维护,但不是中心 truth 本体:

| 支撑子域 | 判断 |
|---|---|
| `制品输入收束上下文` | 支撑平台产出、工作输出、过程输出、治理证据和人工提交进入正式 Artifact fact 语境,但不直接把外部材料变成 truth。 |
| `责任审查语境上下文` | 支撑审查、负责、维护、责任理解和协作确认围绕同一 Artifact fact / version / lineage / baseline 展开。 |
| `自动化产出边界上下文` | 支撑 AI member、runtime、capability、tool result 和再生成结果进入受控事实 / 版本 / 血缘语境,防止运行材料直接拥有 truth。 |
| `制品消费表达上下文` | 支撑相邻仓、入口系统、归档、观测和同步稳定消费 Artifact truth,但不得复制、反推、迁移或反写 truth。 |
| `派生读侧与维护上下文` | 支撑搜索、预览、projection、报告、对账、重建、维护和归档准备等派生材料,但不得成为业务写源。 |

### 3.4 哪些只是外部上下文的本地索引 / 投影 / 引用?

以下结构只能作为本地影子层存在:

| 本地影子结构 | 边界 |
|---|---|
| `定义来源引用` | 只保存 Artifact kind、WorkProductDefinition、方法 / 标准来源的 ref 或 safe summary,不拥有 method-library truth 或标准正文。 |
| `工作与过程语境引用` | 只保存 work / process 产出、项目、工作项、activity 或过程节点语境的 ref / summary,不拥有工作或过程 truth。 |
| `治理与审计语境引用` | 只保存 governance evidence、decision、责任、AIIA / SoA 或审计语境的 ref / summary,不拥有治理裁决 truth。 |
| `外部正文与内容来源引用` | 只保存外部正文、内容来源、存储后端或内容地址的引用语境,不拥有外部正文生命周期或基础设施 truth。 |
| `运行与能力来源摘要` | 只保存自动化、runtime、capability、tool result 或 model context 的安全来源摘要,不拥有执行日志、provider body 或工具结果 truth。 |
| `消费投影 / 搜索 / 报告材料` | 只从 Artifact truth 派生,服务发现、预览、报告、看板和一致性解释,不得成为业务写源。 |
| `归档 / 观测 / 同步交接引用` | 只保存 archive、observability、SDK、console、sync 消费后的交接回指或 safe summary,不拥有 archive package、trace store、metric body 或 sync 私有副本。 |

### 3.5 它们之间的上下文映射关系是什么?

`制品事实核心` 是 Artifact truth 的进入入口;`制品版本核心` 依附于事实核心形成稳定引用语境;`制品血缘核心` 围绕事实和版本建立来源、替代、依赖和影响语义;`制品基线核心` 消费确定版本和血缘语境形成受控版本集合。

支撑子域围绕核心子域工作:输入收束把外部线索转成可审查的 Artifact 候选语境,责任审查说明谁围绕哪份事实承担责任,自动化边界阻止 runtime / tool material 直接写 truth,消费表达把四类核心 truth 安全暴露给相邻仓,派生读侧和维护只读取或重建派生材料。本地影子层只提供引用、摘要、投影和交接入口,不能反向定义核心 Artifact truth。

### 3.6 为什么这些部分不能混成一个上下文?

这些部分不能混成一个上下文,因为它们的真相角色、变化生命周期和反写风险不同:

| 不能混合的部分 | 原因 |
|---|---|
| Artifact fact 与 Artifact version | fact 是制品事实入口,version 是稳定修订 / 替代 / 历史引用语境;混合后容易用 current latest 覆盖事实。 |
| Artifact version 与 Artifact lineage | version 是版本事实,lineage 是版本之间的关系语境;混合后容易把关系变化当成版本变化。 |
| Artifact baseline 与 project / governance / archive baseline | 本仓 baseline 是 Artifact version 受控集合,不能被项目状态、治理裁决或归档包替代。 |
| Artifact kind definition 与 Artifact fact | 定义来源属于 method-library,具体 Artifact fact 属于本仓;混合后会把定义正文或类型生命周期写入 Artifact truth。 |
| runtime / tool result 与 Artifact fact / lineage | 运行材料只能作为输入线索,不能直接形成制品事实或血缘。 |
| content backend / ContentRef 与 Artifact truth owner | 内容来源或存储后端只是引用 / 基础设施语境,不是核心子域 truth owner。 |
| search / projection / report 与 Artifact truth | 派生读侧可滞后、重建和降级,不能成为正式写源。 |
| archive / observability / sync 交接与 Artifact truth | 交接和消费回指不迁移 ownership,否则会形成第二份制品真相。 |

---

## 4. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| `Metadata` 作为核心上下文 | 名称偏技术 / 数据管理,无法表达 Artifact fact truth 与派生材料边界。 | 改为 `制品事实核心`,只固定事实入口语义。 |
| `Lineage` 作为关系和查询上下文 | 旧文档把关系 truth 与查询能力混写。 | 改为 `制品血缘核心`,查询 / report / projection 进入派生读侧。 |
| `Freeze` 作为 baseline pin | 名称偏操作 / 实现,且旧 pin/hash 规则未在新版需求中固化。 | 改为 `制品基线核心`,只固定受控版本集合 truth。 |
| `Dataset Governance` | 容易把数据治理扩展和 Governance truth 混入 Artifact 核心。 | 不作为 Step 5 核心子域;后续若保留,必须作为 Artifact fact / version 特化或定义来源引用细化。 |
| `Content Adapter` / `Content` | 把外部内容后端和 adapter 提前写成子域。 | 改为 `外部正文与内容来源引用`,技术承载后置 Step 6 / Step 10。 |
| `ExecutionPlan` | 容易把 work / process / runtime plan truth 写入 Artifact。 | 不作为当前子域;若有执行路线图制品,必须先作为 Artifact fact / version 特化后续闭口。 |
| 旧上下文映射直接写 process / work / governance / archive | Step 5 不应重画外部系统上下文。 | 外部对象只在本地影子边界中出现,不进入上下文关系图。 |
| 旧统一语言直接写 Artifact / Relation / Baseline / ContentRef 等对象名 | 容易退化为对象清单或详细设计名词表。 | 本步统一语言只写架构语义边界,不写字段和值域。 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 核心子域 | Metadata / Lineage / Freeze / Dataset | 制品事实 / 版本 / 血缘 / 基线四个核心 | 对齐五个核心能力中的 truth 主线,避免技术和对象清单污染。 |
| 可消费表达 | 分散在 archive / observability / UI / query 线索中 | 作为 `制品消费表达上下文` 支撑子域 | 该能力横切四类核心 truth,不应成为第五个 truth 本体。 |
| 支撑上下文 | 旧文档缺少输入收束、审查责任、自动化边界和派生维护的统一位置 | 输入收束、责任审查、自动化边界、消费表达、派生维护 | 承接需求故事 / 功能 / 规则,防止相邻材料直接写核心。 |
| 本地影子层 | 未集中区分 ref、summary、projection、handoff | 单列定义来源、工作过程、治理审计、外部正文、运行来源、消费投影、归档观测同步引用 | 防止外部 truth 或派生材料反写核心。 |
| 技术机制 | 旧文档提前出现 content adapter、PostgreSQL、recursive CTE、hash worker | 技术和运行承载全部后置 | Step 5 只讨论语义结构。 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用 Metadata / Lineage / Freeze / Dataset / Content | 接近旧文档。 | 技术 / 对象 / 功能混层,且 Content / Dataset 边界会打穿当前需求结论。 | 不采用。 |
| 方案 B: 四个核心 truth 子域 + 支撑上下文 + 本地影子层 | 能承接 Artifact truth 主线,也能保护消费和派生边界。 | 表更长,后续概要需继续展开对象。 | 采用。 |
| 方案 C: 单一 `Artifact Truth` 核心子域 | 最简洁。 | 无法区分 fact、version、lineage、baseline 的不同生命周期和风险。 | 不采用为主结构。 |
| 方案 D: 把 Fact / Version / Lineage / Baseline / Consumption 五个能力都列为核心子域 | 与需求能力节点一一对应。 | Consumption 是横切消费表达,容易把 read surface / projection / SDK 误写成 truth 本体。 | 不采用,将 consumption 放入支撑上下文。 |

### 6.1 待确认问题的方案选择

#### DatasetArtifact 是否作为核心子域?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 作为独立核心子域 | 会把 Artifact 特化对象提升到与 fact / version / lineage / baseline 同级,并提前引入数据治理正文边界。 |
| 方案 B | 作为后续 Artifact fact / version 特化或支撑语义待确认 | 保留旧线索,不让 Dataset 扩展打乱当前核心结构。 |

推荐方案 B。

#### Content / ContentRef 是否作为支撑子域?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 作为支撑子域 | 容易把 adapter、storage backend、hash 和正文生命周期提前写入架构子域。 |
| 方案 B | 作为本地引用边界,技术承载后置 | 保护外部正文不入仓和内容后端非 truth owner 规则。 |

推荐方案 B。

#### read model / search / report 是否作为支撑子域?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 作为核心子域 | 派生消费面会被误读为业务写源。 |
| 方案 B | 作为 `派生读侧与维护上下文` 和本地投影层 | 承接外围增强,同时保持不可反写真相。 |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 子域 / 上下文划分表

| 名称 | 类型 | 作用 | 与其他部分的关系 |
|---|---|---|---|
| 制品事实核心 | 核心子域 | 承载平台产出成为正式 Artifact truth 的事实入口语义。 | 是本仓中心上下文,版本、血缘、基线和消费表达都围绕它建立。 |
| 制品版本核心 | 核心子域 | 承载 Artifact 的稳定版本、候选修订、替代和历史引用语义。 | 依附于制品事实核心,为血缘和基线提供确定版本锚点。 |
| 制品血缘核心 | 核心子域 | 承载 Artifact fact / version 之间的来源、影响、替代、依赖和追溯语义。 | 围绕事实与版本核心建立,支撑审查、影响理解和基线语境。 |
| 制品基线核心 | 核心子域 | 承载受控 Artifact version 集合、候选冻结和历史基线语义。 | 消费版本与血缘语境,不由项目、治理、发布或归档语境反向定义。 |
| 制品输入收束上下文 | 支撑子域 | 承载外部产出、人工提交、过程输出和治理证据进入可审查 Artifact 语境的语义。 | 围绕制品事实核心存在,不能绕过事实核心直接形成 version、lineage 或 baseline。 |
| 责任审查语境上下文 | 支撑子域 | 承载审查、负责、维护和协作确认围绕同一 Artifact truth 展开的语义。 | 消费事实、版本、血缘和基线核心,不拥有 identity、work 或 governance truth。 |
| 自动化产出边界上下文 | 支撑子域 | 承载 AI member、runtime、capability 和 tool result 进入受控事实 / 版本 / 血缘语境的边界语义。 | 支撑输入收束、版本和血缘核心,不拥有 runtime execution 或 capability truth。 |
| 制品消费表达上下文 | 支撑子域 | 承载相邻仓稳定引用和消费 Artifact truth 且不迁移 ownership 的语义。 | 横切所有核心子域,为下游提供安全回指,不得形成第二 truth source。 |
| 派生读侧与维护上下文 | 支撑子域 | 承载搜索、预览、projection、报告、对账、重建和归档准备的派生语义。 | 只能从核心 truth 派生,不得创建、覆盖、冻结或关闭业务 Artifact truth。 |
| 定义来源引用 | 本地索引 / 投影 / 引用 | 为 Artifact kind、WorkProductDefinition、方法或标准来源提供稳定引用。 | 服务事实核心和输入收束上下文,不拥有 method-library truth。 |
| 工作与过程语境引用 | 本地索引 / 投影 / 引用 | 为工作产出、项目、工作项、activity 和过程节点提供 ref / summary。 | 服务输入收束、责任审查和消费表达,不拥有 work / process truth。 |
| 治理与审计语境引用 | 本地索引 / 投影 / 引用 | 为治理证据、决策、AIIA / SoA、审计和责任语境提供引用或摘要。 | 服务责任审查、基线和消费表达,不拥有 governance 或 observability truth。 |
| 外部正文与内容来源引用 | 本地索引 / 投影 / 引用 | 为外部正文、内容来源、存储后端和内容地址提供引用语境。 | 服务事实和版本核心,不拥有正文生命周期或 storage backend truth。 |
| 运行与能力来源摘要 | 本地索引 / 投影 / 引用 | 为自动化、runtime、capability、tool result 和模型上下文提供安全来源摘要。 | 服务自动化产出边界,不拥有 execution log、provider body 或 tool result truth。 |
| 消费投影 / 搜索 / 报告材料 | 本地索引 / 投影 / 引用 | 为发现、预览、报表、看板和一致性解释提供可重建消费结构。 | 服务消费表达和派生维护上下文,不得成为业务写源。 |
| 归档 / 观测 / 同步交接引用 | 本地索引 / 投影 / 引用 | 为归档、观测、SDK、console、sync 消费后的交接提供回指。 | 服务消费表达和派生维护上下文,不拥有 archive package、trace store 或 sync 私有副本。 |

### 7.2 上下文关系图

```text
+----------------------+   +----------------------+   +----------------------+
| 制品事实核心          |-->| 制品版本核心          |-->| 制品血缘核心          |
+----------+-----------+   +----------+-----------+   +----------+-----------+
           |                          |                          |
           +--------------------------+--------------------------+
                                      |
                                      v
                           +----------------------+
                           | 制品基线核心          |
                           +----------+-----------+
                                      |
                                      v
+--------------------------------------------------------------------------+
|                                支撑子域层                                 |
+----------------+----------------+----------------+----------------------+
| 制品输入收束    | 责任审查语境    | 自动化产出边界  | 消费表达 / 派生维护  |
+----------------+----------------+----------------+----------------------+
                                      |
                                      v
+--------------------------------------------------------------------------+
|                         本地索引 / 投影 / 引用层                          |
| 定义来源引用 | 工作过程引用 | 治理审计引用 | 外部正文引用 | 运行能力摘要      |
| 消费投影报告 | 归档观测同步交接引用                                      |
+--------------------------------------------------------------------------+
```

该图只表达 `L1-artifact` 内部语义结构,不表达外部仓、接口、事件、数据库、容器、代码模块或运行顺序。

图示说明:

- 四个核心子域共同构成 Artifact truth 主线,但分别承载事实入口、稳定版本、正式血缘和受控版本集合四类不同生命周期。
- 支撑子域围绕核心 truth 工作,不能独立生成第二份 Artifact fact、version、lineage 或 baseline。
- 本地索引 / 投影 / 引用层只提供稳定引用、快照、派生消费和交接入口,不得反向定义核心子域。
- 派生读侧、搜索、报告、归档准备和同步交接可以滞后或重建,但不能创建、覆盖、冻结或改写 Artifact truth。

### 7.3 本地索引 / 投影 / 引用边界结论

| 本地结构 | 允许做什么 | 禁止做什么 |
|---|---|---|
| 定义来源引用 | 保存 Artifact kind、WorkProductDefinition、method / standard 的来源 ref、版本和 safe summary。 | 不保存 method-library definition body、standard body 或 definition lifecycle truth。 |
| 工作与过程语境引用 | 保存 work / process 产出、项目、工作项、activity 和过程节点语境 ref 或摘要。 | 不创建 Project、WorkItem、ProcessInstance、Activity 或过程执行 truth。 |
| 治理与审计语境引用 | 保存治理证据、决策、AIIA / SoA、责任和审计语境引用。 | 不拥有 governance decision、observability ledger、trace store 或 metric body。 |
| 外部正文与内容来源引用 | 保存外部正文位置、内容来源、安全摘要或内容引用语境。 | 不拥有外部正文生命周期、存储后端 truth、Git / S3 / DB / URL 运行事实。 |
| 运行与能力来源摘要 | 保存自动化来源、runtime、capability、tool result 或 model context 的安全摘要。 | 不保存 execution log、provider payload、tool result body、policy cache 或 plan item progress truth。 |
| 消费投影 / 搜索 / 报告材料 | 支撑发现、预览、报表、看板、对账、重建和一致性解释。 | 不作为正式 Artifact fact、version、lineage、baseline 或消费回指写源。 |
| 归档 / 观测 / 同步交接引用 | 关联 Artifact truth 的归档封存、观测解释、SDK / console / sync 消费回指。 | 不拥有 archive package body、trace store、sync private copy 或 console UI state。 |

### 7.4 统一语言词汇结论

| 术语 | 定义 | 所属上下文 |
|---|---|---|
| Artifact fact | 平台产出经正式收束后形成的可审计制品事实入口。 | 制品事实核心 |
| Artifact version | 同一 Artifact fact 的稳定修订、候选、替代、当前引用和历史引用语境。 | 制品版本核心 |
| Artifact lineage | Artifact fact / version 之间的来源、影响、替代、依赖和追溯语义。 | 制品血缘核心 |
| Artifact baseline | 受控 Artifact version 集合及其候选、冻结和历史回溯语义。 | 制品基线核心 |
| Consumable Artifact truth | 下游可稳定引用的 Artifact fact / version / lineage / baseline 回指,不迁移 ownership。 | 制品消费表达上下文 |
| Artifact intake | 外部产出、人工提交、过程输出、治理证据或自动化材料进入可审查 Artifact 语境的收束过程。 | 制品输入收束上下文 |
| Review and responsibility context | 审查、负责、维护和协作确认围绕同一 Artifact truth 展开的责任语境。 | 责任审查语境上下文 |
| Automation boundary | 自动化产出、runtime、capability 和 tool result 进入 Artifact truth 前必须经过的事实 / 版本 / 血缘边界。 | 自动化产出边界上下文 |
| Derived consumption material | 从 Artifact truth 派生的搜索、预览、投影、报告、对账或交接材料。 | 派生读侧与维护上下文 |
| Local index / projection / reference | 为稳定消费、判断、追溯和降级保留的 ref、snapshot、projection 或 handoff 结构。 | 本地索引 / 投影 / 引用层 |

### 7.5 单上下文停审记录

| 上下文 | 分类是否正确 | 职责是否清楚 | 与系统上下文是否一致 | 是否误写实现结构 |
|---|---|---|---|---|
| 制品事实核心 | pass | pass | pass | pass |
| 制品版本核心 | pass | pass | pass | pass |
| 制品血缘核心 | pass | pass | pass | pass |
| 制品基线核心 | pass | pass | pass | pass |
| 制品输入收束上下文 | pass | pass | pass | pass |
| 责任审查语境上下文 | pass | pass | pass | pass |
| 自动化产出边界上下文 | pass | pass | pass | pass |
| 制品消费表达上下文 | pass | pass | pass | pass |
| 派生读侧与维护上下文 | pass | pass | pass | pass |
| 本地索引 / 投影 / 引用层 | pass | pass | pass | pass |

### 7.6 跨上下文语义边界审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在职责重叠 | pass | 消费表达和派生维护横切核心 truth,但不拥有 fact / version / lineage / baseline。 |
| 是否存在核心子域误归类 | pass | Dataset、Content、ExecutionPlan、search、projection、archive 和 observability 未提升为核心子域。 |
| 是否存在本地投影误作真相 | pass | 消费投影 / 搜索 / 报告材料已明确不得成为业务写源。 |
| 是否存在统一语言冲突 | pass | Artifact fact、version、lineage、baseline、consumable truth 均有唯一所属上下文。 |
| 是否存在外部上下文误入内部图 | pass | work、process、governance、method-library、runtime、archive、observability 只在本地引用边界中出现。 |
| 是否存在实现结构混入 | pass | 未写 service、repository、worker、database、adapter、API、event 或 storage backend。 |

---

## 8. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §7 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 6. 限界上下文与子域划分

> 校准来源:
> - `design-calibration/01_arch_step_05_bounded_context_subdomains.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“跨上下文语义边界审计表”小节,了解本章如何从职责边界和系统上下文收敛出内部语义结构。

### 6.1 子域 / 上下文划分表

摘录 `design-calibration/01_arch_step_05_bounded_context_subdomains.md` §7.1。

### 6.2 上下文关系图

摘录 `design-calibration/01_arch_step_05_bounded_context_subdomains.md` §7.2。

### 6.3 本地索引 / 投影 / 引用边界结论

摘录 `design-calibration/01_arch_step_05_bounded_context_subdomains.md` §7.3。

### 6.4 统一语言词汇结论

摘录 `design-calibration/01_arch_step_05_bounded_context_subdomains.md` §7.4。
```

---

## 9. 待确认事项

本步不新增阻塞性待确认事项。下列事项进入后续 Step,不得在 Step 5 中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|
| Q-ART-ARCH-005-001 | DatasetArtifact 是否作为 Artifact fact / version 特化进入后续概要对象 | 后续 02 / 03 收敛;当前不作为核心子域。 |
| Q-ART-ARCH-005-002 | ContentRef、hash、tamper、content backend 和 external body 的技术承载方式 | 后续 Step 6、Step 10、配置和测试阶段收敛;当前只作为本地引用边界。 |
| Q-ART-ARCH-005-003 | ExecutionPlanArtifact 或 implementation-plan 证据是否作为 Artifact 特化存在 | 后续概要 / 详细设计与 work / process 边界共同收敛;当前不作为独立上下文。 |
| Q-ART-ARCH-005-004 | Search、projection、report、preview、sync 的正式 read surface | 后续 Step 8、Step 9 和详细设计收敛;当前只作为派生读侧与维护上下文。 |

---

## 10. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确本仓内部语义结构层次 | pass | §7.1 已区分核心、支撑和本地影子层。 |
| 是否区分核心子域、支撑子域和本地索引 / 投影 / 引用 | pass | 四个核心子域、五个支撑子域和七类本地影子结构已分层。 |
| 是否通过关系图解释这些部分如何共同构成整体 | pass | §7.2 已给出上下文关系图和说明。 |
| 每个上下文是否完成停审 | pass | §7.5 已逐项通过分类、职责、系统上下文一致性和实现混入检查。 |
| 跨上下文语义边界审计是否存在 unresolved 冲突 | pass | §7.6 未发现职责重叠、误归类、投影反写真相或术语冲突。 |
| 是否把对象清单、代码模块或数据实现写成子域结构 | pass | 未写字段、表、repository、handler、adapter、API、event、数据库或部署。 |
| 是否允许进入 Step 6 | pass | 当前限界上下文与子域划分足以支撑容器 / 部署架构讨论。 |

当前 Step 5 `限界上下文与子域划分` 已完成。下一步必须等待用户确认后进入 Step 6 `容器 / 部署架构`,并只创建 / 改写 `design-calibration/01_arch_step_06_container_deployment.md`。
